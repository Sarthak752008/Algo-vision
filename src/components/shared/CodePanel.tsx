import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import cpp from "react-syntax-highlighter/dist/esm/languages/hljs/cpp";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Code2, Clock, HardDrive, BookOpen, Lightbulb, Info, FileCode, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlgorithmMeta } from "@/types/algorithm";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("java", java);

interface CodePanelProps {
  meta: AlgorithmMeta;
  currentLine: number;
  message: string;
}

export function CodePanel({
  meta,
  currentLine,
  message,
}: CodePanelProps) {
  const { code, pseudocode, analogy, description, timeComplexity, spaceComplexity, difficulty, approach, cppCode, javaCode } = meta;

  return (
    <div className="glass-panel flex flex-col h-full overflow-hidden border-white/5 shadow-2xl">
      <Tabs defaultValue="code" className="flex flex-col h-full">
        {/* Header with Tabs */}
        <div className="px-4 py-2 border-b border-white/5 bg-black/20 flex items-center justify-between shrink-0">
          <TabsList className="bg-transparent h-8 p-0 gap-1">
            <TabsTrigger 
              value="code" 
              className="px-3 h-8 text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all"
            >
              <FileCode className="h-3.5 w-3.5 mr-1.5" /> Implementation
            </TabsTrigger>
            <TabsTrigger 
              value="explain" 
              className="px-3 h-8 text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Learning
            </TabsTrigger>
          </TabsList>
          
          <div className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-widest ${
            difficulty === "Easy" ? "bg-success/20 text-success" : 
            difficulty === "Medium" ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"
          }`}>
            {difficulty}
          </div>
        </div>

        {/* Message Banner (Always visible or contextual?) */}
        <div className="px-4 py-2.5 bg-primary/5 border-b border-white/5 flex items-start gap-2 shrink-0">
          <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-[13px] text-primary/100 font-bold leading-relaxed italic">
            {message || "System standby. Waiting for execution..."}
          </p>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-hidden relative">
          <TabsContent value="code" className="h-full m-0 flex flex-col">
            <div className="flex-1 overflow-auto bg-black/10 p-4 space-y-5">
              
              <div className="bg-black/40 rounded-lg border border-white/5 overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border-b border-white/10">
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">JavaScript (Live Execution)</span>
                </div>
                <SyntaxHighlighter
                  language="javascript"
                  style={atomOneDark}
                  showLineNumbers
                  wrapLines
                  lineProps={(lineNumber) => ({
                    style: {
                      backgroundColor: lineNumber === currentLine ? "rgba(45, 212, 191, 0.15)" : "transparent",
                      boxShadow: lineNumber === currentLine ? "inset 2px 0 0 0 hsl(168, 80%, 50%)" : "none",
                      display: "block",
                      paddingLeft: "0.5em",
                    },
                  })}
                  customStyle={{
                    background: "transparent",
                    padding: "0.75rem 0",
                    margin: 0,
                    fontSize: "0.8rem",
                    lineHeight: "1.5",
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>

              {cppCode && (
                <div className="bg-black/40 rounded-lg border border-white/5 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border-b border-white/10">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">C++ Implementation</span>
                  </div>
                  <SyntaxHighlighter language="cpp" style={atomOneDark} customStyle={{ margin: 0, padding: '1rem', fontSize: '0.85rem', background: 'transparent' }}>
                    {cppCode}
                  </SyntaxHighlighter>
                </div>
              )}

              {javaCode && (
                <div className="bg-black/40 rounded-lg border border-white/5 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border-b border-white/10">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Java Implementation</span>
                  </div>
                  <SyntaxHighlighter language="java" style={atomOneDark} customStyle={{ margin: 0, padding: '1rem', fontSize: '0.85rem', background: 'transparent' }}>
                    {javaCode}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="explain" className="flex-1 min-h-0 overflow-y-auto bg-black/10 p-4 space-y-6 scrollbar-thin">
            {/* 1. Problem Overview */}
            <section className="animate-fade-in">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-5 w-1 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]" />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/70">1. Problem Overview</h4>
              </div>
              <p className="text-[13px] text-foreground/80 leading-relaxed font-medium bg-white/[0.02] p-3 rounded-xl border border-white/5">
                {description}
              </p>
            </section>

            {/* 2. Solution Approach */}
            <section className="animate-fade-in [animation-delay:100ms]">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-5 w-1 bg-warning rounded-full shadow-[0_0_8px_hsl(var(--warning))]" />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/70">2. Solution Approach</h4>
              </div>
              <div className="space-y-2">
                {approach && approach.length > 0 ? (
                  approach.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-white/[0.03] rounded-xl p-3 border border-white/5 hover:border-warning/30 transition-colors">
                      <div className="h-5 w-5 mt-0.5 rounded-full bg-warning/10 flex items-center justify-center shrink-0 border border-warning/20">
                        <span className="text-[10px] font-bold text-warning">{idx + 1}</span>
                      </div>
                      <span className="text-[12px] text-foreground/70 font-medium leading-relaxed">{step}</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-black/30 rounded-xl p-3 font-mono text-[10px] text-warning/90 border border-white/5 leading-relaxed whitespace-pre-wrap">
                    {pseudocode}
                  </div>
                )}
              </div>
              {analogy && (
                <div className="mt-4 flex items-start gap-3 bg-secondary/40 rounded-xl p-3.5 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                    <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[12px] text-muted-foreground leading-relaxed italic">
                      "{analogy}"
                    </p>
                </div>
              )}
            </section>
          </TabsContent>
        </div>

        {/* Complexity Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20 shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3 border border-white/5 group hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="h-4 w-4 text-warning group-hover:animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Time Complexity</span>
              </div>
              <div className="text-sm font-black font-mono text-primary">{timeComplexity}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/5 group hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <HardDrive className="h-4 w-4 text-info" />
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Space complexity</span>
              </div>
              <div className="text-sm font-black font-mono text-accent">{spaceComplexity}</div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

