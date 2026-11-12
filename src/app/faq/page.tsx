import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "FAQ | CBBST",
  description: "Common questions about ordering, shipping, payments, and damaged-item handling.",
};

const faqs = [
  {
    q: "What is CBBST?",
    a: "CBBST (Comic Book Buy-Sell-Trade) is a dedicated online platform where collectors buy, sell, and trade comic books. We started as a Facebook group and grew into a real marketplace focused on exclusive variants, CGC graded slabs, and key issues.",
  },
  {
    q: "How do I buy comics on CBBST?",
    a: "Browse listings on the site, add items to your cart, and proceed to checkout. Once your payment is confirmed, you'll receive tracking information when your order ships — typically within 2–5 business days.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit cards, PayPal, and other secure payment methods at checkout. Cards are encrypted during transmission.",
  },
  {
    q: "How much does shipping cost?",
    a: "Shipping costs vary based on destination, package weight, and the method selected at checkout. Insured shipping is available for valuable items — and recommended on graded slabs and original art.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship to select countries internationally. Buyers are responsible for customs fees, import duties, and any taxes assessed by their country's authorities.",
  },
  {
    q: "What happens if my comic arrives damaged?",
    a: "Contact us within 48 hours of delivery with photos of the packaging and the item. We'll work toward a resolution — refund or replacement depending on the situation. Email support@cbbst.com.",
  },
  {
    q: "How can I contact customer support?",
    a: "Email support@cbbst.com, drop into our live Whatnot streams, or use the contact form on this site. We typically respond within 1 business day.",
  },
  {
    q: "What's a 'virgin variant' or 'foil variant'?",
    a: "A virgin variant is a cover with no trade dress — no logo, no UPC, no credits. Just the raw artwork. A foil variant has metallic or premium foil treatment on the cover. Both are usually limited print runs and command higher resale value over time.",
  },
  {
    q: "What does the print run mean?",
    a: "Print run is the total number of copies of that specific variant printed. A 500-copy print run means only 500 exist on the planet — there will not be reprints of the variant treatment.",
  },
  {
    q: "What's CGC and why do graded slabs cost more?",
    a: "CGC (Certified Guaranty Company) is the industry-standard third party that grades comics on a 0–10 scale, then encapsulates them in a tamper-evident case. A 9.8 graded slab is verified pristine. Graded slabs command higher prices because they're authenticated and protected — and because the grade locks in their resale floor.",
  },
];

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-cbbst-dark text-white">
        <PageHero
          tag="FREQUENTLY ASKED"
          title="Questions, answered."
          desc="Ordering, shipping, payments, returns — the stuff people ask before clicking Add to Cart."
        />

        <section className="py-16 sm:py-20 px-6">
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="group bg-cbbst-dark2 border border-white/10 hover:border-cbbst-red/30 transition-colors">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5">
                  <h3 className="text-white font-black text-base sm:text-lg flex-1">{f.q}</h3>
                  <span className="text-cbbst-red text-2xl font-black group-open:rotate-45 transition-transform leading-none mt-1">+</span>
                </summary>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed px-5 pb-5">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="max-w-3xl mx-auto mt-12 bg-gradient-to-br from-cbbst-red/15 to-cbbst-dark2 border border-cbbst-red/30 p-6 text-center">
            <p className="text-white font-bold">Still need help?</p>
            <p className="text-white/60 text-sm mt-2">
              Email <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">support@cbbst.com</a> — or hit the <a href="/contact" className="text-cbbst-gold hover:underline">contact form</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
