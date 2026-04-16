import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, GitBranch, Grid3X3, Home, Gamepad2, Trophy, X, Menu, ChevronRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ALGORITHM_LIST } from "@/algorithms";
import { useGameState } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";

const categoryIcons: Record<string, React.ReactNode> = {
  sorting: <BarChart3 className="h-3.5 w-3.5" />,
  greedy: <GitBranch className="h-3.5 w-3.5" />,
  dp: <Grid3X3 className="h-3.5 w-3.5" />,
  backtracking: <RotateCcw className="h-3.5 w-3.5" />,
};

const categoryLabels: Record<string, string> = {
  sorting: "Sorting",
  greedy: "Greedy",
  dp: "Dynamic Programming",
  backtracking: "Backtracking",
};

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const location = useLocation();
  const { state: gameState } = useGameState();
  const categories = ["sorting", "greedy", "dp", "backtracking"];

  const totalAlgos = ALGORITHM_LIST.length;
  const completed = gameState.completedAlgorithms.length;
  const progressPct = totalAlgos > 0 ? Math.round((completed / totalAlgos) * 100) : 0;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : (typeof window !== "undefined" && window.innerWidth < 1024 ? -260 : 0) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-[240px] bg-[hsl(220,20%,6%)] border-r border-border/40 z-50 flex flex-col"
      >
        {/* Logo */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border/30">
          <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block leading-tight">Algo-Vision</span>
              <span className="text-[9px] text-muted-foreground/40 font-medium block leading-tight">
                by Sarthak Sharma
              </span>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden rounded-lg" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* Main nav */}
          <div className="space-y-0.5">
            <SectionLabel>Menu</SectionLabel>
            <NavItem to="/" icon={<Home className="h-4 w-4" />} label="Dashboard" active={location.pathname === "/"} onClick={onClose} />
            <NavItem to="/game" icon={<Gamepad2 className="h-4 w-4" />} label="Challenges" active={location.pathname === "/game"} onClick={onClose} />
            <NavItem to="/achievements" icon={<Trophy className="h-4 w-4" />} label="Achievements" active={location.pathname === "/achievements"} onClick={onClose} />
          </div>

          {/* Algorithm categories */}
          {categories.map((cat) => {
            const algos = ALGORITHM_LIST.filter((a) => a.category === cat);
            return (
              <div key={cat} className="space-y-0.5">
                <SectionLabel>{categoryLabels[cat]}</SectionLabel>
                {algos.map((algo) => {
                  const isComplete = gameState.completedAlgorithms.includes(algo.id);
                  return (
                    <NavItem
                      key={algo.id}
                      to={`/visualize/${algo.id}`}
                      icon={categoryIcons[cat]}
                      label={algo.name}
                      active={location.pathname === `/visualize/${algo.id}`}
                      onClick={onClose}
                      isSmall
                      completed={isComplete}
                    />
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer progress */}
        <div className="px-4 py-3 border-t border-border/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground/50">Progress</span>
            <span className="text-[10px] font-mono font-semibold text-primary">{progressPct}%</span>
          </div>
          <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-[9px] text-muted-foreground/30 mt-1.5">
            {completed} of {totalAlgos} completed
          </p>
        </div>
      </motion.aside>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30 block">
      {children}
    </span>
  );
}

function NavItem({
  to,
  icon,
  label,
  active,
  onClick,
  isSmall = false,
  completed = false,
}: {
  to: string;
  icon?: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  isSmall?: boolean;
  completed?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative flex items-center gap-2.5 px-3 rounded-lg transition-colors duration-150 group ${
        isSmall ? "py-1.5" : "py-2"
      } ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground/60 hover:bg-secondary/50 hover:text-foreground/80"
      }`}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 w-[2px] h-1/2 bg-primary rounded-r-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      {icon && (
        <div className={active ? "text-primary" : "text-muted-foreground/35 group-hover:text-foreground/60"}>
          {icon}
        </div>
      )}
      <span className={`font-medium truncate ${isSmall ? "text-[12px]" : "text-[13px]"}`}>
        {label}
      </span>
      {completed && !active && (
        <span className="ml-auto text-[8px] text-primary/50 font-bold">✓</span>
      )}
    </Link>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-secondary/50" onClick={onClick}>
      <Menu className="h-4 w-4 text-muted-foreground/60" />
    </Button>
  );
}
