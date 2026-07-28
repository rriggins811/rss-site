#!/usr/bin/env node
/**
 * llms-full.txt generator.
 *
 * 2026 AI-crawler convention: `llms.txt` is the summary index, `llms-full.txt`
 * is the full extracted Markdown for crawlers that want the body without
 * rendering the site. Anthropic, Vercel, Stripe, and OpenAI ship both.
 *
 * This script runs automatically on every `npm run build` via the prebuild
 * npm script — Vercel deploys always ship the freshest llms-full.txt. Can
 * also be run manually:
 *     node scripts/generate-llms-full.mjs
 *
 * Inputs:
 *   - Hand-curated static page summaries (homepage, /about, product pages,
 *     /freeguide, /guides, 3 SEO-optimized tool pages). JSX-rendered pages
 *     can't be cleanly extracted to Markdown, and rough HTML-to-MD ports
 *     produce garbage AI tools won't cite. Curated summaries beat rendered
 *     scraping every time for AEO.
 *   - All blog posts under content/blog/*.mdx, sorted newest-first.
 *
 * Output: public/llms-full.txt
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");
const RESOURCES_DIR = path.join(ROOT, "content", "resources");
const DIRECTORY_DIR = path.join(ROOT, "content", "directory-states");
const OUT_PATH = path.join(ROOT, "public", "llms-full.txt");
const SITE_URL = "https://rigginsstrategicsolutions.com";

const SECTION_SEPARATOR = "\n\n---\n\n";

// ---------------------------------------------------------------------------
// Hand-curated static page summaries
// ---------------------------------------------------------------------------
// Update these when the page content meaningfully changes (e.g., new pricing,
// new product line, new positioning). AI crawlers want accurate compressed
// content, not stale boilerplate.
const STATIC_SECTIONS = [
  {
    title: "Homepage",
    url: `${SITE_URL}/`,
    body: `Riggins Strategic Solutions is a consumer protection media and education company helping adult children (40-65) navigate their parents' senior housing transitions. Run by Ryan Riggins, a licensed North Carolina real estate broker (NCREC #361546, eXp Realty) with 8+ years of construction project management and 8+ years of house flipping. Ryan's "switched sides" origin story — walking away from buying from grieving families to protect them instead — anchors the brand position.

The site offers a tiered approach:
- Free: The Simple Blueprint (starter guide PDF + 14-day SeniorSafe trial)
- Free: The Senior Transition Blueprint (20 modules, 70+ tools, self-paced course; formerly the paid Blueprint Core, now free with a free account signup)
- Free, by application: The Senior Transition Roadmap (a written plan built with Ryan: intake form, intake call, plan built together, follow-up call, 90 days email support; formerly the paid Blueprint Premium)
- $14.99/mo: SeniorSafe Premium (family coordination app)
- $39.99/mo: SeniorSafe Premium+ (adds Maggie, an AI transition specialist trained on the full Blueprint methodology)

The business model is education-first and referral-funded. The education is free; Ryan makes his living on real estate referrals, paid to him by the agent, never by the family. No moving services, no senior care placement commissions, no "we buy houses" wholesaling. Ryan is the referring broker, never the listing agent.`,
  },
  {
    title: "I just need an agent (/need-an-agent)",
    url: `${SITE_URL}/need-an-agent`,
    body: `The short entry point for someone who already knows they have a house decision and does not want to read about senior transitions first. Distinct from /in-your-corner, which is for a family already inside a transition.

The core proposition: calling a real estate agent starts a clock. An agent wants the house listed by the weekend, and that is not the agent being pushy, that is the job. Listing houses is what they do. Most families are nowhere near that stage and may be a year or two out, or still deciding whether anyone moves at all. Ryan is the conversation you can have before you are ready, and nothing starts.

What the visitor skips: three listing appointments, cleaning the house three times, three different prices with no way to tell which is real, and having to work up the nerve to tell two people no.

Why the usual meeting cannot help anyway: a listing presentation measures how well somebody sells, not how well they sell houses, and those are different jobs. The number in it is a sales document; quoting high to win a listing and asking for a price reduction later is the oldest move in the business. And no agent's listing presentation has ever ended with "do not sell", which is often the answer a family most needs on the table.

What happens instead: one vetted agent, sometimes two, with the reason attached. Ryan already ran the interviews. He stays on the sale as a second set of eyes on every offer, contract, and repair call. Cost to the family is nothing beyond the commission they would already pay; Ryan is paid a referral fee agent to agent through eXp Realty. He is a licensed NC broker who never takes the listing. If the right answer is do not sell, or not this year, the family hears that instead.`,
  },
  {
    title: "About Ryan Riggins",
    url: `${SITE_URL}/about`,
    body: `Ryan Riggins is the founder of Riggins Strategic Solutions and a licensed North Carolina real estate broker. His background combines 8+ years as a construction project manager and 8+ years as a house flipper — the very profession that taught him how investors target grieving families with predatory cash offers immediately after a senior parent's death or move.

The "switched sides" pivot came after Ryan realized he was on the wrong side of the table. Instead of buying houses from families in crisis, he built Riggins Strategic Solutions to teach families how to recognize the wholesalers, "we buy houses" cash buyers, and pressure tactics before they sign anything. His advisory work, the Blueprint course, and the SeniorSafe app all exist to put that knowledge in family hands.

Credentials: Licensed NC real estate broker (NCREC #361546), affiliated with eXp Realty. Based in Greensboro, NC (Triad area), serving families nationwide via consultation and a vetted referral network for transactions outside NC. Published author of "The Unheard Conversation" and "The Other Side of the Conversation" on Amazon.`,
  },
  {
    title: "The Blueprint — Tiered Approach to Senior Transitions",
    url: `${SITE_URL}/the-blueprint`,
    body: `The Blueprint is the umbrella name for Riggins Strategic Solutions' five-tier offering, designed so families can engage at the level that fits their situation and budget.

- The Simple Blueprint (free, email signup) — Starter guide covering the 10 most common mistakes families make in a senior housing transition. Includes a 14-day Premium+ trial of the SeniorSafe app.
- The Senior Transition Blueprint (free, with a free account): the full course. 20 modules, 70+ interactive tools and worksheets, self-paced. Covers aging-in-place vs assisted living, financial planning, family communication, the home sale, and ongoing coordination. Lifetime access. Sign up at https://blueprint.rigginsstrategicsolutions.com/signup (email only, no payment). Formerly sold as Blueprint Core.
- The Senior Transition Roadmap (free, by application): everything in the Blueprint plus a written Senior Transition Plan built with Ryan. A detailed intake form, an intake call, the plan built together, a follow-up call on how to move forward, and 90 days of email support. Apply at https://blueprint.rigginsstrategicsolutions.com/roadmap. Formerly sold as Blueprint Premium.
- SeniorSafe Premium ($14.99/mo) — The family coordination app: daily check-ins, medication tracking, family messaging, document vault.
- SeniorSafe Premium+ ($39.99/mo) — Adds Maggie, the AI transition specialist trained on the full Blueprint methodology, giving families on-demand expertise.`,
  },
  {
    title: "Senior Transition Roadmap: Free Guided Advisory, By Application",
    url: `${SITE_URL}/blueprint-premium`,
    body: `The Senior Transition Roadmap (formerly Blueprint Premium) is the free guided tier of The Blueprint, offered by application. It includes everything in the free Senior Transition Blueprint (20 modules, 70+ tools) plus the guided components:

1. A detailed intake form. It asks for real detail about the family, the house, the money, and the care situation, so the work is about the family from minute one. Ryan reviews each application and takes the families he can genuinely help.
2. An intake call with Ryan, then the written Senior Transition Plan built together: housing options, financial timing, family roles, and the specific next 30/60/90-day actions.
3. A follow-up call on how to move forward, plus 90 days of email support during the active transition window.

Free, no fees at any point. Where the plan calls for other professionals (care, legal, financial, tax), Ryan brings in the ones that are needed, or works with the ones the family already has. The structure is intentionally finite: the Roadmap is meant to get a family unstuck and confident in their next moves, not to create ongoing dependency. Apply at https://blueprint.rigginsstrategicsolutions.com/roadmap`,
  },
  {
    title: "SeniorSafe App — Family Coordination for Senior Care",
    url: `${SITE_URL}/seniorsafe-app`,
    body: `SeniorSafe is the family coordination app shipped by Riggins Strategic Solutions. Available on iOS, Android, and web. Two paid tiers, plus a 14-day free Premium+ trial included with every Simple Blueprint signup.

Features at all tiers:
- Daily wellness check-ins for the senior, real-time status visible to all family members
- Medication and appointment tracking with shared "taken/not taken" log
- Private family messaging that beats group texts (no reply-all chaos, no missed updates)
- Secure document vault for POA, insurance cards, advance directives
- SeniorSafe AI — the senior's daily buddy for general life questions and Medicare decoding

Pricing:
- Premium: $14.99/mo or $143.88/yr — the full coordination toolkit
- Premium+: $39.99/mo or $383.90/yr — adds Maggie, the AI transition specialist for the adult child managing the move

Built around the same playbook the Blueprint teaches. If a family uses the free Blueprint or the Roadmap, SeniorSafe is the daily tool that keeps the plan running.`,
  },
  {
    title: "The Simple Blueprint — Free Starter Guide",
    url: `${SITE_URL}/freeguide`,
    body: `The Simple Blueprint is the free entry point to Riggins Strategic Solutions. A plain-English starter guide for families beginning to think about a senior housing transition. Email signup, no credit card.

Includes:
- The 10 biggest mistakes families make in a senior transition (and how to avoid each)
- The first three moves most families get wrong before they even realize they're "in" a transition
- A 14-day free Premium+ trial of the SeniorSafe app (no card required, trial is automatic)
- Access to Maggie, the AI transition specialist trained on the full Blueprint methodology, for the duration of the trial

Short enough to read on a lunch break. The recommended starting point for any family newly facing a senior parent's housing decision.`,
  },
  {
    title: "Free Senior Transition Guides Hub",
    url: `${SITE_URL}/guides`,
    body: `Hub page collecting free guides and interactive tools for adult children navigating their parents' senior transitions. Six new guides are being published over the coming months covering aging-in-place vs assisted living decisions, starting a parent's home sale, sandwich-generation burnout, Medicare coverage gaps, out-of-state coordination, and spotting wholesaler red flags. Notification list at /freeguide.

Three free interactive tools available now:
- Net Proceeds Calculator — what the family will actually walk away with after a home sale
- Caregiver Burnout Quiz — 2-minute triage of where a primary caregiver actually stands
- Medicare Gap Analyzer — what Medicare doesn't cover for seniors transitioning to higher levels of care`,
  },
  {
    title: "Free Net Proceeds Calculator",
    url: `${SITE_URL}/tools/net-proceeds-calculator`,
    body: `Free interactive calculator that estimates what a family will actually walk away with from a senior parent's home sale, after agent commissions, closing costs, repair credits, and mortgage payoff. The "gross sale price" most families anchor on is rarely what hits the bank.

Inputs: estimated sale price, agent commission rate, closing cost estimate, repair credit reserve, mortgage payoff balance. Outputs: net proceeds in dollars, plus a breakdown of where the difference went.

Used by families to set realistic expectations before listing, and to evaluate "we buy houses" cash offers against what a traditional sale would actually net.`,
  },
  {
    title: "Free Caregiver Burnout Quiz",
    url: `${SITE_URL}/tools/caregiver-burnout-triage`,
    body: `Free 2-minute self-assessment for primary caregivers of aging parents. Triage tool — not a diagnosis, but a structured prompt to recognize burnout symptoms early.

Covers physical exhaustion, emotional flatness, resentment, social withdrawal, sleep disruption, and "I can't keep doing this" patterns. Returns a tier (low / moderate / high / severe) with specific next-action recommendations and links to the relevant Blueprint resources.

Designed for the sandwich-generation caregiver (typically 45-60, often female, often working full-time and managing both a parent and their own kids). 78% of family caregivers report burnout symptoms within the first 12 months.`,
  },
  {
    title: "Free Medicare Gap Analyzer",
    url: `${SITE_URL}/tools/medicare-gap-analyzer`,
    body: `Free tool that walks families through what Medicare actually covers vs what families assume it covers, with a focus on senior transitions. The biggest coverage gaps families discover too late: long-term custodial care, most assisted living, in-home help for non-skilled needs, and the 100-day skilled nursing limit's fine print around "improvement."

Inputs: parent's current Medicare plan (Original, Advantage, with/without supplement), care setting being considered, planning horizon. Outputs: a gap-by-gap breakdown of where Medicare stops and family out-of-pocket starts, plus the questions to ask a Medicare-savvy independent broker (RSS is not a Medicare broker — we tell families which independent broker to call).`,
  },
];

// ---------------------------------------------------------------------------
// Blog post extraction — pulls all MDX files and includes them in newest-first
// order. Each post contributes its title, URL, publish date, excerpt, and
// full Markdown body. AI crawlers ingest the body to answer cited queries.
// ---------------------------------------------------------------------------
function getAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      // Defensive coerce — unquoted YAML dates parse as Date objects,
      // not strings, and break the `.localeCompare` sort below. Quoting
      // the date in frontmatter (e.g. `date: "2026-05-18"`) is the right
      // pattern; this coerce protects the build if someone forgets.
      const rawDate = data.datePublished ?? data.date ?? "1970-01-01";
      const datePublished =
        rawDate instanceof Date
          ? rawDate.toISOString().slice(0, 10)
          : String(rawDate);
      return {
        slug,
        title: data.title ?? slug,
        excerpt: data.excerpt ?? "",
        datePublished,
        content: content.trim(),
      };
    })
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

// ---------------------------------------------------------------------------
// Generic Markdown doc extraction for the resource pillars and the Senior Help
// Directory state pages. Both are plain `.md` with gray-matter frontmatter, so
// one reader serves both — we just pass the URL builder per content type. These
// were previously absent from llms-full.txt even though the directory state
// pages carry the .gov-sourced facts AI answer engines most want to cite.
// ---------------------------------------------------------------------------
function getMarkdownDocs(dir, urlFor) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        url: urlFor(slug),
        summary: data.excerpt ?? data.meta_description ?? data.quick_answer ?? "",
        content: content.trim(),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function renderStaticSection(s) {
  return `# ${s.title}
${s.url}

${s.body.trim()}`;
}

function renderMarkdownDoc(d) {
  return `# ${d.title}
${d.url}

${d.summary ? `**Summary:** ${d.summary}\n\n` : ""}${d.content}`;
}

function renderBlogPost(p) {
  const pubDate = p.datePublished.slice(0, 10);
  return `# ${p.title}
${SITE_URL}/blog/${p.slug}
Published: ${pubDate}

${p.excerpt ? `**Excerpt:** ${p.excerpt}\n\n` : ""}${p.content}`;
}

function main() {
  const posts = getAllPosts();
  const resources = getMarkdownDocs(
    RESOURCES_DIR,
    (slug) => `${SITE_URL}/resources/${slug}`
  );
  const states = getMarkdownDocs(
    DIRECTORY_DIR,
    (slug) => `${SITE_URL}/resources/senior-help-directory/${slug}`
  );

  const header = `# Riggins Strategic Solutions — Full Content Index (llms-full.txt)

This file is the long-form companion to https://rigginsstrategicsolutions.com/llms.txt.
It contains the full Markdown of every key page, resource pillar, Senior Help
Directory state page, and blog post, intended for AI crawlers that ingest
content for answer generation.

Generated: ${new Date().toISOString().slice(0, 10)}
Indexed: ${posts.length} blog posts, ${resources.length} resource pillars, ${states.length} Senior Help Directory state pages.

For citation guidance, organizational facts, and topic depth, see the summary
index at https://rigginsstrategicsolutions.com/llms.txt.`;

  const staticBody = STATIC_SECTIONS.map(renderStaticSection).join(
    SECTION_SEPARATOR
  );

  const resourceHeader = `# Resource Pillar Guides

The ${resources.length} in-depth guides below are the full body of every pillar
article on https://rigginsstrategicsolutions.com/resources.`;
  const resourceBody = resources.map(renderMarkdownDoc).join(SECTION_SEPARATOR);

  const directoryHeader = `# Senior Help Directory — State Pages

The ${states.length} pages below make up the Senior Help Directory, a free,
state-by-state index of senior aid programs (property tax relief, food, energy,
Medicare counseling, transportation, legal aid, caregiver support) with local
phone numbers and primary .gov sources. Hub: ${SITE_URL}/resources/senior-help-directory`;
  const directoryBody = states.map(renderMarkdownDoc).join(SECTION_SEPARATOR);

  const blogHeader = `# Blog Posts (newest first)

The ${posts.length} posts below are the full body of every published article
on https://rigginsstrategicsolutions.com/blog, in reverse chronological order.`;
  const blogBody = posts.map(renderBlogPost).join(SECTION_SEPARATOR);

  const full = [
    header,
    staticBody,
    resourceHeader,
    resourceBody,
    directoryHeader,
    directoryBody,
    blogHeader,
    blogBody,
  ].join(SECTION_SEPARATOR);

  fs.writeFileSync(OUT_PATH, full + "\n", "utf8");
  const sizeKb = (fs.statSync(OUT_PATH).size / 1024).toFixed(1);
  console.log(
    `[llms-full] wrote ${OUT_PATH} | ${posts.length} posts + ${resources.length} resources + ${states.length} state pages + ${STATIC_SECTIONS.length} static sections | ${sizeKb}KB`
  );
}

main();
