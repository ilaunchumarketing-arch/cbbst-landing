import Link from "next/link";

export default function WhatNotBanner() {
  return (
    <section className="bg-cbbst-dark2 border-y border-white/5 py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-cbbst-red text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
            LIVE NOW
          </span>
          <p className="text-white/70 text-sm">
            Join us on{" "}
            <span className="text-cbbst-red font-bold">WhatNot</span> — Live
            comic auctions, exclusive drops &amp; collector deals every Friday!
          </p>
        </div>
        <Link
          href="https://www.whatnot.com"
          target="_blank"
          className="text-cbbst-red hover:text-white text-xs font-bold tracking-wider transition-colors"
        >
          WATCH LIVE →
        </Link>
      </div>
    </section>
  );
}
