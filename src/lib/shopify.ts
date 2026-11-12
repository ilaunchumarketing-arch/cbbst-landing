// Shopify Storefront API client (headless checkout).
//
// HYBRID MODEL: this Next.js site is the storefront; Shopify stays the backend
// (catalog of record + hosted checkout + payments + fulfillment). We build a
// Storefront cart from the local cart and hand the customer to Shopify's secure
// checkout. We never touch the live Liquid theme.
//
// Activates automatically once these env vars are set (otherwise the site falls
// back to the demo checkout — see /api/checkout):
//   SHOPIFY_STORE_DOMAIN     e.g. cbbst.myshopify.com
//   SHOPIFY_STOREFRONT_TOKEN Storefront API access token (public, read-catalog + write-cart)

import type { Product, Collection } from "@/data/products";
import { products as catalog, getTheme } from "@/data/products";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2025-01";

/** True when the store domain + Storefront token are both configured. */
export const shopifyConfigured = Boolean(DOMAIN && TOKEN);

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  // Catalog reads pass a revalidate window (ISR); checkout/cart mutations stay no-store.
  revalidate?: number
): Promise<T> {
  if (!DOMAIN || !TOKEN) throw new Error("Shopify Storefront API is not configured");
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    // Catalog reads are tagged "shopify" so a Shopify webhook can invalidate them
    // instantly (on-demand revalidation); checkout/cart mutations stay no-store.
    ...(revalidate ? { next: { revalidate, tags: ["shopify"] } } : { cache: "no-store" as RequestCache }),
  });
  if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) throw new Error(`Shopify GraphQL: ${JSON.stringify(json.errors)}`);
  return json.data as T;
}

type VariantNode = { id: string; title: string; availableForSale: boolean };

/**
 * Resolve a Shopify variant GID from a product handle + the variant label we
 * store locally (e.g. "Trade Foil", "CGC 9.8 Blue Label"). Falls back to a
 * fuzzy title match, then the product's first variant.
 * Assumes the Shopify product handle equals our product slug.
 */
export async function resolveVariantId(handle: string, variantLabel?: string): Promise<string | null> {
  const data = await shopifyFetch<{
    product: { variants: { nodes: VariantNode[] } } | null;
  }>(
    `query ResolveVariant($handle: String!) {
      product(handle: $handle) {
        variants(first: 100) { nodes { id title availableForSale } }
      }
    }`,
    { handle }
  );
  const variants = data.product?.variants.nodes ?? [];
  if (variants.length === 0) return null;
  if (!variantLabel) return variants[0].id;
  const norm = (s: string) => s.trim().toLowerCase();
  const target = norm(variantLabel);
  const match =
    variants.find((v) => norm(v.title) === target) ??
    variants.find((v) => norm(v.title).includes(target) || target.includes(norm(v.title))) ??
    variants[0];
  return match.id;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\bb\s*[&/\-]?\s*w\b/g, " blackwhite ") // B&W / B/W / B-W → distinct token
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Bulletproof variant resolution for checkout. Tries the handle directly; if that
 * product doesn't exist in Shopify (our curated slugs are often shortened/renamed,
 * e.g. "lobo-3" vs "lobo-3-ryan-g-browne-exclusive-variant"), falls back to matching
 * by product TITLE so the order still resolves to the right Shopify product+variant.
 */
export async function resolveVariantSmart(
  handle: string,
  title: string | undefined,
  variantLabel: string | undefined
): Promise<string | null> {
  // 1) Direct handle match.
  const direct = await resolveVariantId(handle, variantLabel);
  if (direct) return direct;

  // 1b) The handle may be a clean url-slug whose real Shopify handle has emoji.
  const all = await getAllShopifyProducts();
  const bySlug = all.find((p) => p.slug === urlSlug(handle));
  if (bySlug?.shopifyHandle) {
    const viaSlug = await resolveVariantId(bySlug.shopifyHandle, variantLabel);
    if (viaSlug) return viaSlug;
  }

  // 2) Fall back to a TITLE match against the full catalog.
  if (!title) return null;
  const found = bestTitleMatch(all, title);
  if (!found) return null;
  return resolveVariantId(found.shopifyHandle ?? found.slug, variantLabel);
}

const tokensOf = (s: string) => new Set(slugify(s).split(" ").filter((w) => w.length > 2));

/**
 * Best product match by TITLE token overlap. Handles abbreviations
 * (TMNT ↔ Teenage Mutant Ninja Turtles), extra words, and ordering — locks onto
 * the distinctive tokens (artist name, issue #, variant). Requires ≥3 shared
 * distinctive tokens to be confident it's the same product.
 */
function bestTitleMatch(all: Product[], title: string): Product | null {
  const want = tokensOf(title);
  if (want.size === 0) return null;
  let best: Product | null = null;
  let bestScore = 0;
  for (const p of all) {
    const have = tokensOf(p.title);
    let score = 0;
    for (const w of want) if (have.has(w)) score++;
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best && bestScore >= 3 ? best : null;
}

/**
 * The canonical LIVE Shopify product for a page — the single source of truth for
 * price, variants, and availability. Matches by handle, then by title (for curated
 * pages whose slug doesn't match the Shopify handle). Returns null if not in Shopify.
 */
export async function getCanonicalShopifyProduct(
  handle: string,
  title?: string,
  /**
   * Announced-but-unlisted books must NEVER fall through to the fuzzy title match:
   * "Absolute Batman #24" would happily match Absolute Batman #22/#23 and inherit a
   * WRONG price, wrong variants and a checkout pointed at the wrong book. An exact
   * handle lookup is still attempted, so the page self-heals the moment David creates
   * the real Shopify listing under that handle.
   */
  allowTitleFallback = true
): Promise<Product | null> {
  const direct = await getShopifyProduct(handle);
  if (direct) return direct;
  if (!title || !allowTitleFallback) return null;
  const all = await getAllShopifyProducts();
  return bestTitleMatch(all, title);
}

/** Create a Storefront cart from variant lines and return Shopify's hosted checkout URL. */
export async function createCheckoutUrl(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<string> {
  const data = await shopifyFetch<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(
    `mutation CreateCart($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { checkoutUrl }
        userErrors { message }
      }
    }`,
    { lines }
  );
  const errs = data.cartCreate.userErrors;
  if (errs?.length) throw new Error(errs.map((e) => e.message).join("; "));
  const url = data.cartCreate.cart?.checkoutUrl;
  if (!url) throw new Error("Shopify did not return a checkout URL");
  return url;
}

// ───────────────────────── Full catalog (Storefront API) ─────────────────────────
// Pulls live products from Shopify and normalizes them into the existing `Product`
// shape so all current components (ProductCard, CollectionPage, product detail) work
// unchanged. Cached with a 5-min ISR window.

// Our site collection key  →  Shopify collection handle
const COLLECTION_TO_SHOPIFY: Record<Collection, string> = {
  exclusives: "exclusives",
  graded: "slabs",
  tcg: "tcg-collectibles",
  "original-art": "original-art",
  supplies: "supplies",
};
// Shopify collection handle  →  our site collection key (first match wins)
const SHOPIFY_TO_COLLECTION: Record<string, Collection> = {
  exclusives: "exclusives",
  slabs: "graded",
  "tcg-collectibles": "tcg",
  "original-art": "original-art",
  supplies: "supplies",
};

type ShopifyVariant = { id: string; title: string; availableForSale: boolean; price: { amount: string }; image?: { url: string } | null };
type ShopifyProductNode = {
  handle: string;
  title: string;
  tags?: string[];
  createdAt?: string;
  publishedAt?: string | null;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: { url: string } | null;
  images: { nodes: { url: string }[] };
  priceRange: { minVariantPrice: { amount: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string } } | null;
  collections: { nodes: { handle: string }[] };
  variants: { nodes: ShopifyVariant[] };
};

const PRODUCT_FIELDS = `
  handle
  title
  tags
  createdAt
  publishedAt
  description
  descriptionHtml
  availableForSale
  featuredImage { url }
  images(first: 50) { nodes { url } }
  priceRange { minVariantPrice { amount } }
  compareAtPriceRange { minVariantPrice { amount } }
  collections(first: 8) { nodes { handle } }
  variants(first: 60) { nodes { id title availableForSale price { amount } image { url } } }
`;

const money = (a: string) => `$${(Math.round(parseFloat(a) * 100) / 100).toString().replace(/\.00$/, "")}`;

/**
 * URL-safe slug derived from a Shopify handle. Some CBBST Shopify handles contain
 * emoji (e.g. "...-exclusive-🔥"); emoji in a route path round-trips badly through
 * URL encoding / static-param matching and 404s. We route on this clean form and
 * resolve it back to the real handle (kept as `shopifyHandle`) for checkout.
 * Idempotent: a clean handle maps to itself.
 */
export const urlSlug = (handle: string) =>
  handle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/* ───────────────────────── DROP STATE (automatic, from Shopify) ─────────────────────────
 *
 * A book on cbbst.com is in exactly one of three states, and ALL THREE are derived from
 * Shopify — nothing about a specific book is hardcoded here any more (David/Roberto,
 * 2026-08-24: "not sure if me updating the listings as live on my end will affect what
 * you did for the coming-soon ones" — it does now, and that is the point).
 *
 *   COMING SOON — the listing exists but is not selling yet. Roberto controls this by
 *                 putting a `coming soon` TAG on the product in Shopify. Remove the tag
 *                 → the book goes live on the site by itself, no deploy, no code edit.
 *   LIVE        — Shopify says `availableForSale: true` and there is no coming-soon tag.
 *                 Buyable, badged NEW DROP (the newest one) / EXCLUSIVE.
 *   SOLD OUT    — Shopify says `availableForSale: false` and it was never coming-soon.
 *
 * WHY A TAG (and not inventory): the Storefront token has no
 * `unauthenticated_read_product_inventory` scope, so quantities are invisible to the site.
 * A tag is the one upcoming/on-sale signal Roberto can set himself from the Shopify product
 * screen, and unlike the old hardcoded handle list it needs nobody to redeploy the site.
 */

/** Tags (case/space/hyphen-insensitive) that hold a product as COMING SOON. */
const COMING_SOON_TAGS = new Set([
  "comingsoon",
  "coming",           // a bare "coming" tag reads the same way in the Shopify UI
  "preorder",
  "presale",
  "droppingsoon",
  "notyetreleased",
  "upcoming",
]);

const tagKey = (t: string) => t.toLowerCase().replace(/[^a-z]/g, "");

/**
 * EMERGENCY OVERRIDE ONLY — normally EMPTY. Handles listed here read COMING SOON no matter
 * what Shopify says. Use it only when a book has to be pulled off sale faster than the
 * client can edit Shopify; the tag above is the supported way to hold a drop, because a
 * handle written here can only be cleared by a code change + redeploy.
 *
 * History: this held `absolute-batman-24-tony-daniel-nycc-exclusive` and
 * `absolute-cassandra-cain-the-shadows-hand-1-tony-daniel-nycc-exclusive` from 2026-08-22.
 * Roberto published both to the sales channel on 2026-08-24 and they are live in Shopify,
 * so the list is now empty and the site follows Shopify automatically.
 */
const MANUAL_COMING_SOON = new Set<string>([]);

/**
 * Is this Shopify product an upcoming drop (COMING SOON) rather than on sale / sold out?
 * Single source of truth — the product cards, the buy button, the variant chips, the corner
 * stamp, the top banner, the hero strip and the featured-grid ordering all read this.
 */
function isComingSoon(n: { handle: string; tags?: string[] }): boolean {
  if (MANUAL_COMING_SOON.has(n.handle)) return true;
  return (n.tags ?? []).some((t) => COMING_SOON_TAGS.has(tagKey(t)));
}

/**
 * Deterministic order for a "newest drops" grid. Never random, never positional:
 *   1. COMING SOON  — the next drop leads the section
 *   2. LIVE         — buyable exclusives
 *   3. SOLD OUT     — dead stock sinks to the bottom
 * and inside each band, newest Shopify `createdAt` first. Ties keep the order Shopify
 * returned (Array#sort is stable), so the grid renders identically on every request.
 * The moment Roberto flips a book live in Shopify it moves from band 1 to band 2 — still
 * near the top, because it is still the newest book.
 */
const dropBand = (p: Product) => (p.comingSoon ? 0 : p.soldOut ? 2 : 1);

export function sortDropOrder(list: Product[]): Product[] {
  return [...list].sort((a, b) => {
    const band = dropBand(a) - dropBand(b);
    if (band) return band;
    const byDrop = newestFirst(a.dropDate, b.dropDate);
    if (byDrop) return byDrop;
    // Same publish batch (e.g. the books bulk-published at site launch) — fall back to
    // when the listing was created, then to Shopify's own order (Array#sort is stable).
    return newestFirst(a.listedDate, b.listedDate);
  });
}

/** b − a on two ISO dates, 0 when either is missing or they are equal. */
function newestFirst(a?: string, b?: string): number {
  const da = Date.parse(a ?? "");
  const db = Date.parse(b ?? "");
  if (!Number.isFinite(da) || !Number.isFinite(db) || da === db) return 0;
  return db - da;
}

// Max length of the brief description shown on the detail-page hero and cards.
const BRIEF_MAX = 240;

/**
 * Shopify descriptions often open with the full product title in caps (e.g.
 * "USAGI YOJIMBO: KAITŌ '84 #5 – DALE ALTMANN EXCLUSIVE The final battle begins…").
 * The hero already renders the title in display type right above the paragraph, so
 * the repeat only burns the brief-description budget. Match loosely — compare only
 * alphanumerics with diacritics folded (KAITŌ vs KAITO) — and strip the repeat plus
 * any separator punctuation after it. If the description doesn't start with the
 * title, it comes back untouched.
 */
function stripLeadingTitle(desc: string, title: string): string {
  const fold = (s: string) =>
    s.normalize("NFD").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const target = fold(title);
  if (!target) return desc;
  let matched = 0;
  let i = 0;
  while (i < desc.length && matched < target.length) {
    const c = fold(desc[i]);
    if (c) {
      if (target.slice(matched, matched + c.length) !== c) return desc;
      matched += c.length;
    }
    i++;
  }
  if (matched < target.length) return desc;
  const rest = desc.slice(i).replace(/^[\s\-–—:.,|!?…]+/, "").trim();
  return rest || desc;
}

/**
 * Brief description rule (David, 2026-07-28): NEVER cut mid-sentence with "…" —
 * every brief description must read complete. Long copy is cut at the last full
 * sentence that fits BRIEF_MAX; if even the first sentence runs past the cap we
 * keep it whole anyway (complete beats short). The full text still renders in
 * "ABOUT THIS DROP" via descriptionHtml/story.
 */
function briefDescription(desc: string): string {
  if (desc.length <= BRIEF_MAX) return desc;
  // A period after a lone capital (an initial — "Ryan G. Browne") is not a sentence end.
  const sentenceEnd = /(?<!\b[A-Z])[.!?…]["')\]]?(?=\s|$)/g;
  let cut = -1;
  for (let m; (m = sentenceEnd.exec(desc)); ) {
    const end = m.index + m[0].length;
    if (end <= BRIEF_MAX) cut = end;
    else break;
  }
  if (cut > 0) return desc.slice(0, cut).trimEnd();
  sentenceEnd.lastIndex = 0;
  const first = sentenceEnd.exec(desc);
  if (first) return desc.slice(0, first.index + first[0].length).trimEnd();
  return desc;
}

function normalize(n: ShopifyProductNode): Product {
  // Declared first: the variant map below reads it (const is not hoisted).
  // COMING SOON is derived from Shopify (coming-soon tag), never from a per-book constant.
  const comingSoon = isComingSoon(n);
  const imgs = (n.images?.nodes ?? []).map((i) => i.url);
  const image = n.featuredImage?.url ?? imgs[0] ?? "/images/logo_dark.jpg";
  const altImages = imgs.filter((u) => u !== image);
  const priceFrom = Math.round(parseFloat(n.priceRange.minVariantPrice.amount) * 100) / 100;
  const compare = n.compareAtPriceRange ? parseFloat(n.compareAtPriceRange.minVariantPrice.amount) : 0;

  let collection: Collection = "exclusives";
  for (const c of n.collections?.nodes ?? []) {
    if (SHOPIFY_TO_COLLECTION[c.handle]) { collection = SHOPIFY_TO_COLLECTION[c.handle]; break; }
  }

  const real = (n.variants?.nodes ?? []).filter((v) => v.title && v.title !== "Default Title");
  const variants = real.length
    ? real.map((v) => ({
        name: v.title.toUpperCase(),
        tier: money(v.price.amount),
        soldOut: comingSoon || !v.availableForSale,
        image: v.image?.url, // per-variant photo (picking the variant swaps the gallery)
      }))
    : undefined;

  const desc = stripLeadingTitle((n.description || "").trim(), n.title);
  return {
    slug: urlSlug(n.handle),
    shopifyHandle: n.handle,
    title: n.title,
    collection,
    priceFrom,
    priceCompare: compare > priceFrom ? compare : undefined,
    // An upcoming drop is never buyable, whatever Shopify reports on the variants.
    soldOut: comingSoon || !n.availableForSale,
    // Upcoming books read "COMING SOON" everywhere (cards, buy button, variant chips,
    // banner), never "SOLD OUT" — they were never on sale (David 2026-08-22). A book that
    // is NOT coming-soon deliberately emits null labels, so the product page can clear any
    // stale curated "COMING SOON" text the moment Shopify says the book is selling.
    availabilityLabel: comingSoon ? "COMING SOON" : null,
    availabilityNote: comingSoon ? "Coming soon" : null,
    comingSoon,
    // WHEN IT DROPPED ON THE SITE = Shopify `publishedAt` (the moment the product was
    // published to the sales channel and became visible/buyable) — the primary sort key
    // behind "newest drops first". NOT `createdAt`: that is when the draft was first keyed
    // into Shopify, which can be days earlier and in a different order. Real case
    // (2026-08-24): Cassandra Cain was CREATED after Batman #24 but PUBLISHED before it, so
    // createdAt ordering buried the book the client wanted leading the hero.
    dropDate: n.publishedAt ?? n.createdAt,
    // Creation date, kept only as the tiebreaker when two books published in the same batch.
    listedDate: n.createdAt,
    image,
    altImages: altImages.length ? altImages : undefined,
    description: briefDescription(desc) || n.title,
    // Full rich HTML for the detail page (rendered in a prose container, sanitized at render).
    descriptionHtml: (n.descriptionHtml || "").trim() || undefined,
    story: desc.length > BRIEF_MAX ? desc : undefined,
    variants,
  };
}

/**
 * A single product by handle OR clean url-slug (for the product detail page).
 * Tries the literal handle first (fast path for already-clean handles); if that
 * misses — e.g. the caller passed the emoji-stripped url-slug while the real
 * Shopify handle contains an emoji — falls back to matching across the catalog by
 * `urlSlug(realHandle)`.
 */
export async function getShopifyProduct(handle: string): Promise<Product | null> {
  if (!shopifyConfigured) return null;
  try {
    const data = await shopifyFetch<{ product: ShopifyProductNode | null }>(
      `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
      { handle },
      300
    );
    if (data.product) return normalize(data.product);
  } catch {
    // fall through to the slug-based lookup below
  }
  // Fallback: resolve a clean url-slug to its real (possibly emoji-bearing) handle.
  try {
    const wanted = urlSlug(handle);
    const all = await getAllShopifyProducts();
    return all.find((p) => p.slug === wanted) ?? null;
  } catch {
    return null;
  }
}

async function paginate(
  build: (cursor: string | null) => { query: string; variables: Record<string, unknown> },
  pick: (d: { products?: { nodes: ShopifyProductNode[]; pageInfo: { hasNextPage: boolean; endCursor: string } }; collection?: { products: { nodes: ShopifyProductNode[]; pageInfo: { hasNextPage: boolean; endCursor: string } } } | null }) => { nodes: ShopifyProductNode[]; pageInfo: { hasNextPage: boolean; endCursor: string } } | null
): Promise<Product[]> {
  const out: Product[] = [];
  let cursor: string | null = null;
  for (let i = 0; i < 12; i++) {
    const { query, variables } = build(cursor);
    const data = await shopifyFetch<Parameters<typeof pick>[0]>(query, variables, 300);
    const conn = pick(data);
    if (!conn) break;
    out.push(...conn.nodes.map(normalize));
    if (!conn.pageInfo.hasNextPage) break;
    cursor = conn.pageInfo.endCursor;
  }
  return out;
}

/** Every product in the store. */
export async function getAllShopifyProducts(): Promise<Product[]> {
  if (!shopifyConfigured) return [];
  try {
    const live = await paginate(
      (cursor) => ({
        query: `query All($cursor: String) { products(first: 250, after: $cursor) { nodes { ${PRODUCT_FIELDS} } pageInfo { hasNextPage endCursor } } }`,
        variables: { cursor },
      }),
      (d) => d.products ?? null
    );
    return await withMissingCurated(null, live);
  } catch {
    return [];
  }
}

/** Products in one of our site collections (mapped to its Shopify collection). */
/**
 * Curated products that Shopify's COLLECTION query drops.
 *
 * Shopify can report a product as belonging to a collection (product.collections)
 * while `collection(handle).products` still omits it — publication state on the
 * Headless channel and the collection listing don't always agree. When that happens
 * the book is reachable at its direct /products/<handle> URL but appears in NO
 * listing on the site, so nothing links to it (hit 2026-08-22 with the two Tony
 * Daniel NYCC exclusives — both live and buyable, both invisible on /exclusives).
 *
 * Recovery: for the handful of curated entries that carry a real `shopifyHandle`,
 * look the product up directly and splice in any that the collection missed. Only
 * products Shopify actually returns AND still sells are added, so this can never
 * resurrect a retired or sold-out listing — and it disappears on its own the moment
 * Shopify starts listing the product in the collection normally.
 */
/** Exact-handle Shopify lookup with NO catalog fallback (recursion-safe). */
async function productByHandleOnly(handle: string): Promise<Product | null> {
  if (!shopifyConfigured) return null;
  try {
    const data = await shopifyFetch<{ product: ShopifyProductNode | null }>(
      `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
      { handle },
      300
    );
    return data.product ? normalize(data.product) : null;
  } catch {
    return null;
  }
}

async function withMissingCurated(
  collection: Collection | null,
  live: Product[]
): Promise<Product[]> {
  const candidates = catalog.filter(
    (c) => (collection === null || c.collection === collection) && c.shopifyHandle
  );
  if (!candidates.length) return live;
  const have = new Set(live.map((p) => p.shopifyHandle ?? p.slug));
  const missing = candidates.filter((c) => !have.has(c.shopifyHandle!));
  if (!missing.length) return live;
  // MUST use the direct handle query, never getShopifyProduct(): its miss-path falls back
  // to getAllShopifyProducts(), which calls this function again → infinite recursion.
  const found = await Promise.all(missing.map((c) => productByHandleOnly(c.shopifyHandle!)));
  // Keep upcoming books in the listing — they are meant to be visible AND not buyable.
  const extra = found.filter((p): p is Product => Boolean(p) && (!p!.soldOut || Boolean(p!.comingSoon)));
  return extra.length ? [...extra, ...live] : live;
}

/**
 * Products of ANY Shopify collection, by its Shopify handle - for collections the client
 * creates in Shopify that aren't one of the site's five fixed sections (e.g. "nycc-exclusives").
 * Read-only; returns [] if the collection doesn't exist or Shopify is unreachable.
 */
export async function getShopifyCollectionByHandle(handle: string): Promise<Product[]> {
  if (!shopifyConfigured) return [];
  try {
    return await paginate(
      (cursor) => ({
        query: `query Coll($handle: String!, $cursor: String) { collection(handle: $handle) { products(first: 250, after: $cursor) { nodes { ${PRODUCT_FIELDS} } pageInfo { hasNextPage endCursor } } } }`,
        variables: { handle, cursor },
      }),
      (d) => d.collection?.products ?? null
    );
  } catch {
    return [];
  }
}

export async function getShopifyCollectionProducts(collection: Collection): Promise<Product[]> {
  if (!shopifyConfigured) return [];
  const handle = COLLECTION_TO_SHOPIFY[collection];
  try {
    const live = await paginate(
      (cursor) => ({
        query: `query Coll($handle: String!, $cursor: String) { collection(handle: $handle) { products(first: 250, after: $cursor) { nodes { ${PRODUCT_FIELDS} } pageInfo { hasNextPage endCursor } } } }`,
        variables: { handle, cursor },
      }),
      (d) => d.collection?.products ?? null
    );
    return await withMissingCurated(collection, live);
  } catch {
    return [];
  }
}

/**
 * The newest drops in a collection, in display order.
 *
 * Fetches a WIDER window than it returns (newest `count * 3` from Shopify) and then applies
 * `sortDropOrder`, so the band ordering is decided across a real pool of candidates rather
 * than by whichever books happened to land in the first N. Returns exactly `count`.
 *
 * Everything here is Shopify-driven: the band comes from the coming-soon tag +
 * `availableForSale`, the ordering from `createdAt`. Publishing or unpublishing a book in
 * Shopify re-orders this grid on its own within the 5-min ISR window (instantly via the
 * registered product webhook) with no code change.
 */
export async function getNewestProducts(collection: Collection, count: number): Promise<Product[]> {
  if (!shopifyConfigured) return [];
  const handle = COLLECTION_TO_SHOPIFY[collection];
  const window = Math.min(Math.max(count * 3, 24), 60);
  try {
    const data = await shopifyFetch<{ collection: { products: { nodes: ShopifyProductNode[] } } | null }>(
      `query Newest($handle: String!, $count: Int!) {
        collection(handle: $handle) {
          products(first: $count, sortKey: CREATED, reverse: true) { nodes { ${PRODUCT_FIELDS} } }
        }
      }`,
      { handle, count: window },
      300
    );
    const live = (data.collection?.products.nodes ?? []).map(normalize);
    return sortDropOrder(await withMissingCurated(collection, live)).slice(0, count);
  } catch {
    return [];
  }
}

// ————— Hero "HOT RIGHT NOW" strip —————
// The homepage hero's print-run tiles, kept in sync with real Shopify stock:
// the newest IN-STOCK exclusives whose total print run we actually know.
// Sold-out books drop off automatically; new drops slot in with no code edit.

export type HotDrop = { title: string; run: string; href: string };

/** series+issue prefix of a slug-ish string, e.g. "exquisite-corpses-13-foil" → "exquisite-corpses-13" */
const seriesIssue = (s: string) => s.match(/^([a-z0-9-]*?-\d+)(?:-|$)/)?.[1] ?? null;

/**
 * Total print run for a Shopify product. Sources, in order of trust:
 * curated products.ts entry (exact handle → slug-prefix → series+issue match),
 * then the Shopify description ("limited to 500", "/500", "500 copies").
 * Returns null when unknown — we never fabricate a print-run number.
 */
function findPrintRun(handle: string, description: string): number | null {
  const curatedExact = catalog.find((p) => p.shopifyHandle === handle && p.printRun);
  if (curatedExact) return curatedExact.printRun!;
  const curatedPrefix = catalog.find((p) => p.printRun && handle.startsWith(p.slug));
  if (curatedPrefix) return curatedPrefix.printRun!;
  const issue = seriesIssue(handle);
  if (issue) {
    const curatedIssue = catalog.find((p) => {
      if (!p.printRun) return false;
      const s = seriesIssue(p.slug);
      return s !== null && (issue === s || issue.endsWith(`-${s}`));
    });
    if (curatedIssue) return curatedIssue.printRun!;
  }
  // Normalize thousands separators first — "Limited to 1,000 copies" must parse as 1000.
  const m = description.replace(/(\d),(\d)/g, "$1$2").match(
    /(?:limited to|out of|of only|only)\s+(\d{2,4})\b|\/(\d{2,4})\b|\b(\d{2,4})\s+(?:copies|made|printed)/i
  );
  const n = m ? parseInt(m[1] ?? m[2] ?? m[3], 10) : NaN;
  return Number.isFinite(n) && n >= 50 && n <= 10000 ? n : null;
}

/** Shorten a Shopify title to a tile label: series + issue #, known abbreviations, no artist suffix. */
function shortTitle(title: string): string {
  let t = title.replace(/^copy of\s+/i, "").trim();
  const upToIssue = t.match(/^(.*?#\s?\d+[a-z0-9.]*)/i);
  t = upToIssue ? upToIssue[1] : t.split(/\s+[–—-]\s+/)[0];
  t = t
    .replace(/teenage mutant ninja turtles/i, "TMNT")
    .replace(/usagi yojimbo/i, "USAGI")
    .replace(/[^\x20-\x7E]/g, "") // strip emoji
    .replace(/\s+/g, " ")
    .trim();
  return t.toUpperCase();
}

/**
 * The hero strip tiles: newest in-stock exclusives with a known total print run.
 * Same 5-min ISR + "shopify" tag as the rest of the catalog, so the registered
 * Shopify product/inventory webhooks bust it the moment stock changes.
 */
export async function getHotDrops(count = 4): Promise<HotDrop[]> {
  if (!shopifyConfigured) return [];
  try {
    const data = await shopifyFetch<{ collection: { products: { nodes: ShopifyProductNode[] } } | null }>(
      `query HotDrops($count: Int!) {
        collection(handle: "exclusives") {
          products(first: $count, sortKey: CREATED, reverse: true) {
            nodes { handle title tags description availableForSale }
          }
        }
      }`,
      { count: 30 },
      300
    );
    const drops: HotDrop[] = [];
    const seen = new Set<string>(); // one tile per book — variant covers share a title
    for (const n of data.collection?.products.nodes ?? []) {
      if (!n.availableForSale || isComingSoon(n)) continue;
      const run = findPrintRun(n.handle, n.description || "");
      if (!run) continue;
      const title = shortTitle(n.title);
      if (seen.has(title)) continue;
      seen.add(title);
      drops.push({ title, run: `/${run}`, href: `/products/${urlSlug(n.handle)}` });
      if (drops.length >= count) break;
    }
    return drops;
  } catch {
    return [];
  }
}

// ————— Hero cover showcase —————
// The banner at the top of the site ALWAYS leads with the newest books that have dropped
// (David 2026-08-24: "it must always surface the LATEST books that have dropped on the
// site, newest first, without us hand-editing it each time"). Nothing about a specific
// book is written here or in HeroSection/HeroCoverStack any more — publish a drop in
// Shopify and it takes the lead slot on its own.

export type HeroDrop = {
  slug: string;
  href: string;
  /** Short display title, e.g. "ABSOLUTE BATMAN #24". */
  title: string;
  /** The bit after the dash, title-cased, e.g. "Tony Daniel NYCC Exclusive". */
  subtitle: string;
  /** Total print run as "/1000", or null when we don't know it (never fabricated). */
  run: string | null;
  priceFrom: number;
  image: string;
  /** Batman books get the FlyingBats effect, same rule as the product hero. */
  batman: boolean;
  /**
   * The one-line "why this book matters" hook, taken from the curated entry's first
   * highlight (e.g. "1st appearance of Absolute Batgirl"). NULL when we have no curated
   * claim for the book — callers must render nothing rather than invent one. Never write
   * a key-issue / first-appearance claim we cannot source.
   */
  hook: string | null;
  /**
   * The book's personality — accent pair, eyebrow mood line and display voice, from the
   * existing per-product theme map (getTheme). Surfaces that show ONE drop at a time take
   * these on so the type and colour match the cover being looked at.
   */
  theme: { accent: string; accent2: string; mood: string; voice: "impact" | "blade" | null };
};

/**
 * De-padded local cover art, by exact Shopify handle.
 *
 * PRESENTATION ONLY — this map never decides WHICH books appear in the hero or in what
 * order; that is entirely Shopify-driven. Shopify product photos are the tall cover
 * centered on a blurred SQUARE canvas, which reads small in the hero's 2:3 slot, so where
 * someone has already prepared a cropped cover in public/images/exclusives we prefer it.
 * A brand-new drop with no entry here simply uses its Shopify photo — the hero still
 * updates itself, it just looks better once a cropped cover is dropped in.
 */
/*
 * Keyed by the EXACT Shopify handle, never a prefix. A prefix match silently gives one
 * book another book's art the moment the same issue gets a second con exclusive: the old
 * `teenage-mutant-ninja-turtles-mirage-facsimile-1` prefix matched BOTH the sold-out Tampa
 * printing and the new NYCC one, so the NYCC book rendered the Tampa cover (green Raphael)
 * on the live hero. Different art, same prefix. Add one line per handle.
 */
const HERO_COVER_ART: { handle: string; src: string }[] = [
  {
    handle: "absolute-batman-24-tony-daniel-nycc-exclusive",
    src: "/images/exclusives/absolute-batman-24-trade.jpg",
  },
  {
    handle: "absolute-cassandra-cain-the-shadows-hand-1-tony-daniel-nycc-exclusive",
    src: "/images/exclusives/absolute-cassandra-cain-1-trade.jpg",
  },
  {
    handle: "absolute-batman-23-frank-cho-exclusive-variant",
    src: "/images/exclusives/absolute-batman-23-trade-sm.webp",
  },
  {
    handle: "absolute-batman-22-ejikure-exclusive-variant",
    src: "/images/exclusives/absolute-batman-22-trade-sm.webp",
  },
  {
    handle: "absolute-batman-21-aaron-bartling-exclusive-variant",
    src: "/images/exclusives/absolute-batman-21-foil-sm.webp",
  },
  {
    handle: "absolute-batman-19-pablo-villalobos-exclusive-variant",
    src: "/images/exclusives/absolute-batman-19-trade.webp",
  },
  {
    handle: "crowbound-1-dale-altmann-tampa-comic-con-exclusive",
    src: "/images/exclusives/crowbound-1-trade.jpg",
  },
  {
    handle:
      "teenage-mutant-ninja-turtles-20-300th-issue-special-sukesha-ray-color-splash-tampa-comic-con-exclusive-1",
    src: "/images/exclusives/tmnt-20-color-splash-trade.jpg",
  },
  {
    handle: "teenage-mutant-ninja-turtles-mirage-facsimile-1-dale-altmann-nycc-exclusive",
    src: "/images/exclusives/tmnt-mirage-facsimile-1-nycc-trade.jpg",
  },
  {
    handle: "teenage-mutant-ninja-turtles-mirage-facsimile-1-dale-altmann-tampa-comic-con-exclusive",
    src: "/images/exclusives/tmnt-mirage-facsimile-1-trade.jpg",
  },
];

/** Local cropped cover for a handle, else the curated entry's local image, else null. */
function heroCoverArt(handle: string): string | null {
  const hit = HERO_COVER_ART.find((c) => c.handle === handle);
  if (hit) return hit.src;
  const curated = catalog.find((c) => c.shopifyHandle === handle);
  return curated?.image?.startsWith("/images/") ? curated.image : null;
}

/** "TONY DANIEL NYCC EXCLUSIVE" → "Tony Daniel NYCC Exclusive" (acronyms preserved). */
function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b[a-z]/g, (c) => c.toUpperCase())
    .replace(/\b(Nycc|Cgc|Tmnt|Bw)\b/g, (w) => w.toUpperCase());
}

/** Everything after the title's first en/em dash — the artist + variant line. */
function variantLine(title: string): string {
  const parts = title.split(/\s+[–—-]\s+/);
  return parts.length > 1 ? titleCase(parts.slice(1).join(" · ").replace(/[^\x20-\x7E]/g, "").trim()) : "";
}

/**
 * The hero's books: the newest exclusives that are actually ON SALE, newest drop first.
 *
 * Sold-out books and books still held as COMING SOON are excluded — the hero exists so a
 * visitor can buy the newest drop immediately, and a lead cover they can't check out with
 * wastes the most valuable slot on the site. Order comes from `sortDropOrder` (Shopify
 * `publishedAt`, then `createdAt`), exactly like the featured grid below it.
 */
export async function getHeroDrops(count = 6): Promise<HeroDrop[]> {
  if (!shopifyConfigured) return [];
  try {
    const pool = await getNewestProducts("exclusives", count * 4);
    const seen = new Set<string>(); // one tile per book — variant covers share a short title
    const out: HeroDrop[] = [];
    for (const p of pool) {
      if (p.soldOut || p.comingSoon) continue;
      const handle = p.shopifyHandle ?? p.slug;
      const title = shortTitle(p.title);
      if (!title || seen.has(title)) continue;
      seen.add(title);
      const run = findPrintRun(handle, p.story ?? p.description ?? "");
      out.push({
        slug: p.slug,
        href: `/products/${p.slug}`,
        title,
        subtitle: variantLine(p.title),
        run: run ? `/${run}` : null,
        priceFrom: p.priceFrom,
        image: heroCoverArt(handle) ?? p.image,
        batman: /batman/i.test(p.title),
        hook: catalog.find((c) => c.shopifyHandle === handle)?.highlights?.[0]?.title ?? null,
        theme: (({ accent, accent2, mood, voice }) => ({ accent, accent2, mood, voice: voice ?? null }))(getTheme(p)),
      });
      if (out.length >= count) break;
    }
    return out;
  } catch {
    return [];
  }
}

/** All product handles (for generateStaticParams / sitemaps). */
export async function getAllShopifyHandles(): Promise<string[]> {
  if (!shopifyConfigured) return [];
  try {
    const out: string[] = [];
    let cursor: string | null = null;
    for (let i = 0; i < 12; i++) {
      const data: { products: { nodes: { handle: string }[]; pageInfo: { hasNextPage: boolean; endCursor: string } } } =
        await shopifyFetch(
          `query Handles($cursor: String) { products(first: 250, after: $cursor) { nodes { handle } pageInfo { hasNextPage endCursor } } }`,
          { cursor },
          300
        );
      // Route on the clean url-slug (emoji handles 404 as route params).
      out.push(...data.products.nodes.map((n) => urlSlug(n.handle)));
      if (!data.products.pageInfo.hasNextPage) break;
      cursor = data.products.pageInfo.endCursor;
    }
    return out;
  } catch {
    return [];
  }
}
