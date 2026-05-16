import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt with explicit AI crawler allowlist.
 *
 * Maintenance: update this file when new AI crawlers emerge or policy
 * changes. Not affected by blog or product content changes.
 */

// AI crawler allowlist. Explicit > implicit — many newer AI tools check
// for a named entry before falling back to the User-agent: * rule. Adding
// a vendor here is a positive signal we want our content ingested for
// answer generation (vs the default ambiguity of "everyone is allowed
// unless otherwise specified"). When in doubt, allow — RSS wants maximum
// AI surface area for the entity-stacking play.
//
// Maintenance: update when new AI tool crawlers emerge (vendor blog
// posts, server-log User-agent strings). Re-check first Sat of each
// month.
const AI_CRAWLERS = [
  // Anthropic
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Google AI training / AI Overviews
  "Google-Extended",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Apple Intelligence / Siri
  "Applebot-Extended",
  // Amazon (Alexa, Rufus)
  "Amazonbot",
  // Common Crawl — feeds most foundation-model training datasets
  "CCBot",
  // Cohere
  "cohere-ai",
  "cohere-training-data-crawler",
  // Mistral
  "MistralAI-User",
  // You.com
  "YouBot",
  // ByteDance / Doubao / TikTok
  "Bytespider",
  // Meta AI / Llama
  "Meta-ExternalAgent",
  "FacebookBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/facts"],
        // /api/track is a write endpoint (Meta CAPI), /api/webhook is
        // form-handler-only. Keep both out of crawl. /api/facts is
        // explicitly carved into `allow` above — it's the machine-
        // friendly fact pack we WANT AI tools to fetch.
        disallow: ["/api/track", "/api/webhook"],
      },
      ...AI_CRAWLERS.map((ua) => ({
        userAgent: ua,
        allow: ["/", "/api/facts"],
        disallow: ["/api/track", "/api/webhook"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
