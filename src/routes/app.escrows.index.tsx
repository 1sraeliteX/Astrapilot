import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet, Plus, Search } from "lucide-react";
import { Card, PageHeader, StatusBadge } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { escrows } from "@/lib/mock-data";

export const Route = createFileRoute("/app/escrows/")({
  component: EscrowsList,
});

function EscrowsList() {
  return (
    <div>
      <PageHeader
        title="Escrows"
        subtitle="All Trustless Work contracts initialized through AstraPilot."
        actions={
          <Link to="/app/new-deal">
            <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow-primary">
              <Plus className="mr-2 h-4 w-4" /> New Escrow
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-surface/60 px-4 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Filter by ID, supplier, or buyer…" className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground" />
        <div className="flex gap-1 text-xs">
          {["All", "Active", "Disputed", "Released"].map((t, i) => (
            <button key={t} className={`rounded-full px-3 py-1 ${i === 0 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Escrow</th>
              <th className="px-5 py-3 text-left font-medium">Parties</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-right font-medium">Released</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-left font-medium">Risk</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {escrows.map((e) => (
              <tr key={e.id} className="hover:bg-surface-elevated/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><Wallet className="h-4 w-4" /></div>
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">{e.id}</div>
                      <div className="font-medium">{e.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs">
                  <div>{e.supplier} <span className="text-muted-foreground">({e.supplierCountry})</span></div>
                  <div className="text-muted-foreground">→ {e.buyer}</div>
                </td>
                <td className="px-5 py-4 text-right font-mono">${e.amount.toLocaleString()}</td>
                <td className="px-5 py-4 text-right font-mono text-success">${e.released.toLocaleString()}</td>
                <td className="px-5 py-4"><StatusBadge status={e.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full"
                        style={{ width: `${e.riskScore}%`, background: e.riskScore > 50 ? "oklch(0.62 0.24 25)" : e.riskScore > 30 ? "oklch(0.78 0.16 75)" : "oklch(0.7 0.16 165)" }} />
                    </div>
                    <span className="text-xs">{e.riskScore}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link to="/app/escrows/$id" params={{ id: e.id }} className="text-xs font-semibold text-primary hover:underline">View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
