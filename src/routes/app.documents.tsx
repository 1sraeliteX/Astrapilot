import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/documents")({ component: Docs });

function Docs() {
  const docs = [
    { name: "Bill_of_Lading_92341.pdf", type: "Bill of Lading", contract: "ESC-9942", status: "verified", date: "2 hr ago" },
    { name: "Commercial_Invoice_v2.pdf", type: "Commercial Invoice", contract: "ESC-1042", status: "verified", date: "5 hr ago" },
    { name: "QA_Inspection_Sept.pdf", type: "QA Inspection", contract: "ESC-992", status: "flagged", date: "1 d ago" },
    { name: "Certificate_Origin_BR.pdf", type: "Certificate of Origin", contract: "ESC-1042", status: "verified", date: "2 d ago" },
  ];
  return (
    <div>
      <PageHeader title="Document Intelligence" subtitle="AI-extracted terms, dates, and compliance checks for every uploaded document."
        actions={<Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"><Upload className="mr-2 h-4 w-4" /> Upload</Button>} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Recent Documents</h2>
          <div className="mt-4 space-y-2">
            {docs.map((d) => (
              <div key={d.name} className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${d.status === "verified" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {d.status === "verified" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">{d.type} · {d.contract} · {d.date}</div>
                </div>
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${d.status === "verified" ? "border-success/30 bg-success/10 text-success" : "border-destructive/30 bg-destructive/10 text-destructive"}`}>{d.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold">AI Extraction</h2>
          <div className="mt-3 space-y-3 text-sm">
            <Row label="Document" value="Bill_of_Lading_92341" />
            <Row label="Issuer" value="Maersk Line A/S" />
            <Row label="Vessel" value="Maersk Sentosa V.2417" />
            <Row label="POL" value="Yantian, CN" />
            <Row label="POD" value="Long Beach, US" />
            <Row label="ETD" value="Nov 03, 2026" />
            <Row label="ETA" value="Nov 23, 2026" />
            <Row label="Cargo Value" value="$125,000" />
          </div>
          <Button variant="outline" className="mt-4 w-full border-border"><FileText className="mr-2 h-4 w-4" /> Open Document</Button>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-1.5"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>
  );
}
