import fs from "node:fs";
import path from "node:path";

/**
 * Statewide prose for the Senior Help Directory [state] pages.
 *
 * Each US state + DC has a markdown file at content/directory-states/<slug>.md
 * (slug matches DIRECTORY_STATES). The [state] route renders this prose as the
 * statewide body. County listings (NC) come from the DIRECTORY_COUNTIES
 * registry and are rendered by the route, so this loader STRIPS the source
 * file's own H1, its "Find help in your county" section, and its trailing
 * disclaimer to avoid duplicating what the route already renders.
 *
 * Most non-NC pages are intentionally routed through national locators (the
 * per-state data was stale), which makes them near-duplicates of each other.
 * The route keeps them noindex until a state gains real depth (counties or
 * verified state-specific data), so the duplication never reaches the index.
 */

const STATES_DIR = path.join(process.cwd(), "content", "directory-states");

/**
 * Returns the cleaned statewide body markdown for a state slug, or null if no
 * file exists. Cleaning:
 *   - drop the leading H1 (route renders the title)
 *   - drop the "## Find help in your county" section onward (route renders
 *     county cards from the registry)
 *   - drop the trailing `---` disclaimer block (route renders its own)
 */
export function getStateContent(slug: string): string | null {
  const file = path.join(STATES_DIR, `${slug}.md`);
  let raw: string;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }

  // Drop the first H1 line.
  let body = raw.replace(/^#\s+.*\r?\n/, "");

  // Cut the county section (NC) if present; this also removes everything after
  // it, including the source disclaimer.
  const countyIdx = body.indexOf("## Find help in your county");
  if (countyIdx !== -1) {
    body = body.slice(0, countyIdx);
  } else {
    // Otherwise cut the trailing `---` disclaimer block.
    const discIdx = body.lastIndexOf("\n---");
    if (discIdx !== -1) body = body.slice(0, discIdx);
  }

  return body.trim();
}

/** True if a statewide content file exists for this slug. */
export function hasStateContent(slug: string): boolean {
  return fs.existsSync(path.join(STATES_DIR, `${slug}.md`));
}
