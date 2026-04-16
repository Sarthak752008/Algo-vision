import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, GitBranch, Grid3X3, ArrowRight, Trophy, Gamepad2, BookOpen, Search, Zap, Target, RotateCcw } from "lucide-react";
import { ALGORITHM_LIST, CATEGORIES } from "@/algorithms";
import { useGameState } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const catIcons: Record<string, React.ReactNode> = {
  sorting: <BarChart3 className="h-4 w-4" />,
  greedy: <GitBranch className="h-4 w-4" />,
  dp: <Grid3X3 className="h-4 w-4" />,
  backtracking: <RotateCcw className="h-4 w-4" />,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const difficultyColors: Record<string, string> = {
  Easy: "text-green-400 bg-green-500/10 border-green-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function Dashboard() {
  const { state } = useGameState();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlgorithms = ALGORITHM_LIST.filter(
    (algo) =>
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAlgorithms = ALGORITHM_LIST.length;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-border/60 bg-card/50 p-8 lg:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none">
          <span className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">Sarthak Sharma</span>
        </div>
        <div className="max-w-xl relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
            Algo-Vision
          </h1>
          <p className="text-base text-muted-foreground mb-1 leading-relaxed">
            An interactive algorithm learning platform.
          </p>
          <p className="text-sm text-muted-foreground/60 mb-6">
            by <span className="text-foreground/70 font-medium">Sarthak Sharma</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-xl px-6 h-11 text-sm font-semibold">
              <Link to="/visualize/radix-sort">
                <BookOpen className="h-4 w-4 mr-2" /> Start Exploring
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl px-6 h-11 text-sm font-semibold">
              <Link to="/game">
                <Gamepad2 className="h-4 w-4 mr-2" /> Play Challenges
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Search + Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
          <Input
            placeholder="Search algorithms..."
            className="pl-10 h-10 bg-card/40 border-border/60 rounded-xl text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          {[
            { label: "Score", value: state.score, icon: <Trophy className="h-3.5 w-3.5" />, color: "text-amber-400" },
            { label: "Streak", value: state.streak, icon: <Zap className="h-3.5 w-3.5" />, color: "text-orange-400" },
            { label: "Done", value: `${state.completedAlgorithms.length}/${totalAlgorithms}`, icon: <Target className="h-3.5 w-3.5" />, color: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="glass-panel px-4 py-2.5 flex items-center gap-2.5">
              <div className={s.color}>{s.icon}</div>
              <div>
                <div className="text-[9px] uppercase font-semibold tracking-wider text-muted-foreground/50">{s.label}</div>
                <div className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Grid */}
      <div className="space-y-10">
        {CATEGORIES.map((cat) => {
          const catAlgos = filteredAlgorithms.filter((a) => a.category === cat.id);
          if (catAlgos.length === 0) return null;

          return (
            <motion.div
              key={cat.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={container}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center border border-border/60">
                  {catIcons[cat.id]}
                </div>
                <div>
                  <h2 className="text-base font-bold">{cat.label}</h2>
                  <p className="text-[11px] text-muted-foreground/60">{catAlgos.length} algorithms • Stage {cat.level}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catAlgos.map((algo) => {
                  const completed = state.completedAlgorithms.includes(algo.id);
                  return (
                    <motion.div key={algo.id} variants={item}>
                      <Link
                        to={`/visualize/${algo.id}`}
                        className="group flex flex-col h-full glass-card p-5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-sm font-bold group-hover:text-primary transition-colors">
                            {algo.name}
                          </h3>
                          {completed ? (
                            <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">✓</span>
                          ) : (
                            <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-secondary border border-border/60 text-muted-foreground">
                            {algo.timeComplexity}
                          </span>
                          {algo.difficulty && (
                            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${difficultyColors[algo.difficulty] || ""}`}>
                              {algo.difficulty}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground/60 line-clamp-2 flex-1 leading-relaxed">
                          {algo.description}
                        </p>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer credit */}
      <footer className="pt-8 pb-4 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground/40">
          Created by <span className="text-muted-foreground/60 font-medium">Sarthak Sharma</span>
        </p>
      </footer>
    </div>
  );
}
