import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllMedia } from "@/lib/media";
import { getPublishedVideos } from "@/lib/videos";
import { PUBLIC_TOOLS } from "@/lib/tools";
import { RESOURCES } from "@/lib/resources";
import { getResourceContent } from "@/lib/resource-content";
import { indexableStates } from "@/lib/directory";
import { SITE_URL } from "@/lib/site";
import { CITY_INDEX_PATH, CITY_PAGES, cityPath } from "@/lib/city-pages";
import { getLegalBySlug } from "@/lib/legal";
import { PAGE_UPDATED } from "@/lib/page-dates";

/**
 * Dynamic sitemap. Auto-derives from:
 *   - static route list below
 *   - every MDX file under content/blog, content/media and content/videos
 *   - the tool, resource and directory registries
 *
 * lastmod honesty (2026-09-21): lastModified is only set from a real date
 * the repo holds for that page: blog, media and video frontmatter (with the
 * git fallback in lib/blog), resource frontmatter, legal last_updated, and
 * the pinned dates in lib/page-dates. Hub pages that list posts or videos
 * take the newest item's date. Everything else OMITS lastmod instead of
 * stamping the build time, which told crawlers 177 pages changed every day.
 */
/** Newest date in a list of YYYY-MM-DD or ISO strings, or undefined. */
function newest(dates: (string | undefined)[]): Date | undefined {
  const times = dates
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d).getTime())
    .filter((t) => !Number.isNaN(t));
  return times.length ? new Date(Math.max(...times)) : undefined;
}

function legalDate(slug: string): Date | undefined {
  const fm = getLegalBySlug(slug)?.frontmatter;
  const d = fm?.last_updated ?? fm?.effective_date;
  return d ? new Date(d) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const media = getAllMedia();
  const videos = getPublishedVideos();
  const pinned = PAGE_UPDATED as Record<string, string>;

  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: Date;
  }[] = [
    { path: "/", changeFrequency: "monthly", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/what-is-a-senior-transition-advisor", changeFrequency: "monthly", priority: 0.9 },
    { path: "/mom-moving-to-assisted-living-what-to-do-with-the-house", changeFrequency: "monthly", priority: 0.9 },
    { path: "/sell-rent-or-keep-parents-house", changeFrequency: "monthly", priority: 0.9 },
    { path: CITY_INDEX_PATH, changeFrequency: "monthly", priority: 0.8 },
    ...CITY_PAGES.map((c) => ({
      path: cityPath(c.slug),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      lastModified: new Date(PAGE_UPDATED.cityPages),
    })),
    { path: "/faq", changeFrequency: "monthly", priority: 0.8 },
    { path: "/the-blueprint", changeFrequency: "monthly", priority: 0.9 },
    { path: "/the-roadmap", changeFrequency: "monthly", priority: 0.9 },
    { path: "/in-your-corner", changeFrequency: "monthly", priority: 0.8 },
    { path: "/need-an-agent", changeFrequency: "monthly", priority: 0.8 },
    { path: "/hammock365", changeFrequency: "monthly", priority: 0.9 },
    { path: "/freeguide", changeFrequency: "monthly", priority: 0.9 },
    { path: "/money-safety-sheet", changeFrequency: "monthly", priority: 0.8 },
    { path: "/work-with-ryan", changeFrequency: "monthly", priority: 0.8 },
    { path: "/speaking", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/partners", changeFrequency: "monthly", priority: 0.6 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8, lastModified: newest(posts.map((p) => p.dateModified)) },
    { path: "/media", changeFrequency: "monthly", priority: 0.7, lastModified: newest(media.map((m) => m.dateModified)) },
    { path: "/videos", changeFrequency: "weekly", priority: 0.7, lastModified: newest(videos.map((v) => v.dateModified)) },
    { path: "/tools", changeFrequency: "monthly", priority: 0.8 },
    { path: "/guides", changeFrequency: "monthly", priority: 0.8 },
    { path: "/resources", changeFrequency: "weekly", priority: 0.8 },
    { path: "/resources/senior-help-directory", changeFrequency: "weekly", priority: 0.8 },
    { path: "/resources/sorting-tracker", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3, lastModified: legalDate("privacy") },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: legalDate("terms") },
    { path: "/referral-terms", changeFrequency: "yearly", priority: 0.3, lastModified: legalDate("referral-terms") },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => {
    const pinnedDate = pinned[r.path];
    const lastModified =
      r.lastModified ?? (pinnedDate ? new Date(pinnedDate) : undefined);
    return {
      url: `${SITE_URL}${r.path}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    };
  });

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.frontmatter.slug}`,
    lastModified: new Date(p.dateModified),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const mediaEntries: MetadataRoute.Sitemap = media.map((m) => ({
    url: `${SITE_URL}/media/${m.frontmatter.slug}`,
    lastModified: new Date(m.dateModified),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Only published videos. getPublishedVideos filters out future-dated reels so
  // next week's scheduled content never leaks into the sitemap early.
  const videoEntries: MetadataRoute.Sitemap = videos.map((v) => ({
    url: `${SITE_URL}/videos/${v.frontmatter.slug}`,
    lastModified: new Date(v.dateModified),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Tools carry no date in the registry, so no lastmod.
  const toolEntries: MetadataRoute.Sitemap = PUBLIC_TOOLS.map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const resourceEntries: MetadataRoute.Sitemap = RESOURCES.map((r) => {
    // Use the authored markdown's real date so genuinely-updated pillars get an
    // honest freshness signal. Unauthored stubs (no markdown) get no lastmod.
    const fm = getResourceContent(r.slug)?.frontmatter;
    const authoredDate = fm?.dateModified ?? fm?.date;
    return {
      url: `${SITE_URL}/resources/${r.slug}`,
      ...(authoredDate ? { lastModified: new Date(authoredDate) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  // Senior Help Directory state pages. Only indexable states (enriched with
  // verified content, or backed by a county page) are sitemapped; the thin,
  // locator-only placeholder states are noindex (see the [state] route's
  // generateMetadata) so we never ship near-duplicates.
  const directoryStateEntries: MetadataRoute.Sitemap = indexableStates().map(
    // No date is kept per state page, so no lastmod.
    (s) => ({
      url: `${SITE_URL}/resources/senior-help-directory/${s.slug}`,
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
