import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import TrackOrderForm from "@/components/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Your Order | CBBST",
  description: "Find your order, get a tracking update, or report a missing package.",
};

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-cbbst-dark text-white">
        <PageHero
          tag="TRACK YOUR ORDER"
          title="Where's my book?"
          desc="Look up your order, get tracking, or escalate a delay."
        />
        <section className="py-16 px-6">
          <div className="max-w-xl mx-auto bg-cbbst-dark2 border border-white/10 p-8">
            <TrackOrderForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
