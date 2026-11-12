"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  sendShopifyAnalytics,
  getClientBrowserParameters,
  useShopifyCookies,
  AnalyticsEventName,
  AnalyticsPageType,
  ShopifySalesChannel,
} from "@shopify/hydrogen-react";

/**
 * Feeds the headless storefront's traffic back into SHOPIFY'S OWN Analytics
 * dashboard (Online store sessions / visitors / behaviour) — the same numbers a
 * native Shopify theme would report. Fires a Shopify PAGE_VIEW on every route
 * change and sets the _shopify_y / _shopify_s session cookies so visits are
 * counted (and can attribute to the order at checkout).
 */
const SHOP_ID = "gid://shopify/Shop/92291367192";

function pageTypeFor(path: string): string {
  if (path === "/") return AnalyticsPageType.home;
  if (path.startsWith("/products/")) return AnalyticsPageType.product;
  if (path.startsWith("/search")) return AnalyticsPageType.search;
  const collectionRoots = ["/products", "/exclusives", "/graded", "/tcg", "/original-art", "/supplies"];
  if (collectionRoots.some((p) => path === p || path.startsWith(p + "/"))) return AnalyticsPageType.collection;
  return AnalyticsPageType.page;
}

export default function ShopifyAnalytics() {
  // Sets the Shopify analytics cookies so sessions/visitors are counted.
  useShopifyCookies({ hasUserConsent: true, domain: "" });
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload: {
        ...getClientBrowserParameters(),
        hasUserConsent: true,
        shopId: SHOP_ID,
        currency: "USD",
        acceptedLanguage: "EN",
        shopifySalesChannel: ShopifySalesChannel.headless,
        pageType: pageTypeFor(pathname),
      },
    });
  }, [pathname]);

  return null;
}
