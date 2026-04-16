import Link from "next/link";

const cards = [
  {
    tag: "COLLECTION",
    title: "Explore Exclusive Comics!",
    desc: "A curated selection of key issues, back issues, and exclusive variants — ready to be added to your collection.",
    cta: "SHOP NOW →",
    href: "/products?cat=exclusives",
    emoji: "📚",
    gradient: "from-red-900/60 to-cbbst-dark",
  },
  {
    tag: "🎙️ LIVE AUCTIONS",
    title: "Join us LIVE on WhatNot!",
    desc: "Catch our live comic streams packed with key issues, variants, back issues, and exclusive deals.",
    cta: "WATCH NOW →",
    href: "https://www.whatnot.com",
    emoji: "🎙️",
    gradient: "from-blue-900/60 to-cbbst-dark",
    external: true,
  },
  {
    tag: "DISPLAY GEAR",
    title: "The Stand that Stands Back!",
    desc: "Superior Stands — the ultimate display solution for collectors. Showcase comics, slabs, and collectibles.",
    cta: "SHOP NOW →",
    href: "/products?cat=supplies",
    emoji: "🖼️",
    gradient: "from-purple-900/60 to-cbbst-dark",
  },
];

export default function CollectionCards() {
  return (
    <section className="bg-cbbst-dark py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            className={`group relative block bg-gradient-to-b ${c.gradient} rounded-lg overflow-hidden p-8 min-h-[220px] border border-white/5 hover:border-cbbst-red/30 transition-colors`}
          >
            <span className="text-cbbst-red text-[10px] font-bold tracking-widest">
              {c.tag}
            </span>
            <h3 className="text-white font-black text-xl mt-2 mb-3 group-hover:text-cbbst-red transition-colors">
              {c.title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              {c.desc}
            </p>
            <span className="text-cbbst-red text-xs font-bold tracking-wider group-hover:underline">
              {c.cta}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
