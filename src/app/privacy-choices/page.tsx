import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Your Privacy Choices | CBBST",
  description: "Opt out of the sale or sharing of your personal information.",
};

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-cbbst-dark text-white">
        <PageHero
          tag="YOUR PRIVACY CHOICES"
          title="Opt out."
          desc="Limit how your personal information is sold or shared."
        />
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto bg-cbbst-dark2 border border-white/10 p-8 space-y-5 text-white/75 leading-relaxed">
            <p>
              Under California (CCPA), Colorado, Connecticut, and Virginia law (among others), you have the right to opt out of the sale or sharing of your personal information.
            </p>
            <p>
              To exercise this right, email{" "}
              <a href="mailto:support@cbbst.com" className="text-cbbst-gold hover:underline">
                support@cbbst.com
              </a>{" "}
              with the subject line <strong className="text-white">&ldquo;Opt Out — Sale/Sharing&rdquo;</strong> and include the email address associated with your account.
            </p>
            <p className="text-white/55 text-sm">
              We&apos;ll confirm receipt within 10 business days and process the request within 45 days.
            </p>
            <a
              href="mailto:support@cbbst.com?subject=Opt%20Out%20%E2%80%94%20Sale%2FSharing"
              className="block text-center bg-cbbst-red hover:bg-cbbst-red-dark text-white font-black text-sm tracking-[0.25em] py-4 transition-colors"
            >
              EMAIL OPT-OUT REQUEST →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
