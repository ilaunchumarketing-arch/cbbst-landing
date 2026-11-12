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

const SLUG = "lobo-3";
const TITLE = "Lobo #3 – Ryan G. Browne Exclusive Variant";
const PRICE = 20;
const COVER = "/images/exclusives/lobo-3-ryan-browne.png";
const GALLERY = [
  COVER,
  "/images/exclusives/lobo-3-back.png",
];
const VARIANTS = [
  { name: "UNSIGNED", tier: "$20.00", note: "Raw · bagged & boarded · COA" },
  { name: "CGC 9.8 BLUE LABEL", tier: "From $20", note: "Graded · ships early August" },
];

export const metadata: Metadata = {
  title: "Lobo #3 — Ryan G. Browne Exclusive Variant | CBBST",
  description:
    "Ryan G. Browne's first-ever DC exclusive cover. Limited to 666 copies. First appearance of a previously unknown Green Lantern. $20.",
  openGraph: {
    title: "Lobo #3 · Ryan G. Browne Exclusive · 666 Made",
    description: "First DC exclusive from Browne. 666 copies. COA included.",
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
        <TrackViewContent name="Lobo #3 – Ryan G. Browne Exclusive Variant" id="lobo-3" category="exclusive-variant" />

        {/* HERO — distressed chrome biker punk */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-zinc-950 film-grain">
          {/* Background — ash texture */}
          <div className="absolute inset-0 opacity-50">
            <Image src={COVER} alt="" fill className="object-cover blur-2xl scale-110" priority />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950/95 to-red-950/40" />
          <div className="absolute inset-0 halftone-overlay opacity-40" />
          {/* Chrome streak across hero */}
          <div className="absolute inset-x-0 top-1/3 h-32 chrome-streak pointer-events-none" />
          {/* 666 watermark */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
            <div className="text-[18rem] font-black italic leading-none text-cbbst-red/5 tracking-tighter">666</div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-red-700/40 to-zinc-700/40 blur-2xl pointer-events-none" />
              <ProductGallery
                images={GALLERY}
                alt={TITLE}
                shadowClass="drop-shadow-[0_0_50px_rgba(232,25,44,0.4)]"
              />
            </div>

            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 border border-red-500/40 bg-red-500/10 px-3 py-1 mb-6">
                <span className="text-red-400 text-[10px] font-black tracking-[0.35em]">
                  DC EXCLUSIVE · 666 COPIES
                </span>
              </div>
              <h1 className="text-white font-black italic leading-[0.85] tracking-tighter">
                <span className="block text-7xl sm:text-9xl glitch" data-text="LOBO">LOBO</span>
                <span className="block text-3xl sm:text-5xl text-red-500 mt-2">ISSUE #3</span>
                <span className="block text-base sm:text-xl text-white/60 tracking-widest mt-2 font-bold">
                  RYAN G. BROWNE · FIRST DC EXCLUSIVE
                </span>
              </h1>
              <p className="text-white/70 text-base sm:text-lg mt-6 max-w-lg leading-relaxed">
                The Main Man is back — and corporate life isn&apos;t ready for him.
                Mandatory psychological evaluations. Showbiz alimony. And the{" "}
                <span className="text-red-400 font-bold">first appearance of a previously unknown Green Lantern.</span>
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className="text-red-400 font-black text-3xl">$20.00</span>
                <span className="text-white/40 text-xs tracking-widest font-bold">FROM · UNSIGNED · COA INCLUDED</span>
              </div>

              <div className="mt-7">
                <ProductBuyBlock
                  slug={liveSlug}
                  title={TITLE}
                  price={livePrice}
                  image={COVER}
                  variants={liveVariants}
                  soldOut={live?.soldOut ?? false}
                  buttonClass="group bg-red-500 hover:bg-red-400 text-black font-black text-sm tracking-[0.25em] px-8 py-4 animate-pulse-ring"
                  accentClass="border-red-500 bg-red-500/15"
                  secondaryCTA={
                    <Link
                      href="https://www.whatnot.com/user/cbbst"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-white/30 hover:border-red-400 text-white hover:text-red-400 font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
                    >
                      WATCH ON WHATNOT →
                    </Link>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* WHY THIS BOOK */}
        <section className="relative py-20 px-6 bg-zinc-950 border-y border-red-500/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <span className="h-px w-10 bg-red-500" />
              <span className="text-red-400 text-[10px] font-black tracking-[0.4em]">WHY THIS BOOK HITS</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { tag: "01", title: "FIRST DC EXCLUSIVE", body: "Ryan G. Browne has cooked for years. This is his first-ever DC exclusive cover. Future-grade collectible." },
                { tag: "02", title: "PRINT RUN OF 666", body: "Each copy ships with a backer board Certificate of Authenticity. When the run hits zero, the door closes." },
                { tag: "03", title: "NEW GL APPEARS", body: "First appearance of a previously unknown Green Lantern inside the issue. Speculator key, not just a variant." },
                { tag: "04", title: "MAIN MAN RETURNS", body: "Corporate-life Lobo navigating a professionalized bounty industry. Czarnian history finally on the page." },
              ].map((c) => (
                <div key={c.tag} className="group relative bg-black border border-white/10 hover:border-red-500/60 transition-all p-6">
                  <div className="absolute -top-3 left-5 bg-red-500 text-black font-black text-[10px] tracking-[0.3em] px-2 py-1">{c.tag}</div>
                  <h3 className="text-white font-black text-lg mt-3 leading-tight">{c.title}</h3>
                  <p className="text-white/55 text-sm mt-3 leading-relaxed">{c.body}</p>
                  <div className="mt-5 h-[2px] w-8 bg-red-500 group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE STORY */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-red-950/30" />
          <div className="absolute inset-0 halftone-overlay opacity-20" />
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="text-red-400 text-[10px] font-black tracking-[0.4em] mb-3">THE PLOT</div>
            <h2 className="text-white font-black text-4xl sm:text-6xl italic leading-[0.95]">
              &ldquo;THE MAIN MAN<br />
              ISN&apos;T <span className="text-red-500">DONE.</span>&rdquo;
            </h2>
            <p className="text-white/70 text-base sm:text-lg mt-8 leading-relaxed">
              After a falling out with show business, Lobo returns to bounty hunting —
              only to find the industry has been professionalized, corporatized, and
              wrapped in red tape by a major entertainment conglomerate. Mandatory
              empath evaluations. Contract clauses. Czarnian heritage finally
              addressed. And the kind of cliffhanger that creates a new
              speculator chase.
            </p>
          </div>
        </section>

        {/* VARIANTS */}
        <section className="py-20 px-6 bg-black border-t border-red-500/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-red-400 text-[10px] font-black tracking-[0.4em]">VARIANT OPTIONS</div>
              <h2 className="text-white font-black text-3xl sm:text-5xl italic mt-2">TWO WAYS IN</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-zinc-950 border border-red-500/30 hover:border-red-500 transition-colors p-6">
                <div className="text-red-400 text-[10px] font-black tracking-[0.3em]">UNSIGNED</div>
                <div className="text-white font-black text-3xl italic mt-2">$20.00</div>
                <p className="text-white/55 text-sm mt-3">
                  Raw · bagged &amp; boarded. Backer-board COA included. Ships week of 5/20.
                </p>
              </div>
              <div className="bg-zinc-950 border border-red-500/30 hover:border-red-500 transition-colors p-6">
                <div className="text-red-400 text-[10px] font-black tracking-[0.3em]">CGC 9.8 BLUE LABEL</div>
                <div className="text-white font-black text-3xl italic mt-2">From $20</div>
                <p className="text-white/55 text-sm mt-3">
                  Professionally graded · Blue label authentication. Ships early August.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image src={COVER} alt="" fill className="object-cover opacity-20 blur-md scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 via-black/90 to-zinc-900/70" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-red-500/40 animate-scanline" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="text-red-400 text-[10px] font-black tracking-[0.4em] animate-flicker">DON&apos;T BE THE GUY WHO SLEEPS ON IT</div>
            <h2 className="text-white font-black text-6xl sm:text-8xl italic leading-[0.85] mt-3">
              <span className="text-red-500">666</span><br />
              COPIES.<br />
              FOREVER.
            </h2>
            <p className="text-white/60 text-base sm:text-lg mt-6 max-w-xl mx-auto">
              When the run sells through, that&apos;s it. No second print. No reprint.
              No &ldquo;they&apos;ll do another one.&rdquo; Just whoever moved first.
            </p>
            <AddToCartButton
              slug={liveSlug}
              title={TITLE}
              price={livePrice}
              image={COVER}
              disabled={live?.soldOut ?? false}
              label="ADD TO CART"
              className="mt-8 group bg-red-500 hover:bg-red-400 text-black font-black text-sm tracking-[0.25em] px-10 py-4 animate-pulse-ring"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
