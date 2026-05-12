import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, MapPin, Award, Truck, AlertTriangle } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit";
import { suppliers } from "@/lib/mock-data";

export const Route = createFileRoute("/app/suppliers/$id")({
  component: SupplierProfile,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold">Supplier not found</h2>
      <Link to="/app/suppliers" className="mt-4 inline-block text-sm text-primary">← Back</Link>
    </div>
  ),
  loader: ({ params }) => {
    const s = suppliers.find((x) => x.id === params.id);
    if (!s) throw notFound();
    return { s };
  },
});

function SupplierProfile() {
  const { s } = Route.useLoaderData();
  return (
    <div>
      <Link to="/app/suppliers" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to suppliers
      </Link>

      <PageHeader
        title={s.name}
        subtitle={`${s.category} · Operating since 2017`}
        badge={s.verified && (
          <span className="flex items-center gap-1 rounded-md border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
            <ShieldCheck className="h-3 w-3" /> VERIFIED
          </span>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Risk Score</h2>
          <div className="mt-4 flex items-center gap-6">
            <div className="relative grid h-32 w-32 place-items-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(1 0 0 / 8%)" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#riskg)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(s.riskScore / 100) * 264} 264`} />
                <defs>
                  <linearGradient id="riskg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="oklch(0.62 0.22 18)" />
                    <stop offset="100%" stopColor="oklch(0.7 0.25 22)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center">
                <div className="text-3xl font-bold">{s.riskScore}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">/ 100</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">
                {s.name} shows {s.riskScore < 25 ? "an excellent" : s.riskScore < 45 ? "a moderate" : "an elevated"} risk profile based on
                trade history, on-chain Soroban activity, sanctions screening, and document integrity.
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <KPI icon={Award} label="Success Rate" value={`${s.successRate}%`} />
                <KPI icon={Truck} label="Avg Delivery" value={`${s.avgDeliveryDays}d`} />
                <KPI icon={MapPin} label="Country" value={s.country} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold">Verification</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              "Business registration confirmed",
              "Sanctions screening passed",
              "On-chain Stellar address verified",
              "Bank account validated (Wise)",
              s.verified ? "Independent inspection partner" : "Inspection pending",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {t}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 lg:col-span-3">
          <h2 className="text-lg font-bold">Recent Trade History</h2>
          <table className="mt-4 w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="pb-2 text-left font-medium">Deal</th><th className="pb-2 text-left">Counterparty</th><th className="pb-2 text-right">Amount</th><th className="pb-2 text-left">Outcome</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["DEAL-2104", "Lumen Apparel Inc.", 64200, "Released"],
                ["DEAL-2089", "Nordic Roasters AB", 41500, "Released"],
                ["DEAL-1992", "Albion Tea House", 18800, "Disputed"],
                ["DEAL-1881", "Helvetia Imports", 92300, "Released"],
              ].map(([id, party, amt, outcome]) => (
                <tr key={id as string}>
                  <td className="py-3 font-mono text-xs text-muted-foreground">{id}</td>
                  <td className="py-3">{party}</td>
                  <td className="py-3 text-right font-mono">${(amt as number).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${outcome === "Released" ? "border-success/30 bg-success/10 text-success" : "border-destructive/30 bg-destructive/10 text-destructive"}`}>
                      {outcome === "Disputed" && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                      {outcome as string}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}
