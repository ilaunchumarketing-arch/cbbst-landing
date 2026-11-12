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

const SLUG = "exquisite-corpses-13-foil-virgin";
const TITLE = "Exquisite Corpses #13 – Dale Altmann Full Color Foil Virgin Variant";
const PRICE = 30;
const COVER = "/images/exclusives/exquisite-corpses-13-foil-virgin.png";
const COA_IMG = "/images/exclusives/exquisite-corpses-13-coa.jpg";
const GALLERY = [
  COVER,
  "/images/exclusives/exquisite-corpses-13-bw-alt-a.jpg",
  COA_IMG,
];
const VARIANTS = [
  { name: "UNSIGNED", tier: "$30.00", note: "Foil virgin + COA card" },
  { name: "REGULAR SIGNATURE", tier: "From $30", note: "Dale Altmann signature" },
  { name: "BLOOD SIGNATURE", tier: "From $30", note: "Signed in red ink" },
  { name: "REMARK", tier: "From $30", note: "Custom sketch by Altmann" },
  { name: "REMARK + BLOOD SIG", tier: "From $30", note: "Top tier · sketch + blood sig" },
];

export const metadata: Metadata = {
  title: "Exquisite Corpses #13 — Dale Altmann Full Color Foil Virgin | CBBST",
  description:
    "Season finale. Tynion IV horror. Foil virgin variant by Dale Altmann. 500 copies. Trading card COA inside. Chance to pull a 1-of-1.",
  openGraph: {
    title: "Exquisite Corpses #13 · Foil Virgin · 500 Made",
    description: "Season 1 finale. Foil virgin variant. 12 COA designs. 1/1 art chance.",
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
      <main className="bg-[#0a0805] text-white">
        <TrackViewContent name="Exquisite Corpses #13 – Foil Virgin Variant" id="exquisite-corpses-13-foil-virgin" category="exclusive-variant" />

        {/* HERO — foil chrome premium */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-black to-stone-900" />
          {/* Animated foil sweep across the whole hero */}
          <div className="absolute inset-0 foil-shimmer pointer-events-none" />
          {/* Iridescent backdrop */}
          <div className="absolute -top-32 -left-32 h-[36rem] w-[36rem] rounded-full bg-amber-400/20 blur-[140px] animate-float-slow" />
          <div className="absolute -bottom-32 -right-32 h-[36rem] w-[36rem] rounded-full bg-amber-200/10 blur-[140px] animate-float-slow" />
          <div className="absolute inset-x-0 top-0 h-[2px] bg-amber-300/60 animate-scanline" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-gradient-conic from-amber-200/30 via-amber-500/50 via-yellow-300/40 to-amber-200/30 blur-3xl animate-float-slow pointer-events-none" />
              <ProductGallery
                images={GALLERY}
                alt={TITLE}
                shadowClass="drop-shadow-[0_0_60px_rgba(255,215,0,0.5)]"
              />
            </div>

            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 border border-amber-300/50 bg-amber-500/10 px-3 py-1 mb-6">
                <span className="text-amber-300 text-[10px] font-black tracking-[0.35em]">
                  FOIL VIRGIN VARIANT · 500 COPIES
                </span>
              </div>
              <h1 className="text-white font-black italic leading-[0.85] tracking-tighter">
                <span className="block text-3xl sm:text-5xl text-amber-300">EXQUISITE</span>
                <span className="block text-5xl sm:text-7xl bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent animate-flicker">
                  CORPSES
                </span>
                <span className="block text-7xl sm:text-9xl text-white">#13</span>
                <span className="block text-base sm:text-xl text-amber-300/80 mt-2 tracking-widest font-bold">
                  FULL COLOR FOIL VIRGIN
                </span>
              </h1>
              <p className="text-white/70 text-base sm:text-lg mt-6 italic max-w-lg leading-relaxed font-serif">
                &ldquo;The end is here… and it&apos;s going out in blood and glory.&rdquo;
              </p>
              <p className="text-white/55 text-base mt-4 max-w-lg leading-relaxed">
                Season 1 finale. Twelve killers. One Halloween night in Oak Valley.
                The country&apos;s fate in the balance. Full premium foil treatment,
                virgin artwork — <span className="text-amber-300 font-bold">no trade dress</span>{" "}
                covering Dale Altmann&apos;s cover.
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className="text-amber-300 font-black text-3xl">$30.00</span>
                <span className="text-white/40 text-xs tracking-widest font-bold">FROM · UNSIGNED · COA INSIDE</span>
              </div>

              <div className="mt-7">
                <ProductBuyBlock
                  slug={liveSlug}
                  title={TITLE}
                  price={livePrice}
                  image={COVER}
                  variants={liveVariants}
                  soldOut={live?.soldOut ?? false}
                  buttonClass="group bg-amber-400 hover:bg-amber-300 text-black font-black text-sm tracking-[0.25em] px-8 py-4 animate-pulse-ring"
                  accentClass="border-amber-300 bg-amber-400/20"
                  secondaryCTA={
                    <Link
                      href="https://www.whatnot.com/user/cbbst"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-white/30 hover:border-amber-300 text-white hover:text-amber-300 font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
                    >
                      WATCH ON WHATNOT →
                    </Link>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* COA TRADING CARD REVEAL */}
        <section className="relative py-20 sm:py-28 px-6 overflow-hidden bg-gradient-to-b from-[#0a0805] via-amber-950/30 to-[#0a0805]">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-amber-300/30" />
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-amber-300/30" />
          <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-conic from-amber-300/20 to-transparent blur-2xl animate-float-slow" />
              <div className="relative aspect-square max-w-md mx-auto bg-black border border-amber-300/30 p-4">
                <div className="relative w-full h-full">
                  <Image src={COA_IMG} alt="Exquisite Corpses trading card COA" fill className="object-cover" />
                </div>
              </div>
            </div>
            <div>
              <div className="text-amber-300 text-[10px] font-black tracking-[0.4em] mb-3">WHAT&apos;S INSIDE</div>
              <h2 className="text-white font-black text-4xl sm:text-5xl italic leading-tight">
                A TRADING CARD<br />
                <span className="text-amber-300">FOR EVERY COPY.</span>
              </h2>
              <p className="text-white/65 text-base sm:text-lg mt-6 leading-relaxed">
                Every Foil Virgin ships with one randomly inserted trading card
                Certificate of Authenticity. Twelve unique COA designs in the wild.
                Collect the full set if you can find them.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { n: "12", l: "COA designs" },
                  { n: "500", l: "Print run total" },
                  { n: "1/1", l: "Original art chance" },
                ].map((s) => (
                  <div key={s.l} className="bg-black border border-amber-400/30 p-4 text-center">
                    <div className="text-amber-300 font-black text-3xl italic">{s.n}</div>
                    <div className="text-white/50 text-[10px] font-black tracking-widest mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-sm mt-4">
                One-of-one original art pieces are randomly distributed across the
                print run. Open the package. Find out what you got.
              </p>
            </div>
          </div>
        </section>

        {/* CREATIVE TEAM */}
        <section className="py-20 px-6 bg-[#0a0805] border-y border-amber-400/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <span className="h-px w-10 bg-amber-400" />
              <span className="text-amber-300 text-[10px] font-black tracking-[0.4em]">THE FINALE CREW</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { role: "WRITER", name: "James Tynion IV", sub: "Eisner winner · The Nice House by the Sea" },
                { role: "ARTIST", name: "Michael Walsh", sub: "Eisner nominee · Universal Monsters: Frankenstein" },
                { role: "VARIANT ART", name: "Dale Altmann", sub: "Full Color Foil Virgin cover" },
              ].map((c) => (
                <div key={c.role} className="relative bg-gradient-to-b from-amber-950/40 to-transparent border border-amber-400/30 hover:border-amber-300 transition-colors p-6 overflow-hidden">
                  <div className="absolute inset-0 foil-shimmer opacity-30 pointer-events-none" />
                  <div className="relative">
                    <div className="text-amber-300 text-[10px] font-black tracking-[0.3em]">{c.role}</div>
                    <div className="text-white font-black text-xl italic mt-2 leading-tight">{c.name}</div>
                    <div className="text-white/50 text-xs mt-2">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VARIANTS */}
        <section className="py-20 px-6 bg-[#0a0805] border-t border-amber-400/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-amber-300 text-[10px] font-black tracking-[0.4em]">VARIANT TIERS</div>
              <h2 className="text-white font-black text-3xl sm:text-5xl italic mt-2">FIVE COLLECTOR TIERS</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { name: "UNSIGNED", price: "$30.00", note: "Foil virgin + COA card" },
                { name: "REGULAR SIGNATURE", price: "From $30", note: "Dale Altmann signature" },
                { name: "BLOOD SIGNATURE", price: "From $30", note: "Signed in red ink" },
                { name: "REMARK", price: "From $30", note: "Custom sketch by Altmann" },
                { name: "REMARK + BLOOD SIG", price: "From $30", note: "Top tier · sketch + blood sig" },
              ].map((v) => (
                <div key={v.name} className="relative bg-gradient-to-b from-amber-950/30 to-transparent border border-amber-400/30 hover:border-amber-300 transition-colors p-4 overflow-hidden">
                  <div className="absolute inset-0 foil-shimmer opacity-20 pointer-events-none" />
                  <div className="relative">
                    <div className="text-amber-300 text-[10px] font-black tracking-widest leading-tight">{v.name}</div>
                    <div className="text-white font-black text-xl italic mt-2">{v.price}</div>
                    <div className="text-white/50 text-[11px] mt-1.5 leading-snug">{v.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-white/40 text-center text-xs tracking-widest mt-8">
              SHIPPING · STANDARD WEEK OF 5/20 · SIGNATURE/REMARK ADDS WEEKS
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image src={COVER} alt="" fill className="object-cover opacity-25 blur-md scale-110" />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 via-black/95 to-stone-900/70" />
            <div className="absolute inset-0 foil-shimmer opacity-50" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="text-amber-300 text-[10px] font-black tracking-[0.4em] animate-flicker">
              SEASON ONE FINALE · NO REPRINTS
            </div>
            <h2 className="text-white font-black text-5xl sm:text-7xl italic leading-[0.9] mt-3">
              END OF SEASON.<br />
              <span className="text-amber-300">BLOOD AND</span>{" "}
              <span className="text-amber-400">GLORY.</span>
            </h2>
            <AddToCartButton
              slug={liveSlug}
              title={TITLE}
              price={livePrice}
              image={COVER}
              disabled={live?.soldOut ?? false}
              label="ADD TO CART"
              className="mt-8 group bg-amber-400 hover:bg-amber-300 text-black font-black text-sm tracking-[0.25em] px-10 py-4 animate-pulse-ring"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
