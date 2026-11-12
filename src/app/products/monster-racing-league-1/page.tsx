import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import SoldOutBanner from "@/components/SoldOutBanner";
import Footer from "@/components/Footer";
import TrackViewContent from "@/components/TrackViewContent";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";
import ProductBuyBlock from "@/components/ProductBuyBlock";
import { getCanonicalShopifyProduct } from "@/lib/shopify";

const SLUG = "monster-racing-league-1";
const TITLE = "M1: Monster Racing League #1 – Sukesha Ray HeroesCon Exclusive";
const PRICE = 20;
const COVER = "/images/exclusives/m1-monster-racing-league.png";
const GALLERY = [
  COVER,
  "/images/exclusives/monster-racing-league-alt.png",
];
const VARIANTS = [
  { name: "UNSIGNED", tier: "$20.00", note: "Raw · bagged & boarded" },
  { name: "CGC 9.8 BLUE LABEL", tier: "From $20", note: "Graded · ships September" },
  { name: "REGULAR SIGNATURE", tier: "From $20", note: "Jae Lee signature" },
  { name: "UPGRADED SIGNATURE", tier: "From $20", note: "Premium ink upgrade" },
  { name: "REMARKED", tier: "From $20", note: "Custom sketch by artist" },
];

export const metadata: Metadata = {
  title: "M1: Monster Racing League #1 — Sukesha Ray HeroesCon Exclusive | CBBST",
  description:
    "Jae Lee's new ongoing sci-fi racing series. HeroesCon exclusive variant by Sukesha Ray. Limited to 500 copies. From $20.",
  openGraph: {
    title: "Monster Racing League #1 · Sukesha Ray HeroesCon Exclusive",
    description: "500 copies. Jae Lee's new ongoing. From $20.",
    images: [COVER],
  },
};

export const revalidate = 300;

export default async function Page() {
  // Pricing + variants live from Shopify (source of truth); curated supplies presentation only.
  const live = await getCanonicalShopifyProduct(SLUG, TITLE);
  const liveSlug = live?.slug ?? SLUG;
  const livePrice = live?.priceFrom ?? PRICE;
  const liveVariants = live?.variants ?? VARIANTS;
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      {live?.soldOut && <SoldOutBanner />}
      <main className="bg-black text-white">
        <TrackViewContent
          name="Monster Racing League #1"
          id="monster-racing-league-1"
          category="exclusive-variant"
        />

        {/* HERO */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          {/* Cyberpunk grid + neon haze */}
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950 via-black to-cyan-950" />
          <div className="absolute inset-0 neon-grid opacity-60" />
          <div className="absolute -top-32 -left-32 h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/30 blur-[140px] animate-float-slow" />
          <div className="absolute -bottom-32 -right-32 h-[36rem] w-[36rem] rounded-full bg-cyan-500/25 blur-[140px] animate-float-slow" />
          <div className="absolute inset-x-0 top-0 h-[2px] bg-fuchsia-400/60 animate-scanline" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Cover Gallery — first on mobile, left on desktop */}
            <div className="relative order-1">
              <div className="absolute -inset-6 bg-gradient-to-br from-fuchsia-500/40 to-cyan-400/40 blur-2xl animate-neon pointer-events-none" />
              <ProductGallery
                images={GALLERY}
                alt={TITLE}
                shadowClass="drop-shadow-[0_0_60px_rgba(255,72,200,0.5)]"
              />
            </div>

            {/* Text */}
            <div className="order-2 animate-fade-in">
              <div className="inline-flex items-center gap-2 border border-fuchsia-400/40 bg-fuchsia-500/10 px-3 py-1 mb-6">
                <span className="text-fuchsia-300 text-[10px] font-black tracking-[0.35em]">
                  HEROESCON EXCLUSIVE · 500 MADE
                </span>
              </div>
              <h1 className="text-white font-black italic leading-[0.85] tracking-tighter">
                <span className="block text-3xl sm:text-5xl text-cyan-300/80">M1</span>
                <span className="block text-5xl sm:text-7xl glitch" data-text="MONSTER">
                  MONSTER
                </span>
                <span className="block text-5xl sm:text-7xl text-fuchsia-300">
                  RACING
                </span>
                <span className="block text-5xl sm:text-7xl">LEAGUE</span>
                <span className="block text-2xl sm:text-3xl text-white/60 mt-3">
                  ISSUE #1 · FIRST PRINT
                </span>
              </h1>
              <p className="text-white/70 text-base sm:text-lg mt-6 max-w-lg leading-relaxed">
                <span className="text-fuchsia-300 font-bold">Fast &amp; Furious</span>{" "}
                meets <span className="text-cyan-300 font-bold">K-Pop Demon Hunters</span>.
                Near-future Tokyo. 17-year-old Dev discovers the underground racing
                scene that&apos;s about to change everything. New ongoing series from
                Jae Lee.
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className="text-cyan-300 font-black text-3xl">$20.00</span>
                <span className="text-white/40 text-xs tracking-widest font-bold">FROM · UNSIGNED</span>
              </div>

              <div className="mt-7">
                <ProductBuyBlock
                  slug={liveSlug}
                  title={TITLE}
                  price={livePrice}
                  image={COVER}
                  variants={liveVariants}
                  soldOut={live?.soldOut ?? false}
                  buttonClass="group bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-black text-sm tracking-[0.25em] px-8 py-4 animate-pulse-ring"
                  accentClass="border-fuchsia-400 bg-fuchsia-500/15"
                  secondaryCTA={
                    <Link
                      href="https://www.whatnot.com/user/cbbst"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-cyan-300/40 hover:border-cyan-300 text-cyan-300 font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
                    >
                      CATCH ON WHATNOT →
                    </Link>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* CREDITS */}
        <section className="relative py-16 sm:py-20 px-6 border-y border-fuchsia-500/20 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <span className="h-px w-10 bg-fuchsia-400" />
              <span className="text-fuchsia-300 text-[10px] font-black tracking-[0.4em]">
                THE BUILD SHEET
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "CREATOR · WRITER · ARTIST", name: "Jae Lee", sub: "This Ends Tonight · Seven Sons" },
                { label: "VARIANT ARTIST", name: "Sukesha Ray", sub: "HeroesCon Exclusive Cover" },
                { label: "FORMAT", name: "First Print", sub: "Issue #1 · New ongoing" },
              ].map((c) => (
                <div key={c.label} className="bg-fuchsia-950/30 border border-fuchsia-500/20 hover:border-fuchsia-400/60 transition-colors p-6">
                  <div className="text-fuchsia-300 text-[10px] font-black tracking-[0.3em]">{c.label}</div>
                  <div className="text-white font-black text-2xl italic mt-2">{c.name}</div>
                  <div className="text-white/50 text-xs mt-1">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY IT MATTERS */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-fuchsia-950/30 to-black" />
          <div className="absolute inset-0 neon-grid opacity-20" />

          <div className="relative max-w-5xl mx-auto">
            <h2 className="text-white font-black text-4xl sm:text-6xl italic leading-tight text-center">
              500 COPIES.<br />
              <span className="text-fuchsia-300">LIMITED.</span>{" "}
              <span className="text-cyan-300">PERIOD.</span>
            </h2>
            <p className="text-white/60 text-center text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              First-print Issue #1 launches don&apos;t come around every week.
              When a creator like Jae Lee opens a new ongoing, the speculator math
              gets loud. This is your shot before the secondary market figures it out.
            </p>
          </div>
        </section>

        {/* VARIANT LADDER */}
        <section className="relative py-20 px-6 bg-black border-t border-fuchsia-500/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-cyan-300 text-[10px] font-black tracking-[0.4em]">VARIANT OPTIONS</div>
              <h2 className="text-white font-black text-3xl sm:text-5xl italic mt-2">PICK YOUR LEVEL</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { name: "UNSIGNED", price: "$20.00", note: "Raw · bagged & boarded" },
                { name: "CGC 9.8 BLUE LABEL", price: "From $20", note: "Graded · ships September" },
                { name: "REGULAR SIGNATURE", price: "From $20", note: "Jae Lee signature" },
                { name: "UPGRADED SIGNATURE", price: "From $20", note: "Premium ink upgrade" },
                { name: "REMARKED", price: "From $20", note: "Custom sketch by artist" },
              ].map((v) => (
                <div key={v.name} className="bg-gradient-to-b from-fuchsia-500/10 to-transparent border border-fuchsia-500/30 hover:border-cyan-300/60 transition-colors p-4">
                  <div className="text-fuchsia-300 text-[10px] font-black tracking-widest leading-tight">{v.name}</div>
                  <div className="text-white font-black text-xl italic mt-2">{v.price}</div>
                  <div className="text-white/50 text-[11px] mt-1.5 leading-snug">{v.note}</div>
                </div>
              ))}
            </div>
            <p className="text-white/40 text-center text-xs tracking-widest mt-8">
              SHIPPING · STANDARD WEEK OF 6/10 · CGC GRADING SEPTEMBER · SIGNATURE/REMARK ADDS WEEKS
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image src={COVER} alt="" fill className="object-cover opacity-20 blur-md scale-110" />
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/70 via-black/90 to-cyan-900/50" />
            <div className="absolute inset-0 neon-grid opacity-30" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="text-fuchsia-300 text-[10px] font-black tracking-[0.4em] animate-flicker">
              ENGINES ON
            </div>
            <h2 className="text-white font-black text-5xl sm:text-7xl italic leading-[0.9] mt-3">
              GRAB ONE OF<br />
              <span className="text-cyan-300 glitch" data-text="500">500</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg mt-5 max-w-xl mx-auto">
              Or wait six months and watch eBay flip them at 4×. Your call.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <AddToCartButton
                slug={liveSlug}
                title={TITLE}
                price={livePrice}
                image={COVER}
                disabled={live?.soldOut ?? false}
                label="ADD TO CART"
                className="group bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-black text-sm tracking-[0.25em] px-10 py-4 animate-pulse-ring"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
