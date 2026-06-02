import type { MediaItem, MediaType } from "./content";

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
