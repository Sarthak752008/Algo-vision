import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameQuestion } from "@/types/algorithm";
import { Trophy, Zap, Target, CheckCircle2, XCircle, Flame, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameChallengeProps {
  question: GameQuestion;
  score: number;
  streak: number;
  onAnswer: (correct: boolean) => void;
}

export function GameChallenge({ question, score, streak, onAnswer }: GameChallengeProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const multiplier = Math.min(1 + Math.floor(streak / 3) * 0.5, 3);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    const correct = index === question.correctIndex;
    
    // Slight delay before notifying parent to show the result state
    setTimeout(() => {
      onAnswer(correct);
      setSelected(null);
      setShowResult(false);
    }, 1500);
  };

  return (
    <div className="glass-panel overflow-hidden border-primary/20 bg-primary/5 shadow-2xl relative group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      {/* Header Stats */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-warning shadow-warning/50" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground leading-none mb-1">Total Score</div>
            <div className="text-sm font-black font-mono">{score.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {streak >= 3 && (
             <motion.div 
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }} 
               className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2 py-1 rounded-md"
             >
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase">{multiplier}x</span>
             </motion.div>
           )}
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-sm font-black font-mono">
                {streak}
              </span>
              <Flame className={`h-4 w-4 ${streak > 0 ? "text-orange-500 animate-pulse fill-orange-500/20" : "text-muted-foreground/30"}`} />
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none mt-1">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-6 w-6 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
            <Target className="h-3.5 w-3.5 text-accent" />
          </div>
          <p className="text-sm font-bold leading-relaxed text-foreground/90">
            {question.question}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {question.options.map((opt, idx) => {
            const isCorrect = idx === question.correctIndex;
            const isSelected = idx === selected;
            
            let statusStyles = "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10";
            if (showResult) {
                if (isCorrect) statusStyles = "border-success/50 bg-success/10 text-success shadow-[0_0_15px_-5px_hsl(var(--success))]";
                else if (isSelected) statusStyles = "border-destructive/50 bg-destructive/10 text-destructive";
                else statusStyles = "opacity-40 border-white/5 bg-white/5";
            }

            return (
              <Button
                key={idx}
                variant="ghost"
                size="lg"
                className={`w-full justify-start h-auto py-3.5 px-4 text-xs font-semibold rounded-xl border transition-all duration-300 relative overflow-hidden group/opt ${statusStyles}`}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-black transition-colors ${
                      showResult && isCorrect ? "bg-success text-success-foreground" : 
                      showResult && isSelected ? "bg-destructive text-destructive-foreground" : 
                      "bg-white/10 text-muted-foreground group-hover/opt:bg-primary/20 group-hover/opt:text-primary"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1 text-left">{opt}</span>
                  {showResult && isCorrect && <CheckCircle2 className="h-4 w-4 animate-in zoom-in-50" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="h-4 w-4 animate-in zoom-in-50" />}
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Floating points decoration */}
      <AnimatePresence>
        {showResult && selected === question.correctIndex && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 text-primary font-black text-2xl drop-shadow-lg pointer-events-none flex items-center gap-2"
          >
            <Star className="fill-primary h-6 w-6" />
            +{Math.round(10 * multiplier)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

