import Link from "next/link";

/**
 * Shown at the top of a product page when EVERY variant is unavailable (Shopify
 * `availableForSale` = false). It's driven live from Shopify, so it appears the
 * moment a product sells out and disappears automatically when stock returns.
 *
 * `label` overrides the wording for a book that is not sold out but simply hasn't
 * dropped yet ("COMING SOON") — a book that was never on sale has no "restock".
 */
export default function SoldOutBanner({ label }: { label?: string }) {
  const upcoming = Boolean(label);
  return (
    <div className="bg-cbbst-red text-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="font-black tracking-[0.25em] text-sm">{label ?? "SOLD OUT"}</span>
        <span className="text-white/85 text-xs tracking-wider">{upcoming ? "This drop isn\u2019t on sale yet \u2014 it\u2019s coming soon." : "Every variant is currently unavailable."}</span>
        <Link
          href="https://www.whatnot.com/user/cbbst"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline text-xs font-bold tracking-wider hover:text-cbbst-gold transition-colors"
        >
          {upcoming ? "Follow CBBST on Whatnot for the drop \u2192" : "Catch the restock live on Whatnot \u2192"}
        </Link>
      </div>
    </div>
  );
}
