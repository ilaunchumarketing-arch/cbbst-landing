import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import { products as staticProducts, collectionMeta } from "@/data/products";
import { getAllShopifyProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Search | CBBST",
  description: "Search the full CBBST catalog — exclusives, graded slabs, original art, TCG, and more.",
};

// Live catalog, refreshed every 5 minutes.
export const revalidate = 300;

/** Builds the searchable text for a product: title, collection, creators, description. */
function haystack(p: (typeof staticProducts)[number]): string {
  const collTitle = collectionMeta[p.collection]?.title ?? p.collection;
  const creators = p.creators?.map((c) => `${c.name} ${c.role}`).join(" ") ?? "";
  return `${p.title} ${collTitle} ${p.collection} ${creators} ${p.description ?? ""}`.toLowerCase();
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const live = await getAllShopifyProducts();
  const catalog = live.length ? live : staticProducts;

  // Every word in the query must appear somewhere in the product's searchable text.
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = tokens.length
    ? catalog.filter((p) => {
        const hay = haystack(p);
        return tokens.every((t) => hay.includes(t));
      })
    : [];

  const desc = query
    ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`
    : "Type in the search bar to find any comic, slab, or variant in the catalog.";

  return (
    <CollectionPage
      customTitle={query ? `“${query}”` : "Search"}
      customTag="SEARCH RESULTS"
      customDesc={desc}
      products={results}
    />
  );
}
