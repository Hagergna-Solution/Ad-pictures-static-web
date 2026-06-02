import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Allow every crawler — including AI assistants (GPTBot, OAI-SearchBot,
 * ChatGPT-User, PerplexityBot, Google-Extended, ClaudeBot, etc.). Being
 * indexable by these is a prerequisite for ever being recommended by them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
