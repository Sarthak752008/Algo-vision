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
              className="px-3 h-7 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all"
            >
              <FileCode className="h-3 w-3 mr-1.5" /> Implementation
            </TabsTrigger>
            <TabsTrigger 
              value="explain" 
              className="px-3 h-7 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all"
            >
              <BookOpen className="h-3 w-3 mr-1.5" /> Learning
            </TabsTrigger>
          </TabsList>
          
          <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
            difficulty === "Easy" ? "bg-success/10 text-success" : 
            difficulty === "Medium" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
          }`}>
            {difficulty}
          </div>
        </div>

        {/* Message Banner (Always visible or contextual?) */}
        <div className="px-4 py-2.5 bg-primary/5 border-b border-white/5 flex items-start gap-2 shrink-0">
          <Info className="h-3 w-3 text-primary mt-0.5 shrink-0" />
          <p className="text-[11px] text-primary/90 font-medium leading-relaxed italic">
            {message || "System standby. Waiting for execution..."}
          </p>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-hidden relative">
          <TabsContent value="code" className="h-full m-0 flex flex-col">
            <div className="flex-1 overflow-auto bg-black/10 p-4 space-y-5">
              
              <div className="bg-black/40 rounded-lg border border-white/5 overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border-b border-white/5">
                  <div className="h-2 w-2 rounded-full bg-yellow-400/80" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">JavaScript (Live Execution)</span>
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
                    padding: "1rem 0",
                    margin: 0,
                    fontSize: "0.75rem",
                    lineHeight: "1.6",
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>

              {cppCode && (
                <div className="bg-black/40 rounded-lg border border-white/5 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border-b border-white/5">
                    <div className="h-2 w-2 rounded-full bg-blue-500/80" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">C++ Implementation</span>
                  </div>
                  <SyntaxHighlighter language="cpp" style={atomOneDark} customStyle={{ margin: 0, padding: '1rem', fontSize: '0.75rem', background: 'transparent' }}>
                    {cppCode}
                  </SyntaxHighlighter>
                </div>
              )}

              {javaCode && (
                <div className="bg-black/40 rounded-lg border border-white/5 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border-b border-white/5">
                    <div className="h-2 w-2 rounded-full bg-red-500/80" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Java Implementation</span>
                  </div>
                  <SyntaxHighlighter language="java" style={atomOneDark} customStyle={{ margin: 0, padding: '1rem', fontSize: '0.75rem', background: 'transparent' }}>
                    {javaCode}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="explain" className="h-full m-0 overflow-y-auto bg-black/10 p-5 space-y-6">
            {/* 1. Problem Overview */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">1. Problem Overview</h4>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                {description}
              </p>
            </section>

            {/* 2. Solution Approach */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-1 bg-warning rounded-full" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">2. Solution Approach</h4>
              </div>
              <div className="space-y-2">
                {approach && approach.length > 0 ? (
                  approach.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="h-4 w-4 mt-0.5 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-warning" />
                      </div>
                      <span className="text-xs text-foreground/80 font-medium leading-relaxed">{step}</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-[11px] text-warning/90 border border-white/5 leading-relaxed whitespace-pre-wrap">
                    {pseudocode}
                  </div>
                )}
              </div>
              {analogy && (
                <div className="mt-3 flex items-start gap-2 bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                    <span className="text-orange-500 text-xs mt-0.5">💡</span>
                    <p className="text-xs text-orange-500/90 italic leading-relaxed">
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
                <Clock className="h-3 w-3 text-warning group-hover:animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Time Complexity</span>
              </div>
              <div className="text-xs font-black font-mono text-primary">{timeComplexity}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/5 group hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <HardDrive className="h-3 w-3 text-info" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Space complexity</span>
              </div>
              <div className="text-xs font-black font-mono text-accent">{spaceComplexity}</div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

