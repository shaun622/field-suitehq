/**
 * ProductGallery — deep-screen panorama for products with detail screenshots.
 * Renders only if `product.screenshots.gallery` is populated. Each shot
 * sits inside a phone bezel so it reads as a real product screen, not stock.
 *
 * Tenant chrome is cropped off the top of every shot via the same
 * inset/margin-top trick used in DesktopDashboard.
 */
import Image from "next/image";
import { Product } from "@/lib/products";
import { cn } from "@/lib/cn";

interface Props {
  product: Product;
  /** Optional eyebrow override */
  eyebrow?: string;
  /** Optional headline override (supports React node for italic accent) */
  headline?: React.ReactNode;
  /** Optional intro paragraph */
  intro?: string;
}

const DEFAULT_HEADINGS: Partial<Record<Product["slug"], { eyebrow: string; headline: React.ReactNode; intro: string }>> = {
  firemate: {
    eyebrow: "Real screens · BS 8214 in your hand",
    headline: (
      <>
        Every door, every check,{" "}
        <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>
          on the device.
        </em>
      </>
    ),
    intro: "Door register, full 71-point assessment, site-level service record, premises management — all running on the same handset on the same site visit.",
  },
};

export function ProductGallery({ product, eyebrow, headline, intro }: Props) {
  const gallery = product.screenshots?.gallery;
  if (!gallery || gallery.length === 0) return null;

  const defaults = DEFAULT_HEADINGS[product.slug];
  const _eyebrow = eyebrow ?? defaults?.eyebrow ?? "Inside the app";
  const _headline = headline ?? defaults?.headline ?? "What it actually looks like.";
  const _intro = intro ?? defaults?.intro;

  // Mobile screenshots always come with ~140px of tenant chrome on top;
  // reuse that crop for every gallery item.
  const CROP_PX = 140;

  return (
    <section className={cn(`theme-${product.slug}`, "py-24 lg:py-32 bg-[rgb(var(--surface))] dark:bg-[rgb(var(--surface-2))]")}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-4">{_eyebrow}</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
            {_headline}
          </h2>
          {_intro && (
            <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              {_intro}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {gallery.map((shot) => {
            const aspectAfterCrop = (shot.height - CROP_PX) / shot.width;
            return (
              <figure key={shot.src} className="flex flex-col">
                <div
                  className="phone relative"
                  style={{ width: "100%", aspectRatio: `${shot.width} / ${shot.height - CROP_PX}` }}
                >
                  <div className="notch" aria-hidden />
                  <div className="phone-inner overflow-hidden" style={{ height: "100%" }}>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        paddingBottom: `${aspectAfterCrop * 100}%`,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={shot.src}
                        alt={shot.caption}
                        width={shot.width}
                        height={shot.height}
                        className="absolute inset-x-0 top-0 w-full h-auto pointer-events-none select-none"
                        style={{ marginTop: `-${(CROP_PX / shot.width) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <figcaption className="mt-4 text-sm text-[rgb(var(--ink-2))] leading-relaxed text-center">
                  {shot.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
