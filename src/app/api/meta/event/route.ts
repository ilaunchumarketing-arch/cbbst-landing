import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;
const TEST_CODE = process.env.META_TEST_EVENT_CODE;

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function firstIp(header: string | null): string | undefined {
  if (!header) return undefined;
  return header.split(",")[0]?.trim();
}

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    return NextResponse.json({ ok: false, reason: "missing_config" }, { status: 500 });
  }

  let body: {
    event_name?: string;
    event_id?: string;
    event_source_url?: string;
    custom_data?: Record<string, unknown>;
    email?: string;
    phone?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }
  if (!body.event_name) {
    return NextResponse.json({ ok: false, reason: "missing_event_name" }, { status: 400 });
  }
  if (!body.event_id) {
    return NextResponse.json({ ok: false, reason: "missing_event_id" }, { status: 400 });
  }

  const h = req.headers;
  const userData: Record<string, unknown> = {
    client_ip_address: firstIp(h.get("x-forwarded-for") ?? h.get("x-real-ip")),
    client_user_agent: h.get("user-agent") ?? undefined,
    fbc: req.cookies.get("_fbc")?.value,
    fbp: req.cookies.get("_fbp")?.value,
  };
  if (body.email) userData.em = [sha256(body.email)];
  if (body.phone) userData.ph = [sha256(body.phone)];

  const event = {
    event_name: body.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: body.event_id,
    event_source_url: body.event_source_url,
    action_source: "website",
    user_data: userData,
    custom_data: body.custom_data ?? {},
  };

  const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(CAPI_TOKEN)}`;
  const payload: Record<string, unknown> = { data: [event] };
  if (TEST_CODE) payload.test_event_code = TEST_CODE;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    return NextResponse.json({ ok: res.ok, meta: json }, { status: res.ok ? 200 : 502 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, reason: "upstream_error", error: String(err) },
      { status: 502 }
    );
  }
}
