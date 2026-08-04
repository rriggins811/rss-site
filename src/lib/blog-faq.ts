/**
 * Derive FAQ Q&A pairs from the *visible* FAQ section of a post body.
 *
 * Why this exists: BLOG_SPEC requires every post to render a visible
 * "## Frequently Asked Questions" section, but FAQPage JSON-LD used to be
 * emitted only when the author also duplicated those Q&As into a `faqs:`
 * frontmatter array. The spec's frontmatter template never had that key, so
 * in practice most posts rendered the section and shipped no FAQPage schema.
 *
 * Parsing the rendered section instead makes the visible copy the single
 * source of truth, which is exactly what Google's "structured data must match
 * visible content" rule wants — the schema can't drift from the page because
 * it's generated from the page.
 *
 * Two authoring shapes are recognized (both already in the content library):
 *
 *   A. `###` heading per question (the BLOG_SPEC shape)
 *
 *        ## Frequently Asked Questions
 *
 *        ### Will my parent's premium go up in 2027?
 *
 *        Nobody can tell you that yet...
 *
 *   B. bold-lead paragraph per question (the county-directory shape)
 *
 *        ## Frequently asked questions
 *
 *        **Mom is 70 and on a fixed income. Can she lower her taxes?** Yes,
 *        and there is a catch worth understanding...
 *
 * Shape A wins when the section contains any `###`; B is the fallback.
 *
 * The section ends at the first of: another `#`/`##` heading, a thematic
 * break (`---`, which opens the CTA block in most posts), or a fully
 * italicized paragraph (the author sign-off / disclaimer block that closes
 * the county directories). Without those terminators the last answer would
 * swallow the CTA and disclaimer copy.
 */

export type BlogFaq = { question: string; answer: string };

const FAQ_HEADING = /^##[ \t]+(?:frequently asked questions|faqs?)[ \t]*:?[ \t]*$/i;
/** Any h1/h2 — ends the FAQ section. h3 stays inside it (it's a question). */
const H1_OR_H2 = /^#{1,2}[ \t]+\S/;
/** `### Question text` with optional trailing closing hashes. */
const H3 = /^###[ \t]+(\S.*?)[ \t]*#*[ \t]*$/;
const THEMATIC_BREAK = /^[ \t]{0,3}(?:(?:-[ \t]*){3,}|(?:\*[ \t]*){3,}|(?:_[ \t]*){3,})$/;
const FENCE = /^[ \t]{0,3}(?:```|~~~)/;
/** `**Question?** answer...` — bold run at the very start of a paragraph. */
const BOLD_LEAD = /^\*\*([^*]+?)\*\*[ \t]*([\s\S]*)$/;

/**
 * A paragraph that is entirely one emphasis run (`*...*` / `_..._`) with no
 * other delimiter inside. That's the sign-off/disclaimer convention in these
 * posts; treated as the end of the FAQ section, never as answer copy.
 */
function isSignOffParagraph(p: string): boolean {
  return /^\*[^*]+\*$/.test(p) || /^_[^_]+_$/.test(p);
}

/**
 * Inline markdown -> the plain text a reader actually sees, so the JSON-LD
 * string is character-for-character what's rendered. Link text survives, the
 * URL doesn't; emphasis/strong markers and backticks are dropped.
 */
export function markdownToPlainText(md: string): string {
  return md
    .replace(/<!--[\s\S]*?-->/g, "")
    // Images render as an <img>, contributing no text.
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, "$2")
    .replace(/(?<![\w*])\*(?=\S)([^*]*?\S)\*(?![\w*])/g, "$1")
    .replace(/(?<![\w_])_(?=\S)([^_]*?\S)_(?![\w_])/g, "$1")
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, "$1")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** Soft-wrapped lines collapse into one line, blank lines split paragraphs. */
function toParagraphs(lines: string[]): string[] {
  return lines
    .join("\n")
    .split(/\n[ \t]*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

/** Lines of the visible FAQ section, or null when the post has no such section. */
function faqSectionLines(content: string): string[] | null {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((l) => FAQ_HEADING.test(l));
  if (start === -1) return null;

  const out: string[] = [];
  let inFence = false;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (FENCE.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    if (H1_OR_H2.test(line) || THEMATIC_BREAK.test(line)) break;
    out.push(line);
  }
  return out;
}

/** Shape A: one `###` heading per question. */
function parseHeadingShape(lines: string[]): BlogFaq[] {
  const items: { question: string; body: string[] }[] = [];
  let current: { question: string; body: string[] } | null = null;
  let inFence = false;

  for (const line of lines) {
    if (FENCE.test(line)) inFence = !inFence;
    if (!inFence) {
      const heading = H3.exec(line);
      if (heading) {
        current = { question: heading[1], body: [] };
        items.push(current);
        continue;
      }
    }
    if (current) current.body.push(line);
  }

  const out: BlogFaq[] = [];
  for (const item of items) {
    const paragraphs: string[] = [];
    for (const p of toParagraphs(item.body)) {
      // Sign-off block: this answer is done and so is the section.
      if (isSignOffParagraph(p)) break;
      paragraphs.push(markdownToPlainText(p));
    }
    const question = markdownToPlainText(item.question);
    const answer = paragraphs.filter(Boolean).join("\n\n");
    if (question && answer) out.push({ question, answer });
  }
  return out;
}

/** Shape B: `**Question?** answer` paragraphs. */
function parseBoldLeadShape(lines: string[]): BlogFaq[] {
  const out: BlogFaq[] = [];
  for (const p of toParagraphs(lines)) {
    if (isSignOffParagraph(p)) break;
    const match = BOLD_LEAD.exec(p);
    if (!match) continue;
    const question = markdownToPlainText(match[1]);
    const answer = markdownToPlainText(match[2]);
    // The bold lead must actually be a question, so a bolded lede like
    // "**Bottom line.** ..." never becomes a schema Question.
    if (!question.endsWith("?") || !answer) continue;
    out.push({ question, answer });
  }
  return out;
}

/**
 * Q&A pairs rendered in the post's visible FAQ section. Empty array when the
 * post has no FAQ section (or has one with nothing parseable in it).
 */
export function extractFaqsFromBody(content: string): BlogFaq[] {
  const lines = faqSectionLines(content);
  if (!lines) return [];
  const hasHeadings = lines.some((l) => H3.test(l));
  return hasHeadings ? parseHeadingShape(lines) : parseBoldLeadShape(lines);
}
