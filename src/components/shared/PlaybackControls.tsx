import React from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipBack, SkipForward, FastForward, Rewind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PlaybackControlsProps {
  isPlaying: boolean;
  isComplete: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
  isPlaying,
  isComplete,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
}: PlaybackControlsProps) {
  const sliderValue = 2050 - speed;
  const progressPct = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="glass-panel p-5 space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: isPlaying ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
              className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-primary" : isComplete ? "bg-success" : "bg-muted-foreground/30"}`}
            />
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-muted-foreground/40">
              {isPlaying ? "Running" : isComplete ? "Complete" : "Ready"}
            </span>
          </div>
          <span className="text-[10px] font-bold font-mono text-muted-foreground/50">
            {currentStep + 1}<span className="text-muted-foreground/20">/</span>{totalSteps}
          </span>
        </div>
        <div className="relative h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-accent"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute top-0 h-full w-4 bg-white/40 blur-sm rounded-full"
            animate={{ left: `calc(${progressPct}% - 8px)` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
        {/* Speed slider - mobile bottom, desktop left */}
        <div className="flex flex-col gap-2 w-full lg:w-32 shrink-0 order-3 lg:order-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Speed</span>
            <FastForward className="h-3 w-3 text-primary/60" />
          </div>
          <Slider
            value={[sliderValue]}
            min={50}
            max={2000}
            step={50}
            onValueChange={([v]) => onSpeedChange(2050 - v)}
            className="cursor-pointer"
          />
        </div>

        {/* Main controls - mobile top/wrap, desktop center */}
        <div className="flex flex-wrap items-center justify-center gap-3 order-1 lg:order-2 w-full lg:w-auto">
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-10 px-4 rounded-full bg-[#1f2937] hover:bg-[#374151] text-[#f9fafb] transition-all"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            <span className="text-xs font-semibold">Reset</span>
          </Button>

          <Button
            variant="ghost"
            onClick={onStepBackward}
            disabled={currentStep === 0}
            className="h-10 px-4 rounded-full bg-[#1f2937] hover:bg-[#374151] text-[#f9fafb] disabled:opacity-30 transition-all"
          >
            <SkipBack className="h-4 w-4 mr-2" />
            <span className="text-xs font-semibold">Back</span>
          </Button>

          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} className="w-full sm:w-auto flex justify-center order-first sm:order-none mb-2 sm:mb-0">
            <Button
              size="lg"
              onClick={isPlaying ? onPause : onPlay}
              disabled={isComplete && !isPlaying}
              className={`h-12 px-6 rounded-full transition-all duration-300 border-none w-full sm:w-auto ${
                isPlaying
                  ? "bg-[#374151] text-[#f9fafb] hover:bg-[#4b5563]"
                  : "bg-primary text-primary-foreground shadow-[0_0_20px_-5px_hsl(var(--primary))]"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-5 w-5 fill-current mr-2.5" />
                  <span className="font-bold text-sm">Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current mr-2.5" />
                  <span className="font-bold text-sm">Play</span>
                </>
              )}
            </Button>
          </motion.div>

          <Button
            variant="ghost"
            onClick={onStepForward}
            disabled={isComplete}
            className="h-10 px-4 rounded-full bg-[#1f2937] hover:bg-[#374151] text-[#f9fafb] disabled:opacity-30 transition-all"
          >
            <span className="text-xs font-semibold mr-2">Step</span>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Status - hidden on small mobile, visible lg */}
        <div className="hidden lg:flex items-center gap-2 w-44 justify-end order-2 lg:order-3">
          <div className="text-right">
            <div className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground/30">Status</div>
            <div className={`text-[10px] font-bold ${
              isPlaying ? "text-primary" : isComplete ? "text-success" : "text-muted-foreground/50"
            }`}>
              {isPlaying ? "Simulating..." : isComplete ? "✓ Complete" : "Paused"}
            </div>
          </div>
          <div className={`h-2 w-2 rounded-full transition-colors ${
            isPlaying ? "bg-primary animate-pulse" : isComplete ? "bg-success" : "bg-muted-foreground/20"
          }`} />
        </div>
      </div>
    </div>
  );
}
