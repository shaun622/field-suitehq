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

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, items.length]);

  const current = items[i];

  return (
    <h1
      className={cn(
        "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tightest leading-[0.98] text-white",
        className
      )}
    >
      {prefix}
      <span className="block mt-1 lg:mt-3 relative h-[1.05em] overflow-hidden">
        {items.map((it, idx) => (
          <span
            key={it.label}
            className={cn(
              "absolute inset-0 transition-all duration-500",
              idx === i ? "opacity-100 translate-y-0" :
                idx === (i - 1 + items.length) % items.length
                  ? "opacity-0 -translate-y-full"
                  : "opacity-0 translate-y-full"
            )}
            style={{ color: it.color, textShadow: `0 0 60px ${it.color}55` }}
            aria-hidden={idx !== i}
          >
            {it.label}.
          </span>
        ))}
        {/* Hidden ghost to size the box */}
        <span className="invisible">{current.label}.</span>
      </span>
      {suffix && <span className="block mt-1 lg:mt-3 text-white/85 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">{suffix}</span>}
    </h1>
  );
}
