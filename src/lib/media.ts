import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const MEDIA_DIR = path.join(process.cwd(), "content", "media");

export type MediaFrontmatter = {
  title: string;
  podcast: string;
  host: string;
  slug: string;
  date?: string;
  datePublished?: string;
  dateModified?: string;
  excerpt: string;
  cover_image?: string;
  source?: string;
  links?: string[];
  category?: string;
  tags?: string[];
};

export type MediaItem = {
  frontmatter: MediaFrontmatter;
  content: string;
  readMinutes: number;
  wordCount: number;
  datePublished: string;
  dateModified: string;
};

export function getAllMediaSlugs(): string[] {
  if (!fs.existsSync(MEDIA_DIR)) return [];
  return fs
    .readdirSync(MEDIA_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getMediaBySlug(slug: string): MediaItem | null {
  const filePath = path.join(MEDIA_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 200));
  const fm = data as MediaFrontmatter;

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

export function getAllMedia(): MediaItem[] {
  return getAllMediaSlugs()
    .map((slug) => getMediaBySlug(slug))
    .filter((p): p is MediaItem => p !== null)
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

export function formatMediaDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
