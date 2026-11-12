import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import { getProductsByCollection } from "@/data/products";
import { getShopifyCollectionProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Graded Comics — CGC Slabs & Key Issues | CBBST",
  description: "CGC-graded slabs, signature series, and silver-age keys. From white-page Iron Man #128 to $3,600 Stan Lee signed grails.",
};

export const revalidate = 300;

export default async function Page() {
  const live = await getShopifyCollectionProducts("graded");
  const products = live.length ? live : getProductsByCollection("graded");
  return <CollectionPage collection="graded" products={products} />;
}
