# Field Mate · marketing site

Next.js 15 (App Router, **static export**) + Tailwind CSS, deployed to **Cloudflare Pages** with a **Cloudflare Pages Function** at `/api/lead` that calls **Resend**.

One parent landing page (`/`), full TreePro product page (`/products/treepro`), and themed product pages for the rest of the family — PoolPro, FirePro, PestPro, HygienePro, LockPro.

```
src/
  app/
    layout.tsx              · root layout (Inter + JetBrains Mono)
    page.tsx                · Field Mate parent home
    products/[slug]/page.tsx· dynamic product route, statically prerendered
    legal/{privacy,terms}/  · legal stubs
    sitemap.ts              · auto sitemap from products data
    not-found.tsx           · 404
    globals.css             · brand tokens + per-product themes
    icon.svg                · favicon
  components/
    Nav.tsx                 · sticky nav with product mega-menu
    Footer.tsx              · footer with product list
    RotatingHeadline.tsx    · hero industry rotator
    ProductCard.tsx         · grid card with brand-coloured glyph
    LeadForm.tsx            · POSTs to /api/lead, honeypot + UX states
    Wordmark.tsx            · parent + product wordmark
    phones/                 · phone shell + screen mocks (themable)
    product/                · TreeProPage + GenericProductPage
  lib/
    products.ts             · single source of truth (slug, name, colour, …)
    treepro-copy.ts         · concept-grouped copy variants
    cn.ts                   · class-name helper
functions/
  api/lead.ts               · Cloudflare Pages Function → Resend
  types.d.ts                · local Pages Function type stub
public/
  _headers                  · Cloudflare security + caching headers
  _redirects                · friendly slug redirects
  robots.txt                · with sitemap pointer
```

---

## Local dev

```bash
npm install
npm run dev               # next dev on :3000
```

The lead form posts to `/api/lead`. In `next dev` that route only exists once you preview through Wrangler — see below — or you can stub it locally by running both servers (Next on 3000, Wrangler on 8788) and adjusting fetch URL during dev.

### Local preview against the deployed Function

```bash
npm run preview           # builds → wrangler pages dev ./out
```

`wrangler pages dev` auto-mounts `/functions/**` and exposes the static export with the live `/api/lead` endpoint at `http://localhost:8788`.

---

## Deploy — Cloudflare Pages

### One-time

1. Create the Pages project: **Workers & Pages → Create → Pages → Connect to Git** (or upload).
2. Build settings:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Node version**: `20`
3. **Environment variables** (Production + Preview):

   | Key | Value |
   |---|---|
   | `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxxxxxxxxxxx` |
   | `LEAD_TO_EMAIL` | `hello@fieldmate.app` |
   | `LEAD_FROM_EMAIL` | `Field Mate <noreply@fieldmate.app>` |
   | `TURNSTILE_SECRET` | (optional, if you bolt on a Turnstile widget) |

4. Verify your Resend sender domain (`fieldmate.app`) — set the SPF, DKIM, and DMARC records Resend gives you in your Cloudflare DNS.

### Subsequent deploys

Push to your default branch — Cloudflare builds and ships. The Pages Function in `functions/api/lead.ts` is auto-detected (no separate Worker setup).

To deploy from your machine instead:

```bash
npm run deploy            # build + wrangler pages deploy ./out
```

(You'll need `wrangler login` once.)

### Custom domain

Pages → your project → **Custom domains** → add `fieldmate.app`. Cloudflare points the apex automatically when DNS is on the same account.

---

## Adding a new product

1. Add an entry in `src/lib/products.ts` (slug, name, industry, brand hex, glyph, certs, bullets).
2. Add a CSS theme block in `src/app/globals.css` under the `.theme-<slug>` pattern with the 11 brand-colour stops.
3. Add a `VERTICAL_COPY[<slug>]` block in `src/components/product/GenericProductPage.tsx` (hero h1, sub, three paragraph blocks, FAQ).
4. The product card auto-renders on `/`; the route auto-prerenders at `/products/<slug>` via `generateStaticParams`.

If a product needs deeper, hand-tuned marketing (like TreePro), add a `<Slug>Page.tsx` in `src/components/product/` and route it explicitly in `src/app/products/[slug]/page.tsx`.

---

## Editing copy

- **Parent home**: `src/app/page.tsx`
- **TreePro page**: `src/components/product/TreeProPage.tsx` — pulls from `src/lib/treepro-copy.ts`
- **Other products**: `VERTICAL_COPY` map at the top of `src/components/product/GenericProductPage.tsx`
- **Voice rules** (carried over from the agency creative deck):
  - Confident, plain-spoken, slightly cheeky
  - AU spellings (organise, colour) for AU products; UK spellings for AWFS-style verticals
  - Avoid: streamline, leverage, ecosystem, empower
  - AUD/GST visible on AU products; £ + VAT on UK products

---

## What this site is *not*

- It is **not** the TreePro app itself. That app (Vite + React + Supabase, hosted on Railway) is built from `TreePro-Summary.md` in the parent folder.
- It is **not** the AWC Group / A. Wilkinson site. Those briefs live next door but are a separate brand operation.

---

## Stack notes

- **Static export** (`output: "export"`) keeps the entire site on Cloudflare's edge — no server runtime, no cold starts.
- Dynamic behaviour (lead form) is the **single Pages Function** at `/functions/api/lead.ts`. No serverless framework wrapper, no adapter.
- All icons are inline SVG — no icon-font payload, no extra HTTP request.
- Fonts (`Inter`, `JetBrains Mono`) load via `next/font` with `display: swap` and self-hosted at build time.
- Per-product themes are CSS-variable swaps (`--brand-50…950`) on a `.theme-<slug>` wrapper. Tailwind consumes via `rgb(var(--brand-N) / <alpha>)`, so opacity modifiers like `bg-brand-500/40` just work.

Run `npm run build` and you should see ~12 prerendered routes (`/`, the legal pages, `/products/treepro`, and one per other product).
