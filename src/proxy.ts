import { NextResponse, type NextRequest } from "next/server";

/**
 * Legacy product URL rescue (added 2026-11-12).
 * Some old Shopify handles / shared links end in an emoji (e.g. "...-exclusive-🔥").
 * Next puts the raw slug into the x-next-cache-tags response header, and non-ASCII
 * characters there crash the render (500 "Invalid character in header content").
 * Strip non-ASCII characters from the slug and 308 to the clean URL, which resolves.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return NextResponse.next();
  }
  const match = decoded.match(/^\/products\/(.+)$/);
  if (!match) return NextResponse.next();
  const slug = match[1];
  if (/^[\x20-\x7E]*$/.test(slug)) return NextResponse.next();

  const clean = slug
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!clean) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/products/${clean}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/products/:path*",
};
