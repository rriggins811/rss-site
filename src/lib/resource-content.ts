import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Long-form pillar content for /resources/[slug]. Authored as a markdown
 * file with YAML frontmatter under content/resources/<live-route-slug>.md
 * and rendered by the resources [slug] route via compileMDX.
 *
 * Files mirror the blog content pipeline (see src/lib/blog.ts) but with
 * a stricter structure: a QUICK ANSWER section that is redundant with
 * the `quick_answer` frontmatter field, several body H2 sections, a
 * Frequently asked questions Q&A list, and an "About Ryan Riggins" bio.
 *
 * The renderer extracts the QUICK ANSWER preamble + FAQ block + bio out
 * of the markdown so the page can render those into their own
 * dedicated components (QuickAnswer + FAQSection) with matching schema,
 * and the rest of the body flows through MDX as prose.
 *
 * Filename = canonical live-route slug. The frontmatter `slug` field is
 * authoritative and should match the filename. If a file's frontmatter
 * slug differs from the filename (e.g. authoring drift), the filename
 * wins because that is what the [slug] route resolves against.
 */

const RESOURCES_DIR = path.join(process.cwd(), "content", "resources");

export type ResourceFrontmatter = {
  title: string;
  slug: string;
  type?: string;
  category?: string;
  date?: string;
  author?: string;
  pillar_cluster?: string;
  quick_answer: string;
  internal_links?: string[];
  meta_description?: string;
};

export type ResourceFAQ = { question: string; answer: string };

export type ResourceContent = {
  frontmatter: ResourceFrontmatter;
  /** Body markdown with QUICK ANSWER preamble, FAQ block, and bio stripped out. */
  body: string;
  /** Parsed FAQ Q&A pairs, in order. Empty if the file has no FAQ section. */
  faqs: ResourceFAQ[];
  /** Author bio markdown (everything after `## About Ryan Riggins`). Empty if absent. */
  bio: string;
  wordCount: number;
  readMinutes: number;
};

/**
 * Strip the leading `## QUICK ANSWER\n\n<paragraph>\n\n---\n` block
 * from the body if present. The QuickAnswer component renders the
 * `quick_answer` frontmatter field above the body, so re-rendering it
 * inside the MDX flow would be redundant.
 */
function stripQuickAnswerPreamble(body: string): string {
  // Match `## QUICK ANSWER` (case-insensitive) through the next `---`
  // horizontal rule, including the trailing newline(s).
  const re = /^##\s+QUICK ANSWER[\s\S]*?\n---\s*\n+/im;
  return body.replace(re, "");
}

/**
 * Pull the `## Frequently asked questions` block out of the body and
 * parse its `**Question?**\nAnswer.` pairs into structured items.
 * Returns the parsed FAQs plus the body with the FAQ block removed.
 *
 * The block ends at the next `## ` H2 OR a `---` horizontal rule,
 * whichever comes first. Empty result if no FAQ section exists.
 */
function extractFaqs(body: string): { faqs: ResourceFAQ[]; rest: string } {
  // Find the FAQ heading (case-insensitive).
  const headingRe = /^##\s+Frequently asked questions\s*$/im;
  const headingMatch = headingRe.exec(body);
  if (!headingMatch) return { faqs: [], rest: body };

  const headingStart = headingMatch.index;
  const afterHeading = headingStart + headingMatch[0].length;

  // End of block: next `## ` heading OR `---` rule on its own line.
  const tail = body.slice(afterHeading);
  const endRe = /\n(?:##\s+|---\s*\n)/;
  const endMatch = endRe.exec(tail);
  const blockEnd = endMatch ? afterHeading + endMatch.index : body.length;
  const block = body.slice(afterHeading, blockEnd);

  // Parse `**Question?**\nAnswer (possibly multi-line until next blank line + **).`
  // Strategy: split on lines starting with `**`, drop empty leading segment.
  const faqs: ResourceFAQ[] = [];
  // Capture question + answer body. Answer runs until next **Q** or end of block.
  const itemRe = /\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*|\s*$)/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(block)) !== null) {
    const question = m[1].trim();
    const answer = m[2].trim();
    if (question && answer) faqs.push({ question, answer });
  }

  // Rebuild body with FAQ block + trailing `---` (if any) stripped.
  // Also strip the `---` that may precede `## About Ryan Riggins` later.
  const before = body.slice(0, headingStart).replace(/\n+$/, "\n");
  const after = body.slice(blockEnd).replace(/^\s*---\s*\n+/, "");
  return { faqs, rest: `${before}${after}` };
}

/**
 * Strip the trailing `## About Ryan Riggins` bio block from the body
 * and return its inner markdown so the page can render the bio in its
 * own author card.
 */
function extractBio(body: string): { bio: string; rest: string } {
  const re = /^##\s+About Ryan Riggins\s*\n([\s\S]*)$/im;
  const m = re.exec(body);
  if (!m) return { bio: "", rest: body };
  const bio = m[1].trim();
  const rest = body.slice(0, m.index).replace(/\n+$/, "");
  return { bio, rest };
}

export function getAllResourceContentSlugs(): string[] {
  if (!fs.existsSync(RESOURCES_DIR)) return [];
  return fs
    .readdirSync(RESOURCES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getResourceContent(slug: string): ResourceContent | null {
  const filePath = path.join(RESOURCES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as ResourceFrontmatter;

  // Strip the redundant QUICK ANSWER preamble (already shown above body
  // via the QuickAnswer component reading frontmatter.quick_answer).
  let body = stripQuickAnswerPreamble(content);

  // Extract FAQs and bio so they render in dedicated components.
  const { faqs, rest: bodyNoFaq } = extractFaqs(body);
  const { bio, rest: bodyNoFaqNoBio } = extractBio(bodyNoFaq);
  body = bodyNoFaqNoBio.trim();

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 200));

  return {
    frontmatter: fm,
    body,
    faqs,
    bio,
    wordCount,
    readMinutes,
  };
}
