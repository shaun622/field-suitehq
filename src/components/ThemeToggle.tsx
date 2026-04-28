"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "fm-theme";

function readInitial(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function apply(theme: Theme) {
  const html = document.documentElement;
  html.classList.toggle("dark", theme === "dark");
  html.classList.toggle("light", theme === "light");
  html.style.colorScheme = theme;
  try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* private mode */ }
}

interface Props {
  className?: string;
}

export function ThemeToggle({ className }: Props) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readInitial());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    apply(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={
        "relative w-9 h-9 rounded-full grid place-items-center transition border " +
        "bg-[rgb(var(--surface-card))] border-[rgb(var(--line))] hover:border-[rgb(var(--brand-400))] " +
        "text-[rgb(var(--ink-2))] hover:text-[rgb(var(--brand-600))] " +
        "dark:bg-white/[.04] dark:border-white/[.08] dark:text-white/70 " +
        "dark:hover:border-[rgb(var(--brand-400))] dark:hover:text-[rgb(var(--brand-400))] " +
        (className ?? "")
      }
    >
      {/* Pre-mount: render a neutral icon so SSR HTML doesn't disagree with first client paint */}
      {!mounted ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>
        </svg>
      ) : theme === "dark" ? (
        // currently dark → show sun (click to go light)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>
        </svg>
      ) : (
        // currently light → show moon (click to go dark)
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 13a8 8 0 1 1-9-11 6 6 0 0 0 9 11z"/>
        </svg>
      )}
    </button>
  );
}
