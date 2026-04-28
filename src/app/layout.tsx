import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fieldmate.app"),
  title: {
    default: "Field Mate · Software for the people who do the work",
    template: "%s · Field Mate",
  },
  description:
    "Field Mate ships purpose-built business apps for trades and field services — TreePro, PoolPro, FirePro, PestPro, HygienePro, LockPro. Quote, schedule, invoice and get paid from your phone.",
  applicationName: "Field Mate",
  keywords: [
    "field service software",
    "trade business app",
    "arborist software",
    "pool maintenance app",
    "fire safety inspection",
    "pest control software",
    "tradie crm",
    "Australia",
  ],
  openGraph: {
    title: "Field Mate · Software for the people who do the work",
    description:
      "Six field-first apps for the trades that don't get well-served by generic CRMs. Built mobile, priced for owner-operators.",
    type: "website",
    siteName: "Field Mate",
    locale: "en_AU",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07100a" },
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
