"""
Build the two Build 6 lead-magnet PDFs in the existing magnet house style.

House style reverse-engineered from public/downloads/cash-buyer-beware.pdf:
Lora serif body, Work Sans for eyebrows and running heads, branded cover,
running header (TITLE left / Riggins Strategic Solutions right), and a
licence footer with page numbers. Brand colors are the real tokens from
src/app/globals.css, not approximations.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    PageBreak, KeepTogether, Table, TableStyle, NextPageTemplate,
)

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
OUT = "/Users/rigginsstrategicsolutions/Projects/rss-site/public/downloads"

# Brand tokens, lifted verbatim from globals.css
BURGUNDY = HexColor("#6B1F2E")
GOLD     = HexColor("#C9A961")
CREAM    = HexColor("#FAF8F4")
CREAM2   = HexColor("#EFE9DA")
INK      = HexColor("#2D2A24")
NAVY     = HexColor("#1B2A4E")
MUTED    = HexColor("#8A8478")

for name, f in [
    ("Lora", "Lora-400.ttf"), ("Lora-Bold", "Lora-700.ttf"),
    ("Lora-Italic", "Lora-400i.ttf"), ("Lora-BoldItalic", "Lora-700i.ttf"),
    ("WorkSans", "WorkSans-400.ttf"), ("WorkSans-Bold", "WorkSans-700.ttf"),
]:
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONTS, f)))
pdfmetrics.registerFontFamily(
    "Lora", normal="Lora", bold="Lora-Bold",
    italic="Lora-Italic", boldItalic="Lora-BoldItalic",
)

LICENCE = ("Ryan Riggins · NC Real Estate License #361546 · eXp Realty "
           "· rigginsstrategicsolutions.com")

S = {
    "h1": ParagraphStyle("h1", fontName="Lora-Bold", fontSize=19, leading=24,
                         textColor=BURGUNDY, spaceBefore=2, spaceAfter=10),
    "h2": ParagraphStyle("h2", fontName="Lora-Bold", fontSize=13.5, leading=18,
                         textColor=NAVY, spaceBefore=15, spaceAfter=6),
    "body": ParagraphStyle("body", fontName="Lora", fontSize=10.5, leading=16.5,
                           textColor=INK, spaceAfter=9, alignment=TA_LEFT),
    "lead": ParagraphStyle("lead", fontName="Lora-Italic", fontSize=11.5,
                           leading=18, textColor=BURGUNDY, spaceAfter=12),
    "bullet": ParagraphStyle("bullet", fontName="Lora", fontSize=10.5,
                             leading=16, textColor=INK, spaceAfter=6,
                             leftIndent=16, bulletIndent=4),
    "eyebrow": ParagraphStyle("eyebrow", fontName="WorkSans-Bold", fontSize=8,
                              leading=12, textColor=GOLD, spaceAfter=6),
    # Cover
    "ctitle": ParagraphStyle("ctitle", fontName="Lora-Bold", fontSize=34,
                             leading=40, textColor=BURGUNDY,
                             alignment=TA_CENTER, spaceAfter=14),
    "csub": ParagraphStyle("csub", fontName="Lora", fontSize=14, leading=21,
                           textColor=INK, alignment=TA_CENTER, spaceAfter=26),
    "cbyline": ParagraphStyle("cbyline", fontName="WorkSans-Bold", fontSize=11,
                              leading=15, textColor=NAVY,
                              alignment=TA_CENTER, spaceAfter=3),
    "corg": ParagraphStyle("corg", fontName="WorkSans-Bold", fontSize=8.5,
                           leading=13, textColor=GOLD, alignment=TA_CENTER,
                           spaceAfter=24),
    "cquote": ParagraphStyle("cquote", fontName="Lora-Italic", fontSize=12,
                             leading=19, textColor=BURGUNDY,
                             alignment=TA_CENTER, spaceAfter=8),
    "cfoot": ParagraphStyle("cfoot", fontName="WorkSans", fontSize=8.5,
                            leading=13, textColor=MUTED,
                            alignment=TA_CENTER, spaceAfter=2),
    "callout": ParagraphStyle("callout", fontName="Lora", fontSize=10.5,
                              leading=16, textColor=INK, spaceAfter=0),
    "calloutHead": ParagraphStyle("calloutHead", fontName="WorkSans-Bold",
                                  fontSize=8.5, leading=13, textColor=BURGUNDY,
                                  spaceAfter=5),
}


def callout(head, body_lines):
    """Cream panel with a gold left rule. Used for the do-this-now blocks."""
    inner = [Paragraph(head, S["calloutHead"])]
    for ln in body_lines:
        inner.append(Paragraph(ln, S["callout"]))
        inner.append(Spacer(1, 5))
    t = Table([[inner]], colWidths=[6.4 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CREAM2),
        ("LINEBEFORE", (0, 0), (0, -1), 3, GOLD),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t


class Magnet(BaseDocTemplate):
    def __init__(self, path, running_title, **kw):
        super().__init__(path, pagesize=letter,
                         leftMargin=0.95 * inch, rightMargin=0.95 * inch,
                         topMargin=1.0 * inch, bottomMargin=0.9 * inch, **kw)
        self.running_title = running_title
        frame = Frame(self.leftMargin, self.bottomMargin,
                      self.width, self.height, id="body")
        self.addPageTemplates([
            PageTemplate(id="cover", frames=[frame], onPage=self._cover_bg),
            PageTemplate(id="body", frames=[frame], onPage=self._chrome),
        ])

    def _cover_bg(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(CREAM)
        canvas.rect(0, 0, letter[0], letter[1], stroke=0, fill=1)
        canvas.setStrokeColor(GOLD)
        canvas.setLineWidth(3)
        canvas.line(0, letter[1] - 22, letter[0], letter[1] - 22)
        canvas.restoreState()

    def _chrome(self, canvas, doc):
        canvas.saveState()
        w, h = letter
        # running header
        canvas.setFont("WorkSans-Bold", 7.5)
        canvas.setFillColor(GOLD)
        canvas.drawString(0.95 * inch, h - 0.62 * inch,
                          self.running_title.upper())
        canvas.setFillColor(MUTED)
        canvas.drawRightString(w - 0.95 * inch, h - 0.62 * inch,
                               "Riggins Strategic Solutions")
        canvas.setStrokeColor(GOLD)
        canvas.setLineWidth(0.6)
        canvas.line(0.95 * inch, h - 0.72 * inch, w - 0.95 * inch, h - 0.72 * inch)
        # footer
        canvas.setStrokeColor(HexColor("#E3DDD0"))
        canvas.line(0.95 * inch, 0.72 * inch, w - 0.95 * inch, 0.72 * inch)
        canvas.setFont("WorkSans", 7)
        canvas.setFillColor(MUTED)
        canvas.drawString(0.95 * inch, 0.56 * inch, LICENCE)
        canvas.drawRightString(w - 0.95 * inch, 0.56 * inch,
                               "Page %d" % (doc.page - 1))
        canvas.restoreState()


def cover(title, subtitle, quote, descriptor):
    return [
        Spacer(1, 1.5 * inch),
        Paragraph(title, S["ctitle"]),
        Paragraph(subtitle, S["csub"]),
        Spacer(1, 0.3 * inch),
        Paragraph("Ryan Riggins", S["cbyline"]),
        Paragraph("RIGGINS STRATEGIC SOLUTIONS", S["corg"]),
        Paragraph(quote, S["cquote"]),
        Spacer(1, 0.9 * inch),
        Paragraph(descriptor, S["cfoot"]),
        Spacer(1, 0.18 * inch),
        Paragraph("NC Real Estate License #361546 · eXp Realty", S["cfoot"]),
        Paragraph("rigginsstrategicsolutions.com", S["cfoot"]),
        # Without this every page keeps using the cover template, which
        # silently drops the running header and, more importantly, the
        # licence footer that has to appear on each page.
        NextPageTemplate("body"),
        PageBreak(),
    ]


def build(path, running_title, cover_args, blocks):
    doc = Magnet(path, running_title)
    story = cover(*cover_args)
    story.append(Paragraph("", ParagraphStyle("x")))
    for b in blocks:
        story.append(b)
    doc.build(story)
    return path


def P(t):
    return Paragraph(t, S["body"])


def H2(t):
    return Paragraph(t, S["h2"])


def H1(t):
    return Paragraph(t, S["h1"])


def LEAD(t):
    return Paragraph(t, S["lead"])


def BULLETS(items):
    return [Paragraph(i, S["bullet"], bulletText="•") for i in items]


def CTA(lines):
    inner = [Paragraph(lines[0], S["calloutHead"])]
    for ln in lines[1:]:
        inner.append(Paragraph(ln, S["callout"]))
        inner.append(Spacer(1, 5))
    t = Table([[inner]], colWidths=[6.4 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), HexColor("#F5E1E6")),
        ("LINEBEFORE", (0, 0), (0, -1), 3, BURGUNDY),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t
