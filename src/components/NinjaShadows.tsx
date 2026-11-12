"use client";

/**
 * Falling ninja stars for TMNT drops (v2 — David killed the runner silhouettes,
 * 2026-07-29: "falling ninja stars"). Spinning steel shuriken rain down the hero
 * on staggered loops: near ones big + fast + sharp, far ones small + slow +
 * faint, each with a toxic-green glint and a slim speed streak. Scoped to
 * products that resolve `effect: "ninja"` (every TMNT / Shredder title via
 * getEffect). Pointer-events-none, aria-hidden, and fully paused under
 * prefers-reduced-motion (see .shuriken-fall rules in globals.css).
 */

// Deterministic pseudo-random (same on server + client → no hydration mismatch).
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const COUNT = 16;
const STARS = Array.from({ length: COUNT }, (_, i) => {
  const depth = rnd(i, 1); // 0 = far, 1 = near
  return {
    left: `${Math.round(2 + rnd(i, 2) * 96)}%`,
    size: Math.round(14 + depth * 34), // 14–48px
    opacity: +(0.35 + depth * 0.55).toFixed(2),
    dur: +(6.5 - depth * 3.8).toFixed(2), // near = fast (≈2.7s), far = slow (≈6.5s)
    delay: +(rnd(i, 3) * 7).toFixed(2),
    drift: Math.round((rnd(i, 4) - 0.5) * 140), // slight sideways slice
    spin: +(0.5 + rnd(i, 5) * 0.8).toFixed(2), // rev speed
    spinDir: rnd(i, 6) > 0.5 ? 1 : -1,
  };
});

/** Four-blade steel shuriken — two offset stars give the blades a beveled read. */
function Star({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="shuriken-star">
      <path
        d="M20 0 L24.5 15.5 L40 20 L24.5 24.5 L20 40 L15.5 24.5 L0 20 L15.5 15.5 Z"
        fill="#8a96a3"
      />
      <path
        d="M20 6 L23 17 L34 20 L23 23 L20 34 L17 23 L6 20 L17 17 Z"
        fill="#cfd8e0"
      />
      <circle cx="20" cy="20" r="4" fill="#1a2129" />
      <circle cx="20" cy="20" r="1.6" fill="#05080d" />
    </svg>
  );
}

export default function NinjaShadows() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[6]" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="shuriken-fall absolute top-[-80px] flex flex-col items-center"
          style={
            {
              left: s.left,
              "--fall-dur": `${s.dur}s`,
              "--fall-delay": `${s.delay}s`,
              "--fall-drift": `${s.drift}px`,
              "--fall-op": s.opacity,
            } as React.CSSProperties
          }
        >
          {/* speed streak above the star */}
          <span
            className="block w-[2px]"
            style={{
              height: `${Math.round(s.size * 1.5)}px`,
              background: "linear-gradient(to top, rgba(122,199,12,0.55), transparent)",
            }}
          />
          <span
            className="shuriken-spin block"
            style={
              {
                "--spin-dur": `${s.spin}s`,
                "--spin-to": `${s.spinDir * 360}deg`,
              } as React.CSSProperties
            }
          >
            <Star size={s.size} />
          </span>
        </span>
      ))}
    </div>
  );
}
