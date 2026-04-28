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
 * Live-preview section dropped under each product hero.
 *
 * Layout: centred title block (strap · eyebrow · headline) → bouncing
 * "click any tab" hint that bridges to the dashboard frame → full-width
 * 8-tab AppDashboardLive. The hint plus the bordered dashboard panel
 * are sized + spaced to read as a single interactive demo unit.
 */
export function HowItRuns({
  product,
  headline,
  eyebrow = "How a job runs",
  strapChip = "SIMPLE CRM + JOB MANAGEMENT FOR THE TRADES",
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
        {/* Centred title block */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[.18em] uppercase px-2.5 py-1 rounded-full bg-[rgb(var(--surface-card))] dark:bg-white/[.05] border border-[rgb(var(--line))] dark:border-white/[.08] text-[rgb(var(--ink-3))]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: product.brandHex }} aria-hidden />
            {strapChip}
          </span>

          <div className="eyebrow justify-center mt-5 mb-4">{eyebrow}</div>

          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-[rgb(var(--ink))]">
            {h}
          </h2>

          <p className="mt-5 text-base lg:text-lg text-[rgb(var(--ink-2))] leading-relaxed">
            The real <span className="font-semibold text-[rgb(var(--ink))]">{product.name}</span> dashboard, running live. Click any tab.
          </p>
        </div>

        {/* Visual bridge: bouncing hint chip pointing down at the dashboard */}
        <div className="flex justify-center mb-3 lg:mb-4">
          <div className="demo-hint-wrap">
            <div className="demo-hint">
              <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 8px rgb(255 255 255 / .8)" }} />
              Try it · click any tab
              <span aria-hidden style={{ marginLeft: 4, fontSize: 13 }}>↓</span>
            </div>
          </div>
        </div>

        {/* Interactive dashboard — bordered panel reads as the demo target */}
        <div className="rounded-2xl border-2 border-[rgb(var(--brand-500))]/40 dark:border-[rgb(var(--brand-500))]/30 bg-[rgb(var(--surface))] dark:bg-[#0a0e14] shadow-2xl overflow-hidden ring-1 ring-[rgb(var(--brand-500))]/10">
          <AppDashboardLive product={product} />
        </div>
      </div>
    </section>
  );
}
