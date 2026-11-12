"use client";

/**
 * Ravens + rising red fog for Regicide drops — black corvids beat across the
 * upper hero on staggered loops while blood-red fog banks drift up from the
 * bottom edge. Scoped to products that resolve `effect: "ravens"` (Regicide
 * titles via getEffect). Pointer-events-none, aria-hidden, and fully paused
 * under prefers-reduced-motion (see .raven / .fog-puff rules in globals.css).
 */

// Deterministic pseudo-random (same on server + client → no hydration mismatch).
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const INK = "#05080d";
const BLOOD = "200, 16, 46"; // #c8102e

// Wings-raised corvid silhouette (reads at small sizes; flap = vertical squash).
const RAVEN_D =
  "M60 45 C 45 20, 20 12, 4 18 C 22 22, 34 32, 42 45 C 30 48, 22 54, 18 62 C 30 58, 44 56, 54 58 L 50 70 L 60 62 L 70 70 L 66 58 C 76 56, 90 58, 102 62 C 98 54, 90 48, 78 45 C 86 32, 98 22, 116 18 C 100 12, 75 20, 60 45 Z";

const RAVEN_COUNT = 9;
const RAVENS = Array.from({ length: RAVEN_COUNT }, (_, i) => {
  const depth = rnd(i, 1); // 0 = far, 1 = near
  return {
    size: Math.round(22 + depth * 40), // 22–62px
    top: `${Math.round(6 + rnd(i, 2) * 52)}%`, // upper sky
    opacity: +(0.4 + depth * 0.5).toFixed(2),
    dur: +(7 + rnd(i, 3) * 8).toFixed(2), // 7–15s per crossing
    delay: +(rnd(i, 4) * 10).toFixed(2),
    dir: rnd(i, 5) > 0.5 ? 1 : -1,
    flap: +(0.22 + rnd(i, 6) * 0.16).toFixed(2),
  };
});

const FOG_COUNT = 6;
const FOG = Array.from({ length: FOG_COUNT }, (_, i) => ({
  left: `${Math.round(-10 + rnd(i, 7) * 100)}%`,
  width: Math.round(280 + rnd(i, 8) * 320), // 280–600px banks
  dur: +(9 + rnd(i, 9) * 8).toFixed(2), // slow, mournful rise
  delay: +(rnd(i, 10) * 9).toFixed(2),
  drift: Math.round((rnd(i, 11) - 0.5) * 160), // sideways sway while rising
}));

export default function RavensRedFog() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[6]" aria-hidden="true">
      {/* Blood glow pooled at the bottom — slow breathing base the fog rises out of */}
      <div className="fog-base absolute inset-x-0 bottom-0 h-[45%]" style={{ background: `linear-gradient(to top, rgba(${BLOOD},0.28), transparent)` }} />

      {/* Rising fog banks */}
      {FOG.map((f, i) => (
        <span
          key={`f${i}`}
          className="fog-puff absolute bottom-[-140px] rounded-full"
          style={
            {
              left: f.left,
              width: `${f.width}px`,
              height: `${Math.round(f.width * 0.55)}px`,
              background: `radial-gradient(ellipse at center, rgba(${BLOOD},0.34), rgba(${BLOOD},0.12) 55%, transparent 72%)`,
              "--fog-dur": `${f.dur}s`,
              "--fog-delay": `${f.delay}s`,
              "--fog-drift": `${f.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Ravens */}
      {RAVENS.map((r, i) => (
        <span
          key={i}
          className="raven absolute"
          style={
            {
              top: r.top,
              left: r.dir === 1 ? `-${r.size + 20}px` : undefined,
              right: r.dir === -1 ? `-${r.size + 20}px` : undefined,
              "--raven-dist": `${r.dir * 115}vw`,
              "--raven-dur": `${r.dur}s`,
              "--raven-delay": `${r.delay}s`,
              "--raven-op": r.opacity,
            } as React.CSSProperties
          }
        >
          {/* direction flip lives on the wrapper so the flap animation owns the svg transform */}
          <span className="block" style={r.dir === -1 ? { transform: "scaleX(-1)" } : undefined}>
            <svg
              className="raven-wing"
              width={r.size}
              height={r.size * 0.6}
              viewBox="0 0 120 80"
              style={{ "--flap-dur": `${r.flap}s` } as React.CSSProperties}
            >
              <path d={RAVEN_D} fill={INK} />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
