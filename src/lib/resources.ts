/**
 * Article registry for the /resources route.
 *
 * v1 ships these as stubs (QuickAnswer placeholder + H1 + 4-5 H2
 * scaffolding + alternating CTA). Each entry is replaced inline as
 * the full article content lands; structure stays.
 *
 * H2s are placeholders chosen for plausibility — they steer the
 * eventual full-article writer without prescribing the final
 * outline.
 */

export type Resource = {
  slug: string;
  /** H1 verbatim per spec. */
  title: string;
  /** Short OG/meta description. */
  description: string;
  /** Topic label for QuickAnswer kicker. */
  topic: string;
  /** Placeholder H2 subheadings (will be replaced when content lands). */
  h2s: string[];
};

export const RESOURCES: Resource[] = [
  {
    slug: "how-to-sell-elderly-parents-house",
    title:
      "How to Help Your Elderly Parent Sell Their House (Without Burning Out or Getting Burned)",
    description:
      "A plain-English playbook for helping an aging parent sell their long-time home without burning the family out or losing equity to a bad cash buyer.",
    topic: "Selling a parent's home",
    h2s: [
      "Start by listening, not selling",
      "Document the maintenance reality first",
      "Choose a Senior Real Estate Specialist, not a quick-cash agent",
      "Plan the move-out timing around closing day",
      "Avoid the five most expensive mistakes",
    ],
  },
  {
    slug: "power-of-attorney-selling-parents-home",
    title:
      "Do You Need Power of Attorney to Sell Your Parent's Home? (2026 Guide)",
    description:
      "When you need a power of attorney to sell your parent's house, when you don't, and what happens if you wait too long. The 2026 family playbook.",
    topic: "Power of attorney for a home sale",
    h2s: [
      "When you need POA versus when you don't",
      "Mental capacity is the threshold question",
      "General versus durable versus springing POA",
      "What happens if you skip POA and it's too late",
      "Working with an elder law attorney",
    ],
  },
  {
    slug: "how-to-talk-to-mom-about-selling-house",
    title:
      "How to Talk to Mom About Selling the House: 5 Conversations That Actually Work",
    description:
      "Why the first family conversation about selling the house usually fails, and the five staged conversations that actually move a parent toward a decision.",
    topic: "The selling-the-house conversation",
    h2s: [
      "Why the first conversation usually fails",
      "Five conversations that build readiness over months",
      "The questions that move the needle",
      "When to involve siblings, when not to",
      "Bringing in a neutral third party",
    ],
  },
  {
    slug: "wholesaler-scams-targeting-seniors",
    title:
      "How Wholesalers and 'We Buy Houses' Companies Target Elderly Homeowners",
    description:
      "How real estate wholesalers find and pressure elderly homeowners, the red flags families miss, and what to do if your parent already signed something.",
    topic: "Wholesaler tactics on senior homeowners",
    h2s: [
      "How wholesalers find elderly homeowners",
      "The 'we buy houses' mailer playbook",
      "Red flags in cash-only contracts",
      "Why a 48-hour deadline is always pressure",
      "What to do if your parent already signed something",
    ],
  },
  {
    slug: "assisted-living-vs-memory-care-difference",
    title:
      "Assisted Living vs. Memory Care: The Real Differences (and Why It Matters for Cost)",
    description:
      "Independent living, assisted living, and memory care explained in plain English. What each tier covers, what it costs, and the level most families overshoot.",
    topic: "Care levels: assisted living vs memory care",
    h2s: [
      "Independent living for active seniors",
      "Assisted living adds daily-activity support",
      "Memory care for dementia and Alzheimer's",
      "How to assess the right level of care",
      "Why families overshoot the level needed",
    ],
  },
  {
    slug: "cost-of-assisted-living-in-2026",
    title:
      "What Assisted Living Actually Costs in 2026 (State-by-State Breakdown)",
    description:
      "2026 assisted living cost averages by state, what's included versus what's add-on, and how families realistically fund a long-term care stay.",
    topic: "Assisted living cost in 2026",
    h2s: [
      "National averages and 2026 trends",
      "State-by-state cost variation",
      "What's included versus what's add-on",
      "Funding sources beyond income",
      "Why the home sale is often the funding plan",
    ],
  },
  {
    slug: "medicare-vs-medicaid-senior-care",
    title:
      "Medicare vs. Medicaid for Senior Care: What Each Actually Pays For",
    description:
      "Medicare versus Medicaid for senior long-term care, the five-year lookback rule, VA benefits most families miss, and how to coordinate without losing them.",
    topic: "Medicare vs Medicaid for senior care",
    h2s: [
      "What Medicare actually covers",
      "The Medicaid spend-down rules",
      "How the five-year lookback works",
      "VA benefits most families miss",
      "Coordinating benefits without losing them",
    ],
  },
  {
    slug: "sandwich-generation-caregiver-burnout",
    title:
      "The Sandwich Generation Caregiver Burnout Crisis (and 7 Ways to Survive It)",
    description:
      "Why sandwich-generation caregivers burn out, the $324K hidden cost most miss, and seven survival strategies that actually work for working adult children.",
    topic: "Sandwich generation caregiver burnout",
    h2s: [
      "The $324K cost of caregiving most families miss",
      "The seven warning signs of burnout",
      "Building a support system that actually helps",
      "The boundaries conversation with siblings",
      "Respite planning that works",
    ],
  },
  {
    slug: "how-to-help-aging-parents-without-burning-out",
    title:
      "How to Help Your Aging Parents Without Burning Out (or Losing Your Marriage)",
    description:
      "How to help aging parents without sacrificing your career, your marriage, or your health. Roles, boundaries, and the technology that shares the load.",
    topic: "Helping parents without burning out",
    h2s: [
      "Defining your role versus theirs",
      "The boundaries that protect your marriage",
      "Asking for help without feeling guilty",
      "Using technology to share the load",
      "When professional help is the right call",
    ],
  },
  {
    slug: "signs-its-time-for-senior-living",
    title:
      "10 Signs It's Time to Move Your Parent Into Senior Living (From a Former House Flipper)",
    description:
      "The ten signals that tell you it's time to move a parent into senior living, written by a former house flipper who's seen the warning signs ignored.",
    topic: "Signs it's time for senior living",
    h2s: [
      "Memory and judgment changes",
      "Falls and mobility decline",
      "Medication mistakes",
      "Social isolation patterns",
      "Home maintenance neglect",
    ],
  },
  {
    slug: "how-to-have-the-conversation-with-stubborn-parent",
    title:
      "How to Have THE Conversation With Your Stubborn Parent (5 Personas, 5 Approaches)",
    description:
      "The five resistant-parent personas and the conversation play that works for each one. How to move past 'I'm not going anywhere' without breaking the relationship.",
    topic: "Talking to a resistant parent",
    h2s: [
      "The five resistant-parent personas",
      "The Authority Shift conversation play",
      "The Defender persona, and what works",
      "The Bargainer persona, and what works",
      "When pushing harder backfires",
    ],
  },
  {
    slug: "financial-planning-for-aging-parents",
    title: "Financial Planning for Aging Parents: The 12-Month Checklist",
    description:
      "A 12-month financial planning checklist for aging parents, broken into four quarters: legal documents, asset inventory, long-term care, and estate plan.",
    topic: "Financial planning for aging parents",
    h2s: [
      "The 12-month checklist overview",
      "Months 1-3: legal documents in place",
      "Months 4-6: assets inventoried",
      "Months 7-9: long-term care planning",
      "Months 10-12: estate plan finalized",
    ],
  },
  {
    slug: "seniors-real-estate-specialist-vs-investor",
    title:
      "Seniors Real Estate Specialist vs. Cash Investor: Why The Difference Costs $50K",
    description:
      "What a Senior Real Estate Specialist actually does, what a cash investor wants, and why families lose $50K when they confuse the two.",
    topic: "SRES vs cash investor",
    h2s: [
      "What a Senior Real Estate Specialist does",
      "What a cash investor wants",
      "Why the difference is $50K",
      "Red flags an investor is pretending to be an agent",
      "How to verify SRES credentials",
    ],
  },
  {
    slug: "cash-buyer-scams-elderly-homeowners",
    title:
      "Cash Buyer Scams Targeting Elderly Homeowners: How to Spot Them in 2026",
    description:
      "The 2026 cash-buyer scam landscape, the five most common plays, the contract clauses that hide intent, and how families slow down a 48-hour deadline.",
    topic: "Cash buyer scams in 2026",
    h2s: [
      "The 2026 scam landscape",
      "The five most common cash-buyer plays",
      "Pressure tactics to recognize",
      "The contract clauses that hide intent",
      "How to slow down a 48-hour deadline",
    ],
  },
  {
    slug: "decluttering-parents-home-before-sale",
    title:
      "How to Declutter Your Parent's Home Before Selling (Without Triggering a Family Fight)",
    description:
      "How to declutter forty years of stuff before selling a parent's home, the keep/give/sell/donate/toss framework, and how to handle sentimental items without family fights.",
    topic: "Decluttering before a senior home sale",
    h2s: [
      "The emotional weight of forty years of stuff",
      "The keep / give / sell / donate / toss framework",
      "When to bring in an estate sale company",
      "How to handle sentimental items without family fights",
      "Timing the declutter relative to the listing",
    ],
  },
  {
    slug: "senior-scam-protection",
    title: "Protecting Seniors From Scams: The Rules That Always Work",
    description:
      "A plain-English scam protection guide for families with aging parents. The rules that always work, the scams aimed at seniors and their homes, where to report fraud, and how to build a family defense system.",
    topic: "Consumer Protection",
    h2s: [
      "Why smart families still get taken",
      "The rules that always work",
      "The scams aimed at seniors",
      "Where to report fraud and freeze the damage",
      "How SeniorSafe helps",
    ],
  },
];

export function getAllResourceSlugs(): string[] {
  return RESOURCES.map((r) => r.slug);
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}
