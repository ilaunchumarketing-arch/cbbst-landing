// Master product catalog for CBBST.
// Featured exclusives have custom landing pages under /src/app/products/<slug>;
// every other product is rendered via the dynamic /products/[slug] route.

export type Collection = "exclusives" | "graded" | "tcg" | "original-art" | "supplies";

/**
 * Per-product "personality" palette. Drives the hero halos, cover glow, mood
 * eyebrow and accent on the dynamic product page so every product reads as its
 * own experience (comic character, Pokémon energy type, CGC premium, etc.).
 * A product may set `theme` explicitly; otherwise `getTheme()` derives one from
 * its collection + title. All colors are hex.
 */
export type ProductTheme = {
  accent: string; // primary accent (hex)
  accent2: string; // secondary accent (hex)
  mood: string; // short eyebrow label, e.g. "GOTHAM", "FIRE TYPE", "CGC GRADED"
  serif?: boolean; // use a serif display voice (original art / prestige)
  // Display TYPEFACE for this book, used where a surface shows one drop at a time and
  // has to take on its personality (the drop popup's swipeable covers). Fonts are loaded
  // in layout.tsx: "impact" = Anton (heavy condensed poster type, the superhero voice),
  // "blade" = Playfair Display (high-contrast sharp serif, the assassin/shadow voice).
  // Omit it and the book keeps the site's default sans — never a wrong-feeling face.
  voice?: "impact" | "blade";
};

export type Product = {
  slug: string;
  // Real Shopify handle when the product is sourced live from Shopify. May contain
  // characters that are unsafe in a URL (e.g. emoji); `slug` is always the clean,
  // URL-safe form used for routing. Use this for Shopify product/variant lookups.
  shopifyHandle?: string;
  title: string;
  collection: Collection;
  priceFrom: number;
  priceCompare?: number; // sale "was"
  soldOut?: boolean;
  comingSoon?: boolean; // teaser only — not buyable yet ("Dropping Soon")
  // Overrides the unbuyable badge text ("SOLD OUT" / "DROPPING SOON"). Use for books
  // that are announced but have no buyable listing yet — e.g. "UNAVAILABLE".
  // `null` is an explicit "no label" from live Shopify data — it CLEARS a curated label
  // rather than falling back to it, so a book that goes on sale in Shopify stops reading
  // "COMING SOON" on the site by itself.
  availabilityLabel?: string | null;
  // Longer sentence shown in place of the price/CTA when the book isn't buyable yet.
  availabilityNote?: string | null;
  // Shopify `publishedAt` — when the book actually DROPPED on the site (published to the
  // sales channel). Primary sort key for "new drops, in order" on the homepage featured
  // grid and the hero (see sortDropOrder in lib/shopify.ts). Live data only.
  dropDate?: string;
  // Shopify `createdAt` — when the listing was first created. Tiebreaker only, for books
  // that were published in the same batch. Live data only.
  listedDate?: string;
  // True while the book has NO Shopify listing yet. Blocks the fuzzy title fallback in
  // getCanonicalShopifyProduct so the page can't inherit another issue's price/variants.
  noShopifyListing?: boolean;
  // Image — either local /images/... or remote CDN URL
  image: string;
  // Optional secondary images for product page galleries
  altImages?: string[];
  // Production run size, if known
  printRun?: number;
  // Tagline / short description (plain text, truncated — used on cards/listing + SEO)
  description: string;
  // Full rich product description as HTML (Shopify descriptionHtml) — rendered on the
  // detail page in a prose container. Sanitized of editor cruft before render.
  descriptionHtml?: string;
  // Long story / synopsis
  story?: string;
  // Creative team
  creators?: { role: string; name: string; sub?: string }[];
  // Variant ladder (label + tier note + optional per-variant image)
  variants?: { name: string; tier: string; note?: string; image?: string }[];
  // Shipping note
  shipping?: string;
  // Featured = has its own custom page already, link to internal route
  hasCustomPage?: boolean;
  // Highlights (3-4 bullet "why this book hits")
  highlights?: { title: string; body: string }[];
  // Featured emoji or quote
  quote?: string;
  // Optional decorative hero effect (e.g. "bats" for Batman drops, "lightning" for Godzilla,
  // "ninja" for TMNT, "ravens" for Regicide, "embers" for Battle Beast — some
  // auto-apply by title, see getEffect())
  effect?: "bats" | "lightning" | "ninja" | "ravens" | "embers";
  // Optional explicit personality palette. When omitted, getTheme() derives one
  // from the collection + title so every product still gets a matched experience.
  theme?: ProductTheme;
};

export const products: Product[] = [
  // -------- TONY DANIEL NYCC EXCLUSIVES (live on Shopify) --------
  // Curated presentation only. Price / variants / images / stock all come LIVE from
  // Shopify via mergeWithLive — never trust the numbers written here.
  // No printRun: neither Shopify description states a run size, so we publish none.
  {
    slug: "absolute-batman-24-tony-daniel-nycc-exclusive",
    shopifyHandle: "absolute-batman-24-tony-daniel-nycc-exclusive",
    title: "Absolute Batman #24 – Tony Daniel NYCC Exclusive",
    collection: "exclusives",
    // Stock state is NOT written here. COMING SOON vs live vs sold out is derived from
    // Shopify at request time (coming-soon tag + availableForSale) — see the DROP STATE
    // block in src/lib/shopify.ts. Roberto publishing/holding the book in Shopify is what
    // moves it, with no code change.
    priceFrom: 15,
    image: "/images/exclusives/absolute-batman-24-trade.jpg",
    altImages: [
      "/images/exclusives/absolute-batman-24-virgin.jpg",
      "/images/exclusives/absolute-batman-24-foil.jpg",
    ],
    description:
      "Tony Daniel's New York Comic Con exclusive variant — and the 1st appearance of Absolute Batgirl.",
    story:
      "WITHOUT THE BADGE... WITHOUT HER FATHER... ABSOLUTE BAT ENTERS THE SCENE. In the battle of self, of Batman versus Batman, there can be only one. Everyone Bruce has ever known, ever cared about, or ever loved will face their ultimate inner demons.",
    creators: [
      { role: "Cover", name: "Tony Daniel", sub: "NYCC exclusive variant" },
      { role: "Writer", name: "Scott Snyder" },
      { role: "Art", name: "Nick Dragotta" },
      { role: "Colors", name: "Frank Martin" },
    ],
    shipping: "Raw copies ship in a mylar and board. CGC orders ship out late December.",
    highlights: [
      { title: "1st appearance of Absolute Batgirl", body: "A true key issue — the debut collectors will chase later." },
      { title: "Tony Daniel NYCC exclusive", body: "Convention-exclusive variant cover art by Tony Daniel." },
      { title: "Three covers", body: "Trade dress, virgin and an exclusive foil edition — or take the full set." },
      { title: "Raw or graded", body: "CGC 9.8 Blue Label copies available alongside raw." },
    ],
  },
  {
    slug: "absolute-cassandra-cain-the-shadows-hand-1-tony-daniel-nycc-exclusive",
    shopifyHandle: "absolute-cassandra-cain-the-shadows-hand-1-tony-daniel-nycc-exclusive",
    title: "Absolute Cassandra Cain: The Shadow's Hand #1 – Tony Daniel NYCC Exclusive",
    collection: "exclusives",
    // Stock state is NOT written here. COMING SOON vs live vs sold out is derived from
    // Shopify at request time (coming-soon tag + availableForSale) — see the DROP STATE
    // block in src/lib/shopify.ts. Roberto publishing/holding the book in Shopify is what
    // moves it, with no code change.
    priceFrom: 15,
    image: "/images/exclusives/absolute-cassandra-cain-1-trade.jpg",
    altImages: ["/images/exclusives/absolute-cassandra-cain-1-foil.jpg"],
    description:
      "Tony Daniel's New York Comic Con exclusive variant — the origin of Absolute Cassandra Cain.",
    story:
      "SPINNING OUT FROM ABSOLUTE CATWOMAN COMES THE ABSOLUTE DEMON'S HAND! Years ago, The Joker trained with the League of Assassins, and when he learned all he could, he slaughtered everyone. But out of the wreckage of what was left came Lady Shiva and her daughter, CASSANDRA CAIN. Learn the origin of the Absolute Universe's most formidable assassin and how her story is one that is intertwined with the world's greatest thief, Selina Kyle, Catwoman!",
    creators: [
      { role: "Cover", name: "Tony Daniel", sub: "NYCC exclusive variant" },
      { role: "Writer", name: "Grayson" },
      { role: "Art", name: "Bergara" },
      { role: "Colors", name: "Spicer" },
    ],
    shipping: "Raw copies ship in a mylar and board. CGC orders ship out late December.",
    highlights: [
      { title: "Origin of Absolute Cassandra Cain", body: "A true key issue — the origin of the Absolute Universe's most formidable assassin." },
      { title: "Tony Daniel NYCC exclusive", body: "Convention-exclusive variant cover art by Tony Daniel." },
      { title: "Ties into Absolute Catwoman", body: "Connects Cassandra's story to Selina Kyle." },
      { title: "Raw or graded", body: "CGC 9.8 Blue Label copies available alongside raw." },
    ],
  },
  {
    slug: "the-horror-of-godzilla-1-poncho-exclusive",
    shopifyHandle: "the-horror-of-godzilla-1-poncho-exclusive",
    title: "The Horror of Godzilla #1 – Poncho Exclusive Variant",
    collection: "exclusives",
    priceFrom: 20,
    image: "https://cbbst.com/cdn/shop/files/9EC9A66C-2800-4E3A-981C-BDAF3E394868.png?width=1200",
    altImages: [
      "https://cbbst.com/cdn/shop/files/18C774F5-E019-4F2A-A1C0-172B13853112.png?width=1200",
      "https://cbbst.com/cdn/shop/files/B83B8F3D-E01B-436D-A8BD-EDA785C7B568.png?width=1200",
    ],
    printRun: 400,
    description:
      "The King strikes. A Poncho exclusive Virgin variant for the prequel that unleashes Godzilla's very first attack — 1954 Tokyo, brutal and unhinged. Strictly 400 Virgin copies worldwide.",
    story:
      "Set in 1954 Tokyo, this four-issue miniseries rewinds to the very first time the King of the Monsters made landfall. A scientists' experiment goes catastrophically wrong and wakes something that should have stayed asleep — depicting Godzilla's first attack in the most brutal fashion yet. A perfect jump-on key for horror and Godzilla fans alike.",
    quote: "Godzilla's first attack — in brutal fashion.",
    creators: [
      { role: "Cover Art", name: "Poncho", sub: "CBBST exclusive Virgin variant" },
      { role: "Writer", name: "Griffin Sheridan" },
      { role: "Writer", name: "Ethan S. Parker" },
      { role: "Interior Art", name: "Tristan Jones" },
    ],
    highlights: [
      { title: "VIRGIN EDITION — ONLY 400", body: "Poncho exclusive Virgin variant, capped at 400 copies worldwide. When they're gone, they're gone." },
      { title: "KEY ISSUE", body: "Godzilla's very first attack — a prequel key set in 1954 Tokyo, built for first-appearance collectors." },
      { title: "CGC 9.8 CHASE", body: "Grab it raw or go for the CGC 9.8 Universal Blue Label, white pages. Pick how deep you go." },
      { title: "BUILT FOR COLLECTORS", body: "Horror + Godzilla crossover appeal. Raw books guaranteed 9.2 or better." },
    ],
    shipping:
      "Raw copies ship the week of July 29th. CGC orders expected early December. Signed / remarked copies allow additional weeks. Raw books guaranteed 9.2 or better.",
    effect: "lightning",
    hasCustomPage: false,
  },
  // ---------------- NEW DROP ----------------
  {
    slug: "absolute-batman-22-ejikure-exclusive-variant",
    shopifyHandle: "absolute-batman-22-ejikure-exclusive-variant",
    title: "Absolute Batman #22 – Ejikure Exclusive Variant",
    collection: "exclusives",
    priceFrom: 15,
    image: "/images/exclusives/absolute-batman-22-trade.jpg",
    altImages: [
      "/images/exclusives/absolute-batman-22-virgin.jpg",
      "/images/exclusives/absolute-batman-22-cgc.webp",
    ],
    description:
      "Before the madness had a name, her story begins. The Ejikure exclusive variant for the issue that reveals Harley Quinn's origin — strictly limited, built for collectors who demand true scarcity. Once they're gone, they're gone for good.",
    story:
      "THE ORIGIN OF HARLEY QUINN! As the Robins nest in Gotham's backyard, and Batman faces ultimate defeat, Harley Quinn's origin is revealed. How does Harley connect with Ark M, and how did the Robins fledge from hatchlings to birds of prey? The call of more than one predator will be answered in this issue.",
    quote: "Once these are gone, they're gone for good.",
    creators: [
      { role: "Cover Art", name: "Ejikure", sub: "CBBST exclusive variant" },
      { role: "Writer", name: "Scott Snyder" },
      { role: "Interior Art", name: "Dell'Edera" },
      { role: "Colors", name: "Frank Martin" },
    ],
    variants: [
      { name: "TRADE", tier: "$15", note: "Trade dress cover · raw 9.2+" },
      { name: "TRADE / VIRGIN / FOIL SET", tier: "$60", note: "All three covers · matched set" },
      { name: "CGC 9.8 BLUE LABEL TRADE", tier: "$90", note: "Professionally graded · ships early November" },
    ],
    highlights: [
      { title: "EXCLUSIVE EJIKURE COVER", body: "Variant art by Ejikure — a CBBST exclusive you won't find on the shelf." },
      { title: "KEY ISSUE", body: "The first origin of Harley Quinn in this run — and how she connects to Ark M." },
      { title: "THREE LIMITED VERSIONS", body: "Trade, Trade/Virgin/Foil Set, and CGC 9.8 Blue Label. Pick how deep you go." },
      { title: "BUILT FOR COLLECTORS", body: "Perfect for Batman & DC collectors. Raw books guaranteed 9.2 or better." },
    ],
    shipping:
      "Ships week of 7/22. CGC orders ship early November. Raw books guaranteed 9.2 or better.",
    effect: "bats",
    hasCustomPage: false,
  },
  // ---------------- ABSOLUTE BATMAN #19 — custom "fear-toxin" page ----------------
  {
    slug: "absolute-batman-19-pablo-villalobos-exclusive-variant",
    shopifyHandle: "absolute-batman-19-pablo-villalobos-exclusive-variant",
    title: "Absolute Batman #19 – Pablo Villalobos Exclusive Variant",
    collection: "exclusives",
    priceFrom: 15,
    image: "/images/exclusives/absolute-batman-19-trade.webp",
    altImages: [
      "/images/exclusives/absolute-batman-19-set.webp",
      "/images/exclusives/absolute-batman-19-cgc.webp",
    ],
    description:
      "Fear is evolving. The DEBUT OF ABSOLUTE SCARECROW — a Pablo Villalobos exclusive variant that launches a dark, horror-driven new arc for the Absolute Batman saga. Raw books guaranteed 9.2 or better.",
    story:
      "Absolute Scarecrow emerges from the shadows of Ark M as a new story arc begins. As Joker sets his sights on Absolute Batman, he enlists one of the facility's most terrifying doctors — Dr. Jonathan Crane. New debuts, new villains, new arc starts here.",
    quote: "Fear has a new face.",
    creators: [
      { role: "Cover Art", name: "Pablo Villalobos", sub: "CBBST exclusive variant" },
      { role: "Writer", name: "Scott Snyder" },
      { role: "Featuring", name: "Absolute Scarecrow", sub: "First appearance" },
    ],
    variants: [
      { name: "TRADE", tier: "$15", note: "Trade dress cover · raw 9.2+" },
      { name: "TRADE / VIRGIN / FOIL SET", tier: "$60", note: "All three covers · matched set" },
      { name: "CGC 9.8 BLUE LABEL TRADE", tier: "$90", note: "Professionally graded · ships early November" },
    ],
    highlights: [
      { title: "FIRST ABSOLUTE SCARECROW", body: "The debut of Absolute Scarecrow — a true first-appearance key." },
      { title: "NEW ARC STARTS HERE", body: "New debuts, new villains, new alliances. The perfect jump-on point." },
      { title: "PABLO VILLALOBOS EXCLUSIVE", body: "Dark, horror-driven variant art you won't find on the shelf." },
      { title: "BUILT FOR COLLECTORS", body: "Raw books guaranteed 9.2 or better. CGC 9.8 available for the graded chase." },
    ],
    shipping:
      "CGC orders ship early November. Raw books guaranteed 9.2 or better.",
    effect: "bats",
    hasCustomPage: true,
  },
  // ---------------- PRIOR DROP ----------------
  {
    slug: "absolute-batman-21-aaron-bartling-exclusive-variant",
    title: "Absolute Batman #21 – Aaron Bartling Exclusive Variant",
    collection: "exclusives",
    priceFrom: 30,
    image: "/images/exclusives/absolute-batman-21-foil.png",
    altImages: ["/images/exclusives/absolute-batman-21-virgin.png"],
    printRun: 1000,
    description:
      "Scarecrow's reign tightens its grip — and nothing in Gotham will be the same. An Aaron Bartling exclusive variant, strictly limited and built for collectors who demand true scarcity.",
    story:
      "SCARECROW'S REIGN OF TERROR CONTINUES! Friends become enemies. Enemies become friends. Final forms are revealed, and Scarecrow's reign of terror threatens to upend everything. A KEY issue tied to Scarecrow's escalating dominance in Gotham — once these are gone, they're gone for good.",
    quote: "Once these are gone, they're gone for good.",
    creators: [
      { role: "Cover Art", name: "Aaron Bartling", sub: "CBBST exclusive variant" },
      { role: "Writer", name: "Scott Snyder" },
      { role: "Art", name: "Nick Dragotta" },
      { role: "Color", name: "Frank Martin" },
    ],
    variants: [
      { name: "TRADE FOIL", tier: "$30", note: "Foil variant · only 1,000 made · raw 9.2+" },
      { name: "VIRGIN", tier: "$30", note: "Virgin variant · only 1,000 made · raw 9.2+" },
      { name: "SIGNED", tier: "$50", note: "Foil or Virgin · artist signature" },
      { name: "REMARKED", tier: "$55", note: "Foil or Virgin · custom sketch by artist" },
      { name: "TRADE / VIRGIN SET", tier: "$90", note: "Both variants · matched set" },
      { name: "CGC 9.8 BLUE LABEL", tier: "$115", note: "Professionally graded · ships early October" },
    ],
    highlights: [
      { title: "EXCLUSIVE COVER ART", body: "Variant art by Aaron Bartling — a CBBST exclusive you won't find anywhere else." },
      { title: "STRICTLY 1,000 EACH", body: "Trade Foil and Virgin each limited to just 1,000 copies." },
      { title: "KEY ISSUE", body: "Major story and character developments in Scarecrow's escalating reign over Gotham." },
      { title: "BUILT FOR COLLECTORS", body: "Perfect for Batman & DC collectors. Raw books guaranteed 9.2 or better." },
    ],
    shipping:
      "Ships week of 6/24. Allow a few additional weeks for signatures/remarks. CGC orders ship early October. Raw books guaranteed 9.2 or better.",
    effect: "bats",
    hasCustomPage: false,
  },
  // ---------------- FEATURED 6 (custom pages) ----------------
  {
    slug: "monster-racing-league-1",
    title: "M1: Monster Racing League #1 – Sukesha Ray HeroesCon Exclusive",
    collection: "exclusives",
    priceFrom: 20,
    image: "/images/exclusives/m1-monster-racing-league.png",
    altImages: ["/images/exclusives/monster-racing-league-alt.png"],
    printRun: 500,
    description: "Jae Lee's new sci-fi racing ongoing. HeroesCon exclusive variant by Sukesha Ray.",
    hasCustomPage: true,
  },
  {
    slug: "lobo-3",
    title: "Lobo #3 – Ryan G. Browne Exclusive Variant",
    collection: "exclusives",
    priceFrom: 20,
    image: "/images/exclusives/lobo-3-ryan-browne.png",
    altImages: ["/images/exclusives/lobo-3-back.png"],
    printRun: 666,
    description: "Ryan G. Browne's first-ever DC exclusive cover. Backer-board COA included.",
    hasCustomPage: true,
  },
  {
    slug: "odin-1",
    title: "Odin #1 – Matt Wilson HeroesCon Exclusive Variant",
    collection: "exclusives",
    priceFrom: 20,
    image: "/images/exclusives/odin-1-matt-wilson.png",
    printRun: 450,
    description: "Tynion IV horror — Green Room meets Midsommar. Numbered COA.",
    hasCustomPage: true,
  },
  {
    slug: "of-the-earth-1",
    title: "Of The Earth #1 – Dale Altmann Exclusive Variant",
    collection: "exclusives",
    priceFrom: 20,
    image: "/images/exclusives/of-the-earth-1-altmann.png",
    altImages: ["/images/exclusives/of-the-earth-alt.jpg"],
    printRun: 500,
    description: "Neo-noir eco-horror from Chris Condon & Charlie Adlard. Image Comics.",
    hasCustomPage: true,
  },
  {
    slug: "exquisite-corpses-13-foil-virgin",
    title: "Exquisite Corpses #13 – Dale Altmann Full Color Foil Virgin Variant",
    collection: "exclusives",
    priceFrom: 30,
    image: "/images/exclusives/exquisite-corpses-13-foil-virgin.png",
    altImages: [
      "/images/exclusives/exquisite-corpses-13-bw-alt-a.jpg",
      "/images/exclusives/exquisite-corpses-13-coa.jpg",
    ],
    printRun: 500,
    description: "Season 1 finale. Foil virgin. COA card inside. 1-of-1 art chance.",
    hasCustomPage: true,
  },
  {
    slug: "exquisite-corpses-13-bw-virgin",
    title: "Exquisite Corpses #13 – Dale Altmann B&W Virgin Variant",
    collection: "exclusives",
    priceFrom: 20,
    image: "/images/exclusives/exquisite-corpses-13-bw-virgin.png",
    altImages: [
      "/images/exclusives/exquisite-corpses-13-bw-alt-a.jpg",
      "/images/exclusives/exquisite-corpses-13-coa.jpg",
    ],
    printRun: 500,
    description: "Stark B&W virgin. No trade dress. Pure Altmann ink lines.",
    hasCustomPage: true,
  },

  // ---------------- MORE EXCLUSIVES (dynamic page) ----------------
  {
    slug: "battle-beast-10-lipwei-chang-virgin-foil",
    title: "Battle Beast #10 – LipWei Chang Virgin Foil Exclusive",
    collection: "exclusives",
    priceFrom: 30,
    image: "https://cbbst.com/cdn/shop/files/8231A2F4-0A9F-487E-80B8-718EE3CFC586.png?v=1779382903&width=1200",
    altImages: [
      "https://cbbst.com/cdn/shop/files/F5AF9E8A-9ABE-4238-8417-F55718BBDBD5.png?v=1779383813&width=1200",
    ],
    printRun: 1000,
    description:
      "Battle Beast vs. Conquest — the fight Invincible fans have been waiting years for. LipWei Chang matte foil virgin variant. 1,000 copies.",
    story:
      "At long last — it's the fight everyone has always wanted. Battle Beast vs. Conquest is the centerpiece moment of the Invincible universe arc, and Issue #10 is where it finally drops. High demand + iconic matchup + collector-grade LipWei Chang foil treatment = serious long-term speculator potential.",
    creators: [{ role: "Variant Artist", name: "LipWei Chang", sub: "Matte Foil Virgin Cover" }],
    variants: [
      { name: "UNSIGNED", tier: "$30", note: "Raw foil virgin · bagged & boarded" },
      { name: "CGC 9.8", tier: "$$", note: "Blue label graded · ships end of Sept" },
    ],
    shipping: "Ships week of 6/24 · CGC orders end of September",
    highlights: [
      { title: "MATTE FOIL VIRGIN", body: "Premium foil treatment with no trade dress. Raw LipWei Chang artwork on display." },
      { title: "1,000 COPIES", body: "Hard cap. When it sells through, that's it — no second print." },
      { title: "SPECULATOR KEY", body: "Battle Beast vs. Conquest is a long-awaited Invincible moment. High demand + iconic matchup." },
      { title: "TWO TIERS", body: "Raw unsigned or CGC 9.8 Blue Label. Pick how serious you want to get." },
    ],
  },
  {
    slug: "absolute-batman-20-mike-choi",
    title: "Absolute Batman #20 – Mike Choi Exclusive Variant",
    collection: "exclusives",
    priceFrom: 15,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/1A000147-ADE3-4799-9D17-D4D3F6078A32.png?width=800",
    description: "Mike Choi exclusive variant for Absolute Batman's hot run.",
    creators: [{ role: "Variant Artist", name: "Mike Choi" }],
  },
  {
    slug: "only-the-savage-are-left-1-wayshak",
    title: "Only The Savage Are Left #1 – Jonathan Wayshak Exclusive Variant",
    collection: "exclusives",
    priceFrom: 30,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/D3150B2E-75A0-4CF2-AA25-E31C962E277E.jpg?width=800",
    description: "Brutal new horror series. Wayshak's distinctive ink-on-rage style.",
    creators: [{ role: "Variant Artist", name: "Jonathan Wayshak" }],
  },
  {
    slug: "archie-85-game-galaxy-altmann",
    title: "Archie 85th Anniversary Presents: Archie Game Galaxy – Dale Altmann Exclusive",
    collection: "exclusives",
    priceFrom: 20,
    image: "https://cbbst.com/cdn/shop/files/2F801658-77F2-434A-9585-5C8B2E5F0F10.jpg?width=800",
    description: "Archie's 85th anniversary one-shot. Dale Altmann exclusive variant.",
    creators: [{ role: "Variant Artist", name: "Dale Altmann" }],
  },
  {
    slug: "exquisite-corpses-12-altmann",
    title: "Exquisite Corpses #12 – Dale Altmann Exclusive Variant",
    collection: "exclusives",
    priceFrom: 20,
    image: "https://cbbst.com/cdn/shop/files/6A0DF71B-BE7A-4115-B80F-D7109577B751.png?width=800",
    description: "Issue #12 by Tynion IV & Walsh. Altmann exclusive cover.",
    creators: [
      { role: "Writer", name: "James Tynion IV" },
      { role: "Artist", name: "Michael Walsh" },
      { role: "Variant Artist", name: "Dale Altmann" },
    ],
  },
  {
    slug: "invincible-1-lipwei-chang-megacon",
    title: "Invincible #1 – LipWei Chang Foil MegaCon Exclusive",
    collection: "exclusives",
    priceFrom: 30,
    image: "https://cbbst.com/cdn/shop/files/B5B504EF-23D0-4832-86B7-7F79A03F73CC.png?width=800",
    description: "Robert Kirkman's Invincible #1 — premium foil treatment by LipWei Chang.",
    creators: [{ role: "Variant Artist", name: "LipWei Chang" }],
  },
  {
    slug: "skitc-1-jeff-monk-megacon",
    title: "Something Is Killing The Children #1 – Jeff Monk MegaCon Exclusive",
    collection: "exclusives",
    priceFrom: 20,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/A1EC35B6-F0C4-46A6-B5F0-B781504A310B.png?width=800",
    description: "Tynion IV's modern horror classic. Jeff Monk MegaCon exclusive.",
    creators: [
      { role: "Writer", name: "James Tynion IV" },
      { role: "Variant Artist", name: "Jeff Monk" },
    ],
  },
  {
    slug: "tmnt-15-melendez-virgin-set",
    title: "TMNT #15 – Nate Melendez MegaCon Virgin Exclusive Set",
    collection: "exclusives",
    priceFrom: 40,
    image: "https://cbbst.com/cdn/shop/files/4AE06CE2-8B41-4344-87D6-290576B2DAF1.jpg?width=800",
    description: "Complete virgin variant set. Both B&W and Color in one bundle.",
    creators: [{ role: "Variant Artist", name: "Nate Melendez" }],
  },
  {
    slug: "tmnt-15-melendez-bw-virgin",
    title: "TMNT #15 – Nate Melendez MegaCon B&W Virgin Exclusive",
    collection: "exclusives",
    priceFrom: 25,
    image: "https://cbbst.com/cdn/shop/files/CBDCFBDF-967A-4AF3-AE3A-F5DD69D00DDF.png?width=800",
    description: "Black & white virgin treatment. Raw Melendez ink work.",
    creators: [{ role: "Variant Artist", name: "Nate Melendez" }],
  },
  {
    slug: "tmnt-15-melendez-color-virgin",
    title: "TMNT #15 – Nate Melendez MegaCon Color Virgin Exclusive",
    collection: "exclusives",
    priceFrom: 25,
    image: "https://cbbst.com/cdn/shop/files/07ABB73D-73DF-4280-946B-701A7B3FD4B1.png?width=800",
    description: "Full color virgin variant. No trade dress.",
    creators: [{ role: "Variant Artist", name: "Nate Melendez" }],
  },
  {
    slug: "white-sky-1-altmann-2nd",
    title: "White Sky #1 – 2nd Print MegaCon Dale Altmann Exclusive",
    collection: "exclusives",
    priceFrom: 25,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/A3B4BF6A-9920-4AB3-9853-388942EAB0EA.png?width=800",
    description: "Second print of the breakout indie. Altmann exclusive variant.",
    creators: [{ role: "Variant Artist", name: "Dale Altmann" }],
  },
  {
    slug: "usagi-kaito-84-1-altmann-set",
    title: "Usagi Yojimbo: Kaito '84 #1 – Dale Altmann MegaCon Exclusive Cover Set",
    collection: "exclusives",
    priceFrom: 40,
    image: "https://cbbst.com/cdn/shop/files/CC168B98-A2A0-4123-83CF-3DF23EA4E71F.jpg?width=800",
    description: "Complete Stan Sakai/Usagi MegaCon variant set.",
    creators: [{ role: "Variant Artist", name: "Dale Altmann" }],
  },
  {
    slug: "usagi-kaito-84-1-jei",
    title: "Usagi Yojimbo: Kaito '84 #1 – JEI MegaCon Exclusive",
    collection: "exclusives",
    priceFrom: 25,
    image: "https://cbbst.com/cdn/shop/files/395E0E77-9BA5-4130-9487-79BC453BF4BB.png?width=800",
    description: "JEI cover variant from MegaCon exclusive run.",
    creators: [{ role: "Variant Artist", name: "Dale Altmann" }],
  },
  {
    slug: "usagi-kaito-84-1-usagi",
    title: "Usagi Yojimbo: Kaito '84 #1 – Usagi MegaCon Exclusive",
    collection: "exclusives",
    priceFrom: 25,
    image: "https://cbbst.com/cdn/shop/files/27A11F40-F5A7-4F3C-9D2D-759E64C9F0D7.png?width=800",
    description: "Usagi-focused cover from the MegaCon exclusive run.",
    creators: [{ role: "Variant Artist", name: "Dale Altmann" }],
  },
  {
    slug: "quiet-place-storm-warning-1-wilson",
    title: "A Quiet Place: Storm Warning #1 – MegaCon Virgin Matt Wilson Exclusive",
    collection: "exclusives",
    priceFrom: 20,
    image: "https://cbbst.com/cdn/shop/files/6961E843-E70B-4A06-8554-A29770CD6314.png?width=800",
    description: "Tie-in to the franchise. Matt Wilson virgin variant.",
    creators: [{ role: "Variant Artist", name: "Matt Wilson" }],
  },
  {
    slug: "shredder-6-altmann-virgin",
    title: "Shredder #6 – MegaCon Virgin Dale Altmann Exclusive",
    collection: "exclusives",
    priceFrom: 25,
    image: "https://cbbst.com/cdn/shop/files/D2FE267E-012A-46BC-908E-C17DE7E8EECB.png?width=800",
    description: "Dale Altmann virgin variant for Shredder's solo arc.",
    creators: [{ role: "Variant Artist", name: "Dale Altmann" }],
  },
  {
    slug: "exquisite-corpses-11-altmann-megacon",
    title: "Exquisite Corpses #11 – Dale Altmann MegaCon Exclusive Variant",
    collection: "exclusives",
    priceFrom: 20,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/5F65A396-BE60-4AF9-8352-89BEC4867632.png?width=800",
    description: "Issue #11 from the Tynion/Walsh horror series. Altmann MegaCon variant.",
    creators: [
      { role: "Writer", name: "James Tynion IV" },
      { role: "Variant Artist", name: "Dale Altmann" },
    ],
  },
  {
    slug: "shredder-6-delgado-set",
    title: "Shredder #6 – MegaCon Virgin Set Kevin Delgado Exclusive",
    collection: "exclusives",
    priceFrom: 40,
    image: "https://cbbst.com/cdn/shop/files/BDF358BD-2CA6-4F03-A49C-F91C14B41C45.jpg?width=800",
    description: "Complete Kevin Delgado virgin variant set — Lightning + Red.",
    creators: [{ role: "Variant Artist", name: "Kevin Delgado" }],
  },
  {
    slug: "shredder-6-delgado-lightning",
    title: "Shredder #6 – MegaCon Virgin Lightning Kevin Delgado Exclusive",
    collection: "exclusives",
    priceFrom: 25,
    image: "https://cbbst.com/cdn/shop/files/5BD0EAB1-7003-4DEA-AEC2-A469DCCD873E.png?width=800",
    description: "Lightning colorway by Kevin Delgado.",
    creators: [{ role: "Variant Artist", name: "Kevin Delgado" }],
  },
  {
    slug: "shredder-6-delgado-red",
    title: "Shredder #6 – MegaCon Virgin Red Kevin Delgado Exclusive",
    collection: "exclusives",
    priceFrom: 25,
    image: "https://cbbst.com/cdn/shop/files/184BAD70-2C7B-48C7-89FB-DBB94F3FEF9A.png?width=800",
    description: "Crimson colorway by Kevin Delgado.",
    creators: [{ role: "Variant Artist", name: "Kevin Delgado" }],
  },
  {
    slug: "exquisite-corpses-9-altmann",
    title: "Exquisite Corpses #9 – Dale Altmann Exclusive Variant",
    collection: "exclusives",
    priceFrom: 20,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/FF60C290-0C65-4D5B-B6B7-EF26DDE2A114.png?width=800",
    description: "Issue #9 from the Tynion/Walsh horror series.",
    creators: [
      { role: "Writer", name: "James Tynion IV" },
      { role: "Variant Artist", name: "Dale Altmann" },
    ],
  },
  {
    slug: "department-of-truth-34-monk",
    title: "Department of Truth #34 – Jeff Monk Variant",
    collection: "exclusives",
    priceFrom: 25,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/6154A30E-8590-4E27-9459-BC6B8776BAF3.png?width=800",
    description: "Jeff Monk variant for Tynion IV's conspiracy horror series.",
    creators: [
      { role: "Writer", name: "James Tynion IV" },
      { role: "Variant Artist", name: "Jeff Monk" },
    ],
  },
  {
    slug: "sabrina-magic-unleashed-1-altmann-nycc",
    title: "Sabrina: Magic Unleashed #1 – Dale Altmann Akira Homage NYCC Exclusive",
    collection: "exclusives",
    priceFrom: 24.99,
    image: "https://cbbst.com/cdn/shop/files/5A083D00-F801-493C-A7A1-33B186C4A4AE.png?width=800",
    description: "NYCC variant — Sabrina meets Akira homage by Dale Altmann.",
    creators: [{ role: "Variant Artist", name: "Dale Altmann" }],
  },
  {
    slug: "sabrina-magic-unleashed-1-altmann-akira",
    title: "Sabrina: Magic Unleashed #1 – Dale Altmann Akira Homage",
    collection: "exclusives",
    priceFrom: 24.99,
    image: "https://cbbst.com/cdn/shop/files/F161A3C7-FE51-4246-861F-FA84CE9E1793.png?width=800",
    description: "Akira homage variant of the new Sabrina relaunch.",
    creators: [{ role: "Variant Artist", name: "Dale Altmann" }],
  },
  {
    slug: "tmnt-12-rachta-lin-nycc",
    title: "TMNT #12 – Rachta Lin NYCC Exclusive",
    collection: "exclusives",
    priceFrom: 24.99,
    priceCompare: 59.99,
    image: "https://cbbst.com/cdn/shop/files/27F9245F-8E71-4EAB-955F-1CA450A27599.jpg?width=800",
    description: "NYCC exclusive by Rachta Lin — was $59.99, now $24.99.",
    creators: [{ role: "Variant Artist", name: "Rachta Lin" }],
  },
  {
    slug: "tmnt-11-joe-doyle",
    title: "TMNT #11 – Joe Doyle Variant",
    collection: "exclusives",
    priceFrom: 14.99,
    image: "https://cbbst.com/cdn/shop/files/E6A56ED4-19C3-4961-91E7-461FF1EDB533.png?width=800",
    description: "Joe Doyle variant cover for TMNT #11.",
    creators: [{ role: "Variant Artist", name: "Joe Doyle" }],
  },
  {
    slug: "batman-1-mike-rooth",
    title: "Batman #1 – Mike Rooth Variant",
    collection: "exclusives",
    priceFrom: 24.99,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/57D74263-342E-4FD4-8D3E-955132D6C00D.png?width=800",
    description: "Mike Rooth's variant for the new Batman #1 launch.",
    creators: [{ role: "Variant Artist", name: "Mike Rooth" }],
  },
  {
    slug: "tmnt-10-camron-johnson",
    title: "TMNT #10 – Camron Johnson Exclusive",
    collection: "exclusives",
    priceFrom: 19.99,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/984E13A7-A25E-4DDB-AB8C-4095FF82F780.jpg?width=800",
    description: "Camron Johnson exclusive variant for TMNT #10.",
    creators: [{ role: "Variant Artist", name: "Camron Johnson" }],
  },
  {
    slug: "tmnt-9-delgado-ff49-homage",
    title: "TMNT #9 – Kevin Delgado Variant: Fantastic Four #49 Homage",
    collection: "exclusives",
    priceFrom: 19.99,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/07C74B39-E4ED-4183-8269-DD99B0AEE6C8.png?width=800",
    description: "Classic FF #49 homage cover treatment. Kevin Delgado variant.",
    creators: [{ role: "Variant Artist", name: "Kevin Delgado" }],
  },
  {
    slug: "news-from-the-fallout-1-altmann",
    title: "News From The Fallout #1 – Dale Altmann Variant",
    collection: "exclusives",
    priceFrom: 25,
    image: "https://cbbst.com/cdn/shop/files/E47053FC-1B37-434F-BED3-D2C081646420.jpg?width=800",
    description: "Indie hit. Dale Altmann variant cover.",
    creators: [{ role: "Variant Artist", name: "Dale Altmann" }],
  },
  {
    slug: "tmnt-8-altmann",
    title: "TMNT #8 – Dale Altmann Variant",
    collection: "exclusives",
    priceFrom: 19.99,
    image: "https://cbbst.com/cdn/shop/files/483997458_2125397567889961_90154795489100545_n.jpg?width=800",
    description: "Dale Altmann variant for TMNT #8.",
    creators: [{ role: "Variant Artist", name: "Dale Altmann" }],
  },
  {
    slug: "department-of-truth-28-altmann",
    title: "Department of Truth #28 – Dale Altmann Variant",
    collection: "exclusives",
    priceFrom: 25,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/483919439_940521928254642_4076239850077278061_n.jpg?width=800",
    description: "Dale Altmann variant for Department of Truth #28.",
    creators: [
      { role: "Writer", name: "James Tynion IV" },
      { role: "Variant Artist", name: "Dale Altmann" },
    ],
  },

  // ---------------- GRADED SLABS ----------------
  {
    slug: "edge-spider-verse-2-cgc-98",
    title: "Edge of Spider-Verse #2 CGC 9.8",
    collection: "graded",
    priceFrom: 795,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/10BA8AC5-29B8-4892-AF7F-77B2F1C8419F.png?width=800",
    description: "First appearance key. CGC 9.8 Blue Label.",
  },
  {
    slug: "iron-man-128-cgc-90",
    title: "Iron Man #128 CGC 9.0 White Pages",
    collection: "graded",
    priceFrom: 144.99,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/E9CCEAA3-1CE5-4073-A96F-1F216E5ED7D0.png?width=800",
    description: "Demon in a Bottle storyline classic. White pages, CGC 9.0.",
  },
  {
    slug: "tmnt-20-eastman-laird-cgc-98",
    title: "TMNT #20: 300th Issue Special — 1:1000 Eastman & Laird Full Art CGC 9.8",
    collection: "graded",
    priceFrom: 2799.99,
    priceCompare: 2999.99,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/478A003F-3C34-48DF-BB7E-BA69EA045655.png?width=800",
    description: "1:1000 ratio. Signed Kevin Eastman. CGC 9.8 Signature Series.",
  },
  {
    slug: "ultimate-fallout-4-cgc-98",
    title: "Ultimate Fallout #4 CGC 9.8 — 1st Miles Morales",
    collection: "graded",
    priceFrom: 1150,
    image: "https://cbbst.com/cdn/shop/files/65E364E6-2F6C-4E1A-B919-09C8CE8A67C4.png?width=800",
    description: "First appearance of Miles Morales. CGC 9.8 Blue Label.",
  },
  {
    slug: "nyx-3-cgc-98",
    title: "NYX #3 CGC 9.8 — 1st X-23",
    collection: "graded",
    priceFrom: 1150,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/2270CA0C-88B9-4316-A03C-68B43110D7F9.png?width=800",
    description: "First appearance of X-23 (Laura Kinney). CGC 9.8.",
  },
  {
    slug: "exquisite-corpses-1-cgc-98",
    title: "Exquisite Corpses #1 CGC 9.8",
    collection: "graded",
    priceFrom: 160,
    image: "https://cbbst.com/cdn/shop/files/F38EE69B-9E7E-4E30-A5CA-5C6D6A65C38E.png?width=800",
    description: "First issue of the Tynion IV / Walsh horror anthology. CGC 9.8.",
  },
  {
    slug: "ultimate-fallout-4-facsimile-cgc-98-crain",
    title: "Ultimate Fallout #4 Facsimile CGC 9.8 — Signed & Sketched by Clayton Crain",
    collection: "graded",
    priceFrom: 1600,
    image: "https://cbbst.com/cdn/shop/files/82A83BBA-7014-47A1-8A25-CE811A91B583.png?width=800",
    description: "Facsimile edition signed AND sketched by Clayton Crain. CGC 9.8 Signature Series.",
  },
  {
    slug: "renew-your-vows-1-jsc-cgc-98",
    title: "Amazing Spider-Man: Renew Your Vows #1 JSC CGC 9.8 — Stan Lee Signed",
    collection: "graded",
    priceFrom: 3600,
    image: "https://cbbst.com/cdn/shop/files/9EBE7334-D033-4E44-9540-A0F28798C68B.png?width=800",
    description: "Stan Lee signed AND J. Scott Campbell signed with sketch. CGC 9.8 Signature Series.",
  },

  // ---------------- TCG ----------------
  {
    slug: "pokemon-151-booster-pack",
    title: "Pokémon 151 Booster Pack — Scarlet & Violet Factory Sealed",
    collection: "tcg",
    priceFrom: 32,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/00E10146-4519-4EFF-A4FB-1AF1CA585EAC.png?width=800",
    description: "Factory sealed booster pack. Scarlet & Violet 151 set.",
  },

  // ---------------- ORIGINAL ART ----------------
  {
    slug: "of-the-earth-1-original-cover-art",
    title: "Of The Earth #1 — Original Cover Art by Dale Altmann",
    collection: "original-art",
    priceFrom: 2500,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/5B738299-ACC5-4BED-9BE0-C700A4326E46.png?width=800",
    description: "One-of-one original cover artwork. The actual piece.",
  },

  // ---------------- SUPPLIES ----------------
  {
    slug: "superior-stash-collectors-bundle",
    title: "The Superior Stash — Collector's Bundle",
    collection: "supplies",
    priceFrom: 49.99,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/483370576_540069542457908_225573779762314570_n.jpg?width=800",
    description: "Complete Superior Stand bundle. Display your slabs in style.",
  },
  {
    slug: "superior-stand-dynamic-duo",
    title: "Superior Stand — The Dynamic Duo Pack",
    collection: "supplies",
    priceFrom: 39.99,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/465884398_2697696623773407_6717717376486393667_n_2c34b789-e19a-435b-8dbf-b6cda2508e65.jpg?width=800",
    description: "Two Superior Stands. Display two slabs side by side.",
  },
  {
    slug: "superior-stand-alone",
    title: "Superior Stand — Stand Alone Edition",
    collection: "supplies",
    priceFrom: 20,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/462556566_1926397077851275_7953494688745186285_n.jpg?width=800",
    description: "Single Superior Stand. The original.",
  },
  {
    slug: "mini-dynamic-duo",
    title: "The Mini — Dynamic Duo Pack",
    collection: "supplies",
    priceFrom: 10,
    soldOut: true,
    image: "https://cbbst.com/cdn/shop/files/462648098_2409698646037646_6726509193663463881_n_49440ff8-6ddd-41e1-bc54-3221a5b5274c.jpg?width=800",
    description: "Mini stand duo pack. Compact display for raw comics.",
  },
];

export const collectionMeta: Record<Collection, { title: string; tag: string; desc: string; route: string }> = {
  exclusives: {
    title: "Exclusives",
    tag: "VARIANTS YOU WON'T FIND TWICE",
    desc: "Print runs of 450 to 666 copies. Variant artists you actually know. The kind of book you find once.",
    route: "/exclusives",
  },
  graded: {
    title: "Graded Comics",
    tag: "CGC SLABS · KEY ISSUES · INVESTMENT TIER",
    desc: "Authenticated and encapsulated by CGC. From $144 white-page silver age keys to $3,600 signature-series grails.",
    route: "/graded",
  },
  tcg: {
    title: "TCG & Collectibles",
    tag: "TRADING CARDS · SEALED PRODUCT",
    desc: "Factory-sealed booster packs, premium TCG product, hard-to-find collectibles.",
    route: "/tcg",
  },
  "original-art": {
    title: "Original Art",
    tag: "ONE-OF-ONE · ORIGINAL COVERS",
    desc: "The actual artwork. Hand-drawn, hand-inked, irreplaceable. One copy in the world. Once it ships, it's gone.",
    route: "/original-art",
  },
  supplies: {
    title: "Supplies",
    tag: "DISPLAY GEAR · SUPERIOR STANDS",
    desc: "Stop tossing your grail in a long box. Industrial-grade Superior Stands designed for graded slabs.",
    route: "/supplies",
  },
};

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Build the full gallery for a product: main image first, then any altImages. */
export function getGallery(p: Product): string[] {
  return [p.image, ...(p.altImages ?? [])];
}

/** Return the variant ladder a product page should display.
 *  Uses product-specific variants if defined; otherwise picks sensible defaults
 *  for the product's collection (e.g. comics get raw / CGC / signed / remarked).
 */
export function getVariants(p: Product): { name: string; tier: string; note?: string }[] {
  if (p.variants && p.variants.length > 0) return p.variants;
  const base = formatPrice(p.priceFrom);
  const fromBase = `From ${formatPrice(p.priceFrom)}`;
  switch (p.collection) {
    case "exclusives":
      return [
        { name: "UNSIGNED", tier: base, note: "Raw · bagged & boarded" },
        { name: "CGC 9.8 BLUE LABEL", tier: fromBase, note: "Professionally graded · authenticated" },
        { name: "SIGNED", tier: fromBase, note: "Artist signature" },
        { name: "REMARKED", tier: fromBase, note: "Custom sketch by artist" },
      ];
    case "graded":
      return [
        { name: "AS GRADED", tier: base, note: "CGC encapsulated · final" },
      ];
    case "tcg":
      return [
        { name: "FACTORY SEALED", tier: base, note: "Sealed · untouched product" },
      ];
    case "original-art":
      return [
        { name: "ONE-OF-ONE", tier: base, note: "The actual artwork · only copy in the world" },
      ];
    case "supplies":
      return [
        { name: "STANDARD", tier: base, note: "As shown · ships in original packaging" },
      ];
    default:
      return [];
  }
}

export function getProductsByCollection(c: Collection): Product[] {
  return products.filter((p) => p.collection === c);
}

export function formatPrice(amount: number): string {
  // A product that has no published price yet carries priceFrom 0 — never print "$0.00".
  if (!amount) return "PRICE TBA";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

/* ------------------------------------------------------------------ *
 *  PER-PRODUCT PERSONALITY  ·  getTheme()
 *  Every product gets its own experience. A product may set `theme`
 *  explicitly; otherwise we derive a matched palette from its title
 *  (character / franchise) and collection (Pokémon energy type, CGC
 *  premium slab, original-art prestige, etc.). Keep the character map
 *  ordered most-specific-first — the first keyword hit wins.
 *  The daily theme-personality job (scripts/theme-personality.mjs)
 *  reports any product that falls through to a collection default so a
 *  hand-tuned entry can be added.
 * ------------------------------------------------------------------ */

// Keyword → palette. Matched (in order) against the lowercased product title.
const CHARACTER_THEMES: { match: string[]; theme: ProductTheme }[] = [
  { match: ["harley"], theme: { accent: "#ff3d9a", accent2: "#8a2be2", mood: "MADNESS HAS A NAME" } },
  // Absolute Batman #23 (Frank Cho exclusive) is the 1st appearance of ABSOLUTE
  // CLAYFACE — a key issue, so it outranks the classic bat-yellow palette below.
  // Absolute-line blood red against wet-clay ochre reads Batman-vs-Clayface
  // instead of Silver Age Gotham.
  { match: ["absolute batman #23", "absolute clayface"], theme: { accent: "#d1122b", accent2: "#9c6b3f", mood: "ABSOLUTE · 1ST CLAYFACE", voice: "impact" } },
  // Absolute Batman #24 (Tony Daniel NYCC exclusive) is the 1st appearance of
  // ABSOLUTE BATGIRL — same key-issue logic as #23, so it outranks the generic
  // bat-yellow palette. The palette is lifted off the cover: Batgirl's tan-orange
  // trench and the orange logo against Absolute Batman's cobalt armor.
  { match: ["absolute batman #24", "absolute batgirl"], theme: { accent: "#f26a21", accent2: "#2a5cc7", mood: "ABSOLUTE · 1ST BATGIRL", voice: "impact" } },
  { match: ["absolute batman", "batman"], theme: { accent: "#f5c518", accent2: "#3b4cca", mood: "GOTHAM AFTER DARK", voice: "impact" } },
  // Absolute Cassandra Cain: The Shadow's Hand #1 — Lady Shiva's daughter, raised
  // by the League of Assassins. Her title carries no "batman" keyword, so without
  // this she fell to the plain exclusives red/gold. Palette copies the Tony Daniel
  // cover: storm-crimson Gotham sky against blade-steel teal.
  { match: ["absolute cassandra cain", "cassandra cain"], theme: { accent: "#d92332", accent2: "#79c7d4", mood: "THE SHADOW'S HAND", voice: "blade" } },
  { match: ["godzilla"], theme: { accent: "#7cff4f", accent2: "#00b4ff", mood: "KAIJU HORROR" } },
  // Tampa Comic Con 300th-issue convention exclusives — these are NUMBERED variants,
  // not the 1:1000 one-of-one grail, so they must outrank the plain "300th issue" rule
  // below (which reads "ONE OF ONE") and carry treatment-accurate palettes instead.
  // Dale Altmann virgin foil: clean no-trade-dress art on metallic foil → turtle green
  // anchored by a chrome-foil sheen. Sukesha Ray color splash: vivid pop-color splash →
  // magenta splash over turtle green. Both are convention exclusives, not gallery
  // originals, so no serif.
  { match: ["dale altmann virgin foil"], theme: { accent: "#7ac70c", accent2: "#c3ccd9", mood: "VIRGIN FOIL · 300TH SPECIAL" } },
  { match: ["sukesha ray color splash"], theme: { accent: "#ff2d7e", accent2: "#7ac70c", mood: "COLOR SPLASH · 300TH SPECIAL" } },
  // Milestone-issue originals outrank the plain TMNT palette — gold-leaf prestige
  // over turtle green, so a 300th-issue one-of-one doesn't read like a shelf copy.
  { match: ["300th issue"], theme: { accent: "#ffc72c", accent2: "#7ac70c", mood: "300 ISSUES · ONE OF ONE", serif: true } },
  // Dale Altmann's NYCC exclusive Mirage facsimile (375 w/ COA) is a crimson
  // monochrome wash — Shredder and the four brothers rendered entirely in blood
  // red against black, with the logo knocked out in bone white. It outranks the
  // parchment Mirage rule below so the exclusive doesn't read like the standard
  // facsimile. Serif stays: it's still origin-issue prestige.
  // Fox Mask Killer's Altmann NYCC variant also contains "dale altmann nycc" — keep this above so it doesn't inherit the Mirage "375 COPIES" mood.
  { match: ["fox mask killer"], theme: { accent: "#ff6a1a", accent2: "#c1121f", mood: "FOX MASK SLASHER" } },
  { match: ["dale altmann nycc"], theme: { accent: "#c9202f", accent2: "#f2e4e0", mood: "NYCC EXCLUSIVE · 375 COPIES", serif: true } },
  // The 1984 Mirage first issue is the grail — all-red bandanas on stark black-and-white
  // newsprint. It gets Mirage red + aged-parchment + editorial serif so a facsimile of the
  // original reads as gallery prestige, not the cartoon-green shelf TMNT.
  { match: ["mirage facsimile", "mirage studios"], theme: { accent: "#e8192c", accent2: "#d8ccae", mood: "MIRAGE ORIGIN · 1984", serif: true } },
  { match: ["teenage mutant ninja turtles", "tmnt", "shredder"], theme: { accent: "#7ac70c", accent2: "#e8192c", mood: "MUTANT MAYHEM" } },
  { match: ["lobo"], theme: { accent: "#e8192c", accent2: "#c0c0c0", mood: "THE MAIN MAN" } },
  // The Demon #1 (Fede Mele NYCC foil exclusive) — Etrigan: yellow-skinned rhyming
  // hellspawn in a crimson suit. Palette is lifted straight off him — brimstone gold
  // against hellfire crimson — and the gold doubles as the foil sheen on the exclusive.
  // Keyed on "the demon #1" / "etrigan" so it can't swallow "demon's hand" or
  // "Demon in a Bottle" in other listings' copy.
  { match: ["the demon #1", "etrigan"], theme: { accent: "#f2b01e", accent2: "#8c1c13", mood: "RHYME OF THE DEMON", voice: "impact" } },
  { match: ["odin", "thor", "asgard"], theme: { accent: "#ffd700", accent2: "#00b4ff", mood: "REALM OF ASGARD" } },
  { match: ["exquisite corpses", "rascal randy"], theme: { accent: "#b026ff", accent2: "#00e0c6", mood: "SURREAL HORROR" } },
  { match: ["monster racing", "m1"], theme: { accent: "#ff6a00", accent2: "#00b4ff", mood: "MONSTER RACING LEAGUE" } },
  // SIKTC #50 (Jeff Monk + Santa Fung NYCC exclusives) is the landmark 50th issue, so it
  // outranks the generic SIKTC rule below. Both covers burn the same way: Monk's white
  // Erica silhouette against a rust-orange inferno, Fung's ember-lit machete with blood
  // drips. Palette = ember orange over blood crimson, with the blade serif for the machete.
  { match: ["something is killing the children #50"], theme: { accent: "#ff7a1a", accent2: "#b3121f", mood: "ISSUE #50 · RETURN TO VALMONT", voice: "blade" } },
  { match: ["something is killing the children", "sitkotc"], theme: { accent: "#ff2d2d", accent2: "#0e0e0e", mood: "MASK & MACHETE" } },
  // Crowbound (Lemire/Nguyen) is an ink-wash horror book: black crow, bone-white
  // sky, and a single thread of blood running down the cover. The palette copies
  // the cover exactly — blood-drip crimson against ink-wash ash — so the page
  // reads dystopian-horror instead of generic exclusive red/gold.
  { match: ["crowbound"], theme: { accent: "#c01526", accent2: "#cfd6dd", mood: "DARKNESS HAS A PRICE" } },
  { match: ["invincible"], theme: { accent: "#1f6fff", accent2: "#ffd21e", mood: "NOLAN'S SON" } },
  { match: ["spider"], theme: { accent: "#e8192c", accent2: "#1f6fff", mood: "WEB OF WORLDS" } },
  { match: ["usagi", "kaito"], theme: { accent: "#e0c56e", accent2: "#c0392b", mood: "RONIN'S PATH" } },
  { match: ["regicide"], theme: { accent: "#c8102e", accent2: "#8a8f98", mood: "THE KING MUST FALL" } },
  { match: ["quiet place"], theme: { accent: "#8fe04a", accent2: "#1a2a1a", mood: "MAKE NO SOUND" } },
  { match: ["savage"], theme: { accent: "#c0392b", accent2: "#e8b64c", mood: "ONLY THE SAVAGE" } },
  { match: ["lipwei chang virgin foil", "battle beast #12"], theme: { accent: "#e8b04a", accent2: "#8a1400", mood: "FOIL BLOODSPORT" } },
  { match: ["battle beast"], theme: { accent: "#ff7a00", accent2: "#7a1f00", mood: "BLOODSPORT" } },
  { match: ["white sky"], theme: { accent: "#dfe7ff", accent2: "#4a6cff", mood: "WHITE SKY" } },
  { match: ["archie"], theme: { accent: "#e8192c", accent2: "#ffd700", mood: "RIVERDALE" } },
  { match: ["sabrina"], theme: { accent: "#b026ff", accent2: "#ff6ad5", mood: "TEENAGE WITCH" } },
  { match: ["of the earth"], theme: { accent: "#d9a441", accent2: "#6b4f2a", mood: "OF THE EARTH", serif: true } },
  { match: ["wolverine"], theme: { accent: "#f5d000", accent2: "#1a3a8f", mood: "THE BEST THERE IS" } },
  { match: ["dazzler"], theme: { accent: "#ff4fd8", accent2: "#8a2be2", mood: "SOUND & LIGHT" } },
  { match: ["nyx"], theme: { accent: "#ff2fb0", accent2: "#6a2bd8", mood: "MUTANTS AFTER DARK" } },
  { match: ["x-men", "exceptional x-men"], theme: { accent: "#f8c600", accent2: "#1f6fff", mood: "THE X-MEN" } },
  { match: ["iron man"], theme: { accent: "#e8192c", accent2: "#ffd700", mood: "ARMORED AVENGER" } },
  { match: ["avengers", "illuminati"], theme: { accent: "#c0392b", accent2: "#ffd700", mood: "ASSEMBLE" } },
  { match: ["department of truth", "dept of truth"], theme: { accent: "#00e0c6", accent2: "#111111", mood: "DEPARTMENT OF TRUTH" } },
  { match: ["fallout"], theme: { accent: "#00e07a", accent2: "#111111", mood: "THE FALLOUT" } },
  { match: ["superior stand", "superior stash", "dynamic duo"], theme: { accent: "#00b4ff", accent2: "#ffd700", mood: "SUPERIOR DISPLAY" } },
  { match: ["battle", "war"], theme: { accent: "#ff7a00", accent2: "#111111", mood: "WAR IS HERE" } },
  // ---- Pokémon TCG (energy-type coded) ----
  { match: ["mega charizard", "charizard", "moltres"], theme: { accent: "#ff5722", accent2: "#ffcb05", mood: "FIRE TYPE" } },
  { match: ["blooming waters"], theme: { accent: "#2a75bb", accent2: "#ffcb05", mood: "WATER TYPE" } },
  { match: ["alakazam"], theme: { accent: "#b06cff", accent2: "#ffcb05", mood: "PSYCHIC TYPE" } },
  { match: ["team rocket"], theme: { accent: "#b3005e", accent2: "#111111", mood: "TEAM ROCKET" } },
  { match: ["silver tempest"], theme: { accent: "#9aa7b4", accent2: "#2a75bb", mood: "SILVER TEMPEST" } },
  { match: ["astral radiance"], theme: { accent: "#7b5cff", accent2: "#00e0c6", mood: "ASTRAL RADIANCE" } },
  { match: ["brilliant stars"], theme: { accent: "#ffcb05", accent2: "#2a75bb", mood: "BRILLIANT STARS" } },
  { match: ["celebrations", "30th anniversary"], theme: { accent: "#ffcb05", accent2: "#ff1c6b", mood: "CELEBRATIONS" } },
  { match: ["151"], theme: { accent: "#ff1c1c", accent2: "#ffcb05", mood: "KANTO 151" } },
];

// Collection fallbacks — used when no character keyword matches.
const COLLECTION_THEMES: Record<Collection, ProductTheme> = {
  exclusives: { accent: "#e8192c", accent2: "#ffd700", mood: "CBBST EXCLUSIVE" },
  graded: { accent: "#ffd700", accent2: "#1f6fff", mood: "CGC GRADED" },
  tcg: { accent: "#ffcb05", accent2: "#2a75bb", mood: "TCG · SEALED" },
  "original-art": { accent: "#d9a441", accent2: "#6b4f2a", mood: "ORIGINAL ART", serif: true },
  supplies: { accent: "#00b4ff", accent2: "#999999", mood: "DISPLAY GEAR" },
};

/**
 * Resolve a product's personality palette. Explicit `theme` wins; otherwise we
 * match the title against the character map, then fall back to the collection.
 * Always returns a complete theme so the page can render without null checks.
 */
export function getTheme(p: Product): Required<Pick<ProductTheme, "accent" | "accent2" | "mood">> & {
  serif: boolean;
  voice: ProductTheme["voice"];
} {
  const resolved =
    p.theme ??
    (() => {
      const t = (p.title || "").toLowerCase();
      const hit = CHARACTER_THEMES.find((c) => c.match.some((m) => t.includes(m)));
      return hit ? hit.theme : COLLECTION_THEMES[p.collection];
    })();
  // Hand-drawn one-of-ones keep their character palette but pick up the
  // editorial serif, so an original cover reads as gallery, not shelf stock.
  const original = (p.title || "").toLowerCase().includes("original cover art");
  return {
    accent: resolved.accent,
    accent2: resolved.accent2,
    mood: resolved.mood,
    serif: resolved.serif ?? original,
    voice: resolved.voice,
  };
}

// Title keywords → auto hero effect, so live-from-Shopify products get the
// treatment with no curated entry needed. (David 2026-07-29: every TMNT drop
// runs ninja shadows; Regicide runs ravens + rising red fog.)
const EFFECT_KEYWORDS: { match: string[]; effect: Product["effect"] }[] = [
  // Standing rule (David 2026-08-14): EVERY Batman title gets the bats effect —
  // no per-drop curation needed, any current or future Batman book inherits it.
  { match: ["batman"], effect: "bats" },
  // Cassandra Cain is a League of Assassins blade book, not a bat book — the
  // falling-shuriken rain fits her cover (katanas, rain, rooftops) better than bats.
  { match: ["cassandra cain"], effect: "ninja" },
  { match: ["teenage mutant ninja turtles", "tmnt", "shredder"], effect: "ninja" },
  { match: ["regicide"], effect: "ravens" },
  { match: ["crowbound"], effect: "ravens" },
  { match: ["battle beast"], effect: "embers" },
];

/**
 * Resolve a product's decorative hero effect. Explicit `effect` wins; otherwise
 * the title derives one from EFFECT_KEYWORDS (first hit wins).
 */
export function getEffect(p: Product): Product["effect"] {
  if (p.effect) return p.effect;
  const t = (p.title || "").toLowerCase();
  return EFFECT_KEYWORDS.find((e) => e.match.some((m) => t.includes(m)))?.effect;
}

/**
 * True when a product only gets a generic COLLECTION-level default (no explicit
 * `theme` and no character-map hit). The daily job flags these so a hand-tuned
 * palette can be added. Kept in sync with getTheme()'s resolution order.
 */
export function hasGenericTheme(p: Product): boolean {
  if (p.theme) return false;
  const t = (p.title || "").toLowerCase();
  return !CHARACTER_THEMES.some((c) => c.match.some((m) => t.includes(m)));
}
