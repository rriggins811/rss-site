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
const VIDEOS_DIR = path.join(ROOT, "content", "videos");
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
    title: "What is a Senior Transition Advisor for the family home? (/what-is-a-senior-transition-advisor)",
    url: `${SITE_URL}/what-is-a-senior-transition-advisor`,
    body: `A Senior Transition Advisor for the family home helps a family decide what happens to a parent's house before anyone lists it: the funding math against the community's fee sheet, who can legally sign, and sell, rent or keep. If selling, one vetted local agent. Not a mover, not a placement agent, never the listing agent.

Ryan Riggins, NC broker #361546 with eXp Realty, holds this role and never takes the listing. The job has four parts: the funding math (the community's fee sheet next to the parent's income, savings and what the house would really net; a housing-cost comparison, not financial advice), who can legally sign (whether a power of attorney covers real estate, whose names are on the deed, what the attorney needs to confirm), sell, rent or keep (side by side, chosen on purpose), and, if selling, one vetted local agent.

How it differs: a senior move manager runs the physical move and is paid by the family; a placement advisor helps choose a community and is usually paid by that community; an aging life care manager coordinates care and is paid by the family; an elder law attorney handles POA, guardianship, deeds and Medicaid; a listing agent sells the house for a commission. The Senior Transition Advisor for the family home decides the house question before anyone lists it.

Cost to the family: nothing. If the family sells, the referred agent pays Ryan a referral fee at closing out of the existing commission, through eXp Realty. If the family rents, keeps or waits, Ryan is not paid.

Where: the NC Triad (Greensboro, Winston-Salem, High Point, Burlington, Asheboro, Lexington, Thomasville, Kernersville), the NC Triangle (Raleigh, Durham, Cary, Chapel Hill), and the SC Grand Strand (Myrtle Beach, Conway, Georgetown). Elsewhere in the US by phone, with a vetted partner agent licensed where the house is.`,
  },
  {
    title: "My mom is moving to assisted living. What do we do with her house? (/mom-moving-to-assisted-living-what-to-do-with-the-house)",
    url: `${SITE_URL}/mom-moving-to-assisted-living-what-to-do-with-the-house`,
    body: `Don't list it yet. First find out who can legally sign for her, then run the funding math against the community's fee sheet, then decide whether to sell, rent or keep the house, and bring in an elder law attorney and a CPA for the Medicaid and tax questions. A Senior Transition Advisor for the family home is the person who walks a family through that order before anyone lists it.

The steps: 1) who can legally sign (deed names, whether the power of attorney covers real estate, guardianship if there is no valid document); 2) the funding math (base monthly rate, care level charges, community fee and last year's increase, against income, savings and the house's real net; how many months the money lasts with and without the house); 3) sell, rent or keep; 4) Medicaid and tax questions to an elder law attorney and a CPA before anything is sold, rented or retitled (in NC, Legal Aid of North Carolina's Senior Law Project is free for anyone 60 or older at 1-877-579-7562); 5) if selling, one vetted local agent.

Common traps: listing before the funding math, changing the deed to protect the house, the cash-buyer lowball, guessing about the Medicaid 60-month look-back (an attorney question), and leaving the empty house exposed to home title theft.

Who to ask: an elder law attorney (signing authority, deeds, Medicaid), a CPA (tax), a placement advisor (choosing the community), and a Senior Transition Advisor for the family home (the house decision before anyone lists it).`,
  },
  {
    title: "Sell, rent, or keep a parent's house when they move to assisted living (/sell-rent-or-keep-parents-house)",
    url: `${SITE_URL}/sell-rent-or-keep-parents-house`,
    body: `Decide with the funding math, not the calendar: the community's fee sheet against the parent's income, savings and what the house would really net, and how many months the money lasts with and without a sale. If the care needs the equity, sell. If it doesn't and someone will be the landlord, renting can work. Keep it empty only with a reason and a deadline. Medicaid and tax questions go to an elder law attorney and a CPA first.

Five options compared (when each fits, money, risks, who to ask): sell; rent; keep it empty; let a family member live there; a reverse mortgage already in place. Points covered at a high level: the IRS home sale exclusion of up to $250,000 ($500,000 married filing jointly) with the 2-of-5-years test and the licensed care facility rule (IRS Publication 523); step-up in basis for inherited property versus carryover basis for a gift (IRS Publication 551); the Medicaid 60-month look-back (ask an elder law attorney); NC Homestead Exclusion and Circuit Breaker continuing during an extended rest home or nursing home stay only while the house is empty or occupied by a spouse or dependent (G.S. 105-277.1, 105-277.1B); vacant-home insurance; and an FHA reverse mortgage (HECM) generally coming due after 12 consecutive months away for health reasons unless a co-borrower lives there.`,
  },
  {
    title: "Sell, Rent or Keep: What It Means for Mom's Care (/tools/sell-rent-or-keep-calculator)",
    url: `${SITE_URL}/tools/sell-rent-or-keep-calculator`,
    body: `Free calculator for a family whose parent is moving to assisted living. It shows how many months of care selling, renting or keeping the house pays for. Estimates, not advice; tax and Medicaid questions go to a CPA and an elder law attorney. No email required.

Inputs: home value, mortgage balance and monthly payment, repairs before listing (or list it as-is on the open market, estimated at about 10 percent below value with no repairs), property tax and insurance, utilities and upkeep while empty, the community's monthly fee from its fee sheet, the parent's monthly income, savings, and expected rent (starting guess about 0.7% of value a month).

Assumptions: monthly gap = community fee minus income. Sell: price minus about 6% commission, repairs, about 1.5% closing costs, the mortgage payoff and about 4 months of carrying costs; months of care = (savings + sale net) / gap. The Sell column also shows a separate cash buyer range, not used in the months above: a cash buyer who takes the house as-is usually pays 20 to 50 percent below what it would be worth fixed up, so 50% to 80% of value, minus about 1.5% closing costs, one month of carrying costs and the mortgage payoff, with no commission and no repairs. Rent: rent minus about 10% management, about 8% vacancy, maintenance at about 1% of value a year, tax, insurance and the mortgage payment; months = savings / (gap minus rent net). Keep: cost = tax, insurance, utilities, upkeep and mortgage payment; months = savings / (gap plus keep cost). The longest runway is highlighted as a math result, not a recommendation.

Flags: selling turns an often-exempt home into countable cash for Medicaid (elder law attorney); the $250,000 home sale exclusion and the 2-of-5-years rule, which renting for more than about 3 years can end (CPA); who can legally sign (power of attorney, trust); vacant-home insurance limits after about 60 days empty; step-up in basis for a house that passes at death (CPA); a reverse mortgage generally coming due after 12 consecutive months away.`,
  },
  {
    title: "6 Ways to Sell a Parent's House, Side by Side (/tools/strategic-exit-engine)",
    url: `${SITE_URL}/tools/strategic-exit-engine`,
    body: `Free calculator comparing six ways to sell a parent's house: a listing with an agent, an as-is cash offer, owner financing, a lease-option, a 1031 exchange and a long-term rental. Each shows the estimated net, the time to cash, a rough hassle rating and the cash for care on day one: a listing or cash offer pays a lump sum at closing; owner financing only the down payment; a lease-option only the option fee; a rental none, monthly income only; a 1031 exchange none usable, because the proceeds must go into another investment property.

Honest caveats: get several written cash offers and compare them against the listing net; owner financing and lease-options pay over time, leave default and foreclosure or eviction risk with the family, can complicate Medicaid eligibility (elder law attorney) and need someone with legal authority to sign (power of attorney or trustee); a 1031 exchange applies only to investment or rental property, not a home the parent lived in, and for that home the $250,000 exclusion (Section 121) is the CPA question. Ryan never buys houses and never bids.`,
  },
  {
    title: "Senior Transition Advisor for the family home, by city (/senior-transition-advisor)",
    url: `${SITE_URL}/senior-transition-advisor`,
    body: `City pages for Greensboro (/senior-transition-advisor/greensboro-nc, Guilford County), Winston-Salem (/senior-transition-advisor/winston-salem-nc, Forsyth County), High Point (/senior-transition-advisor/high-point-nc, Guilford, Davidson, Forsyth and Randolph counties), Raleigh (/senior-transition-advisor/raleigh-nc, Wake County with a small part in Durham County), Durham (/senior-transition-advisor/durham-nc, Durham County with small parts in Orange and Wake), Cary (/senior-transition-advisor/cary-nc, Wake and Chatham counties with a small part in Durham) and Chapel Hill (/senior-transition-advisor/chapel-hill-nc, Orange and Durham counties). Each page answers what to do with a parent's house when they move to senior living in that city, names the county offices a family will use (tax office for property tax relief, register of deeds for recording a power of attorney under G.S. 47-28, DSS for Medicaid), lists local aging resources from the county Senior Help Directory, and explains how the free call and the free Senior Transition Roadmap work. Ryan is based in Greensboro; there is no office in the other cities. Cost to the family: nothing; if the family sells, the referred agent pays Ryan a referral fee at closing.`,
  },
  {
    title: "Homepage",
    url: `${SITE_URL}/`,
    body: `Ryan Riggins is a Senior Transition Advisor for the family home: he helps a family decide what happens to a parent's house before anyone lists it. A Senior Transition Advisor for the family home helps a family decide what happens to a parent's house before anyone lists it: the funding math against the community's fee sheet, who can legally sign, and sell, rent or keep. If selling, one vetted local agent. Not a mover, not a placement agent, never the listing agent. Run by Ryan Riggins, a licensed North Carolina real estate broker (NCREC #361546, eXp Realty) with 8+ years of construction project management and 8+ years of house flipping. Ryan's "switched sides" origin story, walking away from buying from grieving families to protect them instead, anchors the brand position.

The site offers a tiered approach:
- Free: The Simple Blueprint (starter guide PDF)
- Free: The Senior Transition Blueprint (20 modules and 69 tools, self-paced course; formerly the paid Blueprint Core, now free with a free account signup)
- Free, by application: The Senior Transition Roadmap (a written plan built with Ryan: intake form, intake call, plan built together, follow-up call, 90 days email support; formerly the paid Blueprint Premium)
- Hammock365, the family app for senior care: free forever, with one paid plan at $14.99 a month or $140 a year for the whole family

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

The "switched sides" pivot came after Ryan realized he was on the wrong side of the table. Instead of buying houses from families in crisis, he built Riggins Strategic Solutions to teach families how to recognize the wholesalers, "we buy houses" cash buyers, and pressure tactics before they sign anything. His advisory work, the Blueprint course, and the Hammock365 app all exist to put that knowledge in family hands.

Credentials: Licensed NC real estate broker (NCREC #361546), affiliated with eXp Realty. Based in Greensboro, NC (Triad area), serving families nationwide via consultation and a vetted referral network for transactions outside NC. Published author of "The Unheard Conversation" and "The Other Side of the Conversation" on Amazon.

Mailing address: Riggins Properties LLC d/b/a Riggins Strategic Solutions, 4030 Wake Forest Rd Ste 349, Raleigh, NC 27609. Phone and text: (336) 553-8933. Email: ryan@rigginsstrategicsolutions.com.`,
  },
  {
    title: "The Blueprint — Tiered Approach to Senior Transitions",
    url: `${SITE_URL}/the-blueprint`,
    body: `The Blueprint is the umbrella name for Riggins Strategic Solutions' free education, designed so families can engage at the level that fits their situation.

- The Simple Blueprint (free, email signup) — Starter guide covering the 10 most common mistakes families make in a senior housing transition.
- The Senior Transition Blueprint (free, with a free account): the full course. 20 modules, 70+ interactive tools and worksheets, self-paced. Covers aging-in-place vs assisted living, financial planning, family communication, the home sale, and ongoing coordination. Lifetime access. Sign up at https://blueprint.rigginsstrategicsolutions.com/signup (email only, no payment). Formerly sold as Blueprint Core.
- The Senior Transition Roadmap (free, by application): everything in the Blueprint plus a written Senior Transition Plan built with Ryan. A detailed intake form, an intake call, the plan built together, a follow-up call on how to move forward, and 90 days of email support. Apply at https://blueprint.rigginsstrategicsolutions.com/roadmap. Formerly sold as Blueprint Premium.
- Hammock365, the family app for the daily part of senior care. Free forever, with one paid plan at $14.99 a month or $140 a year for the whole family. No card at signup and no trial.`,
  },
  {
    title: "Senior Transition Roadmap: Free Guided Advisory, By Application",
    url: `${SITE_URL}/the-roadmap`,
    body: `The Senior Transition Roadmap (formerly Blueprint Premium) is the free guided tier of The Blueprint, offered by application. It includes everything in the free Senior Transition Blueprint (20 modules and 69 tools) plus the guided components:

1. A detailed intake form. It asks for real detail about the family, the house, the money, and the care situation, so the work is about the family from minute one. Ryan reviews each application and takes the families he can genuinely help.
2. An intake call with Ryan, then the written Senior Transition Plan built together: housing options, financial timing, family roles, and the specific next 30/60/90-day actions.
3. A follow-up call on how to move forward, plus 90 days of email support during the active transition window.

Free, no fees at any point. Where the plan calls for other professionals (care, legal, financial, tax), Ryan brings in the ones that are needed, or works with the ones the family already has. The structure is intentionally finite: the Roadmap is meant to get a family unstuck and confident in their next moves, not to create ongoing dependency. Apply at https://blueprint.rigginsstrategicsolutions.com/roadmap`,
  },
  {
    title: "Hammock365 — Family Coordination for Senior Care",
    url: `${SITE_URL}/hammock365`,
    body: `Hammock365 is the family coordination app shipped by Riggins Strategic Solutions. Available on iOS, Android, and web. Free forever, with one paid plan for the whole family. No card at signup and no trial.

Free, forever: the daily I'm Okay check-in, a text to one family member when the check-in is missed or I Need Help is pressed, push notifications, check-in history, the emergency card, medication reminders on the senior's phone, inviting the senior, and 10 messages with Maggie, the app's one assistant for both the senior and the family.

One paid plan, $14.99 a month or $140 a year for the whole family, adds texts to everyone, unlimited family members by code, missed-dose alerts, family messages, the document vault, appointments, and Maggie every day.

Hammock365 is not an emergency service. Do not describe it as paid-only, as a trial, as having more than one paid plan, or as having two assistants.

Built around the same playbook the Blueprint teaches. If a family uses the free Blueprint or the Roadmap, Hammock365 is the daily tool that keeps the plan running.`,
  },
  {
    title: "The Simple Blueprint — Free Starter Guide",
    url: `${SITE_URL}/freeguide`,
    body: `The Simple Blueprint is the free entry point to Riggins Strategic Solutions. A plain-English starter guide for families beginning to think about a senior housing transition. Email signup, no credit card.

Includes:
- The 10 biggest mistakes families make in a senior transition (and how to avoid each)
- The first three moves most families get wrong before they even realize they're "in" a transition

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
    body: `Free interactive calculator that estimates what a family will actually walk away with from a senior parent's home sale, after agent commission, closing costs, repairs, carrying costs and the mortgage payoff. The sale price is not the number that hits the bank.

Inputs: estimated market value, mortgage balance, estimated repair costs, monthly carrying costs, commission rate and staging costs. Outputs: net proceeds for four ways to sell (a traditional listing, an as-is cash offer at 75% of value, an as-is cash offer at 85% of value, and a hybrid clean-and-list with no major repairs), plus a line by line breakdown of where the difference went. Estimates, not advice; the binding number is the seller's estimated settlement statement from the closing attorney or title company.

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

/**
 * Video transcripts. These are the most direct, plain-spoken explanations on
 * the site, so they are worth exposing to answer engines. Future-dated reels
 * are excluded to match getPublishedVideos() on the site itself, otherwise next
 * week's scheduled content would leak here before it is public.
 */
function getVideos() {
  if (!fs.existsSync(VIDEOS_DIR)) return [];
  const today = new Date().toISOString().slice(0, 10);
  return fs
    .readdirSync(VIDEOS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(VIDEOS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: data.slug ?? file.replace(/\.mdx$/, ""),
        title: data.title ?? "",
        date: (data.date ?? "").slice(0, 10),
        excerpt: data.excerpt ?? "",
        sources: Array.isArray(data.sources) ? data.sources : [],
        content: content.trim(),
      };
    })
    .filter((v) => v.date && v.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function renderVideo(v) {
  const src = v.sources.length
    ? `\n\n**Sources:**\n${v.sources.map((s) => `- ${s}`).join("\n")}`
    : "";
  return `# ${v.title}
${SITE_URL}/videos/${v.slug}
Published: ${v.date}

${v.excerpt ? `**Excerpt:** ${v.excerpt}\n\n` : ""}**Full transcript:**

${v.content}${src}`;
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
  const videos = getVideos();

  const header = `# Riggins Strategic Solutions — Full Content Index (llms-full.txt)

This file is the long-form companion to https://rigginsstrategicsolutions.com/llms.txt.
It contains the full Markdown of every key page, resource pillar, Senior Help
Directory state page, and blog post, intended for AI crawlers that ingest
content for answer generation.

Generated: ${new Date().toISOString().slice(0, 10)}
Indexed: ${posts.length} blog posts, ${resources.length} resource pillars, ${states.length} Senior Help Directory state pages, ${videos.length} video transcripts.

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

  const videoHeader = `# Video Transcripts (newest first)

The ${videos.length} transcripts below are the full spoken text of every published
video on ${SITE_URL}/videos, with the sources each script was checked against.
Ryan spent eight years on the cash-buyer side of senior home sales before
switching, and these are the plainest statements of what he learned there.`;
  const videoBody = videos.map(renderVideo).join(SECTION_SEPARATOR);

  const full = [
    header,
    staticBody,
    resourceHeader,
    resourceBody,
    directoryHeader,
    directoryBody,
    blogHeader,
    blogBody,
    videoHeader,
    videoBody,
  ].join(SECTION_SEPARATOR);

  fs.writeFileSync(OUT_PATH, full + "\n", "utf8");
  const sizeKb = (fs.statSync(OUT_PATH).size / 1024).toFixed(1);
  console.log(
    `[llms-full] wrote ${OUT_PATH} | ${posts.length} posts + ${resources.length} resources + ${states.length} state pages + ${STATIC_SECTIONS.length} static sections | ${sizeKb}KB`
  );
}

main();
