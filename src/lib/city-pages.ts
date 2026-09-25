/**
 * City pages for the Senior Transition Advisor for the family home
 * (built 2026-09-19, preview only until Ryan says GO).
 *
 * RULES FOR THIS FILE
 * - Every local fact here is either (a) copied from the county Senior Help
 *   Directory articles already in content/blog (verified when those were
 *   written), or (b) checked on 2026-09-19 against a primary source noted
 *   in a comment beside it. Nothing else. No client stories, no statistics,
 *   no fee ranges, no office in any city.
 * - Ryan is based in Greensboro and has no public office yet. The published
 *   address (ORGANIZATION.address) is the Raleigh mailing address. No page
 *   claims an office anywhere.
 * - No em dashes.
 *
 * SOURCES CHECKED 2026-09-19
 * - NC G.S. 105-277.1 (Homestead Exclusion): "An otherwise qualifying owner
 *   does not lose the benefit of this exclusion because of a temporary
 *   absence from his or her permanent residence for reasons of health, or
 *   because of an extended absence while confined to a rest home or nursing
 *   home, so long as the residence is unoccupied or occupied by the owner's
 *   spouse or other dependent." Exclusion is the greater of $25,000 or 50%.
 *   https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_105/GS_105-277.1.html
 * - NC G.S. 105-277.1B (Circuit Breaker): same rest home / nursing home
 *   absence language; on a disqualifying event (transfer, death, no longer
 *   the permanent residence) "The deferred taxes for the preceding three
 *   fiscal years are due and payable", with interest, as a lien.
 *   https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_105/GS_105-277.1B.html
 * - NC G.S. 47-28: before any transfer of real property by an agent under a
 *   Chapter 32C power of attorney, the POA (or a certified copy) must be
 *   registered with the register of deeds in the county where the principal
 *   is domiciled or where the property is.
 *   https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_47/GS_47-28.html
 * - County spans (Wikipedia + highpointnc.gov, 2026-09-19): High Point is in
 *   Guilford, Davidson, Forsyth and Randolph; Durham extends into Orange and
 *   Wake; Raleigh has a small part in Durham County; Cary is in Wake,
 *   Chatham and Durham; Chapel Hill is in Orange and Durham.
 */

import type { FAQItem } from "@/components/aeo/FAQSection";

export type CityFact = { title: string; body: string };
export type CityResource = { name: string; detail: string };
export type CityDirectory = { label: string; href: string };

export type CityPage = {
  slug: string;
  city: string;
  /** Counties the city sits in, main county first. */
  counties: string[];
  /** Short region label for the index. */
  region: "Triad" | "Triangle";
  metaTitle: string;
  description: string;
  /** First 2 to 3 sentences: the answer. */
  quickAnswer: string;
  /** Ryan's second paragraph, first person. */
  intro: string;
  countyHeading: string;
  countyBody: string[];
  facts: CityFact[];
  resourcesIntro: string;
  resources: CityResource[];
  directories: CityDirectory[];
  faqs: FAQItem[];
};

export const CITY_INDEX_PATH = "/senior-transition-advisor";
export const cityPath = (slug: string) => `${CITY_INDEX_PATH}/${slug}`;

const LEGAL_AID =
  "Legal Aid of North Carolina's Senior Law Project: free civil legal help for anyone 60 or older, including powers of attorney and Medicaid. Senior Legal Helpline 1-877-579-7562, weekdays 9 to 11 a.m. and 1 to 3 p.m.";

export const CITY_PAGES: CityPage[] = [
  {
    slug: "greensboro-nc",
    city: "Greensboro",
    counties: ["Guilford County"],
    region: "Triad",
    metaTitle: "Senior Transition Advisor in Greensboro, NC: The Family Home",
    description:
      "Parent moving to senior living in Greensboro? Don't list the house yet. Who can sign, the funding math, sell, rent or keep, and Guilford County help. Free.",
    quickAnswer:
      "When a parent in Greensboro moves to assisted living or memory care, don't list the house first. Find out who can legally sign for them, run the funding math against the community's fee sheet, and then decide whether to sell, rent or keep the house. Greensboro is in Guilford County, so the tax office, the Register of Deeds and DSS you'll work with are all Guilford's.",
    intro:
      "I'm Ryan Riggins, and Greensboro is home base for me. I'm a licensed North Carolina broker with eXp Realty, and I never take the listing. My job is the house decision that comes before any listing, so your family makes it in the right order instead of under somebody else's deadline.",
    countyHeading: "Greensboro is a Guilford County house.",
    countyBody: [
      "That sounds obvious, but it decides a lot. The property tax relief your parent may have, the office that records a power of attorney, and the DSS office that handles Medicaid and energy help all run through Guilford County.",
      "It also means one set of phone numbers. Below are the ones I'd call first, pulled from the Guilford County Senior Help Directory I keep on this site.",
    ],
    facts: [
      {
        title: "Guilford reappraised in 2026.",
        body: "If the 2026 reappraisal pushed the house's value up, that shows up in the tax bill you'll carry every month the house sits empty, and in what it's worth if you sell. You can't change the tax rate, but you can appeal the assessed value if comparable sales don't support it. Watch the deadline on the notice.",
      },
      {
        title: "If your parent is on the Circuit Breaker, it comes due at the sale.",
        body: "The Circuit Breaker is a deferral, not a discount. The taxes over the cap stay a lien on the house, and when the house is sold the last three years of deferred taxes come due with interest. That money comes out of the proceeds at closing, so it belongs in the funding math before anyone quotes you a net number.",
      },
      {
        title: "Moving out doesn't automatically end the Homestead Exclusion.",
        body: "North Carolina law says an owner doesn't lose the exclusion because of an extended absence in a rest home or nursing home, as long as the house is empty or only a spouse or dependent lives there. Renting it to a tenant is a different story. Ask the Guilford County Tax Department how it applies to your parent before you decide to rent.",
      },
      {
        title: "A power of attorney gets recorded before the deed does.",
        body: "If someone is signing for your parent under a power of attorney, North Carolina requires that document to be registered with the register of deeds before the sale is recorded. For a Greensboro house that's usually the Guilford County Register of Deeds. The closing attorney handles the filing, but you want to know early whether the document even covers real estate.",
      },
    ],
    resourcesIntro:
      "These come from my Guilford County Senior Help Directory. Programs and numbers change, so confirm before you rely on one.",
    resources: [
      {
        name: "Guilford County DSS, 336-641-3000",
        detail: "The front door for Medicaid, energy assistance and food benefits.",
      },
      {
        name: "Piedmont Triad Regional Council Area Agency on Aging, 336-294-4950",
        detail:
          "The regional aging agency for Guilford and eleven nearby counties. Free benefits counseling and a good call when you don't know who to ask.",
      },
      {
        name: "Senior Resources of Guilford",
        detail:
          "The local hub for anyone 60 and older: Meals on Wheels (336-333-6981 in the Greensboro area), in-home help and the family caregiver program.",
      },
      {
        name: "Guilford County Tax Department",
        detail:
          "Homestead Exclusion, Circuit Breaker, Disabled Veteran Exclusion and value appeals. Applications are due June 1.",
      },
      {
        name: "PACE of the Triad, 336-550-4040",
        detail:
          "If staying home is still on the table, PACE coordinates full medical care for people who would otherwise qualify for a nursing home.",
      },
      { name: "Legal Aid of NC, Senior Law Project", detail: LEGAL_AID },
    ],
    directories: [
      {
        label: "Guilford County Senior Help Directory",
        href: "/blog/guilford-county-senior-help-directory",
      },
      {
        label: "NC senior property tax relief in Guilford County",
        href: "/blog/nc-senior-property-tax-relief-guilford-county",
      },
    ],
    faqs: [
      {
        question: "What should we do with Mom's house in Greensboro when she moves to assisted living?",
        answer:
          "Don't list it first. Confirm who can legally sign for her, run the funding math against the community's fee sheet, and then decide sell, rent or keep. Bring in an elder law attorney for Medicaid and a CPA for taxes before anything is signed. If you sell, bring in one vetted local agent.",
      },
      {
        question: "Does the Guilford County Homestead Exclusion stop when a parent moves to assisted living?",
        answer:
          "Not automatically. North Carolina law keeps the exclusion during an extended absence in a rest home or nursing home, as long as the house is empty or only a spouse or dependent lives there. Renting it out can change that. Ask the Guilford County Tax Department how it applies to your parent.",
      },
      {
        question: "Do you have an office in Greensboro?",
        answer:
          "Not a public one yet. I'm based in Greensboro and work from there. I meet families at the parent's home, at the community, or by phone and video, and the first call is a 30-minute phone or video call. My mailing address is in Raleigh.",
      },
      {
        question: "Will you list my parent's Greensboro house?",
        answer:
          "No. I never take the listing and I never buy the house. If your family decides to sell, I refer one local agent I've vetted and tell you why that one. That agent pays me a referral fee at closing out of the commission. Your family pays me nothing.",
      },
    ],
  },
  {
    slug: "winston-salem-nc",
    city: "Winston-Salem",
    counties: ["Forsyth County"],
    region: "Triad",
    metaTitle: "Senior Transition Advisor in Winston-Salem, NC: The Home",
    description:
      "A parent in Winston-Salem moving to senior living? Decide the house before anyone lists it: who signs, the funding math, sell, rent or keep. Forsyth County help.",
    quickAnswer:
      "If your parent in Winston-Salem is moving to assisted living, settle the house before you call a listing agent. Confirm who can sign, put the community's fee sheet next to what your parent actually has, and then choose sell, rent or keep on purpose. Winston-Salem is in Forsyth County, and Forsyth's tax relief cuts both the county and the city tax bill, which changes what an empty house costs to carry.",
    intro:
      "I'm Ryan Riggins, a licensed North Carolina broker with eXp Realty, based up the road in Greensboro. I work with Winston-Salem families on the house decision before anyone lists it, and I never take the listing myself.",
    countyHeading: "Forsyth County, and the city tax on top.",
    countyBody: [
      "A Winston-Salem house pays two property taxes, the county's and the city's. North Carolina's senior tax programs, administered by Forsyth County Tax Administration, lower the value both of them tax. So whether your parent keeps that relief after the move is real money every month the house is held.",
      "Everything else runs through Forsyth too: the Register of Deeds, DSS and the aging services below.",
    ],
    facts: [
      {
        title: "Keep the house empty, or rent it? The tax relief may ride on it.",
        body: "North Carolina law lets an owner keep the Homestead Exclusion through an extended stay in a rest home or nursing home, as long as the house is empty or only a spouse or dependent lives there. A tenant is neither. Before you run rental numbers, call Forsyth County Tax Administration at 336-703-2300 and ask what renting would do to your parent's exclusion.",
      },
      {
        title: "The Circuit Breaker lien is paid at closing.",
        body: "If your parent uses the Circuit Breaker, the unpaid difference is a lien at 6% interest that comes due when the home is sold. Put it in the funding math up front so the net number isn't a surprise at the closing table.",
      },
      {
        title: "Record the power of attorney in the right place.",
        body: "When an agent under a power of attorney signs a deed, North Carolina requires the power of attorney to be registered with the register of deeds first, in the county where your parent lives or where the house is. For a Winston-Salem house that's normally the Forsyth County Register of Deeds. Have an attorney confirm the document covers selling real estate before you count on it.",
      },
    ],
    resourcesIntro:
      "From my Forsyth County Senior Help Directory. Confirm current details with each program.",
    resources: [
      {
        name: "Senior Services Inc., 336-724-2040",
        detail:
          "The Winston-Salem and Forsyth hub for anyone 60 and older, with a Help Line for referrals. Meals on Wheels is 336-725-0907.",
      },
      {
        name: "Forsyth County DSS Adult Intake, 336-703-3501",
        detail: "Medicaid, energy assistance and food benefits.",
      },
      {
        name: "Forsyth County Tax Administration, 336-703-2300",
        detail:
          "Homestead Exclusion, Circuit Breaker and Disabled Veteran Exclusion. The deadline is June 1.",
      },
      {
        name: "Crisis Control Ministry, 336-748-0217",
        detail: "Help with rent or mortgage, utilities and heating fuel, and small home modifications for residents 50 and older.",
      },
      {
        name: "PACE of the Triad (West), 336-550-4040",
        detail: "Full medical care for people who would otherwise need a nursing home, so they can stay home.",
      },
      { name: "Legal Aid of NC, Senior Law Project", detail: LEGAL_AID },
    ],
    directories: [
      {
        label: "Forsyth County Senior Help Directory",
        href: "/blog/forsyth-county-senior-help-directory",
      },
    ],
    faqs: [
      {
        question: "Should we sell Dad's Winston-Salem house to pay for assisted living?",
        answer:
          "Maybe, but decide it with numbers. Get the community's full fee sheet, put it next to his income and savings and what the house would really net, and see how many months the money lasts with and without a sale. Then compare selling, renting and keeping, with an elder law attorney and a CPA for the Medicaid and tax questions.",
      },
      {
        question: "Can we rent out Mom's Winston-Salem house while she's in assisted living?",
        answer:
          "You can, but check two things first. Rent is income, which can matter for care costs and benefits, so ask the elder law attorney. And a tenant may affect her Homestead Exclusion, which in Winston-Salem lowers both the county and the city tax, so ask Forsyth County Tax Administration at 336-703-2300.",
      },
      {
        question: "Where do we record a power of attorney for a Winston-Salem house?",
        answer:
          "North Carolina requires it to be registered with the register of deeds before a deed signed under it is recorded, in the county where your parent lives or where the house is. For a Winston-Salem house that's normally the Forsyth County Register of Deeds. The closing attorney usually handles it.",
      },
      {
        question: "Do you work in Winston-Salem if you're based in Greensboro?",
        answer:
          "Yes. Winston-Salem is part of the Triad I serve. The first call is 30 minutes, no obligation, by phone, video, email, or text. If your family sells, I refer one local agent I've vetted, and I'm paid only by that agent's referral fee at closing.",
      },
    ],
  },
  {
    slug: "high-point-nc",
    city: "High Point",
    counties: ["Guilford County", "Davidson County", "Forsyth County", "Randolph County"],
    region: "Triad",
    metaTitle: "Senior Transition Advisor in High Point, NC: The Family Home",
    description:
      "High Point sits in four counties, so check which one your parent's house is in before you decide sell, rent or keep. Who signs, the funding math, local help.",
    quickAnswer:
      "When a parent in High Point moves to senior living, hold off on listing the house until you know who can sign, how long the money lasts against the community's fee sheet, and whether selling, renting or keeping makes sense. Then check which county the house is in. High Point is the only city in North Carolina that sits in four counties, and the answer decides which tax office, register of deeds and DSS you'll deal with.",
    intro:
      "I'm Ryan Riggins, a licensed North Carolina broker with eXp Realty, based in Greensboro next door. I help High Point families decide the house question before anyone lists it, and I never take the listing.",
    countyHeading: "Four counties. Find yours on the tax bill.",
    countyBody: [
      "Most of High Point is in Guilford County, but parts of the city limits reach into Davidson, Forsyth and Randolph counties. Two houses a few miles apart can have different tax offices, different property tax relief paperwork and a different register of deeds.",
      "The fastest way to know: look at your parent's property tax bill. The county that sent it is the one that matters for everything on this page.",
    ],
    facts: [
      {
        title: "Each county runs its own property tax relief desk.",
        body: "The Homestead Exclusion and the Circuit Breaker are statewide, but you apply through the county. Guilford County Tax Department; Davidson County Tax Assessor, 336-242-2160; Forsyth County Tax Administration, 336-703-2300; Randolph County Tax Department, 336-318-6500. The deadline is June 1 in all four.",
      },
      {
        title: "The power of attorney goes to the right register of deeds.",
        body: "North Carolina requires a power of attorney to be registered with the register of deeds before a deed signed under it is recorded, in the county where your parent lives or where the house is. In High Point, don't assume it's Guilford. The closing attorney will file it, but the county on the tax bill tells you where.",
      },
      {
        title: "An empty house can keep its exclusion. A rented one may not.",
        body: "Under North Carolina law, an extended stay in a rest home or nursing home doesn't cost your parent the Homestead Exclusion, as long as the house is empty or only a spouse or dependent lives there. If you're thinking about renting it, ask that county's tax office first.",
      },
    ],
    resourcesIntro:
      "From my county Senior Help Directories. Start with the county on the tax bill, and confirm details before you rely on them.",
    resources: [
      {
        name: "Guilford side: Guilford County DSS, 336-641-3000",
        detail:
          "Medicaid, energy help and food benefits. Meals on Wheels for High Point and Jamestown through Senior Resources of Guilford: 336-884-6981.",
      },
      {
        name: "Davidson side: Davidson County Senior Services, 336-242-2290",
        detail: "Local aging programs, meals and caregiver help. Davidson County DSS is 336-242-2500.",
      },
      {
        name: "Randolph side: Randolph Senior Adults Association, 336-625-3389",
        detail:
          "The county's lead agency on aging, with a senior center in Archdale. Randolph County DSS is 336-683-8000.",
      },
      {
        name: "Forsyth side: Senior Services Inc., 336-724-2040",
        detail: "The Forsyth hub for anyone 60 and older. Forsyth County DSS Adult Intake is 336-703-3501.",
      },
      { name: "Legal Aid of NC, Senior Law Project", detail: LEGAL_AID },
    ],
    directories: [
      { label: "Guilford County Senior Help Directory", href: "/blog/guilford-county-senior-help-directory" },
      { label: "Davidson County Senior Help Directory", href: "/blog/davidson-county-senior-help-directory" },
      { label: "Randolph County Senior Help Directory", href: "/blog/randolph-county-senior-help-directory" },
      { label: "Forsyth County Senior Help Directory", href: "/blog/forsyth-county-senior-help-directory" },
    ],
    faqs: [
      {
        question: "What county is my parent's High Point house in?",
        answer:
          "Most of High Point is in Guilford County, but parts are in Davidson, Forsyth and Randolph. The property tax bill tells you for sure. That county's tax office, register of deeds and DSS are the ones you'll use.",
      },
      {
        question: "What do we do with a parent's High Point house when they move to assisted living?",
        answer:
          "Settle three things before anyone lists it: who can legally sign, how long the money lasts against the community's fee sheet, and whether to sell, rent or keep. Take the Medicaid and tax questions to an elder law attorney and a CPA. If you sell, bring in one vetted local agent.",
      },
      {
        question: "Where do we apply for senior property tax relief in High Point?",
        answer:
          "Through the county the house is in: Guilford County Tax Department, Davidson County Tax Assessor (336-242-2160), Forsyth County Tax Administration (336-703-2300) or Randolph County Tax Department (336-318-6500). The deadline is June 1.",
      },
      {
        question: "What does it cost to work with you on a High Point house?",
        answer:
          "Nothing to the family. If you sell, the agent I refer pays me a referral fee at closing out of the commission, through eXp Realty. If you rent, keep or wait, I'm not paid at all.",
      },
    ],
  },
  {
    slug: "raleigh-nc",
    city: "Raleigh",
    counties: ["Wake County", "Durham County"],
    region: "Triangle",
    metaTitle: "Senior Transition Advisor in Raleigh, NC: The Family Home",
    description:
      "Parent in Raleigh moving to assisted living? Decide the house first: who can sign, the funding math against the fee sheet, sell, rent or keep. Wake County help.",
    quickAnswer:
      "If a parent in Raleigh is moving to assisted living, don't start with a listing agent. Start with who can legally sign, then the funding math against the community's fee sheet, then the sell, rent or keep decision. Almost all of Raleigh is in Wake County, so Wake's tax office, register of deeds and Health and Human Services are usually the ones you'll deal with.",
    intro:
      "I'm Ryan Riggins, a licensed North Carolina broker with eXp Realty. I'm based in Greensboro, and the Triangle is part of where I work. The first call is by phone or video, and I never take the listing.",
    countyHeading: "Wake County, with a small piece in Durham.",
    countyBody: [
      "Raleigh is overwhelmingly a Wake County city, but a small part of it crosses into Durham County. If the tax bill comes from Durham County, use the Durham numbers instead.",
      "For most families, though, it's Wake: Wake County Tax Administration for relief programs, Wake County Health and Human Services for Medicaid, and Resources for Seniors as the local aging hub.",
    ],
    facts: [
      {
        title: "When the community is the problem, there's an ombudsman.",
        body: "The fee sheet drives the funding math, so surprises there matter. Central Pines Area Agency on Aging, the regional aging agency for Wake, runs the Long-Term Care Ombudsman program for nursing-home and assisted-living complaints. It's free: 1-800-310-9777.",
      },
      {
        title: "The Homestead Exclusion can survive the move.",
        body: "North Carolina law keeps the exclusion through an extended stay in a rest home or nursing home, as long as the house is empty or only a spouse or dependent lives there. Wake County Tax Administration (919-856-5400) is the office to ask before you rent it out.",
      },
      {
        title: "Who signs, and where the paper gets recorded.",
        body: "If a child is signing under a power of attorney, North Carolina requires the power of attorney to be registered with the register of deeds before the deed is recorded, in the county where the parent lives or where the house is. For most Raleigh houses that's the Wake County Register of Deeds.",
      },
    ],
    resourcesIntro:
      "From my Wake County Senior Help Directory. Confirm details before you rely on them.",
    resources: [
      {
        name: "Resources for Seniors, 919-872-7933",
        detail: "The Wake County aging hub, including the family caregiver program and home repair for income-qualified seniors.",
      },
      {
        name: "Wake County Health and Human Services, 919-212-7000",
        detail: "Medicaid, energy assistance and food benefits.",
      },
      {
        name: "Wake County Tax Administration, 919-856-5400",
        detail: "Homestead Exclusion, Circuit Breaker and Disabled Veteran Exclusion. Deadline June 1.",
      },
      {
        name: "Central Pines Area Agency on Aging, 1-800-310-9777",
        detail: "Options counseling, benefits help and the Long-Term Care Ombudsman.",
      },
      {
        name: "Senior CommUnity Care of North Carolina (PACE), 919-425-3050",
        detail: "The PACE program serving Wake County, for people who could stay home with full care coordination.",
      },
      { name: "Legal Aid of NC, Senior Law Project", detail: LEGAL_AID },
    ],
    directories: [
      { label: "Wake County Senior Help Directory", href: "/blog/wake-county-senior-help-directory" },
      { label: "Durham County Senior Help Directory", href: "/blog/durham-county-senior-help-directory" },
    ],
    faqs: [
      {
        question: "What do I do with my parent's Raleigh house when they move to senior living?",
        answer:
          "Don't list it yet. Confirm who can legally sign, run the funding math against the community's fee sheet, and then decide sell, rent or keep. An elder law attorney handles Medicaid and deeds, a CPA handles taxes, and if you sell, one vetted local agent handles the listing.",
      },
      {
        question: "Who do I call about a complaint with an assisted living community in Wake County?",
        answer:
          "The Long-Term Care Ombudsman through Central Pines Area Agency on Aging, 1-800-310-9777. It's free and it's their job.",
      },
      {
        question: "Do you work in Raleigh if you're based in Greensboro?",
        answer:
          "Yes. The Triangle is part of my service area. The first call is 30 minutes, no obligation, by phone, video, email, or text. If your family sells, I refer one vetted agent who knows the Raleigh market, and I never take the listing myself.",
      },
      {
        question: "Can Mom keep her Wake County property tax relief after she moves out?",
        answer:
          "Possibly. North Carolina law keeps the Homestead Exclusion through an extended stay in a rest home or nursing home if the house is empty or only a spouse or dependent lives there. Ask Wake County Tax Administration at 919-856-5400 how it applies to her.",
      },
    ],
  },
  {
    slug: "durham-nc",
    city: "Durham",
    counties: ["Durham County", "Orange County", "Wake County"],
    region: "Triangle",
    metaTitle: "Senior Transition Advisor in Durham, NC: The Family Home",
    description:
      "A parent in Durham moving to assisted living? Before anyone lists the house: who can sign, the funding math, sell, rent or keep, and Durham County's own tax relief.",
    quickAnswer:
      "When a parent in Durham moves to assisted living or memory care, work out the house before you list it: who can sign, how long the money lasts against the community's fee sheet, and whether to sell, rent or keep. Most of Durham is in Durham County, which runs a property tax program of its own on top of the state's, so check what your parent has before you run the numbers.",
    intro:
      "I'm Ryan Riggins, a licensed North Carolina broker with eXp Realty, based in Greensboro. I work with Durham families on the house decision by phone and video, and I never take the listing.",
    countyHeading: "Mostly Durham County, with edges in Orange and Wake.",
    countyBody: [
      "The City of Durham is almost all in Durham County, but small portions of the city limits reach into Orange and Wake counties. The tax bill tells you which one you're in.",
      "Inside Durham County there's one more thing to know. Besides the three statewide programs, the county runs its own Low-Income Homeowner Relief program through DSS, not the tax office.",
    ],
    facts: [
      {
        title: "Durham's Low-Income Homeowner Relief is its own program.",
        body: "It helps eligible homeowners with the property tax bill on a three-tier income model. You must have owned and lived in the home five years, be at or below 80% of area median income, and not already get a state property tax subsidy. Applications typically open September 1 through Durham County DSS, 919-560-8000. If your parent is moving out, ask DSS what that means for the program before you count on it.",
      },
      {
        title: "The Circuit Breaker lien is due when the house sells.",
        body: "If your parent uses the state Circuit Breaker, the unpaid difference becomes a lien at 6% interest, due when the home is sold. That comes out of the proceeds, so it belongs in the funding math.",
      },
      {
        title: "Record the power of attorney before the deed.",
        body: "North Carolina requires a power of attorney to be registered with the register of deeds before a deed signed under it is recorded, in the county where your parent lives or where the house is. For most Durham houses that's the Durham County Register of Deeds.",
      },
    ],
    resourcesIntro: "From my Durham County Senior Help Directory. Confirm details before you rely on them.",
    resources: [
      {
        name: "Durham Center for Senior Life, 919-688-8247",
        detail: "The local hub for older adults, and the family caregiver program.",
      },
      {
        name: "Durham County DSS, 919-560-8000",
        detail: "Medicaid, energy assistance, food benefits and the Low-Income Homeowner Relief program.",
      },
      {
        name: "Durham County Tax Administration, 919-560-0300",
        detail: "The statewide Homestead Exclusion, Circuit Breaker and Disabled Veteran Exclusion. Deadline June 1.",
      },
      {
        name: "Central Pines Area Agency on Aging, 1-800-310-9777",
        detail: "The regional aging agency, based in Durham. Options counseling and the Long-Term Care Ombudsman.",
      },
      {
        name: "Meals on Wheels of Durham, 919-667-9424",
        detail: "A meal and a daily safety check for homebound seniors.",
      },
      { name: "Legal Aid of NC, Senior Law Project", detail: LEGAL_AID },
    ],
    directories: [
      { label: "Durham County Senior Help Directory", href: "/blog/durham-county-senior-help-directory" },
      { label: "Orange County Senior Help Directory", href: "/blog/orange-county-senior-help-directory" },
      { label: "Wake County Senior Help Directory", href: "/blog/wake-county-senior-help-directory" },
    ],
    faqs: [
      {
        question: "What should we do with Dad's Durham house when he moves to memory care?",
        answer:
          "First, who can sign. With dementia that often means a power of attorney, and it has to cover real estate. Then the funding math against the community's fee sheet, then sell, rent or keep. An elder law attorney should see the plan before the house is sold, rented or retitled.",
      },
      {
        question: "What is Durham's Low-Income Homeowner Relief program?",
        answer:
          "A Durham County program, run by DSS, that helps eligible homeowners with the property tax bill. You must have owned and lived in the home five years and be at or below 80% of area median income. Applications typically open September 1. Call Durham County DSS at 919-560-8000.",
      },
      {
        question: "Is all of Durham in Durham County?",
        answer:
          "Almost. Small portions of the City of Durham are in Orange and Wake counties. Check the property tax bill to know which county's offices to use.",
      },
      {
        question: "Do you take the listing on Durham houses?",
        answer:
          "No, never. If your family decides to sell, I refer one local agent I've vetted and tell you why that one. I'm paid a referral fee at closing by that agent, not by your family.",
      },
    ],
  },
  {
    slug: "cary-nc",
    city: "Cary",
    counties: ["Wake County", "Chatham County", "Durham County"],
    region: "Triangle",
    metaTitle: "Senior Transition Advisor in Cary, NC: The Family Home",
    description:
      "Cary spans Wake and Chatham counties. Before you list a parent's house: who can sign, the funding math, sell, rent or keep, and the right county's tax relief.",
    quickAnswer:
      "If your parent in Cary is moving to senior living, settle the house before anyone lists it: who can legally sign, the funding math against the community's fee sheet, and sell, rent or keep. Cary spreads across Wake and Chatham counties, with a small piece in Durham, so the first practical step is finding out which county the house is actually in.",
    intro:
      "I'm Ryan Riggins, a licensed North Carolina broker with eXp Realty. I'm based in Greensboro and work with Triangle families, Cary included, by phone and video. I never take the listing.",
    countyHeading: "Wake, Chatham, or a sliver of Durham.",
    countyBody: [
      "Most of Cary is in Wake County, but the town reaches west into Chatham County and has a small part in Durham County. The county decides which tax office handles relief, which register of deeds records a power of attorney, and which DSS handles Medicaid.",
      "Chatham has a small tax relief program of its own, so a Cary house on the Chatham side has one more thing to check.",
    ],
    facts: [
      {
        title: "On the Chatham side, there's an extra program.",
        body: "Chatham County applies the statewide programs through its Tax Administration Listing Division, 919-542-8250, and also runs its own Low Income Tax Relief Program, up to $500 off, through its Affordable Housing office. On the Wake side, it's Wake County Tax Administration, 919-856-5400. Both use a June 1 deadline for the state programs.",
      },
      {
        title: "Empty versus rented changes the tax picture.",
        body: "North Carolina law keeps the Homestead Exclusion through an extended stay in a rest home or nursing home, as long as the house is empty or only a spouse or dependent lives there. If renting is on the table, ask the county tax office first.",
      },
      {
        title: "The power of attorney has to be on record.",
        body: "Before a deed signed under a power of attorney is recorded, North Carolina requires the power of attorney to be registered with the register of deeds in the county where your parent lives or where the house is. In Cary that could be Wake, Chatham or Durham.",
      },
    ],
    resourcesIntro:
      "From my Wake and Chatham County Senior Help Directories. Start with the county on the tax bill.",
    resources: [
      {
        name: "Wake side: Resources for Seniors, 919-872-7933",
        detail: "The Wake County aging hub. Wake County Health and Human Services (Medicaid, energy, food) is 919-212-7000.",
      },
      {
        name: "Wake side: GoWake Access, 919-212-7005",
        detail: "Door-to-door shared rides for residents 60 and older.",
      },
      {
        name: "Chatham side: Chatham County Aging Services, 919-542-4512",
        detail: "Reached through the Pittsboro Center for Active Living. Chatham County DSS is 919-542-2759.",
      },
      {
        name: "Central Pines Area Agency on Aging, 1-800-310-9777",
        detail: "The regional aging agency for Wake and Chatham, and the Long-Term Care Ombudsman.",
      },
      { name: "Legal Aid of NC, Senior Law Project", detail: LEGAL_AID },
    ],
    directories: [
      { label: "Wake County Senior Help Directory", href: "/blog/wake-county-senior-help-directory" },
      { label: "Chatham County Senior Help Directory", href: "/blog/chatham-county-senior-help-directory" },
    ],
    faqs: [
      {
        question: "Is Cary in Wake County or Chatham County?",
        answer:
          "Both, and a small part is in Durham County. Most of Cary is in Wake. The property tax bill tells you which county your parent's house is in.",
      },
      {
        question: "What do we do with Mom's Cary house when she moves to assisted living?",
        answer:
          "Settle who can sign, run the funding math against the community's fee sheet, then decide sell, rent or keep. Take Medicaid and deed questions to an elder law attorney and the tax side to a CPA. If you sell, one vetted local agent.",
      },
      {
        question: "What property tax relief is there for a Cary house in Chatham County?",
        answer:
          "The statewide programs through Chatham County Tax Administration's Listing Division at 919-542-8250, plus Chatham's own Low Income Tax Relief Program, up to $500 off, through Affordable Housing.",
      },
      {
        question: "What does your help cost a Cary family?",
        answer:
          "Nothing. If the family sells, the agent I refer pays me a referral fee at closing out of the commission. If you rent, keep or wait, I'm not paid.",
      },
    ],
  },
  {
    slug: "chapel-hill-nc",
    city: "Chapel Hill",
    counties: ["Orange County", "Durham County"],
    region: "Triangle",
    metaTitle: "Senior Transition Advisor in Chapel Hill, NC: The Family Home",
    description:
      "Chapel Hill sits in Orange and Durham counties. Before a parent's house is listed: who can sign, the funding math, sell, rent or keep, and Orange County help.",
    quickAnswer:
      "When a parent in Chapel Hill moves to assisted living, decide the house before anyone lists it: confirm who can sign, run the funding math against the community's fee sheet, and choose sell, rent or keep. Chapel Hill is in Orange County and Durham County, and most families will deal with Orange County's offices, where tax staff will help fill out the relief paperwork.",
    intro:
      "I'm Ryan Riggins, a licensed North Carolina broker with eXp Realty, based in Greensboro. I work with Chapel Hill families on the house decision by phone and video, and I never take the listing.",
    countyHeading: "Orange County, with part of town in Durham.",
    countyBody: [
      "Chapel Hill is an Orange County town that also reaches into Durham County. The county on the tax bill is the one whose tax office, register of deeds and DSS you'll use.",
      "On the Orange side, the county Department on Aging runs the Seymour Center in Chapel Hill, and it's a good first call for almost anything.",
    ],
    facts: [
      {
        title: "Homestead Exclusion or Circuit Breaker, not both.",
        body: "In Orange County you can't combine the Circuit Breaker with the Homestead Exclusion. The Circuit Breaker is a deferral: the unpaid difference for the current and three prior years becomes a lien at 6% interest, due when the home is sold. If a sale is likely, know which one your parent has. Orange County Tax Administration, 919-245-2100 option 2, will help with the paperwork.",
      },
      {
        title: "If staying home is still possible, price that too.",
        body: "Keeping the house sometimes means keeping your parent in it. Orange County's Handy Helpers volunteers build ramps and install grab bars at no labor cost, and Piedmont Health SeniorCare is the PACE program serving Orange County. Put those next to the community's fee sheet before you decide.",
      },
      {
        title: "Record the power of attorney in the right county.",
        body: "North Carolina requires a power of attorney to be registered with the register of deeds before a deed signed under it is recorded, in the county where your parent lives or where the house is. For most Chapel Hill houses that's the Orange County Register of Deeds.",
      },
    ],
    resourcesIntro:
      "From my Orange County Senior Help Directory. Confirm details before you rely on them.",
    resources: [
      {
        name: "Orange County Department on Aging, 919-968-2087",
        detail: "Information Helpline. Runs the Seymour Center in Chapel Hill and the Handy Helpers program.",
      },
      {
        name: "Orange County DSS, 919-245-2800",
        detail: "Medicaid, energy assistance and food benefits.",
      },
      {
        name: "Orange County Tax Administration, 919-245-2100 option 2",
        detail: "Homestead Exclusion, Circuit Breaker and Disabled Veteran Exclusion. Deadline June 1.",
      },
      {
        name: "Piedmont Health SeniorCare (PACE), 919-545-7337",
        detail: "Full care coordination for people who could stay home instead of a nursing home.",
      },
      {
        name: "EZ Rider, 919-969-5544",
        detail: "Door-to-door paratransit inside Chapel Hill and Carrboro.",
      },
      { name: "Legal Aid of NC, Senior Law Project", detail: LEGAL_AID },
    ],
    directories: [
      { label: "Orange County Senior Help Directory", href: "/blog/orange-county-senior-help-directory" },
      { label: "Durham County Senior Help Directory", href: "/blog/durham-county-senior-help-directory" },
    ],
    faqs: [
      {
        question: "What county is Chapel Hill in?",
        answer:
          "Orange County, and part of the town is in Durham County. The property tax bill tells you which one your parent's house is in.",
      },
      {
        question: "Should we keep Mom's Chapel Hill house or sell it when she moves to assisted living?",
        answer:
          "Run the funding math first: the community's fee sheet against her income, savings and what the house would net. Then compare selling, renting and keeping, including what it costs to hold an empty house. An elder law attorney and a CPA should see the plan before anything is signed.",
      },
      {
        question: "Can my parent have both the Homestead Exclusion and the Circuit Breaker in Orange County?",
        answer:
          "No. You can't combine them. The Circuit Breaker is a deferral that becomes a lien due when the home is sold, so know which one your parent has before you plan a sale. Orange County Tax Administration is at 919-245-2100 option 2.",
      },
      {
        question: "Will you sell my parent's Chapel Hill house?",
        answer:
          "No. I never take the listing and never buy the house. If your family sells, I refer one vetted local agent, who pays me a referral fee at closing. Your family pays me nothing.",
      },
    ],
  },
];

export function cityBySlug(slug: string): CityPage | undefined {
  return CITY_PAGES.find((c) => c.slug === slug);
}
