import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/ui-kit";
import { volumeSeries } from "@/lib/mock-data";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from "recharts";

export const Route = createFileRoute("/app/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Trade volume, fee revenue, and lifecycle metrics across the network." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Trade Volume (12 mo)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeSeries}>
                <defs>
                  <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.25 22)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.7 0.25 22)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.012 275)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="volume" stroke="oklch(0.7 0.25 22)" fill="url(#vg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold">Fee Revenue ($K)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeSeries}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(0.7 0.02 260)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.012 275)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="fees" radius={[6, 6, 2, 2]}>
                  {volumeSeries.map((_, i) => <Cell key={i} fill="oklch(0.62 0.22 18 / 80%)" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6 lg:col-span-3">
          <h2 className="text-lg font-bold">Geographic Distribution</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {[["APAC", "42%"], ["EMEA", "28%"], ["LATAM", "18%"], ["NA", "10%"], ["AFR", "2%"]].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-border bg-background/40 p-4 text-center">
                <div className="text-3xl font-bold text-gradient-primary">{v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
