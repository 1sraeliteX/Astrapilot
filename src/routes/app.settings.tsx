import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Wallet, Bell, Globe2, KeyRound } from "lucide-react";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Workspace, wallet, and notification preferences." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-3"><Wallet className="h-5 w-5 text-primary" /><h2 className="text-lg font-bold">Wallet</h2></div>
          <p className="mt-2 text-sm text-muted-foreground">Connect a Stellar wallet (Freighter, Albedo, Lobstr) to deploy live escrows.</p>
          <Button className="mt-4 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">Connect Freighter</Button>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3"><KeyRound className="h-5 w-5 text-primary" /><h2 className="text-lg font-bold">Trustless Work API</h2></div>
          <p className="mt-2 text-sm text-muted-foreground">Bring your own API key to push escrows to your Trustless Work account.</p>
          <input placeholder="tw_live_•••••••••••••••" className="mt-3 h-11 w-full rounded-xl border border-border bg-background/40 px-3 font-mono text-sm" />
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3"><Bell className="h-5 w-5 text-primary" /><h2 className="text-lg font-bold">Notifications</h2></div>
          <div className="mt-3 space-y-2 text-sm">
            {["Milestone approvals", "Document verification results", "Risk alerts", "Dispute updates"].map((n) => (
              <label key={n} className="flex items-center justify-between rounded-xl border border-border bg-background/40 p-3">
                <span>{n}</span>
                <input type="checkbox" defaultChecked className="accent-[oklch(0.62_0.22_18)]" />
              </label>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3"><Globe2 className="h-5 w-5 text-primary" /><h2 className="text-lg font-bold">Workspace</h2></div>
          <div className="mt-3 space-y-3 text-sm">
            <Field label="Workspace name" value="AstraPilot Trading Co." />
            <Field label="Default currency" value="USDC" />
            <Field label="Network" value="Stellar Mainnet" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <input defaultValue={value} className="h-10 w-full rounded-xl border border-border bg-background/40 px-3 text-sm" />
    </div>
  );
}
