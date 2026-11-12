"use client";

/**
 * Decorative bats that flutter up and out of the hero. Scoped to Batman drops
 * (rendered only when a product sets `effect: "bats"`). Pointer-events-none and
 * paused under prefers-reduced-motion (see .bat rules in globals.css).
 */

// Spread-wing bat silhouette
const BAT_D =
  "M256 168c-12 0-22 8-28 19-15-23-39-38-66-38-21 0-40 10-52 26 7-3 14-4 22-4 3 0 6 0 9 1-17 7-30 22-33 40 11-14 28-23 47-23h4c-13 8-21 22-21 38 0 3 0 6 1 9 8-22 28-38 53-38 11 0 21 5 28 11l29 24 29-24c8-6 18-11 28-11 25 0 45 16 53 38 1-3 1-6 1-9 0-16-8-30-21-38h4c19 0 36 9 47 23-3-18-16-33-33-40 3-1 6-1 9-1 8 0 15 1 22 4-12-16-31-26-52-26-27 0-51 15-66 38-6-11-16-19-28-19z";

type Bat = { left: string; size: number; delay: number; dur: number; drift: number; tilt: number };

// Deterministic pseudo-random (same on server + client → no hydration mismatch).
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// A full swarm that erupts from over the cover and fans up + outward. Tight launch
// window (delays 0–2.2s) so it reads as "a bunch of bats flying out at once".
const COUNT = 40;
const BATS: Bat[] = Array.from({ length: COUNT }, (_, i) => {
  const center = 50; // spread across the full width of the cover
  const spread = Math.round((rnd(i, 1) - 0.5) * 84 * 100) / 100; // -42%..42% around center
  return {
    left: `${center + spread}%`,
    size: Math.round(34 + rnd(i, 2) * 44), // 34–78px (then scales up to ~2.3x mid-flight)
    delay: +(rnd(i, 3) * 0.5).toFixed(2), // 0–0.5s → one tight rush
    dur: +(1.2 + rnd(i, 4) * 0.9).toFixed(2), // 1.2–2.1s → fast
    drift: Math.round(spread * 3 + (rnd(i, 5) - 0.5) * 280), // wide outward fan
    tilt: Math.round((rnd(i, 6) - 0.5) * 38), // -19..19deg
  };
});

export default function FlyingBats({ baseDelay = 0 }: { baseDelay?: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 -top-[60%] overflow-hidden z-20" aria-hidden="true">
      {BATS.map((b, i) => (
        <span
          key={i}
          className="bat absolute bottom-[-48px]"
          style={
            {
              left: b.left,
              animationDelay: `${(baseDelay + b.delay).toFixed(2)}s`,
              animationDuration: `${b.dur}s`,
              "--bat-drift": `${b.drift}px`,
            } as React.CSSProperties
          }
        >
          <span className="block" style={{ transform: `rotate(${b.tilt}deg)` }}>
            <svg
              className="bat-wing"
              width={b.size}
              height={b.size * 0.62}
              viewBox="0 0 512 320"
              style={{ animationDelay: `${(baseDelay + b.delay).toFixed(2)}s` }}
            >
              <path d={BAT_D} fill="#05080d" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
