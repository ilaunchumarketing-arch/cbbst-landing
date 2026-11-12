"use client";

import { useEffect, useState } from "react";

// The drop's go-live moment. Before it → live countdown; after it → "LIVE NOW".
// Change this one line to set the exact launch time (ISO 8601 with timezone).
export const DROP_LAUNCH = "2026-08-14T17:00:00-04:00";

/**
 * Renders the drop badge text: a live countdown before launch that automatically
 * flips to "LIVE NOW" the moment DROP_LAUNCH passes — no manual edit needed.
 */
export default function DropStatus({ name, compact = false }: { name: string; compact?: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const launch = new Date(DROP_LAUNCH).getTime();

  // Compact form: a short label for the homepage hero card (no product name).
  if (compact) {
    if (now === null) return <>DROPS TODAY</>;
    if (now >= launch) return <>LIVE NOW</>;
    const diff = launch - now;
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    const countdown = h > 0 ? `${h}H ${m}M` : `${m}M ${s}S`;
    return <>LIVE IN {countdown}</>;
  }

  // First render (server + client hydration) is deterministic → no mismatch.
  if (now === null) return <>NEW DROP · {name} — LIVE TODAY</>;

  if (now >= launch) return <>{name} — LIVE NOW</>;

  const diff = launch - now;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const countdown = h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
  return <>NEW DROP · {name} — LIVE IN {countdown}</>;
}
