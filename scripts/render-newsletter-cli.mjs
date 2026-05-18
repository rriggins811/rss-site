#!/usr/bin/env node
/**
 * Newsletter renderer CLI for the Tuesday 9:55am Cowork cron.
 *
 * Standalone JS port of src/lib/newsletter-renderer.ts. Two copies exist
 * because the Cowork cron runs from a bash shell + needs zero TS-runtime
 * dependencies. When either file changes, update both. See SEND_MECHANISM_README.md.
 *
 * Usage:
 *   node scripts/render-newsletter-cli.mjs --md <path> --issue <N> [--first-name <name>]
 *
 * Output: writes <path>.rendered.html and <path>.rendered.txt next to the
 * input .md. Prints the parsed summary to stdout (subject, preheader,
 * section counts) so the cron caller can include it in the chat report.
 *
 * --first-name optional: server-side substitute (used for QA test sends).
 * When omitted, emits {{FIRST_NAME}} merge tag for Resend Broadcast.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------- CLI arg parsing ----------
function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const mdPath = arg("--md");
const issue = Number(arg("--issue") || "0");
const firstName = arg("--first-name");
if (!mdPath || !issue) {
  console.error("Usage: render-newsletter-cli.mjs --md <path> --issue <N> [--first-name <name>]");
  process.exit(2);
}
// Append a sentinel heading so every section's regex lookahead has a
// guaranteed terminator. Without this, my prior `(?=^## |\Z)` pattern
// used JS-literal `\Z` (a regex escape JS doesn't recognize as end-of-
// string) which the `i` flag matched against any literal `z` in the
// body — causing SECTION 2 to truncate at "unrecognized" mid-bullet.
const md = readFileSync(resolve(mdPath), "utf8") + "\n## __END_SENTINEL__\n";

// ---------- Brand palette (matches src/lib/newsletter-renderer.ts) ----------
const COLORS = {
  navy: "#1B2A4E", burgundy: "#6B1F2E", gold: "#C9A961",
  ink: "#2a2a2a", bgPage: "#f4f4f4", bgWrapper: "#ffffff",
  bgModule: "#f9f7f1", bgFeature: "#f4f0f2",
  borderLight: "#e0e0e0", borderRow: "#f0f0f0",
  textMuted: "#666666", textFooter: "#888888",
};

// ---------- Parser ----------
function grab(re) {
  const m = md.match(re);
  if (!m) throw new Error(`Newsletter parse failed: missing ${re}`);
  return m[1].trim();
}
const sectionRe = (label) =>
  new RegExp(`^## ${label}[^\\n]*\\n([\\s\\S]*?)(?=^## )`, "im");

// Strip trailing `---` horizontal-rule separators that sit between
// sections in the .md. The section regex captures up to the next
// `## ` heading, so the `\n\n---\n\n` separator lands in the body.
const trimTail = (s) => s.replace(/\n\s*-{3,}\s*$/m, "").trim();
const subject = trimTail(grab(sectionRe("SUBJECT LINE")));
const preheader = trimTail(grab(sectionRe("PREHEADER")));

const nuggetBlock = trimTail(grab(sectionRe("SECTION 1")));
const nuggetParagraphs = nuggetBlock.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

const highlightsBlock = trimTail(grab(sectionRe("SECTION 2")));
const highlights = [];
for (const rawLine of highlightsBlock.split(/\n(?=- )/)) {
  const line = rawLine.trim();
  if (!line.startsWith("- ")) continue;
  const stripped = line.slice(2).trim();
  const boldMatch = stripped.match(/^\*\*([^*]+)\*\*\s*([\s\S]*)$/);
  if (boldMatch) {
    highlights.push({ topic: boldMatch[1].trim(), body: boldMatch[2].trim() });
  } else {
    const dot = stripped.indexOf(". ");
    if (dot > 0) {
      highlights.push({ topic: stripped.slice(0, dot + 1).trim(), body: stripped.slice(dot + 2).trim() });
    } else {
      highlights.push({ topic: stripped, body: "" });
    }
  }
}

function parseSpotlight(block) {
  const paragraphs = block.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const titleLine = paragraphs.shift() || "";
  const titleMatch = titleLine.match(/^\*\*([\s\S]+?)\*\*$/);
  const titleRaw = titleMatch ? titleMatch[1].trim() : titleLine;
  let moduleNum = "";
  let title = titleRaw;
  let featureTagline = "";
  if (/^Module\s+\d+:/i.test(titleRaw)) {
    const split = titleRaw.match(/^(Module\s+\d+):\s*(.+)$/i);
    if (split) { moduleNum = split[1]; title = split[2]; }
  } else if (/^(.+?)\s*\(([^)]+)\)\s*$/.test(titleRaw)) {
    const split = titleRaw.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (split) { title = split[1].trim(); featureTagline = split[2].trim(); }
  }

  let ctaLabel = "Learn more";
  let ctaUrl = "https://rigginsstrategicsolutions.com";
  const ctaIdx = paragraphs.findIndex(p => /^\*\*CTA:\*\*/i.test(p));
  if (ctaIdx >= 0) {
    const ctaLine = paragraphs.splice(ctaIdx, 1)[0];
    const ctaMatch = ctaLine.match(/^\*\*CTA:\*\*\s*(.+?)\s*[→\->]+\s*(https?:\/\/\S+)/i);
    if (ctaMatch) { ctaLabel = ctaMatch[1].trim() + " →"; ctaUrl = ctaMatch[2].trim(); }
  }

  let takeaway = null;
  const takeawayIdx = paragraphs.findIndex(p => /^\*\*One takeaway/i.test(p));
  if (takeawayIdx >= 0) {
    const takeawayLine = paragraphs.splice(takeawayIdx, 1)[0];
    const tMatch = takeawayLine.match(/^\*\*[^*]+\*\*\s*([\s\S]*)$/);
    takeaway = tMatch ? tMatch[1].trim() : takeawayLine;
  }

  return { moduleNum, title, bodyParagraphs: paragraphs, takeaway, ctaLabel, ctaUrl, featureTagline };
}

const moduleHeaderRe = /## SECTION 3[^\n]*\(([^)]+)\)/im;
const weekLabel = (md.match(moduleHeaderRe)?.[1]?.trim()) || "This week";
const moduleParsed = parseSpotlight(trimTail(grab(sectionRe("SECTION 3"))));
const featureParsed = parseSpotlight(trimTail(grab(sectionRe("SECTION 4"))));

const signoffMatch = md.match(/^## SIGN-?OFF\s*\n([\s\S]*?)(?=^---|^## |\Z)/im);
const signoff = (signoffMatch ? signoffMatch[1].trim() : "")
  .replace(/\n*Talk soon,?\s*\nRyan\s*$/i, "").trim();

const parsed = {
  subject, preheader, nuggetParagraphs, highlights,
  module: { weekLabel, ...moduleParsed },
  feature: { tagline: featureParsed.featureTagline, title: featureParsed.title, bodyParagraphs: featureParsed.bodyParagraphs, ctaLabel: featureParsed.ctaLabel, ctaUrl: featureParsed.ctaUrl },
  signoff,
};

// ---------- Helpers ----------
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function inlineMd(s) {
  let out = escapeHtml(s);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, "$1<em>$2</em>$3");
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}
function stripInlineMd(s) {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, "$1$2$3")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1 ($2)");
}

// ---------- HTML render ----------
const greetingName = (firstName || "").trim() || "{{FIRST_NAME}}";

const nuggetHtml = parsed.nuggetParagraphs.map(p => `    <p>${inlineMd(p)}</p>`).join("\n");
const highlightsHtml = parsed.highlights.map(h => `      <li>
        <span class="topic">${escapeHtml(h.topic)}.</span> ${inlineMd(h.body)}
      </li>`).join("\n");
const moduleBodyHtml = parsed.module.bodyParagraphs.map(p => `      <p>${inlineMd(p)}</p>`).join("\n");
const moduleTakeawayHtml = parsed.module.takeaway
  ? `      <p><strong>One takeaway you can use today:</strong> ${inlineMd(parsed.module.takeaway)}</p>` : "";
const featureBodyHtml = parsed.feature.bodyParagraphs.map(p => `      <p>${inlineMd(p)}</p>`).join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(parsed.subject)}</title>
<style>
  body { margin: 0; padding: 0; background: ${COLORS.bgPage}; font-family: Arial, Helvetica, sans-serif; color: ${COLORS.ink}; line-height: 1.6; }
  .wrapper { max-width: 600px; margin: 0 auto; background: ${COLORS.bgWrapper}; }
  .header { background: ${COLORS.navy}; padding: 28px 32px; text-align: center; }
  .header h1 { color: ${COLORS.gold}; margin: 0; font-size: 26px; letter-spacing: 1px; font-weight: bold; }
  .header p { color: #ffffff; margin: 6px 0 0 0; font-size: 13px; font-style: italic; opacity: 0.85; }
  .body { padding: 32px 32px 16px 32px; }
  .body p { margin: 0 0 16px 0; font-size: 16px; }
  .greeting { font-size: 17px; font-weight: bold; color: ${COLORS.navy}; }
  .nugget p { font-size: 16px; }
  .nugget p:first-of-type::first-letter { font-size: 38px; font-weight: bold; color: ${COLORS.burgundy}; float: left; padding: 4px 8px 0 0; line-height: 1; }
  .divider { border: none; border-top: 2px solid ${COLORS.gold}; margin: 32px 32px; }
  .section { padding: 0 32px 16px 32px; }
  .section-label { color: ${COLORS.burgundy}; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px 0; }
  .section h2 { color: ${COLORS.navy}; font-size: 22px; margin: 0 0 16px 0; line-height: 1.3; }
  .highlights ul { list-style: none; padding: 0; margin: 0; }
  .highlights li { padding: 12px 0 12px 24px; border-bottom: 1px solid ${COLORS.borderRow}; font-size: 15px; position: relative; }
  .highlights li:last-child { border-bottom: none; }
  .highlights li::before { content: "→"; color: ${COLORS.gold}; font-weight: bold; position: absolute; left: 0; top: 12px; font-size: 16px; }
  .highlights .topic { font-weight: bold; color: ${COLORS.navy}; }
  .module-card { background: ${COLORS.bgModule}; border-left: 4px solid ${COLORS.gold}; padding: 20px 24px; margin: 8px 0 16px 0; }
  .module-card .module-num { color: ${COLORS.burgundy}; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 4px 0; }
  .module-card h3 { color: ${COLORS.navy}; font-size: 19px; margin: 0 0 12px 0; }
  .module-card p { font-size: 15px; margin: 0 0 12px 0; }
  .feature-card { background: ${COLORS.bgFeature}; border-left: 4px solid ${COLORS.burgundy}; padding: 20px 24px; margin: 8px 0 16px 0; }
  .feature-card .feature-num { color: ${COLORS.burgundy}; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 4px 0; }
  .feature-card h3 { color: ${COLORS.navy}; font-size: 19px; margin: 0 0 12px 0; }
  .feature-card p { font-size: 15px; margin: 0 0 12px 0; }
  .cta-btn { display: inline-block; background: ${COLORS.navy}; color: #ffffff !important; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px; margin-top: 4px; letter-spacing: 0.5px; }
  .cta-btn.gold { background: ${COLORS.burgundy}; }
  .signoff { padding: 24px 32px 8px 32px; }
  .signoff p { font-size: 16px; margin: 0 0 8px 0; }
  .signoff .name { font-weight: bold; color: ${COLORS.navy}; font-size: 17px; }
  .footer { background: ${COLORS.navy}; padding: 24px 32px; text-align: center; color: #ffffff; font-size: 11px; line-height: 1.6; }
  .footer p { margin: 4px 0; opacity: 0.85; }
  .footer a { color: ${COLORS.gold}; text-decoration: none; }
  .disclosure { background: ${COLORS.bgPage}; padding: 16px 32px; text-align: center; font-size: 11px; color: ${COLORS.textFooter}; border-top: 1px solid ${COLORS.borderLight}; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>RIGGINS STRATEGIC SOLUTIONS</h1>
    <p>The newsletter for families navigating senior transitions</p>
  </div>
  <div class="body greeting-block">
    <p class="greeting">Hi ${escapeHtml(greetingName)},</p>
  </div>
  <div class="body nugget">
${nuggetHtml}
  </div>
  <hr class="divider">
  <div class="section highlights">
    <p class="section-label">This Week At RSS</p>
    <h2>Things worth knowing from this week</h2>
    <ul>
${highlightsHtml}
    </ul>
  </div>
  <hr class="divider">
  <div class="section">
    <p class="section-label">Blueprint Module Spotlight</p>
    <h2>${escapeHtml(parsed.module.weekLabel)}</h2>
    <div class="module-card">
      <p class="module-num">${escapeHtml(parsed.module.moduleNum)}</p>
      <h3>${escapeHtml(parsed.module.title)}</h3>
${moduleBodyHtml}
${moduleTakeawayHtml}
      <a href="${escapeHtml(parsed.module.ctaUrl)}" class="cta-btn">${escapeHtml(parsed.module.ctaLabel)}</a>
    </div>
  </div>
  <hr class="divider">
  <div class="section">
    <p class="section-label">SeniorSafe Feature Spotlight</p>
    <h2>${escapeHtml(parsed.feature.title)}</h2>
    <div class="feature-card">
      <p class="feature-num">${escapeHtml(parsed.feature.tagline || "Why it matters")}</p>
      <h3>${escapeHtml(parsed.feature.title)}</h3>
${featureBodyHtml}
      <a href="${escapeHtml(parsed.feature.ctaUrl)}" class="cta-btn gold">${escapeHtml(parsed.feature.ctaLabel)}</a>
    </div>
  </div>
  <hr class="divider">
  <div class="signoff">
    <p>${inlineMd(parsed.signoff)}</p>
    <p>Talk soon,</p>
    <p class="name">Ryan</p>
  </div>
  <div class="disclosure">
    Ryan Riggins · NC Real Estate License #361546 · eXp Realty
  </div>
  <div class="footer">
    <p>Riggins Strategic Solutions · Greensboro, NC</p>
    <p>You are receiving this because you signed up at rigginsstrategicsolutions.com.</p>
    <p>Issue ${String(issue).padStart(3, "0")} · <a href="{{RESEND_UNSUBSCRIBE_URL}}">Unsubscribe</a></p>
  </div>
</div>
</body>
</html>`;

// ---------- Text render ----------
const sep = "\n\n----------------------------------------\n\n";
const text = [
  `Hi ${greetingName},`,
  parsed.nuggetParagraphs.map(stripInlineMd).join("\n\n"),
  sep.trim(),
  `THIS WEEK AT RSS`,
  parsed.highlights.map(h => `→ ${stripInlineMd(h.topic)}. ${stripInlineMd(h.body)}`).join("\n\n"),
  sep.trim(),
  `BLUEPRINT MODULE SPOTLIGHT — ${parsed.module.weekLabel}`,
  `${parsed.module.moduleNum}: ${parsed.module.title}`,
  parsed.module.bodyParagraphs.map(stripInlineMd).join("\n\n"),
  parsed.module.takeaway ? `One takeaway you can use today: ${stripInlineMd(parsed.module.takeaway)}` : "",
  `${parsed.module.ctaLabel}: ${parsed.module.ctaUrl}`,
  sep.trim(),
  `SENIORSAFE FEATURE SPOTLIGHT`,
  parsed.feature.title + (parsed.feature.tagline ? ` — ${parsed.feature.tagline}` : ""),
  parsed.feature.bodyParagraphs.map(stripInlineMd).join("\n\n"),
  `${parsed.feature.ctaLabel}: ${parsed.feature.ctaUrl}`,
  sep.trim(),
  stripInlineMd(parsed.signoff),
  `Talk soon,\nRyan`,
  "",
  `--`,
  `Ryan Riggins · NC Real Estate License #361546 · eXp Realty`,
  `Riggins Strategic Solutions · Greensboro, NC`,
  `Issue ${String(issue).padStart(3, "0")}`,
  `Unsubscribe: {{RESEND_UNSUBSCRIBE_URL}}`,
].filter(Boolean).join("\n\n");

// ---------- Write output + summary ----------
const htmlOut = mdPath.replace(/\.md$/, ".rendered.html");
const textOut = mdPath.replace(/\.md$/, ".rendered.txt");
writeFileSync(htmlOut, html);
writeFileSync(textOut, text);

console.log(JSON.stringify({
  ok: true,
  subject: parsed.subject,
  preheader: parsed.preheader,
  issueNumber: issue,
  greetingMode: firstName ? "server-side" : "broadcast-merge-tag",
  nuggetParagraphs: parsed.nuggetParagraphs.length,
  highlights: parsed.highlights.length,
  moduleTitle: `${parsed.module.moduleNum}: ${parsed.module.title}`,
  featureTitle: parsed.feature.title,
  htmlOut,
  textOut,
  htmlBytes: html.length,
  textBytes: text.length,
}, null, 2));
