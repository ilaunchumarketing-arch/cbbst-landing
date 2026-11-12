import { NextRequest, NextResponse } from "next/server";

const GHL_UPSERT_URL = "https://services.leadconnectorhq.com/contacts/upsert";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Drop-alerts signup. Upserts the subscriber into the CBBST GoHighLevel
 * sub-account tagged `drop-alerts`, so every new drop can be announced via a
 * GHL email workflow. Used by the homepage DropModal popup and the footer
 * Newsletter form (`source` tells them apart).
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const locationId = process.env.GHL_CBBST_LOCATION_ID;
  const pit = process.env.GHL_CBBST_PIT;
  if (!locationId || !pit) {
    console.error("subscribe: GHL_CBBST_LOCATION_ID / GHL_CBBST_PIT not configured");
    return NextResponse.json({ error: "Signup is temporarily unavailable" }, { status: 503 });
  }

  const source =
    body.source === "newsletter" ? "cbbst.com newsletter section" : "cbbst.com drop popup";

  const res = await fetch(GHL_UPSERT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      locationId,
      email,
      tags: ["drop-alerts", "website-signup"],
      source,
    }),
  });

  if (!res.ok) {
    console.error("subscribe: GHL upsert failed", res.status, await res.text());
    return NextResponse.json({ error: "Something went wrong — try again" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
