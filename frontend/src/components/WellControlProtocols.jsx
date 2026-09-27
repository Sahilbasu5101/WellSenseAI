import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Bot,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Layers,
  ArrowRight,
  FileText,
} from 'lucide-react';

const PROTOCOLS_DATA = [
  {
    id: 'lost-circulation',
    category: 'Lost Circulation Mitigation',
    threatLevel: 'High',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    summary:
      'Procedures for rapid thief zone isolation, LCM fiber bridging, hesitation squeeze, and ECD stabilization in fractured Tipam and Namsang sands.',
    targetFormation: 'Tipam Sandstone & Namsang Formation (1,100m – 2,450m)',
    steps: [
      {
        stepNumber: 1,
        title: 'Loss Detection & Severity Classification',
        description:
          'Continuously monitor active pit level sensors and flow paddle telemetry. Classify seepage (<10 bbl/hr), partial loss (10–40 bbl/hr), or severe thief zone (>40 bbl/hr).',
        offsetCitation: null,
      },
      {
        stepNumber: 2,
        title: 'Stop Rotary Drilling & Pick Up Off Bottom',
        description:
          'Immediately stop rotary table, pick up drill string 3–5 meters off bottom, reduce pump discharge to minimum circulating rate (150 GPM) to prevent dynamic fracture extension.',
        offsetCitation: 'Based on success in Offset Well DLJN-04',
      },
      {
        stepNumber: 3,
        title: 'Formulate & Spot 60 bbl Engineered LCM Pill',
        description:
          'Prepare active pill containing 25 ppb medium mica flakes, 15 ppb acid-soluble calcium carbonate (coarse/medium blend), and 10 ppb coarse walnut shell nut plug. Spot across thief zone.',
        offsetCitation: 'Based on success in Offset Well DLJN-HST-002',
      },
      {
        stepNumber: 4,
        title: 'Hesitation Squeeze Protocol',
        description:
          'Execute hesitation squeeze pumping 2–3 bbls every 10–15 minutes under 50–100 psi surface pressure. Allow fiber matrix to bridge permeability throats and establish filter cake.',
        offsetCitation: 'North Sea HPHT Analog SOP-41',
      },
      {
        stepNumber: 5,
        title: 'Condition Mud Weight & Confirm Full Returns',
        description:
          'Condition active mud weight to 1.18 SG with fine polymer deflocculants. Circulate bottoms-up at staged rates (200 -> 400 -> 600 GPM) while verifying 100% flow returns.',
        offsetCitation: 'Based on success in Offset Well DLJN-04',
      },
    ],
  },
  {
    id: 'stuck-pipe',
    category: 'Stuck Pipe Release Operations',
    threatLevel: 'High',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    summary:
      'Remediation protocols for differential pressure sticking and sloughing coal bands in Barail interbeds; jarring dynamics and pipe-freeing pill soak.',
    targetFormation: 'Barail Coal Shale (2,450m – 3,950m)',
    steps: [
      {
        stepNumber: 1,
        title: 'Diagnostic Verification of Sticking Mechanism',
        description:
          'Verify differential sticking: confirm full mud circulation is maintained with zero string rotation or axial movement after static tool face survey (>30 mins static time).',
        offsetCitation: null,
      },
      {
        stepNumber: 2,
        title: 'Immediate Jarring Dynamics (Opposite Direction of Stuck)',
        description:
          'For differential sticking occurring while stationary on bottom, apply maximum allowable downward jarring impact (35,000–45,000 lbs) with torque trapped in string.',
        offsetCitation: 'Based on success in Offset Well DLJN-HST-006',
      },
      {
        stepNumber: 3,
        title: 'Spot 55 bbl Weighted Oil-Based Freeing Pill',
        description:
          'Displace a 55 bbl pipe-freeing pill (glycol/surfactant blend weighted to 1.14 SG) to cover the entire stuck BHA plus 50m above. Soak for 4 hours while intermittently jarring.',
        offsetCitation: 'Based on success in Offset Well DLJN-04',
      },
      {
        stepNumber: 4,
        title: 'Controlled Hydrostatic Overbalance Relief',
        description:
          'With superintendent authorization, bleed annulus pressure or displace lighter mud to lower hydrostatic overbalance by 0.03–0.05 SG, reducing differential sticking force.',
        offsetCitation: 'Barail Coal Shale Field Protocol',
      },
      {
        stepNumber: 5,
        title: 'Free String & Ream Interval',
        description:
          'Once movement is regained, work string gradually with continuous low RPM (30–40 RPM). Back-ream the entire interval with high viscous sweeps before resuming drilling.',
        offsetCitation: 'Based on success in Offset Well DLJN-HST-006',
      },
    ],
  },
  {
    id: 'kick-blowout',
    category: 'Kick & Blowout Prevention',
    threatLevel: 'Critical',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    summary:
      'Standard operating procedures for early influx detection, soft shut-in, Driller’s Method circulation, and acoustic cement barrier verification in overpressured Kopili streaks.',
    targetFormation: 'Kopili Formation (3,200m – 3,750m)',
    steps: [
      {
        stepNumber: 1,
        title: 'Early Influx Detection & Flow Check',
        description:
          'On observing rapid ROP drilling break (>25% increase) or pit gain exceeding 5 bbls, stop pumps immediately, space out drill pipe tool joint above rotary table, and perform 2-minute flow check.',
        offsetCitation: null,
      },
      {
        stepNumber: 2,
        title: 'Execute Soft Shut-In Protocol',
        description:
          'Open remote hydraulic choke valve, close annular BOP, then close choke valve while monitoring pressure buildup. Verify complete well shut-in with zero flow.',
        offsetCitation: 'API Standard 53 & Macondo Analog',
      },
      {
        stepNumber: 3,
        title: 'Record Stabilized Pressures (SIDPP & SICP)',
        description:
          'Record shut-in drill pipe pressure (SIDPP) and shut-in casing pressure (SICP) every 2 minutes until stabilized. Calculate kill mud weight: KMW = OMW + (SIDPP / (0.052 * TVD)).',
        offsetCitation: 'Based on success in Offset Well DLJN-HST-008',
      },
      {
        stepNumber: 4,
        title: 'Execute Driller’s Method Displacement',
        description:
          '1st Circulation: Pump original mud weight at constant kill rate holding casing pressure constant to circulate out gas bubble. 2nd Circulation: Displace kill mud weighted to 1.28 SG with barite.',
        offsetCitation: 'Based on success in Offset Well DLJN-04',
      },
      {
        stepNumber: 5,
        title: 'Ultrasonic Cement Barrier Evaluation',
        description:
          'Before perforating or setting production packer, perform ultrasonic radial bond logging (USIT/VDL) and conduct negative pressure drawdown test to verify barrier isolation.',
        offsetCitation: 'Deepwater Horizon Investigation SOP-12',
      },
    ],
  },
];

export default function WellControlProtocols({ onAskAi }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSections, setOpenSections] = useState({
    'lost-circulation': true,
    'stuck-pipe': true,
    'kick-blowout': true,
  });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    setOpenSections({
      'lost-circulation': true,
      'stuck-pipe': true,
      'kick-blowout': true,
    });
  };

  const handleCollapseAll = () => {
    setOpenSections({
      'lost-circulation': false,
      'stuck-pipe': false,
      'kick-blowout': false,
    });
  };

  // Search filtering
  const filteredProtocols = useMemo(() => {
    if (!searchTerm.trim()) return PROTOCOLS_DATA;
    const term = searchTerm.toLowerCase();

    return PROTOCOLS_DATA.map((category) => {
      const categoryMatches =
        category.category.toLowerCase().includes(term) ||
        category.summary.toLowerCase().includes(term) ||
        category.targetFormation.toLowerCase().includes(term);

      const matchedSteps = category.steps.filter(
        (step) =>
          step.title.toLowerCase().includes(term) ||
          step.description.toLowerCase().includes(term) ||
          (step.offsetCitation && step.offsetCitation.toLowerCase().includes(term))
      );

      if (categoryMatches || matchedSteps.length > 0) {
        return {
          ...category,
          steps: matchedSteps.length > 0 ? matchedSteps : category.steps,
        };
      }
      return null;
    }).filter(Boolean);
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-y-auto select-none p-3 sm:p-4 space-y-3.5">
      {/* 1. TOP HEADER & SEARCH BAR */}
      <div className="p-3 sm:p-4 bg-slate-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-100 text-[#0077c8]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                AI-Suggested Well Control & Mitigation Protocols
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0077c8] font-bold text-[10px]">
                Institutional Memory RAG
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              Standard Operating Procedures (SOPs) Synthesized from Historical Well Incidents & Analogs
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAll}
            className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-md transition-colors shadow-2xs"
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-md transition-colors shadow-2xs"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER INPUT BAR */}
      <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-2xs flex items-center justify-between gap-3 shrink-0">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search specific procedures, LCM pills, jarring, or offset citations..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077c8] focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 hidden sm:flex">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Verified against 4 OIL Assam Basin completion records</span>
        </div>
      </div>

      {/* 3. ACCORDION / COLLAPSIBLE LIST */}
      <div className="space-y-3 flex-1">
        {filteredProtocols.length > 0 ? (
          filteredProtocols.map((category) => {
            const isOpen = !!openSections[category.id];

            return (
              <div
                key={category.id}
                className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(category.id)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50/70 transition-colors focus:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-[#0077c8] shrink-0 mt-0.5">
                      <Layers className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                          {category.category}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${category.badgeColor}`}
                        >
                          {category.threatLevel} Priority
                        </span>
                        <span className="text-[11px] font-mono text-gray-500">
                          • {category.steps.length} SOP Steps
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 max-w-3xl leading-relaxed">
                        {category.summary}
                      </p>
                      <div className="text-[10px] text-blue-700 font-semibold mt-1">
                        Target Interval: {category.targetFormation}
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-full bg-slate-100 text-gray-600 shrink-0 mt-1">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Accordion Content: Step-by-Step Procedures with Badges */}
                {isOpen && (
                  <div className="border-t border-gray-100 bg-slate-50/40 p-3 sm:p-4 space-y-3">
                    <div className="space-y-2.5">
                      {category.steps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="p-3 bg-white border border-gray-200 rounded-lg shadow-2xs hover:border-blue-200 transition-colors flex items-start gap-3"
                        >
                          {/* Step Number Circle */}
                          <div className="w-6 h-6 rounded-full bg-[#0077c8] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {step.stepNumber}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                              <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                                {step.title}
                              </h4>

                              {/* Prominent Institutional Memory Badge */}
                              {step.offsetCitation && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs shrink-0">
                                  <Sparkles className="w-3 h-3 text-[#0077c8]" />
                                  <span>{step.offsetCitation}</span>
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-gray-600 leading-relaxed font-sans">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom AI Prompt Action */}
                    {onAskAi && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            const query = `What are the step-by-step drilling execution procedures and offset well evidence for: "${category.category}" in ${category.targetFormation}?`;
                            onAskAi(query);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0077c8] font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200 shadow-2xs"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Consult Knowledge Base AI on {category.category} →</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 bg-white rounded-xl border border-gray-200 text-center text-xs text-gray-500 space-y-2">
            <p className="font-semibold text-gray-700">No matching protocols found.</p>
            <p className="text-[11px] text-gray-400">
              Try adjusting your query (e.g. search "LCM", "jarring", or "kick").
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-1 bg-blue-50 text-[#0077c8] font-bold rounded text-xs"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
