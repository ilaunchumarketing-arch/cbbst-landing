"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import ReminderButton from "@/components/ReminderButton";

type Props = {
  dropISO: string;
  whatnotUrl: string;
  /** Pure cover art — no banners or text. The flyer frame is composited on top. */
  artSrc: string;
};

export default function ExquisiteHero({ dropISO, whatnotUrl, artSrc }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const parallaxBg = `translate3d(${mouse.x * -14}px, ${mouse.y * -10 + scrollY * 0.15}px, 0) scale(1.12)`;
  const parallaxArt = `translate3d(${mouse.x * 10}px, ${mouse.y * 6 - scrollY * 0.05}px, 0)`;

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      {/* Background — parallax portrait, heavy blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 will-change-transform" style={{ transform: parallaxBg }}>
          <Image
            src={artSrc}
            alt=""
            fill
            priority
            className="object-cover opacity-30 blur-xl"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-cbbst-dark" />
        <div className="absolute inset-0 halftone-overlay opacity-40" />
        <div className="absolute inset-0 film-grain" />
        <div className="absolute inset-x-0 top-0 h-[3px] bg-cbbst-gold/40 mix-blend-screen animate-scanline pointer-events-none" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-[560px] w-[560px] rounded-full bg-fuchsia-500/15 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute bottom-0 -left-32 h-[420px] w-[420px] rounded-full bg-cbbst-red/20 blur-3xl animate-float-slow" />
      </div>

      {/* Top marquee */}
      <div className="relative z-20 bg-cbbst-gold text-black py-2 sm:py-3 border-b-2 border-black overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-black text-sm sm:text-base tracking-[0.3em] mx-8">
              COMIC BOOK · BUY · SELL · TRADE · EXQUISITE CORPSES #12 · EXCLUSIVE DROP ·
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-center">
          {/* LEFT — Flyer built around the pure art */}
          <div
            className="relative mx-auto w-full max-w-md lg:max-w-none will-change-transform animate-fade-in"
            style={{ transform: parallaxArt }}
          >
            <div className="relative aspect-[9/16] w-full overflow-hidden shadow-[0_20px_90px_-10px_rgba(255,215,0,0.22)] ring-1 ring-white/10">
              {/* Pure art */}
              <Image
                src={artSrc}
                alt="Exquisite Corpses #12 cover art"
                fill
                className="object-cover animate-neon"
                sizes="(max-width:1024px) 100vw, 42vw"
                priority
              />

              {/* Subtle darken at bottom for title legibility */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

              {/* Moving scanline */}
              <div className="pointer-events-none absolute inset-x-0 h-[2px] bg-cbbst-gold/55 mix-blend-screen animate-scanline" />

              {/* Animated blood drips */}
              <div className="pointer-events-none absolute top-0 left-[18%] w-1.5 h-[30%] blood-streak animate-drip" style={{ animationDelay: "0.3s" }} />
              <div className="pointer-events-none absolute top-0 left-[72%] w-1 h-[22%] blood-streak animate-drip" style={{ animationDelay: "0.9s" }} />

              {/* Top yellow banner */}
              <div className="absolute top-0 inset-x-0 z-30 bg-cbbst-gold text-black text-center py-2 font-black text-[11px] sm:text-sm tracking-[0.25em] border-b-2 border-black">
                COMIC BOOK  BUY-SELL-TRADE
              </div>

              {/* Red exclusive badge */}
              <div className="absolute top-11 sm:top-14 left-4 sm:left-6 z-30 bg-cbbst-red px-4 sm:px-6 py-1.5 sm:py-2 font-black text-white text-[11px] sm:text-sm tracking-[0.25em] border-l-4 border-r-4 border-black animate-pulse-ring">
                ✕ EXCLUSIVE DROP ✕
              </div>

              {/* CBBST corner stamp */}
              <div className="absolute top-11 sm:top-14 right-3 sm:right-4 z-30 bg-white text-black text-[8px] sm:text-[10px] font-black tracking-tight px-2 py-1 leading-tight text-right">
                COMIC<br />BOOK<br />BUY-SELL-TRADE
              </div>

              {/* Title block */}
              <div className="absolute bottom-12 sm:bottom-16 inset-x-0 z-20 px-4 sm:px-6">
                <div className="text-cbbst-gold font-black leading-none italic text-5xl sm:text-6xl drop-shadow-[4px_4px_0_rgba(0,0,0,1)] animate-flicker">
                  EXQUISITE
                </div>
                <div className="text-white font-black leading-none italic text-4xl sm:text-5xl mt-1 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                  CORPSES #12
                </div>
                <div className="text-white font-black leading-none italic text-xl sm:text-2xl mt-3 drop-shadow-[3px_3px_0_rgba(0,0,0,1)]">
                  STREAMING ON WHATNOT
                </div>
              </div>

              {/* Yellow bottom strip */}
              <div className="absolute bottom-0 inset-x-0 z-30 bg-cbbst-gold text-black text-center py-2.5 font-black text-sm sm:text-base tracking-[0.25em] border-t-2 border-black">
                SATURDAY · 8:33PM EST
              </div>
            </div>

            {/* Floating accents */}
            <div className="hidden lg:block absolute -top-4 -right-4 bg-cbbst-red text-white font-black text-xs tracking-widest px-3 py-2 rotate-6 shadow-lg animate-shake">
              LIVE STREAM
            </div>
            <div className="hidden sm:block absolute -top-3 left-6 h-5 w-24 -rotate-6 bg-white/40 mix-blend-overlay" />
            <div className="hidden sm:block absolute -bottom-3 right-6 h-5 w-24 rotate-6 bg-white/40 mix-blend-overlay" />
          </div>

          {/* RIGHT — Event details */}
          <div>
            <div className="inline-flex items-center gap-2 bg-cbbst-red/15 border border-cbbst-red/50 text-cbbst-red text-[11px] font-black tracking-[0.3em] px-3 py-1.5 mb-5 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cbbst-red opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cbbst-red" />
              </span>
              EXCLUSIVE DROP · #12
            </div>

            <h1 className="font-black leading-[0.88] italic">
              <span
                className="block text-cbbst-gold text-6xl sm:text-8xl glitch animate-flicker animate-fade-in"
                data-text="EXQUISITE"
              >
                EXQUISITE
              </span>
              <span className="block text-white text-5xl sm:text-7xl mt-2 animate-fade-in delay-200">
                CORPSES <span className="text-cbbst-red">#12</span>
              </span>
            </h1>

            <p className="text-white/70 text-base sm:text-lg mt-6 max-w-xl leading-relaxed animate-fade-in delay-400">
              A 1-of-1 horror variant drop. Limited run, live only. Hit the stream
              at <span className="text-cbbst-gold font-bold">8:33 PM EST</span> Saturday
              to bid, buy, and snag before it vanishes.
            </p>

            <div className="mt-8 animate-fade-in delay-400">
              <Countdown targetISO={dropISO} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3 animate-fade-in delay-600">
              <ReminderButton
                href={whatnotUrl}
                className="group relative inline-flex items-center gap-2 bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.2em] px-8 sm:px-10 py-4 transition-all overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                SET REMINDER ON WHATNOT
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </ReminderButton>
              <a
                href="#about"
                className="inline-flex items-center bg-transparent border border-white/25 hover:border-white text-white font-black text-sm tracking-[0.2em] px-7 py-4 transition-colors"
              >
                WHAT&apos;S DROPPING
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg animate-fade-in delay-600">
              <div className="border-l-2 border-cbbst-gold pl-3">
                <div className="text-white/40 text-[9px] font-bold tracking-[0.25em]">DATE</div>
                <div className="text-white font-black text-sm mt-1">SAT · APR 25</div>
              </div>
              <div className="border-l-2 border-cbbst-gold pl-3">
                <div className="text-white/40 text-[9px] font-bold tracking-[0.25em]">TIME</div>
                <div className="text-white font-black text-sm mt-1">8:33 PM EST</div>
              </div>
              <div className="border-l-2 border-cbbst-gold pl-3">
                <div className="text-white/40 text-[9px] font-bold tracking-[0.25em]">WHERE</div>
                <div className="text-white font-black text-sm mt-1">WHATNOT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="relative z-20 bg-cbbst-gold text-black border-y-2 border-black overflow-hidden">
        <div className="flex ticker-reverse whitespace-nowrap py-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-[11px] sm:text-xs font-black tracking-[0.3em] mx-6">
              EXQUISITE CORPSES #12 · SATURDAY 8:33PM EST · ON WHATNOT ·
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
