import type { Metadata } from "next";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";

export const metadata: Metadata = {
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cbbst-dark text-foreground">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
