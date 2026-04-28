import { cn } from "@/lib/cn";
import { Product } from "@/lib/products";

interface Props {
  /** Mark size in px */
  markSize?: number;
  /** When omitted, renders the parent "FieldMate" wordmark */
  product?: Product;
  className?: string;
  /** Show the small "FIELDSUITE" / "by FieldSuite" kicker line */
  showKicker?: boolean;
}

const GLYPH_PATH: Record<string, React.ReactNode> = {
  leaf: (
    <path d="M20 3v4a8 8 0 0 1-8 8H8a4 4 0 0 1-4-4V8a5 5 0 0 1 5-5h11z M4 20l8-9"
      stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  droplet: (
    <path d="M12 3c-3.5 4.5-7 8.2-7 12a7 7 0 1 0 14 0c0-3.8-3.5-7.5-7-12z" fill="white"/>
  ),
  flame: (
    <path d="M12 2c1.5 3 5 5 5 9.5a5 5 0 1 1-10 0c0-2 1.2-3.5 2.4-4.4-.5 2 .5 3.4 1.6 3.4-1-2 0-5 1-8.5z" fill="white"/>
  ),
  bug: (
    <g stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none">
      <ellipse cx="12" cy="13" rx="5" ry="6" fill="white"/>
      <path d="M12 7V4M9 5L7 3M15 5l2-2M5 13H2M19 13h3M6 19l-2 2M18 19l2 2"/>
    </g>
  ),
  spray: (
    <g fill="white">
      <rect x="9" y="9" width="6" height="11" rx="1.5"/>
      <rect x="10" y="5" width="4" height="3" rx="1"/>
      <circle cx="6" cy="4" r="1"/><circle cx="4" cy="7" r="1"/><circle cx="6" cy="10" r="1"/>
    </g>
  ),
  key: (
    <g fill="white">
      <circle cx="8" cy="12" r="3.2"/>
      <rect x="11" y="11" width="9" height="2" rx=".6"/>
      <rect x="17" y="13" width="2" height="3" rx=".6"/>
    </g>
  ),
  /* Parent (FieldMate) — abstract canopy/site stamp */
  parent: (
    <g fill="white">
      <circle cx="12" cy="9" r="4"/>
      <circle cx="7" cy="14" r="3"/>
      <circle cx="17" cy="14" r="3"/>
      <rect x="11" y="14" width="2" height="6" rx=".6"/>
    </g>
  ),
};

export function Wordmark({
  markSize = 32,
  product,
  className,
  showKicker = true,
}: Props) {
  const isParent = !product;
  const label = isParent ? "FieldMate" : product.name;
  const kicker = isParent ? "FIELDSUITE" : "BY FIELDSUITE";
  const themeClass = product ? `theme-${product.slug}` : "";
  const glyphKey = isParent ? "parent" : product.glyph;

  return (
    <span
      className={cn("fm-wordmark", themeClass, className)}
      style={{ fontSize: markSize * 0.5 }}
      aria-label={`${kicker} · ${label}`}
    >
      <span
        className="fm-mark"
        style={{ width: markSize, height: markSize }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" width="60%" height="60%" style={{ display: "block" }}>
          {GLYPH_PATH[glyphKey]}
        </svg>
      </span>
      {showKicker ? (
        <span className="fm-wordmark-stack">
          <span className="fm-wordmark-kicker">{kicker}</span>
          <span className="fm-wordmark-name" style={{ fontSize: markSize * 0.45 }}>{label}</span>
        </span>
      ) : (
        <span className="fm-wordmark-name" style={{ fontSize: markSize * 0.55 }}>{label}</span>
      )}
    </span>
  );
}
