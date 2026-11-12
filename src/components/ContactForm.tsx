"use client";

import { useState } from "react";
import Link from "next/link";
import { SMS_CONSENT_DISCLOSURE } from "@/lib/smsConsent";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError("");

    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          // Only ever true when the visitor actually ticked the box.
          smsConsent: data.get("smsConsent") === "yes",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong — try again");
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — try again");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div
        role="status"
        className="bg-black/40 border border-cbbst-red/40 p-6 text-center"
      >
        <p className="text-white font-black text-lg italic">MESSAGE SENT</p>
        <p className="text-white/65 text-sm mt-2 leading-relaxed">
          We read every message and respond within 1 business day. Need us sooner? Email{" "}
          <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">
            support@cbbst.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field name="name" label="Your Name" placeholder="Jane Doe" required />
        <Field name="email" label="Email" type="email" placeholder="you@example.com" required />
      </div>
      <Field
        name="phone"
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        placeholder="(555) 123-4567"
      />
      <div>
        <label
          htmlFor="contact-message"
          className="block text-cbbst-gold text-[10px] font-black tracking-[0.3em] mb-2"
        >
          MESSAGE
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Selling a collection, question about a listing, custom request…"
          className="w-full bg-black/40 border border-white/15 text-white text-base sm:text-sm px-4 py-3 focus:outline-none focus:border-cbbst-red focus:ring-2 focus:ring-cbbst-red/40 placeholder:text-white/30"
        />
      </div>

      {/* A2P 10DLC opt-in — separate, unchecked by default, never required. */}
      <div className="bg-black/30 border border-white/10 p-4">
        <div className="flex items-start gap-3">
          <input
            id="sms-consent"
            name="smsConsent"
            type="checkbox"
            value="yes"
            className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-cbbst-red focus:outline-none focus:ring-2 focus:ring-cbbst-red/60"
          />
          <label
            htmlFor="sms-consent"
            className="cursor-pointer text-white/70 text-[13px] leading-relaxed"
          >
            {SMS_CONSENT_DISCLOSURE}
          </label>
        </div>
        <p className="mt-3 pl-8 text-white/50 text-[13px] leading-relaxed">
          See our{" "}
          <Link href="/privacy" className="text-cbbst-gold hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-cbbst-gold hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full min-h-[44px] cursor-pointer bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.25em] py-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cbbst-gold"
      >
        {state === "submitting" ? "SENDING…" : "SEND MESSAGE →"}
      </button>

      {state === "error" && (
        <p role="alert" className="text-cbbst-gold text-xs text-center">
          {error} — or email us directly at{" "}
          <a href="mailto:support@cbbst.com" className="underline">
            support@cbbst.com
          </a>
          .
        </p>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = `contact-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-cbbst-gold text-[10px] font-black tracking-[0.3em] mb-2"
      >
        {label.toUpperCase()}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full min-h-[44px] bg-black/40 border border-white/15 text-white text-base sm:text-sm px-4 py-3 focus:outline-none focus:border-cbbst-red focus:ring-2 focus:ring-cbbst-red/40 placeholder:text-white/30"
      />
    </div>
  );
}
