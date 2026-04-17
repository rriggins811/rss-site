import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const LEGAL_DIR = path.join(process.cwd(), "content", "legal");

export type LegalFrontmatter = {
  title: string;
  slug: string;
  effective_date?: string;
  last_updated?: string;
  description: string;
};

export type LegalPage = {
  frontmatter: LegalFrontmatter;
  content: string;
  /** Resolved display date (last_updated ?? effective_date). */
  lastUpdated: string;
};

export function getLegalBySlug(slug: string): LegalPage | null {
  const filePath = path.join(LEGAL_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as LegalFrontmatter;
  const lastUpdated =
    fm.last_updated ?? fm.effective_date ?? new Date().toISOString();
  return { frontmatter: fm, content, lastUpdated };
}

export function formatLegalDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
