import React, { useMemo, useRef, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GraphSnapshot } from "@/types/algorithm";
import { GraphInput } from "@/algorithms/greedy/dijkstra";
import * as THREE from "three";

interface Graph3DProps {
  snapshot: GraphSnapshot;
  graphInput: GraphInput;
}

/** Compute 3D positions in a circular layout on the XZ plane */
function get3DPositions(nodes: string[]): Record<string, [number, number, number]> {
  const positions: Record<string, [number, number, number]> = {};
  const n = nodes.length;
  const r = 2.2;
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    positions[node] = [
      r * Math.cos(angle),
      0,
      r * Math.sin(angle),
    ];
  });
  return positions;
}

/**
 * A single 3D graph node rendered as a sphere.
 * Glows when visited or current, with smooth color interpolation.
 */
function Node3D({
  position,
  label,
  isCurrent,
  isVisited,
}: {
  position: [number, number, number];
  label: string;
  isCurrent: boolean;
  isVisited: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  const targetColor = useMemo(() => {
    if (isCurrent) return new THREE.Color(0xfacc15);  // vibrant yellow
    if (isVisited) return new THREE.Color(0x22c55e);   // vibrant green
    return new THREE.Color(0x3b82f6);                  // vibrant blue
  }, [isCurrent, isVisited]);

  const targetEmissive = useMemo(() => {
    if (isCurrent) return new THREE.Color(0x854d0e);
    if (isVisited) return new THREE.Color(0x166534);
    return new THREE.Color(0x1d4ed8);
  }, [isCurrent, isVisited]);

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return;
    matRef.current.color.lerp(targetColor, delta * 5);
    matRef.current.emissive.lerp(targetEmissive, delta * 5);
    matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      matRef.current.emissiveIntensity,
      isCurrent ? 1.0 : isVisited ? 0.4 : 0.1,
      delta * 5
    );

    if (isCurrent || isVisited) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        ref={matRef}
        color={targetColor}
        emissive={targetEmissive}
        emissiveIntensity={0.1}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

/**
 * A 3D edge between two nodes using a thin cylinder.
 * Glows amber when the edge is being relaxed.
 */
function Edge3D({
  from,
  to,
  isRelaxing,
}: {
  from: [number, number, number];
  to: [number, number, number];
  isRelaxing: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  const direction = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const dir = end.clone().sub(start);
    const length = dir.length();
    dir.normalize();
    return { mid, dir, length };
  }, [from, to]);

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.dir);
    return q;
  }, [direction.dir]);

  const color = isRelaxing ? 0xef4444 : 0x475569;
  const emissive = isRelaxing ? 0x991b1b : 0x0f172a;

  return (
    <mesh
      ref={ref}
      position={[direction.mid.x, direction.mid.y, direction.mid.z]}
      quaternion={quaternion}
    >
      <cylinderGeometry args={[isRelaxing ? 0.05 : 0.025, isRelaxing ? 0.05 : 0.025, direction.length, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={isRelaxing ? 1.2 : 0.1}
        roughness={0.3}
        metalness={0.5}
        transparent
        opacity={isRelaxing ? 1 : 0.6}
      />
    </mesh>
  );
}

export const Graph3DVisualizer = memo(function Graph3DVisualizer({ snapshot, graphInput }: Graph3DProps) {
  const { currentNode, distances, visited, relaxingEdge } = snapshot;
  const { nodes, edges } = graphInput;
  const positions = useMemo(() => get3DPositions(nodes), [nodes]);

  const isRelaxing = (from: string, to: string) =>
    relaxingEdge &&
    ((relaxingEdge[0] === from && relaxingEdge[1] === to) ||
      (relaxingEdge[0] === to && relaxingEdge[1] === from));

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl" style={{ background: "#020617" }}>
      <Canvas
        shadows
        camera={{ position: [0, 6, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ReinhardToneMapping }}
      >
        <color attach="background" args={["#020617"]} />
        
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, 5, -10]} intensity={0.8} color="#818cf8" />
        <directionalLight position={[0, 10, 5]} intensity={0.6} castShadow />

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={4}
          maxDistance={15}
        />


        {/* Edges rendered as thin cylinders */}
        {edges.map((edge, i) => {
          const p1 = positions[edge.from];
          const p2 = positions[edge.to];
          if (!p1 || !p2) return null;
          return (
            <Edge3D
              key={i}
              from={p1}
              to={p2}
              isRelaxing={!!isRelaxing(edge.from, edge.to)}
            />
          );
        })}

        {/* Nodes rendered as spheres */}
        {nodes.map((node) => {
          const p = positions[node];
          if (!p) return null;
          return (
            <Node3D
              key={node}
              position={p}
              label={node}
              isCurrent={currentNode === node}
              isVisited={visited.includes(node)}
            />
          );
        })}
      </Canvas>
    </div>
  );
});
