"""
The Family Meeting Agenda: the printable worksheet the book points to.

The Senior Transition (Ryan Riggins, 2026), Chapter 7, tells readers a
fill-in-the-blank version of its agenda is at
rigginsstrategicsolutions.com/book/family-meeting. That short link forwards
to /g/family-meeting-agenda, which delivers this PDF. Copy is carried from
the locked Chapter 7 text (the four steps, the five-part agenda, the "I"
statement swaps, good vs bad next steps); the blanks are new.

Run:  cd scripts/lead-magnets && python3 content_family_meeting.py
"""

import os
from reportlab.lib.units import inch as INCH
from reportlab.lib.colors import HexColor
from reportlab.platypus import Table, TableStyle, KeepTogether
from build_magnets import (
    build, P, H1, H2, LEAD, BULLETS, callout, CTA, Spacer, PageBreak, OUT,
    S, GOLD, CREAM2, NAVY, MUTED, Paragraph,
)

LABEL = S["calloutHead"].clone("fmlabel")
LABEL.textColor = NAVY
HINT = S["callout"].clone("fmhint")
HINT.fontName = "Lora-Italic"
HINT.fontSize = 8.5
HINT.leading = 12
HINT.textColor = MUTED
RULE = HexColor("#CFC6B4")


def blanks(rows, widths=None, line_h=0.3):
    """Rows of (label, hint, number_of_writing_lines) as a fill-in table."""
    widths = widths or [1.9 * INCH, 4.5 * INCH]
    data, style = [], [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]
    r = 0
    for label, hint, n in rows:
        left = [Paragraph(label, LABEL)]
        if hint:
            left.append(Paragraph(hint, HINT))
        data.append([left, ""])
        style.append(("LINEBELOW", (1, r), (1, r), 0.6, RULE))
        r += 1
        for _ in range(n - 1):
            data.append(["", ""])
            style.append(("LINEBELOW", (1, r), (1, r), 0.6, RULE))
            r += 1
    # label rows grow to fit their hint; writing-line rows stay a fixed height
    heights = [None if isinstance(row[0], list) else line_h * INCH for row in data]
    t = Table(data, colWidths=widths, rowHeights=heights)
    t.setStyle(TableStyle(style))
    return t


def agenda_block(num, title, minutes, prompt, lines=3):
    head = Paragraph(f"{num}. {title} <font color='#8A8478'>({minutes} min)</font>", S["h2"])
    return [head, Paragraph(prompt, S["body"]), blanks([("Notes", "", lines)], line_h=0.3)]


family_meeting = [
    H1("Before you start"),
    LEAD("The goal of the first family meeting is not to make a final "
         "decision. It is to agree on a process for making one."),
    P("This worksheet follows Chapter 7 of <i>The Senior Transition</i>. "
      "Print one copy for the sibling pre-meeting and one for each person at "
      "the table. Fill in the blanks as you go. Nothing on these pages has to "
      "be decided today except one small next step."),
    callout("THE FOUR STEPS", [
        "<b>1. The pre-meeting.</b> Get your siblings on the same page first.",
        "<b>2. Set the agenda and the tone.</b> Send it ahead of time.",
        "<b>3. Run the meeting like a pro.</b> Parents speak first.",
        "<b>4. Close with one concrete next step.</b> A research task, "
        "not a decision.",
    ]),
    PageBreak(),
    H1("Step 1: The sibling pre-meeting"),
    P("Do this by phone, Zoom or coffee, without your parents. This is where "
      "you have the disagreement, if you need to. Your goal is to agree on "
      "the problem, not the solution."),
    blanks([
        ("Who's in", "Every sibling, and any spouse who will be in the room", 2),
        ("Our shared problem", "One sentence everyone agrees is true. "
         "Example: “Mom's safety in her house is a growing concern, "
         "and we are all worried about her.”", 3),
        ("Options we will put on the table to explore", "Not decide. "
         "Everyone's preferred answer goes here as an option to research.", 3),
    ]),
    Spacer(1, 10),
    H2("Roles"),
    blanks([
        ("Facilitator", "The calmest sibling. Keeps the agenda, does not argue a side.", 1),
        ("Note-taker", "Writes down what Mom and Dad say, word for word if possible.", 1),
        ("Who needs a reminder", "Who is most likely to get emotional, and who "
         "will gently pull them back to the script?", 1),
    ]),

    PageBreak(),
    H1("Step 2: The invitation"),
    P("How you ask is everything. This is not an intervention. Say it in your "
      "own words, but keep the key phrases: <i>together as a family</i>, "
      "<i>on the same page</i>, <i>supporting you the way you want</i>, and "
      "<i>listen to your thoughts</i>."),
    callout("WHAT TO SAY", [
        "“Mom, Dad, we were all hoping we could set aside an hour next "
        "Sunday to talk together as a family. There's nothing wrong, it's not "
        "an emergency. It's just that we all think it would be smart to be on "
        "the same page about the future. We want to make sure we're all "
        "supporting you in the way you want to be supported. We'd like to just "
        "listen to your thoughts and make sure we understand your priorities.”",
    ]),
    Spacer(1, 12),
    H2("The meeting"),
    blanks([
        ("Date and time", "One hour, and say so.", 1),
        ("Place", "Their living room is usually best. Not a restaurant, not "
         "one of the kids' houses.", 1),
        ("Purpose (read this out loud to open)", "To listen to each other and "
         "start a conversation about how we can best support each other in the "
         "years to come.", 2),
    ]),
    Spacer(1, 8),
    P("<b>Send the next page to everyone ahead of time.</b> People don't fear "
      "the conversation. They fear not knowing what's in it."),

    PageBreak(),
    H1("Family Meeting Agenda"),
    *agenda_block(1, "Opening", 5,
                 "Acknowledging our love and respect for Mom and Dad. The "
                 "facilitator reads the purpose and says something from the heart.", 2),
    *agenda_block(2, "Mom and Dad's perspective", 20,
                 "What's working well right now? What are some of the "
                 "challenges? <b>Then listen.</b> Don't interrupt, don't "
                 "correct, don't offer solutions. Ask, “Can you tell me "
                 "more about that?”", 4),
    *agenda_block(3, "Our perspective", 15,
                 "Sharing our hopes and concerns for the family's future, "
                 "using “I” statements.", 2),
    *agenda_block(4, "Brainstorming", 15,
                 "What are all the possible options for the future? No bad "
                 "ideas. Write every one down.", 2),
    *agenda_block(5, "Next step", 5,
                 "Agreeing on one small, concrete action to take next.", 2),

    PageBreak(),
    H1("Step 3: In the room"),
    H2("“I” statements, not “you” statements"),
    P("An “I” statement claims your own feeling. A “you” "
      "statement casts blame."),
    callout("INSTEAD OF THIS, SAY THIS", [
        "<b>Don't say:</b> “You're not eating right. Your fridge is always empty.”",
        "<b>Do say:</b> “I feel worried when I think about you not having "
        "regular, hot meals. It would give me peace of mind to know you're "
        "eating well.”",
        "<b>Don't say:</b> “You need to stop driving at night. It's not safe.”",
        "<b>Do say:</b> “I get a knot in my stomach when I know you're "
        "driving home in the dark, because I'm scared of something happening "
        "to you.”",
    ]),
    Spacer(1, 6),
    blanks([("My “I” statement", "Write yours before the meeting.", 3)]),
    Spacer(1, 6),
    H2("The brainstorm list"),
    P("Staying in the house. A condo. Moving in with one of the kids. A "
      "granny pod in the backyard. Assisted living. A live-in caregiver. "
      "Write it all down. This is not the time to debate."),
    blanks([("Every idea", "", 6)]),

    PageBreak(),
    H1("Step 4: One concrete next step"),
    LEAD("A meeting without a clear action item is just a therapy session."),
    P("The next step should be a research task, not a decision. Low stakes, "
      "focused on gathering information."),
    callout("GOOD NEXT STEPS", [
        "Two of us spend the next two weeks gathering basic information on "
        "options A and B: brochures and cost estimates. We review them at our "
        "next chat in a month.",
        "For the next month, we hire a landscaping service to take the yard "
        "work off Dad's plate, and see how it feels.",
        "We have a home safety assessment done and get a report of "
        "suggestions. We don't have to act on any of them.",
    ]),
    Spacer(1, 6),
    callout("NEXT STEPS THAT BACKFIRE", [
        "“We're touring the assisted living place Saturday.” Too fast, too big a leap.",
        "“Dad, you need to call a realtor this week.” A command, not a collaboration.",
        "“We'll talk again when someone has more information.” Too vague, no one owns it.",
    ]),
    Spacer(1, 4),
    blanks([
        ("Our one next step", "", 2),
        ("Who owns it", "", 1),
        ("By when", "", 1),
        ("Our next family check-in", "Date and time", 1),
    ]),
    Spacer(1, 10),
    P("Close by thanking your parents for their courage and openness. "
      "<b>The goal of the first meeting isn't to get a ‘yes.’ It's "
      "to get to the next meeting.</b>"),
    Spacer(1, 6),
    CTA([
        "WHEN YOU WANT A SECOND SET OF EYES",
        "Every tool from the book, chapter by chapter: "
        "rigginsstrategicsolutions.com/book",
        "Talk it through with Ryan on a 30-minute call: "
        "rigginsstrategicsolutions.com/book/call",
    ]),
]

os.makedirs(OUT, exist_ok=True)
path = build(os.path.join(OUT, "family-meeting-agenda.pdf"),
             "The Family Meeting Agenda",
             ("The Family Meeting Agenda",
              "A fill-in-the-blank worksheet for the conversation every "
              "family dreads, and how to make it go well.",
              "“The goal of the first meeting isn't to get a "
              "‘yes.’ It's to get to the next meeting.”",
              "From The Senior Transition by Ryan Riggins, Chapter 7."),
             family_meeting)

from pypdf import PdfReader
print(f"{os.path.basename(path)}: {len(PdfReader(path).pages)} pages, "
      f"{os.path.getsize(path) // 1024} KB")
