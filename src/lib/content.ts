export type Tone = "warm" | "cool" | "red" | "high" | "low";

export interface Film {
  src: string;
  title: string;
  category: string;
  tone: Tone;
  exif: string;
}

// The four real vertical reels (1080×1920).
export const FILMS: Film[] = [
  { src: "/uploads/VID_20260531_075900_120.mp4", title: "The Vow", category: "Wedding Film", tone: "warm", exif: "4K · 24FPS · T2.1" },
  { src: "/uploads/VID_20260531_080025_723.mp4", title: "Grand Entrance", category: "Event Film", tone: "red", exif: "4K · 24FPS · T2.8" },
  { src: "/uploads/VID_20260531_080043_009.mp4", title: "Mels Night", category: "Wedding Film", tone: "low", exif: "4K · 24FPS · T2.1" },
  { src: "/uploads/VID_20260531_080054_116.mp4", title: "First Dance", category: "Wedding Film", tone: "cool", exif: "4K · 24FPS · T2.4" },
];

// Recent reels reuse the films with fresh framing.
export const RECENT_FILMS: Film[] = [
  { ...FILMS[2], title: "The Send-Off", category: "Wedding Film" },
  { ...FILMS[0], title: "Henna Night", category: "Event Film" },
  { ...FILMS[3], title: "Golden Hour", category: "Wedding Film" },
  { ...FILMS[1], title: "The Reception", category: "Event Film" },
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
   The API returns the image as a storage `key`; `api.ts`
   resolves it to a viewable `url`.
   ============================================================ */

export interface PortfolioItem {
  title: string;
  description?: string;
  /** Resolved image URL (storage key resolved against the media base). */
  url?: string;
  category?: string;
  tags?: string[];
}

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
    a: "Message us on WhatsApp at +251 908 030 809 with your date and location. We reply with availability, packages and a quote — usually within the hour.",
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
