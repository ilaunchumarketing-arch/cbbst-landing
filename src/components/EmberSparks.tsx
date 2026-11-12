"use client";

/**
 * Glowing fire sparks for Battle Beast drops — embers drift up around the hero
 * with a swaying rise and a breathing heat-glow pooled at the bottom, like the
 * air around a pit fight. Scoped to products that resolve `effect: "embers"`
 * (Battle Beast titles via getEffect). Pointer-events-none, aria-hidden, and
 * fully paused under prefers-reduced-motion (see .ember rules in globals.css).
 */

// Deterministic pseudo-random (same on server + client → no hydration mismatch).
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const COUNT = 26;
const EMBERS = Array.from({ length: COUNT }, (_, i) => {
  const depth = rnd(i, 1); // 0 = far, 1 = near
  return {
    left: `${Math.round(rnd(i, 2) * 100)}%`,
    size: +(2.5 + depth * 6).toFixed(1), // 2.5–8.5px
    opacity: +(0.45 + depth * 0.5).toFixed(2),
    dur: +(4.5 + rnd(i, 3) * 5).toFixed(2), // 4.5–9.5s rise
    delay: +(rnd(i, 4) * 8).toFixed(2),
    sway: Math.round((rnd(i, 5) - 0.5) * 180), // side-to-side drift while rising
    hot: rnd(i, 6) > 0.6, // some run white-hot gold, most burn orange
  };
});

export default function EmberSparks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[6]" aria-hidden="true">
      {/* Heat glow pooled at the bottom — slow breathing base the sparks rise out of */}
      <div
        className="ember-base absolute inset-x-0 bottom-0 h-[40%]"
        style={{ background: "linear-gradient(to top, rgba(255,122,0,0.26), transparent)" }}
      />

      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="ember absolute bottom-[-16px] rounded-full"
          style={
            {
              left: e.left,
              width: `${e.size}px`,
              height: `${e.size}px`,
              background: e.hot
                ? "radial-gradient(circle, #fff3c4 20%, #ffd27a 55%, rgba(255,122,0,0) 100%)"
                : "radial-gradient(circle, #ffd27a 15%, #ff7a00 55%, rgba(255,60,0,0) 100%)",
              boxShadow: e.hot
                ? "0 0 10px 2px rgba(255,210,122,0.85)"
                : "0 0 9px 2px rgba(255,122,0,0.75)",
              "--ember-dur": `${e.dur}s`,
              "--ember-delay": `${e.delay}s`,
              "--ember-sway": `${e.sway}px`,
              "--ember-op": e.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
