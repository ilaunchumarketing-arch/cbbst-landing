"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-cbbst-dark">
      {/* Background collage of comic images */}
      <div className="absolute inset-0 grid grid-cols-3">
        <div className="relative">
          <Image
            src="/images/comic_art_5.jpg"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative">
          <Image
            src="/images/comic_art_7.jpg"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative">
          <Image
            src="/images/comic_art_9.jpg"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-cbbst-dark via-transparent to-transparent" />
      <div className="absolute inset-0 halftone-overlay opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        {/* Badge */}
        <div className="inline-block bg-cbbst-red/20 border border-cbbst-red/40 text-cbbst-red text-xs font-bold tracking-wider px-3 py-1 rounded mb-6">
          🎙️ LIVE ON WHATNOT EVERY FRIDAY
        </div>

        {/* Logo block */}
        <div className="mb-8">
          <Image
            src="/images/logo_dark.jpg"
            alt="Comic Book Buy-Sell-Trade"
            width={600}
            height={450}
            className="w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="text-white/80 text-base sm:text-lg max-w-lg mb-1">
          Your ultimate source for exclusive variants, CGC graded slabs, and
          rare key issues.
        </p>
        <p className="text-white font-semibold text-base sm:text-lg mb-8">
          Built by collectors, for collectors.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            href="/products"
            className="bg-cbbst-red hover:bg-cbbst-red-dark text-white font-bold text-sm tracking-wider px-8 py-4 transition-colors"
          >
            SHOP NOW →
          </Link>
          <Link
            href="/products?cat=exclusives"
            className="border border-white/30 hover:border-white text-white font-bold text-sm tracking-wider px-8 py-4 transition-colors bg-white/5 hover:bg-white/10"
          >
            VIEW EXCLUSIVES
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 sm:gap-10">
          <div>
            <div className="text-cbbst-gold font-black text-2xl sm:text-3xl italic">
              5,000+
            </div>
            <div className="text-white/50 text-[10px] font-bold tracking-widest uppercase">
              Comics Sold
            </div>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <div className="text-cbbst-gold font-black text-2xl sm:text-3xl italic">
              50+
            </div>
            <div className="text-white/50 text-[10px] font-bold tracking-widest uppercase">
              Exclusives
            </div>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <div className="text-cbbst-gold font-black text-2xl sm:text-3xl italic">
              10K+
            </div>
            <div className="text-white/50 text-[10px] font-bold tracking-widest uppercase">
              Collectors
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 text-white/40 text-xs tracking-[0.3em] flex flex-col items-center gap-2">
          SCROLL
          <span className="text-lg">↓</span>
        </div>
      </div>
    </section>
  );
}
