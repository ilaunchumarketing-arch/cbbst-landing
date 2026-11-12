"use client";

import { useState } from "react";

type Fulfillment = {
  status: string | null;
  trackingCompany: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  estimatedDeliveryAt: string | null;
};
type TrackedOrder = {
  name: string;
  createdAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  fulfillments: Fulfillment[];
  items: { title: string; quantity: number }[];
};

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; order: TrackedOrder }
  | { kind: "notfound" }
  | { kind: "unavailable" }
  | { kind: "error"; message: string };

const pretty = (s: string | null) =>
  s ? s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

const fmtDate = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ kind: "error", message: data.error || "Something went wrong. Try again." });
      } else if (data.available === false) {
        setState({ kind: "unavailable" });
      } else if (data.found) {
        setState({ kind: "found", order: data.order as TrackedOrder });
      } else {
        setState({ kind: "notfound" });
      }
    } catch {
      setState({ kind: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-cbbst-gold text-[10px] font-black tracking-[0.3em] mb-2">ORDER NUMBER</label>
          <input
            type="text"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="#CBBST-12345"
            className="w-full bg-black/40 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-cbbst-red placeholder:text-white/30"
          />
        </div>
        <div>
          <label className="block text-cbbst-gold text-[10px] font-black tracking-[0.3em] mb-2">EMAIL USED AT CHECKOUT</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-black/40 border border-white/15 text-white text-sm px-4 py-3 focus:outline-none focus:border-cbbst-red placeholder:text-white/30"
          />
        </div>
        <button
          type="submit"
          disabled={state.kind === "loading"}
          className="w-full bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.25em] py-4 transition-colors disabled:opacity-60"
        >
          {state.kind === "loading" ? "LOOKING UP…" : "LOOK UP ORDER →"}
        </button>
      </form>

      {/* Results */}
      {state.kind === "found" && (
        <div className="mt-6 border border-white/10 bg-black/30 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-white font-black text-lg">{state.order.name}</span>
            {fmtDate(state.order.createdAt) && (
              <span className="text-white/40 text-xs">Placed {fmtDate(state.order.createdAt)}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-cbbst-gold text-[10px] font-black tracking-[0.3em] mb-1">PAYMENT</div>
              <div className="text-white/80">{pretty(state.order.financialStatus)}</div>
            </div>
            <div>
              <div className="text-cbbst-gold text-[10px] font-black tracking-[0.3em] mb-1">FULFILLMENT</div>
              <div className="text-white/80">{pretty(state.order.fulfillmentStatus)}</div>
            </div>
          </div>

          {state.order.fulfillments.length > 0 ? (
            <div className="space-y-3">
              {state.order.fulfillments.map((f, i) => (
                <div key={i} className="border-t border-white/10 pt-3 text-sm">
                  <div className="text-white/80">
                    {f.trackingCompany ? `${f.trackingCompany} · ` : ""}
                    {pretty(f.status)}
                  </div>
                  {f.trackingNumber && (
                    <div className="text-white/60 mt-1">
                      Tracking:{" "}
                      {f.trackingUrl ? (
                        <a href={f.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-cbbst-gold hover:underline break-all">
                          {f.trackingNumber}
                        </a>
                      ) : (
                        <span className="break-all">{f.trackingNumber}</span>
                      )}
                    </div>
                  )}
                  {fmtDate(f.estimatedDeliveryAt) && (
                    <div className="text-white/40 text-xs mt-1">Est. delivery {fmtDate(f.estimatedDeliveryAt)}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-sm border-t border-white/10 pt-3">
              No tracking yet — your order is confirmed and being prepared. You&apos;ll get tracking by email once it ships.
            </p>
          )}

          {state.order.items.length > 0 && (
            <div className="border-t border-white/10 pt-3">
              <div className="text-cbbst-gold text-[10px] font-black tracking-[0.3em] mb-2">ITEMS</div>
              <ul className="text-white/70 text-sm space-y-1">
                {state.order.items.map((it, i) => (
                  <li key={i}>{it.quantity}× {it.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {state.kind === "notfound" && (
        <p className="mt-6 text-white/70 text-sm text-center border border-white/10 bg-black/30 p-4">
          We couldn&apos;t find an order with that number and email. Double-check both (the email must match the one used at
          checkout), or email{" "}
          <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">support@cbbst.com</a>.
        </p>
      )}

      {state.kind === "unavailable" && (
        <p className="mt-6 text-white/70 text-sm text-center border border-white/10 bg-black/30 p-4">
          Online order lookup is being finalized. Email{" "}
          <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">support@cbbst.com</a>{" "}
          with your order number and we&apos;ll send your status right away.
        </p>
      )}

      {state.kind === "error" && (
        <p className="mt-6 text-red-400 text-sm text-center border border-red-400/30 bg-black/30 p-4">{state.message}</p>
      )}

      <p className="text-white/40 text-xs text-center mt-6">
        Can&apos;t find it? Email{" "}
        <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">support@cbbst.com</a>{" "}
        with your order number and we&apos;ll dig in.
      </p>
    </>
  );
}
