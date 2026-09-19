/**
 * Registry for the 10 interactive tools (calculators + quizzes).
 *
 * Each tool is an iframe-embedded HTML file under /public/tools/<slug>.html.
 * Metadata here drives /tools/[slug] pages + the /tools hub page + sitemap.
 */

export type ToolCategory = "financial" | "planning" | "assessment";

export type ToolFaq = {
  question: string;
  answer: string;
};

export type Tool = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  /** Fallback min-height for iframe before JS measurement kicks in. */
  minHeight: number;
  /**
   * Optional FAQ Q&A list. When present, the /tools/[slug] wrapper page
   * renders a visible FAQ section below the iframe AND emits FAQPage
   * JSON-LD on the canonical URL. Schema-content match is required by
   * Google: the visible content and the JSON-LD must mirror each other.
   *
   * Originally the FAQ schema lived in public/tools/<slug>.html files,
   * but those are iframed children: Google does not parse JSON-LD from
   * an iframe and attribute it to the parent canonical URL. Moving FAQ
   * schema to the wrapper page on 2026-05-22 is what makes it actually
   * crawlable for AEO + Rich Results.
   */
  faqs?: ToolFaq[];
  /**
   * Hidden tools keep a working /tools/<slug> URL but are noindex,nofollow
   * and left out of the sitemap, the /tools hub, related-reading links and
   * llms files. Added 2026-09-19 for the Strategic Exit Engine while Ryan
   * rebuilt it; un-hidden the same day after the rework. No tool uses it now.
   */
  hidden?: boolean;
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
    faqs: [
      {
        question: "How do you calculate net proceeds from a home sale?",
        answer:
          "Net proceeds equal the sale price minus: agent commission (typically 5-6%), seller-paid closing costs (1-3%), repair credits to the buyer, mortgage and lien payoffs, prorated property taxes, transfer taxes, capital gains tax (if applicable), and any seller concessions. On a $400,000 sale, a family typically nets $320,000 to $360,000, not $400,000.",
      },
      {
        question: "Do I owe capital gains tax when I sell my parent's house?",
        answer:
          "It depends on whether they sold it during their lifetime or you inherited it. If your parent sold while alive and lived in the home 2 of the last 5 years, they get a $250,000 exclusion ($500,000 if married). If you inherited the home, you get a stepped-up cost basis (the value at the date of death), which usually eliminates most or all capital gains. Talk to a CPA before listing.",
      },
      {
        question:
          "Should I sell my parent's house before or after they move to assisted living?",
        answer:
          "Usually after, for two reasons. First, the home sale exclusion applies if the seller lived there 2 of the last 5 years, so selling too long after they move to assisted living can disqualify it. Second, selling after the move means you can stage the home empty and price it for the actual condition, not 'lived in.' Run both scenarios through this calculator with your specific timing.",
      },
      {
        question: "How accurate is this net proceeds calculator?",
        answer:
          "It's accurate to within 2-3% for a standard residential sale. The biggest variables are repair credits (negotiated buyer-seller), the agent commission split, and any title or HOA issues that surface late. This calculator catches all the standard line items so families aren't shocked at closing.",
      },
      {
        question: "Who built this net proceeds calculator?",
        answer:
          "Ryan Riggins built this tool based on 8+ years of buying and selling homes (he was a house flipper before he was a senior transition advisor) plus several years of helping families through the senior home sale process. Ryan is a licensed NC broker who walked away from the cash-buyer side after seeing how often families left $50K on the table.",
      },
    ],
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
    faqs: [
      {
        question: "What is a Medicare gap?",
        answer:
          "A Medicare gap refers to the costs and care that traditional Medicare doesn't cover. The biggest gaps are long-term custodial care (bathing, dressing, eating), most dental and vision and hearing, assisted living, memory care, and 24/7 in-home care. Families often discover these gaps only after a parent needs care, when out-of-pocket costs hit $5,000 to $15,000 per month.",
      },
      {
        question: "Does Medicare cover assisted living?",
        answer:
          "No. Medicare does not pay for assisted living, ever. It covers limited skilled nursing care after a qualifying hospital stay (capped at 100 days), but custodial care in an assisted living facility is not covered. Medicaid can cover assisted living but only after a 5-year asset look-back and only at facilities that accept Medicaid.",
      },
      {
        question: "What is the Medicare Part D out-of-pocket cap for 2026?",
        answer:
          "Starting in 2026, Medicare Part D caps prescription drug out-of-pocket spending at $2,100 per year. AARP estimates about 9 million enrollees will save around $1.5 billion in 2026 because of this change. Hit the cap and the rest of the year is covered.",
      },
      {
        question:
          "How do I know if my parent has Medicare Advantage or Original Medicare?",
        answer:
          "Original Medicare uses red, white, and blue cards from the federal government. Medicare Advantage uses cards from private insurers (UnitedHealthcare, Humana, Aetna, etc.). The difference matters because Medicare Advantage plans often have prior authorization requirements and network restrictions that Original Medicare doesn't.",
      },
      {
        question: "Who built this Medicare gap analyzer?",
        answer:
          "Ryan Riggins built this tool based on data from KFF, AARP, and CMS, plus 8+ years of helping families get through senior housing transitions and Medicare coverage shortfalls. Ryan is a senior transition advisor and former house flipper who switched sides to help families decide what happens to a parent's house before anyone lists it.",
      },
    ],
  },
  {
    slug: "strategic-exit-engine",
    // Reworked and un-hidden 2026-09-19 (Ryan: keep it, it's valuable).
    // Same slug. Retitled from "Strategic Exit Engine"; every card now shows
    // cash for care on day one, first-person tips replaced with general
    // facts, honest owner-financing, lease-option and 1031 caveats.
    title: "6 Ways to Sell a Parent's House, Side by Side",
    shortDescription:
      "Compare six ways to sell, and the cash each frees up for care",
    description:
      "Compare six ways to sell a parent's house side by side: a listing, an as-is cash offer, owner financing, a lease-option, a 1031 exchange, or renting it out. See the estimated net, the time to cash, and how much cash each one frees up for care on day one. Estimates, not advice. Ryan never buys and never bids.",
    category: "financial",
    minHeight: 2400,
    faqs: [
      {
        question: "What are the ways to sell a parent's house?",
        answer:
          "The common ones are a regular listing with an agent, an as-is cash offer, owner financing, a lease-option, and a 1031 exchange for investment property. Renting it out instead of selling is the sixth path families weigh. For a parent moving to care, the question that matters most is how much cash each one frees up on day one. A listing and a cash offer pay a lump sum at closing. The others pay over time or not at all.",
      },
      {
        question: "Is owner financing a good idea when Mom needs money for care?",
        answer:
          "Usually it is a poor fit. The family gets a down payment, then monthly payments, not a lump sum. If the buyer stops paying, the family has to foreclose to get the house back. A note receivable can also complicate Medicaid eligibility, so ask an elder law attorney first, and confirm who can legally sign the note (the parent, an agent under a power of attorney, or a trustee).",
      },
      {
        question: "Can we do a 1031 exchange on a parent's house?",
        answer:
          "Only if the house is investment or rental property. A home the parent lived in as a residence does not qualify for a 1031 exchange. The proceeds also have to go into another investment property through a qualified intermediary, so none of it can be spent on care. For a home she lived in, ask a CPA about the $250,000 home sale exclusion (Section 121) instead.",
      },
      {
        question: "Should we take a cash offer on Mom's house?",
        answer:
          "A cash offer trades price for speed and no repairs. Get several written offers and compare each one against what a listing would net after commission, repairs, closing costs and a few months of carrying costs. The gap is what the speed costs you. Ryan never buys houses and never bids, so there is no offer from him in the mix.",
      },
    ],
  },

  // Planning
  {
    // Built 2026-09-19. The decision before the sale: what each choice does
    // to the months of care Mom's money covers.
    slug: "sell-rent-or-keep-calculator",
    title: "Sell, Rent or Keep: What It Means for Mom's Care",
    shortDescription:
      "How many months of care each choice pays for",
    description:
      "Free calculator for a family whose parent is moving to assisted living. Enter the home value, the mortgage, the community's monthly fee and Mom's income and savings, and see how many months of care selling, renting or keeping the house pays for. Estimates, not advice. No email required.",
    category: "planning",
    minHeight: 2200,
    faqs: [
      {
        question: "Should we sell Mom's house to pay for assisted living?",
        answer:
          "It depends on the math, not a rule. Take the community's monthly fee, subtract Mom's monthly income, and that is the gap her savings and the house have to cover. If selling is the only way the money lasts, selling usually wins. If her income and savings already cover years of care, you have more room to rent or keep it. Before selling, ask an elder law attorney how the sale affects Medicaid, because the home is often an exempt asset and the cash from a sale is not.",
      },
      {
        question: "Is it better to rent Mom's house or sell it?",
        answer:
          "Renting keeps the house and brings in a monthly check, but that check is smaller than most families expect after management, vacancy, repairs, taxes and insurance, and someone has to manage it. Selling turns the equity into cash that can pay for care now. Run both in the calculator. If rent covers the care gap and someone is willing to be the landlord, renting can work. If not, the sale usually pays for more months of care.",
      },
      {
        question: "What happens to the capital gains exclusion if we rent the house?",
        answer:
          "The home sale exclusion (up to $250,000 of gain for a single person, $500,000 for a married couple) needs the owner to have lived in the home at least 2 of the 5 years before the sale. Renting it out after Mom moves starts that clock. Rent it for more than about 3 years and the exclusion can be lost. IRS rules also let time in a licensed care facility count in some cases. Ask a CPA before you sign a lease.",
      },
      {
        question: "What does it cost to keep an empty house?",
        answer:
          "Property tax, insurance, utilities, lawn care and upkeep keep coming, plus any mortgage payment, with nothing coming in. Many standard homeowners policies limit or deny claims after the house has been vacant for about 60 days, so tell the insurer and ask about a vacant-home policy. The calculator shows how much faster Mom's savings run out while the house sits.",
      },
    ],
  },
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
    faqs: [
      {
        question: "Is aging in place cheaper than assisted living?",
        answer:
          "Sometimes, but not always. Aging in place is typically cheaper when a parent needs less than 4 hours per day of care and doesn't require major home modifications. It becomes more expensive than assisted living when 24/7 care is needed, when home modifications run $15,000 to $50,000, or when family members reduce work hours to provide care. This calculator runs both scenarios for your specific situation.",
      },
      {
        question: "What does aging in place actually cost per month?",
        answer:
          "A safe aging-in-place setup typically runs $2,500 to $6,500 per month including utilities, property taxes, basic in-home care (2-4 hours per day), grocery delivery, medical alert system, and home maintenance. Once 24/7 care is needed, monthly costs jump to $15,000 to $25,000, well above most assisted living facilities.",
      },
      {
        question: "What does assisted living cost in 2026?",
        answer:
          "Average assisted living costs $5,500 to $8,500 per month nationally as of 2026, with significant geographic variation. Memory care adds $1,500 to $3,000 per month on top. Costs are higher in urban coastal markets and lower in the Midwest and South. The price typically includes housing, meals, basic care, and social activities, but not skilled nursing.",
      },
      {
        question: "When does aging in place stop making sense financially?",
        answer:
          "Three triggers usually flip the math: (1) needing more than 8 hours per day of paid in-home care, (2) facing $25,000+ in home modifications for safety, or (3) family caregivers having to cut work hours by 30% or more. Once any one of these hits, assisted living often becomes the cheaper and safer option.",
      },
      {
        question: "Who built this aging in place break-even calculator?",
        answer:
          "Ryan Riggins built this tool based on 8+ years of helping families through senior housing transitions, plus published cost data from the AARP Caregiver Cost Survey, Genworth Cost of Care Survey, and Medicare's official assisted living cost data. Ryan is a senior transition advisor and former house flipper. He's seen the math both work and not work for hundreds of families.",
      },
    ],
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
    // Renamed from "readiness-assessment" on Aug 10 2026. "Readiness
    // Assessment" was too vague to mean anything in a nav; the score is what
    // the tool actually hands you. Old path 301s via vercel.json.
    slug: "family-readiness-score",
    title: "Family Readiness Score | Where Your Family Actually Stands",
    shortDescription:
      "Where your family actually stands today",
    description:
      "Free 5-minute readiness score for families facing a parent's senior transition. Fifteen questions across the home, finances, legal documents, care needs, and family alignment. Instant score out of 100 with a pillar-by-pillar breakdown and plain-English next steps. No email required, and you can have the results emailed if you want them.",
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
    faqs: [
      {
        question: "What is caregiver burnout?",
        answer:
          "Caregiver burnout is the physical, emotional, and mental exhaustion that comes from prolonged caregiving stress, particularly when caregivers feel they have lost control or aren't getting adequate support. It's especially common in the sandwich generation, adults caring for aging parents while raising their own kids.",
      },
      {
        question: "How do I know if I have caregiver burnout?",
        answer:
          "Common signs include constant fatigue that sleep doesn't fix, irritability with the person you're caring for, withdrawing from friends and activities you used to enjoy, neglecting your own health, and feeling resentful about caregiving. This 2-minute quiz scores you across four dimensions to give you a clearer picture than self-diagnosis.",
      },
      {
        question: "Is this caregiver burnout quiz really free?",
        answer:
          "Yes. No email required, no signup, no payment. The quiz takes 2 minutes and gives you an instant score with personalized next steps. It's part of a free toolkit Ryan Riggins built for families facing senior care decisions.",
      },
      {
        question: "Who created this caregiver burnout quiz?",
        answer:
          "Ryan Riggins built this quiz based on research from the Family Caregiver Alliance, the AARP Caregiver Burnout assessment tools, and 8+ years of working with families through senior housing transitions. Ryan is a senior transition advisor and former house flipper who walked away from buying homes from grieving families to help them get through the process instead.",
      },
      {
        question: "What do I do after I get my score?",
        answer:
          "Each score range comes with specific recommendations, from immediate self-care steps to professional resources like respite care, support groups, or financial planning tools. High-burnout scores get directed to the most actionable resources first.",
      },
    ],
  },
  {
    slug: "lead-qualification-quiz",
    title: "Lead Qualification Quiz",
    shortDescription:
      "Find out which RSS path fits your situation",
    description:
      "Five questions. Routes you to the Blueprint, Hammock365, or a consult based on urgency and complexity. No email gate, no pitch.",
    category: "assessment",
    minHeight: 1600,
  },
];

/** Tools that are listed publicly (hub, sitemap, related links). */
export const PUBLIC_TOOLS: Tool[] = TOOLS.filter((t) => !t.hidden);

/** Every tool with a live page, hidden ones included. */
export function getAllToolSlugs(): string[] {
  return TOOLS.map((t) => t.slug);
}

export function getToolBySlug(slug: string): Tool | null {
  return TOOLS.find((t) => t.slug === slug) ?? null;
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return PUBLIC_TOOLS.filter((t) => t.category === category);
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  financial: "Financial Tools",
  planning: "Planning Tools",
  assessment: "Assessment Tools",
};
