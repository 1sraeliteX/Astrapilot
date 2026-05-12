import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/ui-kit";
import { riskRadar } from "@/lib/mock-data";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/app/risk")({ component: RiskPage });

function RiskPage() {
  return (
    <div>
      <PageHeader title="Risk Analysis" subtitle="Aggregate fraud, compliance, and counterparty risk across active escrows." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-bold">Risk Radar</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={riskRadar}>
                <PolarGrid stroke="oklch(1 0 0 / 10%)" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "oklch(0.85 0.02 250)" }} />
                <Radar dataKey="score" stroke="oklch(0.7 0.25 22)" fill="oklch(0.62 0.22 18 / 35%)" strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold">Country Risk Exposure</h2>
          <div className="mt-4 space-y-3">
            {[
              ["China", 38, "$8.2M"],
              ["Brazil", 24, "$3.4M"],
              ["Vietnam", 42, "$2.1M"],
              ["Kenya", 15, "$1.8M"],
              ["India", 60, "$0.9M"],
            ].map(([c, r, v]) => (
              <div key={c as string}>
                <div className="mb-1 flex justify-between text-sm"><span>{c}</span><span className="font-mono text-muted-foreground">{v} · risk {r}</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${r}%`, background: (r as number) > 50 ? "oklch(0.62 0.24 25)" : (r as number) > 30 ? "oklch(0.78 0.16 75)" : "oklch(0.7 0.16 165)" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Recommended Protections</h2>
          <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
            <li className="rounded-xl border border-border bg-background/40 p-3">⚡ Add SGS pre-shipment inspection on Vietnam apparel route</li>
            <li className="rounded-xl border border-border bg-background/40 p-3">🛡 Increase deposit milestone to 40% for first-time Indian suppliers</li>
            <li className="rounded-xl border border-border bg-background/40 p-3">📑 Require dual-sign QA on cargoes &gt; $200k</li>
            <li className="rounded-xl border border-border bg-background/40 p-3">⏱ Shorten dispute timeout to 10 days for high-velocity electronics</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
