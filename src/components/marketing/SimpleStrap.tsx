import { cn } from "@/lib/cn";

interface Props {
  variant?: "parent" | "product";
  className?: string;
  children?: React.ReactNode;
}

export function SimpleStrap({ variant = "parent", className, children }: Props) {
  const text =
    children ??
    (variant === "parent"
      ? "Simple CRM + job management for the trades."
      : "Simple CRM + job management — built for one trade.");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] tracking-[.14em] uppercase px-3 py-1.5 rounded-full",
        "bg-[rgb(var(--surface-card))] dark:bg-white/[.05] border border-[rgb(var(--line))] dark:border-white/[.08] text-[rgb(var(--ink-2))]",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--brand-500))]" aria-hidden />
      {text}
    </div>
  );
}
