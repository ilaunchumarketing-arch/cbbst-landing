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
import DropModal from "@/components/DropModal";
import { getHotDrops, getHeroDrops } from "@/lib/shopify";

export default async function Home() {
  // Live "HOT RIGHT NOW" tiles — newest in-stock exclusives with known print runs.
  // heroDrops = the newest books PUBLISHED to the store, newest first; heroDrops[0] leads
  // the whole banner (cover, badge, countdown, callout, backdrop). Both are Shopify-driven,
  // so a new drop takes over the top of the site without a code change.
  const [hotDrops, heroDrops] = await Promise.all([getHotDrops(4), getHeroDrops(6)]);
  return (
    <>
      {/* Fires 900ms after load OVER the hero and locks scroll — it must show the SAME
          lead drop as the banner underneath it. */}
      <DropModal drops={heroDrops} />
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection hotDrops={hotDrops} heroDrops={heroDrops} />
        <TrustBadges />
        <FeaturedProducts />
        <WhatNotBanner />
        <WhatNotCTA />
        <CollectionCards />
        <Reviews />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
