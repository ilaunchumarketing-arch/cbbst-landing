import Link from "next/link";

export default function WhatNotCTA() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cbbst-red/20 via-cbbst-dark to-cbbst-red/20" />
      <div className="absolute inset-0 bg-cbbst-dark/80" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="text-cbbst-red text-xs font-bold tracking-widest">
          🎙️ LIVE ON WHATNOT
        </span>
        <h2 className="text-white font-black text-4xl sm:text-5xl tracking-tight mt-3 mb-4">
          CATCH US LIVE ON WHATNOT
        </h2>
        <p className="text-white/60 text-sm sm:text-base mb-8 max-w-xl mx-auto">
          Join the livestream for rare keys, exclusive variants, CGC
          slabs, and giveaways. Follow{" "}
          <span className="text-cbbst-red font-bold">@CBBST</span> so you
          don&apos;t miss the next drop.
        </p>
        <Link
          href="https://www.whatnot.com/user/cbbst"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-cbbst-red hover:bg-cbbst-red-dark text-white font-bold text-sm tracking-wider px-10 py-4 transition-colors"
        >
          FOLLOW @CBBST ON WHATNOT →
        </Link>
      </div>
    </section>
  );
}
