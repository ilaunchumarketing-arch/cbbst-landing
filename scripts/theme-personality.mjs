#!/usr/bin/env node
/**
 * CBBST · Daily "product personality" detector
 * ------------------------------------------------------------------
 * Read-ONLY audit that powers the daily landing-page-personality job.
 *
 * It NEVER touches live Shopify (read-only Storefront API only) and it
 * NEVER writes to products.ts — it just tells you which products still
 * need a hand-tuned personality so the nightly job (or you) can add one.
 *
 * What it reports:
 *   1. NEW products    — live handles not seen on the last run (the day's work)
 *   2. UNCURATED       — live products with no explicit entry in products.ts
 *                        (they still get an auto-derived theme, but a curated
 *                        story/creators/highlights entry makes them shine)
 *   3. GENERIC THEME   — live titles that match no character keyword, so they
 *                        fall back to a plain collection-default palette
 *
 * Usage:
 *   node scripts/theme-personality.mjs            # human report
 *   node scripts/theme-personality.mjs --json     # machine-readable
 *   node scripts/theme-personality.mjs --write-manifest  # persist seen handles
 *
 * Reads SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_TOKEN from .env.local.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST = join(__dirname, ".theme-manifest.json");
const PRODUCTS_TS = join(ROOT, "src", "data", "products.ts");

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const writeManifest = args.includes("--write-manifest");

// ---- env (read-only Storefront token) --------------------------------------
function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env"]) {
    const p = join(ROOT, file);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, "");
    }
  }
  return env;
}
const env = loadEnv();
const DOMAIN = env.SHOPIFY_STORE_DOMAIN;
const TOKEN = env.SHOPIFY_STOREFRONT_TOKEN;
if (!DOMAIN || !TOKEN) {
  console.error("Missing SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN in .env.local");
  process.exit(1);
}

// ---- pull the full live catalog (read-only) --------------------------------
async function fetchAllProducts() {
  const out = [];
  let cursor = null;
  for (let page = 0; page < 20; page++) {
    const query = `{
      products(first: 250${cursor ? `, after: "${cursor}"` : ""}, sortKey: CREATED_AT, reverse: true) {
        edges { cursor node { handle title productType createdAt totalInventory tags } }
        pageInfo { hasNextPage }
      }
    }`;
    const res = await fetch(`https://${DOMAIN}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": TOKEN },
      body: JSON.stringify({ query }),
    });
    const json = await res.json();
    const conn = json?.data?.products;
    if (!conn) throw new Error("Storefront API error: " + JSON.stringify(json).slice(0, 300));
    for (const e of conn.edges) {
      out.push(e.node);
      cursor = e.cursor;
    }
    if (!conn.pageInfo.hasNextPage) break;
  }
  return out.filter((p) => p.handle && p.handle !== "draft");
}

// ---- character keyword table (kept in sync with products.ts getTheme) ------
// If you add a keyword group in products.ts CHARACTER_THEMES, mirror it here so
// "generic theme" detection stays accurate. This is the ONLY duplicated list.
const CHARACTER_KEYWORDS = [
  "harley", "absolute batman #23", "absolute clayface", "absolute batman #24", "absolute batgirl",
  "absolute batman", "batman", "absolute cassandra cain", "cassandra cain", "godzilla", "teenage mutant ninja turtles", "tmnt",
  "shredder", "mirage facsimile", "mirage studios", "lobo", "odin", "thor", "asgard", "fox mask killer", "exquisite corpses", "rascal randy",
  "the demon #1", "etrigan", "monster racing", "m1", "something is killing the children #50", "something is killing the children","sitkotc", "crowbound", "invincible",
  "spider", "usagi", "kaito", "regicide", "quiet place", "savage", "battle beast", "white sky", "archie",
  "dale altmann virgin foil", "dale altmann nycc", "sukesha ray color splash", "300th issue",
  "lipwei chang virgin foil", "battle beast #12",
  "sabrina", "of the earth", "wolverine", "dazzler", "nyx", "x-men", "exceptional x-men", "iron man",
  "avengers", "illuminati", "department of truth", "dept of truth", "fallout",
  "superior stand", "superior stash", "dynamic duo", "battle", "war",
  "mega charizard", "charizard", "moltres", "blooming waters", "alakazam", "team rocket",
  "silver tempest", "astral radiance", "brilliant stars", "celebrations", "30th anniversary", "151",
];
const hasCharacterTheme = (title) => {
  const t = (title || "").toLowerCase();
  return CHARACTER_KEYWORDS.some((k) => t.includes(k));
};

// ---- curated slugs/handles already in products.ts --------------------------
function curatedHandles() {
  const src = readFileSync(PRODUCTS_TS, "utf8");
  const set = new Set();
  for (const m of src.matchAll(/^\s*(?:slug|shopifyHandle):\s*"([^"]+)"/gm)) set.add(m[1]);
  return set;
}

// ---- manifest of previously-seen handles -----------------------------------
function loadManifest() {
  if (!existsSync(MANIFEST)) return { handles: [], updatedAt: null };
  try {
    return JSON.parse(readFileSync(MANIFEST, "utf8"));
  } catch {
    return { handles: [], updatedAt: null };
  }
}

// ---- run --------------------------------------------------------------------
const live = await fetchAllProducts();
const curated = curatedHandles();
const manifest = loadManifest();
const seen = new Set(manifest.handles);

const isFirstRun = seen.size === 0;
const newProducts = isFirstRun ? [] : live.filter((p) => !seen.has(p.handle));
const uncurated = live.filter((p) => !curated.has(p.handle));
const genericTheme = live.filter((p) => !curated.has(p.handle) && !hasCharacterTheme(p.title));

const report = {
  scannedAt: new Date().toISOString(),
  domain: DOMAIN,
  liveCount: live.length,
  firstRun: isFirstRun,
  newProducts: newProducts.map((p) => ({ handle: p.handle, title: p.title, collection: p.productType, createdAt: p.createdAt })),
  uncuratedCount: uncurated.length,
  uncurated: uncurated.map((p) => ({ handle: p.handle, title: p.title })),
  genericThemeCount: genericTheme.length,
  genericTheme: genericTheme.map((p) => ({ handle: p.handle, title: p.title })),
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const line = "─".repeat(60);
  console.log(`\n${line}\nCBBST · Product Personality Audit — ${report.scannedAt.slice(0, 10)}\n${line}`);
  console.log(`Live products: ${report.liveCount}   (curated in products.ts: ${curated.size})`);
  if (isFirstRun) {
    console.log(`\n⚑ First run — establishing baseline manifest (no "new" diff this run).`);
  } else if (newProducts.length) {
    console.log(`\n🆕 NEW since last run (${newProducts.length}) — theme these today:`);
    for (const p of report.newProducts) console.log(`   • ${p.handle}  —  ${p.title}`);
  } else {
    console.log(`\n✓ No new products since last run.`);
  }
  if (report.genericThemeCount) {
    console.log(`\n🎨 GENERIC THEME (${report.genericThemeCount}) — no character match, add a tuned palette:`);
    for (const p of report.genericTheme.slice(0, 40)) console.log(`   • ${p.handle}  —  ${p.title}`);
    if (report.genericThemeCount > 40) console.log(`   … and ${report.genericThemeCount - 40} more`);
  }
  console.log(`\n${line}`);
  console.log(writeManifest ? "Manifest updated." : "Run with --write-manifest to record this run's baseline.");
  console.log(line + "\n");
}

if (writeManifest) {
  writeFileSync(MANIFEST, JSON.stringify({ handles: live.map((p) => p.handle), updatedAt: report.scannedAt }, null, 2));
}
