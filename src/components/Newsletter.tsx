"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong — try again");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Something went wrong — try again");
      setStatus("error");
    }
  };

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cbbst-dark via-cbbst-dark2 to-cbbst-dark" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="text-4xl mb-4">📚 🔥 💥</div>
        <h2 className="text-white font-black text-3xl sm:text-4xl tracking-tight mb-3">
          JOIN THE CBBST COLLECTOR COMMUNITY
        </h2>
        <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
          Get first access to exclusive drops, WhatNot stream alerts, and
          collector deals — straight to your inbox.
        </p>

        {status === "done" ? (
          <p className="text-cbbst-gold font-black text-sm tracking-widest mb-4">
            YOU&apos;RE ON THE LIST — WATCH YOUR INBOX FOR THE NEXT DROP.
          </p>
        ) : (
          <form
            onSubmit={submit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
          >
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-cbbst-dark3 border border-white/10 text-white text-sm px-4 py-3 rounded focus:outline-none focus:border-cbbst-red placeholder:text-white/30"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-cbbst-red hover:bg-cbbst-red-dark disabled:opacity-60 text-white font-bold text-xs tracking-wider px-6 py-3 rounded transition-colors whitespace-nowrap"
            >
              {status === "sending" ? "SIGNING UP..." : "SUBSCRIBE FREE →"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-cbbst-red text-xs font-bold mb-4">{error}</p>
        )}

        <p className="text-white/30 text-xs">
          No spam. Unsubscribe anytime. Join 10,000+ collectors.
        </p>
      </div>
    </section>
  );
}
