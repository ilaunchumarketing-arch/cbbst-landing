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

const SLUG = "of-the-earth-1";
const TITLE = "Of The Earth #1 – Dale Altmann Exclusive Variant";
const PRICE = 20;
const COVER = "/images/exclusives/of-the-earth-1-altmann.png";
const GALLERY = [
  COVER,
  "/images/exclusives/of-the-earth-alt.jpg",
];
const VARIANTS = [
  { name: "UNSIGNED", tier: "$20.00", note: "Raw · bagged & boarded" },
  { name: "CGC 9.8 BLUE LABEL", tier: "From $20", note: "Graded · ships early August" },
  { name: "REGULAR SIGNATURE", tier: "From $20", note: "Dale Altmann signature" },
  { name: "BLOOD SIGNATURE", tier: "From $20", note: "Signed in red ink" },
  { name: "REMARK", tier: "From $20", note: "Custom sketch by Altmann" },
  { name: "REMARK + BLOOD SIG", tier: "From $20", note: "Top tier · sketch + blood sig" },
];

export const metadata: Metadata = {
  title: "Of The Earth #1 — Dale Altmann Exclusive Variant | CBBST",
  description:
    "Neo-noir eco-horror from Chris Condon & Charlie Adlard. Dale Altmann exclusive variant. 500 copies. Image Comics first print.",
  openGraph: {
    title: "Of The Earth #1 · Dale Altmann Exclusive · 500 Made",
    description: "Neo-noir eco-horror. Walking Dead's Charlie Adlard on interiors.",
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
      <main className="bg-[#1a0f08] text-white">
        <TrackViewContent name="Of The Earth #1 – Dale Altmann Exclusive" id="of-the-earth-1" category="exclusive-variant" />

        {/* HERO — desert noir Texas */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden film-grain">
          {/* Sepia gradient + dust */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a1908] via-[#1a0f08] to-[#0c0805]" />
          <div className="absolute inset-0 dust-drift opacity-90" />
          <div className="absolute inset-0 opacity-25">
            <Image src={COVER} alt="" fill className="object-cover blur-[40px] scale-110 animate-slow-zoom" priority />
          </div>
          <div className="absolute inset-0 halftone-overlay opacity-30 mix-blend-multiply" />
          {/* Sun haze */}
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-200/15 blur-[140px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-700/30 to-stone-800/40 blur-3xl pointer-events-none" />
              <ProductGallery
                images={GALLERY}
                alt={TITLE}
                shadowClass="drop-shadow-[0_0_50px_rgba(180,120,60,0.4)]"
              />
            </div>

            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 border border-amber-500/40 bg-amber-500/5 px-3 py-1 mb-6">
                <span className="text-amber-300 text-[10px] font-black tracking-[0.35em]">
                  IMAGE COMICS · 500 COPIES · DALE ALTMANN VARIANT
                </span>
              </div>
              <h1 className="text-white font-black leading-[0.85] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                <span className="block text-3xl sm:text-5xl text-amber-200/70 italic">OF THE</span>
                <span className="block text-7xl sm:text-9xl italic">EARTH</span>
                <span className="block text-2xl sm:text-3xl text-amber-300/80 mt-2 italic tracking-widest">ISSUE №1</span>
              </h1>
              <p className="text-amber-100/70 text-base sm:text-lg mt-6 max-w-lg leading-relaxed font-serif italic">
                &ldquo;Only home isn&apos;t what it once was.<br />
                And neither is Gramma.&rdquo;
              </p>
              <p className="text-white/60 text-sm sm:text-base mt-5 max-w-lg leading-relaxed">
                Tabitha &ldquo;Tabby&rdquo; Black flees a sordid life for the quiet hometown
                of Solitude, Texas — seeking refuge in her grandmother&apos;s house.
                Neo-noir-tinged eco-horror from <span className="text-amber-300 font-bold">Chris Condon</span>{" "}
                (That Texas Blood) and <span className="text-amber-300 font-bold">Charlie Adlard</span> (The Walking Dead).
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className="text-amber-300 font-black text-3xl">$20.00</span>
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
                  buttonClass="group bg-amber-600 hover:bg-amber-500 text-black font-black text-sm tracking-[0.25em] px-8 py-4 animate-pulse-ring"
                  accentClass="border-amber-500 bg-amber-500/15"
                  secondaryCTA={
                    <Link
                      href="https://www.whatnot.com/user/cbbst"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-amber-300/40 hover:border-amber-300 text-amber-300 font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
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
        <section className="relative py-20 px-6 bg-[#0c0805] border-y border-amber-500/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <span className="h-px w-10 bg-amber-500" />
              <span className="text-amber-300 text-[10px] font-black tracking-[0.4em]">THE CREW</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { role: "WRITERS", name: "Chris Condon · Andrew Ehrich", sub: "That Texas Blood · Image Comics" },
                { role: "ARTIST", name: "Charlie Adlard", sub: "The Walking Dead · 16+ years on Image" },
                { role: "COLORIST", name: "Pip Martin", sub: "Eco-noir palette specialist" },
                { role: "LETTERER", name: "Hassan Otsmane-Elhaou", sub: "Eisner-nominated letterer" },
                { role: "DESIGNER", name: "Mike Tivey", sub: "Trade design & layout" },
                { role: "VARIANT COVER", name: "Dale Altmann", sub: "CBBST exclusive variant" },
              ].map((c) => (
                <div key={c.role} className="bg-gradient-to-b from-amber-950/30 to-transparent border border-amber-500/15 hover:border-amber-400/50 transition-colors p-6 film-grain">
                  <div className="text-amber-300 text-[10px] font-black tracking-[0.3em]">{c.role}</div>
                  <div className="text-white font-black text-lg italic mt-2 leading-tight" style={{ fontFamily: "Georgia, serif" }}>{c.name}</div>
                  <div className="text-white/45 text-xs mt-2">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PULL QUOTE / STORY */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0805] via-[#1a0f08] to-[#0c0805]" />
          <div className="absolute inset-0 dust-drift opacity-60" />
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="text-amber-400 text-[10px] font-black tracking-[0.4em] mb-3">SOLITUDE, TEXAS</div>
            <h2 className="text-white font-black text-4xl sm:text-6xl italic leading-[0.95]" style={{ fontFamily: "Georgia, serif" }}>
              SOMETHING&apos;S<br />
              WRONG WITH THE<br />
              <span className="text-amber-400">GROUND.</span>
            </h2>
            <p className="text-amber-100/60 text-base sm:text-lg mt-8 leading-relaxed">
              The land remembers. The town doesn&apos;t. And the woman who raised her
              is still in the kitchen — but she isn&apos;t the same person who used to live
              there. A miniseries about inheritance, ecology, and the rot underneath
              everything.
            </p>
          </div>
        </section>

        {/* VARIANT LADDER */}
        <section className="py-20 px-6 bg-[#0c0805] border-t border-amber-500/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-amber-300 text-[10px] font-black tracking-[0.4em]">VARIANT OPTIONS</div>
              <h2 className="text-white font-black text-3xl sm:text-5xl italic mt-2" style={{ fontFamily: "Georgia, serif" }}>SIX WAYS TO COLLECT</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "UNSIGNED", price: "$20.00", note: "Raw · bagged & boarded" },
                { name: "CGC 9.8 BLUE LABEL", price: "From $20", note: "Graded · ships early August" },
                { name: "REGULAR SIGNATURE", price: "From $20", note: "Dale Altmann signature" },
                { name: "BLOOD SIGNATURE", price: "From $20", note: "Signed in red ink" },
                { name: "REMARK", price: "From $20", note: "Custom sketch by Altmann" },
                { name: "REMARK + BLOOD SIG", price: "From $20", note: "Top tier · sketch + blood sig" },
              ].map((v) => (
                <div key={v.name} className="bg-gradient-to-b from-amber-950/30 to-transparent border border-amber-500/20 hover:border-amber-400/60 transition-colors p-5">
                  <div className="text-amber-300 text-[10px] font-black tracking-widest leading-tight">{v.name}</div>
                  <div className="text-white font-black text-xl italic mt-2" style={{ fontFamily: "Georgia, serif" }}>{v.price}</div>
                  <div className="text-white/50 text-[11px] mt-1.5 leading-snug">{v.note}</div>
                </div>
              ))}
            </div>
            <p className="text-white/35 text-center text-xs tracking-widest mt-8">
              SHIPPING · STANDARD WEEK OF 5/20 · CGC EARLY AUGUST · SIGNATURE/REMARK ADDS WEEKS
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image src={COVER} alt="" fill className="object-cover opacity-20 blur-md scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/60 via-[#0c0805]/95 to-stone-900/60" />
            <div className="absolute inset-0 dust-drift opacity-80" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="text-amber-300 text-[10px] font-black tracking-[0.4em]">500 COPIES</div>
            <h2 className="text-white font-black text-5xl sm:text-7xl italic leading-[0.9] mt-3" style={{ fontFamily: "Georgia, serif" }}>
              MISS THIS ONE,<br />
              <span className="text-amber-400">PAY DOUBLE LATER.</span>
            </h2>
            <p className="text-amber-100/60 text-base sm:text-lg mt-6 max-w-xl mx-auto">
              500 copies. Issue 1. Adlard interior art. Condon writing. Do the math.
            </p>
            <AddToCartButton
              slug={liveSlug}
              title={TITLE}
              price={livePrice}
              image={COVER}
              disabled={live?.soldOut ?? false}
              label="ADD TO CART"
              className="mt-8 group bg-amber-600 hover:bg-amber-500 text-black font-black text-sm tracking-[0.25em] px-10 py-4 animate-pulse-ring"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
