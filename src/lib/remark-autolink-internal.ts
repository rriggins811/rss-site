/**
 * Remark plugin: auto-link high-value topic phrases in blog MDX bodies to
 * their canonical page, at render time.
 *
 * Most posts carry zero in-body internal links, so pillar pages get no link
 * equity from the body copy and readers have no in-context path deeper into
 * the site. This walks the mdast and wraps the FIRST occurrence of each
 * curated phrase (e.g. "reverse mortgage", "power of attorney") in a real
 * internal link to its canonical home.
 *
 * Deliberately conservative, so it never embarrasses us in live prose:
 *   - each rule fires at most ONCE per post, on the first occurrence only
 *   - at most `max` links per post (default 4) so copy never looks spammy
 *   - never links a page to itself (pass the current path as `selfPath`)
 *   - word-boundaried + case-insensitive, and the original casing is kept as
 *     the anchor text
 *   - skips text already inside a link (so CTA/markdown links are untouched)
 *     and inside headings (links in headings read badly); inline code and code
 *     blocks aren't text nodes, so they're skipped for free
 *
 * Same hand-walk-the-tree approach as remark-autolink-cta, to avoid depending
 * on a transitive unist-util-visit version. Wire it AFTER remarkAutolinkCta so
 * bare CTA URLs are already real links and this never double-wraps them.
 */

type MdNode = {
  type: string;
  value?: string;
  url?: string;
  data?: { hProperties?: Record<string, string> };
  children?: MdNode[];
};

type Rule = { href: string; regex: RegExp };

// Curated phrase -> canonical internal destination. List order = priority when
// two rules could match at the same index in a text node (earlier wins). Keep
// this list conservative: only unambiguous phrases that have one obvious
// canonical home. Every href is verified to resolve to a real route/slug.
const RAW_RULES: { keywords: string[]; href: string }[] = [
  { keywords: ["Net Proceeds Calculator"], href: "/tools/net-proceeds-calculator" },
  { keywords: ["Medicare Gap Analyzer"], href: "/tools/medicare-gap-analyzer" },
  { keywords: ["Seniors Real Estate Specialist"], href: "/resources/seniors-real-estate-specialist-vs-investor" },
  { keywords: ["Senior Help Directory"], href: "/resources/senior-help-directory" },
  { keywords: ["Senior Transition Roadmap"], href: "/blueprint-premium" },
  // The clock/relief positioning (Jul 28 2026). These phrases run through the
  // blog constantly and had no internal route to the two pages that actually
  // produce revenue.
  { keywords: ["listing presentation", "listing presentations"], href: "/need-an-agent" },
  { keywords: ["find and vet", "vetted agent", "the right agent"], href: "/in-your-corner" },
  { keywords: ["quitclaim deed"], href: "/blog/quitclaim-deed-fraud-protect-parents-home" },
  { keywords: ["deed fraud"], href: "/blog/protect-parents-paid-off-home-deed-fraud" },
  { keywords: ["reverse mortgage"], href: "/blog/reverse-mortgage-running-out-of-money-what-to-check" },
  { keywords: ["Aid and Attendance", "Aid & Attendance"], href: "/blog/va-aid-attendance-2026-benefit-veteran-families" },
  { keywords: ["capital gains"], href: "/blog/capital-gains-selling-parents-house-2026" },
  { keywords: ["observation status"], href: "/blog/medicare-observation-status-trap" },
  { keywords: ["power of attorney"], href: "/resources/power-of-attorney-selling-parents-home" },
  { keywords: ["memory care"], href: "/resources/assisted-living-vs-memory-care-difference" },
  { keywords: ["cost of assisted living"], href: "/resources/cost-of-assisted-living-in-2026" },
  { keywords: ["sandwich generation"], href: "/resources/sandwich-generation-caregiver-burnout" },
  { keywords: ["Medicaid"], href: "/resources/medicare-vs-medicaid-senior-care" },
];

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const RULES: Rule[] = RAW_RULES.map((r) => ({
  href: r.href,
  regex: new RegExp(`\\b(?:${r.keywords.map(escapeRe).join("|")})\\b`, "i"),
}));

const DEFAULT_MAX = 4;

export function remarkAutolinkInternal(options?: {
  selfPath?: string;
  max?: number;
}) {
  const selfPath = options?.selfPath;
  const max = options?.max ?? DEFAULT_MAX;
  // Drop the self rule up front so a page never links to itself.
  const rules = RULES.filter((r) => r.href !== selfPath);

  return (tree: MdNode): void => {
    let added = 0;
    const used = new Set<string>();

    // Seed `used` with every destination already linked in the tree — bare CTA
    // URLs the CTA plugin just wrapped, or hand-authored markdown links — so we
    // never add a second link to the same page, and never override a link the
    // author chose themselves.
    function collectLinks(node: MdNode): void {
      if (!node || !Array.isArray(node.children)) return;
      for (const child of node.children) {
        if (child.type === "link" && typeof child.url === "string") {
          used.add(child.url);
        }
        collectLinks(child);
      }
    }
    collectLinks(tree);

    // Wrap the earliest unused-rule match in a text value, then recurse on the
    // remainder for further matches. Returns null when nothing was linked.
    function splitText(value: string): MdNode[] | null {
      if (added >= max) return null;
      let best: { index: number; length: number; href: string } | null = null;
      for (const rule of rules) {
        if (used.has(rule.href)) continue;
        const m = rule.regex.exec(value);
        if (m && (best === null || m.index < best.index)) {
          best = { index: m.index, length: m[0].length, href: rule.href };
        }
      }
      if (!best) return null;
      used.add(best.href);
      added++;
      const before = value.slice(0, best.index);
      const matched = value.slice(best.index, best.index + best.length);
      const after = value.slice(best.index + best.length);
      const out: MdNode[] = [];
      if (before) out.push({ type: "text", value: before });
      out.push({
        type: "link",
        url: best.href,
        children: [{ type: "text", value: matched }],
      });
      if (after) {
        const more = splitText(after);
        if (more) out.push(...more);
        else out.push({ type: "text", value: after });
      }
      return out;
    }

    function walk(node: MdNode, protectedCtx: boolean): void {
      if (added >= max) return;
      if (!node || !Array.isArray(node.children)) return;
      const next: MdNode[] = [];
      for (const child of node.children) {
        if (added < max && child.type === "text" && !protectedCtx) {
          const replaced = splitText(child.value ?? "");
          if (replaced) {
            next.push(...replaced);
            continue;
          }
        } else if (Array.isArray(child.children)) {
          walk(child, protectedCtx || child.type === "link" || child.type === "heading");
        }
        next.push(child);
      }
      node.children = next;
    }

    walk(tree, false);
  };
}
