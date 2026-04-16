import React, { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GraphSnapshot } from "@/types/algorithm";
import { GraphInput } from "@/algorithms/greedy/dijkstra";

interface GraphVisualizerProps {
  snapshot: GraphSnapshot;
  graphInput: GraphInput;
}

/** Force-directed-ish circular layout with slight jitter for visual interest */
function getNodePositions(nodes: string[], width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.33;
  const positions: Record<string, { x: number; y: number }> = {};
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    positions[node] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
  return positions;
}

/**
 * Premium graph visualizer with glowing edges, animated nodes,
 * hover interactions, and smooth distance label transitions.
 */
export const GraphVisualizer = memo(function GraphVisualizer({ snapshot, graphInput }: GraphVisualizerProps) {
  const { currentNode, distances, visited, relaxingEdge } = snapshot;
  const { nodes, edges } = graphInput;
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const W = 560;
  const H = 380;
  const pos = useMemo(() => getNodePositions(nodes, W, H), [nodes]);

  const isEdgeRelaxing = (from: string, to: string) =>
    relaxingEdge &&
    ((relaxingEdge[0] === from && relaxingEdge[1] === to) ||
      (relaxingEdge[0] === to && relaxingEdge[1] === from));

  const isEdgeVisited = (from: string, to: string) =>
    visited.includes(from) && visited.includes(to);

  return (
    <div className="flex flex-col h-full relative">
      {/* Ambient glow backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {nodes.map((node) => {
          const p = pos[node];
          if (!p) return null;
          const isActive = currentNode === node;
          const isVis = visited.includes(node);
          if (!isActive && !isVis) return null;
          return (
            <motion.div
              key={`glow-${node}`}
              className="absolute rounded-full blur-3xl"
              style={{
                left: `${(p.x / W) * 100}%`,
                top: `${(p.y / H) * 100}%`,
                width: isActive ? 80 : 50,
                height: isActive ? 80 : 50,
                transform: "translate(-50%, -50%)",
                background: isActive
                  ? "hsl(264 72% 58% / 0.15)"
                  : "hsl(168 76% 46% / 0.08)",
              }}
              animate={{ opacity: isActive ? 1 : 0.6 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="flex-1 w-full relative z-10">
        <defs>
          {/* Glow filter for relaxing edges */}
          <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node shadow */}
          <filter id="node-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="black" floodOpacity="0.4" />
          </filter>

          {/* Animated gradient for relaxing edge */}
          <linearGradient id="relax-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(38 92% 50%)" />
            <stop offset="50%" stopColor="hsl(30 95% 60%)" />
            <stop offset="100%" stopColor="hsl(38 92% 50%)" />
          </linearGradient>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const p1 = pos[edge.from];
          const p2 = pos[edge.to];
          if (!p1 || !p2) return null;
          const relaxing = isEdgeRelaxing(edge.from, edge.to);
          const edgeVisited = isEdgeVisited(edge.from, edge.to);
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          const isHoveredEdge =
            hoveredNode && (edge.from === hoveredNode || edge.to === hoveredNode);

          return (
            <g key={i}>
              {/* Edge line */}
              <motion.line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={
                  relaxing
                    ? "url(#relax-gradient)"
                    : edgeVisited
                      ? "hsl(168 76% 46% / 0.35)"
                      : isHoveredEdge
                        ? "hsl(215 14% 40%)"
                        : "hsl(228 16% 18%)"
                }
                strokeWidth={relaxing ? 3.5 : isHoveredEdge ? 2 : 1.5}
                strokeLinecap="round"
                filter={relaxing ? "url(#edge-glow)" : undefined}
                animate={{
                  strokeWidth: relaxing ? 3.5 : isHoveredEdge ? 2 : 1.5,
                  opacity: relaxing ? 1 : isHoveredEdge ? 0.9 : 0.5,
                }}
                transition={{ duration: 0.35 }}
              />

              {/* Weight label — only show if edge has a weight */}
              {edge.weight != null && (
                <motion.g
                  animate={{
                    scale: relaxing ? 1.15 : 1,
                    opacity: relaxing || isHoveredEdge ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <rect
                    x={midX - 10}
                    y={midY - 18}
                    width={20}
                    height={16}
                    rx={4}
                    fill={
                      relaxing
                        ? "hsl(38 92% 50% / 0.15)"
                        : "hsl(228 24% 8% / 0.8)"
                    }
                    stroke={relaxing ? "hsl(38 92% 50% / 0.3)" : "transparent"}
                    strokeWidth={1}
                  />
                  <text
                    x={midX}
                    y={midY - 8}
                    textAnchor="middle"
                    className="text-[11px] font-mono font-bold"
                    fill={
                      relaxing
                        ? "hsl(38 92% 70%)"
                        : "hsl(215 14% 75%)"
                    }
                  >
                    {edge.weight}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const p = pos[node];
          if (!p) return null;
          const isVisited = visited.includes(node);
          const isCurrent = currentNode === node;
          const dist = distances[node];
          const isHovered = hoveredNode === node;
          const colorIdx = snapshot.nodeColors?.[node] ?? 0;

          // Color palette for graph coloring
          const colors = [
            "hsl(228 16% 14%)", // Default
            "hsl(0 72% 51%)",   // Red
            "hsl(142 71% 45%)", // Green
            "hsl(217 91% 60%)", // Blue
            "hsl(38 92% 50%)",  // Yellow
            "hsl(280 67% 60%)", // Purple
          ];

          let fillColor = colorIdx > 0 ? colors[colorIdx] : "hsl(228 16% 14%)";
          let strokeColor = colorIdx > 0 ? colors[colorIdx] : "hsl(228 16% 22%)";
          let textColor = (isCurrent || colorIdx > 0 || isVisited) ? "hsl(210 20% 96%)" : "hsl(215 14% 48%)";

          if (isCurrent) {
            fillColor = "hsl(264 72% 52%)";
            strokeColor = "hsl(264 72% 65%)";
            textColor = "hsl(210 20% 96%)";
          } else if (isVisited) {
            fillColor = "hsl(168 76% 32%)";
            strokeColor = "hsl(168 76% 46%)";
            textColor = "hsl(210 20% 96%)";
          }

          const nodeRadius = Number(isCurrent ? 26 : isHovered ? 24 : 22) || 22;

          return (
            <g
              key={node}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Pulse ring for current node */}
              {isCurrent && (
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={32}
                  fill="none"
                  stroke="hsl(264 72% 58%)"
                  strokeWidth={1.5}
                  initial={{ r: 22, opacity: 0.8 }}
                  animate={{ r: 36, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {/* Main node circle */}
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={nodeRadius}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isHovered ? 2.5 : 2}
                filter="url(#node-shadow)"
                animate={{
                  fill: fillColor,
                  stroke: strokeColor,
                  r: nodeRadius,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Node label */}
              <text
                x={p.x}
                y={p.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-bold pointer-events-none"
                fill={textColor}
              >
                {node}
              </text>

              {/* Distance / Color badge — only show if there is data */}
              {(dist !== undefined || colorIdx > 0) && (
                <motion.g
                  animate={{ y: 0, opacity: 1 }}
                  initial={{ y: 4, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <rect
                    x={p.x - 14}
                    y={p.y + 30}
                    width={28}
                    height={18}
                    rx={6}
                    fill={
                      isCurrent
                        ? "hsl(264 72% 58% / 0.2)"
                        : isVisited
                          ? "hsl(168 76% 46% / 0.15)"
                          : "hsl(228 24% 8% / 0.6)"
                    }
                    stroke={
                      isCurrent
                        ? "hsl(264 72% 58% / 0.3)"
                        : isVisited
                          ? "hsl(168 76% 46% / 0.2)"
                          : "hsl(228 16% 18%)"
                    }
                    strokeWidth={1}
                  />
                  <text
                    x={p.x}
                    y={p.y + 41}
                    textAnchor="middle"
                    className="text-[11px] font-mono font-bold pointer-events-none"
                    fill={
                      isCurrent
                        ? "hsl(264 72% 85%)"
                        : isVisited
                          ? "hsl(168 76% 80%)"
                          : "hsl(215 14% 75%)"
                    }
                  >
                    {colorIdx > 0 ? `C${colorIdx}` : dist === Infinity ? "∞" : dist}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
});
