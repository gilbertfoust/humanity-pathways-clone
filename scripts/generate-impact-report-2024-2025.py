#!/usr/bin/env python3
"""
Deterministic generator for the HPG 2024-2025 Impact & Organizational
Development Report PDF.

Run:
    python3 scripts/generate-impact-report-2024-2025.py

Output:
    public/reports/HPG_2024_2025_Impact_and_Organizational_Development_Report.pdf

This is a management-prepared, evidence-based report. It is NOT an audited,
independent, or third-party program evaluation, and it is not an IRS Form 990
filing. No beneficiary counts, attendance figures, countries served, or
outcomes are estimated where consistent source records do not exist.
"""
from __future__ import annotations

import os
from pathlib import Path

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
from reportlab.graphics.shapes import Drawing, String
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import HorizontalBarChart

os.environ.setdefault("SOURCE_DATE_EPOCH", "1752624000")  # 2025-07-16 UTC

# HPG palette (aligned with annual financial reports)
PRIMARY = colors.HexColor("#2C3E50")
PRIMARY_DARK = colors.HexColor("#1F2D3D")
TEAL = colors.HexColor("#2F6E7A")
ACCENT = colors.HexColor("#DBA829")
INK = colors.HexColor("#2B2F36")
MUTED = colors.HexColor("#6B7280")
SOFT = colors.HexColor("#F5F1E6")
BORDER = colors.HexColor("#E4E7EB")
NOTICE_BG = colors.HexColor("#EAF1F4")
NOTICE_BORDER = colors.HexColor("#2F6E7A")

OUT = Path(__file__).resolve().parent.parent / "public" / "reports" / \
    "HPG_2024_2025_Impact_and_Organizational_Development_Report.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = LETTER
MARGIN = 0.75 * inch

CONTACT_EMAIL = "info@humanitypathwaysglobal.com"
CONTACT_WEB = "humanitypathwaysglobal.com"
PERIOD = "January 1, 2024 through December 31, 2025"
PREPARED = "Prepared July 16, 2026"
STATUS_LINE = "MANAGEMENT-PREPARED | EVIDENCE-BASED | NOT AN AUDITED PROGRAM EVALUATION"

# --- Styles ----------------------------------------------------------------
styles = getSampleStyleSheet()

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
    "CoverTitle", parent=h1, fontSize=26, leading=32, alignment=0,
)
cover_sub = ParagraphStyle(
    "CoverSub", parent=body, fontSize=13, leading=18, textColor=MUTED,
)
metric_num = ParagraphStyle(
    "MetricNum", parent=body, fontName="Helvetica-Bold", fontSize=22,
    leading=24, textColor=PRIMARY, alignment=1, spaceAfter=2,
)
metric_lbl = ParagraphStyle(
    "MetricLbl", parent=body, fontSize=8.5, leading=11, textColor=MUTED,
    alignment=1,
)


# --- Page chrome -----------------------------------------------------------
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
                         "2024-2025 Impact & Organizational Development Report")

    if not cover:
        canv.saveState()
        canv.translate(PAGE_W / 2, PAGE_H / 2)
        canv.rotate(30)
        canv.setFont("Helvetica-Bold", 64)
        canv.setFillColorRGB(0.85, 0.85, 0.85, alpha=0.15)
        canv.drawCentredString(0, 0, "MANAGEMENT-PREPARED")
        canv.restoreState()

    canv.setStrokeColor(BORDER)
    canv.setLineWidth(0.5)
    canv.line(MARGIN, 0.65 * inch, PAGE_W - MARGIN, 0.65 * inch)
    canv.setFont("Helvetica", 8)
    canv.setFillColor(MUTED)
    canv.drawString(MARGIN, 0.45 * inch,
                    f"Humanity Pathways Global  -  {CONTACT_WEB}  -  {CONTACT_EMAIL}")
    canv.drawRightString(PAGE_W - MARGIN, 0.45 * inch, f"Page {doc.page}")
    canv.setFillColor(NOTICE_BORDER)
    canv.setFont("Helvetica-Bold", 8)
    canv.drawCentredString(PAGE_W / 2, 0.30 * inch, STATUS_LINE)
    canv.restoreState()


def on_cover(canv, doc):
    draw_chrome(canv, doc, cover=True)


def on_page(canv, doc):
    draw_chrome(canv, doc, cover=False)


# --- Helpers ---------------------------------------------------------------
def notice_block(text: str) -> Table:
    p = Paragraph(text, notice_style)
    t = Table([[p]], colWidths=[PAGE_W - 2 * MARGIN])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NOTICE_BG),
        ("BOX", (0, 0), (-1, -1), 1, NOTICE_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t


def data_table(header, rows, total_row=None, col_widths=None) -> Table:
    ncols = len(header)
    if col_widths is None:
        avail = PAGE_W - 2 * MARGIN
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
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
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


def bullets(items):
    return [Paragraph("-&nbsp;&nbsp;" + i, body) for i in items]


def metric_cell(number: str, label: str) -> Table:
    inner = [[Paragraph(number, metric_num)], [Paragraph(label, metric_lbl)]]
    t = Table(inner, colWidths=[(PAGE_W - 2 * MARGIN) / 4 - 8])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("BOX", (0, 0), (-1, -1), 0.75, ACCENT),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


def metric_row(items):
    row = [metric_cell(n, l) for n, l in items]
    t = Table([row], colWidths=[(PAGE_W - 2 * MARGIN) / 4] * 4)
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def functional_pie_2024() -> Drawing:
    d = Drawing(6.5 * inch, 2.6 * inch)
    d.add(String(0, 2.4 * inch, "2024 Functional Expense Mix (%)",
                 fontName="Helvetica-Bold", fontSize=11, fillColor=PRIMARY))
    pie = Pie()
    pie.x = 90
    pie.y = 10
    pie.width = 170
    pie.height = 170
    pairs = [("Program Services", 92.0),
             ("Management & General", 4.5),
             ("Fundraising", 3.6)]  # sums to 100.1 due to rounding in source
    pie.data = [p for _, p in pairs]
    pie.labels = [f"{n} {p:.1f}%" for n, p in pairs]
    for i, c in enumerate([PRIMARY, ACCENT, TEAL]):
        pie.slices[i].fillColor = c
    pie.slices.strokeColor = colors.white
    pie.slices.strokeWidth = 0.5
    pie.sideLabels = 1
    d.add(pie)
    return d


def functional_bar_2025() -> Drawing:
    d = Drawing(6.5 * inch, 2.6 * inch)
    d.add(String(0, 2.4 * inch, "2025 Functional Expense Mix (%)",
                 fontName="Helvetica-Bold", fontSize=11, fillColor=PRIMARY))
    chart = HorizontalBarChart()
    chart.x = 170
    chart.y = 20
    chart.width = 260
    chart.height = 160
    values = [86.5, 8.9, 4.6]
    chart.data = [values]
    chart.categoryAxis.categoryNames = [
        "Program Services", "Management & General", "Fundraising"]
    chart.categoryAxis.labels.fontName = "Helvetica"
    chart.categoryAxis.labels.fontSize = 9
    chart.valueAxis.valueMin = 0
    chart.valueAxis.valueMax = 100
    chart.valueAxis.valueStep = 25
    chart.valueAxis.labels.fontName = "Helvetica"
    chart.valueAxis.labels.fontSize = 8
    chart.bars[0].fillColor = TEAL
    chart.bars.strokeColor = None
    chart.barLabels.nudge = 6
    chart.barLabels.fontName = "Helvetica-Bold"
    chart.barLabels.fontSize = 8
    chart.barLabels.fillColor = INK
    chart.barLabelFormat = "%0.1f%%"
    d.add(chart)
    return d


# --- Story -----------------------------------------------------------------
story = []

# Cover
story.append(Spacer(1, 1.1 * inch))
story.append(Paragraph("Humanity Pathways Global", ParagraphStyle(
    "co", parent=body, fontSize=15, leading=20, textColor=ACCENT,
    fontName="Helvetica-Bold")))
story.append(Spacer(1, 0.1 * inch))
story.append(Paragraph(
    "2024-2025 Impact &amp; Organizational Development Report", cover_title))
story.append(Spacer(1, 0.15 * inch))
story.append(Paragraph(
    "Building the infrastructure, partnerships and accountability systems "
    "needed for sustainable global service.",
    ParagraphStyle("sub", parent=cover_sub, textColor=PRIMARY_DARK)))
story.append(Spacer(1, 0.35 * inch))
story.append(Paragraph(
    f"Reporting period: {PERIOD}<br/>{PREPARED}", cover_sub))
story.append(Spacer(1, 0.5 * inch))
story.append(notice_block(
    "<b>Status.</b> " + STATUS_LINE + ".  This document is management-prepared "
    "and does not constitute an independent evaluation, audit, or assurance "
    "engagement. It is not an IRS Form 990 filing. No beneficiary counts, "
    "attendance figures, countries served, or outcomes have been estimated "
    "where consistent source records do not exist."))
story.append(Spacer(1, 0.3 * inch))
story.append(Paragraph(f"Contact: {CONTACT_EMAIL}  -  {CONTACT_WEB}", body_small))
story.append(PageBreak())

# 1. Executive overview
story.append(Paragraph("1. Executive Overview", h1))
story.append(Paragraph(
    "Across 2024 and 2025, Humanity Pathways Global (\"HPG\") continued "
    "developing as an international fiscal sponsor and program-incubation "
    "organization. Impact during this period occurred in two connected ways: "
    "direct youth- and community-oriented programming, and the underlying "
    "infrastructure that allows grassroots partner organizations to fundraise, "
    "document results, and meet accountability expectations.", body))
story.append(Paragraph(
    "The strongest substantiated achievements of the period are the "
    "development of the sponsored-project portfolio, delivery of the Global "
    "Youth Leaders for Humanity (GYLFH) initiative, expansion of "
    "geographically distributed leadership, maturation of financial and "
    "compliance controls, and the buildout of technology, communications, "
    "development, and program systems.", body))
story.append(Paragraph(
    "Where consistent source records were not available, beneficiary totals "
    "are <b>not estimated</b>. Those gaps are reported openly in Section 8 and "
    "form the basis of the measurement priorities in Section 9.", body))

story.append(Paragraph("Top Metrics", h2))
story.append(metric_row([
    ("15", "Sponsored projects in the previously confirmed HPG portfolio"),
    ("92", "Posted 2025 HPG checking transactions retrieved and classified"),
    ("86.5%", "2025 known expenses classified as Program Services"),
    ("3", "Project accounts in the controlled 2025 financial support"),
]))
story.append(Spacer(1, 0.1 * inch))
story.append(Paragraph(
    "<i>Qualifier:</i> the 15 sponsored projects may be at different stages of "
    "onboarding, fundraising, or delivery. The three project accounts in the "
    "controlled 2025 financial support are Humble Pathways, Project Wings "
    "Soaring, and Global Youth Leaders for Humanity (GYLFH).", body_small))
story.append(PageBreak())

# 2. Mission & theory of change
story.append(Paragraph("2. Mission and Theory of Change", h1))
story.append(Paragraph(
    "HPG's public mission integrates four connected focus areas:", body))
story.extend(bullets([
    "<b>Education and Skill Development</b> - youth leadership, "
    "capacity building, mentorship, and access to learning.",
    "<b>Economic Empowerment</b> - livelihood pathways, small enterprise "
    "support, and workforce readiness through partner initiatives.",
    "<b>Human Rights and Social Justice</b> - advocacy, protection of "
    "dignity, and inclusion of underserved groups.",
    "<b>Community Development</b> - locally led programs that strengthen "
    "health, safety, and social infrastructure.",
]))
story.append(Paragraph("Four Delivery Pathways", h2))
story.extend(bullets([
    "<b>Fiscal sponsorship</b> - providing legal, financial, and "
    "compliance infrastructure to grassroots partners.",
    "<b>Program incubation</b> - helping early-stage initiatives "
    "operationalize, document, and scale.",
    "<b>Capacity building</b> - equipping partner organizations with "
    "systems for fundraising, reporting, and governance.",
    "<b>Cross-cultural leadership</b> - convening young leaders across "
    "regions to build shared humanitarian practice.",
]))
story.append(PageBreak())

# 3. 2024 foundation
story.append(Paragraph("3. 2024 - Foundation Year", h1))
story.append(Paragraph(
    "2024 was an infrastructure-oriented year. Recorded activity centered on "
    "program travel, technology, compliance, and fundraising systems that "
    "would allow HPG and its sponsored projects to operate at scale.", body))
story.append(Paragraph("Known 2024 Expense Snapshot", h2))
story.append(data_table(
    ["Line", "Amount / Percent"],
    [
        ["Total known expenses", "$2,754.73"],
        ["Program Services (functional mix)", "92.0%"],
        ["Management & General (functional mix)", "4.5%"],
        ["Fundraising (functional mix)", "3.6%"],
    ],
    col_widths=[4.0 * inch, 2.75 * inch],
))
story.append(Spacer(1, 0.15 * inch))
story.append(functional_pie_2024())
story.append(Paragraph("Examples of Supported Expenditures (with records)", h2))
story.extend(bullets([
    "TechSoup - nonprofit technology procurement.",
    "Zoom - convening and coordination platform.",
    "Michigan annual report - state compliance filing.",
    "GrantStation - grants research and prospecting platform.",
]))
story.append(notice_block(
    "<b>Important qualifier.</b> 2024 is presented as preliminary known-item "
    "reporting. Historical Relay bank coverage and opening/closing balances "
    "remained incomplete at the time of publication, so 2024 figures reflect "
    "only activity that could be controlled and reconciled to available "
    "source records."))
story.append(PageBreak())

# 4. 2025 expansion
story.append(Paragraph("4. 2025 - Expansion Year", h1))
story.append(Paragraph(
    "In 2025 HPG expanded its sponsored-project portfolio and its operational "
    "footprint. Financial coverage for HPG's own operating account became "
    "complete for the period, while documentation and governance approvals "
    "for related items remained open.", body))

story.append(Paragraph("Portfolio and Controlled Support", h2))
story.extend(bullets([
    "Sponsored-project portfolio previously confirmed at <b>15 projects</b>.",
    "Controlled 2025 financial project support flowed to <b>Humble "
    "Pathways</b>, <b>Project Wings Soaring</b>, and <b>Global Youth "
    "Leaders for Humanity (GYLFH)</b>.",
    "Complete connected HPG checking history for the period, with "
    "<b>92 posted transactions</b>. No activity before March 18, 2025 was "
    "reported.",
]))

story.append(Paragraph("GYLFH NEXT GEN Rising Summit (October 2025)", h2))
story.append(Paragraph(
    "The GYLFH NEXT GEN Rising summit was held in October 2025 with a "
    "finance, art, and leadership theme. Post-event participant reflections "
    "and debrief were collected. Attendance figures are not stated because "
    "consistent source records for attendance were not available at the time "
    "of publication.", body))

story.append(Paragraph("2025 Financial Snapshot (Preliminary)", h2))
story.append(data_table(
    ["Line", "Amount / Percent"],
    [
        ["Known revenue and support", "$1,750.00"],
        ["Known expenses", "$5,639.62"],
        ["Change in net assets", "($3,889.62)"],
        ["Program Services (functional mix)", "86.5%"],
        ["Management & General (functional mix)", "8.9%"],
        ["Fundraising (functional mix)", "4.6%"],
    ],
    col_widths=[4.0 * inch, 2.75 * inch],
))
story.append(Spacer(1, 0.15 * inch))
story.append(functional_bar_2025())

story.append(Paragraph("End-of-Year Financial Position (Accountability Context)", h2))
story.append(data_table(
    ["Line", "Preliminary Amount"],
    [
        ["Assets", "$1,013.20"],
        ["Liabilities", "$7,657.55"],
        ["Net assets", "($6,644.35)"],
        ["Year-end HPG checking cash", "$49.54"],
    ],
    col_widths=[4.0 * inch, 2.75 * inch],
))
story.append(Paragraph(
    "<i>All balance-sheet figures shown above are preliminary and are provided "
    "solely as accountability context. See the separate 2025 Preliminary "
    "Annual Financial Report for scope, methodology, and open items.</i>",
    body_small))
story.append(PageBreak())

# 5. Youth leadership
story.append(Paragraph("5. Youth Leadership - GYLFH", h1))
story.append(Paragraph(
    "The Global Youth Leaders for Humanity (GYLFH) initiative is HPG's "
    "public model for leadership, diplomacy, cross-cultural awareness, and "
    "social advocacy among young people.", body))
story.append(Paragraph("Documented Components", h2))
story.extend(bullets([
    "Multi-pillar curriculum spanning leadership, service, and civic "
    "engagement.",
    "Regional leadership roles connecting participants to local context.",
    "Global satellite concept for cross-regional collaboration.",
    "October 2025 NEXT GEN Rising summit with finance, art, and leadership "
    "theme.",
    "Post-event reflections and debriefs from summit participants.",
    "HPG Executive Academy advancement and certification pathway for "
    "continuing leaders.",
]))
story.append(Paragraph("Measures Not Currently Available", h2))
story.append(Paragraph(
    "The following measures are not stated in this report because consistent "
    "source records do not currently exist:", body))
story.extend(bullets([
    "Unique youth served.",
    "Demographic distribution of participants.",
    "Program completion rates.",
    "Long-term participant outcomes.",
]))
story.append(PageBreak())

# 6. Fiscal sponsorship / partner capacity
story.append(Paragraph("6. Fiscal Sponsorship and Partner Capacity", h1))
story.append(Paragraph(
    "HPG's fiscal sponsorship function is a core impact pathway. It provides "
    "the accounting, compliance, and infrastructure grassroots partners need "
    "to raise and steward funds responsibly.", body))
story.extend(bullets([
    "<b>Restricted and unrestricted fund separation</b> across sponsored "
    "projects.",
    "<b>Project transfers</b> retained as balance-sheet activity rather "
    "than automatically treated as revenue or expense.",
    "<b>Governance and compliance</b> structures supporting state and "
    "federal reporting.",
    "<b>GrantStation</b> and other fundraising pathways available to "
    "sponsored partners.",
    "<b>Website, collaboration tools, and data / reporting systems</b> "
    "that partners rely on operationally.",
    "<b>Cross-functional departments and regional coordination</b> "
    "supporting sponsored initiatives across regions.",
]))
story.append(notice_block(
    "<b>Clarification.</b> Geographic network and partner presence describe "
    "where HPG has operational relationships. They are not, and should not be "
    "read as, verified beneficiary counts."))
story.append(PageBreak())

# 7. Global operating capacity
story.append(Paragraph("7. Global Operating Capacity", h1))
story.append(Paragraph(
    "HPG has built layered organizational capacity to support current and "
    "future programming. The following layers are established without "
    "asserting specific employee counts.", body))
story.append(Paragraph("Executive Leadership Functions", h3))
story.append(Paragraph(
    "Finance, communications, technology, legal, operations, marketing, "
    "program, human resources, administration, development, and organizational "
    "efficiency.", body))
story.append(Paragraph("Specialist Director Functions", h3))
story.append(Paragraph(
    "Finance control, grant writing, fundraising, software engineering and "
    "DevOps, research analysis, digital platforms, and accounting.", body))
story.append(Paragraph("Regional Coordination", h3))
story.append(Paragraph(
    "Regional coordination is represented for <b>Asia</b>, <b>Latin "
    "America</b>, and <b>Europe</b>.", body))
story.append(Paragraph("Board and Committee Functions", h3))
story.append(Paragraph(
    "Finance, compliance, development, nominations, compensation, audit, and "
    "advisory work.", body))
story.append(PageBreak())

# 8. Evidence quality
story.append(Paragraph("8. Evidence Quality", h1))
story.append(Paragraph(
    "The table below summarizes the maturity of evidence in each area. No "
    "numeric scores are assigned. Status labels reflect the current state of "
    "documented, auditable records.", body))

_cell = ParagraphStyle("cell", parent=body, fontSize=9.5, leading=12, spaceAfter=0)
def _p(s): return Paragraph(s, _cell)
evidence_rows = [
    [_p("Financial stewardship"), _p("Strong"),
     _p("Connected bank history, reconciliations, and functional "
        "classification in place for 2025; controls maturing.")],
    [_p("Portfolio and partnerships"), _p("Established"),
     _p("Sponsored-project portfolio identified and tracked; onboarding "
        "and delivery stages vary by partner.")],
    [_p("Youth leadership delivery"), _p("Documented"),
     _p("GYLFH curriculum, summit, and reflections are documented; unique "
        "participant metrics are not yet standardized.")],
    [_p("Organizational capacity"), _p("Documented"),
     _p("Executive, specialist, regional, and board functions are "
        "established and identifiable.")],
    [_p("Partner-level outputs"), _p("Partial"),
     _p("Outputs exist for some partners; standardized quarterly reporting "
        "is not yet organization-wide.")],
    [_p("Beneficiary-level outcomes"), _p("Developing"),
     _p("Individual outcome data is not consistently captured across "
        "initiatives; a priority for 2026.")],
]
story.append(data_table(
    ["Area", "Status", "What this status means"],
    evidence_rows,
    col_widths=[1.9 * inch, 1.05 * inch, 3.8 * inch],
))
story.append(PageBreak())

# 9. Next measurement priorities
story.append(Paragraph("9. Next Measurement Priorities", h1))
story.extend(bullets([
    "Standardized <b>quarterly impact form</b> completed by every sponsored "
    "project and HPG initiative.",
    "<b>Unique participants</b>, services delivered, geography, age group, "
    "and gender where appropriate.",
    "<b>Completion and follow-up outcomes</b> tied to individual programs.",
    "<b>Photo and testimonial consent</b> processes and source "
    "documentation.",
    "Direct linkage of outputs to <b>budgets and restricted-fund "
    "reporting</b>.",
    "<b>Portfolio status dashboard</b> distinguishing active, onboarding, "
    "paused, and completed sponsored projects.",
    "<b>Baselines and targets</b> for GYLFH, workshops, training, "
    "fundraising support, and NGO capacity building.",
]))
story.append(PageBreak())

# 10. Forward commitments
story.append(Paragraph("10. 2026 Forward Commitments", h1))
story.extend(bullets([
    "Stronger project reporting from every sponsored initiative.",
    "Accountable fundraising with documented use of funds.",
    "Operationalize the global program model across regions.",
    "Improve public transparency through regularly published reports.",
    "Move toward participant- and community-level outcome evidence.",
]))

# Public-use notice / basis
story.append(Paragraph("11. Public-Use Notice and Basis", h2))
story.append(notice_block(
    "This report is <b>management-prepared</b>. It is not an independent "
    "evaluation, audit, or assurance report, and it is not an IRS Form 990 "
    "filing. The 15-project figure reflects previously confirmed HPG "
    "portfolio information; project stages may differ. Geographic references "
    "describe network, partner, and public footprint rather than verified "
    "beneficiaries in every location. Financial figures shown here must be "
    "read together with the separate HPG Preliminary Annual Financial "
    "Reports for 2024 and 2025. Where beneficiary evidence was incomplete, "
    "no estimates have been made."))
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph(
    "Prepared by Humanity Pathways Global management, July 16, 2026.", body_small))
story.append(Paragraph(
    f"Contact: {CONTACT_EMAIL}  -  {CONTACT_WEB}", body_small))


# --- Build -----------------------------------------------------------------
def build() -> None:
    doc = BaseDocTemplate(
        str(OUT), pagesize=LETTER,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=0.85 * inch, bottomMargin=0.85 * inch,
        title="HPG 2024-2025 Impact & Organizational Development Report",
        author="Humanity Pathways Global",
        subject="Management-prepared impact and organizational development report",
        creator="HPG report generator",
    )
    frame = Frame(MARGIN, 0.75 * inch,
                  PAGE_W - 2 * MARGIN, PAGE_H - 1.65 * inch, id="body")
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[frame], onPage=on_cover),
        PageTemplate(id="page", frames=[frame], onPage=on_page),
    ])
    doc.build(story)
    print(f"Wrote {OUT} ({OUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    build()
