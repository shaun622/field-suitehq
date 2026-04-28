import { Product } from "@/lib/products";
import { AppDashboardLive } from "./AppDashboardLive";

interface Props {
  product: Product;
  /** Override the default headline */
  headline?: React.ReactNode;
  /** Override the default eyebrow */
  eyebrow?: string;
  /** Optional strap chip above the headline */
  strapChip?: string;
}

/**
 * The "live preview" section dropped under each product hero.
 *
 * Layout: centred title block (strap chip · eyebrow · big headline · live-preview
 * caption) acting as the heading for the interactive dashboard, then the
 * full-width 8-tab AppDashboardLive below. The 4-step checklist that used to
 * sit beside the dashboard has been removed — every product page already has
 * a dedicated full pipeline section further down.
 */
export function HowItRuns({
  product,
  headline,
  eyebrow = "How a job runs",
  strapChip = "SIMPLE CRM + JOB MANAGEMENT — FOR ONE TRADE",
}: Props) {
  const h = headline ?? (
    <>
      From job to PDF, in{" "}
      <em
        className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]"
        style={{ fontStyle: "italic" }}
      >
        four taps.
      </em>
    </>
  );

  return (
    <section className="relative py-20 lg:py-28 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface-2))] border-y border-[rgb(var(--line-2))] dark:border-white/[.04]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Centred title block — heads the interactive dashboard below */}
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[.18em] uppercase px-2.5 py-1 rounded-full bg-[rgb(var(--surface-card))] dark:bg-white/[.05] border border-[rgb(var(--line))] dark:border-white/[.08] text-[rgb(var(--ink-3))]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: product.brandHex }} aria-hidden />
            {strapChip}
          </span>

          <div className="eyebrow justify-center mt-5 mb-4">{eyebrow}</div>

          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-[rgb(var(--ink))]">
            {h}
          </h2>

          <div className="mt-5 font-mono text-[10px] tracking-[.18em] uppercase text-[rgb(var(--ink-3))]">
            Live preview · {product.name} dashboard · click any tab
          </div>
        </div>

        {/* Interactive dashboard preview */}
        <div className="rounded-2xl border border-[rgb(var(--line))] dark:border-white/[.08] bg-[rgb(var(--surface))] dark:bg-[#0a0e14] shadow-2xl overflow-hidden">
          <AppDashboardLive product={product} />
        </div>
      </div>
    </section>
  );
}
