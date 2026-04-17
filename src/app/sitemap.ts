import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllMedia } from "@/lib/media";
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
    { path: "/the-blueprint", changeFrequency: "monthly", priority: 0.9 },
    { path: "/blueprint-premium", changeFrequency: "monthly", priority: 0.9 },
    { path: "/seniorsafe-app", changeFrequency: "monthly", priority: 0.9 },
    { path: "/freeguide", changeFrequency: "monthly", priority: 0.9 },
    { path: "/work-with-ryan", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "/media", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
    {
      path: "/referral-partner-terms-conditions",
      changeFrequency: "yearly",
      priority: 0.3,
    },
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

  return [...staticEntries, ...blogEntries, ...mediaEntries];
}
