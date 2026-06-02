/**
 * Single source of truth for SEO + business facts.
 *
 * Used by metadata, JSON-LD structured data, sitemap, robots, manifest and the
 * OpenGraph image. Keep this accurate — search engines and AI assistants read
 * these values directly.
 *
 * IMPORTANT: set NEXT_PUBLIC_SITE_URL to the real production domain. Canonical
 * URLs, the sitemap and OG/Twitter image links are all derived from it; a wrong
 * value silently weakens ranking. The default below is a placeholder.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.adpictures.et"
).replace(/\/$/, "");

export const site = {
  name: "AD Pictures",
  legalName: "AD Pictures Film Studio",
  url: SITE_URL,
  slogan: "Think · Imagine · Create.",
  /** ~155 char meta description — the line search engines and AI quote. */
  description:
    "AD Pictures is a wedding & event film studio in Addis Ababa, Ethiopia. We direct, light and cut your day like cinema — films, reels and portraits.",
  shortDescription: "Wedding & event film studio in Addis Ababa, Ethiopia.",
  foundingYear: "2016",
  priceRange: "$$",
  /** Languages the studio works in. */
  inLanguage: ["en", "am"],
  email: "hello@adpictures.et",
  /** E.164 for schema; display strings live in the footer. */
  phones: ["+251908030809", "+251988130030"],
  whatsapp: "251908030809",
  address: {
    street: "Awlo Business Center, 3rd Floor, Bole Medhanialem",
    locality: "Addis Ababa",
    region: "Addis Ababa",
    country: "ET",
  },
  /** Approximate Bole Medhanialem coordinates — verify against the real pin. */
  geo: { lat: 9.0107, lng: 38.7853 },
  areaServed: ["Addis Ababa", "Ethiopia"],
  openingHours: "Mo-Sa 09:00-19:00",
  social: {
    instagram: "https://instagram.com/adpictures_ethio",
    facebook: "https://facebook.com/Adpicturesethio",
    instagramHandle: "@adpictures_ethio",
  },
  /** Profiles + canonical site, used for schema `sameAs` (entity resolution). */
  sameAs: [
    "https://instagram.com/adpictures_ethio",
    "https://facebook.com/Adpicturesethio",
  ],
  keywords: [
    "wedding videographer Addis Ababa",
    "wedding film Ethiopia",
    "event videography Addis Ababa",
    "cinematic wedding films",
    "wedding photographer Addis Ababa",
    "Habesha wedding film",
    "Bole Medhanialem film studio",
    "Ethiopian wedding videographer",
    "portrait photography Addis Ababa",
    "commercial video production Ethiopia",
    "AD Pictures",
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}
