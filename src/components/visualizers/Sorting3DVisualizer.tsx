import React, { useMemo, useRef, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { SortingSnapshot } from "@/types/algorithm";
import * as THREE from "three";

interface Sorting3DProps {
  snapshot: SortingSnapshot;
}

/**
 * Single 3D bar — uses a simple boxGeometry for maximum compatibility.
 * Height, color, and emissive glow are smoothly interpolated each frame.
 */
function Bar3D({
  value,
  maxVal,
  index,
  total,
  isComparing,
  isSwapped,
  isSorted,
}: {
  value: number;
  maxVal: number;
  index: number;
  total: number;
  isComparing: boolean;
  isSwapped: boolean;
  isSorted: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  const targetHeight = (value / maxVal) * 3.5;
  const spacing = 0.18;
  const barWidth = Math.min(0.55, (7 - spacing * total) / total);
  const x = (index - total / 2) * (barWidth + spacing) + barWidth / 2;

  const targetColor = useMemo(() => {
    if (isSorted) return new THREE.Color(0x22c55e);    // vibrant green
    if (isSwapped) return new THREE.Color(0xef4444);   // vibrant red
    if (isComparing) return new THREE.Color(0xfacc15); // vibrant yellow
    return new THREE.Color(0x3b82f6);                  // vibrant blue
  }, [isSorted, isSwapped, isComparing]);

  const targetEmissive = useMemo(() => {
    if (isSorted) return new THREE.Color(0x166534);
    if (isSwapped) return new THREE.Color(0x991b1b);
    if (isComparing) return new THREE.Color(0x854d0e);
    return new THREE.Color(0x1d4ed8);
  }, [isSorted, isSwapped, isComparing]);

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return;
    const speed = 6;

    // Smooth height
    const curY = meshRef.current.scale.y;
    const newY = THREE.MathUtils.lerp(curY, targetHeight, delta * speed);
    meshRef.current.scale.y = newY;
    meshRef.current.position.y = newY / 2;

    // Smooth color
    matRef.current.color.lerp(targetColor, delta * speed);
    matRef.current.emissive.lerp(targetEmissive, delta * speed);
    matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      matRef.current.emissiveIntensity,
      isComparing || isSwapped ? 0.8 : 0.2,
      delta * speed
    );
  });

  return (
    <mesh ref={meshRef} position={[x, targetHeight / 2, 0]} scale={[barWidth, targetHeight, barWidth]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={matRef}
        color={targetColor}
        emissive={targetEmissive}
        emissiveIntensity={0.2}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

/** Simple floor grid */
function Floor() {
  return (
    <group position={[0, -0.05, 0]}>
      <gridHelper args={[20, 20, "#1e293b", "#0f172a"]} rotation={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#020617" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export const Sorting3DVisualizer = memo(function Sorting3DVisualizer({ snapshot }: Sorting3DProps) {
  const { array, comparing, swapped, sorted } = snapshot;
  const maxVal = useMemo(() => Math.max(...array, 1), [array]);

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl" style={{ background: "#020617" }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ReinhardToneMapping }}
      >
        <color attach="background" args={["#020617"]} />
        
        {/* Superior Lighting setup */}
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <pointLight position={[-10, 5, -10]} intensity={0.8} color="#3b82f6" />
        <directionalLight
          position={[0, 10, 5]}
          intensity={1.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Camera controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={20}
        />

        <Floor />

        {/* Bars */}
        {array.map((value, index) => (
          <Bar3D
            key={index}
            value={value}
            maxVal={maxVal}
            index={index}
            total={array.length}
            isComparing={comparing.includes(index)}
            isSwapped={swapped.includes(index)}
            isSorted={sorted.includes(index)}
          />
        ))}
      </Canvas>
    </div>
  );
});

