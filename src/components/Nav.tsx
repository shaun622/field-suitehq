"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";
import { ProductGlyph } from "./ProductCard";
import { PRODUCTS, Product } from "@/lib/products";
import { cn } from "@/lib/cn";

interface Props {
  /** When set, renders the product wordmark in place of the parent + crumb */
  product?: Product;
}

export function Nav({ product }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out",
        scrolled
          ? "bg-ink-950/80 backdrop-blur-xl border-b border-white/[.06]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Wordmark size={20} />
          </Link>
          {product && (
            <>
              <span className="text-white/30 text-sm">/</span>
              <Link href={`/products/${product.slug}`} className="flex items-center">
                <Wordmark size={18} product={product} />
              </Link>
            </>
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          <div
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
            className="relative"
          >
            <button className="px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition flex items-center gap-1">
              Products
              <svg width="10" height="10" viewBox="0 0 10 10" className={cn("transition-transform", productsOpen && "rotate-180")}>
                <path d="M2 4l3 3 3-3" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[640px] transition-all duration-200",
                productsOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
              )}
            >
              <div className="bg-ink-900/95 backdrop-blur-xl border border-white/[.08] rounded-2xl p-3 shadow-deep grid grid-cols-2 gap-1">
                {PRODUCTS.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className={cn("theme-" + p.slug, "group flex items-start gap-3 p-3 rounded-xl hover:bg-white/[.04] transition")}
                  >
                    <span
                      className="grid place-items-center rounded-xl flex-shrink-0"
                      style={{
                        width: 36, height: 36,
                        background: `linear-gradient(135deg, ${p.brandHex}, ${p.brandHexDeep})`,
                        boxShadow: `0 6px 18px ${p.brandHex}40`,
                      }}
                      aria-hidden
                    >
                      <ProductGlyph glyph={p.glyph} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-white font-semibold text-sm flex items-center gap-2">
                        {p.name}
                        {p.status === "beta" && (
                          <span className="font-mono text-[9px] tracking-[.18em] uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">Beta</span>
                        )}
                      </div>
                      <div className="text-white/55 text-xs mt-0.5 leading-relaxed">{p.industry}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/#how" className="px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition">How it works</Link>
          <Link href="/#pricing" className="px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition">Pricing</Link>
          <Link href="/#story" className="px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition">Story</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Link href="/#contact" className="text-sm text-white/70 hover:text-white px-3 py-2">Sign in</Link>
          <Link href="/#contact" className="btn btn-primary text-sm">Get started →</Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg text-white/80 hover:bg-white/5"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {open ? (
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/[.06] bg-ink-950/95 backdrop-blur-xl">
          <div className="px-5 py-4 flex flex-col gap-1">
            <div className="text-xs uppercase tracking-[.2em] text-white/40 px-3 pt-1 pb-2 font-mono">Products</div>
            {PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5"
              >
                <span
                  className="grid place-items-center rounded-lg flex-shrink-0"
                  style={{
                    width: 30, height: 30,
                    background: `linear-gradient(135deg, ${p.brandHex}, ${p.brandHexDeep})`,
                  }}
                  aria-hidden
                >
                  <ProductGlyph glyph={p.glyph} />
                </span>
                <span className="text-white text-sm font-semibold">{p.name}</span>
                <span className="text-white/50 text-xs ml-auto">{p.industryShort}</span>
              </Link>
            ))}
            <div className="divider-dots my-3 mx-3" />
            <Link href="/#how" onClick={() => setOpen(false)} className="px-3 py-3 text-white/85 rounded-xl hover:bg-white/5">How it works</Link>
            <Link href="/#pricing" onClick={() => setOpen(false)} className="px-3 py-3 text-white/85 rounded-xl hover:bg-white/5">Pricing</Link>
            <Link href="/#story" onClick={() => setOpen(false)} className="px-3 py-3 text-white/85 rounded-xl hover:bg-white/5">Story</Link>
            <Link href="/#contact" onClick={() => setOpen(false)} className="btn btn-primary mt-3 self-start">Get started →</Link>
          </div>
        </div>
      )}
    </header>
  );
}
