import fs from "node:fs";
import path from "node:path";

/**
 * Statewide prose for the Senior Help Directory [state] pages.
 *
 * Each US state + DC has a markdown file at content/directory-states/<slug>.md
 * (slug matches DIRECTORY_STATES). The [state] route renders the body and emits
 * FAQPage schema from the "## Frequently asked questions" block.
 *
 * The loader strips:
 *   - the leading H1 (route renders the title)
 *   - the "## Find help in your county" section onward (NC; route renders county
 *     cards from the registry instead)
 *   - the trailing `---` disclaimer (route renders its own)
 *   - any line starting with "UNVERIFIED:" (an internal research flag that must
 *     never reach the published page)
 *
 * The "## Frequently asked questions" and "## Sources" sections are KEPT in the
 * body so they render visibly (Sources doubles as an E-E-A-T trust signal). The
 * FAQ is also parsed out for FAQPage JSON-LD; because the schema text is pulled
 * from the same visible markdown, the two always match (Google's rule).
 */

const STATES_DIR = path.join(process.cwd(), "content", "directory-states");

export type StateFaq = { question: string; answer: string };
export type StateContent = { body: string; faqs: StateFaq[] };

/**
 * Parse the "## Frequently asked questions" block, whose entries are
 * `**Question?** Answer` paragraphs separated by blank lines.
 */
function parseFaqs(body: string): StateFaq[] {
  const m = /##\s+Frequently asked questions\s*\n([\s\S]*?)(?=\n##\s|$)/i.exec(
    body
  );
  if (!m) return [];
  return m[1]
    .split(/\n\s*\n/)
    .map((para) => {
      const mm = /^\*\*(.+?)\*\*\s*([\s\S]+)$/.exec(para.trim());
      if (!mm) return null;
      const question = mm[1].trim();
      const answer = mm[2].trim().replace(/\s+/g, " ");
      return question && answer ? { question, answer } : null;
    })
    .filter((x): x is StateFaq => x !== null);
}

/**
 * Returns the cleaned statewide body + parsed FAQs for a state slug, or null
 * if no content file exists.
 */
export function getStateContent(slug: string): StateContent | null {
  const file = path.join(STATES_DIR, `${slug}.md`);
  let raw: string;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }

  // Drop the first H1 line.
  let body = raw.replace(/^#\s+.*\r?\n/, "");

  // Cut the NC county section onward (also removes everything after it).
  const countyIdx = body.indexOf("## Find help in your county");
  if (countyIdx !== -1) {
    body = body.slice(0, countyIdx);
  } else {
    // Otherwise cut the trailing `---` disclaimer block.
    const discIdx = body.lastIndexOf("\n---");
    if (discIdx !== -1) body = body.slice(0, discIdx);
  }

  // Strip internal UNVERIFIED flags so they never publish.
  body = body
    .split(/\r?\n/)
    .filter((line) => !/^\s*UNVERIFIED:/i.test(line))
    .join("\n")
    .trim();

  return { body, faqs: parseFaqs(body) };
}

/** True if a statewide content file exists for this slug. */
export function hasStateContent(slug: string): boolean {
  return fs.existsSync(path.join(STATES_DIR, `${slug}.md`));
}
