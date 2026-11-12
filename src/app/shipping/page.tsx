import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Shipping Policy | CBBST",
  description: "Processing times, shipping methods, packaging, and damage protocol.",
};

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-cbbst-dark text-white">
        <PageHero
          tag="SHIPPING POLICY"
          title="How we ship."
          desc="Processing times, packaging standards, and what happens if something goes wrong."
        />

        <section className="py-16 sm:py-20 px-6">
          <div className="max-w-3xl mx-auto space-y-10 text-white/75 text-base leading-relaxed">
            <Block tag="01 · PROCESSING & HANDLING" title="2–5 business days to ship.">
              Orders are typically processed and shipped within 2 to 5 business days after
              payment confirmation. During high-demand periods (con season, season finales,
              Whatnot drop nights) processing may extend to 7 business days. You&apos;ll get
              tracking the moment it leaves us.
            </Block>

            <Block tag="02 · SHIPPING METHODS & RATES" title="Calculated at checkout.">
              Costs depend on destination, package weight, and the method you select. Standard
              ground service is available for the continental US. International is available
              to select countries. Tracking information is provided automatically once your
              package is in the carrier&apos;s hands.
            </Block>

            <Block tag="03 · PACKAGING & PROTECTION" title="Bag, board, mailer. Always.">
              Every raw comic ships in a clean polybag with a fresh acid-free backer board,
              inside a rigid corrugated mailer or sturdy double-walled box. Graded slabs get
              additional bubble wrap and rigid hard mailers. High-value books (slabs, signature
              series, original art) get extra protection and insurance by default.
            </Block>

            <Block tag="04 · INTERNATIONAL ORDERS" title="You handle customs.">
              International buyers are responsible for customs fees, import duties, and any
              taxes assessed by their country&apos;s authorities. Delivery times vary by destination
              and customs processing — most international packages arrive within 2–4 weeks.
            </Block>

            <Block tag="05 · DAMAGED OR LOST PACKAGES" title="48 hours to report. Photos required.">
              If your package arrives damaged, contact us at{" "}
              <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">
                support@cbbst.com
              </a>{" "}
              within 48 hours of delivery with photos of the packaging and the item. For lost
              packages, check tracking first — most apparent losses turn out to be carrier
              scans behind. Insured shipments are eligible for carrier claims; we&apos;ll initiate
              on your behalf.
            </Block>

            <Block tag="06 · RETURNS" title="All sales final unless damaged.">
              All sales are final unless an item arrives damaged due to shipping. Contact us
              immediately if there&apos;s a problem — we&apos;d much rather fix it than leave you
              with a bad book.
            </Block>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Block({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-cbbst-dark2 border border-white/10 hover:border-cbbst-red/30 transition-colors p-6 sm:p-8">
      <div className="text-cbbst-red text-[10px] font-black tracking-[0.4em] mb-3">{tag}</div>
      <h2 className="text-white font-black text-2xl italic leading-tight mb-4">{title}</h2>
      <div className="text-white/70 text-base leading-relaxed">{children}</div>
    </div>
  );
}
