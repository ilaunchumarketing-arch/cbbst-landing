"use client";

import { useState } from "react";
import VariantSelector, { Variant } from "./VariantSelector";
import AddToCartButton from "./cart/AddToCartButton";
import { useVariantImage } from "./VariantImage";

type Props = {
  slug: string;
  title: string;
  price: number;
  image: string;
  variants: Variant[];
  soldOut?: boolean;
  /** Add to Cart button class (so each page can theme its color) */
  buttonClass?: string;
  /** Selected variant accent class (matches page theme). Defaults to red. */
  accentClass?: string;
  /** Optional secondary CTA rendered next to the Add to Cart button */
  secondaryCTA?: React.ReactNode;
  /** Text on the disabled button when the book isn't buyable (default "SOLD OUT"). */
  disabledLabel?: string;
};

/** Pull a numeric price out of a variant tier label like "$115", "From $20", "$19.99". */
function tierPrice(tier: string | undefined, fallback: number): number {
  if (!tier) return fallback;
  const m = tier.replace(/,/g, "").match(/\$?\s*([0-9]+(?:\.[0-9]+)?)/);
  return m ? parseFloat(m[1]) : fallback;
}

export default function ProductBuyBlock({
  slug,
  title,
  price,
  image,
  variants,
  soldOut = false,
  buttonClass = "group bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.25em] px-8 py-4 animate-pulse-ring",
  accentClass,
  secondaryCTA,
  disabledLabel,
}: Props) {
  // Start on the first variant that's still buyable (fall back to 0 if all are gone).
  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.max(0, variants.findIndex((v) => !v.soldOut))
  );
  const selectedVariant = variants[selectedIndex];
  // A sold-out product OR a sold-out selected variant must never reach the cart.
  const unbuyable = soldOut || Boolean(selectedVariant?.soldOut);
  // Cart price must follow the SELECTED variant, not the product's "from" price.
  const cartPrice = tierPrice(selectedVariant?.tier, price);
  // Cart image follows the selected variant's photo when Shopify has one (so the
  // cart line shows the exact cover you picked), else the product's main image.
  const cartImage = selectedVariant?.image ?? image;
  const { setActiveImage } = useVariantImage();

  // Picking a variant swaps the gallery to that variant's photo (when it has one).
  const handleSelect = (i: number) => {
    setSelectedIndex(i);
    setActiveImage(variants[i]?.image ?? null);
  };

  return (
    <div className="space-y-5">
      <VariantSelector
        variants={variants}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        accentClass={accentClass}
        soldOutLabel={disabledLabel}
      />
      <div className="flex flex-wrap gap-3">
        <AddToCartButton
          slug={slug}
          title={title}
          price={cartPrice}
          image={cartImage}
          variant={selectedVariant?.name}
          disabled={unbuyable}
          disabledLabel={disabledLabel}
          label={
            selectedVariant
              ? `ADD ${selectedVariant.name.split(" ")[0]} TO CART`
              : "ADD TO CART"
          }
          className={buttonClass}
        />
        {secondaryCTA}
      </div>
    </div>
  );
}
