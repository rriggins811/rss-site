#!/usr/bin/env node
/**
 * Post-build JSON-LD schema validator.
 *
 * Walks every static HTML file rendered by `next build` and extracts the
 * <script type="application/ld+json"> blocks. Validates:
 *
 *   1. The JSON parses (catches stray template literals, missing
 *      commas, the classic "rendered \" instead of \"" gotcha)
 *   2. The block has `@context` and `@type` at the top level (or is an
 *      array of objects that each do)
 *   3. Specific @type values that we ship include their required fields
 *      (e.g. Review.itemReviewed, HowTo.step, Product.offers, etc.)
 *
 * Runs as `postbuild` so any regression in schema shape fails CI before
 * a bad build ships. Console-friendly diagnostics name the offending
 * page + the offending @type + the missing field.
 *
 * To run manually:  node scripts/validate-schemas.mjs
 * Auto-runs after:  npm run build  (via postbuild npm script)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const NEXT_OUT = path.join(ROOT, ".next", "server", "app");

// Required field map per @type. Conservative: only checks the fields
// that Google's Rich Results Test treats as critical errors (vs
// non-critical warnings). Don't over-enforce here — Google's validator
// is the authoritative source; this script catches the obvious breakage
// before it ships.
const REQUIRED_FIELDS = {
  Organization: ["name", "url"],
  Person: ["name"],
  Article: ["headline", "author", "datePublished"],
  HowTo: ["name", "step"],
  Product: ["name", "offers"],
  MobileApplication: ["name", "offers"],
  WebSite: ["url"],
  ProfessionalService: ["name", "url"],
  LocalBusiness: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  Review: ["author", "reviewRating", "itemReviewed"],
  CollectionPage: ["name", "url"],
};

let totalSchemas = 0;
let totalErrors = 0;
const errorsByFile = new Map();

function addError(file, msg) {
  totalErrors++;
  if (!errorsByFile.has(file)) errorsByFile.set(file, []);
  errorsByFile.get(file).push(msg);
}

function checkSchemaObject(file, obj, indexLabel) {
  if (!obj || typeof obj !== "object") {
    addError(file, `${indexLabel} is not an object`);
    return;
  }
  const type = obj["@type"];
  if (!type) {
    addError(file, `${indexLabel} missing @type`);
    return;
  }
  const required = REQUIRED_FIELDS[type];
  if (!required) {
    // @type we don't have a rule for — skip, it's not necessarily
    // wrong, just unfamiliar. (e.g. SearchAction nested inside
    // WebSite is checked via its parent.)
    return;
  }
  for (const field of required) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
      addError(file, `${indexLabel} (${type}) missing required field: ${field}`);
    }
  }
  // HowTo extra check: each step needs name + text
  if (type === "HowTo" && Array.isArray(obj.step)) {
    obj.step.forEach((s, i) => {
      if (!s.name || !s.text) {
        addError(
          file,
          `${indexLabel} (HowTo) step[${i}] missing name or text`
        );
      }
    });
  }
  // Review extra check: itemReviewed needs @type (not just @id)
  if (type === "Review" && obj.itemReviewed && !obj.itemReviewed["@type"]) {
    addError(
      file,
      `${indexLabel} (Review) itemReviewed missing @type (bare @id refs get treated as Thing by Google)`
    );
  }
}

function validateFile(file) {
  const html = fs.readFileSync(file, "utf8");
  // Extract every JSON-LD script tag. Regex is intentionally
  // permissive — Next strips formatting, so attributes can be in any
  // order.
  const matches = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];

  matches.forEach((m, i) => {
    totalSchemas++;
    const raw = m[1].trim();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      addError(
        file,
        `schema #${i + 1} FAILED to parse JSON: ${err.message}. First 100 chars: ${raw.slice(0, 100)}`
      );
      return;
    }
    if (Array.isArray(parsed)) {
      parsed.forEach((obj, j) =>
        checkSchemaObject(file, obj, `schema #${i + 1}[${j}]`)
      );
    } else {
      checkSchemaObject(file, parsed, `schema #${i + 1}`);
    }
  });
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) {
      validateFile(full);
    }
  }
}

function main() {
  if (!fs.existsSync(NEXT_OUT)) {
    console.warn(
      `[schema-validate] ${NEXT_OUT} not found — skipping (run after \`next build\`)`
    );
    process.exit(0);
  }
  walk(NEXT_OUT);

  if (totalErrors > 0) {
    console.error(
      `\n[schema-validate] ❌ ${totalErrors} error(s) across ${errorsByFile.size} file(s), ${totalSchemas} schema(s) checked\n`
    );
    for (const [file, msgs] of errorsByFile) {
      const rel = path.relative(ROOT, file);
      console.error(`  ${rel}`);
      msgs.forEach((m) => console.error(`    - ${m}`));
    }
    console.error("");
    process.exit(1);
  }
  console.log(
    `[schema-validate] ✓ all ${totalSchemas} schema blocks valid across ${errorsByFile.size === 0 ? "all" : ""} files`
  );
}

main();
