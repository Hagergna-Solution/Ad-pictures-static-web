import type { MediaItem, MediaType, PortfolioItem, Film } from "./content";
import {
  FILMS,
  RECENT_FILMS,
  REEL_TONES,
  R2_BASE,
  CURATED_STILLS,
} from "./content";

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

/* ============================================================
   public portfolio — ONE endpoint for everything
   ------------------------------------------------------------
   GET /api/v1/public/portfolio
     ?category=wedding   → filter by category   (server-side)
     ?front=true         → only featured items  (server-side)
   Response: { success, data: { portfolio: [ item, ... ] } }
   Each item has a cover `image` plus a `media[]` array whose
   entries are tagged `kind: "image" | "video" | "reel"`.
   `getPortfolio` maps each item to its cover still; `getReels`
   pulls the featured items and extracts their reel-kind media.
   ============================================================ */

const PORTFOLIO_ENDPOINT = "/api/v1/public/portfolio";

type MediaKind = "image" | "video" | "reel";

interface PortfolioMedia {
  kind: MediaKind;
  key?: string;
  url?: string;
}

/** Raw portfolio item from the public endpoint. */
interface PortfolioApiItem {
  title?: string;
  description?: string;
  /** Primary cover image (may be null). */
  image?: { key?: string; url?: string } | null;
  media?: PortfolioMedia[];
  category?: string;
  tags?: string[];
  /** Featured / show-on-landing flag. */
  front?: boolean;
}

/** Single fetch of the public portfolio, with optional server-side filters. */
async function fetchPortfolio(params?: {
  category?: string;
  front?: boolean;
}): Promise<PortfolioApiItem[]> {
  const url = new URL(`${BASE}${PORTFOLIO_ENDPOINT}`);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.front) url.searchParams.set("front", "true");

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to load portfolio (${res.status})`);
  }

  const data: unknown = await res.json();
  return extractPortfolio(data);
}

/** Unwrap `{ success, data: { portfolio } }`, `{ data }`, `{ portfolio }`, or a bare array. */
function extractPortfolio(data: unknown): PortfolioApiItem[] {
  if (Array.isArray(data)) return data as PortfolioApiItem[];
  if (data && typeof data === "object") {
    const root = data as {
      data?: { portfolio?: unknown } | unknown;
      portfolio?: unknown;
    };
    const nested = (root.data as { portfolio?: unknown } | undefined)?.portfolio;
    const list = nested ?? root.data ?? root.portfolio;
    if (Array.isArray(list)) return list as PortfolioApiItem[];
  }
  return [];
}

/** A portfolio item's representative still: its cover, else its first image. */
function portfolioStill(p: PortfolioApiItem): string | undefined {
  const cover = resolveImageUrl(p.image);
  if (cover) return cover;
  return resolveImageUrl(p.media?.find((m) => m.kind === "image"));
}

/* ---------- public portfolio (stills) ---------- */

/**
 * Portfolio stills. Each item becomes one card using its cover image; items
 * with no usable image are dropped. Pass a `category` (service slug) to filter
 * server-side — used by the service detail pages.
 */
export async function getPortfolio(category?: string): Promise<PortfolioItem[]> {
  const fallback = () => {
    const all = placeholderPortfolio();
    return category
      ? all.filter((p) => matchesCategory(p.category, category))
      : all;
  };

  if (!BASE) return fallback();

  let items: PortfolioApiItem[];
  try {
    items = await fetchPortfolio(category ? { category } : undefined);
  } catch {
    // Backend slow/unreachable (e.g. cold start) — keep the page renderable.
    return fallback();
  }

  const mapped = items
    .map((p) => ({
      title: p.title ?? "",
      description: p.description,
      url: portfolioStill(p),
      category: p.category,
      tags: p.tags,
    }))
    .filter((p) => Boolean(p.url));

  // Live items lead; the curated frames follow so the sheet is full and
  // consistently good even while the backend catalogue is still small.
  return [...mapped, ...curatedStills(category)];
}

/** The curated frames, filtered to a service slug when one is in play. */
function curatedStills(category?: string): PortfolioItem[] {
  return category
    ? CURATED_STILLS.filter((s) => matchesCategory(s.category, category))
    : CURATED_STILLS;
}

/* ---------- public reels (landing-page films) ---------- */

/**
 * Portrait poster frames that suit the 9:16 reel cards. Used as the resting
 * still when a backend item has no cover image of its own.
 */
const REEL_COVERS: readonly string[] = [
  `${R2_BASE}/posters/img_1561-poster.jpg`,
  `${R2_BASE}/posters/img_1745-poster.jpg`,
  `${R2_BASE}/posters/img_0493-poster.jpg`,
  `${R2_BASE}/posters/img_1747-poster.jpg`,
  `${R2_BASE}/posters/img_1558-poster.jpg`,
  `${R2_BASE}/posters/img_3147-poster.jpg`,
  `${R2_BASE}/posters/img_1603-poster.jpg`,
];

/**
 * Landing-page reels: the featured items (`?front=true`), expanded into one
 * reel per `kind: "reel"` media entry. Each reel's cover is its item's cover
 * image, falling back to a static upload. Falls back to the built-in reels
 * until the backend is live so the landing page stays populated.
 */
export async function getReels(): Promise<Film[]> {
  const fallback = () => [...FILMS, ...RECENT_FILMS];
  if (!BASE) return fallback();

  let items: PortfolioApiItem[];
  try {
    items = await fetchPortfolio({ front: true });
  } catch {
    // Backend slow/unreachable — show the built-in reels rather than nothing.
    return fallback();
  }

  const reels: Film[] = [];
  for (const item of items) {
    const cover = resolveImageUrl(item.image);
    for (const m of item.media ?? []) {
      if (m.kind !== "reel") continue;
      const src = resolveImageUrl(m);
      if (!src) continue; // a reel with no playable video is unusable
      const i = reels.length;
      reels.push({
        src,
        poster: cover ?? REEL_COVERS[i % REEL_COVERS.length],
        title: item.title ?? `Reel ${i + 1}`,
        category: item.category ?? "Film",
        tone: REEL_TONES[i % REEL_TONES.length],
        exif: "4K · 24FPS",
      });
    }
  }
  // Backend reachable but has no featured reels yet — fall back to the
  // built-in R2 reels so the landing page is never empty.
  return reels.length ? reels : fallback();
}

/* ---------- placeholder portfolio (used until the backend is live) ---------- */

/** With no backend, the contact sheet is simply the curated frames. */
function placeholderPortfolio(): PortfolioItem[] {
  return [...CURATED_STILLS];
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
