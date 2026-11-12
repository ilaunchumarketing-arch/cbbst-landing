"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DROP_LAUNCH } from "./DropStatus";

import type { HeroDrop } from "@/lib/shopify";

// Fallbacks only for when the live Shopify fetch is unavailable.
const FALLBACK_HREF = "/exclusives";
const FALLBACK_COVER = "/images/exclusives/absolute-batman-24-trade.jpg";

/**
 * Standalone banner at the very top of the Exclusives page: the newest drop's cover blown
 * up behind a big live countdown. Flips to a "LIVE NOW" state automatically once
 * DROP_LAUNCH passes.
 *
 * The book comes from `heroDrops[0]` — the same source as the homepage hero — so this
 * banner can never drift behind the drop again (it was hardcoded to Absolute Batman #23
 * and still said so after #24 went live).
 */
export default function ExclusiveDropHero({ drop }: { drop?: HeroDrop }) {
  const PRODUCT_HREF = drop?.href ?? FALLBACK_HREF;
  const COVER = drop?.image ?? FALLBACK_COVER;
  const NAME = drop?.title ?? "THE NEXT EXCLUSIVE";
  const COVER_ALT = drop ? `${drop.title} cover` : "Featured exclusive cover";
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const launch = new Date(DROP_LAUNCH).getTime();
  const live = now !== null && now >= launch;
  const total = now === null ? null : Math.max(0, launch - now);
  const pad = (n: number) => String(n).padStart(2, "0");
  const cell = (v: number | null) => (v === null ? "--" : pad(v));

  let h: number | null = null,
    m: number | null = null,
    s: number | null = null;
  if (total !== null) {
    h = Math.floor(total / 3_600_000);
    m = Math.floor((total % 3_600_000) / 60_000);
    s = Math.floor((total % 60_000) / 1000);
  }

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-black">
      {/* Background cover — blown up + darkened */}
      <div className="absolute inset-0">
        <Image src={COVER} alt="" fill priority className="object-cover object-top opacity-40 blur-[2px] scale-110" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-cbbst-dark via-transparent to-black/60" />
      <div className="absolute inset-0 halftone-overlay opacity-10" />
      <div className="absolute -top-32 -left-24 h-[32rem] w-[32rem] rounded-full bg-cbbst-red/25 blur-[140px] animate-float-slow pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-cbbst-red/40 animate-scanline" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:py-24 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
        {/* Left — message + countdown */}
        <div className="[text-shadow:0_2px_12px_rgba(0,0,0,0.95)]">
          <div className="inline-flex items-center gap-2 bg-cbbst-red/15 border border-cbbst-red/50 px-3 py-1.5 rounded animate-pulse-ring mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cbbst-red opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cbbst-red" />
            </span>
            <span className="text-cbbst-red text-[11px] font-black tracking-[0.35em]">
              {live ? "THE DROP IS LIVE" : "IT'S ABOUT TO GO DOWN"}
            </span>
          </div>

          <h1 className="text-white font-black italic tracking-tight leading-[0.85]">
            <span className="block text-3xl sm:text-5xl">{live ? "THE" : "GET READY FOR THE"}</span>
            <span className="block text-5xl sm:text-7xl text-cbbst-gold animate-flicker">{NAME}</span>
            <span className="block text-3xl sm:text-5xl">{live ? "DROP IS LIVE." : "DROP."}</span>
          </h1>

          <p className="text-white/70 text-base sm:text-lg mt-5 max-w-xl leading-relaxed">
            {drop?.subtitle ? <>{drop.subtitle}. </> : null}
            {/* Key-issue claim renders ONLY when the curated entry actually states one —
                never invent a "1st appearance" for a book we have no source for. */}
            {drop?.hook ? <span className="text-white font-bold">{drop.hook}. </span> : null}
            {live ? (
              <>It&apos;s live right now — grab yours before they&apos;re gone for good.</>
            ) : (
              <>Drops <span className="text-cbbst-gold font-bold">soon.</span> Once they&apos;re gone, they&apos;re gone for good.</>
            )}
          </p>

          {/* Countdown */}
          {live ? (
            <div className="mt-8">
              <Link
                href={PRODUCT_HREF}
                className="inline-flex items-center gap-3 bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-lg tracking-[0.2em] px-10 py-5 transition-colors"
              >
                IT&apos;S LIVE — GRAB IT NOW →
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-8 flex items-end gap-4 sm:gap-6">
                {[
                  { v: h, l: "HOURS" },
                  { v: m, l: "MINUTES" },
                  { v: s, l: "SECONDS" },
                ].map((u, i, arr) => (
                  <div key={u.l} className="flex items-end gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="bg-black/60 border border-cbbst-red/40 px-3 sm:px-5 py-2 sm:py-3 min-w-[64px] sm:min-w-[92px]">
                        <span className="text-white font-black text-4xl sm:text-6xl leading-none [font-variant-numeric:tabular-nums]">
                          {cell(u.v)}
                        </span>
                      </div>
                      <div className="text-white/50 text-[9px] sm:text-[10px] font-black tracking-[0.25em] mt-2">{u.l}</div>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-cbbst-red font-black text-4xl sm:text-6xl leading-none pb-7 sm:pb-9">:</span>
                    )}
                  </div>
                ))}
              </div>

              <Link
                href={PRODUCT_HREF}
                className="inline-flex items-center gap-2 mt-8 bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.25em] px-9 py-4 transition-colors"
              >
                RESERVE YOURS →
              </Link>
            </>
          )}
        </div>

        {/* Right — standing cover */}
        <div className="hidden lg:flex justify-center">
          <div className="relative w-[260px] aspect-[2/3]">
            <div className="absolute -inset-4 bg-gradient-to-br from-cbbst-red/40 to-cbbst-gold/20 blur-3xl" />
            <Image
              src={COVER}
              alt={COVER_ALT}
              fill
              priority
              className="relative object-cover shadow-2xl"
              sizes="260px"
            />
            <div className="absolute -top-3 -left-3 bg-cbbst-red text-white text-[10px] font-black tracking-[0.25em] px-3 py-1.5 z-10">
              EXCLUSIVE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
