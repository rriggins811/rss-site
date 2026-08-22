import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import { extractFaqsFromBody, type BlogFaq } from "./blog-faq";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Cache git lookups per file. Content is immutable during a build, and
// getAllPosts() re-reads every post several times per build (sitemap, blog
// index, related-posts, schema), so without this we'd spawn hundreds of git
// processes. Keyed by absolute file path.
const gitDateCache = new Map<string, string | null>();

/**
 * Last-commit date (YYYY-MM-DD) for a content file, used as the dateModified
 * fallback so a post that gets "leveled up" reflects its real freshness even
 * when the author forgets to bump frontmatter. Returns null when git history
 * isn't available for the file (e.g. an untracked new file, or a shallow CI
 * checkout that doesn't contain the file's last commit) — callers then fall
 * back to datePublished, i.e. the original behavior. Never throws.
 */
function getGitLastModified(filePath: string): string | null {
  const cached = gitDateCache.get(filePath);
  if (cached !== undefined) return cached;
  let result: string | null = null;
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", filePath],
      { cwd: process.cwd(), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    result = out ? out.slice(0, 10) : null;
  } catch {
    result = null;
  }
  gitDateCache.set(filePath, result);
  return result;
}

/**
 * Optional HowTo step for posts that opt-in to HowTo schema. Mirrors
 * schema.org/HowToStep. `text` should be a short instruction (1-3 sentences),
 * NOT the full body of that section — Google's HowTo rich result truncates.
 */
export type HowToStep = {
  name: string;
  text: string;
  /** ISO-8601 duration if known, e.g. "PT12H" for 12 hours. Optional. */
  duration?: string;
};

export type BlogFrontmatter = {
  title: string;
  slug: string;
  /** Legacy field. Use datePublished in new posts. Read via post.datePublished. */
  date?: string;
  datePublished?: string;
  dateModified?: string;
  excerpt: string;
  /**
   * Optional 40-60 word direct answer rendered in a QuickAnswer box right
   * under the intro (with Schema.org Answer microdata + Speakable). Lets the
   * post lead with the liftable answer for AI Overviews / Perplexity while the
   * story stays below. Authored per-post in frontmatter; renders nothing when
   * absent, so it's opt-in and safe to leave off.
   */
  quick_answer?: string;
  /**
   * Optional literal search query, rendered as the headline inside the
   * QuickAnswer box and wrapping it in Schema.org Question microdata. Use on
   * posts written against one specific query ("can you sell a house in
   * probate in nc"), so a stressed searcher sees their own words answered
   * before any prose. Renders the plain answer box when absent.
   */
  question?: string;
  /**
   * Optional YouTube video ID for a short talk that answers the page's
   * question, rendered between the QuickAnswer and the body. Someone in the
   * middle of a crisis will watch four minutes before they will read three
   * thousand words. Renders nothing when absent, so pages ship before films.
   */
  video?: string;
  /** Optional caption under the video. Defaults to the post title. */
  video_caption?: string;
  source?: string;
  category?: string;
  tags?: string[];
  author?: string;
  image?: string;
  /**
   * Per-post schema type. Defaults to "Article" when omitted. Set to "HowTo"
   * on procedural posts that walk readers through ordered steps (playbooks,
   * crisis-response sequences). When set to "HowTo" you MUST also provide
   * `howToSteps`. See docs/blog-schema-types.md.
   */
  schemaType?: "Article" | "HowTo";
  /** Required when schemaType === "HowTo". 3-12 steps recommended. */
  howToSteps?: HowToStep[];
  /** Optional total time for HowTo, ISO-8601 duration (e.g. "PT72H"). */
  totalTime?: string;
  /**
   * Legacy/override FAQ array. New posts do NOT need this: the visible
   * "## Frequently Asked Questions" section in the body is parsed at build
   * time and drives FAQPage schema on its own (see lib/blog-faq.ts). Kept
   * as a fallback for a post that wants FAQPage without a visible section —
   * which Google's "schema must match visible content" rule disallows, so
   * in practice it should stay unused. Read via `post.faqs`, which prefers
   * the body-derived pairs.
   */
  faqs?: BlogFaq[];
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
  /**
   * Resolved FAQ pairs for FAQPage schema. Parsed from the visible FAQ
   * section of the body so the JSON-LD always matches what renders; falls
   * back to frontmatter `faqs` only when the body has no FAQ section.
   * Empty when the post has neither.
   */
  faqs: BlogFaq[];
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
  // Resolve "last modified" in priority order: explicit frontmatter wins;
  // otherwise the file's real last git-commit date (so daily content
  // level-ups register as fresh); otherwise the publish date. The git date is
  // only used when it's genuinely newer than the publish date.
  const gitModified = fm.dateModified ? null : getGitLastModified(filePath);
  const dateModified =
    fm.dateModified ??
    (gitModified && gitModified > datePublished.slice(0, 10)
      ? gitModified
      : datePublished);

  const bodyFaqs = extractFaqsFromBody(content);
  const faqs = bodyFaqs.length > 0 ? bodyFaqs : (fm.faqs ?? []);

  return {
    frontmatter: fm,
    content,
    readMinutes,
    wordCount,
    datePublished,
    dateModified,
    faqs,
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
