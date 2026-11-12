import { NextResponse } from "next/server";
import { adminConfigured, lookupOrder } from "@/lib/shopify-admin";

export const runtime = "nodejs";

/**
 * Guest order tracking: look up an order by number + checkout email.
 *
 * - 200 { available: false }  → Admin API not configured yet (client shows a
 *   "email support" message; never a dead button).
 * - 200 { found: false }      → no order matches that number + email.
 * - 200 { found: true, order } → the order, with fulfillment + tracking.
 */
export async function POST(req: Request) {
  if (!adminConfigured) {
    return NextResponse.json({ available: false });
  }

  let orderNumber: string;
  let email: string;
  try {
    ({ orderNumber, email } = (await req.json()) as { orderNumber: string; email: string });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!orderNumber?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Order number and email are both required." }, { status: 400 });
  }

  try {
    const order = await lookupOrder(orderNumber, email);
    if (!order) {
      return NextResponse.json({ available: true, found: false });
    }
    return NextResponse.json({ available: true, found: true, order });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
