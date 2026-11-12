import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackViewContent from "@/components/TrackViewContent";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductBuyBlock from "@/components/ProductBuyBlock";
import FlyingBats from "@/components/FlyingBats";
import LightningStorm from "@/components/LightningStorm";
import NinjaShadows from "@/components/NinjaShadows";
import RavensRedFog from "@/components/RavensRedFog";
import EmberSparks from "@/components/EmberSparks";
import SoldOutBanner from "@/components/SoldOutBanner";
import { VariantImageProvider } from "@/components/VariantImage";
import { products, getProduct, getGallery, getVariants, formatPrice, collectionMeta, getTheme, getEffect } from "@/data/products";
import { getShopifyProduct, getAllShopifyHandles, getShopifyCollectionProducts, getCanonicalShopifyProduct } from "@/lib/shopify";
import type { Product } from "@/data/products";

/**
 * Pricing is ALWAYS sourced live from Shopify (source of truth). Curated entries only
 * supply presentation (story, creators, images, bats effect) — never price/variants.
 * The cart uses the real Shopify handle so checkout resolves directly.
 */
function mergeWithLive(staticP: Product | undefined, live: Product | null): Product | null {
  if (staticP && live) {
    return {
      ...staticP,
      slug: live.slug, // real Shopify handle → exact checkout
      priceFrom: live.priceFrom,
      priceCompare: live.priceCompare,
      soldOut: live.soldOut,
      // Availability wording follows Shopify, and OVERWRITES the curated entry rather than
      // falling back to it: when Shopify says a book is selling, live sends null here and
      // any stale curated "COMING SOON" text is cleared automatically.
      comingSoon: live.comingSoon,
      availabilityLabel: live.availabilityLabel,
      availabilityNote: live.availabilityNote,
      dropDate: live.dropDate,
      variants: live.variants ?? staticP.variants,
      image: live.image || staticP.image, // images come live from Shopify too
      altImages: live.altImages ?? staticP.altImages,
      descriptionHtml: live.descriptionHtml ?? staticP.descriptionHtml, // full rich HTML from Shopify
    };
  }
  return staticP ?? live;
}

/**
 * Clean Shopify descriptionHtml for safe, consistent rendering on the detail page.
 * Shopify descriptions come from two authoring sources with cruft we don't want:
 *   - pasted-from-ChatGPT wrappers: <div class="markdown prose…">, data-message-* attrs
 *   - Shopify rich-text editor: <div contenteditable="false"><hr></div>, <span> wrappers
 * We drop script/style/iframe entirely, unwrap <div>/<span> (keep their inner content),
 * and strip noise/event attributes — leaving clean structural tags (p, br, h1–3, hr,
 * strong, em, b, a, ul, li) that the prose container below styles consistently.
 */
function sanitizeDescriptionHtml(html: string): string {
  return html
    .replace(/<(script|style|iframe)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/?(?:div|span)[^>]*>/gi, "") // unwrap wrapper divs/spans, keep inner
    .replace(/\son\w+="[^"]*"/gi, "") // strip inline event handlers
    .replace(/\s(?:class|style|contenteditable|dir|tabindex|id|role|data-[\w-]+)="[^"]*"/gi, "")
    .replace(/\n{3,}/g, "\n")
    .trim();
}

// Any product handle renders (curated static OR live from Shopify). Refresh every 5 min.
export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const handles = await getAllShopifyHandles();
  const staticSlugs = products.filter((p) => !p.hasCustomPage).map((p) => p.slug);
  const all = new Set([...handles, ...staticSlugs]);
  return [...all].map((slug) => ({ slug }));
}

/** Curated presentation merged with LIVE Shopify pricing/variants. */
async function resolveProduct(slug: string) {
  const staticP = getProduct(slug);
  const live = await getCanonicalShopifyProduct(slug, staticP?.title, !staticP?.noShopifyListing);
  return mergeWithLive(staticP, live);
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = await resolveProduct(slug);
  if (!p) return { title: "Not Found | CBBST" };
  return {
    title: `${p.title} | CBBST`,
    description: p.description,
    openGraph: {
      title: p.title,
      description: p.description,
      images: [p.image],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staticP = getProduct(slug);
  // Featured products have their own custom pages — redirect to themselves
  // (the static route will be served first, but this guards against direct hits)
  if (staticP?.hasCustomPage) redirect(`/products/${staticP.slug}`);

  // Pricing/variants come live from Shopify; curated supplies only presentation.
  const live = await getCanonicalShopifyProduct(slug, staticP?.title, !staticP?.noShopifyListing);
  const p = mergeWithLive(staticP, live);
  if (!p) notFound();

  // Decorative hero treatment — explicit on curated entries, or derived by title
  // (every TMNT-family product runs the ninja shadows automatically).
  const effect = getEffect(p);
  const electric = effect === "lightning";
  const ninja = effect === "ninja";
  const ravens = effect === "ravens";
  const embers = effect === "embers";

  // Per-product personality palette (character/franchise/energy-type matched).
  // Drives the hero halos, cover glow and mood eyebrow so every product reads as
  // its own experience. Derived from data — no bespoke file per product.
  const theme = getTheme(p);

  const meta = collectionMeta[p.collection];
  const variants = getVariants(p);
  // Related: live products in the same collection, falling back to curated.
  const pool = await getShopifyCollectionProducts(p.collection);
  const relatedSource = pool.length ? pool : products.filter((r) => r.collection === p.collection);
  const related = relatedSource
    .filter((r) => r.slug !== p.slug && !r.soldOut)
    .slice(0, 4);

  // Breadcrumb + print-run badge. Shown above the cover on mobile, in the right column on desktop.
  const headerBlock = (
    <>
      <div className="text-white/40 text-[10px] tracking-[0.3em] font-black mb-4">
        <Link href={meta.route} className="hover:text-cbbst-red transition-colors">
          {meta.title.toUpperCase()}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white/60">{p.title.split("–")[0].trim().toUpperCase()}</span>
      </div>
      {p.printRun && (
        <div className="inline-flex items-center gap-2 border border-cbbst-red/40 bg-cbbst-red/10 px-3 py-1 mb-6">
          <span className="text-cbbst-red text-[10px] font-black tracking-[0.35em]">
            {p.printRun} COPIES
          </span>
        </div>
      )}
    </>
  );

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      {p.soldOut && <SoldOutBanner label={p.availabilityLabel ?? undefined} />}
      <main className="bg-cbbst-dark text-white">
        <TrackViewContent name={p.title} id={p.slug} category={p.collection} />

        {/* HERO */}
        <VariantImageProvider>
        <section className="relative min-h-[75vh] flex items-center overflow-hidden">
          {/* Atmospheric background using cover */}
          <div className="absolute inset-0 opacity-30">
            <Image src={p.image} alt="" fill className="object-cover blur-[60px] scale-110 animate-slow-zoom" priority />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/75 to-cbbst-dark/90" />
          <div className="absolute inset-0 halftone-overlay opacity-10" />
          {electric && <LightningStorm />}
          {ninja && <NinjaShadows />}
          {ravens && <RavensRedFog />}
          {embers && <EmberSparks />}
          <div
            className="absolute -top-20 -left-20 h-96 w-96 rounded-full blur-[120px] animate-float-slow pointer-events-none"
            style={electric ? undefined : { backgroundColor: theme.accent, opacity: 0.18 }}
          />
          <div
            className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full blur-[120px] animate-float-slow pointer-events-none"
            style={electric ? undefined : { backgroundColor: theme.accent2, opacity: 0.14 }}
          />
          {electric && <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full blur-[120px] animate-float-slow pointer-events-none bg-cbbst-blue/25" />}
          {electric && <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full blur-[120px] animate-float-slow pointer-events-none bg-cbbst-blue/15" />}

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full grid lg:grid-cols-2 gap-x-10 gap-y-6 items-center">
            {/* MOBILE-ONLY header: breadcrumb + 1000-copies badge above the cover */}
            <div className="lg:hidden order-1 animate-fade-in">{headerBlock}</div>

            {/* Cover — under the badge on mobile, left column on desktop. Bats scoped here so they fly over the book. */}
            <div className="relative order-2 lg:order-1 min-w-0">
              <div
                className={`absolute -inset-6 blur-3xl pointer-events-none ${electric ? "bg-gradient-to-br from-cbbst-blue/40 to-cyan-300/20" : ""}`}
                style={electric ? undefined : { backgroundImage: `linear-gradient(to bottom right, ${theme.accent}4d, ${theme.accent2}2e)` }}
              />
              {effect === "bats" && <FlyingBats />}
              <div className="relative">
                <ProductGallery images={getGallery(p)} alt={p.title} />
                {p.soldOut && (
                  <div className="absolute -top-3 -right-3 rotate-12 z-20 pointer-events-none">
                    <div className="border-4 border-cbbst-red text-cbbst-red font-black text-sm tracking-[0.3em] px-3 py-1 bg-cbbst-dark/80">
                      {p.availabilityLabel ?? "SOLD OUT"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="order-3 lg:order-2 animate-fade-in">
              {/* Desktop-only header (mobile renders it above the cover) */}
              <div className="hidden lg:block">{headerBlock}</div>

              {/* Themed mood eyebrow — the product's personality, in its own accent. */}
              <div className="flex items-center gap-3 mb-3">
                <span className="h-[3px] w-8 rounded-full" style={{ backgroundColor: theme.accent }} />
                <span className="text-[10px] font-black tracking-[0.4em]" style={{ color: theme.accent }}>
                  {theme.mood}
                </span>
              </div>

              <h1
                className={`font-black text-3xl sm:text-5xl leading-[0.95] tracking-tight ${electric ? "electric-title" : ninja ? "ninja-title" : ravens ? "regicide-title" : embers ? "ember-title" : "text-white"} ${theme.serif ? "not-italic" : "italic"}`}
                style={theme.serif ? { fontFamily: "Georgia, 'Times New Roman', serif" } : undefined}
              >
                {p.title}
              </h1>

              <p className="text-white/65 text-base sm:text-lg mt-5 max-w-xl leading-relaxed">
                {p.description}
              </p>

              {/* Plain-text story only as a fallback when there's no rich descriptionHtml
                  (the full formatted description renders in "ABOUT THIS DROP" below). */}
              {p.story && !p.descriptionHtml && (
                <p className="text-white/55 text-sm sm:text-base mt-4 max-w-xl leading-relaxed">
                  {p.story}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-cbbst-gold font-black text-3xl sm:text-4xl">
                  {formatPrice(p.priceFrom)}
                </span>
                {p.priceCompare && (
                  <span className="text-white/40 text-lg line-through">{formatPrice(p.priceCompare)}</span>
                )}
                <span className="text-white/40 text-xs tracking-widest font-bold">
                  {p.priceFrom ? "STARTING FROM" : (p.availabilityNote ?? "NOT YET ON SALE")}
                </span>
              </div>

              <div className="mt-7">
                <ProductBuyBlock
                  slug={p.slug}
                  title={p.title}
                  price={p.priceFrom}
                  image={p.image}
                  variants={variants}
                  soldOut={p.soldOut}
                  disabledLabel={p.availabilityLabel ?? undefined}
                  secondaryCTA={
                    <Link
                      href="https://www.whatnot.com/user/cbbst"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-white/25 hover:border-cbbst-gold text-white hover:text-cbbst-gold font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors"
                    >
                      WATCH ON WHATNOT →
                    </Link>
                  }
                />
              </div>
            </div>
          </div>
        </section>
        </VariantImageProvider>

        {/* CREATIVE TEAM */}
        {p.creators && p.creators.length > 0 && (
          <section className="relative py-16 px-6 border-y border-white/10 bg-cbbst-dark2">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <span className="h-px w-10 bg-cbbst-red" />
                <span className="text-cbbst-red text-[10px] font-black tracking-[0.4em]">THE CREATIVE TEAM</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {p.creators.map((c) => (
                  <div key={`${c.role}-${c.name}`} className="bg-black/60 border border-white/10 hover:border-cbbst-gold/50 transition-colors p-6">
                    <div className="text-cbbst-gold text-[10px] font-black tracking-[0.3em]">{c.role.toUpperCase()}</div>
                    <div className="text-white font-black text-lg italic mt-2 leading-tight">{c.name}</div>
                    {c.sub && <div className="text-white/50 text-xs mt-2">{c.sub}</div>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* DETAILS GRID */}
        <section className="py-16 px-6 bg-cbbst-dark">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="text-cbbst-red text-[10px] font-black tracking-[0.4em] mb-3">ABOUT THIS DROP</div>
                <h2 className="text-white font-black text-2xl sm:text-3xl italic leading-tight">{p.title}</h2>
                {p.descriptionHtml ? (
                  <div
                    className="mt-4 max-w-2xl text-white/70 text-base leading-relaxed
                      [&_p]:my-4 [&_p:first-child]:mt-0
                      [&_strong]:text-white [&_strong]:font-bold [&_b]:text-white [&_b]:font-bold
                      [&_em]:italic
                      [&_h2]:text-white [&_h2]:font-black [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:mt-7 [&_h2]:mb-2
                      [&_h3]:text-cbbst-gold [&_h3]:font-bold [&_h3]:text-base [&_h3]:tracking-wide [&_h3]:mt-6 [&_h3]:mb-2
                      [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-white/15 [&_hr]:my-6
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-4 [&_ul]:space-y-1
                      [&_a]:text-cbbst-gold [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-cbbst-red"
                    dangerouslySetInnerHTML={{ __html: sanitizeDescriptionHtml(p.descriptionHtml) }}
                  />
                ) : (
                  <p className="text-white/65 text-base mt-4 leading-relaxed">{p.description}</p>
                )}
              </div>
              {p.highlights && p.highlights.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {p.highlights.map((h, i) => (
                    <div key={i} className="bg-cbbst-dark2 border border-white/10 hover:border-cbbst-red/40 transition-colors p-5">
                      <h3 className="text-cbbst-gold font-black text-sm tracking-wider">{h.title}</h3>
                      <p className="text-white/60 text-sm mt-2 leading-relaxed">{h.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <aside className="bg-cbbst-dark2 border border-white/10 p-6 h-fit">
              <h3 className="text-white font-black text-sm tracking-widest mb-4">PRODUCT FACTS</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                  <dt className="text-white/50">Collection</dt>
                  <dd className="text-white font-bold">{meta.title}</dd>
                </div>
                {p.printRun && (
                  <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                    <dt className="text-white/50">Print Run</dt>
                    <dd className="text-cbbst-red font-black">{p.printRun} made</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                  <dt className="text-white/50">Price</dt>
                  <dd className="text-cbbst-gold font-bold">{formatPrice(p.priceFrom)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                  <dt className="text-white/50">Availability</dt>
                  <dd className={p.soldOut ? "text-white/50" : "text-green-400 font-bold"}>
                    {p.availabilityNote ?? (p.soldOut ? "Sold out" : "In stock")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Shipping</dt>
                  <dd className="text-white/80 text-xs">{p.shipping ?? "2-5 business days"}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <AddToCartButton
                  slug={p.slug}
                  title={p.title}
                  price={p.priceFrom}
                  image={p.image}
                  disabled={p.soldOut}
                  disabledLabel={p.availabilityLabel ?? undefined}
                  className="w-full group bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black py-4 tracking-[0.25em]"
                />
              </div>
            </aside>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="py-16 px-6 border-t border-white/10 bg-cbbst-dark2">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <span className="h-px w-10 bg-cbbst-red" />
                <span className="text-cbbst-red text-[10px] font-black tracking-[0.4em]">
                  MORE FROM {meta.title.toUpperCase()}
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {related.map((r) => (
                  <ProductCard key={r.slug} product={r} size="sm" />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href={meta.route}
                  className="inline-block border border-white/20 hover:border-cbbst-red text-white hover:text-cbbst-red text-xs font-black tracking-widest px-6 py-3 transition-colors"
                >
                  VIEW ALL {meta.title.toUpperCase()} →
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
