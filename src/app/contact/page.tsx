import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact CBBST | Talk to a Human",
  description: "Questions, orders, custom requests, or selling a collection — get in touch.",
};

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-cbbst-dark text-white">
        <PageHero
          tag="CONTACT"
          title="Get in touch."
          desc="Selling a collection. Asking about a slab. Reporting a damaged shipment. Whatever you need — we read every message."
        />

        <section className="py-16 sm:py-20 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-10">
            {/* Contact options */}
            <div className="space-y-6">
              <div className="bg-cbbst-dark2 border border-white/10 p-6">
                <div className="text-cbbst-red text-[10px] font-black tracking-[0.4em] mb-2">EMAIL</div>
                <a
                  href="mailto:support@cbbst.com"
                  className="text-white font-bold text-base hover:text-cbbst-gold transition-colors break-all"
                >
                  support@cbbst.com
                </a>
                <p className="text-white/55 text-sm mt-3">
                  Quickest way to reach a real person. We respond within 1 business day.
                </p>
              </div>

              <div className="bg-cbbst-dark2 border border-white/10 p-6">
                <div className="text-cbbst-red text-[10px] font-black tracking-[0.4em] mb-2">LIVE STREAM</div>
                <p className="text-white font-bold">Live on Whatnot</p>
                <p className="text-white/55 text-sm mt-3">
                  Drop in during the live show — we answer collector questions in real time.
                </p>
                <Link
                  href="https://www.whatnot.com/user/cbbst"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-cbbst-red font-black text-xs tracking-[0.3em] hover:underline"
                >
                  FOLLOW @CBBST →
                </Link>
              </div>

              <div className="bg-cbbst-dark2 border border-white/10 p-6">
                <div className="text-cbbst-red text-[10px] font-black tracking-[0.4em] mb-2">SOCIAL</div>
                <div className="space-y-2 mt-2">
                  <a
                    href="https://www.facebook.com/share/g/1AH8UQi9yQ/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-cbbst-gold transition-colors text-sm block"
                  >
                    → Facebook Group
                  </a>
                  <a
                    href="https://www.instagram.com/comicbook_buy_sell_trade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-cbbst-gold transition-colors text-sm block"
                  >
                    → Instagram @comicbook_buy_sell_trade
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cbbst-red/15 to-cbbst-dark2 border border-cbbst-red/30 p-6">
                <div className="text-cbbst-gold text-[10px] font-black tracking-[0.4em] mb-2">SELLING A COLLECTION?</div>
                <p className="text-white/75 text-sm leading-relaxed">
                  We buy and trade. Send us photos, expected condition, and what you&apos;re looking for. We&apos;ll come back with a real offer.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-cbbst-dark2 border border-white/10 p-6 sm:p-8">
              <h2 className="text-white font-black text-2xl italic">SEND A MESSAGE</h2>
              <p className="text-white/55 text-sm mt-2">
                Name, email, and message are required. Phone and text alerts are optional.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
