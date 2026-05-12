import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  badge,
  actions,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
  tone = "default",
  children,
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  delta?: string;
  hint?: string;
  tone?: "default" | "primary" | "success" | "warning";
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-surface/70 p-6 backdrop-blur",
        tone === "primary" && "bg-gradient-to-br from-primary/15 via-surface to-surface",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {label}
        </div>
        {delta && (
          <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4 text-4xl font-bold tracking-tight text-foreground">{value}</div>
      {hint && <div className="mt-2 text-xs text-muted-foreground">{hint}</div>}
      {children}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-3xl border border-border bg-surface/70 backdrop-blur", className)}>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "border-success/30 bg-success/10 text-success",
    funded: "border-primary/30 bg-primary/10 text-primary",
    production: "border-warning/30 bg-warning/10 text-warning",
    shipping: "border-primary/30 bg-primary/10 text-primary",
    delivered: "border-success/30 bg-success/10 text-success",
    released: "border-success/30 bg-success/10 text-success",
    disputed: "border-destructive/30 bg-destructive/10 text-destructive",
    draft: "border-border bg-muted/30 text-muted-foreground",
    pending: "border-border bg-muted/30 text-muted-foreground",
    in_progress: "border-warning/30 bg-warning/10 text-warning",
    completed: "border-success/30 bg-success/10 text-success",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        map[status] ?? "border-border bg-muted/30 text-muted-foreground",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.replace("_", " ")}
    </span>
  );
}
