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

const SLUG = "exquisite-corpses-13-bw-virgin";
const TITLE = "Exquisite Corpses #13 – Dale Altmann B&W Virgin Variant";
const PRICE = 20;
const COVER = "/images/exclusives/exquisite-corpses-13-bw-virgin.png";
const ALT = "/images/exclusives/exquisite-corpses-13-bw-alt-a.jpg";
const GALLERY = [
  COVER,
  ALT,
  "/images/exclusives/exquisite-corpses-13-coa.jpg",
];
const VARIANTS = [
  { name: "UNSIGNED", tier: "$20.00", note: "B&W Virgin + COA card" },
  { name: "REGULAR SIGNATURE", tier: "From $20", note: "Dale Altmann signature" },
  { name: "BLOOD SIGNATURE", tier: "From $20", note: "Signed in red ink" },
  { name: "REMARK", tier: "From $20", note: "Custom sketch by Altmann" },
  { name: "REMARK + BLOOD SIG", tier: "From $20", note: "Top tier · sketch + blood sig" },
];

export const metadata: Metadata = {
  title: "Exquisite Corpses #13 — Dale Altmann B&W Virgin Variant | CBBST",
  description:
    "Season 1 finale. Stark black & white virgin variant by Dale Altmann. No trade dress. 500 copies. Trading card COA. 1-of-1 art chance.",
  openGraph: {
    title: "Exquisite Corpses #13 · B&W Virgin · 500 Made",
    description: "Raw black & white virgin. No trade dress. 500 copies.",
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
        <TrackViewContent name="Exquisite Corpses #13 – B&W Virgin Variant" id="exquisite-corpses-13-bw-virgin" category="exclusive-variant" />

        {/* HERO — stark ink-on-paper monochrome */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          {/* Pure black with paper-grain feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
          <div className="absolute inset-0 film-grain opacity-100" />
          {/* Single drop of blood red — accent */}
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-red-600/15 blur-[120px] animate-float-slow" />
          {/* Ink splatters */}
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-black opacity-90 ink-pulse" style={{ filter: "blur(40px)" }} />
          <div className="absolute bottom-1/4 right-1/3 h-48 w-48 rounded-full bg-black ink-pulse" style={{ filter: "blur(50px)", animationDelay: "2s" }} />
          {/* Scanline */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-white/60 animate-scanline" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-white/5 blur-3xl pointer-events-none" />
              <ProductGallery
                images={GALLERY}
                alt={TITLE}
                shadowClass="drop-shadow-[0_0_50px_rgba(255,255,255,0.15)] grayscale"
              />
              {/* Blood drip accent */}
              <div className="absolute top-0 right-8 w-2 h-32 blood-streak animate-drip pointer-events-none z-20" />
            </div>

            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 border border-white/40 bg-white/5 px-3 py-1 mb-6">
                <span className="text-white text-[10px] font-black tracking-[0.35em]">
                  B&amp;W VIRGIN · NO TRADE DRESS · 500 MADE
                </span>
              </div>
              <h1 className="text-white font-black italic leading-[0.85] tracking-tighter">
                <span className="block text-3xl sm:text-5xl text-white/70">EXQUISITE</span>
                <span className="block text-5xl sm:text-7xl">CORPSES</span>
                <span className="block text-7xl sm:text-9xl text-red-600">#13</span>
                <span className="block text-base sm:text-xl text-white/60 mt-2 tracking-widest font-bold">
                  BLACK &amp; WHITE VIRGIN
                </span>
              </h1>
              <p className="text-white/70 text-base sm:text-lg mt-6 italic max-w-lg leading-relaxed font-serif">
                &ldquo;The end is here… and it&apos;s going out in blood and glory.&rdquo;
              </p>
              <p className="text-white/55 text-base mt-4 max-w-lg leading-relaxed">
                Raw artwork. No trade dress. No color. Just <span className="text-white font-bold">Dale Altmann&apos;s ink lines</span>{" "}
                breathing on the page exactly the way he drew them. The final issue
                of season 1, the most minimal way to read it.
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className="text-white font-black text-3xl">$20.00</span>
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
                  buttonClass="group bg-white hover:bg-zinc-200 text-black font-black text-sm tracking-[0.25em] px-8 py-4 animate-pulse-ring"
                  accentClass="border-red-600 bg-red-600/15"
                  secondaryCTA={
                    <Link
                      href="https://www.whatnot.com/user/cbbst"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-red-600/60 hover:border-red-500 text-red-500 font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
                    >
                      WATCH ON WHATNOT →
                    </Link>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IS A VIRGIN VARIANT */}
        <section className="py-20 px-6 bg-zinc-950 border-y border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <span className="h-px w-10 bg-white" />
              <span className="text-white text-[10px] font-black tracking-[0.4em]">WHAT MAKES IT VIRGIN</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { n: "01", t: "NO TRADE DRESS", b: "No logos, no titles, no credits, no UPC. Just the raw cover artwork breathing on the page." },
                { n: "02", t: "500 MADE", b: "Hard cap on the print run. When they sell through, the door closes for good." },
                { n: "03", t: "TRADING CARD COA", b: "Premium cardstock COA inserted at random. Twelve unique designs across the run." },
                { n: "04", t: "1-OF-1 ART CHANCE", b: "Original art pieces scattered randomly across the print run. Open the package and pray." },
              ].map((c) => (
                <div key={c.n} className="group relative bg-black border border-white/15 hover:border-red-500/60 transition-all p-6">
                  <div className="absolute -top-3 left-5 bg-white text-black font-black text-[10px] tracking-[0.3em] px-2 py-1">{c.n}</div>
                  <h3 className="text-white font-black text-lg italic mt-3 leading-tight">{c.t}</h3>
                  <p className="text-white/55 text-sm mt-3 leading-relaxed">{c.b}</p>
                  <div className="mt-5 h-[2px] w-8 bg-red-600 group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE BLOCK */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
          <div className="absolute inset-0 film-grain opacity-100" />
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="text-white/50 text-3xl mb-4">&ldquo;</div>
            <h2 className="text-white font-black text-4xl sm:text-6xl italic leading-[0.95]">
              TWELVE KILLERS.<br />
              ONE NIGHT.<br />
              <span className="text-red-600">ONE SURVIVOR.</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg mt-8 leading-relaxed">
              Dropped into Oak Valley on Halloween night to fight for the fate of
              the country. Season finale of Tynion IV and Walsh&apos;s horror series.
              No reprints. No reboots. This is how it ends.
            </p>
          </div>
        </section>

        {/* ALT IMAGE */}
        <section className="relative bg-black border-y border-white/10 overflow-hidden">
          <div className="relative aspect-[3/1] max-h-[480px]">
            <Image src={ALT} alt="Exquisite Corpses #13 alt" fill className="object-cover grayscale opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-600 text-[10px] font-black tracking-[0.5em] mb-3">RAW INK · NO COLOR · NO LOGO</div>
                <h3 className="text-white font-black text-4xl sm:text-6xl italic">PURE ALTMANN.</h3>
              </div>
            </div>
          </div>
        </section>

        {/* VARIANTS */}
        <section className="py-20 px-6 bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-white text-[10px] font-black tracking-[0.4em]">VARIANT TIERS</div>
              <h2 className="text-white font-black text-3xl sm:text-5xl italic mt-2">FIVE WAYS TO COLLECT</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { name: "UNSIGNED", price: "$20.00", note: "B&W Virgin + COA card" },
                { name: "REGULAR SIGNATURE", price: "From $20", note: "Dale Altmann signature" },
                { name: "BLOOD SIGNATURE", price: "From $20", note: "Signed in red ink" },
                { name: "REMARK", price: "From $20", note: "Custom sketch by Altmann" },
                { name: "REMARK + BLOOD SIG", price: "From $20", note: "Top tier · sketch + blood sig" },
              ].map((v) => (
                <div key={v.name} className="bg-black border border-white/20 hover:border-red-500/60 transition-colors p-4">
                  <div className="text-white text-[10px] font-black tracking-widest leading-tight">{v.name}</div>
                  <div className="text-white font-black text-xl italic mt-2">{v.price}</div>
                  <div className="text-white/50 text-[11px] mt-1.5 leading-snug">{v.note}</div>
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
            <Image src={COVER} alt="" fill className="object-cover opacity-20 blur-md scale-110 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900/95 to-black" />
            <div className="absolute inset-0 film-grain opacity-100" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-red-600/40 animate-scanline" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="text-red-600 text-[10px] font-black tracking-[0.4em] animate-flicker">FINAL ISSUE OF SEASON 1</div>
            <h2 className="text-white font-black text-5xl sm:text-7xl italic leading-[0.9] mt-3">
              JUST BLACK INK.<br />
              <span className="text-red-600">JUST 500.</span>
            </h2>
            <AddToCartButton
              slug={liveSlug}
              title={TITLE}
              price={livePrice}
              image={COVER}
              disabled={live?.soldOut ?? false}
              label="ADD TO CART"
              className="mt-8 group bg-white hover:bg-zinc-200 text-black font-black text-sm tracking-[0.25em] px-10 py-4 animate-pulse-ring"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
