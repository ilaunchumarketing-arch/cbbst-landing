import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export const runtime = "nodejs";

/**
 * Shopify webhook → instant catalog refresh.
 * Point Shopify product create/update/delete webhooks at:
 *   https://<site>/api/revalidate?secret=<REVALIDATE_SECRET>
 * Verified by the URL secret (and/or Shopify HMAC if SHOPIFY_WEBHOOK_SECRET is set).
 * On a valid hit it invalidates every "shopify"-tagged fetch, so the next page view
 * reflects the change immediately — prices, products, stock, variants.
 */
export async function POST(req: Request) {
  const urlSecret = new URL(req.url).searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;
  const body = await req.text();

  let authorized = false;

  // 1) URL secret token (primary — simple to configure in Shopify).
  if (expected && urlSecret && urlSecret === expected) authorized = true;

  // 2) OR Shopify HMAC signature (if a signing secret is configured).
  if (!authorized) {
    const hmac = req.headers.get("x-shopify-hmac-sha256");
    const signing = process.env.SHOPIFY_WEBHOOK_SECRET;
    if (hmac && signing) {
      const digest = crypto.createHmac("sha256", signing).update(body, "utf8").digest("base64");
      const a = Buffer.from(digest);
      const b = Buffer.from(hmac);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) authorized = true;
    }
  }

  if (!authorized) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // Invalidate ALL cached data for the whole storefront (every product +
  // collection page, including the Shopify catalog fetches) so a Shopify edit —
  // new product, price, stock, variant — shows on the very next page view.
  // revalidatePath("/", "layout") covers the entire app; updates are infrequent
  // (manual edits), so a full refresh is cheap and bulletproof.
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: true });
}

// Lightweight health check (no secret needed) so you can confirm the endpoint is live.
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "revalidate", configured: Boolean(process.env.REVALIDATE_SECRET) });
}
