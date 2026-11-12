import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import { getShopifyCollectionByHandle } from "@/lib/shopify";

// Robert's "NYCC EXCLUSIVES" collection in Shopify (handle `nycc-exclusives`). He curates
// what's in it there; this page just shows it, so adding/removing a book in Shopify updates
// the page on its own within the 5-min revalidate window.
export const metadata: Metadata = {
  title: "NYCC Exclusives | CBBST",
  description: "Every New York Comic Con exclusive we carry, in one place.",
};

export const revalidate = 300;

export default async function Page() {
  const products = await getShopifyCollectionByHandle("nycc-exclusives");
  return (
    <CollectionPage
      customTitle="NYCC Exclusives"
      customTag="NEW YORK COMIC CON"
      customDesc="Every New York Comic Con exclusive we carry, in one place."
      products={products}
    />
  );
}
