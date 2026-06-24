import type { MediaItem, MediaType, PortfolioItem } from "./content";

/**
 * Content API client.
 *
 * When `NEXT_PUBLIC_API_BASE_URL` is set, media is fetched from the live
 * backend (`GET {base}/content?category=…&is_active=true`). When it is unset,
 * the site serves built-in placeholder media so the UI is fully previewable
 * before the backend exists. Flipping to the real backend is a one-line env
 * change — no component edits required.
 */
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

/**
 * Base URL for served media. The portfolio API returns each image as a storage
 * `key` (e.g. "portfolio/<uuid>.jpg"); we resolve it against this base to get a
 * viewable URL. When unset, cards fall back to their cinematic tone background.
 */
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "");

function resolveImageUrl(
  image?: { key?: string; url?: string } | null,
): string | undefined {
  if (!image) return undefined;
  if (image.url) return image.url; // backend already gave us a URL
  if (!image.key) return undefined;
  if (/^https?:\/\//.test(image.key)) return image.key; // key is already absolute
  return MEDIA_BASE ? `${MEDIA_BASE}/${image.key}` : undefined;
}

/** Case-insensitive match of a portfolio item's category against a slug. */
function matchesCategory(itemCategory: string | undefined, slug: string): boolean {
  return (itemCategory ?? "").toLowerCase() === slug.toLowerCase();
}

function normalize(items: MediaItem[]): MediaItem[] {
  return items
    .filter((m) => m.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function getMediaByCategory(category: string): Promise<MediaItem[]> {
  if (!BASE) return placeholderMedia(category);

  const url = new URL(`${BASE}/content`);
  url.searchParams.set("category", category);
  url.searchParams.set("is_active", "true");

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to load media for "${category}" (${res.status})`);
  }

  const data: unknown = await res.json();
  // Tolerate both a bare array and a `{ items: [...] }` envelope.
  const items = Array.isArray(data)
    ? (data as MediaItem[])
    : ((data as { items?: MediaItem[] }).items ?? []);

  return normalize(items);
}

/* ---------- public portfolio ---------- */

/**
 * Raw portfolio photo as returned by `GET /api/v1/public/gallery`.
 * The backend stores the image as flat `image_key` / `image_url` fields.
 */
interface PortfolioApiItem {
  title: string;
  description?: string;
  image_key?: string;
  image_url?: string;
  category?: string;
  tags?: string[];
}

/**
 * Public portfolio gallery (`GET /api/v1/public/gallery`).
 *
 * The backend returns ALL active photos (sorted by sort_order); it does not
 * filter by category server-side. Pass `category` to filter client-side to a
 * single service slug — used by the service detail pages.
 */
export async function getPortfolio(category?: string): Promise<PortfolioItem[]> {
  if (!BASE) {
    const all = placeholderPortfolio();
    return category
      ? all.filter((p) => matchesCategory(p.category, category))
      : all;
  }

  const url = `${BASE}/api/v1/public/gallery`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to load portfolio (${res.status})`);
  }

  const data: unknown = await res.json();
  // Tolerate the `{ ok, data: [...] }` envelope or a bare array.
  const items = extractPortfolio(data);

  return items
    .filter((p) => !category || matchesCategory(p.category, category))
    .map((p) => ({
      title: p.title,
      description: p.description,
      url: resolveImageUrl({ key: p.image_key, url: p.image_url }),
      category: p.category,
      tags: p.tags,
    }));
}

function extractPortfolio(data: unknown): PortfolioApiItem[] {
  if (Array.isArray(data)) return data as PortfolioApiItem[];
  if (data && typeof data === "object") {
    // `{ ok: true, data: [...] }` is the standard apiResponse envelope.
    const root = data as { data?: unknown; portfolio?: unknown };
    const list = root.data ?? root.portfolio;
    if (Array.isArray(list)) return list as PortfolioApiItem[];
  }
  return [];
}

/* ---------- placeholder portfolio (used until the backend is live) ---------- */

const PORTFOLIO_TEMPLATE: ReadonlyArray<{ title: string; category: string }> = [
  { title: "The Vow", category: "Wedding" },
  { title: "Habesha", category: "Portrait" },
  { title: "Mercato", category: "Commercial" },
  { title: "First Look", category: "Wedding" },
  { title: "Studio No.7", category: "Portrait" },
  { title: "Founders", category: "Commercial" },
];

function placeholderPortfolio(): PortfolioItem[] {
  return PORTFOLIO_TEMPLATE.map((t) => ({
    title: t.title,
    category: t.category,
  }));
}

/* ---------- placeholder media (used until the backend is live) ---------- */

const PLACEHOLDER_TEMPLATE: ReadonlyArray<{ title: string; type: MediaType }> = [
  { title: "Opening Frame", type: "reel" },
  { title: "First Light", type: "image" },
  { title: "The Ceremony", type: "video" },
  { title: "Golden Hour", type: "image" },
  { title: "The Vows", type: "reel" },
  { title: "In the Details", type: "image" },
  { title: "The Toast", type: "video" },
  { title: "Last Dance", type: "reel" },
  { title: "Portrait No.7", type: "image" },
];

function placeholderMedia(category: string): MediaItem[] {
  const now = new Date(0).toISOString();
  return normalize(
    PLACEHOLDER_TEMPLATE.map((t, i) => ({
      _id: `${category}-${i + 1}`,
      title: t.title,
      type: t.type,
      category,
      key: `placeholder/${category}/${i + 1}`,
      is_active: true,
      sort_order: i,
      created_at: now,
      updated_at: now,
    })),
  );
}
