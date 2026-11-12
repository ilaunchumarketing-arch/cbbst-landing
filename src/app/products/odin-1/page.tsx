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

const SLUG = "odin-1";
const TITLE = "Odin #1 – Matt Wilson HeroesCon Exclusive Variant";
const PRICE = 20;
const COVER = "/images/exclusives/odin-1-matt-wilson.png";
const GALLERY = [COVER];
const VARIANTS = [
  { name: "UNSIGNED", tier: "$20.00", note: "Raw · numbered COA included" },
  { name: "CGC 9.8 BLUE LABEL", tier: "From $20", note: "Graded · ships early August" },
  { name: "SIGNED", tier: "From $20", note: "Matt Wilson signature" },
  { name: "REMARKED", tier: "From $20", note: "Custom sketch by Wilson" },
];

export const metadata: Metadata = {
  title: "Odin #1 — Matt Wilson HeroesCon Exclusive Variant | CBBST",
  description:
    "James Tynion IV's most relentless horror. Matt Wilson HeroesCon exclusive variant. 450 copies. Numbered COA. From $20.",
  openGraph: {
    title: "Odin #1 · Matt Wilson HeroesCon Exclusive · 450 Made",
    description: "Green Room meets Midsommar. Tynion IV horror, Matt Wilson cover.",
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
      <main className="bg-[#050a0e] text-white">
        <TrackViewContent name="Odin #1 – Matt Wilson HeroesCon Exclusive" id="odin-1" category="exclusive-variant" />

        {/* HERO — folk horror cold blue & blood */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#020608] via-[#0a1620] to-[#1a0506]" />
          <div className="absolute inset-0 opacity-30">
            <Image src={COVER} alt="" fill className="object-cover blur-3xl scale-125 animate-slow-zoom" priority />
          </div>
          {/* Cold mist */}
          <div className="absolute inset-0 animate-smoke pointer-events-none"
               style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(150,210,230,0.12), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(220,40,40,0.1), transparent 60%)" }} />
          {/* Vertical runes — decorative */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block text-white/[0.04] font-serif text-[10rem] leading-none select-none pointer-events-none">
            ᚦ ᛟ ᛞ ᛁ ᚾ
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-teal-600/20 via-red-900/30 to-transparent blur-3xl frost-pulse pointer-events-none" />
              <ProductGallery
                images={GALLERY}
                alt={TITLE}
                shadowClass="drop-shadow-[0_0_50px_rgba(180,30,30,0.45)]"
              />
            </div>

            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 border border-teal-400/40 bg-teal-500/5 px-3 py-1 mb-6">
                <span className="text-teal-300 text-[10px] font-black tracking-[0.35em]">
                  HEROESCON EXCLUSIVE · 450 COPIES · NUMBERED COA
                </span>
              </div>
              <h1 className="text-white font-black italic leading-[0.85] tracking-tighter">
                <span className="block text-7xl sm:text-9xl">ODIN</span>
                <span className="block text-2xl sm:text-3xl text-red-400 mt-2 tracking-widest">ISSUE #1 · FIRST PRINT</span>
              </h1>
              <p className="text-white/70 text-lg sm:text-xl mt-6 italic max-w-lg leading-relaxed font-serif">
                &ldquo;Green Room meets Midsommar in James Tynion IV&apos;s most relentless horror story yet.&rdquo;
              </p>
              <p className="text-white/55 text-base mt-5 max-w-lg leading-relaxed">
                Adela infiltrates a neo-Nazi punk group heading to the frozen forests
                of Norway. They believe they&apos;ll summon Odin. Something <span className="text-red-400 italic">far older</span> —
                and far more terrifying — is already waiting.
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className="text-teal-300 font-black text-3xl">$20.00</span>
                <span className="text-white/40 text-xs tracking-widest font-bold">FROM · NUMBERED COA INCLUDED</span>
              </div>

              <div className="mt-7">
                <ProductBuyBlock
                  slug={liveSlug}
                  title={TITLE}
                  price={livePrice}
                  image={COVER}
                  variants={liveVariants}
                  soldOut={live?.soldOut ?? false}
                  buttonClass="group bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-[0.25em] px-8 py-4 animate-pulse-ring"
                  accentClass="border-red-500 bg-red-500/15"
                  secondaryCTA={
                    <Link
                      href="https://www.whatnot.com/user/cbbst"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-teal-300/40 hover:border-teal-300 text-teal-300 font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
                    >
                      WATCH ON WHATNOT →
                    </Link>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* CREATIVE TEAM */}
        <section className="relative py-20 px-6 bg-black border-y border-teal-500/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <span className="h-px w-10 bg-teal-400" />
              <span className="text-teal-300 text-[10px] font-black tracking-[0.4em]">THE CREATIVE TEAM</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { role: "WRITERS", name: "James Tynion IV & Marguerite Bennett", sub: "Eisner-winning horror duo" },
                { role: "ARTIST", name: "Letizia Cadonici", sub: "Razorblades · House of Slaughter" },
                { role: "COLORIST", name: "Jordie Bellaire", sub: "Multiple Eisner winner" },
                { role: "VARIANT ARTIST", name: "Matt Wilson", sub: "HeroesCon Exclusive Cover" },
              ].map((c) => (
                <div key={c.role} className="bg-gradient-to-b from-teal-950/40 to-black border border-teal-500/20 hover:border-red-500/50 transition-colors p-6 frost-pulse">
                  <div className="text-teal-300 text-[10px] font-black tracking-[0.3em]">{c.role}</div>
                  <div className="text-white font-black text-lg italic mt-2 leading-tight">{c.name}</div>
                  <div className="text-white/50 text-xs mt-2">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE PANEL */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#020608] via-[#0a1620] to-[#1a0506]" />
          <div className="absolute inset-0 opacity-20 animate-smoke"
               style={{ background: "radial-gradient(ellipse at center, rgba(100,180,200,0.3), transparent 70%)" }} />
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="text-red-400 text-3xl mb-4">†</div>
            <h2 className="text-white font-black text-3xl sm:text-5xl italic leading-tight font-serif">
              &ldquo;Something far <span className="text-red-500 animate-flicker">older</span> —
              and far more <span className="text-teal-300">terrifying</span> —
              awaits them in the woods.&rdquo;
            </h2>
            <div className="text-white/30 text-[10px] tracking-[0.4em] font-black mt-8">
              · ISSUE 01 · NORWAY · WINTER ·
            </div>
          </div>
        </section>

        {/* VARIANT LADDER */}
        <section className="py-20 px-6 bg-black border-t border-teal-500/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-teal-300 text-[10px] font-black tracking-[0.4em]">VARIANT OPTIONS</div>
              <h2 className="text-white font-black text-3xl sm:text-5xl italic mt-2">FOUR WAYS TO COLLECT</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "UNSIGNED", price: "$20.00", note: "Raw · numbered COA included" },
                { name: "CGC 9.8 BLUE LABEL", price: "From $20", note: "Graded · ships early August" },
                { name: "SIGNED", price: "From $20", note: "Matt Wilson signature" },
                { name: "REMARKED", price: "From $20", note: "Custom sketch by Wilson" },
              ].map((v) => (
                <div key={v.name} className="bg-gradient-to-b from-teal-950/30 to-transparent border border-teal-500/30 hover:border-red-400/60 transition-colors p-5">
                  <div className="text-teal-300 text-[10px] font-black tracking-widest leading-tight">{v.name}</div>
                  <div className="text-white font-black text-xl italic mt-2">{v.price}</div>
                  <div className="text-white/50 text-[11px] mt-1.5 leading-snug">{v.note}</div>
                </div>
              ))}
            </div>
            <p className="text-white/40 text-center text-xs tracking-widest mt-8">
              SHIPPING · STANDARD WEEK OF 5/20 · CGC EARLY AUGUST · SIGNATURE/REMARK ADDS WEEKS
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image src={COVER} alt="" fill className="object-cover opacity-20 blur-md scale-110" />
            <div className="absolute inset-0 bg-gradient-to-br from-teal-950/80 via-black/90 to-red-950/60" />
            <div className="absolute inset-0 halftone-overlay opacity-20" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-red-500/40 animate-scanline" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="text-teal-300 text-[10px] font-black tracking-[0.4em] animate-flicker">450 COPIES</div>
            <h2 className="text-white font-black text-5xl sm:text-7xl italic leading-[0.9] mt-3 font-serif">
              SUMMON YOURS.<br />
              <span className="text-red-500">BEFORE THE WOODS CLOSE.</span>
            </h2>
            <AddToCartButton
              slug={liveSlug}
              title={TITLE}
              price={livePrice}
              image={COVER}
              disabled={live?.soldOut ?? false}
              label="ADD TO CART"
              className="mt-8 group bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-[0.25em] px-10 py-4 animate-pulse-ring"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
