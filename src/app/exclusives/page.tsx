import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import ExclusiveDropHero from "@/components/ExclusiveDropHero";
import { getProductsByCollection } from "@/data/products";
import { getShopifyCollectionProducts, getHeroDrops } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Exclusives — Variants You Won't Find Twice | CBBST",
  description: "Print runs of 450 to 666 copies. Variant artists you actually know. The kind of book you find once.",
};

export const revalidate = 300;

export default async function Page() {
  const [live, heroDrops] = await Promise.all([
    getShopifyCollectionProducts("exclusives"),
    getHeroDrops(1),
  ]);
  const products = live.length ? live : getProductsByCollection("exclusives");
  return (
    <CollectionPage
      collection="exclusives"
      products={products}
      topBanner={<ExclusiveDropHero drop={heroDrops[0]} />}
    />
  );
}
