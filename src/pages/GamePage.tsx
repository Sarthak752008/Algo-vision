import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ALGORITHM_LIST } from "@/algorithms";
import { useGameState } from "@/hooks/useGameState";
import { Gamepad2, ArrowRight } from "lucide-react";

export default function GamePage() {
  const { state } = useGameState();

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="glass-panel p-6 glow-accent">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-accent" />
          Challenge Mode
        </h1>
        <p className="text-sm text-muted-foreground">
          Test your algorithm knowledge! Open any algorithm visualizer and enable Challenge Mode to predict each step before it happens.
        </p>
        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Score: </span>
            <span className="font-mono font-bold text-primary">{state.score}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Correct: </span>
            <span className="font-mono">{state.correctAnswers}/{state.questionsAnswered}</span>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-medium text-muted-foreground">Choose an algorithm to challenge:</h2>

      <div className="grid gap-3">
        {ALGORITHM_LIST.map((algo, i) => (
          <motion.div
            key={algo.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/visualize/${algo.id}?game=1`}
              className="glass-panel p-4 flex items-center justify-between hover:border-accent/30 transition-colors"
            >
              <div>
                <h3 className="text-sm font-medium">{algo.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{algo.category} • {algo.timeComplexity}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
