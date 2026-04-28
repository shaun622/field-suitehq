import Link from "next/link";
import { Product } from "@/lib/products";
import { cn } from "@/lib/cn";

interface Props {
  product: Product;
  /** Larger variant for featured product */
  featured?: boolean;
}

export function ProductCard({ product, featured }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        `theme-${product.slug}`,
        "card card-glow group relative overflow-hidden p-6 lg:p-7 block",
        featured && "lg:p-9 lg:row-span-2"
      )}
    >
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-25 group-hover:opacity-40 transition-opacity duration-500 blur-3xl"
        style={{ background: `radial-gradient(circle, ${product.brandHex}, transparent 70%)` }}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="grid place-items-center rounded-2xl shadow-glow"
            style={{
              width: 56, height: 56,
              background: `linear-gradient(135deg, ${product.brandHex}, ${product.brandHexDeep})`,
              boxShadow: `0 8px 28px ${product.brandHex}55`,
            }}
            aria-hidden
          >
            <ProductGlyph glyph={product.glyph} size={32} />
          </span>
          <div>
            <div className="font-extrabold text-[rgb(var(--ink))] text-xl tracking-tight">{product.name}</div>
            <div className="font-mono text-[10px] tracking-[.2em] uppercase text-[rgb(var(--ink-3))] mt-0.5">
              {product.industryShort}
            </div>
          </div>
        </div>
        <StatusBadge status={product.status} />
      </div>

      <p className={cn("relative mt-5 text-[rgb(var(--ink-2))] leading-relaxed", featured ? "text-base" : "text-sm")}>
        {product.pitch}
      </p>

      <ul className="relative mt-5 space-y-2">
        {product.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm text-[rgb(var(--ink-2))]">
            <svg width="14" height="14" viewBox="0 0 14 14" className="mt-0.5 flex-shrink-0" style={{ color: product.brandHex }}>
              <path d="M2 7.5l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {product.certs.map((c) => (
            <span
              key={c}
              className="font-mono text-[10px] tracking-[.12em] uppercase px-2 py-1 rounded bg-[rgb(var(--surface-2))] dark:bg-white/[.04] border border-[rgb(var(--line))] dark:border-white/[.06] text-[rgb(var(--ink-3))]"
            >
              {c}
            </span>
          ))}
        </div>
        <span
          className="text-sm font-semibold flex items-center gap-1 transition-transform group-hover:translate-x-1"
          style={{ color: product.brandHex }}
        >
          Explore
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: Product["status"] }) {
  if (status === "live") {
    return (
      <span className="font-mono text-[10px] tracking-[.18em] uppercase px-2 py-1 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
      </span>
    );
  }
  if (status === "beta") {
    return (
      <span className="font-mono text-[10px] tracking-[.18em] uppercase px-2 py-1 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
        Private beta
      </span>
    );
  }
  return (
    <span className="font-mono text-[10px] tracking-[.18em] uppercase px-2 py-1 rounded bg-[rgb(var(--surface-2))] dark:bg-white/[.05] text-[rgb(var(--ink-3))] border border-[rgb(var(--line))] dark:border-white/[.08]">
      Coming soon
    </span>
  );
}

export function ProductGlyph({ glyph, size = 22 }: { glyph: Product["glyph"]; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" } as const;
  switch (glyph) {
    case "leaf":
      return (
        <svg {...common} stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 3v4a8 8 0 0 1-8 8H8a4 4 0 0 1-4-4V8a5 5 0 0 1 5-5h11z" fill="white" fillOpacity=".15"/>
          <path d="M4 20l8-9" />
        </svg>
      );
    case "droplet":
      return (
        <svg {...common}>
          <path d="M12 3c-3.5 4.5-7 8.2-7 12a7 7 0 1 0 14 0c0-3.8-3.5-7.5-7-12z" fill="white"/>
        </svg>
      );
    case "flame":
      return (
        <svg {...common}>
          <path d="M12 2c1.5 3 5 5 5 9.5a5 5 0 1 1-10 0c0-2 1.2-3.5 2.4-4.4-.5 2 .5 3.4 1.6 3.4-1-2 0-5 1-8.5z" fill="white"/>
        </svg>
      );
    case "bug":
      return (
        <svg {...common} stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none">
          <ellipse cx="12" cy="13" rx="5" ry="6" fill="white"/>
          <path d="M12 7V4M9 5L7 3M15 5l2-2M5 13H2M19 13h3M6 19l-2 2M18 19l2 2" />
        </svg>
      );
    case "spray":
      return (
        <svg {...common} fill="white">
          <rect x="9" y="9" width="6" height="11" rx="1.5"/>
          <rect x="10" y="5" width="4" height="3" rx="1"/>
          <circle cx="6" cy="4" r="1"/><circle cx="4" cy="7" r="1"/><circle cx="6" cy="10" r="1"/>
        </svg>
      );
    case "key":
      return (
        <svg {...common} fill="white">
          <circle cx="8" cy="12" r="3.5"/>
          <rect x="11" y="11" width="9" height="2" rx="0.6"/>
          <rect x="17" y="13" width="2" height="3" rx="0.6"/>
        </svg>
      );
  }
}
