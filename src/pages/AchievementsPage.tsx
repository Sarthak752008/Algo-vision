import { motion } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { Trophy, Star, Flame, BookOpen, Compass, Brain, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACHIEVEMENT_META: Record<string, { icon: React.ReactNode; desc: string }> = {
  "Hot Streak": { icon: <Flame className="h-5 w-5 text-warning" />, desc: "Get 5 correct answers in a row" },
  "Quick Learner": { icon: <BookOpen className="h-5 w-5 text-info" />, desc: "Answer 10 questions correctly" },
  "Century Club": { icon: <Star className="h-5 w-5 text-warning" />, desc: "Reach 100 points" },
  "First Steps": { icon: <Compass className="h-5 w-5 text-primary" />, desc: "Complete your first algorithm" },
  "Algorithm Explorer": { icon: <Brain className="h-5 w-5 text-accent" />, desc: "Complete 3 algorithms" },
  "Sorting Master": { icon: <Trophy className="h-5 w-5 text-warning" />, desc: "Complete all sorting algorithms" },
  "Graph Explorer": { icon: <Compass className="h-5 w-5 text-info" />, desc: "Complete all graph algorithms" },
  "DP Strategist": { icon: <Brain className="h-5 w-5 text-accent" />, desc: "Complete all DP algorithms" },
};

const ALL_ACHIEVEMENTS = Object.keys(ACHIEVEMENT_META);

export default function AchievementsPage() {
  const { state, resetProgress } = useGameState();

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" /> Achievements
          </h1>
          <p className="text-sm text-muted-foreground">
            {state.achievements.length}/{ALL_ACHIEVEMENTS.length} unlocked
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={resetProgress} className="text-xs text-muted-foreground">
          <RotateCcw className="h-3 w-3 mr-1" /> Reset
        </Button>
      </div>

      <div className="grid gap-3">
        {ALL_ACHIEVEMENTS.map((name, i) => {
          const unlocked = state.achievements.includes(name);
          const meta = ACHIEVEMENT_META[name];
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass-panel p-4 flex items-center gap-4 ${
                unlocked ? "border-primary/20" : "opacity-50"
              }`}
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                unlocked ? "bg-primary/10" : "bg-secondary"
              }`}>
                {meta.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-muted-foreground">{meta.desc}</div>
              </div>
              {unlocked && <span className="text-primary text-xs font-medium">Unlocked ✓</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
