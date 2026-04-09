import { useState, useCallback, useRef, useEffect } from "react";
import { AlgorithmSnapshot } from "@/types/algorithm";

interface UseAlgorithmVisualizerOptions {
  snapshots: AlgorithmSnapshot[];
  initialSpeed?: number; // ms delay between steps
}

export function useAlgorithmVisualizer({
  snapshots,
  initialSpeed = 500,
}: UseAlgorithmVisualizerOptions) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = snapshots.length;
  const currentSnapshot = snapshots[currentStep] ?? null;
  const isComplete = currentStep >= totalSteps - 1;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (isComplete) return;
    setIsPlaying(true);
  }, [isComplete]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    pause();
    setCurrentStep(0);
  }, [pause]);

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Auto-play logic
  useEffect(() => {
    clearTimer();
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return clearTimer;
  }, [isPlaying, speed, totalSteps, clearTimer]);

  // Pause when snapshots change (new algorithm loaded)
  useEffect(() => {
    pause();
    setCurrentStep(0);
  }, [snapshots]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    currentStep,
    currentSnapshot,
    totalSteps,
    isPlaying,
    isComplete,
    speed,
    setSpeed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setCurrentStep,
  };
}
