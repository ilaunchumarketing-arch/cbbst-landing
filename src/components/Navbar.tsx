"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import SearchBar from "@/components/SearchBar";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "ALL PRODUCTS", href: "/products" },
  { label: "EXCLUSIVES", href: "/exclusives" },
  { label: "NYCC EXCLUSIVES", href: "/nycc-exclusives" },
  { label: "GRADED COMICS", href: "/graded" },
  { label: "TCG", href: "/tcg" },
  { label: "ORIGINAL ART", href: "/original-art" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openCart, count } = useCart();

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-cbbst-dark/85 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo_dark.jpg"
            alt="Comic Book Buy-Sell-Trade"
            width={80}
            height={60}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-3 xl:gap-5">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-[11px] font-black tracking-[0.1em] xl:tracking-[0.2em] whitespace-nowrap transition-colors text-white/80 hover:text-cbbst-red"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          <Link href="/track-order" className="text-white/70 hover:text-white hidden sm:block" aria-label="Track your order">
            <User size={18} />
          </Link>
          <button
            onClick={openCart}
            className="relative bg-cbbst-red hover:bg-cbbst-red-dark text-white text-xs font-black tracking-widest px-4 py-2 rounded flex items-center gap-2 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={14} />
            CART
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-cbbst-gold text-black text-[10px] font-black rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-cbbst-dark2 border-t border-white/10 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block py-3 text-sm font-black tracking-[0.2em] text-white/80 hover:text-cbbst-red border-b border-white/5"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
