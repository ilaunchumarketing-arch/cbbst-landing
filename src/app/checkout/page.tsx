"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/data/products";

export default function Page() {
  const { items, subtotal, count, clear } = useCart();
  const [placed, setPlaced] = useState(false);

  if (count === 0 && !placed) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="bg-cbbst-dark text-white min-h-[70vh]">
          <PageHero tag="CHECKOUT" title="Nothing to check out." desc="Your cart is empty." />
          <div className="text-center py-12">
            <Link
              href="/exclusives"
              className="inline-block bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
            >
              BROWSE EXCLUSIVES →
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (placed) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="bg-cbbst-dark text-white min-h-[70vh]">
          <PageHero tag="ORDER RECEIVED" title="Thanks. We've got it." desc="A real human will email you in the next 24 hours to confirm shipping details and total." />
          <section className="py-12 px-6">
            <div className="max-w-xl mx-auto bg-gradient-to-br from-cbbst-red/15 to-cbbst-dark2 border border-cbbst-red/30 p-8 text-center">
              <p className="text-white/70 leading-relaxed">
                This is a demo checkout. In the production cut, you&apos;ll be routed to a real
                payment processor (Stripe or Shopify checkout). For now, your selections are
                queued for review and we&apos;ll reach out by email.
              </p>
              <Link
                href="/"
                className="inline-block mt-6 bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
              >
                BACK TO HOMEPAGE →
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-cbbst-dark text-white">
        <PageHero tag="CHECKOUT" title="Wrap it up." desc="Shipping &amp; payment. We'll handle the rest." />

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-8">
            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // InitiateCheckout already fires in CheckoutButton on click (covers both paths).
                clear();
                setPlaced(true);
              }}
              className="space-y-6"
            >
              <Section title="CONTACT">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field name="email" label="Email" type="email" required />
                  <Field name="phone" label="Phone (optional)" />
                </div>
              </Section>

              <Section title="SHIPPING ADDRESS">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field name="firstName" label="First name" required />
                  <Field name="lastName" label="Last name" required />
                </div>
                <Field name="address1" label="Street address" required />
                <Field name="address2" label="Apt / Suite (optional)" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field name="city" label="City" required />
                  <Field name="state" label="State" required />
                  <Field name="zip" label="ZIP" required />
                </div>
                <Field name="country" label="Country" defaultValue="United States" required />
              </Section>

              <Section title="PAYMENT">
                <div className="bg-black/40 border border-white/15 p-4 text-white/55 text-sm leading-relaxed">
                  This is a demo checkout. No real payment is collected on this page.
                  When you submit, your selections are queued and we&apos;ll email you
                  within 24 hours with a real Shopify payment link to complete the
                  purchase securely.
                </div>
              </Section>

              <button
                type="submit"
                className="w-full bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-base tracking-[0.25em] py-5 transition-colors animate-pulse-ring"
              >
                PLACE ORDER · {formatPrice(subtotal)} →
              </button>
              <p className="text-white/40 text-xs text-center">
                By placing your order you agree to our{" "}
                <Link href="/terms" className="hover:text-cbbst-gold underline">Terms</Link> and{" "}
                <Link href="/privacy" className="hover:text-cbbst-gold underline">Privacy Policy</Link>.
              </p>
            </form>

            {/* Order Summary */}
            <aside className="bg-cbbst-dark2 border border-white/10 p-6 h-fit lg:sticky lg:top-24">
              <h2 className="text-white font-black text-lg tracking-widest mb-4">YOUR ORDER ({count})</h2>
              <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {items.map((i) => (
                  <li key={i.slug} className="flex gap-3 pb-3 border-b border-white/5 last:border-b-0">
                    <div className="relative w-12 h-16 flex-shrink-0 bg-black">
                      <Image src={i.image} alt={i.title} fill className="object-cover" sizes="48px" />
                      <span className="absolute -top-1 -right-1 bg-cbbst-red text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{i.qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold leading-tight line-clamp-2">{i.title}</p>
                      <p className="text-cbbst-gold text-xs font-black mt-1">{formatPrice(i.price * i.qty)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2 text-sm pt-4 border-t border-white/10">
                <div className="flex justify-between">
                  <dt className="text-white/55">Subtotal</dt>
                  <dd className="text-white font-bold">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/55">Shipping</dt>
                  <dd className="text-white/55">TBD</dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5 mt-2">
                  <dt className="text-white font-black tracking-widest">TOTAL</dt>
                  <dd className="text-cbbst-gold font-black text-xl">{formatPrice(subtotal)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-cbbst-dark2 border border-white/10 p-6">
      <h3 className="text-cbbst-gold text-[10px] font-black tracking-[0.4em] mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-white/55 text-[10px] font-black tracking-[0.3em] mb-1.5">{label.toUpperCase()}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full bg-black/40 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-cbbst-red"
      />
    </div>
  );
}
