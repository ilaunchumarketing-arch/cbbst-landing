"use client";

import { useCallback, useEffect, useRef, useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { HeroDrop } from "@/lib/shopify";

// Fallback cover for when the live Shopify fetch is unavailable.
const FALLBACK_COVER = "/images/exclusives/absolute-batman-24-trade.jpg";
const SUBSCRIBED_KEY = "cbbst_drop_alerts_subscribed";
// A popup is an interruption — keep it to the newest few books, not the whole shelf.
const MAX_SLIDES = 3;

const VOICE_FONT: Record<string, string> = {
  impact: "var(--font-impact), Impact, sans-serif",
  blade: "var(--font-blade), Georgia, serif",
};

/**
 * Page-load drop-alerts popup. Collects an email and subscribes it to drop
 * notifications (via /api/subscribe → GoHighLevel, tagged `drop-alerts`) so
 * every future drop announcement reaches the list.
 *
 * ⚠️ THIS POPUP COVERS THE ENTIRE HERO and locks page scroll, so whatever it shows IS the
 * first thing every new visitor sees — it is effectively the banner. It therefore takes
 * the SAME `heroDrops` as the hero (David 2026-08-24: "the banner is not working" — it was
 * still showing Absolute Batman #23 over the new #24 hero, because the cover was hardcoded).
 *
 * The covers are a SWIPEABLE carousel of the newest drops, and each slide re-skins the
 * panel in that book's own personality — accent pair, eyebrow mood line and display
 * TYPEFACE (David 2026-08-25: "they can swipe the image and when they swipe the font
 * should change according to the image shown"). The palettes and voices are the existing
 * per-product themes from products.ts, not popup-specific choices, so a book looks the
 * same here as it does on its product page.
 *
 * Swipe is never the ONLY control — arrows, dots and ←/→ keys all move the carousel,
 * because a swipe-only carousel is invisible to keyboard and desktop users and fights the
 * OS back-gesture on mobile. Vertical drags are ignored so the panel can still scroll.
 *
 * The seen-key is DERIVED FROM THE LEAD DROP'S SLUG, so it rotates by itself on every new
 * drop (previously `..._seen_ab23`, a hand-bumped constant — miss the bump and returning
 * visitors never see the new drop, which is exactly how the stale cover survived).
 */
export default function DropModal({ drops = [] }: { drops?: HeroDrop[] }) {
  const slides = drops.slice(0, MAX_SLIDES);
  const lead = slides[0];
  const SEEN_KEY = `cbbst_drop_alerts_modal_seen_${lead?.slug ?? "default"}`;

  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const touch = useRef<{ x: number; y: number } | null>(null);

  const active = slides[i];
  const accent = active?.theme.accent ?? "var(--cbbst-red)";
  const accent2 = active?.theme.accent2 ?? "var(--cbbst-gold)";
  const voiceFont = active?.theme.voice ? VOICE_FONT[active.theme.voice] : undefined;

  const go = useCallback(
    (next: number) => {
      if (!slides.length) return;
      setI((next + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    try {
      if (localStorage.getItem(SUBSCRIBED_KEY)) return;
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* storage may be unavailable — still show the modal */
    }
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, [SEEN_KEY]);

  useEffect(() => {
    if (!open) return;
    // Lock background scroll while open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keyboard: arrows move the carousel, Escape closes. A carousel that only responds to
  // swipe is unusable on a desktop without a trackpad gesture.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(i + 1);
      else if (e.key === "ArrowLeft") go(i - 1);
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i, go]);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  // Horizontal drag only: a mostly-vertical drag is the user scrolling the panel, and a
  // tiny drag is a tap on the cover link.
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    go(i + (dx < 0 ? 1 : -1));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "popup" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong — try again");
        setStatus("error");
        return;
      }
      setStatus("done");
      try {
        localStorage.setItem(SUBSCRIBED_KEY, "1");
      } catch {
        /* ignore */
      }
    } catch {
      setError("Something went wrong — try again");
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Get drop alerts by email"
    >
      {/* Backdrop — tap anywhere outside to close */}
      <button
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in cursor-default"
      />

      {/* Close — big, always-visible tap target pinned to the viewport corner */}
      <button
        onClick={close}
        aria-label="Close"
        className="fixed top-4 right-4 z-[120] h-11 w-11 flex items-center justify-center text-white bg-black/70 hover:bg-cbbst-red border border-white/25 rounded-full shadow-lg transition-colors cursor-pointer"
      >
        <X size={22} />
      </button>

      {/* Card. The active book's accents ride in as CSS vars so every tinted element
          cross-fades together when the cover changes. */}
      <div
        className="drop-fade relative w-full max-w-3xl max-h-[90dvh] overflow-y-auto overflow-x-hidden bg-cbbst-dark border-2 shadow-[0_0_60px_-10px_rgba(0,0,0,0.8)] animate-modal-in"
        style={{ borderColor: accent, boxShadow: `0 0 60px -10px ${accent}99` }}
      >
        {/* Decorations live in their own clipped layer so they can't create scroll overflow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 halftone-overlay opacity-10" />
          <div
            className="drop-fade absolute -top-24 -right-24 h-72 w-72 rounded-full blur-[120px]"
            style={{ backgroundColor: `${accent}40` }}
          />
        </div>

        <div className="relative grid sm:grid-cols-[42%_1fr]">
          {/* ————— Cover carousel ————— */}
          <div className="relative bg-black/60 p-4 sm:p-6 flex flex-col items-center justify-center gap-3">
            <div
              className="drop-fade absolute -inset-2 blur-2xl pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${accent}4d, ${accent2}33)` }}
            />

            <div
              className="relative w-full max-w-[150px] sm:max-w-[220px] aspect-[2/3] shadow-2xl overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              aria-roledescription="carousel"
              aria-label="Newest drops"
            >
              {slides.length ? (
                <div
                  className="drop-track flex h-full w-full"
                  style={{ transform: `translateX(-${i * 100}%)` }}
                >
                  {slides.map((d, n) => (
                    <Link
                      key={d.slug}
                      href={d.href}
                      onClick={close}
                      aria-hidden={n !== i}
                      tabIndex={n === i ? 0 : -1}
                      className="relative h-full w-full shrink-0 cursor-pointer"
                    >
                      <Image
                        src={d.image}
                        alt={`${d.title} cover`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 60vw, 220px"
                        priority={n === 0}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <Image
                  src={FALLBACK_COVER}
                  alt="Featured exclusive cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 60vw, 220px"
                  priority
                />
              )}

              <div
                className="drop-fade absolute -top-2 -left-2 text-white text-[9px] font-black tracking-[0.25em] px-2 py-1 z-10"
                style={{ backgroundColor: accent }}
              >
                EXCLUSIVE
              </div>
            </div>

            {/* Arrows + dots — swipe is never the only way to move the carousel. */}
            {slides.length > 1 && (
              <div className="relative z-10 flex items-center gap-2">
                <button
                  onClick={() => go(i - 1)}
                  aria-label="Previous drop"
                  className="h-11 w-11 flex items-center justify-center text-white/70 hover:text-white border border-white/20 hover:border-white/50 rounded-full transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2 px-1">
                  {slides.map((d, n) => (
                    <button
                      key={d.slug}
                      onClick={() => go(n)}
                      aria-label={`Show ${d.title}`}
                      aria-current={n === i}
                      className="h-11 w-4 flex items-center justify-center cursor-pointer"
                    >
                      <span
                        className="drop-fade block h-2 w-2 rounded-full"
                        style={{ backgroundColor: n === i ? accent : "rgba(255,255,255,0.28)" }}
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => go(i + 1)}
                  aria-label="Next drop"
                  className="h-11 w-11 flex items-center justify-center text-white/70 hover:text-white border border-white/20 hover:border-white/50 rounded-full transition-colors cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* ————— Copy + form ————— */}
          <div className="relative min-w-0 p-6 sm:p-8">
            {status === "done" ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cbbst-gold" />
                  <span className="text-cbbst-gold text-[10px] font-black tracking-[0.35em]">
                    YOU&apos;RE ON THE LIST
                  </span>
                </div>
                <h2 className="text-white font-black italic text-3xl sm:text-4xl leading-[0.9] tracking-tight">
                  FIRST DIBS,<br />LOCKED IN.
                </h2>
                <p className="text-white/75 text-sm mt-4 leading-relaxed">
                  You&apos;ll get an email the moment every new drop goes live —{" "}
                  <span className="text-white font-bold">before it sells out.</span> Keep an
                  eye on your inbox.
                </p>
                <div className="mt-6">
                  <button
                    onClick={close}
                    className="drop-fade text-white font-black text-sm tracking-[0.2em] px-7 py-3.5 cursor-pointer"
                    style={{ backgroundColor: accent }}
                  >
                    KEEP BROWSING →
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Eyebrow — the ACTIVE book's own mood line, in its own accent. */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span
                      className="drop-fade absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                      style={{ backgroundColor: accent }}
                    />
                    <span
                      className="drop-fade relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: accent }}
                    />
                  </span>
                  <span
                    className="drop-fade text-[10px] font-black tracking-[0.35em]"
                    style={{ color: accent }}
                  >
                    {active?.theme.mood ?? "EXCLUSIVE DROP ALERTS"}
                  </span>
                </div>

                {/* The book's name, set in the book's own display voice — this is what
                    changes as you swipe. `key` restarts the fade on every slide. */}
                {active ? (
                  <h2
                    key={active.slug}
                    // Titles run from "ABSOLUTE BATMAN #24" to "ABSOLUTE CASSANDRA CAIN:
                    // THE SHADOW'S HAND #1" — step the size down on the long ones and let
                    // the browser balance the lines, so a long title can't wrap to four
                    // lines and strand its issue number on the last one.
                    className={`text-white leading-[0.95] tracking-tight animate-fade-in [text-wrap:balance] ${
                      active.title.length > 34
                        ? "text-xl sm:text-2xl"
                        : active.title.length > 22
                          ? "text-2xl sm:text-3xl"
                          : "text-3xl sm:text-4xl"
                    }`}
                    style={{ fontFamily: voiceFont, fontWeight: voiceFont ? 700 : 900 }}
                  >
                    {active.title}
                  </h2>
                ) : (
                  <h2 className="text-white font-black italic text-3xl sm:text-4xl leading-[0.9] tracking-tight">
                    NEVER MISS<br />A DROP.
                  </h2>
                )}

                {active && (
                  <p className="text-white/60 text-[13px] mt-2 leading-snug">
                    {active.subtitle}
                    {/* Key-issue line renders ONLY when the curated entry states one —
                        never invent a "1st appearance" for a book we can't source. */}
                    {active.hook ? (
                      <>
                        {" · "}
                        <span className="drop-fade font-bold" style={{ color: accent2 }}>
                          {active.hook}
                        </span>
                      </>
                    ) : null}
                  </p>
                )}

                {/* Value row */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className="drop-fade border text-[10px] font-black tracking-[0.2em] px-2.5 py-1"
                    style={{ borderColor: `${accent}66`, backgroundColor: `${accent}1a`, color: accent }}
                  >
                    FIRST ACCESS
                  </span>
                  <span
                    className="drop-fade border text-[10px] font-black tracking-[0.2em] px-2.5 py-1"
                    style={{ borderColor: `${accent}66`, backgroundColor: `${accent}1a`, color: accent }}
                  >
                    LIMITED RUNS
                  </span>
                  <span className="border border-white/15 text-white/70 text-[10px] font-black tracking-[0.2em] px-2.5 py-1">
                    COLLECTOR DEALS
                  </span>
                </div>

                <p className="text-white/75 text-sm mt-4 leading-relaxed">
                  Our exclusives are strictly limited and{" "}
                  <span className="text-white font-bold">sell out fast.</span> Drop your email
                  and get notified{" "}
                  <span className="drop-fade font-bold" style={{ color: accent2 }}>
                    the moment every new drop goes live.
                  </span>
                </p>

                <form onSubmit={submit} className="mt-6">
                  <div className="flex flex-col gap-3">
                    <label htmlFor="drop-alert-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="drop-alert-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-w-0 bg-cbbst-dark3 border border-white/15 text-white text-base sm:text-sm px-4 py-3.5 focus:outline-none focus:border-white/60 placeholder:text-white/30"
                    />
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="drop-fade w-full text-white font-black text-sm tracking-[0.2em] px-7 py-3.5 disabled:opacity-60 cursor-pointer"
                      style={{ backgroundColor: accent }}
                    >
                      {status === "sending" ? "SIGNING UP..." : "GET DROP ALERTS →"}
                    </button>
                  </div>
                  {status === "error" && (
                    <p className="text-cbbst-red text-xs font-bold mt-2">{error}</p>
                  )}
                </form>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {active && (
                    <Link
                      href={active.href}
                      onClick={close}
                      className="drop-fade text-[11px] font-black tracking-[0.25em] cursor-pointer"
                      style={{ color: accent2 }}
                    >
                      SHOP THIS DROP →
                    </Link>
                  )}
                  <button
                    onClick={close}
                    className="text-white/50 hover:text-white text-xs font-bold tracking-widest transition-colors cursor-pointer"
                  >
                    MAYBE LATER
                  </button>
                </div>
                <p className="text-white/30 text-xs mt-3">No spam. Unsubscribe anytime.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
