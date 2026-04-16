import React, { memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SortingSnapshot } from "@/types/algorithm";

interface SortingVisualizerProps {
  snapshot: SortingSnapshot;
}

/**
 * Premium sorting visualizer with smooth animations, gradient bars,
 * dynamic scaling, and animated bucket display.
 */
export const SortingVisualizer = memo(function SortingVisualizer({ snapshot }: SortingVisualizerProps) {
  const { array, comparing, swapped, sorted, buckets, currentDigit } = snapshot;
  const getBlockStyle = useCallback((index: number) => {
    const isSorted = sorted.includes(index);
    const isSwapped = swapped.includes(index);
    const isComparing = comparing.includes(index);

    let background = "hsl(var(--algo-default))";
    let shadow = "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)";
    let scale = 1;
    let color = "hsl(var(--foreground))";

    if (isSorted) {
      background = "hsl(var(--algo-sorted))";
      shadow = "0 0 16px -4px hsl(var(--algo-sorted) / 0.4)";
      color = "white";
    } else if (isSwapped) {
      background = "hsl(var(--algo-swap))";
      shadow = "0 0 20px -4px hsl(var(--algo-swap) / 0.5)";
      scale = 1.1;
      color = "white";
    } else if (isComparing) {
      background = "hsl(var(--algo-compare))";
      shadow = "0 0 20px -4px hsl(var(--algo-compare) / 0.5)";
      scale = 1.1;
      color = "white";
    }

    return {
      background,
      boxShadow: shadow,
      transform: `scale(${scale})`,
      color,
    };
  }, [comparing, swapped, sorted]);

  // Generate stable keys so Framer Motion can track elements during swaps
  const elementKeys = useMemo(() => {
    const counts: Record<number, number> = {};
    return array.map((val) => {
      counts[val] = (counts[val] || 0) + 1;
      return `${val}-${counts[val]}`;
    });
  }, [array]);

  return (
    <div className="flex flex-col gap-5 p-2 w-full">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 px-2 pt-2 shrink-0">
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm bg-[hsl(var(--algo-default))]" /><span className="text-[12px] text-muted-foreground uppercase font-bold tracking-wider">Default</span></div>
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm bg-[hsl(var(--algo-compare))]" /><span className="text-[12px] text-muted-foreground uppercase font-bold tracking-wider">Comparing</span></div>
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm bg-[hsl(var(--algo-swap))]" /><span className="text-[12px] text-muted-foreground uppercase font-bold tracking-wider">Swapping</span></div>
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm bg-[hsl(var(--algo-sorted))]" /><span className="text-[12px] text-muted-foreground uppercase font-bold tracking-wider">Sorted</span></div>
      </div>

      {/* Main array blocks visualization */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-2 relative mt-2 mb-2">
        <AnimatePresence mode="popLayout">
          {array.map((value, index) => {
            const isComparing = comparing.includes(index);
            const isSwapped = swapped.includes(index);
            const key = elementKeys[index];

            return (
              <motion.div
                layout
                key={key}
                className="relative"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 25 },
                  opacity: { duration: 0.2 }
                }}
              >
                {/* Array Block */}
                <motion.div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
                  style={getBlockStyle(index)}
                  transition={{ duration: 0.2 }}
                >
                  {/* Number inside block */}
                  <span className="text-sm sm:text-lg font-black font-mono select-none drop-shadow-md z-10">
                    {value}
                  </span>

                  {(isComparing || isSwapped) && (
                    <div className="absolute inset-0 bg-white/10 shimmer" />
                  )}
                </motion.div>
                
                {/* Index label underneath */}
                <div className="absolute -bottom-6 left-0 right-0 text-center text-[12px] font-mono text-muted-foreground/80 font-bold">
                  {index}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Radix/Counting sort buckets */}
      <AnimatePresence>
        {buckets && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-2 pb-2 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 w-4 rounded-full bg-accent/60" />
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">
                Radix Buckets {currentDigit !== undefined ? <span className="text-accent ml-2">Current Digit: {currentDigit}</span> : ""}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
              {buckets.map((bucket, i) => (
                <div
                  key={i}
                  className="bg-card/40 border border-border/80 rounded-xl overflow-hidden flex flex-col shadow-md"
                >
                  <div className="bg-black/30 py-1.5 text-center border-b border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Bucket {i}</span>
                  </div>
                  <div className="p-2 min-h-[60px] flex flex-wrap gap-1.5 items-start justify-start content-start">
                    <AnimatePresence>
                      {bucket.map((val, j) => (
                          <motion.div
                            key={`${i}-${j}-${val}`}
                            initial={{ opacity: 0, scale: 0.5, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ delay: j * 0.02, duration: 0.2 }}
                            className="bg-accent/30 border border-accent/50 text-foreground font-mono font-bold text-[12px] rounded px-2 py-1 min-w-[32px] text-center"
                          >
                            {val}
                          </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
