import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib import colors

def create_pdf(filename: str, title: str, sections: list):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f2b48'),
        spaceAfter=12
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1d4ed8'),
        spaceBefore=10,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1f2937'),
        spaceAfter=8
    )

    story = [Paragraph(title, title_style), Spacer(1, 10)]
    for heading, text in sections:
        story.append(Paragraph(heading, heading_style))
        story.append(Paragraph(text, body_style))
        story.append(Spacer(1, 6))

    doc.build(story)
    print(f"Generated: {filename}")

def main():
    output_dir = os.path.join(os.path.dirname(__file__), "sample_docs")
    
    # Doc 1: Deepwater Horizon
    create_pdf(
        os.path.join(output_dir, "deepwater_horizon_incident.pdf"),
        "Incident Investigation: Deepwater Horizon Macondo Well Blowout (2010)",
        [
            ("1. Executive Summary", 
             "On April 20, 2010, the Deepwater Horizon drilling rig operating in Mississippi Canyon Block 252 experienced a catastrophic blowout, explosion, and fire. The incident resulted from a failure of primary well control barriers followed by unsuccessful actuation of the subsea Blowout Preventer (BOP) stack."),
            ("2. Well Control Barrier Breakdown", 
             "Investigation revealed that the nitrogen-foamed cement slurry pumped at the shoe track of the 9-7/8 inch production casing failed to isolate hydrocarbons in the pay zone. Hydrocarbons entered the wellbore undetected until gas expanded above the subsea wellhead."),
            ("3. Negative Pressure Test Anomalies", 
             "A critical negative pressure test conducted prior to temporary abandonment exhibited 1,400 psi on the drill pipe while zero pressure was measured on the kill line. Rig personnel misinterpreted this differential pressure as a 'bladder effect' or thermal artifact rather than an ongoing hydrocarbon kick."),
            ("4. Blowout Preventer (BOP) Failure Analysis", 
             "When hydrocarbons breached the surface, the annular preventers were closed, but high fluid velocity eroded the packing element. Subsequent activation of the blind shear rams (BSR) failed to seal the well because the drill pipe had buckled off-center under extreme differential pressure and mechanical compression.")
        ]
    )
    
    # Doc 2: Montara Wellhead Blowout
    create_pdf(
        os.path.join(output_dir, "montara_wellhead_blowout.pdf"),
        "Historical Drilling Incident Review: Montara Wellhead Platform (2009)",
        [
            ("1. Operational Context", 
             "On August 21, 2009, an uncontrolled release of oil and gas occurred at the Montara wellhead platform in the Timor Sea, offshore Western Australia, during batch drilling operations on well H1-ST1."),
            ("2. Primary Containment Failure", 
             "The 9-5/8 inch casing shoe cement job had failed during installation. A primary barrier was not successfully established, allowing reservoir fluids to migrate up the casing annulus. No pressure testing was performed on the secondary mechanical barriers prior to suspending operations."),
            ("3. Pressure Transient & Kick Dynamics", 
             "During the removal of the corrosion cap, an uncontrolled influx of light crude and reservoir gas occurred. Wellbore hydrostatic pressure was insufficient due to an under-balanced fluid column of light brine without proper weighting material."),
            ("4. Regulatory & Remediation Findings", 
             "The Montara Commission of Inquiry noted systemic deficiencies in barrier policy enforcement, casing centralization, and well suspension verification. The blowout was finally killed via relief well drilling after five attempts.")
        ]
    )

    # Doc 3: North Sea HPHT Lost Circulation
    create_pdf(
        os.path.join(output_dir, "north_sea_hpht_lost_circulation.pdf"),
        "Field Case Study: North Sea HPHT Lost Circulation and Induced Kick (2015)",
        [
            ("1. Drilling Profile & Geology", 
             "While drilling the 8-1/2 inch section of an offshore High-Pressure High-Temperature (HPHT) exploratory well at 16,800 feet true vertical depth (TVD), total lost circulation was encountered in a fractured chalk reservoir."),
            ("2. Lost Circulation Event", 
             "A sudden drop in pit volume of 180 barrels occurred within 12 minutes. The equivalent circulating density (ECD) of 15.2 ppg exceeded the formation breakdown pressure, creating open fractures and rapidly lowering the liquid hydrostatic head in the annulus."),
            ("3. Secondary Influx (Kick)", 
             "As the fluid level dropped by over 1,200 feet, bottom-hole pressure fell below reservoir pore pressure (14.6 ppg equivalent), resulting in an immediate 35-barrel gas kick. Surface telemetry showed a rapid increase in standpipe pressure and gas units on the mud loggers."),
            ("4. Well Control Response", 
             "The crew executed a soft shut-in: spaced out drill string, stopped rotary pumps, and closed the upper annular preventer. A high-density crosslinked polymer Lost Circulation Material (LCM) pill was pumped down drill pipe, followed by the Driller's Method circulation to remove gas influx.")
        ]
    )

if __name__ == "__main__":
    main()
