"use client";

/**
 * Electric lightning storm for the hero. Jagged bolts strike across the sky on
 * staggered loops while the backdrop flashes electric-blue. Scoped to drops that
 * set `effect: "lightning"` (e.g. The Horror of Godzilla). Pointer-events-none,
 * aria-hidden, and fully paused under prefers-reduced-motion (see .bolt / .storm-flash
 * rules in globals.css).
 */

// Deterministic pseudo-random (same on server + client → no hydration mismatch).
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Build a jagged top-down bolt as an SVG path inside a 40x400 viewBox.
function boltPath(seed: number): string {
  const segments = 7;
  let x = 20 + (rnd(seed, 1) - 0.5) * 12;
  let d = `M ${x.toFixed(1)} 0`;
  for (let s = 1; s <= segments; s++) {
    const y = (400 / segments) * s;
    x = 20 + (rnd(seed, s + 2) - 0.5) * 30;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

const COUNT = 7;
const BOLTS = Array.from({ length: COUNT }, (_, i) => ({
  left: `${8 + rnd(i, 10) * 84}%`,
  height: Math.round(180 + rnd(i, 11) * 240), // 180–420px tall
  delay: +(rnd(i, 12) * 6).toFixed(2), // 0–6s staggered so it's a continuous storm
  dur: +(5 + rnd(i, 13) * 3).toFixed(2), // 5–8s loop
  d: boltPath(i),
}));

export default function LightningStorm() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[6]" aria-hidden="true">
      {/* Sky flashes — the whole hero pulses electric-blue as the storm cracks */}
      <div
        className="storm-flash absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(0,180,255,0.55),transparent_60%)]"
        style={{ "--flash-dur": "7s" } as React.CSSProperties}
      />
      <div
        className="storm-flash absolute inset-0 bg-[radial-gradient(ellipse_at_22%_-5%,rgba(130,215,255,0.4),transparent_55%)]"
        style={{ "--flash-dur": "9.5s", animationDelay: "3.2s" } as React.CSSProperties}
      />

      {/* Bolts */}
      {BOLTS.map((b, i) => (
        <div
          key={i}
          className="bolt absolute top-0"
          style={
            {
              left: b.left,
              height: `${b.height}px`,
              "--bolt-delay": `${b.delay}s`,
              "--bolt-dur": `${b.dur}s`,
            } as React.CSSProperties
          }
        >
          <svg width="40" height={b.height} viewBox="0 0 40 400" preserveAspectRatio="none" fill="none">
            {/* wide electric-blue glow underlay */}
            <path d={b.d} stroke="#00b4ff" strokeWidth="7" strokeOpacity="0.5" strokeLinejoin="round" strokeLinecap="round" />
            {/* white-hot core on top */}
            <path d={b.d} stroke="#eaf7ff" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
      ))}
    </div>
  );
}
