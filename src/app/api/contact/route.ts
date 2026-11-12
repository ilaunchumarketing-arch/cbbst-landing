import { NextRequest, NextResponse } from "next/server";
import {
  SMS_CONSENT_DISCLOSURE,
  SMS_CONSENT_DISCLOSURE_VERSION,
  SMS_CONSENT_SOURCES,
} from "@/lib/smsConsent";

const GHL_BASE = "https://services.leadconnectorhq.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact-form intake for cbbst.com.
 *
 * Writes the message into the CBBST GoHighLevel sub-account and records the
 * A2P 10DLC SMS-consent evidence as its own set of contact fields:
 * boolean, timestamp, page/form source, disclosure version, phone, and IP.
 *
 * Consent is NEVER inferred. A visitor who leaves the SMS box unchecked is
 * upserted with SMS DND switched ON, so no workflow can text them even by
 * accident, and none of the consent fields are written.
 */
const CONSENT_FIELD_IDS = {
  smsConsent: "vObTx4a1EUklKcs5bn4S", // contact.sms_consent (CHECKBOX, option "Yes")
  timestamp: "Hrd5OvahLr7MrqUK0uAs", // contact.sms_consent_timestamp
  source: "LeGOQFOcODuQA5uuVSvx", // contact.sms_consent_source
  disclosureVersion: "00DkEY745qajo4c847QA", // contact.sms_consent_disclosure_version
  phone: "Q8SCiDqAMrUL8QvfnFzV", // contact.sms_consent_phone
  ip: "MVwNdTNqf8UJoYoq13LF", // contact.sms_consent_ip
} as const;

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  smsConsent?: boolean;
};

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phone = (body.phone ?? "").trim();
  const message = (body.message ?? "").trim();
  // Consent must arrive as a literal true. Anything else = no consent.
  const smsConsent = body.smsConsent === true && phone.length > 0;

  if (!name) return NextResponse.json({ error: "Enter your name" }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  if (!message) return NextResponse.json({ error: "Enter a message" }, { status: 400 });

  const locationId = process.env.GHL_CBBST_LOCATION_ID;
  const pit = process.env.GHL_CBBST_PIT;
  if (!locationId || !pit) {
    console.error("contact: GHL_CBBST_LOCATION_ID / GHL_CBBST_PIT not configured");
    return NextResponse.json({ error: "Messaging is temporarily unavailable" }, { status: 503 });
  }

  const now = new Date().toISOString();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "";
  const { firstName, lastName } = splitName(name);

  const tags = ["website-contact"];
  const customFields: { id: string; field_value: string | string[] }[] = [];

  if (smsConsent) {
    tags.push("sms-consent");
    customFields.push(
      { id: CONSENT_FIELD_IDS.smsConsent, field_value: ["Yes"] },
      { id: CONSENT_FIELD_IDS.timestamp, field_value: now },
      { id: CONSENT_FIELD_IDS.source, field_value: SMS_CONSENT_SOURCES.contact },
      { id: CONSENT_FIELD_IDS.disclosureVersion, field_value: SMS_CONSENT_DISCLOSURE_VERSION },
      { id: CONSENT_FIELD_IDS.phone, field_value: phone },
      { id: CONSENT_FIELD_IDS.ip, field_value: ip },
    );
  }

  const payload: Record<string, unknown> = {
    locationId,
    firstName,
    lastName,
    name,
    email,
    tags,
    source: SMS_CONSENT_SOURCES.contact,
    customFields,
    // Unchecked box => hard SMS block on the contact record itself.
    dndSettings: {
      SMS: smsConsent
        ? { status: "inactive", code: "sms-consent-given", message: SMS_CONSENT_DISCLOSURE_VERSION }
        : { status: "active", code: "no-sms-consent", message: "No SMS opt-in captured" },
    },
  };
  if (phone) payload.phone = phone;

  const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("contact: GHL upsert failed", res.status, await res.text());
    return NextResponse.json({ error: "Something went wrong — try again" }, { status: 502 });
  }

  const upserted = (await res.json()) as { contact?: { id?: string } };
  const contactId = upserted.contact?.id;

  // The message body + a verbatim copy of the disclosure the visitor saw.
  if (contactId) {
    const consentLine = smsConsent
      ? `SMS CONSENT: YES (${now}, ${SMS_CONSENT_SOURCES.contact}, disclosure ${SMS_CONSENT_DISCLOSURE_VERSION}, phone ${phone}, ip ${ip || "n/a"})\nDisclosure shown: "${SMS_CONSENT_DISCLOSURE}"`
      : "SMS CONSENT: NO — do not text this contact.";
    const note = await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pit}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: `Website contact form (${now})\nPhone: ${phone || "not provided"}\n\n${message}\n\n---\n${consentLine}`,
      }),
    });
    if (!note.ok) console.error("contact: note failed", note.status, await note.text());
  }

  return NextResponse.json({ ok: true });
}
