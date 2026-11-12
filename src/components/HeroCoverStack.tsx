"use client";

import Link from "next/link";
import Image from "next/image";
import FlyingBats from "./FlyingBats";

import type { HeroDrop } from "@/lib/shopify";

type Cover = { src: string; title: string; run: string | null; href: string; batman?: boolean };

/**
 * Fallback covers ONLY for when the live Shopify fetch is unavailable. The real stack is
 * the newest on-sale exclusives, newest drop first, passed down from getHeroDrops() —
 * never hand-maintain this list to feature a new book.
 */
const FALLBACK_COVERS: Cover[] = [
  {
    src: "/images/exclusives/absolute-batman-24-trade.jpg",
    title: "ABSOLUTE BATMAN #24",
    run: null,
    href: "/products/absolute-batman-24-tony-daniel-nycc-exclusive",
    batman: true,
  },
  {
    src: "/images/exclusives/absolute-cassandra-cain-1-trade.jpg",
    title: "ABSOLUTE CASSANDRA CAIN #1",
    run: null,
    href: "/products/absolute-cassandra-cain-the-shadows-hand-1-tony-daniel-nycc-exclusive",
  },
  {
    src: "/images/exclusives/absolute-batman-23-trade-sm.webp",
    title: "ABSOLUTE BATMAN #23",
    run: "/1000",
    href: "/products/absolute-batman-23-frank-cho-exclusive-variant",
    batman: true,
  },
  { src: "/images/exclusives/lobo-3-ryan-browne.png", title: "LOBO #3", run: "/666", href: "/products/lobo-3" },
  { src: "/images/exclusives/odin-1-matt-wilson.png", title: "ODIN #1", run: "/450", href: "/products/odin-1" },
  {
    src: "/images/exclusives/exquisite-corpses-13-foil-virgin.png",
    title: "EXQUISITE CORPSES #13",
    run: "/500",
    href: "/products/exquisite-corpses-13-foil-virgin",
  },
];

/**
 * Hero cover showcase. `drops[0]` — the newest book that has dropped on the site — is the
 * principal on load: big, fully visible, on top, linked straight to its product page so a
 * visitor can buy it immediately. The rest fan out at the base, newest first; tapping one
 * promotes it to principal. The list is Shopify-driven (see getHeroDrops), so a new drop
 * takes the lead slot with no code change.
 */
export default function HeroCoverStack({
  drops = [],
  selected = 0,
  onSelect,
}: {
  drops?: HeroDrop[];
  /** Controlled by HeroSection — the badge, countdown and callout read the same index. */
  selected?: number;
  onSelect?: (i: number) => void;
}) {
  const covers: Cover[] = drops.length
    ? drops.map((d) => ({ src: d.image, title: d.title, run: d.run, href: d.href, batman: d.batman }))
    : FALLBACK_COVERS;
  const setSelected = (i: number) => onSelect?.(i);
  const principal = covers[selected] ?? covers[0];
  const others = covers.map((c, i) => ({ c, i })).filter((o) => o.i !== selected);
  const mid = (others.length - 1) / 2;

  return (
    <div className="relative min-h-[360px] sm:min-h-[520px] lg:min-h-[680px]">
      {/* Halo backlights */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[76%] w-[58%] rounded-full bg-cbbst-red/25 blur-[110px] animate-float-slow" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[52%] w-[46%] rounded-full bg-cbbst-gold/15 blur-[120px] animate-float-slow" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Bats only when Batman is the principal */}
      {principal.batman && <FlyingBats baseDelay={1.2} />}

      {/* Principal cover — big, on top, never covered */}
      <div className="absolute inset-x-0 top-0 z-30 flex justify-center">
        <Link
          key={principal.title}
          href={principal.href}
          className="hero-cover-in group relative w-[58%] sm:w-[62%] lg:w-[70%] aspect-[2/3] block"
        >
          <div className="absolute -inset-5 bg-gradient-to-br from-cbbst-red/40 via-transparent to-cbbst-gold/20 blur-2xl pointer-events-none" />
          <Image
            src={principal.src}
            alt={principal.title}
            fill
            sizes="(max-width: 1024px) 58vw, 30vw"
            className="object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.85)] drop-shadow-[0_0_55px_rgba(232,25,44,0.35)] transition-transform duration-500 group-hover:-translate-y-2"
            priority
          />
          {/* "NEW" marks the LEAD drop (index 0 = newest published book), and the print run
              only renders when we actually know it — a run is never fabricated. */}
          <div className="absolute top-3 right-3 bg-cbbst-red px-2.5 py-1 rotate-3 shadow-lg">
            <span className="text-white text-[9px] font-black tracking-[0.2em]">
              {selected === 0 ? "NEW" : ""}
              {selected === 0 && principal.run ? " · " : ""}
              {principal.run ?? (selected === 0 ? "" : "EXCLUSIVE")}
            </span>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm border border-white/15 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-[10px] font-black tracking-[0.2em]">VIEW →</span>
          </div>
        </Link>
      </div>

      {/* Picker fan — tap to bring a cover to the front. Sits at the base, behind the principal. */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex justify-center items-end">
        {others.map(({ c, i }, k) => {
          const rot = (k - mid) * 7;
          const ty = Math.abs(k - mid) * 6;
          return (
            <button
              key={c.title}
              onClick={() => setSelected(i)}
              aria-label={`Show ${c.title}`}
              style={{ transform: `rotate(${rot}deg) translateY(${ty}%)`, marginLeft: k ? "-11%" : 0, zIndex: 20 + k }}
              className="relative w-[27%] sm:w-[25%] aspect-[2/3] origin-bottom transition-all duration-300 hover:-translate-y-4 hover:rotate-0 hover:z-[25] cursor-pointer"
            >
              <Image
                src={c.src}
                alt={c.title}
                fill
                sizes="(max-width: 1024px) 25vw, 14vw"
                className="object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.85)] hover:drop-shadow-[0_0_28px_rgba(232,25,44,0.55)] transition-[filter] duration-300"
              />
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cbbst-red/40 to-transparent" />
      <p className="absolute -bottom-6 inset-x-0 text-center text-white/35 text-[9px] font-black tracking-[0.3em]">
        TAP A COVER TO PREVIEW
      </p>
    </div>
  );
}
