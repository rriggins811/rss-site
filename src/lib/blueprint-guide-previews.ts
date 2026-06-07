/**
 * Readable teaser content for the /blueprint-preview drawer, excerpted from the
 * free "Simple Blueprint" starter guide (public/files/simple-blueprint.pdf).
 *
 * Why this is safe to show: these frameworks are ALREADY free (the starter
 * guide is the lead magnet). The paid $47 Blueprint's value is the in-depth
 * content and the 71 downloadable tools, which stay locked. So this gives the
 * preview real substance to read and scroll past before reaching the locked
 * tools, without giving away anything that is paid-exclusive.
 *
 * Keyed by Module.id. The starter guide covers Modules 0 to 13; the advanced
 * modules (14 to 19) have no starter-guide section, so they fall back to the
 * video plus the "What you'll do" outcomes.
 */

export type GuidePreview = {
  /** One-line setup shown above the framework. */
  intro: string;
  /** The named framework or checklist. */
  heading: string;
  /** Short, scannable teaser points. */
  points: string[];
  /** Optional closing line (muted). */
  footnote?: string;
};

export const GUIDE_PREVIEWS: Record<string, GuidePreview> = {
  "module-0": {
    intro: "Feeling overwhelmed? Start by answering the questions that shape every decision ahead.",
    heading: "The 6 Foundational Questions",
    points: [
      "WHY is this transition happening?",
      "WHO is making the decisions?",
      "WHEN does it need to happen?",
      "WHERE is the senior going?",
      "WHAT support do you have?",
      "HOW much can you spend?",
    ],
    footnote: "Answer these first, then follow the 7-Day Quick Start to build momentum.",
  },
  "module-1": {
    intro: "Every transition falls into one of three stages. Find yours and adjust your approach.",
    heading: "The Three Stages",
    points: [
      "Early Planning (1 to 5+ years out): declutter gradually, build savings, start the conversations.",
      "Preparing to Move (3 to 12 months): tour communities, prep the home, divide the work.",
      "Urgent Transition (0 to 3 months): safety first, sell as-is, hire help, keep only essentials.",
    ],
    footnote: "Then use the Fear Inventory to name and shrink what is holding the family back.",
  },
  "module-2": {
    intro: "Beat the overwhelm with one simple system for every item in the home.",
    heading: "The 5-Pile Sorting System",
    points: [
      "Keep: used in the last 6 months or brings genuine joy.",
      "Donate: functional and clean, just not needed.",
      "Sell: worth $50 or more and worth your time.",
      "Trash: broken or unusable.",
      "Decide Later: sentimental or uncertain (cap it at 10%).",
    ],
    footnote: "The 3-Second Rule: if you cannot decide in 3 seconds, it goes to Decide Later.",
  },
  "module-3": {
    intro: "Work the home systematically, one room at a time, and tame the paperwork.",
    heading: "The 3-Folder Paperwork Method",
    points: [
      "Active: needed within a year (current taxes, insurance, bills).",
      "Archive: legally required to keep (deeds, wills, POA, 7 years of taxes).",
      "Shred: everything else that carries personal information.",
    ],
    footnote: "Plus the 3-Path System for sentimental items: photograph, display, or archive.",
  },
  "module-4": {
    intro: "Most furniture will not fit the new space. Decide early with a simple test.",
    heading: "The Furniture Test (5 questions)",
    points: [
      "Will it fit the new space?",
      "Is it in good condition?",
      "Will the senior actually use it?",
      "Is it safe, with no trip hazards?",
      "Does the senior truly love it?",
    ],
    footnote: "4 to 5 yes: keep it. 0 to 1 yes: leave it. Plus the Two-Week Wardrobe Test.",
  },
  "module-5": {
    intro: "Most families waste $50K to $100K on repairs that never pay back.",
    heading: "Ryan's What NOT to Fix list",
    points: [
      "Skip the full kitchen remodel ($40K). Paint the cabinets instead ($1,500).",
      "Skip luxury flooring ($20K). Professionally clean instead ($300).",
      "Skip the HGTV staging ($10K). Declutter and neutral-paint instead ($2K).",
    ],
    footnote: "Do fix: safety issues, fresh paint, deep cleaning, curb appeal. Budget $2K to $5K.",
  },
  "module-6": {
    intro: "Get the paperwork in order before a crisis forces it.",
    heading: "The Four Must-Have Documents",
    points: [
      "Will: who gets your assets, and who is the executor.",
      "Financial Power of Attorney: handle finances if you cannot.",
      "Healthcare Power of Attorney: make medical decisions if you cannot.",
      "Living Will: your wishes for end-of-life care.",
    ],
    footnote: "The forgotten detail: beneficiary designations override your will. Keep them current.",
  },
  "module-7": {
    intro: "Know the levels of care and what each one really costs per month.",
    heading: "Types of Senior Living",
    points: [
      "Independent Living: minimal help, about $2,000 to $5,000 a month.",
      "Assisted Living: help with daily activities, about $3,500 to $7,000 a month.",
      "Memory Care: secure dementia care, about $5,000 to $10,000 a month.",
      "Nursing Home: highest medical care, about $7,000 to $12,000 a month.",
    ],
    footnote: "Watch for tour red flags: high-pressure sales, vague costs, unhappy residents.",
  },
  "module-8": {
    intro: "If Medicaid may pay for care someday, you have to plan ahead now.",
    heading: "The 5-Year Look-Back",
    points: [
      "Medicaid reviews asset transfers from the last 5 years.",
      "Gifting money or selling property below value can disqualify you.",
      "A misstep can cost hundreds of thousands in ineligibility.",
    ],
    footnote: "Talk to an elder law attorney before moving assets. And do not forget your digital estate.",
  },
  "module-9": {
    intro: "Most families think there is one way to sell a home. There are seven.",
    heading: "The 7 Exit Strategies",
    points: [
      "Traditional MLS listing: highest price, but needs prep and showings.",
      "As-Is sale: faster, at a lower price.",
      "Cash investor: 7 to 14 days, but often only 60 to 70% of value.",
      "Owner financing, lease-option, 1031 exchange, or keep it as a rental.",
    ],
    footnote: "Then work the 3 levers of every negotiation: price, terms, and timing.",
  },
  "module-10": {
    intro: "Sequence the move so nothing slips through the cracks.",
    heading: "The T-Minus Timeline",
    points: [
      "T-30 days: book movers, order supplies, submit the address change.",
      "T-14 days: confirm vendors, pack 70 to 80%, prep the essentials box.",
      "T-7 days: finalize packing, reconfirm movers, walk the new home.",
      "Move day: supervise, check inventory, direct placement.",
    ],
    footnote: "Keep the Move Day Bag with you: documents, medications, valuables, chargers.",
  },
  "module-11": {
    intro: "Run a clean closing day with no surprises.",
    heading: "The Final Walkthrough",
    points: [
      "All belongings, trash, and debris removed.",
      "Lights, windows, and doors working and locked.",
      "Keys, remotes, and garage openers ready to hand over.",
    ],
    footnote: "The utility rule: do not shut anything off until AFTER closing.",
  },
  "module-12": {
    intro: "The first 90 days decide whether the move truly sticks.",
    heading: "The First 30 Days, Week by Week",
    points: [
      "Week 1, essentials: bed, bathroom, kitchen basics, emergency exits.",
      "Week 2, functionality: unpack and set up the living spaces.",
      "Week 3, routine: explore the community, meet neighbors, find local services.",
      "Week 4, connection: attend activities, join a group, invite family to visit.",
    ],
    footnote: "Isolation is the enemy. Connection is the goal.",
  },
  "module-13": {
    intro: "Run the family like a team, not a debate.",
    heading: "The Family Meeting Framework",
    points: [
      "Before: set an agenda, share it early, assign a note-taker, set a time limit.",
      "During: start positive, take one concern at a time, make decisions.",
      "After: send a summary, schedule the next meeting, follow up on commitments.",
    ],
    footnote: "And remember: you cannot pour from an empty cup. Caregiver self-care is necessary.",
  },
};

export function getGuidePreview(id: string): GuidePreview | undefined {
  return GUIDE_PREVIEWS[id];
}
