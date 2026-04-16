import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar, SidebarToggle } from "@/components/layout/AppSidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const breadcrumb = location.pathname.split("/").filter(Boolean).pop() || "dashboard";

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-[240px] min-h-screen">
        {/* Top bar */}
        <header className="h-12 flex items-center px-4 border-b border-border/40 shrink-0 bg-background/80 backdrop-blur-lg sticky top-0 z-30">
          <SidebarToggle onClick={() => setSidebarOpen((v) => !v)} />
          <div className="ml-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground/60 font-mono">
              algo-vision / {breadcrumb}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="min-h-full w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 py-4"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
