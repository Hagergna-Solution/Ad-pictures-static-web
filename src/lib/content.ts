export type Tone = "warm" | "cool" | "red" | "high" | "low";

export interface Film {
  src: string;
  title: string;
  category: string;
  tone: Tone;
  exif: string;
  /**
   * Still frame ("front" cover) shown on the card/hero until the reel plays.
   * Optional: dynamic reels from the backend may not always carry a cover.
   */
  poster?: string;
  /**
   * Focal point for the hero crop, as a CSS `object-position` value. These are
   * 9:16 reels shown in a 16:9 frame, so most of the height is cropped away —
   * each clip needs its own answer to "which band of the frame holds the shot".
   * Defaults to the CSS value when omitted.
   */
  focus?: string;
  /**
   * Seconds into the reel where the hero should enter. Lets the hero open on
   * the strongest moment rather than whatever the first frame happens to be.
   */
  start?: number;
}

/** Tone cycle used to give dynamic reels a cinematic resting gradient. */
export const REEL_TONES: Tone[] = ["warm", "red", "low", "cool", "high"];

/** Public R2 bucket serving all static media (videos, posters, images). */
export const R2_BASE =
  "https://pub-c0978e7f876342f9af3932f1f3952107.r2.dev/assets/v1";

/**
 * Featured reels — the 9:16 cards under "Recent reels".
 *
 * Every one of these is a native 720×1280 portrait master, so the card shows the
 * frame the way it was shot: no crop, no rotation, no upscale. Clips carrying a
 * burned-in studio watermark (`img_3146`, `img_3149`, `img_1614`) are left out —
 * a logo stamped across the middle of a 9:16 card is the first thing the eye
 * lands on.
 */
export const FILMS: Film[] = [
  { src: `${R2_BASE}/videos/img_1561-720.mp4`, title: "The Bride", category: "Wedding Film", tone: "warm", exif: "4K · 24FPS · T2.1", poster: `${R2_BASE}/posters/img_1561-poster.jpg` },
  { src: `${R2_BASE}/videos/img_1745-720.mp4`, title: "Grand Entrance", category: "Event Film", tone: "red", exif: "4K · 24FPS · T2.8", poster: `${R2_BASE}/posters/img_1745-poster.jpg` },
  { src: `${R2_BASE}/videos/img_0493-720.mp4`, title: "Gold & White", category: "Wedding Film", tone: "low", exif: "4K · 24FPS · T2.1", poster: `${R2_BASE}/posters/img_0493-poster.jpg` },
  { src: `${R2_BASE}/videos/img_1747-720.mp4`, title: "First Light", category: "Wedding Film", tone: "cool", exif: "4K · 24FPS · T2.4", poster: `${R2_BASE}/posters/img_1747-poster.jpg` },
];

/**
 * Hero rotation — its own cut, drawn from the landscape 16:9 masters rather
 * than the vertical reels above.
 *
 * The split is deliberate: a 9:16 reel in a full-bleed hero loses most of its
 * height to the crop, while these 1280×720 films fill the frame edge to edge at
 * native shape — no crop, no upscale, so the hero stays sharp. The vertical
 * reels keep the 9:16 cards downpage, where their shape is the right one.
 *
 * Ordered for impact: the wide golden-hour frame opens (its empty left side is
 * where the headline sits), then the black-and-white portrait, then the
 * ceremony detail.
 *
 * Two of the landscape masters are deliberately not here. `img_1575` carries a
 * burned-in studio end-card (logo and phone numbers) that lands mid-frame,
 * straight across the headline; `img_2815` is letterboxed to 2.39:1 inside its
 * 720p frame, so filling a hero with it means either visible black bars or a
 * punch-in past what 720p can carry. Both are fine downpage — neither survives
 * full-bleed. Re-exported clean, either would slot straight in here.
 */
export const HERO_FILMS: Film[] = [
  { src: `${R2_BASE}/videos/img_1998-720.mp4`, title: "Golden Hour", category: "Wedding Film", tone: "warm", exif: "4K · 24FPS · T2.8", poster: `${R2_BASE}/posters/img_1998-poster.jpg` },
  { src: `${R2_BASE}/videos/img_2003-720.mp4`, title: "The Vow", category: "Wedding Film", tone: "low", exif: "4K · 24FPS · T1.8", poster: `${R2_BASE}/posters/img_2003-poster.jpg` },
  { src: `${R2_BASE}/videos/img_1581-720.mp4`, title: "The Blessing", category: "Wedding Film", tone: "red", exif: "4K · 24FPS · T2.4", poster: `${R2_BASE}/posters/img_1581-poster.jpg` },
];

/**
 * "More moments" — four further portrait masters, so the second rail is genuinely
 * different footage rather than the featured four relabelled.
 */
export const RECENT_FILMS: Film[] = [
  { src: `${R2_BASE}/videos/img_1558-720.mp4`, title: "The Veil", category: "Wedding Film", tone: "high", exif: "4K · 24FPS · T2.0", poster: `${R2_BASE}/posters/img_1558-poster.jpg` },
  { src: `${R2_BASE}/videos/img_3147-720.mp4`, title: "Habesha", category: "Event Film", tone: "cool", exif: "4K · 24FPS · T2.2", poster: `${R2_BASE}/posters/img_3147-poster.jpg` },
  { src: `${R2_BASE}/videos/img_1603-720.mp4`, title: "The Send-Off", category: "Wedding Film", tone: "warm", exif: "4K · 24FPS · T2.8", poster: `${R2_BASE}/posters/img_1603-poster.jpg` },
  { src: `${R2_BASE}/videos/img_1748-720.mp4`, title: "Night Drive", category: "Event Film", tone: "low", exif: "4K · 24FPS · T1.8", poster: `${R2_BASE}/posters/img_1748-poster.jpg` },
];

export interface Service {
  /** Backend `category` enum value — also the URL segment for the detail page. */
  slug: string;
  name: string;
  meta: string;
  /** Short line shown on the service detail page. */
  blurb: string;
}

export const SERVICES: Service[] = [
  {
    slug: "wedding",
    name: "Wedding Films",
    meta: "4K · 24fps · cinematic",
    blurb: "The whole day, directed and cut like a film — from the first look to the last dance.",
  },
  {
    slug: "event",
    name: "Event Coverage",
    meta: "24mm · f/2.8 · multi-cam",
    blurb: "Multi-camera coverage that keeps the energy of the room and the story of the night.",
  },
  {
    slug: "portrait",
    name: "Portraits",
    meta: "85mm · f/1.8 · studio",
    blurb: "Studio and on-location portraits — lit with intent, framed for keeps.",
  },
  {
    slug: "commercial",
    name: "Commercial",
    meta: "50mm · f/8 · brand",
    blurb: "Brand films and product stills built to sell the feeling, not just the thing.",
  },
  {
    slug: "reels",
    name: "Reels & Social",
    meta: "9:16 · vertical · edit",
    blurb: "Vertical, fast, made for the feed — the cinema people actually watch on their phones.",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/* ============================================================
   Backend media model
   Mirrors the public content document returned by the API.
   `uploaded_by` is intentionally omitted — it is hidden from
   public responses.
   ============================================================ */

export type MediaType = "reel" | "image" | "video";

export interface MediaItem {
  _id?: string;
  title: string;
  description?: string;
  /** Object key in SeaweedFS/S3 storage. */
  key: string;
  /** Direct or presigned URL. Absent until the backend provides one. */
  url?: string;
  type: MediaType;
  /** Backend `category` enum — matches a Service slug. */
  category: string;
  tags?: string[];
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export function isFilm(item: MediaItem): boolean {
  return item.type === "video" || item.type === "reel";
}

/* ============================================================
   Public portfolio item
   Mirrors `GET /api/v1/public/portfolio` (active items only).
   The API returns a nested `image: {key,url}` cover; `api.ts`
   resolves it to a single viewable `url`.
   ============================================================ */

export interface PortfolioItem {
  title: string;
  description?: string;
  /** Resolved image URL (storage key resolved against the media base). */
  url?: string;
  category?: string;
  tags?: string[];
  /**
   * Focal point for the 4:3 card crop, as a CSS `object-position`. Portrait
   * frames lose most of their height in a landscape card, so the ones that
   * matter say where to hold. Omitted for landscape stills, which need no help.
   */
  focus?: string;
}

/**
 * The contact sheet — hand-picked frames at their full 1280×720 / 720×1280
 * masters.
 *
 * Deliberately not the `images/*.webp` set: those top out between 360px and
 * 960px and most carry an @adpictures_ethio watermark burned into the corner,
 * which is fine for a feed and visibly rough in a card. These frames are clean
 * and roughly twice the resolution.
 */
export const CURATED_STILLS: PortfolioItem[] = [
  { title: "Golden Hour", category: "wedding", tags: ["wedding", "portrait"], url: `${R2_BASE}/posters/img_1998-poster.jpg` },
  { title: "The Bride", category: "wedding", tags: ["wedding", "portrait"], url: `${R2_BASE}/posters/img_1561-poster.jpg`, focus: "50% 32%" },
  { title: "The Vow", category: "wedding", tags: ["wedding", "film"], url: `${R2_BASE}/posters/img_2003-poster.jpg` },
  { title: "Grand Entrance", category: "event", tags: ["event", "portrait"], url: `${R2_BASE}/posters/img_1745-poster.jpg`, focus: "50% 28%" },
  { title: "The Blessing", category: "wedding", tags: ["wedding", "ceremony"], url: `${R2_BASE}/posters/img_1581-poster.jpg` },
  { title: "Habesha", category: "event", tags: ["event", "portrait"], url: `${R2_BASE}/posters/img_3147-poster.jpg`, focus: "50% 34%" },
  { title: "The Detail", category: "wedding", tags: ["wedding", "detail"], url: `${R2_BASE}/posters/img_1612-poster.jpg` },
  { title: "The Send-Off", category: "wedding", tags: ["wedding", "portrait"], url: `${R2_BASE}/posters/img_1603-poster.jpg`, focus: "50% 40%" },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "What does AD Pictures do?",
    a: "AD Pictures is a wedding and event film studio in Addis Ababa, Ethiopia. We produce cinematic wedding films, event coverage, portraits, commercial video and vertical social reels — directed, lit and edited like cinema.",
  },
  {
    q: "Where is AD Pictures located and what areas do you serve?",
    a: "Our studio is at Awlo Business Center, 3rd Floor, Bole Medhanialem, Addis Ababa. We film across Addis Ababa and all of Ethiopia, and we take on destination work on request.",
  },
  {
    q: "How do I book AD Pictures for my wedding or event?",
    a: "Message us on WhatsApp at +251988130030 with your date and location. We reply with availability, packages and a quote — usually within the hour.",
  },
  {
    q: "How far in advance should I book?",
    a: "For weddings we recommend booking 2–3 months ahead, and earlier for peak season, since dates are limited. Smaller shoots and events can often be arranged on shorter notice.",
  },
  {
    q: "Do you offer both video and photography?",
    a: "Yes. We shoot cinematic films and reels as well as portrait and event stills, so your day can be covered as both motion and photography by one team.",
  },
  {
    q: "What makes AD Pictures different?",
    a: "Every frame is planned before the shutter opens. With 10+ years behind the lens and 3,600+ stories told, we treat your day like a film — directing light, mood and story rather than just recording it.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'They didn’t just film our wedding — they <span class="red">told our story</span>. Every frame still makes us cry.',
    name: "Selam & Dawit",
    role: "Wedding · Addis Ababa",
    avatar: "S",
  },
  {
    quote: 'The reel went up and our bookings <span class="red">tripled</span> in a week. Pure cinema.',
    name: "Hana Tesfaye",
    role: "Event Brand",
    avatar: "H",
  },
  {
    quote: "Calm on set, magic in the edit. AD Pictures sees light like no one else.",
    name: "Yonas G.",
    role: "Commercial",
    avatar: "Y",
  },
];
