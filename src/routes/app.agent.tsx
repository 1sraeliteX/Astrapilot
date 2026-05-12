import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Mic,
  ShieldCheck,
  Milestone,
  FileText,
  ChevronDown,
  Zap,
  Network,
} from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/agent")({
  component: AgentPage,
});

const SUGGESTIONS = [
  "Import $50,000 of solar panels from Shenzhen — milestone-based escrow",
  "I'm exporting 20 MT of coffee from Brazil to Sweden, $84k deal",
  "Help me structure a $250k apparel order from Vietnam with QA inspection",
  "Buyer wants security deposit escrow for industrial equipment rental",
];

function AgentPage() {
  const [input, setInput] = useState("");
  const transport = new DefaultChatTransport({ api: "/api/chat" });
  const { messages, sendMessage, status, error } = useChat({ transport });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const submit = () => {
    if (!input.trim() || status === "submitted" || status === "streaming") return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  return (
    <div>
      <PageHeader
        title="AI Trade Agent"
        subtitle="Describe a trade in plain English. AstraPilot proposes suppliers, milestones, and escrow terms."
        badge={
          <span className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" /> Soroban Enabled
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Chat */}
        <Card className="flex flex-col" >
          <div ref={scrollRef} className="scrollbar-thin max-h-[64vh] min-h-[64vh] overflow-y-auto px-6 py-6">
            {messages.length === 0 ? (
              <EmptyState onPick={(s) => { setInput(s); inputRef.current?.focus(); }} />
            ) : (
              <div className="space-y-6">
                {messages.map((m) => (
                  <MessageView key={m.id} message={m} />
                ))}
                {(status === "submitted" || status === "streaming") && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"><Bot className="h-3.5 w-3.5" /></span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                    </span>
                    AstraPilot agent analyzing…
                  </div>
                )}
                {error && (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    Agent error: {error.message}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-background/50 p-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="Type a command, query a supplier, or adjust terms…"
                rows={1}
                className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:bg-surface-elevated">
                <Mic className="h-4 w-4" />
              </button>
              <Button
                onClick={submit}
                disabled={!input.trim() || status === "submitted" || status === "streaming"}
                size="icon"
                className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
              <span>AstraPilot Agent v2.4 (Soroban Enabled)</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Knowledge Base Synced</span>
            </div>
          </div>
        </Card>

        {/* Right panel */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Execution Context</div>
            <div className="mt-3 flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" />
              <div className="font-semibold">Stellar Network</div>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <Row label="Status" value={<span className="text-success">● Active</span>} />
              <Row label="Avg Ledger Time" value="5.4s" />
              <Row label="Fee Est. (Soroban)" value="100 XLM" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Reasoning Log</div>
            <div className="mt-3 space-y-2">
              {[
                { icon: ShieldCheck, label: "Supplier Evaluation" },
                { icon: FileText, label: "Compliance Check" },
                { icon: Milestone, label: "Milestone Synthesis" },
              ].map((r) => {
                const Icon = r.icon;
                return (
                  <button key={r.label} className="flex w-full items-center justify-between rounded-xl border border-border bg-background/40 px-3 py-2 text-left text-sm hover:bg-surface-elevated">
                    <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /> {r.label}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><Zap className="h-4 w-4 text-primary" /> Quick Actions</div>
            <div className="mt-3 space-y-2 text-xs">
              {SUGGESTIONS.slice(0, 3).map((s) => (
                <button key={s} onClick={() => setInput(s)} className="block w-full rounded-xl border border-border bg-background/40 p-2.5 text-left text-muted-foreground hover:border-primary/40 hover:text-foreground">
                  {s}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="grid place-items-center py-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground glow-primary">
        <Bot className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-2xl font-bold">How can I structure your trade?</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Describe a deal — counterparties, commodity, value, route. I'll propose a milestone escrow,
        verify the supplier, and prepare the document checklist.
      </p>
      <div className="mt-8 grid w-full max-w-2xl gap-2 md:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-2xl border border-border bg-surface/50 p-4 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-surface hover:text-foreground"
          >
            <Sparkles className="mb-2 h-3.5 w-3.5 text-primary" />
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageView({ message }: { message: any }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold",
        isUser
          ? "bg-surface-elevated text-foreground"
          : "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground",
      )}>
        {isUser ? "AP" : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn("min-w-0 max-w-[85%] space-y-2", isUser && "items-end")}>
        {!isUser && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
            ▲ AstraPilot Agent
          </div>
        )}
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm",
          isUser ? "bg-surface border border-border rounded-br-sm" : "rounded-bl-sm",
        )}>
          {message.parts?.map((part: any, i: number) => {
            if (part.type === "text") {
              return (
                <div key={i} className="prose prose-invert prose-sm max-w-none prose-headings:mb-2 prose-headings:mt-4 prose-p:my-2 prose-li:my-0.5">
                  <ReactMarkdown>{part.text}</ReactMarkdown>
                </div>
              );
            }
            // Tool parts
            if (typeof part.type === "string" && part.type.startsWith("tool-")) {
              return <ToolCard key={i} part={part} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

function ToolCard({ part }: { part: any }) {
  const name = (part.type as string).replace("tool-", "");
  const state = part.state as string;
  const output = part.output;
  const input = part.input;

  if (name === "assessSupplier" && state === "output-available" && output) {
    const risk = output.riskScore as number;
    const tone = risk < 25 ? "success" : risk < 45 ? "warning" : "destructive";
    return (
      <div className="my-3 rounded-2xl border border-border bg-background/60 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Supplier Risk Assessment</div>
          <span className={cn(
            "rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase",
            tone === "success" && "border-success/40 bg-success/10 text-success",
            tone === "warning" && "border-warning/40 bg-warning/10 text-warning",
            tone === "destructive" && "border-destructive/40 bg-destructive/10 text-destructive",
          )}>● {tone === "success" ? "Low" : tone === "warning" ? "Moderate" : "High"} Risk</span>
        </div>
        <div className="text-xs text-muted-foreground">{output.supplierName} · {output.country}</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Meter label="Risk Score" value={risk} max={100} invert />
          <Meter label="Match Score" value={output.matchScore} max={100} />
        </div>
        <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
          {(output.signals as string[]).map((s) => <li key={s}>• {s}</li>)}
        </ul>
      </div>
    );
  }

  if (name === "proposeMilestones" && state === "output-available" && output) {
    return (
      <div className="my-3 rounded-2xl border border-border bg-background/60 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Milestone className="h-4 w-4 text-primary" /> Proposed Milestones</div>
        <div className="space-y-2">
          {output.milestones.map((m: any, i: number) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-surface/40 p-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{m.percent}%</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{m.name}</div>
                <div className="truncate text-[11px] text-muted-foreground">{m.condition}</div>
              </div>
              <div className="text-sm font-mono">${m.amountUSD.toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <Pill label="Network" value={output.network} />
          <Pill label="Currency" value={output.currency} />
          <Pill label="Arbiter" value={output.arbiter} />
        </div>
        <Button className="mt-4 w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
          Deploy Escrow on Stellar
        </Button>
      </div>
    );
  }

  if (name === "listRequiredDocuments" && state === "output-available" && output) {
    return (
      <div className="my-3 rounded-2xl border border-border bg-background/60 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-primary" /> Required Documents</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {output.documents.map((d: any) => (
            <div key={d.name} className="flex items-center justify-between rounded-xl border border-border bg-surface/40 p-2.5">
              <span className="text-sm">{d.name}</span>
              <span className={cn(
                "rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase",
                d.criticality === "critical" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-success/30 bg-success/10 text-success",
              )}>{d.criticality}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback compact view
  return (
    <details className="my-2 rounded-xl border border-border bg-background/40 p-3 text-xs">
      <summary className="cursor-pointer font-medium">⚙ Tool: {name} · {state}</summary>
      {input && <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] text-muted-foreground">{JSON.stringify(input, null, 2)}</pre>}
      {output && <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] text-muted-foreground">{JSON.stringify(output, null, 2)}</pre>}
    </details>
  );
}

function Meter({ label, value, max, invert }: { label: string; value: number; max: number; invert?: boolean }) {
  const pct = (value / max) * 100;
  const good = invert ? pct < 35 : pct > 70;
  const mid = invert ? pct < 60 : pct > 50;
  const color = good ? "oklch(0.7 0.16 165)" : mid ? "oklch(0.78 0.16 75)" : "oklch(0.62 0.24 25)";
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground"><span>{label}</span><span>{value}/{max}</span></div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold">{value}</div>
    </div>
  );
}
