import Link from "next/link";
import type { ReactNode } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductBrowser from "@/components/ProductBrowser";
import { Product, collectionMeta, Collection } from "@/data/products";

type Props = {
  collection?: Collection;
  customTitle?: string;
  customTag?: string;
  customDesc?: string;
  products: Product[];
  /** Optional banner rendered full-width right under the navbar (e.g. a drop hero). */
  topBanner?: ReactNode;
};

export default function CollectionPage({
  collection,
  customTitle,
  customTag,
  customDesc,
  products,
  topBanner,
}: Props) {
  const meta = collection ? collectionMeta[collection] : null;
  const title = customTitle ?? meta?.title ?? "Products";
  const tag = customTag ?? meta?.tag ?? "";
  const desc = customDesc ?? meta?.desc ?? "";

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      {topBanner}
      <main className="bg-cbbst-dark text-white">
        {/* HERO */}
        <section className="relative py-20 sm:py-28 px-6 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-cbbst-dark to-cbbst-dark2" />
          <div className="absolute -top-32 -left-32 h-[36rem] w-[36rem] rounded-full bg-cbbst-red/15 blur-[140px] animate-float-slow pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 h-[36rem] w-[36rem] rounded-full bg-cbbst-gold/8 blur-[140px] animate-float-slow pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-[2px] bg-cbbst-red/40 animate-scanline" />
          <div className="absolute inset-0 halftone-overlay opacity-10" />

          <div className="relative max-w-5xl mx-auto text-center">
            {tag && (
              <div className="text-cbbst-red text-[10px] font-black tracking-[0.4em] mb-4 animate-flicker">
                {tag}
              </div>
            )}
            <h1 className="text-white font-black italic text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.85]">
              {title.toUpperCase()}
            </h1>
            {desc && (
              <p className="text-white/65 text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                {desc}
              </p>
            )}
            <div className="mt-6 inline-flex items-center gap-3 border border-white/10 px-4 py-2">
              <span className="text-white/40 text-[10px] tracking-widest font-bold">SHOWING</span>
              <span className="text-cbbst-gold font-black text-lg">{products.length}</span>
              <span className="text-white/40 text-[10px] tracking-widest font-bold">PRODUCTS</span>
            </div>
          </div>
        </section>

        {/* GRID + sort/filter toolbar */}
        <section className="py-12 sm:py-16 px-6">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">No products in this collection yet.</p>
              <Link href="/exclusives" className="inline-block mt-6 text-cbbst-red font-black text-xs tracking-[0.3em] hover:underline">
                BROWSE EXCLUSIVES →
              </Link>
            </div>
          ) : (
            <ProductBrowser products={products} />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
