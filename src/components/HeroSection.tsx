"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DropStatus from "./DropStatus";
import CountdownTimer from "./CountdownTimer";
import HeroCoverStack from "./HeroCoverStack";
import type { HotDrop, HeroDrop } from "@/lib/shopify";

// Fallback tiles only for when the live Shopify fetch is unavailable —
// the real strip comes from getHotDrops() (newest IN-STOCK exclusives).
const FALLBACK_DROPS: HotDrop[] = [
  { title: "THE HORROR OF GODZILLA #1", run: "/400", href: "/products/the-horror-of-godzilla-1-poncho-exclusive" },
  { title: "USAGI KAITO #84 #5", run: "/750", href: "/products/usagi-yojimbo-kaito-84-5-dale-altmann-exclusive" },
  { title: "LOBO #3", run: "/666", href: "/products/lobo-3" },
  { title: "ODIN #1", run: "/450", href: "/products/odin-1" },
];

// Per-book display voices, same mapping as the drop popup (loaded in layout.tsx).
const VOICE_FONT: Record<string, string> = {
  impact: "var(--font-impact), Impact, sans-serif",
  blade: "var(--font-blade), Georgia, serif",
};

/**
 * The top banner. Every book it names — the badge, the NEW DROP callout, the countdown
 * card, the cover stack and the ambient background art — comes from `heroDrops`, newest
 * book PUBLISHED to the storefront first (David 2026-08-24: the hero must always surface
 * the latest drops, newest first, with no hand-editing per drop). Nothing here is written
 * per book; publish a drop in Shopify and it leads the hero on its own.
 *
 * The SELECTED cover is the single source of truth for the whole left column. Tapping a
 * cover in the stack used to swap only the picture while the badge, countdown and callout
 * kept describing the lead book — so tapping Cassandra Cain left "ABSOLUTE BATMAN #24"
 * written beside her cover. The selection now lives here and every drop-specific surface
 * reads from it, including the book's own accent colour and display typeface (David
 * 2026-08-25, the same rule he asked for on the popup).
 */
export default function HeroSection({
  hotDrops = [],
  heroDrops = [],
}: {
  hotDrops?: HotDrop[];
  heroDrops?: HeroDrop[];
}) {
  const drops = hotDrops.length ? hotDrops : FALLBACK_DROPS;
  const [selected, setSelected] = useState(0);
  const active = heroDrops[selected] ?? heroDrops[0];
  // Ambient blurred backdrop follows the SELECTED cover; the static file is the
  // fallback for when Shopify is unreachable.
  const backdrop = active?.image ?? "/images/hero_comic_bg.jpg";
  // The book's own personality (products.ts getTheme → HeroDrop.theme). Falls back to the
  // house red/gold so a book with no tuned theme still reads as CBBST.
  const accent = active?.theme.accent ?? "var(--cbbst-red)";
  const accent2 = active?.theme.accent2 ?? "var(--cbbst-gold)";
  const voiceFont = active?.theme.voice ? VOICE_FONT[active.theme.voice] : undefined;
  const isLead = selected === 0;
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-cbbst-dark film-grain">
      {/* Full-bleed comic-cover background — swap public/images/hero_comic_bg.jpg to change the artwork */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0">
        <Image
          src={backdrop}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          priority
          className="object-cover object-[57%_14%] scale-125 blur-2xl animate-slow-zoom"
        />
      </div>
      {/* Brand red duotone wash so any cover reads as CBBST */}
      <div className="absolute inset-0 bg-cbbst-red/10 mix-blend-overlay pointer-events-none" />
      {/* Heavier scrim — the blurred cover is ambient; the sharp standing cover is the focal point */}
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />
      {/* Legibility gradients: heavy on the LEFT (headline) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/55" />
      <div className="absolute inset-0 shadow-[inset_0_0_220px_70px_rgba(0,0,0,0.95)] pointer-events-none" />
      {/* Print texture + live scanline */}
      <div className="absolute inset-0 halftone-overlay opacity-15 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-cbbst-red/40 animate-scanline" />

      {/* Floating color accents */}
      <div className="absolute -top-32 -left-32 h-[36rem] w-[36rem] rounded-full bg-cbbst-red/15 blur-[140px] animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-[36rem] w-[36rem] rounded-full bg-fuchsia-700/10 blur-[140px] animate-float-slow pointer-events-none" />

      {/* Content grid. Mobile order: headline → cover/shelf → supporting copy. Desktop: text left, cover right. */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-12 lg:py-20 w-full grid lg:grid-cols-[1.1fr_1fr] lg:grid-rows-[auto_1fr] gap-x-10 gap-y-2 lg:gap-y-3 items-center">
        {/* A — badge + headline (first on mobile, top-left on desktop) */}
        <div className="relative z-20 order-1 lg:col-start-1 lg:row-start-1 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
          <div className="inline-flex items-center gap-2 bg-cbbst-red/15 border border-cbbst-red/50 px-3 py-1.5 rounded animate-pulse-ring mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cbbst-red opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cbbst-red" />
            </span>
            <span className="drop-fade text-[11px] font-black tracking-[0.3em]" style={{ color: accent }}>
              <DropStatus name={active?.title ?? "THE NEWEST EXCLUSIVE"} />
            </span>
          </div>

          <h1 className="text-white font-black tracking-tight leading-[0.85] animate-fade-in">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">COLLECT THE</span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl italic">
              <span className="glitch" data-text="UNFINDABLE.">UNFINDABLE.</span>
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl mt-1">
              BEFORE <span className="text-cbbst-gold animate-flicker">SOMEONE ELSE</span>
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl">DOES.</span>
          </h1>

          {/* Live countdown shared with the badge — flips to LIVE NOW once DROP_LAUNCH passes */}
          <CountdownTimer name={active?.title} href={active?.href} voiceFont={voiceFont} accent={accent} />
        </div>

        {/* C — supporting copy + drop callout + CTAs + hot strip (below the cover on mobile, bottom-left on desktop) */}
        <div className="relative z-20 order-3 lg:col-start-1 lg:row-start-2 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
          {/* Drop callout — follows the SELECTED cover, in that book's own colour + voice. */}
          <Link
            href={active?.href ?? "/exclusives"}
            className="drop-fade group block mt-7 max-w-lg border bg-black/55 backdrop-blur-sm animate-fade-in delay-300"
            style={{ borderColor: `${accent}66` }}
          >
            <div className="flex items-stretch">
              <div className="drop-fade flex items-center px-3" style={{ backgroundColor: accent }}>
                <span className="text-white text-[9px] font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 py-2">
                  {/* Only the newest book is the "NEW DROP" — tap an older cover and this
                      must stop claiming it, or the banner starts lying. */}
                  {isLead ? "NEW DROP" : "EXCLUSIVE"}
                </span>
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="drop-fade text-[10px] font-black tracking-[0.3em]" style={{ color: accent2 }}>
                    <DropStatus name={active?.title ?? ""} compact />
                  </span>
                  {/* Print run, only when Shopify/curated data actually states one. */}
                  {active?.run && (
                    <span className="text-white/30 text-[10px] font-black tracking-[0.2em]">· {active.run} TOTAL</span>
                  )}
                </div>
                <div
                  key={active?.slug}
                  className={`text-white leading-none tracking-tight animate-fade-in [text-wrap:balance] ${
                    voiceFont ? "" : "font-black italic"
                  } ${(active?.title.length ?? 0) > 34 ? "text-base sm:text-lg" : "text-lg sm:text-xl"}`}
                  style={{ fontFamily: voiceFont, fontWeight: voiceFont ? 700 : undefined }}
                >
                  {active?.title ?? "SHOP THE EXCLUSIVES"}
                </div>
                <div className="text-white/60 text-[11px] font-bold tracking-wide mt-1">
                  {active?.subtitle ? <>{active.subtitle} · </> : null}
                  from <span className="drop-fade" style={{ color: accent2 }}>${active?.priceFrom ?? 15}</span>
                </div>
                <div className="drop-fade inline-flex items-center gap-1 text-[11px] font-black tracking-[0.25em] mt-3" style={{ color: accent2 }}>
                  SHOP THE DROP
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          </Link>

          <div className="flex flex-wrap gap-3 mt-8 animate-fade-in delay-400">
            <Link
              href="/exclusives"
              className="group relative inline-flex items-center gap-2 bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.2em] px-8 py-4 transition-all animate-pulse-ring"
            >
              SHOP THE EXCLUSIVES
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="https://www.whatnot.com/user/cbbst"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-white/25 hover:border-cbbst-gold text-white hover:text-cbbst-gold font-black text-sm tracking-[0.2em] px-8 py-4 transition-colors bg-white/5 hover:bg-white/10"
            >
              FOLLOW @CBBST LIVE
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Hot drops strip */}
          <div className="mt-10 sm:mt-12 animate-fade-in delay-600">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-cbbst-red" />
              <span className="text-cbbst-red text-[10px] font-black tracking-[0.4em]">HOT RIGHT NOW</span>
              <span className="h-px flex-1 max-w-24 bg-white/10" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-3xl">
              {drops.map((d, i) => (
                <Link key={d.href} href={d.href} className="group bg-black/40 backdrop-blur-sm border border-white/10 hover:border-cbbst-red/50 transition-colors px-3 py-2.5 block cursor-pointer">
                  <div className={`${i % 2 === 0 ? "text-cbbst-red" : "text-cbbst-gold"} font-black text-xl sm:text-2xl italic tracking-tight leading-none`}>
                    {d.run}
                  </div>
                  <div className="text-white/60 group-hover:text-white text-[9px] font-bold tracking-wider mt-1 leading-tight transition-colors">
                    {d.title}
                  </div>
                </Link>
              ))}
            </div>
            <p className="text-white/30 text-[10px] font-bold tracking-[0.3em] mt-3">
              ↑ TOTAL PRINT RUNS
            </p>
          </div>
        </div>

        {/* B — interactive cover showcase. Tap a cover → it becomes the principal (nothing covers it). */}
        <div className="relative order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 -mt-2 lg:mt-0">
          <HeroCoverStack drops={heroDrops} selected={selected} onSelect={setSelected} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hidden lg:flex absolute bottom-8 right-8 text-white/40 text-[10px] tracking-[0.4em] flex-col items-center gap-2 font-black">
        SCROLL
        <span className="h-8 w-px bg-white/30 animate-pulse" />
      </div>
    </section>
  );
}
