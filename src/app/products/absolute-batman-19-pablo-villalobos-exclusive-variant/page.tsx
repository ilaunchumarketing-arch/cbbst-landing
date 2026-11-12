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

/**
 * Bespoke, one-off product page for the Absolute Batman #19 – Pablo Villalobos
 * Exclusive Variant (the DEBUT OF ABSOLUTE SCARECROW). Its own color + personality:
 * a Scarecrow "fear-toxin" horror treatment — sickly acid-green fear gas, charcoal
 * black, burlap/rust — deliberately distinct from the site's red/gold Batman pages
 * and #22's bats. Pricing + variants come LIVE from Shopify (source of truth);
 * this file only supplies the presentation.
 */

const SLUG = "absolute-batman-19-pablo-villalobos-exclusive-variant";
const TITLE = "Absolute Batman #19 – Pablo Villalobos Exclusive Variant";
const PRICE = 15;
const COVER = "/images/exclusives/absolute-batman-19-trade.webp";
const GALLERY = [
  COVER,
  "/images/exclusives/absolute-batman-19-set.webp",
  "/images/exclusives/absolute-batman-19-cgc.webp",
];
const VARIANTS = [
  { name: "TRADE", tier: "$15.00", note: "Trade dress cover · raw 9.2+" },
  { name: "TRADE / VIRGIN FOIL / VIRGIN B&W SET", tier: "$60.00", note: "All three covers · matched set" },
  { name: "CGC 9.8 BLUE LABEL TRADE", tier: "$90.00", note: "Professionally graded · ships early November" },
];

// Fear-toxin palette (kept inline so this page owns its identity)
const TOXIN = "#8fe04a"; // acid fear-gas green
const TOXIN_DEEP = "#5f8f26";
const RUST = "#c08a3e"; // burlap / scarecrow-sack accent

export const metadata: Metadata = {
  title: "Absolute Batman #19 — Pablo Villalobos Exclusive · Debut of Absolute Scarecrow | CBBST",
  description:
    "The first appearance of ABSOLUTE SCARECROW. A Pablo Villalobos exclusive variant — a dark, horror-driven new arc for the Absolute Batman saga. Trade $15 · Set $60 · CGC 9.8 $90. Raw books guaranteed 9.2 or better.",
  openGraph: {
    title: "Absolute Batman #19 · Pablo Villalobos Exclusive · Debut of Absolute Scarecrow",
    description:
      "Fear is evolving. The first appearance of Absolute Scarecrow — a new arc begins. From $15.",
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
  const soldOut = live?.soldOut ?? false;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      {soldOut && <SoldOutBanner />}
      <main className="bg-[#060a04] text-white">
        <TrackViewContent name={TITLE} id={SLUG} category="exclusive-variant" />

        {/* ================= HERO — fear-toxin fog ================= */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#060a04] film-grain">
          {/* Cover bloom background */}
          <div className="absolute inset-0 opacity-40">
            <Image src={COVER} alt="" fill className="object-cover blur-[70px] scale-125 animate-slow-zoom" priority />
          </div>
          {/* Toxic wash gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #060a04 0%, rgba(6,10,4,0.82) 45%, rgba(24,42,10,0.55) 100%)",
            }}
          />
          <div className="absolute inset-0 halftone-overlay opacity-25" />
          {/* Drifting fear-gas clouds */}
          <div
            className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full blur-[130px] animate-smoke pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(143,224,74,0.28) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-28 right-0 h-[30rem] w-[30rem] rounded-full blur-[140px] animate-float-slow pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(95,143,38,0.22) 0%, transparent 70%)" }}
          />
          {/* Scanning fear-line */}
          <div
            className="absolute inset-x-0 top-1/3 h-[2px] animate-scanline pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(143,224,74,0.5), transparent)" }}
          />
          {/* FEAR watermark */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
            <div
              className="text-[15rem] xl:text-[19rem] font-black italic leading-none tracking-tighter"
              style={{ color: "rgba(143,224,74,0.05)" }}
            >
              FEAR
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Cover */}
            <div className="relative order-2 lg:order-1">
              <div
                className="absolute -inset-4 blur-2xl pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(143,224,74,0.35), rgba(192,138,62,0.25))" }}
              />
              <ProductGallery
                images={GALLERY}
                alt={TITLE}
                shadowClass="drop-shadow-[0_0_55px_rgba(143,224,74,0.35)]"
              />
              {soldOut && (
                <div className="absolute -top-3 -right-3 rotate-12 z-20 pointer-events-none">
                  <div className="border-4 border-[#8fe04a] text-[#8fe04a] font-black text-sm tracking-[0.3em] px-3 py-1 bg-black/80">
                    SOLD OUT
                  </div>
                </div>
              )}
            </div>

            {/* Copy */}
            <div className="order-3 lg:order-2 animate-fade-in">
              <div
                className="inline-flex items-center gap-2 border px-3 py-1 mb-6"
                style={{ borderColor: "rgba(143,224,74,0.4)", background: "rgba(143,224,74,0.08)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: TOXIN }} />
                <span className="text-[10px] font-black tracking-[0.35em]" style={{ color: TOXIN }}>
                  DC EXCLUSIVE · DEBUT OF ABSOLUTE SCARECROW
                </span>
              </div>

              <h1 className="text-white font-black italic leading-[0.82] tracking-tighter">
                <span className="block text-6xl sm:text-8xl" style={{ color: TOXIN }}>
                  ABSOLUTE
                </span>
                <span className="block text-6xl sm:text-8xl">BATMAN</span>
                <span className="block text-4xl sm:text-6xl text-white/90 mt-1">#19</span>
                <span className="block text-sm sm:text-lg text-white/55 tracking-[0.2em] mt-3 font-bold">
                  PABLO VILLALOBOS · EXCLUSIVE VARIANT
                </span>
              </h1>

              <p className="text-2xl sm:text-3xl font-black italic mt-6 animate-flicker" style={{ color: TOXIN }}>
                FEAR IS EVOLVING.
              </p>
              <p className="text-white/70 text-base sm:text-lg mt-3 max-w-lg leading-relaxed">
                A terrifying new era begins as{" "}
                <span className="font-bold" style={{ color: TOXIN }}>Scarecrow steps into the spotlight</span>{" "}
                — bringing a fresh wave of fear and chaos to Gotham. This isn&apos;t just another
                issue. It&apos;s the launch of a major arc, and the{" "}
                <span className="font-bold" style={{ color: RUST }}>first appearance of Absolute Scarecrow.</span>
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className="font-black text-3xl" style={{ color: TOXIN }}>
                  ${livePrice.toFixed(2)}
                </span>
                <span className="text-white/40 text-xs tracking-widest font-bold">
                  FROM · TRADE · RAW 9.2+ GUARANTEED
                </span>
              </div>

              <div className="mt-7">
                <ProductBuyBlock
                  slug={liveSlug}
                  title={TITLE}
                  price={livePrice}
                  image={COVER}
                  variants={liveVariants}
                  soldOut={soldOut}
                  buttonClass="group bg-[#8fe04a] hover:bg-[#a4ee63] text-black font-black text-sm tracking-[0.25em] px-8 py-4 animate-pulse-ring cursor-pointer transition-colors"
                  accentClass="border-[#8fe04a] bg-[#8fe04a]/15"
                  secondaryCTA={
                    <Link
                      href="https://www.whatnot.com/user/cbbst"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-white/30 hover:border-[#8fe04a] text-white hover:text-[#8fe04a] font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
                    >
                      WATCH ON WHATNOT →
                    </Link>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY THIS BOOK HITS ================= */}
        <section
          className="relative py-20 px-6"
          style={{ background: "#080d05", borderTop: "1px solid rgba(143,224,74,0.2)", borderBottom: "1px solid rgba(143,224,74,0.2)" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <span className="h-px w-10" style={{ background: TOXIN }} />
              <span className="text-[10px] font-black tracking-[0.4em]" style={{ color: TOXIN }}>
                WHY THIS BOOK HITS
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { tag: "01", title: "FIRST ABSOLUTE SCARECROW", body: "The debut of Absolute Scarecrow — Dr. Jonathan Crane emerges from the shadows of Ark M. A true first-appearance key." },
                { tag: "02", title: "NEW ARC STARTS HERE", body: "New debuts, new villains, new alliances. This issue is the on-ramp — the perfect place to jump into the run." },
                { tag: "03", title: "PABLO VILLALOBOS EXCLUSIVE", body: "Variant art by Pablo Villalobos — a CBBST exclusive you won't find on the shelf. Dark, horror-driven cover." },
                { tag: "04", title: "BUILT FOR COLLECTORS", body: "Perfect for Batman & DC collectors. Raw books guaranteed 9.2 or better. CGC 9.8 available for the graded chase." },
              ].map((c) => (
                <div
                  key={c.tag}
                  className="group relative bg-black border border-white/10 hover:border-[#8fe04a]/60 transition-colors p-6"
                >
                  <div
                    className="absolute -top-3 left-5 text-black font-black text-[10px] tracking-[0.3em] px-2 py-1"
                    style={{ background: TOXIN }}
                  >
                    {c.tag}
                  </div>
                  <h3 className="text-white font-black text-base mt-3 leading-tight">{c.title}</h3>
                  <p className="text-white/55 text-sm mt-3 leading-relaxed">{c.body}</p>
                  <div className="mt-5 h-[2px] w-8 group-hover:w-full transition-all duration-500" style={{ background: TOXIN }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= THE PLOT ================= */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #080d05, #060a04 55%, rgba(24,42,10,0.5))" }} />
          <div className="absolute inset-0 halftone-overlay opacity-15" />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[24rem] w-[24rem] rounded-full blur-[120px] animate-smoke pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(143,224,74,0.15) 0%, transparent 70%)" }}
          />
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="text-[10px] font-black tracking-[0.4em] mb-3" style={{ color: TOXIN }}>
              THE PLOT
            </div>
            <h2 className="text-white font-black text-4xl sm:text-6xl italic leading-[0.95]">
              &ldquo;FEAR HAS A<br />
              NEW <span style={{ color: TOXIN }}>FACE.</span>&rdquo;
            </h2>
            <p className="text-white/70 text-base sm:text-lg mt-8 leading-relaxed">
              Absolute Scarecrow emerges from the shadows of Ark M as a new story arc begins.
              Poison Ivy proved to be just one of the many horrors within the bowels of the
              Ark M facility — and as Joker sets his sights on Absolute Batman, he enlists the
              help of one of the center&apos;s most terrifying doctors,{" "}
              <span className="font-bold" style={{ color: RUST }}>Dr. Jonathan Crane.</span>{" "}
              While Bruce Wayne tries to align himself with Barbara Gordon, there&apos;s more than
              one alliance formed in this issue. New debuts. New villains. A new arc starts here.
            </p>
          </div>
        </section>

        {/* ================= VARIANTS — three ways in ================= */}
        <section className="py-20 px-6 bg-[#060a04]" style={{ borderTop: "1px solid rgba(143,224,74,0.2)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-[10px] font-black tracking-[0.4em]" style={{ color: TOXIN }}>
                VARIANT OPTIONS
              </div>
              <h2 className="text-white font-black text-3xl sm:text-5xl italic mt-2">THREE WAYS IN</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { label: "TRADE", price: "$15.00", note: "Trade dress cover. Raw, bagged & boarded. Guaranteed 9.2 or better." },
                { label: "TRADE / VIRGIN / FOIL SET", price: "$60.00", note: "Trade, Virgin Color Foil & Virgin B&W — the matched three-cover set." },
                { label: "CGC 9.8 BLUE LABEL", price: "$90.00", note: "Professionally graded Blue Label Trade. Ships early November." },
              ].map((v) => (
                <div
                  key={v.label}
                  className="bg-[#0b1207] border transition-colors p-6 hover:border-[#8fe04a]"
                  style={{ borderColor: "rgba(143,224,74,0.3)" }}
                >
                  <div className="text-[10px] font-black tracking-[0.3em]" style={{ color: TOXIN }}>
                    {v.label}
                  </div>
                  <div className="text-white font-black text-3xl italic mt-2">{v.price}</div>
                  <p className="text-white/55 text-sm mt-3 leading-relaxed">{v.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image src={COVER} alt="" fill className="object-cover opacity-20 blur-md scale-110" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(24,42,10,0.75), rgba(6,10,4,0.94) 55%, rgba(48,32,10,0.6))" }} />
            <div className="absolute inset-x-0 top-0 h-[2px] animate-scanline" style={{ background: `linear-gradient(90deg, transparent, ${TOXIN_DEEP}, transparent)` }} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="text-[10px] font-black tracking-[0.4em] animate-flicker" style={{ color: TOXIN }}>
              DON&apos;T LET IT SLIP INTO THE FOG
            </div>
            <h2 className="text-white font-black text-5xl sm:text-8xl italic leading-[0.85] mt-3">
              <span style={{ color: TOXIN }}>FIRST</span> FEAR.<br />
              FIRST IN.
            </h2>
            <p className="text-white/60 text-base sm:text-lg mt-6 max-w-xl mx-auto">
              A first appearance only happens once. When the Absolute Scarecrow debut sells
              through, that&apos;s it — the fog rolls in and the moment&apos;s gone. Move first.
            </p>
            <AddToCartButton
              slug={liveSlug}
              title={TITLE}
              price={livePrice}
              image={COVER}
              label="ADD TO CART"
              disabled={soldOut}
              className="mt-8 group bg-[#8fe04a] hover:bg-[#a4ee63] text-black font-black text-sm tracking-[0.25em] px-10 py-4 animate-pulse-ring cursor-pointer transition-colors"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
