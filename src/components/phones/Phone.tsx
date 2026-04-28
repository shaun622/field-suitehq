import { cn } from "@/lib/cn";

interface Props {
  width?: number;
  height?: number;
  tilt?: number;
  className?: string;
  children: React.ReactNode;
}

export function Phone({ width = 320, height = 660, tilt = 0, className, children }: Props) {
  return (
    <div
      className={cn("phone", className)}
      style={{
        width, height,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
      }}
    >
      <div className="notch" aria-hidden />
      {children}
    </div>
  );
}

export function StatusBar({ time = "9:41", light = false }: { time?: string; light?: boolean }) {
  return (
    <div className="flex items-center justify-between px-7 pt-3.5 pb-1.5 text-[13px] font-semibold tnum"
         style={{ color: light ? "#0c1812" : "#fff" }}>
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <rect x="0" y="6" width="3" height="5" rx="0.5" fill="currentColor"/>
          <rect x="4.5" y="4" width="3" height="7" rx="0.5" fill="currentColor"/>
          <rect x="9" y="2" width="3" height="9" rx="0.5" fill="currentColor"/>
          <rect x="13" y="0" width="3" height="11" rx="0.5" fill="currentColor"/>
        </svg>
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
          <path d="M7 1.5C9.4 1.5 11.6 2.4 13.2 3.9L12.3 4.9C10.9 3.6 9 2.8 7 2.8S3.1 3.6 1.7 4.9L0.8 3.9C2.4 2.4 4.6 1.5 7 1.5ZM7 4.5C8.6 4.5 10.1 5.1 11.2 6.1L10.3 7.1C9.4 6.3 8.2 5.8 7 5.8S4.6 6.3 3.7 7.1L2.8 6.1C3.9 5.1 5.4 4.5 7 4.5Z" fill="currentColor"/>
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
          <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="currentColor" opacity=".5"/>
          <rect x="2" y="2" width="14" height="7" rx="1" fill="currentColor"/>
          <rect x="21" y="3.5" width="1.5" height="4" rx="0.5" fill="currentColor" opacity=".5"/>
        </svg>
      </div>
    </div>
  );
}

export function TabBar({
  tabs,
  light = false,
}: {
  tabs: { label: string; active?: boolean }[];
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute left-3 right-3 bottom-3 h-16 rounded-[22px] grid grid-cols-5 items-center backdrop-blur-xl border z-10",
        light
          ? "bg-white/95 border-black/5 shadow-[0_8px_28px_rgba(7,16,10,.08)]"
          : "bg-ink-950/80 border-white/[.06]"
      )}
    >
      {tabs.map((t) => (
        <div key={t.label} className="grid place-items-center gap-1 text-[9px] tracking-[.14em] uppercase font-semibold"
             style={{ color: t.active ? "rgb(var(--brand-400))" : (light ? "rgba(7,16,10,.45)" : "rgba(255,255,255,.4)") }}>
          <div
            className={cn("w-[22px] h-[22px] rounded-[7px]", light ? "bg-black/5" : "bg-white/10")}
            style={t.active ? { background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))" } : undefined}
          />
          {t.label}
        </div>
      ))}
    </div>
  );
}

export function Fab() {
  return (
    <div
      className="absolute right-[18px] bottom-[96px] w-14 h-14 rounded-[18px] grid place-items-center text-3xl text-white font-light z-10"
      style={{
        background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))",
        boxShadow: "0 8px 28px rgb(var(--brand-500) / .35)",
      }}
    >+</div>
  );
}
