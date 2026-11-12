"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useCart, lineKey } from "@/components/cart/CartContext";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { formatPrice } from "@/data/products";

export default function Page() {
  const { items, remove, setQty, subtotal, count, clear } = useCart();

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-cbbst-dark text-white">
        <PageHero
          tag="YOUR CART"
          title={count > 0 ? `${count} item${count === 1 ? "" : "s"} ready` : "Your cart is empty"}
          desc={count > 0 ? "Review your selections, then head to checkout." : "Browse the exclusives and load it up."}
        />

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            {items.length === 0 ? (
              <div className="text-center bg-cbbst-dark2 border border-white/10 py-16 px-6">
                <p className="text-white/60 text-lg">Nothing in your cart yet.</p>
                <Link
                  href="/exclusives"
                  className="inline-block mt-6 bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
                >
                  BROWSE EXCLUSIVES →
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((i) => {
                    const key = lineKey(i.slug, i.variant);
                    return (
                      <div key={key} className="bg-cbbst-dark2 border border-white/10 p-4 flex gap-4">
                        <div className="relative w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0 bg-black">
                          <Image src={i.image} alt={i.title} fill className="object-cover" sizes="112px" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <Link href={`/products/${i.slug}`} className="text-white font-bold text-sm hover:text-cbbst-gold transition-colors line-clamp-2">
                              {i.title}
                            </Link>
                            {i.variant && (
                              <p className="text-cbbst-red text-[10px] font-black tracking-widest mt-1">
                                {i.variant.toUpperCase()}
                              </p>
                            )}
                            <p className="text-cbbst-gold text-sm font-black mt-2">{formatPrice(i.price)}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="inline-flex items-center border border-white/15">
                              <button onClick={() => setQty(key, i.qty - 1)} className="w-8 h-8 text-white/60 hover:text-white flex items-center justify-center" aria-label="Decrease">
                                <Minus size={14} />
                              </button>
                              <span className="text-white text-sm font-black w-8 text-center">{i.qty}</span>
                              <button onClick={() => setQty(key, i.qty + 1)} className="w-8 h-8 text-white/60 hover:text-white flex items-center justify-center" aria-label="Increase">
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-white font-black text-base">{formatPrice(i.price * i.qty)}</span>
                              <button onClick={() => remove(key)} className="text-white/40 hover:text-cbbst-red" aria-label="Remove">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={clear}
                    className="text-white/40 hover:text-cbbst-red text-xs tracking-widest font-bold pt-3"
                  >
                    × CLEAR CART
                  </button>
                </div>

                {/* Summary */}
                <aside className="bg-cbbst-dark2 border border-white/10 p-6 h-fit lg:sticky lg:top-24">
                  <h2 className="text-white font-black text-lg tracking-widest">ORDER SUMMARY</h2>
                  <dl className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-white/55">Subtotal</dt>
                      <dd className="text-white font-bold">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-white/55">Shipping</dt>
                      <dd className="text-white/55">Calculated at checkout</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-white/55">Tax</dt>
                      <dd className="text-white/55">Calculated at checkout</dd>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-white/10">
                      <dt className="text-white font-black tracking-widest">ESTIMATED TOTAL</dt>
                      <dd className="text-cbbst-gold font-black text-xl">{formatPrice(subtotal)}</dd>
                    </div>
                  </dl>
                  <CheckoutButton
                    label="PROCEED TO CHECKOUT →"
                    className="block w-full mt-6 text-center bg-cbbst-red hover:bg-cbbst-red-dark disabled:opacity-60 text-white font-black text-sm tracking-[0.25em] py-4 transition-colors cursor-pointer"
                  />
                  <Link
                    href="/exclusives"
                    className="block w-full mt-3 text-center border border-white/20 hover:border-white text-white text-xs font-bold tracking-widest py-3 transition-colors"
                  >
                    CONTINUE SHOPPING
                  </Link>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
