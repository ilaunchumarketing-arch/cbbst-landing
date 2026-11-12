"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartContext";
import { trackEvent } from "@/components/MetaPixel";

/**
 * Primary checkout CTA. Posts the cart to /api/checkout:
 *  - Shopify wired  → redirect to Shopify's hosted checkout (real payment).
 *  - Not wired yet  → fall back to the in-app /checkout page (demo flow).
 * Either way the customer never hits a dead end.
 */
export default function CheckoutButton({
  className,
  label = "CHECKOUT →",
  onNavigate,
}: {
  className?: string;
  label?: string;
  onNavigate?: () => void;
}) {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function go() {
    if (loading || items.length === 0) return;
    setLoading(true);
    // Begin-checkout signal — browser pixel + CAPI (deduped). Fires for both the
    // Shopify redirect and the demo fallback, so it's never missed.
    void trackEvent({
      name: "InitiateCheckout",
      value: subtotal,
      currency: "USD",
      contentIds: items.map((i) => i.slug),
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ handle: i.slug, title: i.title, variant: i.variant, qty: i.qty })),
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { configured: boolean; checkoutUrl?: string };
        if (data.configured && data.checkoutUrl) {
          onNavigate?.();
          window.location.href = data.checkoutUrl; // Shopify hosted checkout
          return;
        }
      }
      // Not configured ({ configured: false }) or any non-OK → demo checkout
      onNavigate?.();
      router.push("/checkout");
    } catch {
      onNavigate?.();
      router.push("/checkout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={go}
      disabled={loading || items.length === 0}
      className={className}
      aria-busy={loading}
    >
      {loading ? "STARTING CHECKOUT…" : label}
    </button>
  );
}
