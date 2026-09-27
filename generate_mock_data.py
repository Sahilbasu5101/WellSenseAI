import os
import json
import math
import random
from fpdf import FPDF
from fpdf.enums import XPos, YPos

# --- Configuration ---
CENTER_LAT = 27.3653   # Duliajan / Upper Assam Basin
CENTER_LON = 95.3197
RADIUS_KM = 15.0
TOTAL_WELLS = 15
ACTIVE_WELLS = 1
HISTORICAL_WELLS = 14

# Realistic regional geological formations
FORMATIONS = [
    "Alluvium",
    "Namsang Formation",
    "Girujan Clay",
    "Tipam Sandstone",
    "Barail Coal Shale",
    "Kopili Formation"
]

def generate_random_location(center_lat: float, center_lon: float, radius_km: float):
    """Generates a random Lat/Lon uniformly distributed within a given radius in km."""
    r_earth = 6371.0  # Earth's radius in km
    
    # Uniform random distribution within a circle
    r = radius_km * math.sqrt(random.random())
    theta = 2 * math.pi * random.random()
    
    # Calculate offsets in km
    dx = r * math.cos(theta)
    dy = r * math.sin(theta)
    
    # Convert offsets to degrees
    delta_lat = (dy / r_earth) * (180 / math.pi)
    delta_lon = (dx / r_earth) * (180 / math.pi) / math.cos(center_lat * math.pi / 180)
    
    # GeoJSON coordinates format is [Longitude, Latitude]
    return round(center_lon + delta_lon, 6), round(center_lat + delta_lat, 6)

def generate_formations(total_depth: int):
    """Splits the well depth into contiguous geological formations."""
    num_formations = random.randint(3, 5)
    selected = random.sample(FORMATIONS, num_formations)
    
    formations_data = []
    current_depth = 0
    
    for i in range(num_formations):
        if i == num_formations - 1:
            depth_end = total_depth
        else:
            remaining_depth = total_depth - current_depth
            max_step = remaining_depth - (num_formations - 1 - i) * 250
            step = random.randint(300, max(400, int(max_step)))
            depth_end = current_depth + step
            
        formations_data.append({
            "name": selected[i],
            "depth_start": current_depth,
            "depth_end": depth_end
        })
        current_depth = depth_end
        
    return formations_data

def generate_wells_json(output_file: str = "wells_data.json"):
    """Generates the array of 15 dummy wells (1 Active, 14 Historical)."""
    wells = []
    
    # Well 0 is Active, Wells 1..14 are Historical
    for i in range(TOTAL_WELLS):
        is_active = (i < ACTIVE_WELLS)
        status = "Active" if is_active else "Historical"
        prefix = "DLJN-ACT" if is_active else "DLJN-HST"
        well_num_str = str(i + 1).zfill(3)
        
        total_depth = random.randint(2800, 4600)
        lon, lat = generate_random_location(CENTER_LAT, CENTER_LON, RADIUS_KM)
        
        well = {
            "well_id": f"W-{well_num_str}",
            "name": f"{prefix}-{well_num_str}",
            "status": status,
            "location": {
                "type": "Point",
                "coordinates": [lon, lat]  # [Longitude, Latitude]
            },
            "total_depth": total_depth,
            "formations": generate_formations(total_depth)
        }
        wells.append(well)
        
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(wells, f, indent=4)
        
    print(f"Generated {output_file} successfully with {len(wells)} wells (1 Active, 14 Historical).")
    return wells

class CompletionReportPDF(FPDF):
    """Custom styled PDF for Well Completion Reports."""
    def header(self):
        self.set_fill_color(15, 43, 72)  # Dark Navy
        self.rect(0, 0, 210, 20, 'F')
        self.set_text_color(255, 255, 255)
        self.set_font("helvetica", 'B', 12)
        self.set_xy(10, 5)
        self.cell(190, 10, text="OFFSHORE & BASIN DRILLING OPERATIONS - WELL COMPLETION REPORT", align='C')
        self.ln(18)
        self.set_text_color(33, 37, 41)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, text=f"Confidential & Proprietary Drilling Records | Page {self.page_no()}", align='C')

def generate_well_reports(wells, output_dir: str = "reports"):
    """Generates rich PDF reports for 3 historical wells for RAG ingestion."""
    os.makedirs(output_dir, exist_ok=True)
    
    historical_wells = [w for w in wells if w["status"] == "Historical"]
    selected_wells = random.sample(historical_wells, 3)
    
    # 3 distinct rich RAG scenarios with operational drilling details
    scenarios = [
        {
            "title": "Severe Lost Circulation & Mud Weight Depletion Event",
            "narrative": (
                "At {depth}m in {well_name}, while penetrating the {formation} sandstone formation, "
                "the drilling crew encountered a severe loss zone with an abrupt pit volume decrease of 120 barrels "
                "in less than 15 minutes. Standpipe pressure dropped from 2,800 psi to 1,950 psi, indicating loss "
                "of hydrostatic head. Drilling was immediately halted and the string spaced out. "
                "Mitigation: The crew mixed and pumped a 60 bbl high-squeeze Lost Circulation Material (LCM) pill "
                "comprising medium-grade mica flakes, graded calcium carbonate, and coarse walnut shells. "
                "The pill was spotted across the fracture zone and allowed to soak under 300 psi hesitation squeeze. "
                "After 4.5 hours of static soak and staging circulation at 180 gpm, fluid returns stabilized at 100%. "
                "Mud weight was reconditioned to 1.18 SG with barite before resuming rotary drilling."
            )
        },
        {
            "title": "Differential Pipe Sticking & Chemical Spotting Pill Remediation",
            "narrative": (
                "While tripping out of hole at {depth}m within the {formation} coal-shale boundary, "
                "the Bottom Hole Assembly (BHA) became differentially stuck against a permeable filter cake. "
                "Initial attempts to work the drill string resulted in an overpull exceeding 165,000 lbs above neutral weight, "
                "with zero rotary torque transmission. "
                "Mitigation: The drilling engineer initiated emergency stuck-pipe procedures. An oil-based pipe-freeing pill "
                "(55 bbl weighted surfactant and glycol mixture) was pumped and spotted directly across the BHA and drill collars. "
                "The string was soaked for 5 hours while applying 40,000 lbs downward jarring impact with hydraulic jars. "
                "The string came free on the 14th jar cycle. The wellbore was subsequently back-reamed and wiper trips conducted "
                "with increased flow rate (450 gpm) to clean excessive cuttings and stabilize wellbore geometry."
            )
        },
        {
            "title": "Underbalanced Gas Influx (Kick) Detection & BOP Well Control Response",
            "narrative": (
                "At {depth}m in {well_name}, an influx of formation gas was encountered upon entering the pressurized "
                "{formation} reservoir. Mud logging telemetry detected a rapid 25-barrel pit gain accompanied by an abrupt "
                "drilling break (ROP spike from 8 m/hr to 28 m/hr) and gas units surging from 45 to 820 units. "
                "Mitigation: The driller immediately executed a space-out and soft shut-in: pumps were stopped, flow checked positive, "
                "and the upper annular Blowout Preventer (BOP) was hydraulically actuated. Shut-In Drill Pipe Pressure (SIDPP) stabilized at 420 psi "
                "and Shut-In Casing Pressure (SICP) stabilized at 580 psi. "
                "The well control team executed the Driller's Method: Stage 1 circulated out the gas bubble through the adjustable choke manifold "
                "at a constant kill rate of 30 spm while holding drill pipe pressure constant. Stage 2 weighted the active mud system "
                "from 1.14 SG to 1.26 SG with powdered barite. Once kill mud circulated bottoms-up, zero pressure was observed on both gauges, "
                "and wellbore integrity was successfully restored."
            )
        }
    ]
    
    generated_files = []
    
    for idx, well in enumerate(selected_wells):
        pdf = CompletionReportPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        
        # Section 1: Well Identification
        pdf.set_font("helvetica", 'B', 13)
        pdf.set_text_color(29, 78, 216)  # Deep Blue
        pdf.cell(0, 8, text=f"1. Well Identification & Summary: {well['name']} ({well['well_id']})", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_text_color(33, 37, 41)
        pdf.set_font("helvetica", '', 10)
        
        col_w1, col_w2 = 60, 130
        pdf.cell(col_w1, 6, text="Well ID:", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w2, 6, text=well['well_id'], new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.cell(col_w1, 6, text="Operational Status:", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w2, 6, text=f"{well['status']} (Completed & Plugged)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.cell(col_w1, 6, text="Total Depth (TD):", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w2, 6, text=f"{well['total_depth']} meters (Measured Depth)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.cell(col_w1, 6, text="Geographic Coordinates:", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w2, 6, text=f"Latitude: {well['location']['coordinates'][1]} N, Longitude: {well['location']['coordinates'][0]} E", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(4)
        
        # Section 2: Stratigraphy
        pdf.set_font("helvetica", 'B', 13)
        pdf.set_text_color(29, 78, 216)
        pdf.cell(0, 8, text="2. Geological Formations & Lithology Profile", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_text_color(33, 37, 41)
        
        # Table Header
        pdf.set_font("helvetica", 'B', 10)
        pdf.set_fill_color(240, 243, 246)
        pdf.cell(80, 7, text="Formation Name", border=1, fill=True)
        pdf.cell(55, 7, text="Depth Interval (m)", border=1, fill=True)
        pdf.cell(55, 7, text="Gross Interval (m)", border=1, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        
        pdf.set_font("helvetica", '', 9)
        for form in well['formations']:
            thickness = form['depth_end'] - form['depth_start']
            pdf.cell(80, 6, text=f"  {form['name']}", border=1)
            pdf.cell(55, 6, text=f"  {form['depth_start']}m - {form['depth_end']}m", border=1)
            pdf.cell(55, 6, text=f"  {thickness} meters", border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(5)
        
        # Section 3: Operational History & Anomaly Report
        scenario = scenarios[idx]
        event_formation = well['formations'][len(well['formations']) // 2]
        event_depth = random.randint(event_formation['depth_start'] + 20, event_formation['depth_end'] - 20)
        
        pdf.set_font("helvetica", 'B', 13)
        pdf.set_text_color(29, 78, 216)
        pdf.cell(0, 8, text="3. Operational Chronology & Critical Drilling Event", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_text_color(33, 37, 41)
        
        pdf.set_font("helvetica", 'B', 10)
        pdf.cell(0, 6, text=f"Critical Incident: {scenario['title']}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font("helvetica", '', 9.5)
        
        detailed_narrative = scenario['narrative'].format(
            depth=event_depth,
            well_name=well['name'],
            formation=event_formation['name']
        )
        
        full_text = (
            f"Spud operations for {well['name']} commenced following standard pre-spud safety meetings. "
            f"Conductor casing (20-inch) was driven to 120m, followed by 13-3/8 inch surface casing set and "
            f"cemented at 650m with class G cement. \n\n"
            f"{detailed_narrative}\n\n"
            f"Subsequent to resolving the anomaly, drilling proceeded to target total depth of {well['total_depth']}m. "
            f"A comprehensive wireline logging suite (Gamma Ray, Resistivity, Sonic, and Density-Neutron) was acquired. "
            f"7-inch production liner was successfully installed and pressure tested to 5,000 psi. The well was safely suspended."
        )
        
        pdf.multi_cell(0, 5.5, text=full_text)
        
        filename = os.path.join(output_dir, f"{well['well_id']}_{well['name']}_Completion_Report.pdf")
        pdf.output(filename)
        generated_files.append(filename)
        print(f"Generated PDF Report: {filename}")
        
    return generated_files

if __name__ == "__main__":
    print("=" * 60)
    print("OIL DRILLING ANALYTICS PLATFORM - MOCK DATA GENERATOR")
    print("=" * 60)
    
    # 1. Generate wells_data.json (15 wells: 1 active, 14 historical)
    wells = generate_wells_json("wells_data.json")
    
    # 2. Generate 3 PDF Completion Reports for RAG
    reports = generate_well_reports(wells, "reports")
    
    print("\nGeneration Complete:")
    print(f"- JSON Dataset: wells_data.json ({len(wells)} wells: 1 Active, 14 Historical)")
    print(f"- PDF Reports: {len(reports)} files in 'reports/' directory")
