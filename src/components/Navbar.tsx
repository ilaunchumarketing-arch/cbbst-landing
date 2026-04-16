"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "ALL PRODUCTS", href: "/products" },
  { label: "EXCLUSIVES", href: "/products?cat=exclusives" },
  { label: "GRADED COMICS", href: "/products?cat=graded" },
  { label: "SUPPLIES", href: "/products?cat=supplies" },
  { label: "CONTACT US", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-cbbst-dark/80 backdrop-blur-md border-b border-white/5">
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
        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`text-xs font-bold tracking-wider transition-colors ${
                  link.label === "HOME"
                    ? "text-cbbst-red"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <button className="text-white/70 hover:text-white hidden sm:block">
            <Search size={18} />
          </button>
          <button className="text-white/70 hover:text-white hidden sm:block">
            <User size={18} />
          </button>
          <Link
            href="/cart"
            className="bg-cbbst-red hover:bg-cbbst-red-dark text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <ShoppingCart size={14} />
            CART
          </Link>
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
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
              className="block py-3 text-sm font-bold tracking-wider text-white/80 hover:text-cbbst-red border-b border-white/5"
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
