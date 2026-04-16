import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        {/* Brand */}
        <div>
          <Image
            src="/images/logo_dark.jpg"
            alt="CBBST"
            width={100}
            height={75}
            className="object-contain mb-4"
          />
          <p className="text-white/40 text-xs leading-relaxed mb-4">
            Your trusted marketplace for rare comics, exclusive variants, and
            graded slabs. Built by collectors, for collectors.
          </p>
          <div className="flex gap-3">
            {["Facebook", "Instagram", "WhatNot", "TikTok"].map((s) => (
              <Link
                key={s}
                href="#"
                className="text-white/30 hover:text-cbbst-red text-xs transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* About Us */}
        <div>
          <h4 className="text-white font-bold text-xs tracking-wider mb-4">
            ABOUT US
          </h4>
          <ul className="space-y-2">
            {[
              { label: "About Us", href: "/" },
              { label: "Contact Us", href: "/contact" },
              { label: "Become an Affiliate", href: "/" },
              { label: "Your Privacy Choices", href: "/" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-white/40 hover:text-white text-xs transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Start Shopping */}
        <div>
          <h4 className="text-white font-bold text-xs tracking-wider mb-4">
            START SHOPPING
          </h4>
          <ul className="space-y-2">
            {[
              { label: "All Products", href: "/products" },
              { label: "Exclusives", href: "/products?cat=exclusives" },
              { label: "Graded Comics", href: "/products?cat=graded" },
              { label: "Supplies", href: "/products?cat=supplies" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-white/40 hover:text-white text-xs transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-xs tracking-wider mb-4">
            QUICK LINKS
          </h4>
          <ul className="space-y-2">
            {[
              "Track Your Order",
              "FAQ's",
              "Shipping Policy",
              "Privacy Policy",
              "Terms of Service",
            ].map((label) => (
              <li key={label}>
                <Link
                  href="#"
                  className="text-white/40 hover:text-white text-xs transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 pt-6">
        <p className="text-white/20 text-[10px] text-center tracking-wider">
          &copy; 2025 Comic Book Buy-Sell-Trade (CBBST). All rights reserved. |
          Powered by Shopify
        </p>
      </div>
    </footer>
  );
}
