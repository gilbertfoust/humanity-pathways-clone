#!/usr/bin/env python3
"""
Deterministic generator for the HPG 2025 Preliminary & Unaudited Annual
Financial Report PDF.

Run:
    python3 scripts/generate-annual-report-2025.py

Output:
    public/reports/HPG_2025_Preliminary_Annual_Financial_Report.pdf

All figures are the verified public-facing 2025 dataset provided by HPG
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
)
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, String
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import HorizontalBarChart

# --- Deterministic build ---------------------------------------------------
os.environ.setdefault("SOURCE_DATE_EPOCH", "1735689600")  # 2025-01-01 UTC

# HPG brand palette (matches 2024 report generator)
PRIMARY = colors.HexColor("#2C3E50")
PRIMARY_DARK = colors.HexColor("#1F2D3D")
ACCENT = colors.HexColor("#DBA829")
INK = colors.HexColor("#2B2F36")
MUTED = colors.HexColor("#6B7280")
SOFT = colors.HexColor("#F5F1E6")
BORDER = colors.HexColor("#E4E7EB")
WARN_BG = colors.HexColor("#FFF5D6")
WARN_BORDER = colors.HexColor("#B8860B")
POS = colors.HexColor("#6B8E9E")
NEG = colors.HexColor("#B23A3A")

OUT = Path(__file__).resolve().parent.parent / "public" / "reports" / \
    "HPG_2025_Preliminary_Annual_Financial_Report.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = LETTER
MARGIN = 0.75 * inch

# ---------------------------------------------------------------------------
# Data (verified 2025 dataset)
# ---------------------------------------------------------------------------
PERIOD = "January 1 – December 31, 2025"
CURRENCY = "USD"
BANK_LABEL = "Relay HPG Checking, account ending 7674"
TXN_COUNT = 92
EARLIEST_ACTIVITY_NOTE = "No activity before March 18, 2025 was reported."

SPONSORED_PROJECTS = [
    "Humble Pathways",
    "Project Wings Soaring",
    "Global Youth Leaders for Humanity (GYLFH)",
]

# --- Revenue / support ---
REVENUE_LINES = [
    # (label, without_restrictions, with_restrictions)
    ("Grants", 1000.00, 0.00),
    ("Corporate contributions", 0.00, 675.00),
    ("Fiscal sponsorship & administrative fees", 75.00, 0.00),
]
REV_WITHOUT = sum(r[1] for r in REVENUE_LINES)   # 1,075.00
REV_WITH = sum(r[2] for r in REVENUE_LINES)      # 675.00
REV_TOTAL = REV_WITHOUT + REV_WITH               # 1,750.00

# --- Expenses ---
EXPENSE_WITHOUT = 5191.97
EXPENSE_WITH = 447.65
EXPENSE_TOTAL = 5639.62  # matches provided total

# --- Change in net assets ---
CHG_WITHOUT = REV_WITHOUT - EXPENSE_WITHOUT      # (4,116.97)
CHG_WITH = REV_WITH - EXPENSE_WITH               # 227.35
CHG_TOTAL = REV_TOTAL - EXPENSE_TOTAL            # (3,889.62)

NATURAL_EXPENSES = [
    ("Travel & Transportation", 4234.55),
    ("Technology & Software", 529.20),
    ("Program Supplies", 451.87),
    ("Marketing & Communications", 260.00),
    ("Training & Workshops", 99.00),
    ("Legal, Accounting & Compliance", 65.00),
]

FUNCTIONAL_EXPENSES = [
    ("Program Services", 4877.45, 86.49),
    ("Management & General", 502.17, 8.90),
    ("Fundraising", 260.00, 4.61),
    ("Unclassified", 0.00, 0.00),
]

# --- Financial position ---
ASSETS = [
    ("Cash (Relay checking)", 49.54),
    ("Prepaids, advances & related-entity receivables", 936.31),
    ("Due from sponsored projects", 27.35),
]
ASSETS_TOTAL = 1013.20

SPONSORED_BALANCES = [
    ("Humble Pathways", 2.35),
    ("Project Wings Soaring", 0.00),
    ("Global Youth Leaders for Humanity", 25.00),
]

LIABILITIES = [
    ("Accrued expenses", 99.00),
    ("Unidentified / refundable receipts", 260.00),
    ("Founder-funded balances", 3845.71),
    ("Related-entity-funded balances", 3452.84),
]
LIAB_TOTAL = 7657.55

NET_ASSETS = [
    ("Without donor restrictions", -6871.70),
    ("With donor restrictions", 227.35),
]
NET_ASSETS_TOTAL = -6644.35
LIAB_PLUS_NA = 1013.20

COMPLETED_CONTROLS = [
    "Connected checking history is complete for the period reported.",
    "Bank reconciliation is reconciled.",
    "Trial balance passes.",
    "No functional expenses remain unclassified.",
]

OPEN_ITEMS = [
    "Resolve three December credits totaling $260.",
    "Complete travel, advance, savings and related-entity support.",
    "Attach award terms and restriction support.",
    "Approve treatment of founder and related-entity balances.",
    "Attach Form 990-N acceptance evidence.",
    "Complete Finance Committee and Board approval.",
]

LIQUIDITY_OBSERVATION = (
    "Year-end cash was $49.54, with limited unrestricted liquidity and "
    "substantial founder and related-entity balances outstanding. Management "
    "presents this as a financial priority and observation for planning "
    "purposes; it is not a going-concern opinion."
)

CONTACT_EMAIL = "info@humanitypathwaysglobal.com"
CONTACT_WEB = "humanitypathwaysglobal.com"

PRELIMINARY_NOTICE = (
    "This management-prepared report is preliminary and unaudited. It is not an "
    "independent accountant's report and is not a substitute for an IRS Form 990-series "
    "filing, a state filing, or a bank statement. Presentation may change as "
    "documentation and approvals are completed."
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
# Page chrome (matches 2024 report)
# ---------------------------------------------------------------------------
def draw_chrome(canv: canvas.Canvas, doc, cover: bool = False) -> None:
    canv.saveState()
    canv.setFillColor(PRIMARY)
    canv.rect(0, PAGE_H - 0.35 * inch, PAGE_W, 0.35 * inch, stroke=0, fill=1)
    canv.setFillColor(ACCENT)
    canv.rect(0, PAGE_H - 0.38 * inch, PAGE_W, 0.03 * inch, stroke=0, fill=1)

    canv.setFont("Helvetica-Bold", 9)
    canv.setFillColor(colors.white)
    canv.drawString(MARGIN, PAGE_H - 0.23 * inch, "HUMANITY PATHWAYS GLOBAL")
    canv.setFont("Helvetica", 8)
    canv.drawRightString(PAGE_W - MARGIN, PAGE_H - 0.23 * inch,
                         "2025 Preliminary Annual Financial Report")

    if not cover:
        canv.saveState()
        canv.translate(PAGE_W / 2, PAGE_H / 2)
        canv.rotate(30)
        canv.setFont("Helvetica-Bold", 78)
        canv.setFillColorRGB(0.85, 0.85, 0.85, alpha=0.18)
        canv.drawCentredString(0, 0, "PRELIMINARY • UNAUDITED")
        canv.restoreState()

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
# Helpers
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
    key_style = ParagraphStyle("kvk", parent=body, fontName="Helvetica-Bold",
                                fontSize=10, leading=13, textColor=PRIMARY_DARK)
    val_style = ParagraphStyle("kvv", parent=body, fontSize=10, leading=13)
    rows = [[Paragraph(k, key_style), Paragraph(v, val_style)] for k, v in rows]
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
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def data_table(header: list[str], rows: list[list], total_row: list | None = None,
               col_widths=None) -> Table:
    ncols = len(header)
    if col_widths is None:
        avail = PAGE_W - 2 * MARGIN
        if ncols == 2:
            col_widths = [avail - 1.8 * inch, 1.8 * inch]
        elif ncols == 3:
            col_widths = [avail - 3.0 * inch, 1.6 * inch, 1.4 * inch]
        elif ncols == 4:
            col_widths = [avail - 4.2 * inch, 1.4 * inch, 1.4 * inch, 1.4 * inch]
        else:
            col_widths = [avail / ncols] * ncols
    data = [header] + rows
    if total_row is not None:
        data.append(total_row)
    t = Table(data, colWidths=col_widths, repeatRows=1)
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
    active = [(n, p) for _, _, p in [] for n, p in []]  # placeholder
    data_pairs = [(row[0], row[2]) for row in FUNCTIONAL_EXPENSES if row[2] > 0]
    pie.data = [p for _, p in data_pairs]
    pie.labels = [f"{n} {p:.2f}%" for n, p in data_pairs]
    pie.slices.strokeWidth = 0.5
    pie.slices.strokeColor = colors.white
    palette = [PRIMARY, ACCENT, POS, MUTED]
    for i, c in enumerate(palette[:len(pie.data)]):
        pie.slices[i].fillColor = c
    pie.sideLabels = 1
    pie.simpleLabels = 0
    d.add(pie)
    return d


def make_bar() -> Drawing:
    d = Drawing(5.5 * inch, 2.6 * inch)
    d.add(String(0, 2.4 * inch, "Expenses by Natural Category (USD)",
                 fontName="Helvetica-Bold", fontSize=11, fillColor=PRIMARY))
    chart = HorizontalBarChart()
    chart.x = 170
    chart.y = 15
    chart.width = 220
    chart.height = 170
    values = [row[1] for row in NATURAL_EXPENSES]
    chart.data = [values]
    chart.categoryAxis.categoryNames = [row[0] for row in NATURAL_EXPENSES]
    chart.categoryAxis.labels.fontName = "Helvetica"
    chart.categoryAxis.labels.fontSize = 8
    chart.valueAxis.valueMin = 0
    chart.valueAxis.valueMax = 5000
    chart.valueAxis.valueStep = 1000
    chart.valueAxis.labels.fontName = "Helvetica"
    chart.valueAxis.labels.fontSize = 8
    chart.bars[0].fillColor = PRIMARY
    chart.bars.strokeColor = None
    chart.barLabels.nudge = 6
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

# --- Cover ---
story.append(Spacer(1, 1.4 * inch))
story.append(Paragraph("2025 Preliminary Annual Financial Report", cover_title))
story.append(Spacer(1, 0.15 * inch))
story.append(Paragraph("Humanity Pathways Global", ParagraphStyle(
    "co", parent=body, fontSize=15, leading=20, textColor=ACCENT,
    fontName="Helvetica-Bold")))
story.append(Spacer(1, 0.1 * inch))
story.append(Paragraph(
    f"Reporting period: {PERIOD}<br/>Currency: {CURRENCY}<br/>"
    "Prepared by management • Preliminary &amp; unaudited",
    cover_sub))
story.append(Spacer(1, 0.5 * inch))
story.append(notice_block())
story.append(Spacer(1, 0.3 * inch))
story.append(Paragraph(f"Contact: {CONTACT_EMAIL}  •  {CONTACT_WEB}", body_small))
story.append(PageBreak())

# --- Overview ---
story.append(Paragraph("1. Report Overview", h1))
story.append(notice_block())
story.append(Spacer(1, 0.15 * inch))
story.append(Paragraph(
    "This document presents Humanity Pathways Global's (\"HPG\") preliminary "
    "financial activity for calendar year 2025. It reflects the complete "
    "connected history of the operating bank account for the period, together "
    "with approved accrual and noncash entries and approved support for "
    "HPG-sponsored initiatives. It is issued by management for public "
    "transparency while documentation and governance approvals remain in progress.",
    body))

story.append(Paragraph("Scope, Method & Status", h2))
story.append(kv_table([
    ("Reporting period", PERIOD),
    ("Currency", CURRENCY),
    ("Basis", "Connected bank history plus approved accrual / noncash entries"),
    ("Primary operating account", BANK_LABEL),
    ("Posted transactions", f"{TXN_COUNT} in the connected history"),
    ("Earliest activity note", EARLIEST_ACTIVITY_NOTE),
    ("Included initiatives",
     "HPG plus approved support for Humble Pathways, Project Wings Soaring, "
     "and Global Youth Leaders for Humanity"),
    ("Bank reconciliation", "Reconciled"),
    ("Trial balance", "Passes"),
    ("Open items", "Documentation and governance approvals remain open"),
    ("Status", "Preliminary • Unaudited • Management-prepared"),
]))
story.append(PageBreak())

# --- Statement of Activities ---
story.append(Paragraph("2. Statement of Activities (Preliminary)", h1))
story.append(Paragraph(
    "Revenue and support are shown by donor restriction. Percentages of "
    "expense composition appear in Section 3.", body))

story.append(Paragraph("Revenue & Support", h2))
rev_rows = []
for label, wo, wi in REVENUE_LINES:
    rev_rows.append([label, fmt_money(wo), fmt_money(wi), fmt_money(wo + wi)])
story.append(data_table(
    ["Source", "Without Restrictions", "With Restrictions", "Total"],
    rev_rows,
    total_row=["Total Revenue & Support", fmt_money(REV_WITHOUT),
               fmt_money(REV_WITH), fmt_money(REV_TOTAL)],
))

story.append(Paragraph("Change in Net Assets", h2))
story.append(data_table(
    ["Line", "Without Restrictions", "With Restrictions", "Total"],
    [
        ["Revenue & support", fmt_money(REV_WITHOUT),
         fmt_money(REV_WITH), fmt_money(REV_TOTAL)],
        ["Expenses", fmt_money(EXPENSE_WITHOUT),
         fmt_money(EXPENSE_WITH), fmt_money(EXPENSE_TOTAL)],
    ],
    total_row=["Change in Net Assets", fmt_money(CHG_WITHOUT),
               fmt_money(CHG_WITH), fmt_money(CHG_TOTAL)],
))
story.append(PageBreak())

# --- Expenses ---
story.append(Paragraph("3. Expenses (Preliminary)", h1))
story.append(Paragraph("Expenses by Natural Category", h2))
nat_rows = [[name, fmt_money(amt),
             f"{(amt / EXPENSE_TOTAL * 100):.2f}%"] for name, amt in NATURAL_EXPENSES]
story.append(data_table(
    ["Category", "Amount (USD)", "% of Total"],
    nat_rows,
    total_row=["Total Expenses", fmt_money(EXPENSE_TOTAL), "100.00%"],
))
story.append(Spacer(1, 0.1 * inch))
story.append(make_bar())

story.append(Paragraph("Expenses by Functional Classification", h2))
func_rows = [[name, fmt_money(amt), f"{pct:.2f}%"]
             for name, amt, pct in FUNCTIONAL_EXPENSES]
story.append(data_table(
    ["Function", "Amount (USD)", "% of Total"],
    func_rows,
    total_row=["Total Expenses", fmt_money(EXPENSE_TOTAL), "100.00%"],
))
story.append(Spacer(1, 0.1 * inch))
story.append(make_pie())
story.append(PageBreak())

# --- Financial Position ---
story.append(Paragraph("4. Statement of Financial Position (Preliminary)", h1))
story.append(Paragraph("Assets", h2))
story.append(data_table(
    ["Asset", "Amount (USD)"],
    [[k, fmt_money(v)] for k, v in ASSETS],
    total_row=["Total Assets", fmt_money(ASSETS_TOTAL)],
))

story.append(Paragraph("Sponsored-Project Balances (represented in controlled data)", h3))
story.append(data_table(
    ["Sponsored Project", "Balance (USD)"],
    [[k, fmt_money(v)] for k, v in SPONSORED_BALANCES],
    total_row=["Total Represented",
               fmt_money(sum(v for _, v in SPONSORED_BALANCES))],
))

story.append(Paragraph("Liabilities", h2))
story.append(data_table(
    ["Liability", "Amount (USD)"],
    [[k, fmt_money(v)] for k, v in LIABILITIES],
    total_row=["Total Liabilities", fmt_money(LIAB_TOTAL)],
))

story.append(Paragraph("Net Assets", h2))
story.append(data_table(
    ["Class", "Amount (USD)"],
    [[k, fmt_money(v)] for k, v in NET_ASSETS],
    total_row=["Total Net Assets", fmt_money(NET_ASSETS_TOTAL)],
))
story.append(Spacer(1, 0.05 * inch))
story.append(data_table(
    ["Balance Check", "Amount (USD)"],
    [["Total Liabilities + Net Assets", fmt_money(LIAB_PLUS_NA)],
     ["Total Assets", fmt_money(ASSETS_TOTAL)]],
))
story.append(PageBreak())

# --- Management liquidity observation ---
story.append(Paragraph("5. Management Liquidity Observation", h1))
story.append(Paragraph(LIQUIDITY_OBSERVATION, body))
story.append(Spacer(1, 0.05 * inch))
story.append(Paragraph(
    "This observation is provided for planning and transparency and is "
    "explicitly not a going-concern opinion. An independent accountant has "
    "not evaluated the entity's ability to continue as a going concern.",
    body_small))

# --- Controls and open items ---
story.append(Paragraph("6. Controls, Reconciliation & Open Items", h1))
story.append(Paragraph("Completed controls", h2))
story.extend(bullets(COMPLETED_CONTROLS))
story.append(Paragraph("Open items required to close the year", h2))
story.extend(bullets(OPEN_ITEMS))
story.append(PageBreak())

# --- Contact / status ---
story.append(Paragraph("7. Report Status & Contact", h1))
story.append(notice_block())
story.append(Spacer(1, 0.15 * inch))
story.append(Paragraph(
    "Questions about this preliminary report — including corrections, "
    "supporting documentation, or updates once documentation and approvals "
    f"are complete — may be directed to <b>{CONTACT_EMAIL}</b>. Additional "
    f"information about HPG is available at <b>{CONTACT_WEB}</b>.",
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
        title="HPG 2025 Preliminary Annual Financial Report",
        author="Humanity Pathways Global",
        subject="Preliminary and unaudited management-prepared 2025 annual financial report",
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
