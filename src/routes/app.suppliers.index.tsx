import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Search, ShieldCheck } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit";
import { suppliers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/suppliers/")({
  component: SuppliersList,
});

function SuppliersList() {
  return (
    <div>
      <PageHeader title="Suppliers" subtitle="Verified counterparties screened by the AstraPilot agent." />

      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-surface/60 px-4 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Search suppliers, regions, or categories…" className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((s) => (
          <Link key={s.id} to="/app/suppliers/$id" params={{ id: s.id }}>
            <Card className="group relative h-full p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-2xl">{s.flag}</div>
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">{s.country} · {s.category}</div>
                  </div>
                </div>
                {s.verified && (
                  <span className="flex items-center gap-1 rounded-md border border-success/30 bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">
                    <ShieldCheck className="h-3 w-3" /> VERIFIED
                  </span>
                )}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Mini label="Risk" value={s.riskScore} tone={s.riskScore > 50 ? "destructive" : s.riskScore > 30 ? "warning" : "success"} />
                <Mini label="Match" value={`${s.matchScore}%`} tone="primary" />
                <Mini label="Deals" value={s.totalDeals} />
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{s.successRate}% success</span>
                <span>~{s.avgDeliveryDays}d avg delivery</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "success" | "warning" | "destructive" | "primary" }) {
  const map = {
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    primary: "text-primary",
  } as const;
  return (
    <div className="rounded-xl border border-border bg-background/40 p-2">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-sm font-bold", tone && map[tone])}>{value}</div>
    </div>
  );
}
