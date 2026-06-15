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
 * Keyed by Module.id. Modules 0 to 13 are excerpted from the free "Simple
 * Blueprint" starter guide. Modules 14 to 19 are summarized from the full
 * Blueprint module content (the deeper financial, legal, and care material the
 * free guide does not cover), written to teach the decision while the tools
 * stay locked.
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
  "module-14": {
    intro: "Over 75% of seniors say they want to stay home. Here is the honest math on whether that is actually the cheaper, safer choice.",
    heading: "The Real Cost of Aging in Place",
    points: [
      "The home that was perfect at 55 can be dangerous at 75: stairs, step-over tubs, overhead storage, a car-only grocery run.",
      "Modifications are never one-time. A bathroom safe for a walker is not safe for a wheelchair, and bathroom safety alone runs $5,000 to $25,000 or more.",
      "The hidden cost is in-home care. Help with bathing and dressing runs $30 to $40 an hour. At 44 hours a week, that is over $6,000 a month.",
      "Round-the-clock care can top $20,000 a month, often more than assisted living. Aging in place is not automatically cheaper.",
      "Six signs it is not viable: progressive disease, an unmodifiable home, isolation, money that cannot cover both modifications and care, burned-out caregivers, rising safety incidents. Three or more, rethink it.",
    ],
    footnote: "The full Blueprint's Aging Cost Calculator runs the real 5-year aging-in-place vs senior-living comparison for your numbers, plus a room-by-room modification assessment and a Plan B timeline.",
  },
  "module-15": {
    intro: "Assisted living runs $6,000 to $8,000 a month, Medicare pays none of it, and most families' savings last 2 to 3 years. Long-term care insurance answers the 'then what,' but only if you act before you need it.",
    heading: "Long-Term Care Insurance, Straight",
    points: [
      "Medicare does not cover long-term care. LTC insurance is what pays for nursing homes, assisted living, memory care, and in-home aides.",
      "The catch: wait until you need it and you cannot get it. The window is ages 50 to 65, while you are healthy enough to qualify and premiums are low.",
      "An identical policy can cost more than double if you wait from 55 to 65. After 70, premiums are often out of reach.",
      "Traditional means use it or lose it but the most coverage per dollar. Hybrid pairs with life insurance so heirs get it if you never need care.",
      "Cannot afford or qualify? You still need a plan: Medicaid planning 5 or more years out, self-funding, a family agreement, or home-sale equity. Ignoring it is not a strategy.",
    ],
    footnote: "Ryan sells no policies and earns nothing here. The full Blueprint's Decision Guide, Policy Comparison, and Affordability Calculator help you decide without getting upsold.",
  },
  "module-16": {
    intro: "Most families learn about the coverage gap during a crisis, when Medicare will not pay for nursing care at $8,000 to $12,000 a month. Here is the maze before you are trapped in it.",
    heading: "Medicare, Medicaid & VA, Decoded",
    points: [
      "Medicare does not cover long-term care. Part A covers only up to 100 days of skilled nursing after a 3-day hospital stay, then you are on your own.",
      "Medigap vs Advantage in one line: ongoing health issues or you travel, pay more for Medigap and see any doctor; healthy and budget-tight, Advantage is cheaper until you need care outside the network.",
      "Medicaid is the payer of last resort: roughly $2,000 in countable assets and a 5-year lookback on every transfer. Planning 5 years out can protect $100,000 or more.",
      "Estate recovery: after a Medicaid recipient passes, the state can put a lien on the home to recover what it paid.",
      "VA Aid and Attendance is the most underused benefit in America: $1,500 to $3,000 or more a month for a wartime veteran or surviving spouse who needs daily help, with more generous limits than Medicaid.",
    ],
    footnote: "Rules change and vary by state, so this is education, not advice. The Medicare Gap Analysis, VA Eligibility Checker, Medicaid Spend-Down Planner, and Benefits Coordination Worksheet turn the maze into a plan.",
  },
  "module-17": {
    intro: "Module 8 covered the basic documents. This is where planning ahead literally saves hundreds of thousands of dollars, or does not, depending on whether you start 5 years early.",
    heading: "Trusts, the MAPT & Asset Protection",
    points: [
      "Revocable trust means you control it and avoid probate, but it does not protect assets from Medicaid or creditors. Irrevocable trust is locked, but it shields them. Many families with real assets need both.",
      "The Medicaid Asset Protection Trust is the most powerful tool most families have never heard of: it can protect an entire life savings from nursing-home costs, but only if funded 5 or more years before care is needed.",
      "Ryan has seen families save $300,000 or more with a MAPT set up at 70, and others lose everything because they waited for the crisis to ask.",
      "Gifting has traps: every gift still hits the 5-year Medicaid lookback, and gifting a home directly can trigger capital gains. A trust is almost always better.",
      "The most overlooked killer: beneficiary designations on IRAs, 401(k)s, and life insurance override your will. An ex-spouse still listed gets the money.",
    ],
    footnote: "Trusts require a real elder-law attorney, never online forms. The Trust Selection Guide, Estate Tax Worksheet, and Beneficiary Audit show you exactly what to bring.",
  },
  "module-18": {
    intro: "48 million Americans give unpaid care to a family member, spend about $7,000 a year of their own money, and quietly carry it until they break. If you are running point, this one is about you.",
    heading: "The Caregiver Survival Guide",
    points: [
      "The unseen costs are real: $7,000 or more a year out of pocket, $300,000 or more in lifetime lost wages for women who leave work to care, and depression in 40% of caregivers.",
      "It is almost always one person, usually the daughter who lives closest, carrying 80% while siblings help only when asked. Divide the work by strength before someone burns out.",
      "Respite is infrastructure, not luxury: in-home help ($25 to $40 an hour), adult day centers ($50 to $100 a day), or short 1 to 2 week community stays. Plan it before you feel desperate.",
      "Out-of-state siblings still have a job: research, calls, bill paying, scheduling, emotional check-ins. Distance is not an excuse.",
      "Hiring help is not failure. When the caregiver's own health, marriage, or job is suffering, it is the responsible call.",
    ],
    footnote: "The Burnout Assessment, Respite Planning Guide, and Caregiver Information Sheet (so anyone can step in) turn 'I am drowning' into a plan.",
  },
  "module-19": {
    intro: "Finish the Blueprint and you know more about senior transitions than 99% of families. But knowledge without action is just information. Here is how to actually execute, and where to get help when it is bigger than a DIY course.",
    heading: "The Complete Loops Follow-Up System",
    points: [
      "A transition does not end on move-in day. Schedule the check-ins now: 30, 60, 90, 180, and 365 days. The families who follow up catch problems early.",
      "Be honest about where you are: Confident (execute the plan), Specific Questions (a quick call clears it), or Need Hands-On Guidance (you need a partner, not a course).",
      "Free help stays free: the strategy call, the SeniorSafe app for daily check-ins and AI guidance, and the daily content.",
      "Go deeper when DIY hits its edge: Blueprint Premium adds a personalized plan and a 60-minute call with Ryan; full advisory walks alongside you for 3 to 6 months.",
    ],
    footnote: "The natural step up from the DIY Blueprint to working with Ryan directly.",
  },
};

export function getGuidePreview(id: string): GuidePreview | undefined {
  return GUIDE_PREVIEWS[id];
}
