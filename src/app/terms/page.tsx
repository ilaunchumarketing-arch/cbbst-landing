import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service | CBBST",
  description: "The legal terms governing use of the CBBST website and purchases made through it.",
};

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-cbbst-dark text-white">
        <PageHero tag="TERMS OF SERVICE" title="The legal stuff." desc="By using the site or making a purchase, you agree to these terms." />

        <section className="py-16 sm:py-20 px-6">
          <div className="max-w-3xl mx-auto space-y-6 text-white/75 text-base leading-relaxed">
            <Block n="01" title="Acceptance">
              By accessing or using any part of the site, you agree to be bound by these Terms of Service. We may update terms at any time; continued use implies acceptance of changes.
            </Block>

            <Block n="02" title="Account">
              You must be of legal age in your jurisdiction (or have parental consent). Account information must be current and accurate. We reserve the right to refuse or cancel any order at our discretion — including orders from dealers, resellers, or accounts with suspicious activity.
            </Block>

            <Block n="03" title="Products & Availability">
              Product availability is limited. Prices are subject to change without notice. We don&apos;t guarantee color accuracy on your monitor. We may discontinue items without obligation to update prior listings.
            </Block>

            <Block n="04" title="Payment">
              We reserve the right to refuse any order and limit or cancel quantities purchased per person, per household, or per order. Credit card information is encrypted during transmission.
            </Block>

            <Block n="05" title="Shipping">
              Subject to our <a href="/shipping" className="text-cbbst-gold hover:underline">Shipping Policy</a>. Buyer is responsible for international customs fees and import duties.
            </Block>

            <Block n="06" title="Returns">
              All sales are final unless the item arrives damaged due to shipping. See the shipping policy for the 48-hour damage report window.
            </Block>

            <Block n="07" title="Intellectual Property">
              You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of the site or service without our written permission.
            </Block>

            <Block n="08" title="Liability">
              The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; with no warranties. We&apos;re not liable for damages, errors, or service interruptions — even if advised of the possibility.
            </Block>

            <Block n="09" title="SMS / Text Message Program">
              <p>
                CBBST offers an optional text-message program for new drops, restocks, live-show
                alerts, and collector offers. You join only by checking the SMS consent box yourself —
                it is never pre-checked and never required.{" "}
                <strong className="text-white">Consent is not a condition of any purchase.</strong>
              </p>
              <p className="mt-3">
                <strong className="text-white">Program:</strong> Comic Book Buy Sell Trade (CBBST)
                exclusive-variant drops, restock alerts, live-show and Whatnot stream alerts, and
                personalized collector offers.
              </p>
              <p className="mt-3">
                <strong className="text-white">Messages:</strong> recurring automated promotional and
                personalized marketing text messages sent to the number you provide.{" "}
                <strong className="text-white">Message frequency varies.</strong> Message and data
                rates may apply — your mobile carrier charges those, not CBBST. Carriers are not liable
                for delayed or undelivered messages.
              </p>
              <p className="mt-3">
                <strong className="text-white">Opt out:</strong> reply <strong className="text-white">STOP</strong> to
                any message at any time. We will send one confirmation and then stop sending marketing
                texts to that number. <strong className="text-white">Help:</strong> reply{" "}
                <strong className="text-white">HELP</strong>, or email{" "}
                <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">
                  support@cbbst.com
                </a>
                . Opting out of texts does not affect your orders, your account, or email support.
              </p>
              <p className="mt-3">
                <strong className="text-white">Eligibility:</strong> you must be at least 18 and the
                subscriber or authorized user of the mobile number you enter. Tell us if that number
                changes or is reassigned so we can stop messaging it.
              </p>
              <p className="mt-3">
                <strong className="text-white">Privacy:</strong>{" "}
                <strong className="text-white">
                  No mobile information will be sold or shared with third parties or affiliates for
                  marketing or promotional purposes.
                </strong>{" "}
                Service providers may process it only to deliver the program. See the{" "}
                <a href="/privacy" className="text-cbbst-gold hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </Block>

            <Block n="10" title="Contact">
              Questions about these terms? Email{" "}
              <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">
                support@cbbst.com
              </a>.
            </Block>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-cbbst-dark2 border border-white/10 p-6 sm:p-8">
      <div className="flex items-baseline gap-4">
        <div className="text-cbbst-red font-black text-2xl italic">{n}</div>
        <h2 className="text-white font-black text-xl italic">{title}</h2>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
