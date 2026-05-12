import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Wallet } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/new-deal")({ component: NewDeal });

const STEPS = ["Trade Details", "Parties", "Milestones", "Documents", "Escrow Preview", "Deploy"];

function NewDeal() {
  const [step, setStep] = useState(0);
  return (
    <div>
      <PageHeader title="New Deal" subtitle="Initialize a Trustless Work escrow contract on Stellar." />
      <Card className="p-6">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={cn("grid h-8 w-8 place-items-center rounded-full text-xs font-bold border-2",
                i < step && "border-primary bg-primary text-primary-foreground",
                i === step && "border-primary text-primary",
                i > step && "border-border text-muted-foreground")}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <div className={cn("hidden text-xs font-medium md:block", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</div>
              {i < STEPS.length - 1 && <div className={cn("h-0.5 flex-1", i < step ? "bg-primary" : "bg-border")} />}
            </div>
          ))}
        </div>

        <div className="mt-8 min-h-[320px]">
          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Deal Title" placeholder="Shenzhen Solar Panels Q4" />
              <Field label="Commodity" placeholder="Solar Panels — 280W Mono" />
              <Field label="Amount (USDC)" placeholder="50,000" />
              <Field label="Origin → Destination" placeholder="Shenzhen → Los Angeles" />
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Buyer (Payer)" placeholder="AstraPilot Trading Co." />
              <Field label="Supplier (Payee)" placeholder="Shenzhen TechSolar Ltd." />
              <Field label="Arbiter" placeholder="Kleros (default)" />
              <Field label="Inspection Partner" placeholder="SGS / Optional" />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-2">
              {[
                { name: "Initial Deposit", percent: 30 },
                { name: "Production / QA", percent: 30 },
                { name: "Bill of Lading", percent: 30 },
                { name: "Delivery", percent: 10 },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{m.percent}%</div>
                  <div className="flex-1 text-sm font-medium">{m.name}</div>
                  <div className="font-mono text-sm text-muted-foreground">${(50000 * m.percent / 100).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="grid gap-3 md:grid-cols-2">
              {["Commercial Invoice", "Purchase Order", "Bill of Lading (Ocean)", "QA Inspection Report", "Certificate of Origin"].map((d) => (
                <label key={d} className="flex items-center gap-2 rounded-xl border border-border bg-background/40 p-3 text-sm">
                  <input type="checkbox" defaultChecked className="accent-[oklch(0.62_0.22_18)]" /> {d}
                </label>
              ))}
            </div>
          )}
          {step === 4 && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-primary">Trustless Work Contract Preview</div>
              <pre className="mt-3 overflow-auto rounded-xl bg-background/60 p-4 font-mono text-[11px]">
{`network: stellar-mainnet
asset: USDC
amount: 50000
buyer: GBUYER...XYZ
supplier: GSUPPLIER...ABC
arbiter: GARBITER...KLR
milestones: 4
timeout: 21d
estimated_fee: 100 XLM`}
              </pre>
            </div>
          )}
          {step === 5 && (
            <div className="grid place-items-center py-8 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground glow-primary">
                <Wallet className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-2xl font-bold">Connect wallet to deploy</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">Sign the transaction in Freighter to lock funds in the Trustless Work escrow contract on Stellar.</p>
              <Button className="mt-5 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">Deploy Escrow</Button>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="border-border">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
              Continue <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Link to="/app/escrows"><Button variant="outline" className="border-border">Done</Button></Link>
          )}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <input placeholder={placeholder} className="h-11 w-full rounded-xl border border-border bg-background/40 px-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40" />
    </label>
  );
}
