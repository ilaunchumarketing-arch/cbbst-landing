import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import { getProductsByCollection } from "@/data/products";
import { getShopifyCollectionProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Original Art — One-of-One Cover Pieces | CBBST",
  description: "The actual artwork. Hand-drawn, hand-inked, irreplaceable. One copy in the world.",
};

export const revalidate = 300;

export default async function Page() {
  const live = await getShopifyCollectionProducts("original-art");
  const products = live.length ? live : getProductsByCollection("original-art");
  return <CollectionPage collection="original-art" products={products} />;
}
