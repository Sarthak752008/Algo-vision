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
import { useAlgorithmVisualizer } from "@/hooks/useAlgorithmVisualizer";
import { useGameState, generateSortingQuestion, generateGraphQuestion, generateDPQuestion } from "@/hooks/useGameState";
import { SortingSnapshot, GraphSnapshot, DPSnapshot } from "@/types/algorithm";
import { PlaybackControls } from "@/components/shared/PlaybackControls";
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
        <RefreshCcw className="h-5 w-5 text-primary/40 animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">
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
        case "bellman-ford": {
          const g = meta.defaultInput as GraphInput;
          if (meta.id === "dijkstra") return generateDijkstraSnapshots(g);
          if (meta.id === "prim") return generatePrimSnapshots(g);
          return generateBellmanFordSnapshots(g);
        }
        case "knapsack":
        case "coin-change":
        case "lcs": {
          if (meta.id === "knapsack") return generateKnapsackSnapshots(meta.defaultInput as KnapsackInput);
          if (meta.id === "coin-change") return generateCoinChangeSnapshots(meta.defaultInput as any);
          return generateLCSSnapshots(meta.defaultInput as any);
        }
        default: return [];
      }
    } catch (e) {
      console.error("Snapshot generation error:", e);
      return [];
    }
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
    <div className="flex items-center justify-center h-full p-12 text-muted-foreground/30">
      <Info className="h-6 w-6 mr-2" /> Algorithm not found
    </div>
  );

  const snapshot = vis.currentSnapshot;
  const currentLine = snapshot?.codeLine ?? 0;
  const message = snapshot?.message ?? "";

  const gameQuestion = useMemo(() => {
    if (!gameMode || !snapshot) return null;
    if (meta?.category === "sorting") return generateSortingQuestion((snapshot as any).array, (snapshot as any).comparing, vis.currentStep);
    if (meta?.category === "greedy") return generateGraphQuestion((snapshot as any).currentNode, (snapshot as any).distances, vis.currentStep);
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
            <div className="text-[9px] font-bold uppercase tracking-widest text-primary/80 mb-1.5">
              Algo-Vision — Interactive Algorithm Learning Platform by Sarthak Sharma
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-0.5">{meta.name}</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              <span>{meta.category}</span>
              <span className="opacity-30">•</span>
              <span className="font-mono">{meta.timeComplexity}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {has3D && (
              <div className="flex p-1 bg-secondary rounded-lg border border-border/40">
                <Button 
                  variant={viewMode === "2d" ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setViewMode("2d")}
                  className="h-7 px-3 text-[10px] font-bold rounded-md"
                >
                  <Monitor className="h-3 w-3 mr-1.5" /> 2D
                </Button>
                <Button 
                  variant={viewMode === "3d" ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setViewMode("3d")}
                  className="h-7 px-3 text-[10px] font-bold rounded-md"
                >
                  <Box className="h-3 w-3 mr-1.5" /> 3D
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

        {meta.category === "sorting" && (
          <div className="glass-panel px-4 py-2 flex items-center gap-3">
            <Pencil className="h-3.5 w-3.5 text-muted-foreground/30" />
            <Input
              placeholder="Custom input: 5, 2, 8..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="h-8 text-xs bg-transparent border-0 focus-visible:ring-0 px-0"
            />
          </div>
        )}

        <div className="glass-panel overflow-hidden relative border-border/40 p-4">
          <AnimatePresence mode="wait">
            {viewMode === "2d" ? (
              <motion.div key="2d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                {snapshot && meta.category === "sorting" && <SortingVisualizer snapshot={snapshot as SortingSnapshot} />}
                {snapshot && meta.category === "greedy" && <GraphVisualizer snapshot={snapshot as GraphSnapshot} graphInput={meta.defaultInput as GraphInput} />}
                {snapshot && meta.category === "dp" && <DPVisualizer snapshot={snapshot as DPSnapshot} algoId={meta.id} algoInput={meta.defaultInput} />}
              </motion.div>
            ) : (
              <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-[400px]">
                <Suspense fallback={<ThreeDLoader />}>
                  {snapshot && meta.category === "sorting" && <Sorting3DVisualizer snapshot={snapshot as SortingSnapshot} />}
                  {snapshot && meta.category === "greedy" && <Graph3DVisualizer snapshot={snapshot as GraphSnapshot} graphInput={meta.defaultInput as GraphInput} />}
                  {snapshot && meta.category === "dp" && <DPVisualizer snapshot={snapshot as DPSnapshot} algoId={meta.id} algoInput={meta.defaultInput} />}
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
          
          {message && (
            <div className="absolute top-4 right-5 z-20 max-w-[60%]">
              <div className="px-4 py-2 rounded-lg bg-[#111827] shadow-[0_0_15px_-3px_rgba(0,0,0,0.5)] border border-[#374151] text-xs text-[#f9fafb] font-bold animate-fade-in text-right">
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
