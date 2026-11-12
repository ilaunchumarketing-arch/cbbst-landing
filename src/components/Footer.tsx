import Link from "next/link";
import Image from "next/image";

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/share/g/1AH8UQi9yQ/", external: true },
  { label: "Instagram", href: "https://www.instagram.com/comicbook_buy_sell_trade", external: true },
  { label: "WhatNot", href: "https://www.whatnot.com/user/cbbst", external: true },
];

const aboutLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Become an Affiliate", href: "https://af.uppromote.com/comic-book-buy-sell-trade/register", external: true },
  { label: "Your Privacy Choices", href: "/privacy-choices" },
];

const shoppingLinks = [
  { label: "All Products", href: "/products" },
  { label: "Exclusives", href: "/exclusives" },
  { label: "Graded Comics", href: "/graded" },
  { label: "TCG & Collectibles", href: "/tcg" },
  { label: "Original Art", href: "/original-art" },
  { label: "Supplies", href: "/supplies" },
];

const quickLinks = [
  { label: "Track Your Order", href: "/track-order" },
  { label: "FAQ's", href: "/faq" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

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
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target={s.external ? "_blank" : undefined}
                rel={s.external ? "noopener noreferrer" : undefined}
                className="text-white/30 hover:text-cbbst-red text-xs transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <FooterColumn title="ABOUT US" links={aboutLinks} />
        <FooterColumn title="START SHOPPING" links={shoppingLinks} />
        <FooterColumn title="QUICK LINKS" links={quickLinks} />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 pt-6 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <p className="text-white/20 text-[10px] tracking-wider">
          &copy; 2026 Comic Book Buy-Sell-Trade (CBBST). All rights reserved.
        </p>
        <p className="text-white/20 text-[10px] tracking-wider">
          support@cbbst.com
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h4 className="text-white font-bold text-xs tracking-wider mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="text-white/40 hover:text-white text-xs transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
