import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy | CBBST",
  description: "What data we collect, how we use it, who we share it with, and how to exercise your rights.",
};

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-cbbst-dark text-white">
        <PageHero
          tag="PRIVACY POLICY"
          title="Your data. Plain English."
          desc="Last updated August 22, 2026. Questions: support@cbbst.com"
        />

        <section className="py-16 sm:py-20 px-6">
          <div className="max-w-3xl mx-auto space-y-8 text-white/75 text-base leading-relaxed">
            <Block title="What we collect">
              <p>
                <strong className="text-white">Directly from you:</strong> name, address, phone, email, billing/shipping details, account login info, and the content of any messages you send our support team.
              </p>
              <p className="mt-3">
                <strong className="text-white">Automatically:</strong> usage data via cookies and tracking — device info, browser data, IP address, and interaction patterns on the site.
              </p>
              <p className="mt-3">
                <strong className="text-white">From third parties:</strong> Shopify (our checkout backbone), payment processors, advertising/marketing partners, and analytics providers.
              </p>
            </Block>

            <Block title="How we use it">
              <ul className="list-disc list-inside space-y-2">
                <li>Fulfill your orders and manage your account</li>
                <li>Send marketing communications and targeted ads (only if you&apos;ve opted in)</li>
                <li>Detect fraud and prevent illegal activity</li>
                <li>Improve our products, services, and customer support</li>
              </ul>
            </Block>

            <Block title="Who we share it with">
              <ul className="list-disc list-inside space-y-2">
                <li>Service vendors (payment processors, fulfillment partners, IT providers)</li>
                <li>Business and marketing partners</li>
                <li>Corporate affiliates</li>
                <li>Third parties when you give consent or when legally required</li>
              </ul>
              <p className="mt-3 text-white/60 text-sm">
                We&apos;ve disclosed identifiers, commercial information, and usage data to advertising partners. You can opt out of this on the{" "}
                <a href="/privacy-choices" className="text-cbbst-gold hover:underline">Your Privacy Choices</a> page.
              </p>
            </Block>

            <Block title="Text messages (SMS)">
              <p>
                CBBST runs an optional text-message program. You are only enrolled if you check the SMS
                consent box yourself — it is never pre-checked, it is never required, and{" "}
                <strong className="text-white">consent is not a condition of any purchase</strong>.
                Leaving it unchecked has no effect on your order, your account, or our support.
              </p>
              <p className="mt-3">
                <strong className="text-white">What we send:</strong> new exclusive-variant drops,
                restock alerts, live-show and Whatnot stream alerts, and personalized collector offers
                based on what you buy or ask us about. These are recurring automated promotional and
                personalized marketing messages. Message frequency varies. Message and data rates may
                apply — those are charged by your mobile carrier, not by us.
              </p>
              <p className="mt-3">
                <strong className="text-white">How to stop:</strong> reply{" "}
                <strong className="text-white">STOP</strong> to any message to opt out at any time, or{" "}
                <strong className="text-white">HELP</strong> for help. You can also email{" "}
                <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">
                  support@cbbst.com
                </a>{" "}
                and ask us to remove your number. We process opt-outs on receipt, send a single
                confirmation that you have been unsubscribed, and stop sending marketing texts to that
                number. We keep a record of the opt-out so it is not undone by a later import.
              </p>
              <p className="mt-3">
                <strong className="text-white">What we keep as proof of consent:</strong> whether you
                checked the box, the date and time you checked it, the page and form you checked it on,
                the version of the disclosure shown to you, the phone number you gave, and the IP
                address of the submission. We keep it for as long as you are enrolled and for a
                reasonable period afterward to show the opt-in was valid.
              </p>
              <p className="mt-3">
                <strong className="text-white">
                  No mobile information will be sold or shared with third parties or affiliates for
                  marketing or promotional purposes.
                </strong>{" "}
                Your mobile number and your SMS consent are excluded from the advertising and
                marketing disclosures described above. Service providers — our messaging platform and mobile
                carriers — process this information only to deliver the program on our behalf, and may
                not use it for anything else. We may also disclose it if the law requires it.
              </p>
              <p className="mt-3 text-white/60 text-sm">
                The full program terms are in our{" "}
                <a href="/terms" className="text-cbbst-gold hover:underline">
                  Terms of Service
                </a>
                .
              </p>
            </Block>

            <Block title="Your rights">
              <p>Depending on where you live, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong className="text-white">Access</strong> — request what personal data we hold on you</li>
                <li><strong className="text-white">Delete</strong> — request removal of your information</li>
                <li><strong className="text-white">Correct</strong> — fix inaccurate information</li>
                <li><strong className="text-white">Port</strong> — receive a copy of your data or transfer it</li>
                <li><strong className="text-white">Restrict</strong> — limit how we process your data</li>
                <li><strong className="text-white">Withdraw consent</strong> — retract permission you previously gave</li>
                <li><strong className="text-white">Appeal</strong> — challenge a denial decision</li>
                <li><strong className="text-white">Opt out</strong> — of promotional emails and targeted ads</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email{" "}
                <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">
                  support@cbbst.com
                </a>.
              </p>
            </Block>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-cbbst-dark2 border border-white/10 p-6 sm:p-8">
      <h2 className="text-white font-black text-2xl italic mb-4">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
