import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, ShoppingCart, Wallet, Mail, ArrowRight, Sparkles } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const [role, setRole] = useState<"supplier" | "buyer" | null>(null);
  return (
    <div className="relative grid min-h-screen place-items-center px-6">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.62_0.22_18/30%),transparent)]" />
      <div className="relative w-full max-w-xl">
        <div className="mb-8 flex justify-center"><AppLogo size={40} /></div>
        <div className="rounded-3xl border border-border bg-surface/80 p-8 backdrop-blur-xl shadow-[var(--shadow-elegant)]">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Get started
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Join AstraPilot</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose your role — you can switch later. Trade agreements are peer-to-peer; AstraPilot never custodies funds.</p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <RoleCard active={role === "supplier"} onClick={() => setRole("supplier")} icon={Building2} title="Supplier / Exporter" desc="Sell goods cross-border, get paid as milestones complete." />
            <RoleCard active={role === "buyer"} onClick={() => setRole("buyer")} icon={ShoppingCart} title="Buyer / Importer" desc="Source verified suppliers, pay only when conditions are met." />
          </div>

          <div className="mt-6 space-y-2">
            <Button className="h-11 w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow-primary">
              <Wallet className="mr-2 h-4 w-4" /> Continue with Stellar Wallet
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-11 border-border"><Mail className="mr-2 h-4 w-4" /> Email</Button>
              <Button variant="outline" className="h-11 border-border">Continue with Google</Button>
            </div>
          </div>

          <Link to="/app" className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            Skip for now — explore demo dashboard <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, icon: Icon, title, desc }: { active: boolean; onClick: () => void; icon: typeof Building2; title: string; desc: string }) {
  return (
    <button onClick={onClick} className={cn(
      "rounded-2xl border bg-background/40 p-4 text-left transition-all hover:-translate-y-0.5",
      active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40",
    )}>
      <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
      <div className="mt-3 text-sm font-bold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}
