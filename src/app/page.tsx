import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatNotBanner from "@/components/WhatNotBanner";
import TrustBadges from "@/components/TrustBadges";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhatNotCTA from "@/components/WhatNotCTA";
import CollectionCards from "@/components/CollectionCards";
import Reviews from "@/components/Reviews";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <WhatNotBanner />
        <TrustBadges />
        <FeaturedProducts />
        <WhatNotCTA />
        <CollectionCards />
        <Reviews />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
