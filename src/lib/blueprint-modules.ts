/**
 * Structured data for the 20-module Senior Transition Blueprint mind map.
 *
 * One row per clickable mind-map node. Each row carries everything the
 * side drawer needs to render: the title, the phase label, the outcome
 * bullets ("What you'll do"), the YouTube id (if a video exists), the
 * tool downloads (PDFs under /public/blueprint-tools/), and an optional
 * GHL course-lesson URL.
 *
 * This array is the single source of truth. The mind-map markdown is
 * generated from it at runtime, so adding/renaming a module ripples
 * through the map automatically.
 *
 * GHL lesson URLs are intentionally optional. Ryan will backfill them
 * from his GHL admin in a follow-up commit. Until then the "Open the
 * full lesson" CTA is hidden per spec.
 */

export type ToolLink = {
  name: string;
  /** Path under /public/blueprint-tools/, leading slash included. */
  href: string;
};

export type Module = {
  /** Stable id used in the markmap link href, e.g. "module-9". */
  id: string;
  /** Display number, e.g. "0", "9", "19", "19-premium". */
  number: string;
  /** Module title (no em dashes, brand voice rule). */
  title: string;
  /** Phase label including the colored emoji glyph used in the source. */
  phase: string;
  /** Bullet outcomes shown as "What you'll do" in the drawer. */
  outcomes: string[];
  /** PDF download cards for the drawer's Tools section. */
  tools: ToolLink[];
  /** YouTube video id, or null when no video exists yet. */
  youtubeId: string | null;
  /** GHL course lesson URL. Hidden if null. Backfilled later by Ryan. */
  ghlLessonUrl: string | null;
};

const t = (file: string, name: string): ToolLink => ({
  name,
  href: `/blueprint-tools/${file}`,
});

export const MODULES: Module[] = [
  {
    id: "module-0",
    number: "0",
    title: "Orientation & Quick Start",
    phase: "🟫 Start Here",
    outcomes: [
      "Get the lay of the land",
      "Understand the 20-module path",
      "Set the family up for protected decisions",
    ],
    tools: [
      t("Tool_00A_Quick_Start_7Day_Checklist.pdf", "Quick Start 7-Day Checklist"),
      t("Tool_00B_Family_Sharing_Letter.pdf", "Family Sharing Letter"),
    ],
    youtubeId: "N_L1JKGSiHY",
    ghlLessonUrl: null,
  },
  {
    id: "module-1",
    number: "1",
    title: "Your New Starting Point",
    phase: "🟫 Start Here",
    outcomes: [
      "Honest assessment of where the family is right now",
      "Realistic timeline check",
      "Identify which transition stage applies",
    ],
    tools: [
      t("Tool_01A_Starting_Point_Quick_Assessment.pdf", "Starting Point Quick Assessment"),
      t("Tool_01B_Timeline_Reality_Check.pdf", "Timeline Reality Check"),
      t("Tool_01C_Transition_Stage_Readiness_Assessment.pdf", "Transition Stage Readiness Assessment"),
    ],
    youtubeId: "anQgBvoNlGg",
    ghlLessonUrl: null,
  },
  {
    id: "module-2",
    number: "2",
    title: "The Decluttering Phase",
    phase: "🟧 Sort, Rightsize & Prep",
    outcomes: [
      "Break the overwhelm into bite-sized days",
      "Build sorting confidence before tough rooms",
    ],
    tools: [
      t("Tool_02A_5_Pile_Sorting_System.pdf", "5-Pile Sorting System"),
      t("Tool_02A_Guide_5_Pile_Sorting_System.pdf", "5-Pile Sorting System Guide"),
      t("Tool_02B_Two_Bag_Daily_Tidy_Tracker.pdf", "Two-Bag Daily Tidy Tracker"),
      t("Tool_02C_Checklist_Confidence_Building_Areas.pdf", "Confidence Building Areas Checklist"),
      t("Tool_02C_Confidence_Building_Areas.pdf", "Confidence Building Areas Guide"),
    ],
    youtubeId: "98yHTDwoXEw",
    ghlLessonUrl: null,
  },
  {
    id: "module-3",
    number: "3",
    title: "Structured Sorting & Categorizing",
    phase: "🟧 Sort, Rightsize & Prep",
    outcomes: [
      "Sort paperwork without losing the important stuff",
      "Track progress room-by-room",
    ],
    tools: [
      t("Tool_03A_Paperwork_3_Folder_System.pdf", "Paperwork 3-Folder System"),
      t("Tool_03B_Sorting_Progress_Tracker.pdf", "Sorting Progress Tracker"),
      t("Tool_03C_Room_By_Room_Sorting_Plan.pdf", "Room-by-Room Sorting Plan"),
    ],
    youtubeId: "CsgX-ozmkhs",
    ghlLessonUrl: null,
  },
  {
    id: "module-4",
    number: "4",
    title: "Rightsizing the Home",
    phase: "🟧 Sort, Rightsize & Prep",
    outcomes: [
      "Handle sentimental items without family conflict",
      "Plan the new space before the move",
    ],
    tools: [
      t("Tool_04A_Sentimental_Items_3_Path.pdf", "Sentimental Items 3-Path"),
      t("Tool_04B_Pick_Your_Favorites_First.pdf", "Pick Your Favorites First"),
      t("Tool_04C_Move_Forward_Decision_Guide.pdf", "Move Forward Decision Guide"),
      t("Tool_04D_New_Home_Space_Planner.pdf", "New Home Space Planner"),
    ],
    youtubeId: "V1iJqAMAg90",
    ghlLessonUrl: null,
  },
  {
    id: "module-5",
    number: "5",
    title: "Safety, Repairs & Smart Upgrades",
    phase: "🟧 Sort, Rightsize & Prep",
    outcomes: [
      "Spot the safety issues that delay closings",
      "Avoid the $30K kitchen that doesn't pay back",
      "Compare contractor bids without getting played",
    ],
    tools: [
      t("Tool_05A_Smart_Prep_Budget.pdf", "Smart Prep Budget"),
      t("Tool_05B_Safety_Walkthrough.pdf", "Safety Walkthrough"),
      t("Tool_05C_Contractor_Bid_Comparison.pdf", "Contractor Bid Comparison"),
      t("Tool_05D_Repair_Priority_Assessment.pdf", "Repair Priority Assessment"),
    ],
    youtubeId: "4JDCc-PYijw",
    ghlLessonUrl: null,
  },
  {
    id: "module-6",
    number: "6",
    title: "Financial & Legal Preparation",
    phase: "🟨 Authority, Money & Care",
    outcomes: [
      "Get the documents in order before crisis hits",
      "Protect against financial exploitation",
      "Understand Medicare and Medicaid basics",
    ],
    tools: [
      t("Tool_06A_Essential_Legal_Documents.pdf", "Essential Legal Documents"),
      t("Tool_06B_Financial_Exploitation_Prevention.pdf", "Financial Exploitation Prevention"),
      t("Tool_06C_Medicare_Medicaid_Assessment.pdf", "Medicare / Medicaid Assessment"),
      t("Tool_06D_Transition_Cost_Estimator.pdf", "Transition Cost Estimator"),
    ],
    youtubeId: "_fhhPrd-57Q",
    ghlLessonUrl: null,
  },
  {
    id: "module-7",
    number: "7",
    title: "Senior Community Exploration",
    phase: "🟨 Authority, Money & Care",
    outcomes: [
      "Compare communities apples-to-apples",
      "Ask the right questions on the tour",
      "Recognize the red flags before signing",
    ],
    tools: [
      t("Tool_07A_Monthly_Cost_Comparison.pdf", "Monthly Cost Comparison"),
      t("Tool_07B_Tour_Questions.pdf", "Tour Questions"),
      t("Tool_07C_Red_Flags.pdf", "Red Flags"),
      t("Tool_07D_Comparison_Scorecard.pdf", "Comparison Scorecard"),
    ],
    youtubeId: "ljhr5Jf2j20",
    ghlLessonUrl: null,
  },
  {
    id: "module-8",
    number: "8",
    title: "Estate Planning Essentials",
    phase: "🟨 Authority, Money & Care",
    outcomes: [
      "Get the estate documents that protect the family",
      "Inventory digital assets nobody thinks about",
      "Identify decision-makers ahead of time",
    ],
    tools: [
      t("Tool_08A_Estate_Documents.pdf", "Estate Documents"),
      t("Tool_08B_Digital_Asset_Inventory.pdf", "Digital Asset Inventory"),
      t("Tool_08C_Asset_Inventory.pdf", "Asset Inventory"),
      t("Tool_08D_Decision_Makers.pdf", "Decision Makers"),
    ],
    youtubeId: "gjYH9CZvtPU",
    ghlLessonUrl: null,
  },
  {
    id: "module-9",
    number: "9",
    title: "Home Sale Strategy",
    phase: "🟦 Sell & Move",
    outcomes: [
      "Run the actual numbers on every exit option",
      "Protect against predatory cash offers",
      "Pick the strategy that nets the most equity",
    ],
    tools: [
      t("Tool_09A_Net_Proceeds.pdf", "Net Proceeds Calculator"),
      t("Tool_09B_Cash_Offer_Checklist.pdf", "Cash Offer Checklist"),
      t("Tool_09C_Traditional_Listing.pdf", "Traditional Listing"),
      t("Tool_09D_Decision_Pyramid.pdf", "Decision Pyramid"),
    ],
    youtubeId: "DCX5fOdESEo",
    ghlLessonUrl: null,
  },
  {
    id: "module-10",
    number: "10",
    title: "Move Management & Coordination",
    phase: "🟦 Sell & Move",
    outcomes: [
      "Sequence the move so nothing falls through the cracks",
      "Get utilities and address changes done right",
    ],
    tools: [
      t("Tool_10A_Move_Timeline.pdf", "Move Timeline"),
      t("Tool_10B_Address_Change.pdf", "Address Change"),
      t("Tool_10C_Essentials_Box.pdf", "Essentials Box"),
      t("Tool_10D_Utility_Transfer.pdf", "Utility Transfer"),
    ],
    youtubeId: "JxFHN5fgAjI",
    ghlLessonUrl: null,
  },
  {
    id: "module-11",
    number: "11",
    title: "Final Move-Out & Home Transition",
    phase: "🟦 Sell & Move",
    outcomes: [
      "Run a clean closing day",
      "Final walkthrough without surprises",
      "Wrap up the post-closing tasks people forget",
    ],
    tools: [
      t("Tool_11A_Closing_Day.pdf", "Closing Day"),
      t("Tool_11B_Final_Walkthrough.pdf", "Final Walkthrough"),
      t("Tool_11C_Post_Closing.pdf", "Post-Closing"),
    ],
    youtubeId: "SMloinI-Ank",
    ghlLessonUrl: null,
  },
  {
    id: "module-12",
    number: "12",
    title: "Settling Into the Next Chapter",
    phase: "🟪 Settle In & Long-Term Wellbeing",
    outcomes: [
      "Handle the critical first 72 hours",
      "Spot warning signs early",
      "Build a daily routine that sticks",
    ],
    tools: [
      t("Tool_12A_First_72_Hours.pdf", "First 72 Hours"),
      t("Tool_12B_Warning_Signs.pdf", "Warning Signs"),
      t("Tool_12C_Check_In_Template.pdf", "Check-In Template"),
      t("Tool_12D_Routine_Builder.pdf", "Routine Builder"),
    ],
    youtubeId: "fm7OrHOC-wo",
    ghlLessonUrl: null,
  },
  {
    id: "module-13",
    number: "13",
    title: "Family Communication & Reducing Stress",
    phase: "🟪 Settle In & Long-Term Wellbeing",
    outcomes: [
      "Run a productive family meeting",
      "De-escalate sibling conflict",
      "Divide the work so one person doesn't burn out",
    ],
    tools: [
      t("Tool_13A_Family_Meeting.pdf", "Family Meeting"),
      t("Tool_13B_De_Escalation.pdf", "De-Escalation"),
      t("Tool_13C_Task_Division.pdf", "Task Division"),
      t("Tool_13D_Caregiver_Burnout.pdf", "Caregiver Burnout"),
    ],
    youtubeId: "clpvp5PM2w4",
    ghlLessonUrl: null,
  },
  {
    id: "module-14",
    number: "14",
    title: "Aging in Place: The Complete Reality Check",
    phase: "🟪 Settle In & Long-Term Wellbeing",
    outcomes: [
      "Calculate the real cost of staying home",
      "Plan home modifications that actually help",
      "Have a Plan B if aging in place stops working",
    ],
    tools: [
      t("Tool_14A_Aging_Cost_Calculator.pdf", "Aging Cost Calculator"),
      t("Tool_14B_Home_Modification.pdf", "Home Modification"),
      t("Tool_14C_Plan_B.pdf", "Plan B"),
    ],
    youtubeId: "N0VboMWHgLc",
    ghlLessonUrl: null,
  },
  {
    id: "module-15",
    number: "15",
    title: "Long-Term Care Insurance In Depth",
    phase: "🟪 Settle In & Long-Term Wellbeing",
    outcomes: [
      "Decide whether LTC insurance fits your family",
      "Compare policies without getting upsold",
      "Run the affordability math honestly",
    ],
    tools: [
      t("Tool_15A_LTC_Decision.pdf", "LTC Decision"),
      t("Tool_15B_Policy_Comparison.pdf", "Policy Comparison"),
      t("Tool_15C_Affordability.pdf", "Affordability"),
    ],
    youtubeId: "Aqfa8FypCZM",
    ghlLessonUrl: null,
  },
  {
    id: "module-16",
    number: "16",
    title: "Medicare, Medicaid & VA Benefits",
    phase: "🟪 Settle In & Long-Term Wellbeing",
    outcomes: [
      "Find the Medicare coverage gaps before they cost you",
      "Check VA eligibility most families miss",
      "Understand the Medicaid spend-down rules",
      "Coordinate benefits without losing them",
    ],
    tools: [
      t("Tool_16A_Medicare_Gap.pdf", "Medicare Gap"),
      t("Tool_16B_VA_Eligibility.pdf", "VA Eligibility"),
      t("Tool_16C_Medicaid_Spend_Down.pdf", "Medicaid Spend-Down"),
      t("Tool_16D_Benefits_Coordination.pdf", "Benefits Coordination"),
    ],
    youtubeId: "juR91iYnycs",
    ghlLessonUrl: null,
  },
  {
    id: "module-17",
    number: "17",
    title: "Estate Planning & Asset Protection (Advanced)",
    phase: "🟪 Settle In & Long-Term Wellbeing",
    outcomes: [
      "Pick the right trust structure for your family",
      "Plan for estate tax exposure",
      "Audit beneficiaries before it's too late",
    ],
    tools: [
      t("Tool_17A_Trust_Selection.pdf", "Trust Selection"),
      t("Tool_17B_Estate_Tax.pdf", "Estate Tax"),
      t("Tool_17C_Beneficiary_Audit.pdf", "Beneficiary Audit"),
    ],
    youtubeId: "gh72op62UfQ",
    ghlLessonUrl: null,
  },
  {
    id: "module-18",
    number: "18",
    title: "Family Caregiver Survival Guide",
    phase: "🟪 Settle In & Long-Term Wellbeing",
    outcomes: [
      "Recognize caregiver burnout before it breaks you",
      "Plan respite without guilt",
      "Set up the caregiver info system",
    ],
    tools: [
      t("Tool_18A_Burnout_Assessment.pdf", "Burnout Assessment"),
      t("Tool_18B_Respite_Planning.pdf", "Respite Planning"),
      t("Tool_18C_Caregiver_Info.pdf", "Caregiver Info"),
    ],
    youtubeId: null,
    ghlLessonUrl: null,
  },
  {
    id: "module-19",
    number: "19",
    title: "Your Next Steps & Getting More Help",
    phase: "🟥 Your Action Plan",
    outcomes: [
      "Assess what you've completed",
      "Identify what's still open",
      "Decide what to tackle next",
    ],
    tools: [
      t("Tool_19A_Completion_Assessment.pdf", "Completion Assessment"),
    ],
    youtubeId: null,
    ghlLessonUrl: null,
  },
  {
    id: "module-19-premium",
    number: "19-premium",
    title: "Your Personalized Strategy Session (Premium)",
    phase: "🟥 Your Action Plan",
    outcomes: [
      "Personalized transition plan written for your situation",
      "60-minute 1-on-1 call with Ryan",
      "90 days of email support",
    ],
    tools: [
      t("Tool_19A_Premium_Session_Prep.pdf", "Premium Session Prep"),
      t("Tool_19B_Premium_Intake_Form.pdf", "Premium Intake Form"),
    ],
    youtubeId: null,
    ghlLessonUrl: null,
  },
];

export function getModuleById(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

/**
 * Public Supabase Storage base for the AI-narrated module overview videos
 * (the same clips embedded at the top of each Blueprint module page). Absolute
 * URL on purpose: these are public CDN objects, so this is project-independent
 * and needs no env wiring on rss-site. Files are named by zero-padded module
 * number: module-00.mp4 ... module-19.mp4, plus module-19-premium.mp4.
 */
const MODULE_VIDEO_BASE =
  "https://ynsakoxsmuvwfjgbhxky.supabase.co/storage/v1/object/public/module-videos";

/** URL of a module's overview video, derived from its display number. */
export function moduleVideoUrl(m: Module): string {
  const padded = m.number.includes("-") ? m.number : m.number.padStart(2, "0");
  return `${MODULE_VIDEO_BASE}/module-${padded}.mp4`;
}

/**
 * Build the simplified Markmap source markdown from MODULES. Each
 * module heading is a markdown link with href "#<module-id>", which
 * Markmap renders as a clickable anchor inside the SVG. The drawer
 * intercepts those clicks via event delegation.
 *
 * Maggie + Books branches stay as direct external/internal links so
 * they remain useful even without a drawer entry.
 */
export function buildMindMapMarkdown(opts?: {
  rootTitle?: string;
  tagline?: string;
}): string {
  const rootTitle = opts?.rootTitle ?? "Senior Transition Blueprint";
  const tagline =
    opts?.tagline ?? "Protect equity, dignity, and family, one decision at a time";

  const phases = new Map<string, Module[]>();
  for (const m of MODULES) {
    const list = phases.get(m.phase) ?? [];
    list.push(m);
    phases.set(m.phase, list);
  }

  const sections: string[] = [];
  sections.push(
    `---\nmarkmap:\n  colorFreezeLevel: 2\n  initialExpandLevel: 2\n  maxWidth: 320\n  spacingHorizontal: 110\n  spacingVertical: 16\n---`
  );
  sections.push(`# ${rootTitle}`);
  sections.push(`## ${tagline}`);

  for (const [phase, mods] of phases) {
    const lines = [`## ${phase}`];
    for (const m of mods) {
      lines.push(`### [Module ${m.number}: ${m.title}](#${m.id})`);
    }
    sections.push(lines.join("\n"));
  }

  // Maggie + Books are static, non-drawer branches.
  sections.push(
    `## ✨ Want a navigator instead of a roadmap?\n` +
      `### [Maggie, Premium+ Tier](https://app.seniorsafeapp.com)\n` +
      `### [Apply for the Senior Transition Roadmap](https://blueprint.rigginsstrategicsolutions.com/roadmap)`
  );
  sections.push(
    `## 📚 The Books\n` +
      `### [🛒 The Unheard Conversation, $9.99 on Amazon](https://www.amazon.com/dp/B0GQLB5536)\n` +
      `### [🛒 The Other Side of the Conversation, $9.99 on Amazon](https://www.amazon.com/dp/B0GRR5FLDD)`
  );

  return sections.join("\n\n");
}
