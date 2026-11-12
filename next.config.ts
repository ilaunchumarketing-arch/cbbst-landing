import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel image optimization is unavailable on this account (/_next/image
    // returns 402), which breaks any product photo whose optimizer cache entry
    // misses — new drops first. Serve originals instead.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cbbst.com", pathname: "/cdn/shop/**" },
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
    ],
  },

  // ── Order-link rescue (added 2026-06-13) ─────────────────────────────────
  // cbbst.com is now the headless Next.js storefront (Vercel); the Shopify
  // order-status / customer-account pages live on the Shopify-hosted domain
  // comicbookbuyselltrade.com. Confirmation-email "View order" links pointing at
  // cbbst.com (a leftover from when cbbst.com was Shopify-served) 404 here. These
  // forward those Shopify paths to the working Shopify domain, preserving the
  // path + token/key query string (Next.js passes query through automatically).
  // The app has no real /orders or /account routes, so there's no collision.
  // Temporary (307) on purpose so it's cleanly reversible once the Shopify-side
  // domain config is corrected (the real fix).
  async redirects() {
    return [
      { source: "/orders/:path*", destination: "https://comicbookbuyselltrade.com/orders/:path*", permanent: false },
      // /{shop_id}/orders/{token}/authenticate?key=… — shop_id is numeric
      { source: "/:shopid(\\d+)/orders/:path*", destination: "https://comicbookbuyselltrade.com/:shopid/orders/:path*", permanent: false },
      { source: "/account", destination: "https://comicbookbuyselltrade.com/account", permanent: false },
      { source: "/account/:path*", destination: "https://comicbookbuyselltrade.com/account/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
