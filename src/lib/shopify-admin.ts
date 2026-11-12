// Shopify ADMIN API client — used ONLY for guest order tracking (order # + email).
//
// Why a second client: the Storefront API (see shopify.ts) can read the catalog
// and build a cart, but it CANNOT look up an arbitrary order by number + email —
// that requires the Admin API with the `read_orders` scope.
//
// Activates automatically once these env vars are set (otherwise order tracking
// reports "lookup unavailable" and the page points the customer to support — the
// site never crashes and the live Shopify theme/checkout is never touched):
//   SHOPIFY_STORE_DOMAIN   e.g. comic-book-buy-sell-trade.myshopify.com  (shared with shopify.ts)
//   SHOPIFY_ADMIN_TOKEN    Admin API access token (shpat_…) with read_orders scope
//
// Create the token in Shopify: Admin → Settings → Apps and sales channels →
// Develop apps → create app → Admin API integration → enable `read_orders` →
// Install → reveal the Admin API access token.

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = "2025-01";

/** True when the store domain + Admin token are both configured. */
export const adminConfigured = Boolean(DOMAIN && ADMIN_TOKEN);

export type TrackedOrder = {
  name: string;
  createdAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  fulfillments: {
    status: string | null;
    trackingCompany: string | null;
    trackingNumber: string | null;
    trackingUrl: string | null;
    estimatedDeliveryAt: string | null;
  }[];
  items: { title: string; quantity: number }[];
};

type AdminOrderNode = {
  name: string;
  email: string | null;
  createdAt: string;
  displayFinancialStatus: string | null;
  displayFulfillmentStatus: string | null;
  fulfillments: {
    status: string | null;
    estimatedDeliveryAt: string | null;
    trackingInfo: { number: string | null; url: string | null; company: string | null }[];
  }[];
  lineItems: { edges: { node: { title: string; quantity: number } }[] };
};

async function adminFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  if (!DOMAIN || !ADMIN_TOKEN) throw new Error("Shopify Admin API is not configured");
  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify Admin HTTP ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) throw new Error(`Shopify Admin GraphQL: ${JSON.stringify(json.errors)}`);
  return json.data as T;
}

const ORDER_QUERY = `query TrackOrder($q: String!) {
  orders(first: 5, query: $q) {
    edges {
      node {
        name
        email
        createdAt
        displayFinancialStatus
        displayFulfillmentStatus
        fulfillments(first: 10) {
          status
          estimatedDeliveryAt
          trackingInfo { number url company }
        }
        lineItems(first: 50) { edges { node { title quantity } } }
      }
    }
  }
}`;

/**
 * Look up an order by its number and the email used at checkout.
 *
 * Returns the order only when BOTH the number resolves AND the email matches
 * (case-insensitive) — so a stranger can't enumerate orders by guessing numbers.
 * Returns `null` when nothing matches (same response whether the number is wrong
 * or the email doesn't match — no information leak).
 */
export async function lookupOrder(rawOrderNumber: string, rawEmail: string): Promise<TrackedOrder | null> {
  const email = rawEmail.trim().toLowerCase();
  // Normalize "#CBBST-12345" / "CBBST-12345" / "#1001" / "1001" → a bare token to search on.
  const cleaned = rawOrderNumber.trim().replace(/^#/, "");
  if (!cleaned || !email) return null;

  // Search by the full token and the trailing digits, with and without the "#" prefix.
  const digits = (cleaned.match(/\d+/g)?.join("") ?? cleaned);
  const q = `name:#${cleaned} OR name:${cleaned} OR name:#${digits} OR name:${digits}`;

  const data = await adminFetch<{ orders: { edges: { node: AdminOrderNode }[] } }>(ORDER_QUERY, { q });
  const nodes = data.orders.edges.map((e) => e.node);

  // Verify the email matches before returning anything.
  const match = nodes.find((n) => (n.email ?? "").trim().toLowerCase() === email);
  if (!match) return null;

  return {
    name: match.name,
    createdAt: match.createdAt,
    financialStatus: match.displayFinancialStatus,
    fulfillmentStatus: match.displayFulfillmentStatus,
    fulfillments: (match.fulfillments ?? []).map((f) => {
      const t = f.trackingInfo?.[0];
      return {
        status: f.status,
        trackingCompany: t?.company ?? null,
        trackingNumber: t?.number ?? null,
        trackingUrl: t?.url ?? null,
        estimatedDeliveryAt: f.estimatedDeliveryAt ?? null,
      };
    }),
    items: (match.lineItems?.edges ?? []).map((e) => ({ title: e.node.title, quantity: e.node.quantity })),
  };
}
