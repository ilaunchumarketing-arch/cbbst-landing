"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Minus, Plus } from "lucide-react";
import { useCart, lineKey } from "./CartContext";
import CheckoutButton from "./CheckoutButton";
import { formatPrice } from "@/data/products";

export default function CartDrawer() {
  const { items, isOpen, close, remove, setQty, subtotal, count } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:max-w-md bg-cbbst-dark border-l border-white/10 transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-black text-lg tracking-wide">YOUR CART</h2>
            <p className="text-white/40 text-xs mt-0.5 tracking-widest">{count} ITEM{count === 1 ? "" : "S"}</p>
          </div>
          <button
            onClick={close}
            className="text-white/60 hover:text-white p-2"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/40 text-sm tracking-wide">Your cart is empty.</p>
              <Link
                href="/exclusives"
                onClick={close}
                className="inline-block mt-6 text-cbbst-red text-xs font-black tracking-[0.3em] hover:underline"
              >
                BROWSE EXCLUSIVES →
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => {
                const key = lineKey(i.slug, i.variant);
                return (
                  <li key={key} className="flex gap-3 pb-4 border-b border-white/5 last:border-b-0">
                    <div className="relative w-16 h-24 flex-shrink-0 bg-cbbst-dark2">
                      <Image src={i.image} alt={i.title} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${i.slug}`}
                        onClick={close}
                        className="text-white text-xs font-bold leading-tight hover:text-cbbst-gold line-clamp-2 block"
                      >
                        {i.title}
                      </Link>
                      {i.variant && (
                        <p className="text-cbbst-red text-[10px] font-black tracking-widest mt-1">
                          {i.variant.toUpperCase()}
                        </p>
                      )}
                      <p className="text-cbbst-gold text-xs font-bold mt-1">{formatPrice(i.price)}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-white/15">
                          <button
                            onClick={() => setQty(key, i.qty - 1)}
                            className="w-7 h-7 text-white/60 hover:text-white flex items-center justify-center"
                            aria-label="Decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-white text-xs font-bold w-7 text-center">{i.qty}</span>
                          <button
                            onClick={() => setQty(key, i.qty + 1)}
                            className="w-7 h-7 text-white/60 hover:text-white flex items-center justify-center"
                            aria-label="Increase"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(key)}
                          className="text-white/40 hover:text-cbbst-red"
                          aria-label="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-4 space-y-3 bg-cbbst-dark2">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs tracking-widest font-bold">SUBTOTAL</span>
              <span className="text-white font-black text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-white/40 text-[10px] tracking-wider">
              Shipping &amp; taxes calculated at checkout. Insured shipping available on grails.
            </p>
            <CheckoutButton
              onNavigate={close}
              className="block w-full text-center bg-cbbst-red hover:bg-cbbst-red-dark disabled:opacity-60 text-white font-black text-sm tracking-[0.25em] py-4 transition-colors cursor-pointer"
            />
            <Link
              href="/cart"
              onClick={close}
              className="block w-full text-center border border-white/20 hover:border-white text-white text-xs font-bold tracking-widest py-3 transition-colors"
            >
              VIEW FULL CART
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
