import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const VIDEOS_DIR = path.join(process.cwd(), "content", "videos");

export type VideoFrontmatter = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  /**
   * Set once the reel is live on YouTube. When present the page embeds the
   * YouTube player, which costs us no bandwidth and sends watch signal to the
   * channel. Until then the page falls back to videoUrl below.
   */
  youtubeId?: string;
  /**
   * Direct mp4, served from GHL's CDN or Supabase. Deliberately NOT committed to
   * this repo: public/ is already 173MB and git keeps every version of a binary
   * forever, so 5 to 7 reels a week would bloat clone and build times for
   * content almost nobody watches.
   */
  videoUrl?: string;
  poster?: string;
  /** ISO 8601 duration, e.g. PT52S. Required by schema.org VideoObject. */
  duration?: string;
  pillar?: string;
  tags?: string[];
  /**
   * The verified citations that backed the script, carried over from the
   * post's first comment. These do real work on the page: a bare 130-word
   * transcript is thin, and named .gov sources plus outbound links are what
   * make it a page worth indexing rather than filler.
   */
  sources?: string[];
  /** The one free tool this video's problem resolves to. */
  toolLabel?: string;
  toolHref?: string;
  /** The on-screen hook phrase, used as the page's opening line. */
  hook?: string;
  datePublished?: string;
  dateModified?: string;
};

export type VideoItem = {
  frontmatter: VideoFrontmatter;
  content: string;
  wordCount: number;
  datePublished: string;
  dateModified: string;
};

export function getAllVideoSlugs(): string[] {
  if (!fs.existsSync(VIDEOS_DIR)) return [];
  return fs
    .readdirSync(VIDEOS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getVideoBySlug(slug: string): VideoItem | null {
  const filePath = path.join(VIDEOS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as VideoFrontmatter;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const datePublished = fm.datePublished ?? fm.date ?? new Date().toISOString();

  return {
    frontmatter: fm,
    content,
    wordCount,
    datePublished,
    dateModified: fm.dateModified ?? datePublished,
  };
}

export function getAllVideos(): VideoItem[] {
  return getAllVideoSlugs()
    .map((slug) => getVideoBySlug(slug))
    .filter((v): v is VideoItem => v !== null)
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

/**
 * Only surface videos whose publish date has arrived. Reels are written and
 * scheduled days ahead, so without this the page would leak next week's content.
 */
export function getPublishedVideos(now: Date = new Date()): VideoItem[] {
  const today = now.toISOString().slice(0, 10);
  return getAllVideos().filter(
    (v) => v.datePublished.slice(0, 10) <= today
  );
}

export function formatVideoDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** "PT1M52S" -> "1:52". Falls back to null so the UI can just omit it. */
export function humanDuration(iso?: string): string | null {
  if (!iso) return null;
  const m = iso.match(/^PT(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return null;
  const mins = Number(m[1] ?? 0);
  const secs = Number(m[2] ?? 0);
  if (!mins && !secs) return null;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
