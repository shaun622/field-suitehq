import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

// Montserrat: geometric sans for italic accents in hero headlines,
// pricing numerals, and analytics chart labels. Italic is a tidy
// geometric slant — confident, not bouncy.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fieldsuite.app"),
  title: {
    default: "FieldSuite · Simple CRM + job management for the trades",
    template: "%s · FieldSuite",
  },
  description:
    "FieldSuite ships purpose-built CRM and job-management apps for trades — TreeMate, PoolMate, FireMate, PestMate, HygieneMate, LocksmithMate. One trade per app. Quote, schedule, invoice and get paid from your phone.",
  applicationName: "FieldSuite",
  keywords: [
    "field service software",
    "trade business app",
    "arborist software",
    "pool maintenance app",
    "fire-door inspection",
    "pest control software",
    "deep clean software",
    "locksmith CRM",
    "FieldSuite",
    "FieldMate",
  ],
  openGraph: {
    title: "FieldSuite · Simple CRM + job management for the trades",
    description:
      "Six dedicated apps. One trade each. Built mobile, priced for owner-operators.",
    type: "website",
    siteName: "FieldSuite",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07100a" },
    { media: "(prefers-color-scheme: light)", color: "#f8f6ef" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * FOUC-safe theme init. Runs synchronously before paint, reads
 * localStorage.fm-theme (or falls back to "light"), and applies the
 * matching class to <html>. Wrapped in IIFE so the local var doesn't
 * leak; try/catch swallows storage exceptions in private mode.
 */
const themeBootstrap = `
(function(){try{
  var s=localStorage.getItem('fm-theme');
  var m=(s==='dark'||s==='light')?s:'light';
  document.documentElement.classList.add(m);
  document.documentElement.style.colorScheme=m;
}catch(e){document.documentElement.classList.add('light');}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: themeBootstrap }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
