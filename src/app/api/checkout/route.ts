import { NextResponse } from "next/server";
import { shopifyConfigured, resolveVariantSmart, createCheckoutUrl } from "@/lib/shopify";

export const runtime = "nodejs";

type IncomingItem = { handle: string; title?: string; variant?: string; qty: number };

/**
 * Build a Shopify cart from the local cart and return its hosted checkout URL.
 * Responds 501 { configured: false } when Shopify isn't wired yet, so the client
 * can fall back to the demo checkout. The live store/theme is never touched.
 */
export async function POST(req: Request) {
  if (!shopifyConfigured) {
    // Not wired yet — 200 so the client cleanly falls back to the demo checkout (no console error).
    return NextResponse.json({ configured: false });
  }

  let items: IncomingItem[];
  try {
    ({ items } = (await req.json()) as { items: IncomingItem[] });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  try {
    const lines: { merchandiseId: string; quantity: number }[] = [];
    for (const it of items) {
      const id = await resolveVariantSmart(it.handle, it.title, it.variant);
      if (!id) {
        return NextResponse.json(
          { error: `Not found in Shopify: ${it.handle}` },
          { status: 422 }
        );
      }
      lines.push({ merchandiseId: id, quantity: Math.max(1, Math.floor(it.qty || 1)) });
    }
    const checkoutUrl = await createCheckoutUrl(lines);
    return NextResponse.json({ configured: true, checkoutUrl });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
