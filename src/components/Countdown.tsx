"use client";

import { useEffect, useState } from "react";

type Props = {
  targetISO: string;
  label?: string;
};

type Parts = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function diff(targetMs: number): Parts {
  const now = Date.now();
  const delta = Math.max(0, targetMs - now);
  const days = Math.floor(delta / 86_400_000);
  const hours = Math.floor((delta % 86_400_000) / 3_600_000);
  const minutes = Math.floor((delta % 3_600_000) / 60_000);
  const seconds = Math.floor((delta % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: delta === 0 };
}

export default function Countdown({ targetISO, label = "DROP STARTS IN" }: Props) {
  const targetMs = new Date(targetISO).getTime();
  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState<Parts>({ days: 0, hours: 0, minutes: 0, seconds: 0, done: false });

  useEffect(() => {
    setMounted(true);
    setParts(diff(targetMs));
    const id = setInterval(() => setParts(diff(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (parts.done) {
    return (
      <div className="inline-flex items-center gap-3 bg-cbbst-red px-6 py-3 animate-pulse">
        <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
        <span className="text-white font-black text-sm tracking-[0.25em]">LIVE NOW ON WHATNOT</span>
      </div>
    );
  }

  const cells: Array<[string, number]> = [
    ["DAYS", parts.days],
    ["HOURS", parts.hours],
    ["MINUTES", parts.minutes],
    ["SECONDS", parts.seconds],
  ];

  return (
    <div>
      <div className="text-cbbst-red text-[10px] font-black tracking-[0.35em] mb-3">{label}</div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md">
        {cells.map(([k, v]) => (
          <div
            key={k}
            className="relative bg-black border border-white/10 p-3 sm:p-4 text-center"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-cbbst-gold/60" />
            <div className="text-cbbst-gold font-black text-2xl sm:text-4xl tabular-nums leading-none">
              {mounted ? v.toString().padStart(2, "0") : "--"}
            </div>
            <div className="text-white/50 text-[9px] sm:text-[10px] font-bold tracking-[0.25em] mt-2">
              {k}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
