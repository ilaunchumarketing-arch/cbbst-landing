"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  /** Optional variant label, e.g. "CGC 9.8 Blue Label". When set, same slug+different variant = separate line items. */
  variant?: string;
};

/** Composite key identifying a cart line. Different variants of the same slug are different lines. */
export function lineKey(slug: string, variant?: string): string {
  return variant ? `${slug}::${variant}` : slug;
}

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  count: number;
  subtotal: number;
};

const CartCtx = createContext<CartState | null>(null);

const STORAGE_KEY = "cbbst-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    const incomingKey = lineKey(item.slug, item.variant);
    setItems((prev) => {
      const existing = prev.find((p) => lineKey(p.slug, p.variant) === incomingKey);
      if (existing) {
        return prev.map((p) =>
          lineKey(p.slug, p.variant) === incomingKey ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => lineKey(p.slug, p.variant) !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => lineKey(p.slug, p.variant) !== key)
        : prev.map((p) => (lineKey(p.slug, p.variant) === key ? { ...p, qty } : p))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartCtx.Provider
      value={{
        items,
        isOpen,
        add,
        remove,
        setQty,
        clear,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((v) => !v),
        count,
        subtotal,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export function useCart(): CartState {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
