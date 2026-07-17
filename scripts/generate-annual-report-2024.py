#!/usr/bin/env python3
"""
Deterministic generator for the HPG 2024 Preliminary & Unaudited Annual
Financial Report PDF.

Run:
    python3 scripts/generate-annual-report-2024.py

Output:
    public/reports/HPG_2024_Preliminary_Annual_Financial_Report.pdf

All figures are the verified public-facing 2024 dataset provided by HPG
management. This report is preliminary and unaudited. It is not an
independent accountant's report and is not a substitute for an IRS
Form 990-series filing, a state filing, or a bank statement.
"""
from __future__ import annotations

import os
from pathlib import Path
from datetime import datetime, timezone

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    PageTemplate,
    Frame,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
)
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Rect, String, Line
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import HorizontalBarChart
from reportlab.graphics import renderPDF

# --- Deterministic build ---------------------------------------------------
os.environ.setdefault("SOURCE_DATE_EPOCH", "1704067200")  # 2024-01-01 UTC

# HPG brand palette (from src/index.css tokens, converted from HSL)
PRIMARY = colors.HexColor("#2C3E50")     # deep navy (--primary)
PRIMARY_DARK = colors.HexColor("#1F2D3D")
ACCENT = colors.HexColor("#DBA829")      # HPG gold (--accent)
INK = colors.HexColor("#2B2F36")
MUTED = colors.HexColor("#6B7280")
SOFT = colors.HexColor("#F5F1E6")
BORDER = colors.HexColor("#E4E7EB")
WARN_BG = colors.HexColor("#FFF5D6")
WARN_BORDER = colors.HexColor("#B8860B")

OUT = Path(__file__).resolve().parent.parent / "public" / "reports" / \
    "HPG_2024_Preliminary_Annual_Financial_Report.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = LETTER
MARGIN = 0.75 * inch

# ---------------------------------------------------------------------------
# Data (from user-supplied verified 2024 dataset)
# ---------------------------------------------------------------------------
PERIOD = "January 1 – December 31, 2024"
CURRENCY = "USD"
BANK_LABEL = "Relay HPG Checking, account ending 7674"

REVENUE_TOTAL = 0.00
EXPENSE_TOTAL = 2754.73
CHANGE_IN_NET_ASSETS = REVENUE_TOTAL - EXPENSE_TOTAL

NATURAL_EXPENSES = [
    ("Travel & Transportation", 2532.99),
    ("Technology & Software", 102.74),
    ("Legal, Accounting & Compliance", 20.00),
    ("Fundraising", 99.00),
]

FUNCTIONAL_EXPENSES = [
    ("Program Services", 2532.99, 91.95),
    ("Management & General", 122.74, 4.46),
    ("Fundraising", 99.00, 3.59),
    ("Unclassified", 0.00, 0.00),
]

POSITION = {
    "Controlled Assets (bank history incomplete)": 0.00,
    "Known Liabilities": 2754.73,
    "Preliminary Net Assets": -2754.73,
}

NONCASH_FINANCING = [
    ("Founder-funded HPG expenses", 2570.99),
    ("Related-entity-funded HPG expense", 84.74),
    ("Accrued / unmatched payer", 99.00),
]

INFRASTRUCTURE_EXAMPLES = [
    "Program travel supporting HPG activities",
    "TechSoup and Zoom (technology & software)",
    "Michigan annual filing (state compliance)",
    "GrantStation (fundraising research subscription)",
]

CONTROLS_PASSED = [
    "Controlled trial balance passes.",
    "No known expenses remain unclassified.",
]

CONTROLS_OPEN = [
    "Historical bank backfill (Relay history is incomplete).",
    "Opening and statement closing cash balances.",
    "Supporting documentation for each transaction.",
    "Form 990-N acceptance evidence.",
    "Related-party treatment review.",
    "Finance Committee review and Board approval.",
]

CONTACT_EMAIL = "info@humanitypathwaysglobal.com"
CONTACT_WEB = "humanitypathwaysglobal.com"

PRELIMINARY_NOTICE = (
    "This management-prepared report is preliminary and unaudited. It is not an "
    "independent accountant's report and is not a substitute for an IRS Form 990-series "
    "filing, a state filing, or a bank statement. Missing bank rows are not evidence "
    "of zero activity, and amounts may change when the close is completed."
)

# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------
styles = getSampleStyleSheet()

def fmt_money(v: float) -> str:
    if v < 0:
        return f"(${abs(v):,.2f})"
    return f"${v:,.2f}"

body = ParagraphStyle(
    "Body", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10, leading=14, textColor=INK, spaceAfter=6,
)
body_small = ParagraphStyle(
    "BodySmall", parent=body, fontSize=9, leading=12, textColor=MUTED,
)
h1 = ParagraphStyle(
    "H1", parent=styles["Heading1"], fontName="Helvetica-Bold",
    fontSize=20, leading=24, textColor=PRIMARY, spaceAfter=8,
)
h2 = ParagraphStyle(
    "H2", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=13, leading=17, textColor=PRIMARY, spaceBefore=14, spaceAfter=6,
)
h3 = ParagraphStyle(
    "H3", parent=styles["Heading3"], fontName="Helvetica-Bold",
    fontSize=11, leading=14, textColor=PRIMARY_DARK, spaceBefore=10, spaceAfter=4,
)
notice_style = ParagraphStyle(
    "Notice", parent=body, fontName="Helvetica-Bold", fontSize=9.5,
    leading=13, textColor=PRIMARY_DARK,
)
cover_title = ParagraphStyle(
    "CoverTitle", parent=h1, fontSize=28, leading=34, alignment=0,
)
cover_sub = ParagraphStyle(
    "CoverSub", parent=body, fontSize=13, leading=18, textColor=MUTED,
)

# ---------------------------------------------------------------------------
# Page frame / chrome
# ---------------------------------------------------------------------------
def draw_chrome(canv: canvas.Canvas, doc, cover: bool = False) -> None:
    canv.saveState()
    # Top bar
    canv.setFillColor(PRIMARY)
    canv.rect(0, PAGE_H - 0.35 * inch, PAGE_W, 0.35 * inch, stroke=0, fill=1)
    canv.setFillColor(ACCENT)
    canv.rect(0, PAGE_H - 0.38 * inch, PAGE_W, 0.03 * inch, stroke=0, fill=1)

    canv.setFont("Helvetica-Bold", 9)
    canv.setFillColor(colors.white)
    canv.drawString(MARGIN, PAGE_H - 0.23 * inch, "HUMANITY PATHWAYS GLOBAL")
    canv.setFont("Helvetica", 8)
    canv.drawRightString(PAGE_W - MARGIN, PAGE_H - 0.23 * inch,
                         "2024 Preliminary Annual Financial Report")

    # Watermark on interior pages
    if not cover:
        canv.saveState()
        canv.translate(PAGE_W / 2, PAGE_H / 2)
        canv.rotate(30)
        canv.setFont("Helvetica-Bold", 78)
        canv.setFillColorRGB(0.85, 0.85, 0.85, alpha=0.18)
        canv.drawCentredString(0, 0, "PRELIMINARY • UNAUDITED")
        canv.restoreState()

    # Footer
    canv.setStrokeColor(BORDER)
    canv.setLineWidth(0.5)
    canv.line(MARGIN, 0.65 * inch, PAGE_W - MARGIN, 0.65 * inch)
    canv.setFont("Helvetica", 8)
    canv.setFillColor(MUTED)
    canv.drawString(MARGIN, 0.45 * inch,
                    f"Humanity Pathways Global  •  {CONTACT_WEB}  •  {CONTACT_EMAIL}")
    canv.drawRightString(PAGE_W - MARGIN, 0.45 * inch,
                         f"Page {doc.page}")
    canv.setFillColor(WARN_BORDER)
    canv.setFont("Helvetica-Bold", 8)
    canv.drawCentredString(PAGE_W / 2, 0.30 * inch,
                           "PRELIMINARY • UNAUDITED • MANAGEMENT-PREPARED")
    canv.restoreState()


def on_cover(canv, doc):
    draw_chrome(canv, doc, cover=True)


def on_page(canv, doc):
    draw_chrome(canv, doc, cover=False)


# ---------------------------------------------------------------------------
# Building blocks
# ---------------------------------------------------------------------------
def notice_block() -> Table:
    p = Paragraph(f"<b>Preliminary &amp; Unaudited Notice.</b> {PRELIMINARY_NOTICE}",
                  notice_style)
    t = Table([[p]], colWidths=[PAGE_W - 2 * MARGIN])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), WARN_BG),
        ("BOX", (0, 0), (-1, -1), 1, WARN_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t


def kv_table(rows: list[tuple[str, str]]) -> Table:
    t = Table(rows, colWidths=[3.2 * inch, 3.05 * inch])
    t.setStyle(TableStyle([
        ("FONT", (0, 0), (-1, -1), "Helvetica", 10),
        ("FONT", (0, 0), (0, -1), "Helvetica-Bold", 10),
        ("TEXTCOLOR", (0, 0), (0, -1), PRIMARY_DARK),
        ("TEXTCOLOR", (1, 0), (1, -1), INK),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, SOFT]),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


def money_table(header: list[str], rows: list[list], total_row: list | None = None,
                col_widths=None) -> Table:
    ncols = len(header)
    if col_widths is None:
        avail = PAGE_W - 2 * MARGIN
        if ncols == 3:
            col_widths = [avail - 3.0 * inch, 1.6 * inch, 1.4 * inch]
        elif ncols == 2:
            col_widths = [avail - 1.8 * inch, 1.8 * inch]
        else:
            col_widths = [avail / ncols] * ncols
    data = [header] + rows
    if total_row is not None:
        data.append(total_row)
    t = Table(data, colWidths=col_widths)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONT", (0, 0), (-1, 0), "Helvetica-Bold", 10),
        ("FONT", (0, 1), (-1, -1), "Helvetica", 10),
        ("TEXTCOLOR", (0, 1), (-1, -1), INK),
        ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
        ("ALIGN", (0, 0), (0, -1), "LEFT"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -2 if total_row else -1),
         [colors.white, SOFT]),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    if total_row is not None:
        style += [
            ("FONT", (0, -1), (-1, -1), "Helvetica-Bold", 10),
            ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#EAEEF3")),
            ("LINEABOVE", (0, -1), (-1, -1), 1, PRIMARY),
        ]
    t.setStyle(TableStyle(style))
    return t


def make_pie() -> Drawing:
    d = Drawing(5.6 * inch, 2.6 * inch)
    d.add(String(0, 2.4 * inch, "Functional Expense Allocation (%)",
                 fontName="Helvetica-Bold", fontSize=11, fillColor=PRIMARY))
    pie = Pie()
    pie.x = 90
    pie.y = 10
    pie.width = 170
    pie.height = 170
    pie.data = [row[2] for row in FUNCTIONAL_EXPENSES if row[2] > 0]
    pie.labels = [f"{row[0]} {row[2]:.2f}%"
                  for row in FUNCTIONAL_EXPENSES if row[2] > 0]
    pie.slices.strokeWidth = 0.5
    pie.slices.strokeColor = colors.white
    palette = [PRIMARY, ACCENT, colors.HexColor("#6B8E9E")]
    for i, c in enumerate(palette[:len(pie.data)]):
        pie.slices[i].fillColor = c
    pie.sideLabels = 1
    pie.simpleLabels = 0
    d.add(pie)
    return d


def make_bar() -> Drawing:
    d = Drawing(5.5 * inch, 2.4 * inch)
    d.add(String(0, 2.2 * inch, "Expenses by Natural Category (USD)",
                 fontName="Helvetica-Bold", fontSize=11, fillColor=PRIMARY))
    chart = HorizontalBarChart()
    chart.x = 150
    chart.y = 15
    chart.width = 230
    chart.height = 150
    values = [row[1] for row in NATURAL_EXPENSES]
    chart.data = [values]
    chart.categoryAxis.categoryNames = [row[0] for row in NATURAL_EXPENSES]
    chart.categoryAxis.labels.fontName = "Helvetica"
    chart.categoryAxis.labels.fontSize = 8
    chart.valueAxis.valueMin = 0
    chart.valueAxis.valueMax = 3000
    chart.valueAxis.valueStep = 500
    chart.valueAxis.labels.fontName = "Helvetica"
    chart.valueAxis.labels.fontSize = 8
    chart.bars[0].fillColor = PRIMARY
    chart.bars.strokeColor = None
    chart.barLabels.nudge = 6
    chart.barLabelFormat = lambda v: f"${v:,.2f}"
    chart.barLabels.fontName = "Helvetica-Bold"
    chart.barLabels.fontSize = 8
    chart.barLabels.fillColor = INK
    chart.barLabelFormat = "$%0.2f"
    d.add(chart)
    return d


def bullets(items: list[str]) -> list:
    return [Paragraph("•&nbsp;&nbsp;" + i, body) for i in items]


# ---------------------------------------------------------------------------
# Story
# ---------------------------------------------------------------------------
story: list = []

# ------------------- Cover ---------------------
story.append(Spacer(1, 1.4 * inch))
story.append(Paragraph("2024 Preliminary Annual Financial Report", cover_title))
story.append(Spacer(1, 0.15 * inch))
story.append(Paragraph("Humanity Pathways Global", ParagraphStyle(
    "co", parent=body, fontSize=15, leading=20, textColor=ACCENT,
    fontName="Helvetica-Bold")))
story.append(Spacer(1, 0.1 * inch))
story.append(Paragraph(f"Reporting period: {PERIOD}<br/>Currency: {CURRENCY}<br/>"
                       f"Prepared by management • Preliminary &amp; unaudited",
                       cover_sub))
story.append(Spacer(1, 0.5 * inch))
story.append(notice_block())
story.append(Spacer(1, 0.3 * inch))
story.append(Paragraph(
    f"Contact: {CONTACT_EMAIL}  •  {CONTACT_WEB}", body_small))
story.append(PageBreak())

# ------------------- Overview ---------------------
story.append(Paragraph("1. Report Overview", h1))
story.append(notice_block())
story.append(Spacer(1, 0.15 * inch))
story.append(Paragraph(
    "This document presents Humanity Pathways Global's (\"HPG\") preliminary "
    "financial activity for calendar year 2024. It reflects HPG-only known "
    "activity assembled from the operating bank account and approved accrual "
    "and noncash entries. It is issued by management for public transparency "
    "while the annual close and independent review remain in progress.",
    body))

story.append(Paragraph("Scope, Method & Known Gaps", h2))
story.append(kv_table([
    ("Reporting period", PERIOD),
    ("Currency", CURRENCY),
    ("Basis", "Cash basis (bank activity) plus approved accrual / noncash entries"),
    ("Primary operating account", BANK_LABEL),
    ("Included", "HPG-only known activity"),
    ("Excluded", "Savings accounts and sponsored-project subaccounts"),
    ("Known gaps", "Relay history, opening cash, and statement closing cash are incomplete"),
    ("Status", "Preliminary • Unaudited • Management-prepared"),
]))
story.append(Spacer(1, 0.15 * inch))
story.append(Paragraph(
    "Because the bank history is incomplete, missing rows are not treated as "
    "evidence of zero activity. Figures presented here reflect only what has "
    "been controlled and reconciled to the source records available at the time "
    "of preparation, and may change when the close is completed.",
    body))
story.append(PageBreak())

# ------------------- Statement of Activities ---------------------
story.append(Paragraph("2. Statement of Activities (Preliminary)", h1))
story.append(Paragraph(
    "The following summarizes known revenue and known expenses for the period.",
    body))
story.append(Spacer(1, 0.1 * inch))
story.append(money_table(
    ["Line Item", "Amount (USD)"],
    [
        ["Known Revenue", fmt_money(REVENUE_TOTAL)],
        ["Known Expenses", fmt_money(EXPENSE_TOTAL)],
    ],
    total_row=["Preliminary Change in Net Assets",
               fmt_money(CHANGE_IN_NET_ASSETS)],
))

story.append(Paragraph("Expenses by Natural Category", h2))
nat_rows = [[name, fmt_money(amt),
             f"{(amt / EXPENSE_TOTAL * 100):.2f}%"] for name, amt in NATURAL_EXPENSES]
story.append(money_table(
    ["Category", "Amount (USD)", "% of Total"],
    nat_rows,
    total_row=["Total Known Expenses", fmt_money(EXPENSE_TOTAL), "100.00%"],
))
story.append(Spacer(1, 0.15 * inch))
story.append(make_bar())
story.append(PageBreak())

# ------------------- Functional Expenses ---------------------
story.append(Paragraph("3. Functional Expenses (Preliminary)", h1))
story.append(Paragraph(
    "HPG allocates known expenses across program, management &amp; general, "
    "and fundraising functions. Percentages are computed on the "
    "controlled expense base for the period.",
    body))
func_rows = [[name, fmt_money(amt), f"{pct:.2f}%"]
             for name, amt, pct in FUNCTIONAL_EXPENSES]
story.append(money_table(
    ["Function", "Amount (USD)", "% of Total"],
    func_rows,
    total_row=["Total Known Expenses", fmt_money(EXPENSE_TOTAL), "100.00%"],
))
story.append(Spacer(1, 0.15 * inch))
story.append(make_pie())

story.append(Paragraph("Known Program & Infrastructure Examples", h2))
story.extend(bullets(INFRASTRUCTURE_EXAMPLES))
story.append(PageBreak())

# ------------------- Financial Position ---------------------
story.append(Paragraph("4. Statement of Financial Position (Preliminary)", h1))
story.append(Paragraph(
    "Controlled assets are reported at $0.00 because Relay bank history is "
    "incomplete for the period; this does not imply an absence of underlying "
    "activity. Known liabilities and preliminary net assets are shown as "
    "assembled from approved accrual and noncash entries.",
    body))
pos_rows = [[k, fmt_money(v)] for k, v in POSITION.items()]
story.append(money_table(
    ["Line Item", "Amount (USD)"],
    pos_rows,
))

story.append(Paragraph("Noncash Financing Disclosure", h2))
story.append(Paragraph(
    "HPG-recognized expenses funded outside of the operating bank account "
    "during 2024:", body))
nc_rows = [[k, fmt_money(v)] for k, v in NONCASH_FINANCING]
story.append(money_table(
    ["Source", "Amount (USD)"],
    nc_rows,
    total_row=["Total Noncash / Off-Bank Financing",
               fmt_money(sum(v for _, v in NONCASH_FINANCING))],
))
story.append(PageBreak())

# ------------------- Controls & Open Items ---------------------
story.append(Paragraph("5. Controls, Reconciliation & Open Items", h1))
story.append(Paragraph("Controls that currently pass", h2))
story.extend(bullets(CONTROLS_PASSED))
story.append(Paragraph("Open items required to close the year", h2))
story.extend(bullets(CONTROLS_OPEN))

story.append(Paragraph("6. Report Status & Contact", h1))
story.append(notice_block())
story.append(Spacer(1, 0.15 * inch))
story.append(Paragraph(
    "Questions about this preliminary report — including corrections, "
    "supporting documentation, or updates once the close is completed — "
    f"may be directed to <b>{CONTACT_EMAIL}</b>. Additional information about "
    f"HPG is available at <b>{CONTACT_WEB}</b>.",
    body))
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph(
    f"Prepared: {datetime.fromtimestamp(int(os.environ['SOURCE_DATE_EPOCH']), tz=timezone.utc).strftime('%Y-%m-%d')} "
    "(deterministic build timestamp)", body_small))


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
def build() -> None:
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=LETTER,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN + 0.15 * inch,
        bottomMargin=MARGIN + 0.05 * inch,
        title="HPG 2024 Preliminary Annual Financial Report",
        author="Humanity Pathways Global",
        subject="Preliminary and unaudited management-prepared 2024 annual financial report",
        creator="HPG deterministic report generator",
    )
    frame = Frame(MARGIN, MARGIN, PAGE_W - 2 * MARGIN,
                  PAGE_H - 2 * MARGIN - 0.2 * inch, id="body")
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[frame], onPage=on_cover),
        PageTemplate(id="content", frames=[frame], onPage=on_page),
    ])
    doc.build(story)
    size = OUT.stat().st_size
    if size < 5_000:
        raise SystemExit(f"Generated PDF is unexpectedly small: {size} bytes")
    print(f"Wrote {OUT.relative_to(Path.cwd())} ({size:,} bytes)")


if __name__ == "__main__":
    build()
