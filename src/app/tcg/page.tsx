import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import { getProductsByCollection } from "@/data/products";
import { getShopifyCollectionProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "TCG & Collectibles | CBBST",
  description: "Factory-sealed trading card game product and hard-to-find collectibles.",
};

export const revalidate = 300;

export default async function Page() {
  const live = await getShopifyCollectionProducts("tcg");
  const products = live.length ? live : getProductsByCollection("tcg");
  return <CollectionPage collection="tcg" products={products} />;
}
