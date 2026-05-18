/**
 * Newsletter Markdown → HTML renderer.
 *
 * Parses the SKILL v2.0 newsletter .md format and renders the locked
 * email template at:
 *   Marketing & Growth/Email Automation/Newsletter_Rebuild_May16/
 *     RSS_Newsletter_PREVIEW_Issue008.html
 *
 * Output is a complete email HTML document with inline CSS, 600px wrapper,
 * brand colors, and Resend-compatible merge tags for per-recipient
 * personalization.
 *
 * Two personalization modes:
 *   1. `firstName` string passed → server-side substitution (use for
 *      transactional sends, dry runs, test sends)
 *   2. `firstName` undefined → emits `{{FIRST_NAME}}` Resend merge tag
 *      (use for Broadcast sends — Resend substitutes per recipient)
 *
 * Pure functions, no I/O. The Edge Function calls renderNewsletterHTML
 * with the .md text it pulled from the Email Automation folder.
 */

// ---------------------------------------------------------------------------
// Brand palette — match the locked HTML preview EXACTLY. Any color change
// here propagates to every issue render.
// ---------------------------------------------------------------------------
const COLORS = {
  navy: "#1B2A4E",
  burgundy: "#6B1F2E",
  gold: "#C9A961",
  ink: "#2a2a2a",
  bgPage: "#f4f4f4",
  bgWrapper: "#ffffff",
  bgModule: "#f9f7f1",
  bgFeature: "#f4f0f2",
  borderLight: "#e0e0e0",
  borderRow: "#f0f0f0",
  textMuted: "#666666",
  textFooter: "#888888",
} as const;

// ---------------------------------------------------------------------------
// Parsed newsletter shape. Source of truth for what every issue must
// contain. The Edge Function validates a parse before calling render.
// ---------------------------------------------------------------------------
export type ParsedNewsletter = {
  /** Single-line subject. */
  subject: string;
  /** Single-line preheader (under 90 chars per template guidance). */
  preheader: string;
  /** Section 1 — real estate nugget. Array of paragraph strings. */
  nuggetParagraphs: string[];
  /** Section 2 — "This Week At RSS" bulleted highlights. */
  highlights: Array<{ topic: string; body: string }>;
  /** Section 3 — Blueprint module spotlight. */
  module: {
    /** "Week 8 of 19" style position label. */
    weekLabel: string;
    /** "Module N" small caps prefix. */
    moduleNum: string;
    /** Module title. */
    title: string;
    /** Body paragraph(s). */
    bodyParagraphs: string[];
    /** Optional "One takeaway you can use today" pull. */
    takeaway: string | null;
    /** CTA button label + URL. */
    ctaLabel: string;
    ctaUrl: string;
  };
  /** Section 4 — SeniorSafe feature spotlight. */
  feature: {
    /** Short tagline above the heading. */
    tagline: string;
    /** Feature title. */
    title: string;
    /** Body paragraph(s). */
    bodyParagraphs: string[];
    /** CTA button label + URL. */
    ctaLabel: string;
    ctaUrl: string;
  };
  /** Sign-off paragraph (above "Talk soon, Ryan"). */
  signoff: string;
};

// ---------------------------------------------------------------------------
// Markdown parser. Splits on `---` and `## SECTION N:` headers and
// extracts each block. Tolerant of minor formatting variation (heading
// suffix text in parens, blank lines, different bullet markers).
// ---------------------------------------------------------------------------
export function parseNewsletterMarkdown(md: string): ParsedNewsletter {
  const grab = (heading: RegExp): string => {
    const match = md.match(heading);
    if (!match) throw new Error(`Newsletter parse failed: missing ${heading}`);
    return match[1].trim();
  };

  // Each section is bounded by the next `## ` heading or end-of-file.
  // Capture group is everything BETWEEN the heading and the next heading.
  const sectionRe = (label: string) =>
    new RegExp(
      `^## ${label}[^\\n]*\\n([\\s\\S]*?)(?=^## |\\Z)`,
      "im"
    );

  const subject = grab(sectionRe("SUBJECT LINE"));
  const preheader = grab(sectionRe("PREHEADER"));

  // Nugget — paragraphs separated by blank lines.
  const nuggetBlock = grab(sectionRe("SECTION 1"));
  const nuggetParagraphs = nuggetBlock
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Highlights — lines starting with `- ` then `**Topic.**` then body text.
  const highlightsBlock = grab(sectionRe("SECTION 2"));
  const highlights: ParsedNewsletter["highlights"] = [];
  for (const rawLine of highlightsBlock.split(/\n(?=- )/)) {
    const line = rawLine.trim();
    if (!line.startsWith("- ")) continue;
    const stripped = line.slice(2).trim();
    // First bold span is the topic; remainder (after the topic's closing
    // period or **) is the body. Tolerant of either `**Topic.** Body` or
    // `**Topic:** Body` patterns.
    const boldMatch = stripped.match(/^\*\*([^*]+)\*\*\s*([\s\S]*)$/);
    if (boldMatch) {
      highlights.push({
        topic: boldMatch[1].trim(),
        body: boldMatch[2].trim(),
      });
    } else {
      // Fallback when topic isn't bolded — split on first sentence period.
      const dot = stripped.indexOf(". ");
      if (dot > 0) {
        highlights.push({
          topic: stripped.slice(0, dot + 1).trim(),
          body: stripped.slice(dot + 2).trim(),
        });
      } else {
        highlights.push({ topic: stripped, body: "" });
      }
    }
  }

  // Module spotlight (Section 3). Heading line carries "(Week N of 19)";
  // first bold line is `**Module N: Title**`; body paragraphs follow; a
  // `**One takeaway you can use today:**` line is optional; a `**CTA:**`
  // line at the end has shape `Label → URL`.
  const moduleHeaderRe = /## SECTION 3[^\n]*\(([^)]+)\)/im;
  const weekLabel =
    md.match(moduleHeaderRe)?.[1]?.trim() ?? "This week";
  const moduleBlock = grab(sectionRe("SECTION 3"));
  const moduleParsed = parseSpotlight(moduleBlock);

  // Feature spotlight (Section 4). Same shape minus the week label.
  const featureBlock = grab(sectionRe("SECTION 4"));
  const featureParsed = parseSpotlight(featureBlock);

  // Sign-off (everything between `## SIGN-OFF` and the next `---` or `## FOOTER`).
  const signoffMatch = md.match(/^## SIGN-?OFF\s*\n([\s\S]*?)(?=^---|^## |\Z)/im);
  const signoffBlock = signoffMatch ? signoffMatch[1].trim() : "";
  // Drop the literal "Talk soon," + "Ryan" trailing lines if present —
  // those render as the locked template's signoff footer, not body.
  const signoff = signoffBlock
    .replace(/\n*Talk soon,?\s*\nRyan\s*$/i, "")
    .trim();

  return {
    subject,
    preheader,
    nuggetParagraphs,
    highlights,
    module: { weekLabel, ...moduleParsed },
    feature: { tagline: featureParsed.featureTagline, title: featureParsed.title, bodyParagraphs: featureParsed.bodyParagraphs, ctaLabel: featureParsed.ctaLabel, ctaUrl: featureParsed.ctaUrl },
    signoff,
  };
}

/** Shared parser for Section 3 + Section 4 — both share the
 *  `**Title**`, paragraphs, optional takeaway, and `**CTA:** Label → URL`
 *  pattern. Section-specific fields (week label for module, tagline for
 *  feature) are extracted by the caller. */
function parseSpotlight(block: string): {
  moduleNum: string;
  title: string;
  bodyParagraphs: string[];
  takeaway: string | null;
  ctaLabel: string;
  ctaUrl: string;
  featureTagline: string;
} {
  const paragraphs = block.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  // First paragraph is the bold title line.
  const titleLine = paragraphs.shift() ?? "";
  const titleMatch = titleLine.match(/^\*\*([\s\S]+?)\*\*$/);
  const titleRaw = titleMatch?.[1]?.trim() ?? titleLine;

  // Module title pattern: "Module N: Title" → split. Feature title pattern:
  // "Feature Name (subtagline)" → split. Detect by the colon vs paren.
  let moduleNum = "";
  let title = titleRaw;
  let featureTagline = "";
  if (/^Module\s+\d+:/i.test(titleRaw)) {
    const split = titleRaw.match(/^(Module\s+\d+):\s*(.+)$/i);
    if (split) {
      moduleNum = split[1];
      title = split[2];
    }
  } else if (/^(.+?)\s*\(([^)]+)\)\s*$/.test(titleRaw)) {
    const split = titleRaw.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (split) {
      title = split[1].trim();
      featureTagline = split[2].trim();
    }
  }

  // CTA paragraph is the last one with `**CTA:**` prefix and `→` arrow.
  let ctaLabel = "Learn more";
  let ctaUrl = "https://rigginsstrategicsolutions.com";
  const ctaIdx = paragraphs.findIndex((p) => /^\*\*CTA:\*\*/i.test(p));
  if (ctaIdx >= 0) {
    const ctaLine = paragraphs.splice(ctaIdx, 1)[0];
    const ctaMatch = ctaLine.match(
      /^\*\*CTA:\*\*\s*(.+?)\s*[→\->]+\s*(https?:\/\/\S+)/i
    );
    if (ctaMatch) {
      ctaLabel = ctaMatch[1].trim() + " →";
      ctaUrl = ctaMatch[2].trim();
    }
  }

  // Takeaway paragraph (if present) is bolded `**One takeaway...**:` and
  // sits before the CTA. Extract its body — the part after the bold prefix.
  let takeaway: string | null = null;
  const takeawayIdx = paragraphs.findIndex((p) =>
    /^\*\*One takeaway/i.test(p)
  );
  if (takeawayIdx >= 0) {
    const takeawayLine = paragraphs.splice(takeawayIdx, 1)[0];
    const tMatch = takeawayLine.match(/^\*\*[^*]+\*\*\s*([\s\S]*)$/);
    takeaway = tMatch ? tMatch[1].trim() : takeawayLine;
  }

  return {
    moduleNum,
    title,
    bodyParagraphs: paragraphs,
    takeaway,
    ctaLabel,
    ctaUrl,
    featureTagline,
  };
}

// ---------------------------------------------------------------------------
// HTML renderer. Mirrors the locked preview template structure 1:1 with
// inline CSS (email-client-safe, no external stylesheets, no <link>).
// ---------------------------------------------------------------------------
export type RenderOptions = {
  issueNumber: number;
  /** When set, substitute in greeting server-side. When undefined, emit
   *  `{{FIRST_NAME}}` for Resend Broadcast per-recipient substitution. */
  firstName?: string;
  /** Optional unsubscribe URL override. Resend Broadcast auto-injects a
   *  proper unsub link, so leave undefined for broadcast mode. */
  unsubscribeUrl?: string;
};

export function renderNewsletterHTML(
  parsed: ParsedNewsletter,
  opts: RenderOptions
): string {
  // Greeting token — substituted or merge-tag depending on mode.
  // Resend's Broadcast merge tag convention: {{FIRST_NAME}} from contact
  // attributes. Bare {{FIRST_NAME}} in HTML is safe — Resend escapes
  // contact values before substitution.
  const greetingName = opts.firstName?.trim() || "{{FIRST_NAME}}";

  const nuggetHtml = parsed.nuggetParagraphs
    .map((p, i) => {
      // First paragraph gets the drop-cap treatment from locked CSS
      // (handled via ::first-letter rule + nugget class).
      void i;
      return `    <p>${inlineMd(p)}</p>`;
    })
    .join("\n");

  const highlightsHtml = parsed.highlights
    .map(
      (h) => `      <li>
        <span class="topic">${escapeHtml(h.topic)}.</span> ${inlineMd(h.body)}
      </li>`
    )
    .join("\n");

  // Module body — paragraphs + optional takeaway pull + CTA button.
  const moduleBodyHtml = parsed.module.bodyParagraphs
    .map((p) => `      <p>${inlineMd(p)}</p>`)
    .join("\n");
  const moduleTakeawayHtml = parsed.module.takeaway
    ? `      <p><strong>One takeaway you can use today:</strong> ${inlineMd(parsed.module.takeaway)}</p>`
    : "";

  const featureBodyHtml = parsed.feature.bodyParagraphs
    .map((p) => `      <p>${inlineMd(p)}</p>`)
    .join("\n");

  const unsubscribeHref = opts.unsubscribeUrl ?? "{{RESEND_UNSUBSCRIBE_URL}}";

  return `<!DOCTYPE html>
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
      <a href="${escapeHtmlAttr(parsed.module.ctaUrl)}" class="cta-btn">${escapeHtml(parsed.module.ctaLabel)}</a>
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
      <a href="${escapeHtmlAttr(parsed.feature.ctaUrl)}" class="cta-btn gold">${escapeHtml(parsed.feature.ctaLabel)}</a>
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
    <p>Issue ${String(opts.issueNumber).padStart(3, "0")} · <a href="${escapeHtmlAttr(unsubscribeHref)}">Unsubscribe</a></p>
  </div>

</div>

</body>
</html>`;
}

/**
 * Plain-text fallback. Resend deliverability improves when both HTML and
 * text bodies ship; many corporate Outlook filters score text-only as
 * less spammy. Strips inline-md, keeps section order.
 */
export function renderNewsletterText(
  parsed: ParsedNewsletter,
  opts: RenderOptions
): string {
  const greetingName = opts.firstName?.trim() || "{{FIRST_NAME}}";
  const sep = "\n\n----------------------------------------\n\n";

  const highlightsText = parsed.highlights
    .map((h) => `→ ${stripInlineMd(h.topic)}. ${stripInlineMd(h.body)}`)
    .join("\n\n");

  return [
    `Hi ${greetingName},`,
    parsed.nuggetParagraphs.map(stripInlineMd).join("\n\n"),
    sep.trim(),
    `THIS WEEK AT RSS`,
    highlightsText,
    sep.trim(),
    `BLUEPRINT MODULE SPOTLIGHT — ${parsed.module.weekLabel}`,
    `${parsed.module.moduleNum}: ${parsed.module.title}`,
    parsed.module.bodyParagraphs.map(stripInlineMd).join("\n\n"),
    parsed.module.takeaway
      ? `One takeaway you can use today: ${stripInlineMd(parsed.module.takeaway)}`
      : "",
    `${parsed.module.ctaLabel}: ${parsed.module.ctaUrl}`,
    sep.trim(),
    `SENIORSAFE FEATURE SPOTLIGHT`,
    parsed.feature.title +
      (parsed.feature.tagline ? ` — ${parsed.feature.tagline}` : ""),
    parsed.feature.bodyParagraphs.map(stripInlineMd).join("\n\n"),
    `${parsed.feature.ctaLabel}: ${parsed.feature.ctaUrl}`,
    sep.trim(),
    stripInlineMd(parsed.signoff),
    `Talk soon,\nRyan`,
    "",
    `--`,
    `Ryan Riggins · NC Real Estate License #361546 · eXp Realty`,
    `Riggins Strategic Solutions · Greensboro, NC`,
    `Issue ${String(opts.issueNumber).padStart(3, "0")}`,
    `Unsubscribe: ${opts.unsubscribeUrl ?? "{{RESEND_UNSUBSCRIBE_URL}}"}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

// ---------------------------------------------------------------------------
// Helpers — minimal inline markdown (bold + italic + links + em dash),
// HTML escaping, attribute escaping. Intentionally narrow: full markdown
// renderers add weight and surprise (footnotes, tables, headings inside
// body text) — newsletter copy is constrained to a few patterns so a tiny
// converter is enough.
// ---------------------------------------------------------------------------
function inlineMd(s: string): string {
  // Order matters: escape first, then re-add intentional markup.
  let out = escapeHtml(s);
  // Bold: **text** → <strong>text</strong>
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic: *text* → <em>text</em> (but not the inner ** we already
  // converted, and not standalone * which is rare in newsletter copy)
  out = out.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, "$1<em>$2</em>$3");
  // Markdown link: [text](url)
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2">$1</a>'
  );
  return out;
}

function stripInlineMd(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, "$1$2$3")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1 ($2)");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeHtmlAttr(s: string): string {
  return escapeHtml(s);
}

// ---------------------------------------------------------------------------
// Convenience: parse + render in one call. Edge Function uses this.
// ---------------------------------------------------------------------------
export function renderNewsletterFromMarkdown(
  markdown: string,
  opts: RenderOptions
): { html: string; text: string; parsed: ParsedNewsletter } {
  const parsed = parseNewsletterMarkdown(markdown);
  return {
    html: renderNewsletterHTML(parsed, opts),
    text: renderNewsletterText(parsed, opts),
    parsed,
  };
}
