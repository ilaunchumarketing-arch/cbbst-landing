import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import { getProductsByCollection } from "@/data/products";
import { getShopifyCollectionProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Supplies — Superior Stands Display Gear | CBBST",
  description: "Display gear designed for graded slabs. Stop tossing your grail in a long box.",
};

export const revalidate = 300;

export default async function Page() {
  const live = await getShopifyCollectionProducts("supplies");
  const products = live.length ? live : getProductsByCollection("supplies");
  return <CollectionPage collection="supplies" products={products} />;
}
