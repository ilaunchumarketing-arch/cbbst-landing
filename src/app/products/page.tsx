import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import { products as staticProducts } from "@/data/products";
import { getAllShopifyProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "All Products | CBBST",
  description: "The complete CBBST catalog. Exclusive variants, graded slabs, original art, TCG, and display gear.",
};

// Revalidate the catalog every 5 minutes (live from Shopify).
export const revalidate = 300;

export default async function Page() {
  const live = await getAllShopifyProducts();
  const products = live.length ? live : staticProducts;
  return (
    <CollectionPage
      customTitle="All Products"
      customTag="THE COMPLETE CATALOG"
      customDesc="Every exclusive variant, every graded slab, every piece of original art, every display stand — all in one place."
      products={products}
    />
  );
}
