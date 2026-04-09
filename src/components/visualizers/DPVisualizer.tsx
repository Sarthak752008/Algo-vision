import React, { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DPSnapshot } from "@/types/algorithm";

interface DPVisualizerProps {
  snapshot: DPSnapshot;
  algoId: string;
  algoInput: any;
}

/**
 * Premium generic DP table visualizer.
 * Supports Knapsack, LCS, and Coin Change.
 */
export const DPVisualizer = memo(function DPVisualizer({ snapshot, algoId, algoInput }: DPVisualizerProps) {
  const { table, i: activeI, w: activeW, action, selectedItems } = snapshot;

  const maxVal = useMemo(() => {
    let m = 0;
    table.forEach(row => row.forEach(c => { 
      if (typeof c === 'number' && isFinite(c) && c > m) m = c; 
    }));
    return m || 1;
  }, [table]);

  const getCellDisplay = (val: number) => {
    if (val === Infinity || val > 1e8) return "∞";
    return val;
  };

  const getCellStyle = (ri: number, ci: number, cell: number) => {
    const isActive = ri === activeI && ci === activeW;
    
    // Algorithm specific highlighting
    let isSelected = false;
    if (algoId === "knapsack") {
      isSelected = selectedItems?.includes(ri) ?? false;
    }

    const isCellSelected = snapshot.selectedCells?.some(cell => cell.r === ri && cell.c === ci);

    if (isActive && action === "include") {

      return {
        bg: "bg-primary border-primary/50",
        text: "text-primary-foreground font-black scale-110",
        glow: true,
        glowColor: "hsl(var(--primary) / 0.4)",
      };
    }
    if (isActive && action === "exclude") {
      return {
        bg: "bg-warning border-warning/50",
        text: "text-warning-foreground font-black scale-110",
        glow: true,
        glowColor: "hsl(var(--warning) / 0.4)",
      };
    }
    if (isActive) {
      return {
        bg: "bg-accent border-accent/50",
        text: "text-accent-foreground font-black scale-110",
        glow: true,
        glowColor: "hsl(var(--accent) / 0.4)",
      };
    }

    if (isSelected && action === "done") {
      return {
        bg: "bg-primary/20 border-primary/30",
        text: "text-primary font-bold",
        glow: false,
      };
    }

    if (isCellSelected && action === "done") {
      return {
        bg: "bg-primary border-primary/40 shadow-[0_0_15px_-3px_hsl(var(--primary))]",
        text: "text-primary-foreground font-black scale-110",
        glow: true,
        glowColor: "hsl(var(--primary) / 0.3)",
      };
    }

    if (cell > 0 && cell !== Infinity) {
      const intensity = 0.05 + (Math.min(cell / maxVal, 1) * 0.25);
      return {
        bg: "bg-white/[0.02] border-white/[0.05]",
        text: "text-foreground font-medium",
        glow: false,
        customBg: `rgba(45, 212, 191, ${intensity})`,
      };
    }

    return {
      bg: "bg-transparent border-white/[0.05]",
      text: "text-muted-foreground/40",
      glow: false,
    };
  };

  const labels = useMemo(() => {
    let rows: string[] = [];
    let cols: string[] = [];
    let title = "i \\ j";

    if (algoId === "knapsack") {
      rows = ["Empty", ...algoInput.weights.map((_: any, idx: number) => `Item ${idx + 1}`)];
      cols = Array.from({ length: table[0]?.length || 0 }, (_, i) => `w=${i}`);
      title = "Item \\ Cap";
    } else if (algoId === "lcs") {
      rows = ["∅", ...algoInput.s1.split("")];
      cols = ["∅", ...algoInput.s2.split("")];
      title = "S1 \\ S2";
    } else if (algoId === "coin-change") {
      rows = ["Amount"];
      cols = Array.from({ length: table[0]?.length || 0 }, (_, i) => `${i}`);
      title = "Amt";
    }

    return { rows, cols, title };
  }, [algoId, algoInput, table]);

  return (
    <div className="flex flex-col h-full gap-6 p-6">
      {/* Legend / Inputs */}
      <div className="flex flex-wrap gap-3">
        {algoId === "knapsack" && algoInput.weights.map((wt: number, idx: number) => (
          <div key={idx} className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
            activeI === idx + 1 ? "bg-accent/20 border-accent text-accent" : "bg-white/[0.02] border-white/[0.05] text-muted-foreground/60"
          }`}>
            Item {idx+1}: W:{wt} V:{algoInput.values[idx]}
          </div>
        ))}
        {algoId === "lcs" && (
          <>
            <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-1">
              <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">String 1</span>
              <span className="text-sm font-mono font-bold text-primary">{algoInput.s1}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-1">
              <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">String 2</span>
              <span className="text-sm font-mono font-bold text-accent">{algoInput.s2}</span>
            </div>
          </>
        )}
        {algoId === "coin-change" && (
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-1">
              <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Coins</span>
              <span className="text-sm font-mono font-bold text-primary">{algoInput.coins.join(", ")}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-1">
              <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Target</span>
              <span className="text-sm font-mono font-bold text-accent">{algoInput.amount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Table Visualizer */}
      <div className="flex-1 overflow-auto rounded-2xl border border-white/[0.05] bg-black/20 shadow-2xl relative">
        <table className="w-full border-collapse font-mono text-[11px]">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="p-3 bg-secondary/80 backdrop-blur-md border-b border-r border-white/10 text-muted-foreground font-black uppercase tracking-tighter sticky left-0 z-30">
                {labels.title}
              </th>
              {labels.cols.map((col, ci) => (
                <th key={ci} className={`p-3 bg-secondary/80 backdrop-blur-md border-b border-white/10 transition-colors ${ci === activeW ? "text-primary" : "text-muted-foreground/40"}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, ri) => (
              <tr key={ri} className="group">
                <td className={`p-3 border-r border-white/5 font-black text-center sticky left-0 z-10 transition-colors ${ri === activeI ? "bg-accent/20 text-accent" : "bg-secondary/40 text-muted-foreground/30"}`}>
                  {labels.rows[ri] || ri}
                </td>
                {row.map((cell, ci) => {
                  const style = getCellStyle(ri, ci, cell);
                  return (
                    <td 
                      key={ci} 
                      className={`p-3 text-center border-b border-white/5 relative min-w-[3rem] transition-all duration-300 ${style.bg}`}
                      style={style.customBg ? { backgroundColor: style.customBg } : undefined}
                    >
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={`${cell}-${ri}-${ci}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`relative z-10 ${style.text}`}
                        >
                          {getCellDisplay(cell)}
                        </motion.div>
                      </AnimatePresence>
                      {style.glow && (
                        <motion.div 
                          layoutId="active-glow"
                          className="absolute inset-0 z-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ boxShadow: `inset 0 0 20px ${style.glowColor}` }}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={action + activeI + activeW}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-4"
        >
          <div className={`h-3 w-3 rounded-full animate-pulse ${
            action === "include" ? "bg-primary" : action === "exclude" ? "bg-warning" : "bg-accent"
          }`} />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Step Activity</span>
            <span className="text-sm font-medium text-foreground/80">{snapshot.message}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

