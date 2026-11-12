import Link from "next/link";
import Image from "next/image";
import { getNewestProducts, sortDropOrder } from "@/lib/shopify";
import { getProductsByCollection, formatPrice, type Product } from "@/data/products";

/**
 * Homepage "HOT RIGHT NOW / FEATURED PRODUCTS" — the 9 newest books in the Exclusives
 * collection, live from Shopify.
 *
 * ORDER and BADGES are both DATA-DRIVEN — nothing about a specific book is written here:
 *   order  → sortDropOrder(): COMING SOON first, then live exclusives, then sold out;
 *            newest Shopify `createdAt` first inside each band (stable, same every render).
 *   badge  → the product's real Shopify state: coming-soon tag → COMING SOON,
 *            availableForSale → NEW DROP (the newest live book) / EXCLUSIVE,
 *            otherwise SOLD OUT.
 * So when the client flips a held book to live in Shopify it moves out of the COMING SOON
 * band into the live band on its own — the other held books and the layout are untouched.
 *
 * Falls back to the curated catalog if the Shopify fetch fails. Cached 5 min; the Shopify
 * product webhook busts it instantly on an edit.
 */
export default async function FeaturedProducts() {
  const live = await getNewestProducts("exclusives", 9);
  const products: Product[] = live.length
    ? live
    : sortDropOrder(getProductsByCollection("exclusives")).slice(0, 9);

  // "NEW DROP" belongs to the newest book that is actually BUYABLE — a positional
  // `index === 0` would hang it on whatever sorted first, including a sold-out book.
  const newDropSlug = products.find((p) => !p.soldOut)?.slug;

  return (
    <section className="bg-cbbst-dark py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-cbbst-red text-xs font-bold tracking-widest">HOT RIGHT NOW</span>
          <h2 className="text-white font-black text-3xl sm:text-4xl tracking-tight mt-2">FEATURED PRODUCTS</h2>
          <p className="text-white/50 text-sm mt-2">
            The newest exclusives and key issues for serious collectors
          </p>
        </div>

        {/* Product Grid — 9 newest exclusives */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {products.map((p) => {
            // An upcoming drop is not buyable but is NOT sold out — never label it that way.
            const upcoming = Boolean(p.comingSoon);
            const badge = upcoming
              ? (p.availabilityLabel ?? "COMING SOON")
              : p.soldOut
                ? (p.availabilityLabel ?? "SOLD OUT")
                : p.slug === newDropSlug
                  ? "NEW DROP"
                  : "EXCLUSIVE";
            const badgeColor = upcoming
              ? "bg-red-600 text-white"
              : p.soldOut
                ? "bg-cbbst-dark text-white border border-white/20"
                : p.slug === newDropSlug
                  ? "bg-cbbst-red text-white"
                  : "bg-cbbst-gold text-black";
            return (
              <Link key={p.slug} href={`/products/${p.slug}`} className="product-card group relative block">
                {/* Product Image */}
                <div className="relative aspect-[2/3] rounded overflow-hidden bg-gradient-to-br from-cbbst-dark2 via-black to-cbbst-dark2">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />

                  {/* Badge */}
                  <span className={`absolute top-3 left-3 ${badgeColor} text-[10px] font-bold px-2 py-1 rounded z-10`}>
                    {badge}
                  </span>

                  {/* Sold out overlay */}
                  {p.soldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                      <span className={`text-white text-xs font-bold px-4 py-2 border ${upcoming ? "bg-red-600 border-red-400" : "bg-cbbst-dark border-white/20"}`}>
                        {p.availabilityLabel ?? (upcoming ? "COMING SOON" : "SOLD OUT")}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="product-overlay absolute inset-0 bg-black/40 opacity-0 transition-opacity flex flex-col items-center justify-center gap-3 z-20">
                    <span className="bg-white text-black text-xs font-bold px-6 py-2 group-hover:bg-cbbst-gold transition-colors">
                      EXPLORE THE DROP →
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3">
                  <h3 className="text-white text-xs font-bold leading-tight line-clamp-2 group-hover:text-cbbst-gold transition-colors">
                    {p.title.toUpperCase()}
                  </h3>
                  <p className="text-cbbst-gold text-sm font-bold mt-1">From {formatPrice(p.priceFrom)}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/exclusives"
            className="inline-block border border-white/20 hover:border-cbbst-red text-white hover:text-cbbst-red text-xs font-bold tracking-wider px-8 py-3 transition-colors"
          >
            VIEW ALL EXCLUSIVES →
          </Link>
        </div>
      </div>
    </section>
  );
}
