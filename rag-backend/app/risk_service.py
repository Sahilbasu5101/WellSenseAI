import re
import logging
from typing import List, Dict, Any, Tuple, Optional

logger = logging.getLogger("risk_service")

# Known regional historical drilling hazards for realism and automatic inference
REGIONAL_FORMATION_HAZARDS = {
    "Tipam Sandstone": {
        "risk_type": "Severe Mud Loss / Lost Circulation",
        "severity": "High",
        "description": "Permeable, highly fractured sandstone with severe thief zones. Rapid pit level drop and loss of hydrostatic head.",
        "mitigation": "Spot 50-60 bbl LCM pill (medium mica flakes, calcium carbonate, and coarse walnut shells) with hesitation squeeze. Condition mud weight to 1.18 SG."
    },
    "Barail Coal Shale": {
        "risk_type": "Differentially Stuck Pipe / Sloughing Shale",
        "severity": "High",
        "description": "Depleted permeable sand-shale interbeds causing high differential pressure sticking and overpull exceeding 150,000 lbs.",
        "mitigation": "Spot weighted oil-based pipe-freeing pill (glycol/surfactant), activate hydraulic jars with 40,000 lbs downward impact, and optimize drill string rotation."
    },
    "Kopili Formation": {
        "risk_type": "Abnormal Pressure Gas Kick / Influx",
        "severity": "High",
        "description": "Overpressured reservoir streaks causing gas cut mud, pit gain, and rapid drilling breaks.",
        "mitigation": "Immediate soft shut-in on annular BOP. Execute Driller's Method to circulate out gas bubble and raise mud weight to 1.25+ SG with barite."
    },
    "Girujan Clay": {
        "risk_type": "Wellbore Instability / Bit Balling",
        "severity": "Medium",
        "description": "Reactive gumbo clay swelling and causing tight hole during tripping and increased torque.",
        "mitigation": "Maintain polyamine clay inhibitors in mud system and control tripping speeds to avoid swabbing."
    },
    "Namsang Formation": {
        "risk_type": "Loss of Circulation in Coarse Sands",
        "severity": "Medium",
        "description": "Unconsolidated gravel and coarse sand beds susceptible to induced fracture under high ECD.",
        "mitigation": "Reduce circulating rate and keep fibrous LCM on standby in active mud tanks."
    }
}

class PredictiveRiskService:
    @staticmethod
    def extract_risks_from_wells(nearby_wells: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Extracts historical risk incidents from nearby well objects.
        Supports:
        1. Explicit `incidents`, `events`, or `historical_risks` lists.
        2. Text descriptions in `operational_summary` or `completion_report`.
        3. Formations with mapped regional hazard data.
        """
        extracted_risks = []

        for well in nearby_wells:
            well_id = well.get("well_id", well.get("_id", "Unknown Well"))
            well_name = well.get("name", well_id)
            well_distance = well.get("distance", None)

            # 1. Check explicit incidents array
            for key in ["incidents", "events", "historical_risks", "anomalies", "drilling_events"]:
                if key in well and isinstance(well[key], list):
                    for inc in well[key]:
                        depth = inc.get("depth", inc.get("event_depth", inc.get("measured_depth")))
                        if depth is not None:
                            extracted_risks.append({
                                "well_id": well_id,
                                "well_name": well_name,
                                "distance_to_active_well": well_distance,
                                "risk_depth": float(depth),
                                "risk_type": inc.get("risk_type", inc.get("type", "Historical Drilling Anomaly")),
                                "formation": inc.get("formation", "Unknown"),
                                "description": inc.get("description", inc.get("narrative", "")),
                                "mitigation": inc.get("mitigation", "Standard well control protocol applied."),
                                "severity": inc.get("severity", "High")
                            })

            # 2. Check if well has a textual operational summary / report text
            summary_text = well.get("operational_summary", well.get("summary", well.get("narrative", "")))
            if summary_text and isinstance(summary_text, str):
                # Search for depths like "at 1240m" or "at 3100 meters"
                depth_matches = re.findall(r'(?:at|depth of|around)\s*(\d+(?:\.\d+)?)\s*(?:m|meters)', summary_text, re.IGNORECASE)
                for d_str in depth_matches:
                    depth_val = float(d_str)
                    risk_name = "Operational Incident"
                    if "mud loss" in summary_text.lower() or "lost circulation" in summary_text.lower():
                        risk_name = "Severe Mud Loss / Lost Circulation"
                    elif "stuck" in summary_text.lower():
                        risk_name = "Differentially Stuck Pipe"
                    elif "kick" in summary_text.lower() or "bop" in summary_text.lower():
                        risk_name = "Gas Influx / Kick"

                    extracted_risks.append({
                        "well_id": well_id,
                        "well_name": well_name,
                        "distance_to_active_well": well_distance,
                        "risk_depth": depth_val,
                        "risk_type": risk_name,
                        "formation": well.get("formation", "Known Interval"),
                        "description": summary_text[:200] + "...",
                        "mitigation": "Mitigated according to offset well report procedures.",
                        "severity": "High"
                    })

            # 3. Formations with mapped regional hazards
            formations = well.get("formations", [])
            if isinstance(formations, list):
                for form in formations:
                    form_name = form.get("name", "")
                    f_start = form.get("depth_start", 0)
                    f_end = form.get("depth_end", 0)
                    
                    if form_name in REGIONAL_FORMATION_HAZARDS:
                        hazard_info = REGIONAL_FORMATION_HAZARDS[form_name]
                        # Midpoint of formation or key transition depth
                        mid_depth = round((f_start + f_end) / 2.0, 1)
                        extracted_risks.append({
                            "well_id": well_id,
                            "well_name": well_name,
                            "distance_to_active_well": well_distance,
                            "risk_depth": mid_depth,
                            "depth_range": [f_start, f_end],
                            "risk_type": hazard_info["risk_type"],
                            "formation": form_name,
                            "description": hazard_info["description"],
                            "mitigation": hazard_info["mitigation"],
                            "severity": hazard_info["severity"]
                        })

        return extracted_risks

    @classmethod
    def evaluate_risk(
        cls,
        current_depth: float,
        formation: str,
        nearby_wells_data: List[Dict[str, Any]],
        threshold_meters: float = 50.0
    ) -> Dict[str, Any]:
        """
        Checks if current_depth is within 50 meters of any historical risks in nearby_wells_data.
        Returns risk_level (High | Medium | Low | Safe), alert_message, and historical_context.
        """
        all_risks = cls.extract_risks_from_wells(nearby_wells_data)
        
        correlated_events = []
        for risk in all_risks:
            risk_depth = risk["risk_depth"]
            depth_delta = abs(current_depth - risk_depth)
            
            # Check within 50m of exact event depth
            is_within_threshold = depth_delta <= threshold_meters
            
            # Also check if inside formation depth range if provided
            depth_range = risk.get("depth_range")
            in_formation_window = False
            if depth_range:
                # Within 50m of formation interval boundaries or inside it
                f_start, f_end = depth_range
                in_formation_window = (f_start - threshold_meters) <= current_depth <= (f_end + threshold_meters)
            
            if is_within_threshold or in_formation_window:
                risk_copy = dict(risk)
                risk_copy["depth_delta_meters"] = round(depth_delta, 1)
                correlated_events.append(risk_copy)

        # Sort correlated events by closest depth delta
        correlated_events.sort(key=lambda x: x["depth_delta_meters"])

        # Determine Risk Level and construct Response
        if not correlated_events:
            return {
                "risk_level": "Safe",
                "alert_message": f"Safe: Current depth {current_depth:.1f}m is clear of all known historical drilling hazards within {threshold_meters:.0f}m.",
                "historical_context": (
                    f"No critical operational anomalies (mud losses, stuck pipe, kicks) were recorded within a "
                    f"±{threshold_meters:.0f}m depth window across {len(nearby_wells_data)} offset historical wells. "
                    f"Formation '{formation}' shows stable wellbore integrity at this depth interval."
                ),
                "correlated_incidents": []
            }

        # We have correlated risks within 50m!
        closest = correlated_events[0]
        delta = closest["depth_delta_meters"]
        risk_type = closest["risk_type"]
        well_name = closest["well_name"]
        risk_depth = closest["risk_depth"]
        mitigation = closest["mitigation"]

        # Classification rules:
        # If delta <= 20m or high-severity risk (mud loss, kick, stuck pipe): High
        # If 20m < delta <= 50m: Medium
        # If beyond 50m: Low
        if delta <= 20.0 or "Loss" in risk_type or "Stuck" in risk_type or "Kick" in risk_type:
            risk_level = "High"
        elif delta <= 50.0:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        alert_message = (
            f"CRITICAL DRILLING ALERT [{risk_level.upper()} RISK]: Current depth {current_depth:.1f}m is within "
            f"{delta:.1f}m of a historical {risk_type} incident recorded at {risk_depth:.1f}m in offset well {well_name}."
        )

        # Build comprehensive historical context
        historical_context = (
            f"### Offset Historical Well Hazard Analysis\n\n"
            f"- **Target Formation:** {formation}\n"
            f"- **Closest Incident:** {risk_type} at {risk_depth:.1f}m in `{well_name}` (Offset delta: {delta:.1f}m)\n"
            f"- **Geological / Mechanical Context:** {closest.get('description', 'Formation zone prone to pressure instability.')}\n"
            f"- **Recommended Mitigation Protocol:** {mitigation}\n\n"
            f"**Total Correlated Offset Risks:** {len(correlated_events)} historical event(s) detected in the vicinity."
        )

        return {
            "risk_level": risk_level,
            "alert_message": alert_message,
            "historical_context": historical_context,
            "correlated_incidents": correlated_events
        }

risk_service = PredictiveRiskService()
