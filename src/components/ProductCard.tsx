import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/data/products";

type Props = {
  product: Product;
  /** Show "From" prefix on the price */
  showFromPrefix?: boolean;
  size?: "sm" | "md";
};

export default function ProductCard({ product: p, showFromPrefix = true, size = "md" }: Props) {
  const href = `/products/${p.slug}`;
  return (
    <Link href={href} className="product-card group relative block">
      <div className="relative aspect-[2/3] rounded overflow-hidden bg-gradient-to-br from-cbbst-dark2 via-black to-cbbst-dark2">
        <Image
          src={p.image}
          alt={p.title}
          fill
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {/* Print run badge */}
        {p.printRun && (
          <span className="absolute top-3 left-3 bg-cbbst-red text-white text-[10px] font-black tracking-wider px-2 py-1 rounded z-10">
            /{p.printRun}
          </span>
        )}
        {p.priceCompare && p.priceCompare > p.priceFrom && (
          <span className="absolute top-3 right-3 bg-cbbst-gold text-black text-[10px] font-black tracking-wider px-2 py-1 rounded z-10">
            SALE
          </span>
        )}
        {p.soldOut && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-10">
            <span className={`text-white text-xs font-black tracking-widest px-4 py-2 border ${p.comingSoon ? "bg-red-600 border-red-400" : "bg-cbbst-dark border-white/20"}`}>
              {p.availabilityLabel ?? (p.comingSoon ? "COMING SOON" : "SOLD OUT")}
            </span>
          </div>
        )}
        <div className="product-overlay absolute inset-0 bg-black/40 opacity-0 transition-opacity flex flex-col items-center justify-center gap-3 z-20">
          <span className="bg-white text-black text-xs font-black tracking-widest px-6 py-2 group-hover:bg-cbbst-gold transition-colors">
            EXPLORE →
          </span>
        </div>
      </div>
      <div className="mt-3">
        <h3 className={`text-white font-bold leading-tight line-clamp-2 group-hover:text-cbbst-gold transition-colors ${size === "sm" ? "text-[11px]" : "text-xs"}`}>
          {p.title}
          {p.soldOut && (
            <span className={`ml-2 inline-block align-middle text-white text-[9px] font-black tracking-[0.15em] px-1.5 py-0.5 rounded ${p.comingSoon ? "bg-red-600" : "bg-cbbst-red"}`}>
              {p.availabilityLabel ?? (p.comingSoon ? "COMING SOON" : "SOLD OUT")}
            </span>
          )}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-cbbst-gold text-sm font-black">
            {showFromPrefix && !p.priceCompare ? "From " : ""}
            {formatPrice(p.priceFrom)}
          </p>
          {p.priceCompare && (
            <p className="text-white/40 text-xs line-through">{formatPrice(p.priceCompare)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
