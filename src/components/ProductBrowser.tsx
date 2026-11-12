"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "New Releases" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "az", label: "Alphabetically, A–Z" },
  { key: "za", label: "Alphabetically, Z–A" },
] as const;

type SortKey = (typeof SORTS)[number]["key"];

/** Client-side sort + availability filter for any collection grid. */
export default function ProductBrowser({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("featured");
  const [avail, setAvail] = useState<"all" | "instock">("all");

  const shown = useMemo(() => {
    let list = products.slice();
    if (avail === "instock") list = list.filter((p) => !p.soldOut);
    switch (sort) {
      case "newest": {
        // Newest drop first, by the date the book was published to the store (Shopify
        // `publishedAt` -> dropDate, falling back to `createdAt` -> listedDate). Books with
        // no date at all sort last rather than jumping to the front.
        const dropped = (p: Product) => Date.parse(p.dropDate ?? p.listedDate ?? "") || 0;
        list.sort((a, b) => dropped(b) - dropped(a));
        break;
      }
      case "price-asc":
        list.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "price-desc":
        list.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case "az":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Featured: in-stock first, original order otherwise.
        list.sort((a, b) => Number(!!a.soldOut) - Number(!!b.soldOut));
    }
    return list;
  }, [products, sort, avail]);

  const selectClass =
    "bg-cbbst-dark2 border border-white/15 text-white text-xs font-bold tracking-wide px-3 py-2 rounded hover:border-cbbst-red/60 focus:border-cbbst-red outline-none cursor-pointer transition-colors";

  return (
    <div className="max-w-7xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-8 pb-4 border-b border-white/10">
        <label className="flex items-center gap-2">
          <span className="text-white/45 text-[10px] font-black tracking-[0.3em]">SORT BY</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectClass}>
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-white/45 text-[10px] font-black tracking-[0.3em]">AVAILABILITY</span>
          <select value={avail} onChange={(e) => setAvail(e.target.value as "all" | "instock")} className={selectClass}>
            <option value="all">All</option>
            <option value="instock">In stock only</option>
          </select>
        </label>
        <span className="ml-auto text-white/40 text-xs font-bold tracking-wider">
          {shown.length} {shown.length === 1 ? "product" : "products"}
        </span>
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-20 text-white/40">No products match these filters.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {shown.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
