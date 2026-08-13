"""
Content for the two Build 6 magnets. Run this to write both PDFs.

MAGNET 2 IS NOT A REWRITE FROM SCRATCH. The confession framing is new front
matter; everything from "What we buy houses actually means" onward is Ryan's
existing 15-page Cash Buyer Beware guide carried forward, because it holds
the specifics that make the guide worth downloading (the $300k math, the five
questions, the seven red flags, the five alternative exits, NC Form 2-T
assignment consent, Garn-St. Germain). Dropping it to ship a 6-page
confession would have been a downgrade wearing a better title.

Two edits to the carried content: the banned word "leverage" appears twice in
the original and is replaced, and the wholesaling-law framing now follows
Ryan's Aug 13 direction (do not rely on a law, novations are the current
workaround).
"""

import os
from reportlab.lib.units import inch as INCH
from reportlab.lib.colors import HexColor
from reportlab.platypus import Table, TableStyle
from build_magnets import (
    build, P, H1, H2, LEAD, BULLETS, callout, CTA, Spacer, PageBreak, OUT,
    S, GOLD, CREAM2, NAVY, Paragraph,
)

CELL = S["callout"].clone("cell")
CELL.fontSize = 9
CELL.leading = 13
HEADCELL = S["calloutHead"].clone("headcell")
HEADCELL.fontSize = 8
HEADCELL.textColor = NAVY


def grid(rows, widths):
    data = [[Paragraph(c, HEADCELL if i == 0 else CELL) for c in r]
            for i, r in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), CREAM2),
        ("LINEBELOW", (0, 0), (-1, 0), 1, GOLD),
        ("LINEBELOW", (0, 1), (-1, -2), 0.4, HexColor("#E3DDD0")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


# ================================================================ MAGNET 1
home_decision = [
    H1("The gap in every retirement plan"),
    LEAD("Your advisor has a plan for the 401(k), the pension and Social "
         "Security. Almost none of them have a plan for the house."),
    P("Sit down with a good financial planner and they will map your 401(k), "
      "your Social Security, your pension and your spending for the next "
      "thirty years. It is careful work and it matters. But look at what is "
      "usually missing from the picture: the house. For most families it is "
      "the single biggest asset they own, and it is the one nobody has a "
      "plan for."),
    P("That is not the planner's fault. Financial advisors do not touch real "
      "estate. Real estate agents mostly know one move, which is to list it. "
      "The senior care world does not do money. So the biggest asset in the "
      "plan falls in the crack between three professionals, and it stays "
      "there until a fall, a diagnosis or a stack of bills forces a "
      "decision."),
    P("Then it gets made fast, under pressure, by people who are exhausted. "
      "That is the most expensive way to make any decision, and right now it "
      "is the default."),
    P("You can make this call early instead, calmly, while nothing is "
      "forcing your hand. That is the entire purpose of this guide. Not to "
      "tell you what to do with the house, but to make sure you have seen "
      "the whole board before somebody else moves a piece of it for you."),
    callout("WHAT THIS GUIDE IS NOT", [
        "This is education, not advice for your specific family, and it is "
        "not legal, tax or financial advice. Every family's numbers and "
        "health picture are different, and the tax points in particular are "
        "worth confirming with a CPA who can look at your actual return.",
    ]),
    PageBreak(),

    H1("The five doors"),
    P("There is never just sell or do not sell. There are five real doors, "
      "and the right one depends on health, money and what the family "
      "actually wants. Most families only ever hear about the first one, "
      "from the only professional who gets paid when they walk through it."),
    H2("1. Sell now, cleanly"),
    P("The simplest door, and often the right one, particularly while the "
      "tax treatment is still in your favor. The question is not who offers "
      "the highest number. It is what nets the most after the work, the "
      "fees, the carrying costs and the time. A lower offer with fewer "
      "repairs and a faster close can beat a higher one that needs thirty "
      "thousand dollars of work first."),
    H2("2. Right-size"),
    P("Sell the big house, buy or rent something smaller and safer, and put "
      "the difference to work. This is the door most people actually want "
      "and the one fewest plan for in time. It works best chosen early, "
      "because it depends on being well enough to move by choice rather "
      "than by ambulance."),
    H2("3. Age in place"),
    P("Stay, and modify the home for safety. This can absolutely be the "
      "right call. Run the real number first: the modifications themselves, "
      "the in-home care that usually follows, and the ongoing cost of a "
      "house that keeps asking for money. Those three add up faster than "
      "families expect, and they tend to arrive together."),
    H2("4. Keep it and rent it"),
    P("Turn the house into income. It can work. Run the honest net rather "
      "than the sticker rent: after management, taxes, insurance, a real "
      "repair reserve and vacancy, a rent check is a good deal smaller than "
      "it looks, and one aging roof can erase a year of it. Renting also "
      "starts a tax clock, which is the next section."),
    H2("5. Creative and owner financing"),
    P("For the right family, selling on terms can beat a cash sale, and "
      "there are legitimate cash options too. These are the advanced doors. "
      "They need somebody who knows all five well enough to say honestly "
      "whether one of them actually fits, rather than steering you to the "
      "one they happen to sell."),
    PageBreak(),

    H1("The five doors at a glance"),
    P("A rough shape of each door. The numbers that matter are your own, and "
      "this is the grid to take to the professionals who can price them."),
    Spacer(1, 0.08 * INCH),
    grid([
        ["Door", "Fits when", "Watch for"],
        ["Sell now",
         "The house has to fund care, or the tax window is open and closing.",
         "Net after repairs, fees and carrying cost, not the headline offer."],
        ["Right-size",
         "Health is good enough to move by choice, and the house is too much.",
         "Where the difference actually goes once it is freed up."],
        ["Age in place",
         "Staying is the priority and the home can be made safe.",
         "Modifications plus in-home care plus upkeep, added together."],
        ["Rent it",
         "No need for the lump sum, and somebody will genuinely manage it.",
         "Net after vacancy and reserves. It also starts a tax clock."],
        ["Terms or owner finance",
         "Full price matters more than speed, and monthly income helps.",
         "Needs an attorney who has actually drafted these before."],
    ], [1.15 * INCH, 2.5 * INCH, 2.75 * INCH]),
    PageBreak(),

    H1("The two windows that close"),
    P("Waiting has a price, and two pieces of it are hiding in the tax code. "
      "Neither is something you should have to know. That is exactly the "
      "point. They are worth real money, and they quietly reward the family "
      "that looked early."),
    H2("The home sale exclusion"),
    P("If the home has been the main residence for two of the last five "
      "years, a large share of the gain on a sale is likely to be excluded "
      "from tax. Rent the house out or wait long enough and that window "
      "winds down, so a sale that would have been nearly tax free starts "
      "being taxed."),
    P("The numbers and the edge cases genuinely matter here, and they turn "
      "on details specific to your family. Confirm them with a CPA. The "
      "direction of travel is the part worth carrying with you: this window "
      "closes with time, and it closes quietly."),
    H2("The step up in basis"),
    P("How the house is titled, and what happens at death, changes the tax "
      "picture dramatically for whoever inherits it. This is a titling and "
      "estate question rather than a will question, and a great many "
      "families discover far too late that those are two different things."),
    P("Confirm this one with a CPA and an estate attorney together, because "
      "the answer depends on how the deed actually reads today, not on what "
      "anyone remembers being decided years ago. Pull the deed and look. It "
      "is a twenty minute job and it is the single highest value twenty "
      "minutes in this guide."),
    callout("THE TWENTY MINUTE VERSION", [
        "Find the deed and read exactly how the owners are named on it.",
        "Write down when the home last served as the primary residence.",
        "Take both to a CPA and ask what each of the five doors would cost "
        "in tax. You are not asking them to choose. You are asking them to "
        "price the options while all five are still open.",
    ]),
    PageBreak(),

    H1("The one question"),
    LEAD("Does the house need to be the thing that pays for care, or is it "
         "the thing you want to protect and pass on?"),
    P("Strip all of it away and the decision comes down to that. Income and "
      "savings answer it, and the answer points at the right door."),
    P("If the house has to fund care, then net proceeds and timing are "
      "everything, and doors one and two move to the front. If the house is "
      "meant to be protected and passed on, the titling and the step up "
      "matter more than the sale price, and the conversation changes shape "
      "entirely."),
    P("Families who ask that question early get to choose their door. "
      "Families who wait until a crisis get whichever door is closest, and "
      "it is usually the one with somebody standing in it holding a "
      "contract."),
    H2("What to do with this"),
    P("You do not need to decide today. You need to have looked at the whole "
      "board before somebody else forces a piece of it."),
    P("Pull the deed. Write down the dates. Ask a CPA to price the doors. "
      "Have the conversation with your family while it is still a "
      "conversation rather than a reaction."),
    Spacer(1, 0.12 * INCH),
    CTA([
        "IF YOU WANT A SECOND SET OF EYES",
        "Ryan works with families on exactly this decision, from someone who "
        "has been on both sides of the table and makes nothing on whether "
        "your family sells or stays. He is a licensed North Carolina broker "
        "who never takes the listing himself.",
        "<b>Get Ryan in your corner:</b> "
        "rigginsstrategicsolutions.com/work-with-ryan",
        "<b>Not ready to talk yet?</b> The Family Readiness Score is a short "
        "self check, at no added cost: "
        "rigginsstrategicsolutions.com/tools/family-readiness-score",
    ]),
]

# ================================================================ MAGNET 2
confessions = [
    H1("I used to be the letter"),
    LEAD("For about eight years I bought houses from families in exactly the "
         "spot yours may be in."),
    P("I sent the letters. I wrote the cash offers. I sat at kitchen tables "
      "and learned, in detail, how to move a person who is tired, grieving "
      "and just wants it to be over. I was good at it."),
    P("I bought those houses for around 60 cents on the dollar. That was the "
      "math. That was the business."),
    P("Then I watched it happen to my own family, and I could not do it "
      "anymore. So I switched sides, and now I protect families from the guy "
      "I used to be."),
    P("None of what follows is illegal. Most of it is not even dishonest, "
      "exactly. It is a machine built to buy a house for less than it is "
      "worth from somebody who does not have the time or the information to "
      "push back. Here is how the machine works, so that it stops working on "
      "your family."),
    P("Read it. Share it with your siblings. Read it again the day a we buy "
      "houses guy shows up at Mom's door. The point is not to scare you. The "
      "point is to make sure you walk into the conversation with the same "
      "information he has."),
    PageBreak(),

    H1("What we buy houses actually means"),
    P("A sign in the yard. A postcard in the mail. A robocall to Mom's "
      "landline. A guy who knocks at 6 PM on a Tuesday because he drove by "
      "and noticed the house. These all come from the same world. It is "
      "called wholesaling."),
    P("A wholesaler does not usually buy houses with their own money. They "
      "find a motivated seller, usually an older homeowner in some kind of "
      "crisis, get them to sign a contract at 50 to 70 percent of fair "
      "market value, and then sell that contract to an investor for a fee."),
    P("The wholesaler walks away with $5,000 to $25,000 for putting the deal "
      "together. The investor walks away with a property at 30 to 50 percent "
      "below market. The seller walks away with cash, but a lot less than "
      "the house was worth."),

    H1("The math"),
    P("Say Mom's house is worth $300,000 in a normal retail sale. Here is "
      "what each path pays out."),
    Spacer(1, 0.06 * INCH),
    grid([
        ["", "Traditional MLS sale", "Cash buyer or wholesaler"],
        ["Timeline", "3 to 6 months", "7 to 14 days"],
        ["Price", "$300,000", "$180,000 to $210,000 (60 to 70% of market)"],
        ["Commission", "$15,000 to $18,000 (5 to 6%)", "None"],
        ["Closing costs", "$3,000 to $5,000", "Usually covered by buyer"],
        ["<b>Net to Mom</b>", "<b>$277,000 to $282,000</b>",
         "<b>$180,000 to $210,000</b>"],
    ], [1.0 * INCH, 2.3 * INCH, 3.1 * INCH]),
    Spacer(1, 0.1 * INCH),
    P("<b>The difference is $67,000 to $102,000 in lost equity.</b> That is "
      "a year of memory care. That is the down payment on a smaller home she "
      "actually wants. That is the inheritance the family was counting on."),
    P("Everybody in that second column wins. Except Mom."),
    PageBreak(),

    H1("Confession 1: The letter is a costume"),
    P("The postcard that looks hand addressed. The note that says I would "
      "love to buy your home in the neighborhood. The urgent cash, any "
      "condition, close in seven days."),
    P("All of it is designed to feel personal and to feel fast. It is "
      "neither. It is a mass mailing to a list of houses that look like the "
      "owner might be older, tired, or behind on something. The warmth is "
      "the hook, and it is printed by the thousand."),
    P("That does not make every letter a trap. It means the letter tells you "
      "nothing about the person who sent it, so you have to find that out "
      "yourself. The rest of this guide is how."),

    H1("Confession 2: Two words mean they are not buying anything"),
    P("Look for the words <b>and/or assigns</b> next to the buyer's name on "
      "any contract."),
    P("Those two words mean the contract can be sold to somebody else. A "
      "large share of the people sending letters are not buyers at all. They "
      "put your parents' house under contract cheap, then sell that contract "
      "to a real investor for more, and the gap between the two numbers is "
      "their payday."),
    P("Your family never meets the real buyer and never sees the spread. It "
      "comes straight out of your pocket."),

    H1("Confession 3: The re-trade is scheduled"),
    P("They get you to sign at a number that sounds acceptable. Then, during "
      "the inspection or due diligence period, they come back with a page of "
      "problems: the foundation, the roof, the electrical. And a lower "
      "price."),
    P("They are betting you are tired enough to take it. The lower price was "
      "the plan from the beginning. The first number was bait, chosen to end "
      "your search rather than to be paid."),
    P("The tell is timing. A real buyer raises concerns early, because they "
      "want to know what they are buying. A re-trade arrives late, once you "
      "have told the family it is handled and stopped talking to anybody "
      "else."),
    PageBreak(),

    H1("Confession 4: The scary repairs are theater"),
    P("You have got foundation issues. This roof will not pass."),
    P("Most of the time those are cosmetic settling cracks and a roof with "
      "years left in it, named on purpose to justify a lowball. A real "
      "inspection and two real bids make the theater fall apart, which is "
      "precisely why the machine moves fast enough that you never get one."),
    P("You do not need to know whether the crack matters. You need one "
      "independent inspector and two written bids. The theater cannot "
      "survive either of them."),

    H1("Confession 5: Speed is the weapon"),
    P("A seven day close is not a convenience being offered to you. It is "
      "the whole game."),
    P("Speed is what keeps you from getting a second opinion, comparing a "
      "real offer, or having an attorney read a one page contract. Nothing "
      "good in a home sale has to happen in seven days. The rush is the "
      "tell, every time."),
    callout("THE ONE RULE THAT COVERS ALL FIVE", [
        "Nothing gets signed on the first visit. Not a contract, not a "
        "letter of intent, not a piece of paper described as just a "
        "formality. Every tactic in this guide depends on speed, and every "
        "one of them fails against a family that will not be hurried.",
    ]),
    PageBreak(),

    H1("The four second version"),
    P("If somebody is standing in the doorway right now and you only have a "
      "moment, ask these four. A real buyer answers all of them in about "
      "four seconds each. A wholesaler dodges at least two, and the dodge "
      "is the answer."),
    *BULLETS([
        "Are you the end buyer, or will you assign this to somebody else?",
        "Can you send proof of funds today?",
        "What is your company, and how long have you been buying in this "
        "area?",
        "If an inspection comes back clean, does the price hold?",
    ]),
    Spacer(1, 0.06 * INCH),
    P("Then three things, in order. Get two or three offers, so that a "
      "lowball becomes obvious by comparison. Compare the net rather than "
      "the headline number. And never sign a short contract without a real "
      "estate attorney reading it first."),
    P("The next section is the longer version of the same idea, for when "
      "you have more than a moment."),
    PageBreak(),

    H1("The five questions to ask before Mom signs anything"),
    P("If a buyer, or a buyer's representative, is in Mom's living room "
      "right now, these are the five questions that change the outcome."),
    H2("1. Are you the actual buyer, or are you putting this under contract "
       "to sell to someone else?"),
    P("This is the wholesaler test. A real buyer says yes. A wholesaler says "
      "something like I work with a group of investors, or I represent a "
      "buyer. If they are a wholesaler, the price on the table has at least "
      "$10,000 to $20,000 of their fee built into it."),
    P("<b>What to do:</b> ask them to introduce you directly to the actual "
      "buyer. They probably will not. That is information."),
    H2("2. What is the assignment fee on this contract?"),
    P("The assignment fee is the wholesaler's cut. Some will tell you. Most "
      "dodge, and the dodge is also information. The fee is built into the "
      "price being offered."),
    P("<b>What to do:</b> if they admit to a $15,000 fee on a $200,000 "
      "offer, ask whether Mom can save that $15,000 by selling directly to "
      "the investor instead."),
    H2("3. Can I get a copy of this contract to review with a lawyer before "
       "I sign anything?"),
    P("This is the question that ends most wholesaler deals. If the answer "
      "is the offer is only good if you sign tonight, or we have to move "
      "fast or we lose the funding, that is not a real estate transaction. "
      "Real buyers wait 24 to 48 hours for review. Wholesalers cannot, "
      "because their math falls apart the moment you compare options."),
    P("<b>What to do:</b> if they refuse, walk them to the door and tell "
      "them you will be in touch once a lawyer has looked at it."),
    PageBreak(),

    H2("4. How many different buyers have approached the house this week?"),
    P("This is the anchoring trap, and it is the one most families never see "
      "coming. Wholesaler A shows up Monday and offers $150,000. Mom says "
      "no. Wednesday, Wholesaler B shows up, different name, different LLC, "
      "and offers $130,000. Friday, Wholesaler A calls back: the $150,000 is "
      "still on the table if you decide today."),
    P("Suddenly $150,000 sounds like a good deal. Mom signs. The house was "
      "worth $300,000."),
    P("Your brain compares numbers to other nearby numbers, not to the true "
      "value of the thing being sold. Sometimes these are literally the same "
      "operation behind different business cards. Sometimes they are "
      "competing wholesalers hitting the same seller. Either way the math "
      "works out the same."),
    P("<b>What to do:</b>"),
    *BULLETS([
        "If two or more buyers have approached in the same week, slow "
        "everything down and sign nothing for at least seven days.",
        "Never tell any buyer what the others offered. It will be used "
        "against you.",
        "Get a real estate agent unconnected to any of them to run a "
        "comparative market analysis. It takes about thirty minutes and it "
        "tells you what the house is actually worth at retail.",
        "Compare the offers to real market value, not to each other.",
        "Look each LLC up on the NC Secretary of State business search at "
        "sosnc.gov, which is free. Shared registered agents mean one "
        "operator with several business cards, not separate buyers.",
    ]),
    PageBreak(),

    H2("5. What happens if Mom needs to back out after she signs?"),
    P("A real buyer references contingencies, inspections, and an earnest "
      "money deposit that is genuinely at risk for them. A wholesaler "
      "references releasing you from the contract for a fee, or keeping the "
      "earnest money. On these deals that deposit is usually $500 to $2,000, "
      "which is a cheap option for them to lock Mom up while they shop the "
      "contract around."),
    P("<b>What to do:</b> ask for the contingency clause in writing before "
      "anything is signed. If there is no clean cancellation window for the "
      "seller, do not sign."),

    H1("Seven red flags"),
    P("The five questions are the proactive moves. These are the defensive "
      "ones. If any of them show up, slow down."),
    *BULLETS([
        "<b>They want it done tonight.</b> Real transactions take 30 to 45 "
        "days. Tonight is a pressure tactic, not a deadline.",
        "<b>No business card with a brokerage or a registered company.</b> "
        "A phone number and a first name is a flag.",
        "<b>They walk the house without taking notes.</b> Real buyers "
        "measure rooms, photograph the electrical panel and ask the age of "
        "the roof. Five minutes of looking around means somebody else will "
        "do the real inspection.",
        "<b>They say as-is without explaining it.</b> It sounds like a "
        "favor to Mom. What it means in practice is that any condition "
        "issue becomes a reason to lower the price after signing.",
        "<b>Cash, but their own title company.</b> Real cash buyers use a "
        "neutral one. A friendly title company will process the assignment "
        "without ever flagging it to the seller.",
        "<b>They talk about renovation in the abstract.</b> A real flipper "
        "names specific work and specific costs. Vague renovation talk is "
        "how a low offer gets justified.",
        "<b>They show up unannounced more than once.</b> Real buyers "
        "schedule. Repeat door-knocking is an attempt to catch Mom when "
        "nobody else is there to ask questions.",
    ]),
    PageBreak(),

    H1("Do not wait for a law to protect your family"),
    P("Some states have passed rules on wholesaling. Some have not. And "
      "where rules do exist, the people running this playbook are already "
      "working around them, most recently by restructuring deals as "
      "novations rather than assignments, so the paperwork no longer says "
      "the thing the rule prohibits."),
    P("Which is all the more reason not to wait for the law to save your "
      "family. Know the options before the cash buyer is at the kitchen "
      "table, and know what to do if he has already been there. The "
      "protection is you, slowing the whole thing down."),

    H1("What Mom does not have to settle for"),
    P("Most families think there are two choices: sell fast to a cash buyer, "
      "or list traditionally and wait six months. That is not true. There "
      "are at least five other ways to sell a house, and most families "
      "qualify for more than one."),
    H2("First, get an attorney involved"),
    P("North Carolina is one of nine states that legally require an attorney "
      "to handle the closing, along with Connecticut, Delaware, Georgia, "
      "Kentucky, Massachusetts, New Hampshire, South Carolina and West "
      "Virginia. Elsewhere a title company can technically handle a basic "
      "transaction without one."),
    P("But for options 3, 4 and 5 below you need an attorney even where your "
      "state does not require it. These are not standard transactions. The "
      "wrong paperwork can put Mom on the hook for somebody else's mortgage "
      "default, create tax penalties nobody saw coming, or make a legal mess "
      "that takes years to untangle."),
    P("When interviewing attorneys for those three specifically, ask how "
      "many owner-financed, lease-option or subject-to deals they have "
      "personally drafted in the last two years. If the answer is fewer "
      "than five, find somebody else. These need someone who has done them "
      "before, not someone learning on Mom's deal."),
    PageBreak(),

    H1("The five other exits"),
    grid([
        ["Option", "Best for", "What Mom keeps, and the catch"],
        ["1. Traditional MLS sale",
         "Decent condition, no urgent timeline. 30 to 90 days.",
         "Full retail minus 5 to 6% commission. Needs showings, repairs and "
         "a market-ready house."],
        ["2. As-is MLS sale",
         "Needs work, but there is time. 30 to 60 days.",
         "Typically an 8 to 12% discount to retail, which is still far "
         "above a wholesaler. Smaller buyer pool."],
        ["3. Owner financing",
         "Houses around $300k and up, where all cash up front is not needed.",
         "Full retail or better, paid monthly over 3 to 7 years, and income "
         "while she is in care. Mom acts as the bank."],
        ["4. Lease-option",
         "A down market, or she is not ready to give up ownership.",
         "Rent plus an option fee plus a future sale at an agreed price. "
         "She still owns it until the option is exercised. Tax "
         "implications."],
        ["5. Subject-to",
         "A mortgage she cannot keep paying, often foreclosure-adjacent.",
         "Walk-away money plus the mortgage payoff. The loan stays in her "
         "name, so only with a vetted buyer holding real reserves. See "
         "Garn-St. Germain, 12 USC 1701j-3."],
    ], [1.35 * INCH, 1.95 * INCH, 3.1 * INCH]),
    PageBreak(),

    H1("If Mom already signed"),
    P("If you are reading this after a contract has been signed, do not "
      "panic and do not assume it is finished. Here is what to check."),
    H2("Check 1: Is there a cancellation window?"),
    P("Read the contract for sections labelled right of rescission, "
      "cancellation, termination or contingencies. If there is a window, "
      "there may be 24 to 72 hours to back out without penalty. North "
      "Carolina gives some buyers a three day rescission period on certain "
      "contracts; the same protections do not always run to the seller "
      "side, but contracts can include them."),
    H2("Check 2: What is the closing date?"),
    P("Most of these close 7 to 30 days after signing. If closing is more "
      "than seven days out there is time to get a real agent involved, "
      "order an appraisal to compare the price against real value, talk to "
      "a real estate attorney, and find out whether the contract is being "
      "assigned."),
    H2("Check 3: Was anything signed under duress?"),
    P("Duress is a legal term. If Mom signed because she was frightened, "
      "confused, sleep-deprived or rushed, an attorney may be able to argue "
      "the contract is invalid. This is not a do-it-yourself situation. If "
      "you suspect it, call a real estate attorney within 24 hours."),
    H2("Check 4: Was Mom of sound mind?"),
    P("If she has been diagnosed with dementia, Alzheimer's or any "
      "cognitive impairment, she may not have had the legal capacity to "
      "enter a real estate contract. A doctor's note or a recent assessment "
      "can void it."),
    PageBreak(),

    H2("Check 5: Was the contract assigned without her written consent?"),
    P("This one is the big one, and most families have never heard of it."),
    P("The standard North Carolina Offer to Purchase and Contract, Form "
      "2-T, used by NC Realtors, includes language requiring the written "
      "consent of all parties before the contract can be assigned to a "
      "different buyer. If Mom signed that standard form and the wholesaler "
      "then quietly sold the contract on without her signed consent, the "
      "assignment may not be enforceable."),
    P("Find the section about assignment, succession or binding effect. If "
      "it requires written consent of both parties, and the closing "
      "documents show a different buyer than the person Mom actually dealt "
      "with, there may be grounds to challenge the deal."),
    callout("THE CRITICAL CAVEAT", [
        "Wholesalers often skip the standard form and use their own "
        "contract that explicitly grants the right to assign. If Mom signed "
        "something saying the buyer reserves the right to assign this "
        "contract to any party at any time, then the assignment is legal. "
        "The protection only exists if she signed a contract that required "
        "her consent.",
        "This is exactly why an attorney needs to read it. They can tell "
        "you in fifteen minutes whether the assignment was valid. If it was "
        "not, you have room to renegotiate or to walk away.",
    ]),
    P("These rules apply in other states too, but the specific language "
      "varies. An attorney where Mom lives will know the local version."),
    PageBreak(),

    H1("The bottom line"),
    P("Here is what I want you to remember when you close this guide."),
    *BULLETS([
        "Cash buyers and wholesalers pay 50 to 70 percent of market value. "
        "That is the math, and it does not change because the person is "
        "friendly.",
        "Five questions stop most of these deals before anyone gets hurt.",
        "There are at least five other ways to sell a house. Mom does not "
        "have to take the first offer.",
        "Pressure tactics are not real estate. Real buyers wait. Real "
        "buyers welcome legal review.",
        "If Mom already signed, there may still be options. Check the "
        "contract, check the timeline, call an attorney.",
    ]),
    Spacer(1, 0.06 * INCH),
    P("The wholesaler at the door is not evil. He is running a business. "
      "The business just happens to require seniors to make uninformed "
      "decisions under time pressure."),
    P("You can break that business model inside your own family just by "
      "knowing the questions to ask. That is the whole game. It is also why "
      "I stopped."),
    Spacer(1, 0.12 * INCH),
    CTA([
        "IF A LETTER OR A DECISION FEELS RUSHED",
        "That is exactly the moment for a second set of eyes. Ryan is a "
        "licensed North Carolina broker who never takes the listing "
        "himself, and he is paid by the agent rather than by your family, "
        "at no added cost to you.",
        "<b>Get Ryan in your corner:</b> "
        "rigginsstrategicsolutions.com/work-with-ryan",
    ]),
]

os.makedirs(OUT, exist_ok=True)
p1 = build(os.path.join(OUT, "home-decision.pdf"),
           "The Home Decision Every Retirement Plan Forgets",
           ("The Home Decision Every Retirement Plan Forgets",
            "Your advisor planned the 401(k). Nobody planned the house.",
            "“The biggest asset most families own is the one nobody "
            "made a plan for.”",
            "A planning guide for families deciding what happens to the "
            "home, before a crisis decides it for them."),
           home_decision)

p2 = build(os.path.join(OUT, "cash-buyer-beware.pdf"),
           "Confessions of a Former Cash Buyer",
           ("Confessions of a Former Cash Buyer",
            "I sent those letters for eight years. Here is the playbook.",
            "“I wrote the cash offers. Then I switched sides.”",
            "A protection guide for families facing a senior home sale, "
            "written from inside the machine."),
           confessions)

from pypdf import PdfReader
for p in (p1, p2):
    print(f"{os.path.basename(p)}: {len(PdfReader(p).pages)} pages, "
          f"{os.path.getsize(p) // 1024} KB")
