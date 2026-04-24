import type { Metadata } from "next";
import Image from "next/image";
import ExquisiteHero from "@/components/ExquisiteHero";
import ReminderButton from "@/components/ReminderButton";
import TrackViewContent from "@/components/TrackViewContent";

// Saturday 2026-04-25 at 8:33 PM EST (UTC-4 during DST)
const DROP_ISO = "2026-04-26T00:33:00Z";
const WHATNOT_URL = "https://www.whatnot.com/s/eiJUjqLs";
const ART_SRC = "/images/exquisite-corpses-12-art.jpeg";

export const metadata: Metadata = {
  title: "Exquisite Corpses #12 · Exclusive Drop — Live on Whatnot | CBBST",
  description:
    "Exquisite Corpses #12 — exclusive drop live on Whatnot Saturday 8:33 PM EST. Set your reminder now. Comic Book Buy-Sell-Trade.",
  openGraph: {
    title: "Exquisite Corpses #12 · Exclusive Drop",
    description: "Live on Whatnot · Saturday 8:33 PM EST",
    images: [ART_SRC],
  },
};

export default function Page() {
  return (
    <>
      <main className="bg-cbbst-dark">
        <TrackViewContent name="Exquisite Corpses #12" id="exquisite-corpses-12" category="whatnot-drop" />
        <ExquisiteHero dropISO={DROP_ISO} whatnotUrl={WHATNOT_URL} artSrc={ART_SRC} />

        {/* ABOUT */}
        <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 -left-20 h-80 w-80 rounded-full bg-cbbst-red/10 blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl animate-float-slow" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-cbbst-red text-xs font-black tracking-[0.35em] mb-3">
                ABOUT THE DROP
              </div>
              <h2 className="text-white font-black text-4xl sm:text-5xl italic leading-tight">
                ISSUE <span className="text-cbbst-gold animate-flicker inline-block">#12</span>{" "}
                IS UGLIER.
                <br />
                AND WE LIKE IT THAT WAY.
              </h2>
              <p className="text-white/60 text-base sm:text-lg mt-6 leading-relaxed">
                Twelve issues deep and we&apos;re still running the knife. This drop
                features the rarest covers we&apos;ve pulled, hand-selected variants,
                and a handful of slabs you will not see twice. Every auction starts
                at $1. Nothing is reserved. If you want it, you fight for it.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  num: "01",
                  title: "LIMITED 1-OF-1 COVERS",
                  body:
                    "Artist-exclusive variants we commissioned just for this drop. When they're gone, they're gone.",
                },
                {
                  num: "02",
                  title: "GRADED KEY ISSUES",
                  body:
                    "CGC 9.8s and fresh slabs you won't find on the shelf. Auction-style, live only.",
                },
                {
                  num: "03",
                  title: "GIVEAWAYS + MYSTERY BOXES",
                  body:
                    "Drop giveaways during the stream and sealed mystery boxes on the back end.",
                },
              ].map((c) => (
                <div
                  key={c.num}
                  className="group relative bg-cbbst-dark2 border border-white/10 p-6 overflow-hidden transition-all hover:border-cbbst-gold/60 hover:-translate-y-1"
                >
                  <div className="absolute -top-4 -right-6 text-cbbst-gold/10 font-black text-[120px] italic leading-none pointer-events-none group-hover:text-cbbst-gold/20 transition-colors">
                    {c.num}
                  </div>
                  <div className="relative">
                    <div className="text-cbbst-gold/60 font-black text-xl italic">{c.num}</div>
                    <h3 className="text-white font-black text-lg tracking-wide mt-2">
                      {c.title}
                    </h3>
                    <p className="text-white/55 text-sm mt-3 leading-relaxed">{c.body}</p>
                  </div>
                  <div className="absolute left-0 bottom-0 h-[2px] w-0 bg-cbbst-red group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO JOIN */}
        <section className="relative py-20 px-4 sm:px-6 bg-black border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="text-cbbst-red text-xs font-black tracking-[0.35em] mb-3">
                HOW TO JOIN THE STREAM
              </div>
              <h2 className="text-white font-black text-4xl sm:text-5xl italic">
                THREE STEPS. DON&apos;T MISS IT.
              </h2>
            </div>
            <ol className="grid md:grid-cols-3 gap-6">
              {[
                { t: "DOWNLOAD WHATNOT", d: "Free on iOS, Android or desktop. Takes 30 seconds." },
                { t: "FOLLOW @CBBST", d: "Hit follow so your phone pings you the minute we go live." },
                { t: "TAP IN AT 8:33 PM EST", d: "Saturday night. Bid, buy, banter. Bring snacks." },
              ].map((s, i) => (
                <li
                  key={s.t}
                  className="group relative bg-cbbst-dark border border-white/10 p-6 transition-all hover:border-cbbst-red/60 hover:-translate-y-1"
                >
                  <div className="absolute -top-4 left-6 bg-cbbst-red text-white font-black text-xs tracking-[0.3em] px-3 py-1">
                    STEP {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-white font-black text-lg tracking-wide mt-3">{s.t}</h3>
                  <p className="text-white/55 text-sm mt-2 leading-relaxed">{s.d}</p>
                  <div className="mt-5 h-[2px] w-8 bg-cbbst-gold group-hover:w-full transition-all duration-500" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image src={ART_SRC} alt="" fill className="object-cover opacity-25 scale-110 blur-md" />
            <div className="absolute inset-0 bg-gradient-to-r from-cbbst-red/35 via-black/85 to-fuchsia-900/30" />
            <div className="absolute inset-0 halftone-overlay opacity-30" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-cbbst-gold/40 animate-scanline" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="text-cbbst-gold text-xs font-black tracking-[0.35em] mb-3 animate-flicker">
              DON&apos;T SLEEP ON THIS
            </div>
            <h2 className="text-white font-black text-5xl sm:text-7xl italic leading-[0.9]">
              SEE YOU SATURDAY
              <br />
              <span className="text-cbbst-gold">8:33 PM EST</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg mt-5 max-w-xl mx-auto">
              Exquisite Corpses #12 goes live. Tap reminder now or forever cry in the comments.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <ReminderButton
                href={WHATNOT_URL}
                className="group relative inline-flex items-center gap-2 bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.25em] px-10 py-4 transition-all animate-pulse-ring"
              >
                SET REMINDER
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </ReminderButton>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 text-white/30 text-[10px] font-black tracking-[0.35em]">
              <span className="h-px w-8 bg-white/20" />
              ISSUE · 12
              <span className="h-px w-8 bg-white/20" />
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 text-center border-t border-white/5 bg-black">
          <p className="text-white/25 text-[10px] tracking-[0.3em] font-bold">
            © 2026 COMIC BOOK BUY-SELL-TRADE · CBBST
          </p>
        </footer>
      </main>
    </>
  );
}
