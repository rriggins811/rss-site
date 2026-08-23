import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllMedia } from "@/lib/media";
import { getPublishedVideos } from "@/lib/videos";
import { TOOLS } from "@/lib/tools";
import { RESOURCES } from "@/lib/resources";
import { getResourceContent } from "@/lib/resource-content";
import { indexableStates } from "@/lib/directory";
import { SITE_URL } from "@/lib/site";

/**
 * Dynamic sitemap. Auto-derives from:
 *   - static route list below
 *   - every MDX file under content/blog
 *   - every MDX file under content/media
 *
 * lastModified pulls from frontmatter dateModified, falling back to
 * datePublished (both resolved in lib/blog + lib/media).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "monthly", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.8 },
    { path: "/the-blueprint", changeFrequency: "monthly", priority: 0.9 },
    { path: "/the-roadmap", changeFrequency: "monthly", priority: 0.9 },
    { path: "/in-your-corner", changeFrequency: "monthly", priority: 0.8 },
    { path: "/need-an-agent", changeFrequency: "monthly", priority: 0.8 },
    { path: "/seniorsafe-app", changeFrequency: "monthly", priority: 0.9 },
    { path: "/freeguide", changeFrequency: "monthly", priority: 0.9 },
    { path: "/money-safety-sheet", changeFrequency: "monthly", priority: 0.8 },
    { path: "/work-with-ryan", changeFrequency: "monthly", priority: 0.8 },
    { path: "/speaking", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/partners", changeFrequency: "monthly", priority: 0.6 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "/media", changeFrequency: "monthly", priority: 0.7 },
    { path: "/videos", changeFrequency: "weekly", priority: 0.7 },
    { path: "/tools", changeFrequency: "monthly", priority: 0.8 },
    { path: "/guides", changeFrequency: "monthly", priority: 0.8 },
    { path: "/resources", changeFrequency: "weekly", priority: 0.8 },
    { path: "/resources/senior-help-directory", changeFrequency: "weekly", priority: 0.8 },
    { path: "/resources/sorting-tracker", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/referral-terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.frontmatter.slug}`,
    lastModified: new Date(p.dateModified),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const mediaEntries: MetadataRoute.Sitemap = getAllMedia().map((m) => ({
    url: `${SITE_URL}/media/${m.frontmatter.slug}`,
    lastModified: new Date(m.dateModified),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Only published videos. getPublishedVideos filters out future-dated reels so
  // next week's scheduled content never leaks into the sitemap early.
  const videoEntries: MetadataRoute.Sitemap = getPublishedVideos().map((v) => ({
    url: `${SITE_URL}/videos/${v.frontmatter.slug}`,
    lastModified: new Date(v.dateModified),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const toolEntries: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const resourceEntries: MetadataRoute.Sitemap = RESOURCES.map((r) => {
    // Use the authored markdown's real date so genuinely-updated pillars get an
    // honest freshness signal, instead of stamping every page "modified today"
    // on every build. Unauthored stubs (no markdown) fall back to now.
    const authoredDate = getResourceContent(r.slug)?.frontmatter.date;
    return {
      url: `${SITE_URL}/resources/${r.slug}`,
      lastModified: authoredDate ? new Date(authoredDate) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  // Senior Help Directory state pages. Only indexable states (enriched with
  // verified content, or backed by a county page) are sitemapped; the thin,
  // locator-only placeholder states are noindex (see the [state] route's
  // generateMetadata) so we never ship near-duplicates.
  const directoryStateEntries: MetadataRoute.Sitemap = indexableStates().map(
    (s) => ({
      url: `${SITE_URL}/resources/senior-help-directory/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  return [
    ...staticEntries,
    ...blogEntries,
    ...mediaEntries,
    ...videoEntries,
    ...toolEntries,
    ...resourceEntries,
    ...directoryStateEntries,
  ];
}
