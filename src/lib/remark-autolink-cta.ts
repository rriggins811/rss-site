/**
 * Remark plugin: auto-link bare CTA URLs in blog MDX bodies.
 *
 * The post CTA blocks list URLs as plain text, e.g.
 *   "...the free Medicare Gap Analyzer: rigginsstrategicsolutions.com/tools/medicare-gap-analyzer"
 * which render as unclickable text, pass no internal link equity, and aren't
 * tappable on mobile. This walks the mdast and wraps occurrences of our two
 * known domains in real links:
 *   - rigginsstrategicsolutions.com/<path>  ->  relative internal link "/<path>"
 *   - (app.)seniorsafeapp.com/<path>        ->  external link (new tab)
 *
 * Scoped to our domains only, so it never touches arbitrary prose, and it skips
 * any text already inside a link so existing markdown links are never
 * double-wrapped. Hand-walks the tree to avoid depending on a transitive
 * unist-util-visit version.
 */

type MdNode = {
  type: string;
  value?: string;
  url?: string;
  data?: { hProperties?: Record<string, string> };
  children?: MdNode[];
};

// Capture groups: 1 = host (incl. optional "app." subdomain), 2 = path.
const CTA_URL =
  /(?:https?:\/\/)?(?:www\.)?((?:app\.)?(?:rigginsstrategicsolutions\.com|seniorsafeapp\.com))(\/[^\s)]*)?/g;

function hrefFor(host: string, path: string): { href: string; external: boolean } {
  if (host === "rigginsstrategicsolutions.com") {
    // Internal: relative path so it stays a same-site internal link.
    return { href: path || "/", external: false };
  }
  // seniorsafeapp.com / app.seniorsafeapp.com -> external app site.
  return { href: `https://${host}${path}`, external: true };
}

function linkNode(text: string, href: string, external: boolean): MdNode {
  return {
    type: "link",
    url: href,
    ...(external
      ? { data: { hProperties: { target: "_blank", rel: "noopener noreferrer" } } }
      : {}),
    children: [{ type: "text", value: text }],
  };
}

// Split a text value into text + link nodes for any CTA URLs found.
// Returns null when there's nothing to link (caller keeps the original node).
function splitText(value: string): MdNode[] | null {
  CTA_URL.lastIndex = 0;
  const out: MdNode[] = [];
  let last = 0;
  let found = false;
  let m: RegExpExecArray | null;
  while ((m = CTA_URL.exec(value)) !== null) {
    let full = m[0];
    const host = m[1];
    let path = m[2] || "";
    // Don't pull trailing sentence punctuation into the URL.
    const punct = full.match(/[.,;:!?]+$/);
    if (punct) {
      full = full.slice(0, -punct[0].length);
      path = path.replace(/[.,;:!?]+$/, "");
    }
    found = true;
    if (m.index > last) out.push({ type: "text", value: value.slice(last, m.index) });
    const { href, external } = hrefFor(host, path);
    out.push(linkNode(full, href, external));
    last = m.index + full.length;
  }
  if (!found) return null;
  if (last < value.length) out.push({ type: "text", value: value.slice(last) });
  return out;
}

function walk(node: MdNode, insideLink: boolean): void {
  if (!node || !Array.isArray(node.children)) return;
  const next: MdNode[] = [];
  for (const child of node.children) {
    if (child.type === "text" && !insideLink) {
      const replaced = splitText(child.value ?? "");
      if (replaced) {
        next.push(...replaced);
        continue;
      }
    } else if (Array.isArray(child.children)) {
      walk(child, insideLink || child.type === "link");
    }
    next.push(child);
  }
  node.children = next;
}

export function remarkAutolinkCta() {
  return (tree: MdNode): void => walk(tree, false);
}
