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
    title: "Net Proceeds Calculator",
    shortDescription:
      "What you actually walk away with after selling",
    description:
      "Strip out agent commissions, closing costs, repair credits, and payoffs to see what ends up in the family's bank account after the house sells.",
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
    title: "Medicare Gap Analyzer",
    shortDescription:
      "Find the holes in your parent's Medicare coverage",
    description:
      "Walk through the six biggest gaps in Medicare (dental, vision, long-term care, prescription exposure, out-of-network, overseas) and see the real dollar risk.",
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
    title: "Aging-in-Place Break-Even",
    shortDescription:
      "Cost of staying put vs. cost of moving",
    description:
      "Plug in home modifications, in-home care hours, and monthly burn rate. See the year the cost of aging in place passes the cost of a senior community.",
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
    title: "Caregiver Burnout Triage",
    shortDescription:
      "Honest check-in for the adult child carrying the load",
    description:
      "Ten questions scored across emotional, physical, financial, and time strain. Built for the adult child who keeps saying \"I'm fine\" and isn't.",
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
