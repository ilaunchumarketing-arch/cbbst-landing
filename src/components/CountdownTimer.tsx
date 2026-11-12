"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DROP_LAUNCH } from "./DropStatus";

/**
 * Big, visible countdown card on the homepage hero, for whatever the newest drop is —
 * the name/href are passed down from getHeroDrops(), never hardcoded to one book. Counts
 * down to DROP_LAUNCH (the single source of truth shared with the badge + hero card) and
 * automatically flips to a "LIVE NOW" call-to-action the moment it passes — no edit.
 *
 * First paint renders placeholder dashes (deterministic) so server + client
 * hydration always match; the per-second interval then fills in real values.
 */
export default function CountdownTimer({
  name,
  href,
  voiceFont,
  accent,
}: {
  name?: string;
  href?: string;
  /** The selected book's display typeface (see VOICE_FONT in HeroSection). */
  voiceFont?: string;
  /** The selected book's accent colour. */
  accent?: string;
}) {
  const label = name || "THE NEWEST EXCLUSIVE";
  const target = href || "/exclusives";
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const launch = new Date(DROP_LAUNCH).getTime();
  const live = now !== null && now >= launch;
  const total = now === null ? null : Math.max(0, launch - now);

  const pad = (n: number) => String(n).padStart(2, "0");
  const cell = (v: number | null) => (v === null ? "--" : pad(v));

  let units: { v: number | null; l: string }[];
  if (total === null) {
    units = [
      { v: null, l: "HRS" },
      { v: null, l: "MIN" },
      { v: null, l: "SEC" },
    ];
  } else {
    const d = Math.floor(total / 86_400_000);
    const h = Math.floor((total % 86_400_000) / 3_600_000);
    const m = Math.floor((total % 3_600_000) / 60_000);
    const s = Math.floor((total % 60_000) / 1000);
    units =
      d > 0
        ? [
            { v: d, l: "DAYS" },
            { v: h, l: "HRS" },
            { v: m, l: "MIN" },
            { v: s, l: "SEC" },
          ]
        : [
            { v: h, l: "HRS" },
            { v: m, l: "MIN" },
            { v: s, l: "SEC" },
          ];
  }

  return (
    <Link
      href={target}
      className="group block mt-6 max-w-lg border border-cbbst-red/40 bg-black/60 backdrop-blur-sm hover:border-cbbst-red transition-colors animate-fade-in delay-200"
    >
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cbbst-red opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cbbst-red" />
          </span>
          <span className="drop-fade text-[10px] font-black tracking-[0.3em]" style={{ color: accent }}>
            {live ? "DROP IS LIVE" : `${label} DROPS TODAY`}
          </span>
        </div>

        {live ? (
          <div className="flex items-center justify-between gap-3">
            <span
              key={label}
              className={`text-white tracking-tight animate-fade-in [text-wrap:balance] ${
                voiceFont ? "" : "font-black italic"
              } ${label.length > 34 ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"}`}
              style={{ fontFamily: voiceFont, fontWeight: voiceFont ? 700 : undefined }}
            >
              {label} — <span className="text-cbbst-gold">LIVE NOW</span>
            </span>
            <span className="text-cbbst-gold text-sm font-black tracking-[0.25em] whitespace-nowrap">
              SHOP →
            </span>
          </div>
        ) : (
          <div className="flex items-end gap-3 sm:gap-4">
            {units.map((u, i) => (
              <div key={u.l} className="flex items-end gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-white font-black text-4xl sm:text-5xl leading-none tracking-tight [font-variant-numeric:tabular-nums]">
                    {cell(u.v)}
                  </div>
                  <div className="text-white/45 text-[9px] font-black tracking-[0.25em] mt-1.5">{u.l}</div>
                </div>
                {i < units.length - 1 && (
                  <span className="text-cbbst-red/70 font-black text-3xl sm:text-4xl leading-none pb-4">:</span>
                )}
              </div>
            ))}
          </div>
        )}

        {!live && (
          <div className="inline-flex items-center gap-1 text-cbbst-gold text-[11px] font-black tracking-[0.25em] mt-4">
            RESERVE YOURS
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        )}
      </div>
    </Link>
  );
}
