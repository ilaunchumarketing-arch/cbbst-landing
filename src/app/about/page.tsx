import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About CBBST | Built By Collectors, For Collectors",
  description: "Comic Book Buy-Sell-Trade started as a Facebook community and grew into a hand-curated marketplace for exclusive variants, key issues, and graded slabs.",
};

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-cbbst-dark text-white">
        <PageHero
          tag="ABOUT CBBST"
          title="Built by collectors. For collectors."
          desc="What started as a Facebook group of comic obsessives became a hand-curated marketplace built around the books we actually want to own."
        />

        <section className="py-16 sm:py-20 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Origin */}
            <div>
              <div className="text-cbbst-red text-[10px] font-black tracking-[0.4em] mb-3">THE ORIGIN STORY</div>
              <h2 className="text-white font-black text-3xl sm:text-4xl italic leading-tight">
                From a Facebook group of comic nerds.<br />
                <span className="text-cbbst-gold">To a real marketplace.</span>
              </h2>
              <div className="text-white/70 text-base sm:text-lg mt-6 leading-relaxed space-y-4">
                <p>
                  CBBST didn&apos;t come out of a boardroom — it came out of late-night
                  threads about which artist&apos;s next variant was about to print.
                  About slabs being graded right. About a community of buyers and
                  sellers who actually knew what they were doing.
                </p>
                <p>
                  We outgrew the group. So we built a real platform — bigger inventory,
                  better protection for high-value books, and an actual checkout
                  experience that doesn&apos;t live inside a comment thread.
                </p>
                <p>
                  But the spirit didn&apos;t change. Every variant we list is a book we
                  picked. Every CGC slab gets photographed by us. Every Whatnot stream
                  is hosted by collectors, not actors.
                </p>
              </div>
            </div>

            {/* Pillars */}
            <div>
              <div className="text-cbbst-red text-[10px] font-black tracking-[0.4em] mb-3">WHAT WE BELIEVE</div>
              <h3 className="text-white font-black text-2xl sm:text-3xl italic leading-tight mb-6">Three things we won&apos;t compromise on.</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { n: "01", t: "ACTUAL CURATION", b: "We don't list everything. We list what's worth your money. Print runs, key issues, artists who matter." },
                  { n: "02", t: "INSURED PACKAGING", b: "Slabs get bubble wrap and rigid mailers. Raw books get bag, board, and a sturdy box. Period." },
                  { n: "03", t: "COLLECTOR-LEVEL SUPPORT", b: "If something arrives damaged, we fix it. If a slab doesn't show up, we hunt it. No outsourced replies." },
                ].map((p) => (
                  <div key={p.n} className="group bg-cbbst-dark2 border border-white/10 hover:border-cbbst-red/50 transition-all p-6">
                    <div className="text-cbbst-gold font-black text-3xl italic">{p.n}</div>
                    <h4 className="text-white font-black text-base mt-3">{p.t}</h4>
                    <p className="text-white/55 text-sm mt-2 leading-relaxed">{p.b}</p>
                    <div className="mt-4 h-[2px] w-6 bg-cbbst-red group-hover:w-full transition-all duration-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-cbbst-red/20 via-cbbst-dark2 to-black border border-cbbst-red/30 p-8 sm:p-10 text-center">
              <div className="text-cbbst-red text-[10px] font-black tracking-[0.4em] mb-3">START SOMEWHERE</div>
              <h3 className="text-white font-black text-3xl sm:text-4xl italic mb-4">
                See what&apos;s on the shelf right now.
              </h3>
              <p className="text-white/60 mb-6 max-w-lg mx-auto">
                Print runs of 450 to 666 copies. CGC slabs. Original art.
                Live drops on Whatnot.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/exclusives" className="bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors">
                  BROWSE EXCLUSIVES →
                </Link>
                <Link href="/contact" className="border border-white/25 hover:border-cbbst-gold text-white hover:text-cbbst-gold font-black text-sm tracking-[0.25em] px-8 py-4 transition-colors">
                  TALK TO A HUMAN →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
