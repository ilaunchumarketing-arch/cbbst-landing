"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { trackEvent } from "@/components/MetaPixel";

type Props = {
  slug: string;
  title: string;
  price: number;
  image: string;
  variant?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  disabledLabel?: string;
};

export default function AddToCartButton({
  slug,
  title,
  price,
  image,
  variant,
  className = "",
  label = "ADD TO CART",
  disabled = false,
  disabledLabel = "SOLD OUT",
}: Props) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  if (disabled) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-2 bg-white/5 border border-white/20 text-white/40 font-black text-sm tracking-[0.25em] px-8 py-4 cursor-not-allowed ${className}`}
      >
        {disabledLabel}
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        add({ slug, title, price, image, variant }, 1);
        void trackEvent({
          name: "AddToCart",
          contentName: variant ? `${title} — ${variant}` : title,
          contentIds: [slug],
        });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
      }}
      className={`inline-flex items-center justify-center gap-2 transition-all ${className}`}
    >
      {justAdded ? "ADDED ✓" : label}
      {!justAdded && <span className="transition-transform group-hover:translate-x-1">→</span>}
    </button>
  );
}
