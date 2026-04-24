"use client";

import Link from "next/link";
import Image from "next/image";

interface Product {
  name: string;
  price: string;
  badge: string;
  badgeColor: string;
  href: string;
  soldOut?: boolean;
  image: string;
}

const products: Product[] = [
  {
    name: "INVINCIBLE #1 – LIPWEI CHANG FOIL CBBST EXCLUSIVE",
    price: "$30.00",
    badge: "🔥 HOT",
    badgeColor: "bg-cbbst-red",
    href: "/products/invincible-1-lipwei-chang-foil",
    soldOut: true,
    image: "/images/comic_art_2.jpg",
  },
  {
    name: "EXQUISITE CORPSES #12 – DALE ALTMANN EXCLUSIVE VARIANT",
    price: "From $20.00",
    badge: "✨ NEW",
    badgeColor: "bg-cbbst-gold text-black",
    href: "/products/exquisite-corpses-12-dale-altmann",
    image: "/images/comic_art_1.jpg",
  },
  {
    name: "ULTIMATE FALLOUT: FACSIMILE EDITION #4 CGC 9.8 — 1st Miles Morales",
    price: "$1,150.00",
    badge: "🏆 CGC 9.8",
    badgeColor: "bg-cbbst-gold text-black",
    href: "/products/ultimate-fallout-4-cgc-9-8",
    image: "/images/comic_art_9.jpg",
  },
  {
    name: "SOMETHING IS KILLING THE CHILDREN #1 – CBBST EXCLUSIVE",
    price: "$45.00",
    badge: "EXCLUSIVE",
    badgeColor: "bg-cbbst-red",
    href: "/products/something-killing-children-exclusive",
    image: "/images/comic_art_3.jpg",
  },
  {
    name: "TMNT – CBBST EXCLUSIVE COLOR + GREYSCALE VARIANT SET",
    price: "$35.00",
    badge: "✨ NEW",
    badgeColor: "bg-cbbst-gold text-black",
    href: "/products/tmnt-exclusive-variant",
    image: "/images/comic_art_4.jpg",
  },
  {
    name: "RONIN — BLACK & WHITE INK VARIANT SET",
    price: "$20.00",
    badge: "💰 SALE",
    badgeColor: "bg-green-600",
    href: "/products/ronin-ink-variant-set",
    image: "/images/comic_art_8.jpg",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-cbbst-dark py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-cbbst-red text-xs font-bold tracking-widest">
            HOT RIGHT NOW
          </span>
          <h2 className="text-white font-black text-3xl sm:text-4xl tracking-tight mt-2">
            FEATURED PRODUCTS
          </h2>
          <p className="text-white/50 text-sm mt-2">
            Hand-picked exclusives and key issues for serious collectors
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {products.map((p) => (
            <div key={p.name} className="product-card group relative">
              {/* Product Image */}
              <div className="relative aspect-[3/4] rounded overflow-hidden bg-cbbst-dark2">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />

                {/* Badge */}
                <span
                  className={`absolute top-3 left-3 ${p.badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded z-10`}
                >
                  {p.badge}
                </span>

                {/* Sold out overlay */}
                {p.soldOut && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <span className="bg-cbbst-dark text-white text-xs font-bold px-4 py-2 border border-white/20">
                      SOLD OUT
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="product-overlay absolute inset-0 bg-black/40 opacity-0 transition-opacity flex flex-col items-center justify-center gap-3 z-20">
                  <Link
                    href={p.href}
                    className="bg-white text-black text-xs font-bold px-6 py-2 hover:bg-white/90 transition-colors"
                  >
                    QUICK VIEW
                  </Link>
                  <button className="bg-cbbst-red text-white text-xs font-bold px-6 py-2 hover:bg-cbbst-red-dark transition-colors">
                    ADD TO CART
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="mt-3">
                <h3 className="text-white text-xs font-bold leading-tight line-clamp-2">
                  {p.name}
                </h3>
                <p className="text-cbbst-gold text-sm font-bold mt-1">
                  {p.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block border border-white/20 hover:border-cbbst-red text-white hover:text-cbbst-red text-xs font-bold tracking-wider px-8 py-3 transition-colors"
          >
            VIEW ALL 70+ PRODUCTS →
          </Link>
        </div>
      </div>
    </section>
  );
}
