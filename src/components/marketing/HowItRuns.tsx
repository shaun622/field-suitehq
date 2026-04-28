import { Product } from "@/lib/products";
import { DesktopDashboard } from "./DesktopDashboard";

interface Props {
  product: Product;
  /** Override the default headline */
  headline?: React.ReactNode;
  /** Override the default eyebrow */
  eyebrow?: string;
  /** Optional sub-strap chip beneath the eyebrow on mobile */
  strapChip?: string;
}

export function HowItRuns({
  product,
  headline,
  eyebrow = "How a job runs",
  strapChip = "SIMPLE CRM + JOB MANAGEMENT — FOR ONE TRADE",
}: Props) {
  const h = headline ?? (
    <>
      From job to PDF, in <em className="font-display italic font-semibold not-italic-fallback" style={{ fontStyle: "italic" }}>four taps.</em>
    </>
  );

  return (
    <section className="relative py-20 lg:py-28 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface-2))] border-y border-[rgb(var(--line-2))] dark:border-white/[.04]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Dashboard preview */}
        <div className="lg:col-span-7 order-1 lg:order-1">
          <DesktopDashboard product={product} />
        </div>

        {/* Checklist + headline */}
        <div className="lg:col-span-5 order-2 lg:order-2 lg:pt-4">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[.18em] uppercase px-2.5 py-1 rounded-full bg-[rgb(var(--surface-card))] dark:bg-white/[.05] border border-[rgb(var(--line))] dark:border-white/[.08] text-[rgb(var(--ink-3))]">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: product.brandHex }}
              aria-hidden
            />
            {strapChip}
          </span>

          <div className="eyebrow mt-5 mb-4">{eyebrow}</div>

          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-[rgb(var(--ink))]">
            {h}
          </h2>

          <ol className="mt-8 space-y-6">
            {product.checklist.map((step, i) => (
              <li key={step.title} className="flex items-start gap-4">
                <span
                  className="grid place-items-center w-7 h-7 rounded-full text-white text-[12px] font-bold flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${product.brandHex}, ${product.brandHexDeep})`,
                    boxShadow: `0 6px 16px ${product.brandHex}40`,
                  }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div>
                  <div className="text-[rgb(var(--ink))] font-bold tracking-tight text-base">{step.title}</div>
                  <p className="mt-1.5 text-[rgb(var(--ink-2))] text-sm leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
