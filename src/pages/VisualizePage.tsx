import React, { useState, useMemo, useRef, lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ALGORITHMS } from "@/algorithms";
import { generateRadixSortSnapshots } from "@/algorithms/sorting/radixSort";
import { generateShellSortSnapshots } from "@/algorithms/sorting/shellSort";
import { generateCountingSortSnapshots } from "@/algorithms/sorting/countingSort";
import { generateBucketSortSnapshots } from "@/algorithms/sorting/bucketSort";
import { generateDijkstraSnapshots, GraphInput } from "@/algorithms/greedy/dijkstra";
import { generatePrimSnapshots } from "@/algorithms/greedy/prim";
import { generateBellmanFordSnapshots } from "@/algorithms/greedy/bellmanFord";
import { generateKnapsackSnapshots, KnapsackInput } from "@/algorithms/dp/knapsack";
import { generateCoinChangeSnapshots } from "@/algorithms/dp/coinChange";
import { generateLCSSnapshots } from "@/algorithms/dp/lcs";
import { generateWordBreakSnapshots } from "@/algorithms/dp/wordBreak";
import { generateMCMSnapshots } from "@/algorithms/dp/mcm";
import { generateRodCuttingSnapshots } from "@/algorithms/dp/rodCutting";
import { generateFloydWarshallSnapshots } from "@/algorithms/dp/floydWarshall";
import { generateWarshallSnapshots } from "@/algorithms/dp/warshall";
import { generateResourceAllocationSnapshots } from "@/algorithms/dp/resourceAllocation";
import { generateNQueensSnapshots } from "@/algorithms/n-queens";
import { generateSubsetSumSnapshots } from "@/algorithms/dp/subsetSum";
import { generateGraphColoringSnapshots } from "@/algorithms/graph-coloring";
import { useAlgorithmVisualizer } from "@/hooks/useAlgorithmVisualizer";
import { useGameState, generateSortingQuestion, generateGraphQuestion, generateDPQuestion } from "@/hooks/useGameState";
import { SortingSnapshot, GraphSnapshot, DPSnapshot } from "@/types/algorithm";
import { PlaybackControls } from "@/components/shared/PlaybackControls";
import { Badge } from "@/components/ui/badge";

const DefaultInputDisplay = ({ input, id }: { input: any; id: string }) => {
  if (Array.isArray(input)) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {input.map((v, i) => (
          <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold">
            {v}
          </span>
        ))}
      </div>
    );
  }

  if (typeof input === "object" && input !== null) {
    return (
      <div className="flex flex-col gap-2.5">
        {Object.entries(input).map(([key, value]: [string, any]) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground/50">{key}</span>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(value) ? (
                value.map((v: any, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.08] text-muted-foreground text-[10px] font-mono">
                    {Array.isArray(v) ? `[${v.join(", ")}]` : (typeof v === 'object' ? `${v.from}→${v.to}${v.weight ? `:${v.weight}` : ''}` : String(v))}
                  </span>
                ))
              ) : (
                <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 text-[10px] font-mono font-bold">
                  {String(value)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className="text-xs font-mono">{String(input)}</span>;
};
import { CodePanel } from "@/components/shared/CodePanel";
import { GameChallenge } from "@/components/shared/GameChallenge";
import { SortingVisualizer } from "@/components/visualizers/SortingVisualizer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";
import { DPVisualizer } from "@/components/visualizers/DPVisualizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, Pencil, RefreshCcw, Box, Monitor, Info, Clock } from "lucide-react";
import confetti from "canvas-confetti";

const Sorting3DVisualizer = lazy(() =>
  import("@/components/visualizers/Sorting3DVisualizer").then((m) => ({ default: m.Sorting3DVisualizer }))
);
const Graph3DVisualizer = lazy(() =>
  import("@/components/visualizers/Graph3DVisualizer").then((m) => ({ default: m.Graph3DVisualizer }))
);

function ThreeDLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px] bg-card/10 rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <RefreshCcw className="h-6 w-6 text-primary/60 animate-spin" />
        <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Initializing 3D Engine...
        </span>
      </div>
    </div>
  );
}

export default function VisualizePage() {
  const { algoId } = useParams<{ algoId: string }>();
  const meta = useMemo(() => (algoId ? ALGORITHMS[algoId] : null), [algoId]);
  
  const [customInput, setCustomInput] = useState("");
  const [gameMode, setGameMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("game") === "1";
  });
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  
  const { state: gameState, answerQuestion, completeAlgorithm } = useGameState();
  const completedRef = useRef(false);

  const snapshots = useMemo(() => {
    if (!meta) return [];
    const input = customInput.trim() || null;
    try {
      switch (meta.id) {
        case "radix-sort":
        case "shell-sort":
        case "counting-sort":
        case "bucket-sort": {
          const arr = input
            ? input.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
            : (meta.defaultInput as number[]);
          if (meta.id === "radix-sort") return generateRadixSortSnapshots(arr);
          if (meta.id === "shell-sort") return generateShellSortSnapshots(arr);
          if (meta.id === "counting-sort") return generateCountingSortSnapshots(arr);
          return generateBucketSortSnapshots(arr);
        }
        case "dijkstra":
        case "prim":
        case "bellman-ford":
        case "graph-coloring": {
          if (!input) {
            const g = meta.defaultInput as GraphInput;
            if (meta.id === "dijkstra") return generateDijkstraSnapshots(g);
            if (meta.id === "prim") return generatePrimSnapshots(g);
            if (meta.id === "bellman-ford") return generateBellmanFordSnapshots(g);
            return generateGraphColoringSnapshots(g as any);
          }

          try {
            const [nStr, eStr, sNode] = input.split(";");
            const nodes = nStr.split(",").map(n => n.trim());
            const edges = eStr.split(",").map(e => {
              const [conn, w] = e.split(":");
              const [from, to] = conn.split("-").map(c => c.trim());
              return { from, to, weight: w ? parseInt(w.trim()) : undefined };
            });
            const source = sNode ? sNode.trim() : nodes[0];
            const g = { nodes, edges, source };
            if (meta.id === "dijkstra") return generateDijkstraSnapshots(g);
            if (meta.id === "prim") return generatePrimSnapshots(g);
            if (meta.id === "bellman-ford") return generateBellmanFordSnapshots(g);
            return generateGraphColoringSnapshots(g as any);
          } catch (e) {
            return generateDijkstraSnapshots(meta.defaultInput as GraphInput);
          }
        }
        case "knapsack":
        case "coin-change":
        case "lcs":
        case "word-break":
        case "mcm":
        case "rod-cutting":
        case "floyd-warshall":
        case "warshall":
        case "resource-allocation":
        case "n-queens":
        case "subset-sum": {
          if (!input) {
             const def = meta.defaultInput;
             if (meta.id === "knapsack") return generateKnapsackSnapshots(def as KnapsackInput);
             if (meta.id === "coin-change") return generateCoinChangeSnapshots(def as any);
             if (meta.id === "lcs") return generateLCSSnapshots(def as any);
             if (meta.id === "word-break") return generateWordBreakSnapshots(def as any);
             if (meta.id === "mcm") return generateMCMSnapshots(def as any);
             if (meta.id === "rod-cutting") return generateRodCuttingSnapshots(def as any);
             if (meta.id === "floyd-warshall") return generateFloydWarshallSnapshots(def as any);
             if (meta.id === "warshall") return generateWarshallSnapshots(def as any);
             if (meta.id === "n-queens") return generateNQueensSnapshots(def as any);
             if (meta.id === "subset-sum") return generateSubsetSumSnapshots(def as any);
             return generateResourceAllocationSnapshots(def as any);
          }

          if (input.trim().startsWith("[[")) {
            try {
              const matrix = JSON.parse(input);
              if (meta.id === "floyd-warshall") return generateFloydWarshallSnapshots({ V: matrix.length, matrix });
              if (meta.id === "warshall") return generateWarshallSnapshots({ V: matrix.length, matrix });
            } catch (e) {
              console.error("JSON Matrix parsing failed", e);
            }
          }

          try {
            if (meta.id === "n-queens") {
              return generateNQueensSnapshots({ n: parseInt(input.trim()) });
            }
            if (meta.id === "subset-sum") {
              const [sum, setStr] = input.split(";");
              const set = setStr.split(",").map(s => parseInt(s.trim()));
              return generateSubsetSumSnapshots({ sum: parseInt(sum.trim()), set });
            }
            // ... existing DP parsing
            if (meta.id === "coin-change") {
              const parts = input.split(";");
              const amount = parseInt(parts[0].trim());
              const coins = parts[1].split(",").map(s => parseInt(s.trim()));
              return generateCoinChangeSnapshots({ amount, coins });
            }
            if (meta.id === "lcs") {
              const [s1, s2] = input.split(",").map(s => s.trim());
              return generateLCSSnapshots({ s1, s2 });
            }
            if (meta.id === "word-break") {
              const [s, words] = input.split(";");
              const wordDict = words.split(",").map(w => w.trim());
              return generateWordBreakSnapshots({ s: s.trim(), wordDict });
            }
            if (meta.id === "rod-cutting") {
              const [n, priceStr] = input.split(";");
              const prices = priceStr.split(",").map(p => parseInt(p.trim()));
              return generateRodCuttingSnapshots({ n: parseInt(n.trim()), prices });
            }
            if (meta.id === "mcm") {
               const p = input.split(",").map(v => parseInt(v.trim()));
               return generateMCMSnapshots({ p });
            }
            if (meta.id === "knapsack") {
               const [W, wStr, vStr] = input.split(";");
               const weights = wStr.split(",").map(w => parseInt(w.trim()));
               const values = vStr.split(",").map(v => parseInt(v.trim()));
               return generateKnapsackSnapshots({ capacity: parseInt(W.trim()), weights, values });
            }
            if (meta.id === "floyd-warshall" || meta.id === "warshall") {
               const parts = input.split(";");
               const V = parseInt(parts[0].trim());
               const matrix = parts.slice(1).map(row => 
                  row.split(",").map(val => val.trim().toUpperCase() === "INF" ? Infinity : parseInt(val))
               );
               if (meta.id === "floyd-warshall") return generateFloydWarshallSnapshots({ V, matrix });
               return generateWarshallSnapshots({ V, matrix });
            }
          } catch(e) {
             console.error("Custom input parsing failed", e);
          }

          return generateLCSSnapshots(meta.defaultInput as any);
        }
        default: return [];
      }
    } catch (e) {
      console.error("Snapshot generation error:", e);
      return [];
    }
  }, [meta, customInput]);

  const activeInput = useMemo(() => {
    if (!customInput) return meta.defaultInput;
    const input = customInput;
    try {
      if (meta.category === "sorting") {
        return input.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
      }
      if (meta.id === "coin-change") {
        const parts = input.split(";");
        return { amount: parseInt(parts[0].trim()), coins: parts[1].split(",").map(s => parseInt(s.trim())) };
      }
      if (meta.id === "lcs") {
        const [s1, s2] = input.split(",").map(s => s.trim());
        return { s1, s2 };
      }
      if (meta.id === "word-break") {
        const [s, words] = input.split(";");
        const wordDict = words.split(",").map(w => w.trim());
        return { s: s.trim(), wordDict };
      }
      if (meta.id === "rod-cutting") {
        const [n, priceStr] = input.split(";");
        return { n: parseInt(n.trim()), prices: priceStr.split(",").map(p => parseInt(p.trim())) };
      }
      if (meta.id === "mcm") {
        return { p: input.split(",").map(v => parseInt(v.trim())) };
      }
      if (meta.id === "knapsack") {
        const [W, wStr, vStr] = input.split(";");
        return { capacity: parseInt(W.trim()), weights: wStr.split(",").map(w => parseInt(w.trim())), values: vStr.split(",").map(v => parseInt(v.trim())) };
      }
      if (meta.id === "n-queens") return { n: parseInt(input.trim()) };
      if (meta.id === "subset-sum") {
        const [sum, setStr] = input.split(";");
        return { sum: parseInt(sum.trim()), set: setStr.split(",").map(s => parseInt(s.trim())) };
      }
      if (meta.category === "greedy" || meta.id === "graph-coloring") {
        const [nStr, eStr, sNode] = input.split(";");
        const nodes = nStr.split(",").map(n => n.trim());
        const edges = eStr.split(",").map(e => {
          const [conn, w] = e.split(":");
          const [from, to] = conn.split("-").map(c => c.trim());
          return { from, to, weight: w ? parseInt(w.trim()) : undefined };
        });
        return { nodes, edges, source: sNode ? sNode.trim() : nodes[0] };
      }
    } catch(e) {}
    return meta.defaultInput;
  }, [meta, customInput]);

  const vis = useAlgorithmVisualizer({ snapshots });

  if (vis.isComplete && vis.currentStep === vis.totalSteps - 1 && meta && vis.totalSteps > 1 && !completedRef.current) {
    completedRef.current = true;
    completeAlgorithm(meta.id);
    setTimeout(() => {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 }, colors: ["#2dd4bf", "#818cf8", "#f59e0b"] });
    }, 100);
  }
  if (!vis.isComplete) completedRef.current = false;

  if (!meta) return (
    <div className="flex items-center justify-center h-full p-12 text-muted-foreground/60">
      <Info className="h-8 w-8 mr-3" /> Algorithm not found
    </div>
  );

  const snapshot = vis.currentSnapshot;
  const currentLine = snapshot?.codeLine ?? 0;
  const message = snapshot?.message ?? "";

  const gameQuestion = useMemo(() => {
    if (!gameMode || !snapshot) return null;
    if (meta?.category === "sorting") return generateSortingQuestion((snapshot as any).array, (snapshot as any).comparing, vis.currentStep);
    if (meta?.category === "greedy" || meta?.category === "backtracking") {
        if (meta?.id === "graph-coloring") return generateGraphQuestion((snapshot as any).currentNode, (snapshot as any).distances, vis.currentStep);
        return generateGraphQuestion((snapshot as any).currentNode, (snapshot as any).distances, vis.currentStep);
    }
    if (meta?.category === "dp") return generateDPQuestion((snapshot as any).i, (snapshot as any).w, (meta.defaultInput as any).weights?.[(snapshot as any).i - 1] ?? 0, vis.currentStep);
    return null;
  }, [gameMode, snapshot, meta, vis.currentStep]);

  // Pause visualization when a challenge question is active to prevent skipping
  useEffect(() => {
    if (gameMode && gameQuestion && vis.isPlaying) {
      vis.pause();
    }
  }, [gameMode, gameQuestion, vis.isPlaying, vis.pause]);

  const has3D = meta.category === "sorting" || meta.category === "greedy";

  return (
    <div className="flex flex-col lg:flex-row h-full gap-5 p-5 max-w-7xl mx-auto">
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="glass-panel px-5 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1.5">
              Algo-Vision — Interactive Algorithm Learning Platform by Sarthak Sharma
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-0.5">{meta.name}</h1>
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-muted-foreground/80">
              <span>{meta.category}</span>
              <span className="opacity-50">•</span>
              <span className="font-mono text-primary/80">{meta.timeComplexity}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {has3D && (
              <div className="flex p-1 bg-secondary rounded-lg border border-border/40">
                <Button 
                  variant={viewMode === "2d" ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setViewMode("2d")}
                  className="h-8 px-3 text-[12px] font-bold rounded-md"
                >
                  <Monitor className="h-4 w-4 mr-1.5" /> 2D
                </Button>
                <Button 
                  variant={viewMode === "3d" ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setViewMode("3d")}
                  className="h-8 px-3 text-[12px] font-bold rounded-md"
                >
                  <Box className="h-4 w-4 mr-1.5" /> 3D
                </Button>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => vis.reset()} className="h-9 px-3 text-xs font-semibold">
              <RefreshCcw className="h-3.5 w-3.5 mr-2" /> Reset
            </Button>
            <Button variant={gameMode ? "default" : "outline"} size="sm" onClick={() => setGameMode(!gameMode)} className="h-9 px-3 text-xs font-semibold">
              <Gamepad2 className="h-3.5 w-3.5 mr-2" /> {gameMode ? "Exit" : "Challenge"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Default Values - Left Side (40%) */}
          <div className="md:col-span-5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 flex items-center gap-2">
                <Box className="h-3 w-3" /> System Default
              </span>
              <Badge variant="outline" className="h-4 text-[9px] px-1.5 font-bold border-muted-foreground/20 text-muted-foreground/60 uppercase">
                Read Only
              </Badge>
            </div>
            <div className="glass-panel p-4 bg-white/[0.01] border-white/[0.05] h-full flex flex-col justify-center min-h-[80px]">
              <DefaultInputDisplay input={meta.defaultInput} id={meta.id} />
            </div>
          </div>

          {/* Custom Input - Right Side (60%) */}
          <div className="md:col-span-7 flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                <Pencil className="h-3 w-3" /> Configuration Console
              </span>
              <div className="flex items-center gap-2">
                {customInput ? (
                  <button 
                    onClick={() => setCustomInput("")}
                    className="group text-[9px] font-bold uppercase tracking-widest text-primary hover:text-primary transition-all flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 cursor-pointer"
                  >
                    <RefreshCcw className="h-2.5 w-2.5 group-hover:rotate-180 transition-transform duration-500" /> Reset to Factory
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">
                    Live Defaults Active
                  </div>
                )}
              </div>
            </div>
            
            <div className={`glass-panel transition-all duration-300 relative group border ${
              customInput 
                ? "bg-accent/[0.03] border-accent/40 shadow-[0_0_20px_-10px_rgba(45,212,191,0.2)]" 
                : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"
            }`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${customInput ? "bg-accent" : "bg-primary/40"}`} />
                <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest">Input</span>
              </div>
              <Input
                placeholder={
                  meta.category === "sorting" ? "Array: 5, 2, 8, 1..." :
                  meta.category === "greedy" ? "Nodes; Edges; Start (e.g. A,B,C; A-B:5, B-C:10; A)" :
                  meta.id === "coin-change" ? "Amount; Coins (e.g. 11; 1, 2, 5)" :
                  meta.id === "lcs" ? "Str1, Str2 (e.g. ABCBDAB, BDCABA)" :
                  meta.id === "word-break" ? "String; Dictionary (e.g. applepen; apple, pen)" :
                  meta.id === "rod-cutting" ? "Length; Prices (e.g. 4; 1, 5, 8, 9)" :
                  meta.id === "mcm" ? "Dimensions (e.g. 40, 20, 30, 10, 30)" :
                  meta.id === "knapsack" ? "Capacity; Weights; Values (e.g. 10; 1,2,3; 10,20,30)" :
                  meta.id === "floyd-warshall" ? "V; Row1; Row2... (e.g. 3; 0,5,INF; 2,0,1; INF,3,0)" :
                  meta.id === "n-queens" ? "Board Size (e.g. 8)" :
                  meta.id === "subset-sum" ? "Sum; Full Set (e.g. 9; 3, 34, 4, 12, 5, 2)" :
                  meta.id === "graph-coloring" ? "Nodes; Connection; M (e.g. A,B,C,D; A-B,A-C; 3)" :
                  "Enter values here..."
                }
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="h-12 text-[14px] bg-transparent border-0 focus-visible:ring-0 pl-16 pr-4 placeholder:text-muted-foreground/20 font-mono font-medium"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">Auto-Save Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden relative border-border/40 p-4">
          <AnimatePresence mode="wait">
            {viewMode === "2d" ? (
              <motion.div key="2d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                {snapshot && meta.category === "sorting" && <SortingVisualizer snapshot={snapshot as SortingSnapshot} />}
                {snapshot && (meta.category === "greedy" || meta.id === "graph-coloring") && <GraphVisualizer snapshot={snapshot as GraphSnapshot} graphInput={activeInput as GraphInput} />}
                {snapshot && (meta.category === "dp" || meta.id === "n-queens" || meta.id === "subset-sum") && <DPVisualizer snapshot={snapshot as DPSnapshot} algoId={meta.id} algoInput={activeInput} />}
              </motion.div>
            ) : (
              <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-[400px]">
                <Suspense fallback={<ThreeDLoader />}>
                  {snapshot && meta.category === "sorting" && <Sorting3DVisualizer snapshot={snapshot as SortingSnapshot} />}
                  {snapshot && meta.category === "greedy" && <Graph3DVisualizer snapshot={snapshot as GraphSnapshot} graphInput={activeInput as GraphInput} />}
                  {snapshot && (meta.category === "dp" || meta.id === "n-queens" || meta.id === "subset-sum") && <DPVisualizer snapshot={snapshot as DPSnapshot} algoId={meta.id} algoInput={activeInput} />}
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
          
          {message && (
            <div className="absolute top-4 right-5 z-20 max-w-[60%]">
            <div className="px-5 py-3 rounded-xl bg-[#111827] shadow-[0_0_25px_-5px_rgba(0,0,0,0.6)] border border-[#4b5563] text-sm text-[#f9fafb] font-bold animate-fade-in text-right">
                {message}
              </div>
            </div>
          )}
        </div>

        <PlaybackControls
          isPlaying={vis.isPlaying} isComplete={vis.isComplete}
          currentStep={vis.currentStep} totalSteps={vis.totalSteps}
          speed={vis.speed} onPlay={vis.play} onPause={vis.pause}
          onReset={vis.reset} onStepForward={vis.stepForward}
          onStepBackward={vis.stepBackward} onSpeedChange={vis.setSpeed}
        />
      </div>

      <div className="w-full lg:w-[360px] flex flex-col gap-4 shrink-0">
        <AnimatePresence>
          {gameMode && gameQuestion && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <GameChallenge 
                key={vis.currentStep}
                question={gameQuestion} 
                score={gameState.score} 
                streak={gameState.streak} 
                onAnswer={(correct) => {
                  answerQuestion(correct);
                  if (!vis.isComplete) {
                    vis.stepForward();
                  }
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex-1 min-h-[400px]">
          <CodePanel meta={meta} currentLine={currentLine} message={message} />
        </div>
      </div>
    </div>
  );
}
