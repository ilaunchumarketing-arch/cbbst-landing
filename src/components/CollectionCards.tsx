import Link from "next/link";
import Image from "next/image";

const cards = [
  {
    tag: "EXCLUSIVES",
    title: "Hand-curated for the hunt.",
    desc: "Print runs of 450 to 666 copies. Variant artists you actually know. The kind of book you find once.",
    cta: "SHOP NOW",
    href: "/exclusives",
    image: "/images/card_exclusives.jpg",
    tint: "bg-cbbst-red/10",
    external: false,
  },
  {
    tag: "LIVE ON WHATNOT",
    title: "Bidding goes live on Whatnot.",
    desc: "Auctions start at $1. CGC slabs, virgin foils, mystery boxes, on-stream giveaways. No reserves. Bring snacks.",
    cta: "WATCH LIVE",
    href: "https://www.whatnot.com/user/cbbst",
    image: "/images/card_whatnot_live.jpg",
    tint: "bg-fuchsia-900/10",
    external: true,
  },
  {
    tag: "DISPLAY GEAR",
    title: "Stands worthy of the slab.",
    desc: "Superior Stands — modern industrial display for graded comics. Showcase the grail. Stop tossing it in a long box.",
    cta: "SHOP NOW",
    href: "/supplies",
    image: "/images/card_display_gear.jpg",
    tint: "bg-yellow-900/10",
    external: false,
  },
];

export default function CollectionCards() {
  return (
    <section className="bg-cbbst-dark py-16 sm:py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="h-px w-10 bg-cbbst-red" />
          <span className="text-cbbst-red text-[10px] font-black tracking-[0.4em]">
            THREE WAYS IN
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="group relative block overflow-hidden rounded-sm border border-white/5 hover:border-cbbst-red/40 transition-all hover:-translate-y-1 min-h-[420px]"
            >
              {/* Background image — full visibility */}
              <Image
                src={c.image}
                alt={c.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Subtle color tint so it stays on-brand without flattening the image */}
              <div className={`absolute inset-0 ${c.tint} mix-blend-multiply pointer-events-none`} />
              {/* Only darken the bottom 55% so the text is legible but the image breathes */}
              <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/80 to-transparent" />
              {/* Light vignette at top for the tag chip */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />

              {/* Top tag */}
              <div className="absolute top-0 left-0 right-0 p-5 z-10">
                <span className="inline-block bg-black/60 backdrop-blur-sm border border-cbbst-red/40 text-cbbst-red text-[10px] font-black tracking-[0.3em] px-2.5 py-1">
                  {c.tag}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="text-white font-black text-2xl sm:text-3xl italic leading-tight tracking-tight group-hover:text-cbbst-gold transition-colors">
                  {c.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mt-3 mb-5">
                  {c.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-cbbst-red group-hover:text-cbbst-gold text-xs font-black tracking-[0.25em] transition-colors">
                  {c.cta}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>

              {/* Hover accent line */}
              <div className="absolute left-0 bottom-0 h-[3px] w-0 bg-cbbst-red group-hover:w-full transition-all duration-500 z-20" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
