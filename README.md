# FieldSuite · marketing site

Next.js 15 (App Router, **static export**) + Tailwind CSS, deployed to **Cloudflare Pages** with a **Cloudflare Pages Function** at `/api/lead` that calls **Resend**.

One parent landing page (`/` — FieldMate), full TreeMate product page (`/products/treemate`), and themed product pages for the rest of the family — PoolMate, FireMate, PestMate, HygieneMate, LocksmithMate.

**Light mode by default** with a one-tap dark toggle (sun/moon button in the nav). Brand palette is CSS-variable driven; per-product themes swap `--brand-50..950` on a `.theme-<slug>` wrapper.

```
src/
  app/
    layout.tsx              · root layout · Inter + JetBrains Mono + Fraunces · FOUC-safe theme init
    page.tsx                · FieldMate parent home
    products/[slug]/page.tsx· dynamic product route, statically prerendered for all 6 slugs
    legal/{privacy,terms}/  · legal stubs
    sitemap.ts              · auto sitemap from products data (force-static for output:export)
    not-found.tsx           · 404
    globals.css             · brand vars + light/dark surface tokens + per-product themes
    icon.svg                · favicon
  components/
    Nav.tsx                 · sticky nav with product mega-menu + ThemeToggle
    Footer.tsx              · footer with product list (light/dark)
    ThemeToggle.tsx         · sun/moon button — persists to localStorage.fm-theme
    Wordmark.tsx            · "FIELDSUITE" kicker + product name lockup
    RotatingHeadline.tsx    · hero industry rotator with Fraunces italic accent
    ProductCard.tsx         · grid card with brand-coloured glyph
    LeadForm.tsx            · POSTs to /api/lead, honeypot, light/dark
    marketing/
      DesktopDashboard.tsx  · wide app-mock used on every product page (the screenshot one)
      HowItRuns.tsx         · "From job to PDF, in four taps" 4-step section
      SimpleStrap.tsx       · the "SIMPLE CRM + JOB MANAGEMENT" chip
    phones/
      Phone.tsx, PhoneScreens.tsx · phone shell + screen mocks (still used in heroes)
    product/
      TreeMatePage.tsx      · bespoke long-form page (6 ad-concept sections)
      GenericProductPage.tsx· themable page for the other 5 products
  lib/
    products.ts             · single source of truth · feats[6], checklist[4], strip[4], pricing
    treemate-copy.ts        · concept-grouped copy for the bespoke TreeMate page
    cn.ts                   · class-name helper
functions/
  api/lead.ts               · Cloudflare Pages Function → Resend (light/dark agnostic)
  types.d.ts                · local Pages Function type stub
public/
  _headers                  · Cloudflare security + caching headers
  _redirects                · friendly slug redirects + legacy *Pro → *Mate
  robots.txt                · with sitemap pointer
```

---

## Local dev

```bash
npm install
npm run dev               # next dev on :3000
```

The lead form posts to `/api/lead`. `next dev` doesn't run Pages Functions; use the preview command below to exercise the form locally.

### Local preview against the deployed Function

```bash
npm run preview           # builds → wrangler pages dev ./out
```

`wrangler pages dev` auto-mounts `/functions/**` and exposes the static export with the live `/api/lead` endpoint at `http://localhost:8788`.

---

## Theme system — at a glance

- **Default = light.** First paint loads `<html class="light">` via the inline bootstrap script in `layout.tsx`.
- **Toggle** — the sun/moon `ThemeToggle` button in the Nav swaps `<html>` class and writes `localStorage.fm-theme = "light" | "dark"`.
- **Surface tokens** in `globals.css` (`--surface`, `--ink`, `--line`, etc.) are the only thing that changes between modes; brand vars are constant.
- **No FOUC** — the bootstrap script runs synchronously in `<head>` before paint. SSR-rendered HTML is theme-agnostic; class lands before CSS resolves.
- **Reduced-motion** — RotatingHeadline pauses, marquee disables, transitions clamp to 0.01ms.

Adding a new themed component? Use `bg-[rgb(var(--surface))]` / `text-[rgb(var(--ink))]` etc. for surfaces, and `text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]` where you need the brand colour to land legibly in both modes.

---

## Deploy — Cloudflare Pages

### One-time

1. Pages → Create → Connect to Git, point at this repo, branch `main`.
2. Build settings:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Node version**: `20`
3. **Environment variables** (Production + Preview):

   | Key | Value |
   |---|---|
   | `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxxxxxxxxxxx` |
   | `LEAD_TO_EMAIL` | `hello@fieldsuite.app` |
   | `LEAD_FROM_EMAIL` | `FieldSuite <noreply@fieldsuite.app>` |
   | `TURNSTILE_SECRET` | _(optional, if you bolt on a Turnstile widget)_ |

4. Verify your Resend sender domain (`fieldsuite.app`) — set the SPF, DKIM, and DMARC records Resend gives you in your Cloudflare DNS.

### Subsequent deploys

Push to `main` — Cloudflare builds and ships. The Pages Function in `functions/api/lead.ts` is auto-detected.

To deploy from your machine:

```bash
npm run deploy            # build + wrangler pages deploy ./out
```

(You'll need `wrangler login` once.)

### Custom domains

Pages → your project → **Custom domains**. Recommended primary: `fieldsuite.app`. Per-product subdomains (`treemate.app`, `firemate.app` etc.) can either point at the same Pages project (and rely on `_redirects` plus host-aware logic later) or at a dedicated Pages project per product if you want them fully separate.

---

## Adding a new product

1. Add an entry in `src/lib/products.ts` with `slug`, `name`, `industry`, `tone`, `brandHex`/`brandHexDeep`, `glyph`, `certs`, `strip[4]`, `feats[6]`, `checklist[4]`, `pricing`, `faq`, `bullets`.
2. Add a CSS theme block in `src/app/globals.css` under the `.theme-<slug>` pattern with the 11 brand-colour stops.
3. Add a `HERO[<slug>]` block in `src/components/product/GenericProductPage.tsx` (eyebrow, headline, italic accent, lede, ghost CTA).
4. The product card auto-renders on `/`; the dynamic route auto-prerenders at `/products/<slug>` via `generateStaticParams` in `src/app/products/[slug]/page.tsx`.

If a product needs deeper, hand-tuned marketing (like TreeMate), add a `<Slug>Page.tsx` in `src/components/product/` and route it explicitly in `src/app/products/[slug]/page.tsx`.

---

## Editing copy

- **Parent home**: `src/app/page.tsx`
- **TreeMate page**: `src/components/product/TreeMatePage.tsx` — pulls concept-grouped copy from `src/lib/treemate-copy.ts`
- **Other products**: `HERO` map at the top of `src/components/product/GenericProductPage.tsx`, plus the 6 numbered features in `src/lib/products.ts` (`feats` field)
- **Voice rules**:
  - Confident, plain-spoken, slightly cheeky. AU spellings on TreeMate; UK spellings on the rest.
  - **TreeMate** stays Aussie (AUD, "ute", "G'day", AS 4373).
  - **Everything else** runs UK voice (£, "van", BPCA / BS 8214 / BICSc / MLA / PWTAG).
  - Avoid: streamline, leverage, ecosystem, empower.

---

## What this site is *not*

- It's not the underlying SaaS apps. Those (React + Vite + Supabase, hosted on Railway) are built from `TreePro-Summary.md` in the parent folder — separate deploy.
- It's not the Facebook ad creatives. Those live in the design handoff (`design_handoff_fieldsuite/design/ads.jsx`) and ship as PNG exports to Meta Ads Manager — separate workstream.

---

## Stack notes

- **Static export** (`output: "export"`) keeps the entire site on Cloudflare's edge — no server runtime, no cold starts.
- Dynamic behaviour (lead form) is the **single Pages Function** at `/functions/api/lead.ts`.
- Brand palette is **CSS-variable driven** so per-product themes are one wrapper class.
- All icons are inline SVG — no icon-font payload, no extra HTTP requests.
- Fonts (`Inter`, `JetBrains Mono`, `Fraunces`) load via `next/font` with `display: swap` and self-hosted at build time.
- Tailwind consumes brand vars via `rgb(var(--brand-N) / <alpha>)`, so opacity modifiers like `bg-brand-500/40` just work — though most usage in this codebase reads tokens directly via `bg-[rgb(var(--brand-500)/.4)]` for clarity.

Run `npm run build` and you should see ~12 prerendered routes (`/`, the legal pages, `/products/treemate`, and one per other product).
