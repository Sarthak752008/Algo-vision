import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { GameState } from "@/types/algorithm";

const INITIAL_STATE: GameState = {
  score: 0,
  streak: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  achievements: [],
  level: 1,
  completedAlgorithms: [],
};

const STORAGE_KEY = "algo-vision-pro-game";

interface GameContextType {
  state: GameState;
  answerQuestion: (correct: boolean) => void;
  completeAlgorithm: (algoId: string) => void;
  resetProgress: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...INITIAL_STATE, ...JSON.parse(raw) } : { ...INITIAL_STATE };
  } catch {
    return { ...INITIAL_STATE };
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const answerQuestion = useCallback((correct: boolean) => {
    setState((prev) => {
      const multiplier = Math.min(1 + Math.floor(prev.streak / 3) * 0.5, 3);
      const points = correct ? Math.round(10 * multiplier) : -5;
      const score = Math.max(0, prev.score + points);
      const streak = correct ? prev.streak + 1 : 0;
      const correctAnswers = correct ? prev.correctAnswers + 1 : prev.correctAnswers;
      const level = Math.floor(Math.sqrt(score / 20)) + 1;
      const achievements = [...prev.achievements];

      if (streak >= 5 && !achievements.includes("Hot Streak")) achievements.push("Hot Streak");
      if (streak >= 10 && !achievements.includes("Fire Marshall")) achievements.push("Fire Marshall");
      if (correctAnswers >= 50 && !achievements.includes("Scholar")) achievements.push("Scholar");
      if (score >= 500 && !achievements.includes("Grandmaster")) achievements.push("Grandmaster");
      if (level >= 5 && !achievements.includes("Elevated")) achievements.push("Elevated");

      return {
        ...prev,
        score,
        streak,
        level,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers,
        achievements,
      };
    });
  }, []);

  const completeAlgorithm = useCallback((algoId: string) => {
    setState((prev) => {
      if (prev.completedAlgorithms.includes(algoId)) return prev;
      const completedAlgorithms = [...prev.completedAlgorithms, algoId];
      const achievements = [...prev.achievements];
      const scoreBonus = 50;
      const newScore = prev.score + scoreBonus;
      const newLevel = Math.floor(Math.sqrt(newScore / 20)) + 1;

      if (completedAlgorithms.length >= 1 && !achievements.includes("First Steps"))
        achievements.push("First Steps");
      if (completedAlgorithms.length >= 5 && !achievements.includes("Algorithm Explorer"))
        achievements.push("Algorithm Explorer");
      if (completedAlgorithms.length >= 10 && !achievements.includes("Polymath"))
        achievements.push("Polymath");

      return { 
        ...prev, 
        score: newScore,
        level: newLevel,
        completedAlgorithms, 
        achievements 
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setState({ ...INITIAL_STATE });
  }, []);

  return (
    <GameContext.Provider value={{ state, answerQuestion, completeAlgorithm, resetProgress }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context;
}
