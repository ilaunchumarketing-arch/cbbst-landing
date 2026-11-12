"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Shares the currently-selected variant's image between the variant selector
 * (ProductBuyBlock) and the image gallery (ProductGallery) on a product page.
 * When a variant has its own Shopify image, picking it swaps the main photo.
 */
type Ctx = {
  activeImage: string | null;
  setActiveImage: (src: string | null) => void;
};

const VariantImageContext = createContext<Ctx | null>(null);

export function VariantImageProvider({ children }: { children: ReactNode }) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  return (
    <VariantImageContext.Provider value={{ activeImage, setActiveImage }}>
      {children}
    </VariantImageContext.Provider>
  );
}

/** Safe to call outside a provider — returns a no-op so components stay reusable. */
export function useVariantImage(): Ctx {
  return useContext(VariantImageContext) ?? { activeImage: null, setActiveImage: () => {} };
}
