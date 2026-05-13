/**
 * Registry for the 9 interactive tools (calculators + quizzes).
 *
 * Each tool is an iframe-embedded HTML file under /public/tools/<slug>.html.
 * Metadata here drives /tools/[slug] pages + the /tools hub page + sitemap.
 */

export type ToolCategory = "financial" | "planning" | "assessment";

export type Tool = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  /** Fallback min-height for iframe before JS measurement kicks in. */
  minHeight: number;
};

export const TOOLS: Tool[] = [
  // Financial
  {
    slug: "net-proceeds-calculator",
    // Title + description tuned 2026-05-13 for "net proceeds calculator" /
    // "how much will I get from selling my house" GSC queries.
    title: "Free Net Proceeds Calculator | What You'll Actually Walk Away With",
    shortDescription:
      "What you actually walk away with after selling",
    description:
      "Free net proceeds calculator for families selling a parent's home. Calculate exactly what you'll walk away with after fees, repairs, payoffs, and taxes. Most families overestimate by $30K to $50K. Get the real math in 5 minutes. No email required.",
    category: "financial",
    minHeight: 1800,
  },
  {
    slug: "smart-prep-budget-calculator",
    title: "Smart Prep Budget Calculator",
    shortDescription:
      "Plan the repairs worth doing before you sell",
    description:
      "Build a prep budget that adds resale value without overspending. Separates the fixes buyers reward from the money pits families regret.",
    category: "financial",
    minHeight: 2000,
  },
  {
    slug: "medicare-gap-analyzer",
    // Title + description tuned 2026-05-13 for "medicare gap analyzer" /
    // "what medicare doesn't cover" / "medicare coverage gap" GSC queries.
    title: "Free Medicare Gap Analyzer | What Medicare Doesn't Cover",
    shortDescription:
      "Find the holes in your parent's Medicare coverage",
    description:
      "Free Medicare gap analyzer for adult children managing aging parents' coverage. See exactly what Medicare doesn't cover in 3 minutes: long-term care, dental, vision, hearing, and the gaps that catch families flat-footed. No email required.",
    category: "financial",
    minHeight: 1800,
  },
  {
    slug: "strategic-exit-engine",
    title: "Strategic Exit Engine",
    shortDescription:
      "Compare the 5 ways to sell a house without a traditional listing",
    description:
      "Side-by-side comparison of cash offers, iBuyers, seller financing, family buyouts, and auctions so the family can see which path fits their situation.",
    category: "financial",
    minHeight: 2400,
  },

  // Planning
  {
    slug: "aging-in-place-break-even",
    // Title + description tuned 2026-05-13 for "aging in place vs assisted
    // living cost" / "is aging in place cheaper than assisted living" /
    // "cost of staying home vs nursing home" GSC queries.
    title: "Aging in Place vs Assisted Living Cost Calculator | Honest Break-Even",
    shortDescription:
      "Cost of staying put vs. cost of moving",
    description:
      "Free calculator comparing the true cost of aging in place versus assisted living. Most families think staying home is cheaper. The math says otherwise once you factor in home modifications, in-home care, and 24/7 supervision. Get the honest break-even in 4 minutes.",
    category: "planning",
    minHeight: 2000,
  },
  {
    slug: "beneficiary-designation-audit",
    title: "Beneficiary Designation Audit",
    shortDescription:
      "Catch the paperwork that bypasses the will",
    description:
      "Retirement accounts, life insurance, and payable-on-death forms override the will every time. This audit shows the family what's missing before probate does.",
    category: "planning",
    minHeight: 1800,
  },

  // Assessment
  {
    slug: "readiness-assessment",
    title: "Readiness Assessment",
    shortDescription:
      "Where your family actually stands today",
    description:
      "Ten questions across housing, finances, legal, medical, and family alignment. Honest score, no email gate, plain-English action steps.",
    category: "assessment",
    minHeight: 1800,
  },
  {
    slug: "caregiver-burnout-triage",
    // Title + description tuned 2026-05-13 to capture the
    // "caregiver burnout quiz" GSC query (66 imp / 28d, position ~10-15
    // pre-optimization). Keep "Free Caregiver Burnout Quiz" as exact-match
    // anchor; "2-Minute Triage" as differentiator.
    title: "Free Caregiver Burnout Quiz | 2-Minute Triage",
    shortDescription:
      "Honest check-in for the adult child carrying the load",
    description:
      "Free 2-minute caregiver burnout quiz for adult children caring for aging parents. Ten questions across emotional, physical, financial, and time strain. Get your burnout score instantly. No email required.",
    category: "assessment",
    minHeight: 1800,
  },
  {
    slug: "lead-qualification-quiz",
    title: "Lead Qualification Quiz",
    shortDescription:
      "Find out which RSS path fits your situation",
    description:
      "Five questions. Routes you to the Blueprint, SeniorSafe, or a consult based on urgency and complexity. No email gate, no pitch.",
    category: "assessment",
    minHeight: 1600,
  },
];

export function getAllToolSlugs(): string[] {
  return TOOLS.map((t) => t.slug);
}

export function getToolBySlug(slug: string): Tool | null {
  return TOOLS.find((t) => t.slug === slug) ?? null;
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  financial: "Financial Tools",
  planning: "Planning Tools",
  assessment: "Assessment Tools",
};
