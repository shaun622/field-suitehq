"use client";

import { useEffect, useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/cn";

interface Props {
  prefix: string;
  suffix?: string;
  intervalMs?: number;
  className?: string;
}

export function RotatingHeadline({ prefix, suffix, intervalMs = 2400, className }: Props) {
  const items = PRODUCTS.map((p) => ({
    label: p.industryShort,
    color: p.brandHex,
    name: p.name,
  }));

  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, items.length, reduced]);

  const current = items[i];

  return (
    <h1
      className={cn(
        "text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-extrabold tracking-tight leading-[0.98] text-[rgb(var(--ink))]",
        className
      )}
    >
      {prefix}
      <span className="block mt-1 lg:mt-3 relative h-[1.05em] overflow-hidden">
        {items.map((it, idx) => (
          <span
            key={it.label}
            className={cn(
              "absolute inset-0 transition-all duration-500 font-display italic font-semibold",
              idx === i ? "opacity-100 translate-y-0" :
                idx === (i - 1 + items.length) % items.length
                  ? "opacity-0 -translate-y-full"
                  : "opacity-0 translate-y-full"
            )}
            style={{
              color: it.color,
              textShadow: `0 0 60px ${it.color}33`,
              fontStyle: "italic",
            }}
            aria-hidden={idx !== i}
          >
            {it.label}.
          </span>
        ))}
        {/* Hidden ghost to size the box */}
        <span className="invisible font-display italic" style={{ fontStyle: "italic" }}>{current.label}.</span>
      </span>
      {suffix && (
        <span className="block mt-3 lg:mt-5 text-[rgb(var(--ink-2))] text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium leading-[1.25] tracking-tight max-w-3xl">
          {suffix}
        </span>
      )}
    </h1>
  );
}
