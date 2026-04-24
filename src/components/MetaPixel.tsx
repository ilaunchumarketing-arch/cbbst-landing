"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID || typeof window === "undefined") return;
    window.fbq?.("track", "PageView");
  }, []);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

function genEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const rand = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${rand}`;
}

export type TrackEventArgs = {
  name: "Lead" | "ViewContent" | "InitiateCheckout" | "Schedule" | "AddToCart";
  value?: number;
  currency?: string;
  contentName?: string;
  contentIds?: string[];
  contentCategory?: string;
};

/** Fire a browser pixel event AND forward to CAPI (dedup via event_id). */
export async function trackEvent(args: TrackEventArgs) {
  if (typeof window === "undefined") return;
  const eventId = genEventId();
  const payload = {
    value: args.value,
    currency: args.currency ?? "USD",
    content_name: args.contentName,
    content_ids: args.contentIds,
    content_category: args.contentCategory,
  };

  try {
    window.fbq?.("track", args.name, payload, { eventID: eventId });
  } catch {}

  try {
    await fetch("/api/meta/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event_name: args.name,
        event_id: eventId,
        event_source_url: window.location.href,
        custom_data: payload,
      }),
    });
  } catch {}
}
