import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogFrontmatter = {
  title: string;
  slug: string;
  /** Legacy field. Use datePublished in new posts. Read via post.datePublished. */
  date?: string;
  datePublished?: string;
  dateModified?: string;
  excerpt: string;
  source?: string;
  category?: string;
  tags?: string[];
  author?: string;
  image?: string;
};

export type BlogPost = {
  frontmatter: BlogFrontmatter;
  content: string;
  readMinutes: number;
  wordCount: number;
  /** Resolved publish date (datePublished ?? date). */
  datePublished: string;
  /** Resolved modified date (dateModified ?? datePublished ?? date). */
  dateModified: string;
};

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 200));
  const fm = data as BlogFrontmatter;

  const datePublished = fm.datePublished ?? fm.date ?? new Date().toISOString();
  const dateModified = fm.dateModified ?? datePublished;

  return {
    frontmatter: fm,
    content,
    readMinutes,
    wordCount,
    datePublished,
    dateModified,
  };
}

export function getAllPosts(): BlogPost[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Topical-cluster related-posts picker.
 *
 * Scores each other post by:
 *   + 3 points for shared category
 *   + 1 point per shared tag
 *   + 0 for nothing
 * Ties break by recency (newest wins).
 *
 * If the current post has no category/tags, falls back to the 3 most recent
 * other posts so the related block always renders.
 */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const all = getAllPosts();
  const current = all.find((p) => p.frontmatter.slug === slug);
  if (!current) return [];
  const others = all.filter((p) => p.frontmatter.slug !== slug);

  const currentCat = current.frontmatter.category?.toLowerCase() ?? null;
  const currentTags = new Set(
    (current.frontmatter.tags ?? []).map((t) => t.toLowerCase())
  );

  const hasSignal = Boolean(currentCat) || currentTags.size > 0;

  if (!hasSignal) {
    return others.slice(0, limit);
  }

  const scored = others.map((p) => {
    let score = 0;
    if (
      currentCat &&
      p.frontmatter.category?.toLowerCase() === currentCat
    ) {
      score += 3;
    }
    for (const t of p.frontmatter.tags ?? []) {
      if (currentTags.has(t.toLowerCase())) score += 1;
    }
    return { post: p, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.post.datePublished.localeCompare(a.post.datePublished);
  });

  // If nothing shared a signal, degrade to recency.
  if (scored.every((s) => s.score === 0)) {
    return others.slice(0, limit);
  }

  return scored.slice(0, limit).map((s) => s.post);
}
