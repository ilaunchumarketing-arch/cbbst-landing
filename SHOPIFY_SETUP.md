# Turning on real Shopify checkout (headless / hybrid)

This site is the **storefront**; Shopify stays the **backend** (catalog of record,
hosted checkout, payments, fulfillment). Customers browse here → click checkout →
get handed to Shopify's secure hosted checkout. **The live Liquid theme is never touched.**

The integration is already built and **dormant**. It turns on the moment the two
env vars below are present. Until then the site uses the in-app demo checkout.

## 1. Create a Storefront API token (≈5 min, no code)

In Shopify Admin:

1. **Settings → Apps and sales channels → Develop apps** → *Create an app* (name it `CBBST Headless`).
2. Open the app → **Configuration → Storefront API** → enable:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts` (and read checkouts)
   - `unauthenticated_read_product_inventory` (optional)
3. **Install app** → copy the **Storefront API access token**.
4. Note your **`xxxxx.myshopify.com`** domain.

## 2. Add the env vars

Local (`.env.local`) and Vercel (Project → Settings → Environment Variables):

```
SHOPIFY_STORE_DOMAIN=xxxxx.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=<storefront token>
```

Redeploy. Done — Add to Cart → checkout now creates a real Shopify cart and
redirects to Shopify's hosted checkout.

## How it maps products

`/api/checkout` resolves each cart line to a Shopify variant by:
- **product handle = our product `slug`** (e.g. `absolute-batman-21-aaron-bartling-exclusive-variant`), then
- **variant by label** (e.g. "Trade Foil", "Virgin", "CGC 9.8 Blue Label"), with a fuzzy fallback.

If a product's Shopify handle differs from our slug, add a mapping (a `shopifyHandle`
field on the product) — flag any mismatches after the first live test.

## Files

- `src/lib/shopify.ts` — Storefront client, variant resolver, cart→checkoutUrl.
- `src/app/api/checkout/route.ts` — builds the cart, returns the hosted checkout URL (501 when not configured).
- `src/components/cart/CheckoutButton.tsx` — posts the cart, redirects, falls back to demo.
