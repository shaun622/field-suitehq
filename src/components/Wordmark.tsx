import { cn } from "@/lib/cn";
import { Product } from "@/lib/products";

interface Props {
  size?: number;
  /** When omitted, renders the parent "Field Mate" wordmark */
  product?: Product;
  className?: string;
  monoSuffix?: string;
}

const GLYPH_PATH: Record<string, React.ReactNode> = {
  leaf: (
    <path d="M12 3c-4.97 0-9 4.03-9 9 0 4.97 4.03 9 9 9 4.97 0 9-4.03 9-9 0-1.4-.32-2.73-.89-3.92M21 3l-9 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
  ),
  droplet: (
    <path d="M12 3c-3 4.5-6 8.5-6 11.5a6 6 0 1 0 12 0c0-3-3-7-6-11.5z" fill="white"/>
  ),
  flame: (
    <path d="M12 3c1.5 3 4.5 5 4.5 9a4.5 4.5 0 1 1-9 0c0-2 1-3 2-4-.5 2 .5 3 1.5 3-1-2 0-5 1-8z" fill="white"/>
  ),
  bug: (
    <g stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none">
      <ellipse cx="12" cy="13" rx="5" ry="6" fill="white" stroke="none"/>
      <path d="M12 7V4M9 5l-2-2M15 5l2-2M5 13H2M19 13h3M6 19l-2 2M18 19l2 2"/>
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
      <rect x="11" y="11" width="9" height="2" rx="0.6"/>
      <rect x="17" y="11" width="2" height="4" rx="0.6"/>
    </g>
  ),
};

export function Wordmark({ size = 24, product, className, monoSuffix }: Props) {
  const label = product ? product.name : "Field Mate";
  const glyph = product ? GLYPH_PATH[product.glyph] : GLYPH_PATH.leaf;
  const themeClass = product ? `theme-${product.slug}` : "";

  return (
    <span
      className={cn("fm-wordmark", themeClass, className)}
      style={{ fontSize: size }}
      aria-label={label}
    >
      <span className="fm-mark" aria-hidden>
        <svg viewBox="0 0 24 24" width="68%" height="68%" style={{ display: "block" }}>
          {glyph}
        </svg>
      </span>
      <span className="fm-wordmark-text">{label}</span>
      {monoSuffix && (
        <span className="font-mono text-[0.55em] tracking-[.2em] uppercase text-white/45 ml-1">
          {monoSuffix}
        </span>
      )}
    </span>
  );
}
