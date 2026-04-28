import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, productBySlug } from "@/lib/products";
import { TreeProPage } from "@/components/product/TreeProPage";
import { GenericProductPage } from "@/components/product/GenericProductPage";

interface Params { slug: string; }

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} · ${product.industry}`,
    description: product.pitch,
    openGraph: {
      title: `${product.name} · ${product.tagline}`,
      description: product.pitch,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return notFound();

  if (product.slug === "treepro") return <TreeProPage product={product} />;
  return <GenericProductPage product={product} />;
}
