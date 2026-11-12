import type { Metadata } from "next";
import { Anton, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import MetaPixel from "@/components/MetaPixel";
import ShopifyAnalytics from "@/components/ShopifyAnalytics";
import { CartProvider } from "@/components/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

/**
 * Per-drop display voices. A book's cover decides which one its type is set in
 * (David 2026-08-25: "when they swipe the font should change according to the image
 * shown") — the mapping lives on each theme in products.ts as `voice`, so it is data,
 * not a per-component choice.
 *
 *   impact → Anton: heavy condensed poster type, the superhero/logo voice.
 *   blade  → Playfair Display: high-contrast sharp serif, the assassin/shadow voice.
 *
 * Self-hosted by next/font (no external request, no layout shift). Books with no
 * `voice` keep the site's default sans, so nothing else on the site changes.
 */
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-impact",
});

const playfair = Playfair_Display({
  weight: ["700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-blade",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cbbst-site.vercel.app"),
  title: "CBBST – Comic Book Buy-Sell-Trade",
  description:
    "Your ultimate source for exclusive variants, CGC graded slabs, and rare key issues. Built by collectors, for collectors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${anton.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col bg-cbbst-dark text-foreground">
        <MetaPixel />
        <ShopifyAnalytics />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
