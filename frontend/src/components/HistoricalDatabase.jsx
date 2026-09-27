import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileText,
  ExternalLink,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Download,
  Eye,
  X,
  Layers,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';

const INITIAL_HISTORICAL_WELLS = [
  {
    well_id: 'W-002',
    name: 'DLJN-HST-002',
    distance: '3.2 km NW',
    distanceMeters: 3200,
    target_depth: 3950,
    formation: 'Tipam Sandstone',
    incident_type: 'Mud Loss',
    severity: 'High',
    primary_risk: 'Severe Mud Loss at 1240m (120 bbl drop)',
    spud_date: '14-Mar-2019',
    completion_date: '28-Jun-2019',
    summary:
      'Sudden lost circulation encountered in porous fractured Tipam sandstone at 1240m. Static pit level dropped 120 bbls within 15 mins. Cured by spotting 60 bbl LCM pill with mica and coarse walnut shells.',
    formations: [
      { name: 'Alluvium', from: 0, to: 420 },
      { name: 'Girujan Clay', from: 420, to: 1100 },
      { name: 'Tipam Sandstone', from: 1100, to: 2450 },
      { name: 'Barail Coal Shale', from: 2450, to: 3950 },
    ],
  },
  {
    well_id: 'W-005',
    name: 'DLJN-HST-005',
    distance: '4.8 km S',
    distanceMeters: 4800,
    target_depth: 3600,
    formation: 'Namsang Formation',
    incident_type: 'Mud Loss',
    severity: 'Medium',
    primary_risk: 'Loss of Circulation in Coarse Sands (1264m)',
    spud_date: '08-Jan-2020',
    completion_date: '19-Apr-2020',
    summary:
      'Seepage losses averaging 15 bbl/hr in unconsolidated gravel beds of upper Namsang sands. Treated with fibrous nut plug and reduced pump discharge to 550 GPM.',
    formations: [
      { name: 'Alluvium', from: 0, to: 380 },
      { name: 'Namsang Formation', from: 380, to: 1400 },
      { name: 'Tipam Sandstone', from: 1400, to: 2600 },
      { name: 'Barail Coal Shale', from: 2600, to: 3600 },
    ],
  },
  {
    well_id: 'W-006',
    name: 'DLJN-HST-006',
    distance: '7.8 km E',
    distanceMeters: 7800,
    target_depth: 4200,
    formation: 'Barail Coal Shale',
    incident_type: 'Stuck Pipe',
    severity: 'High',
    primary_risk: 'Differentially Stuck Pipe at 3140m (Overpull 165k lbs)',
    spud_date: '22-Aug-2021',
    completion_date: '05-Dec-2021',
    summary:
      'Differential sticking occurred during 45 min static survey across depleted sandstone stringers in Barail Coal Shale. Overpull exceeded 165,000 lbs. Spotted 55 bbl oil-based freeing pill and fired hydraulic jars at 40,000 lbs downward impact.',
    formations: [
      { name: 'Alluvium', from: 0, to: 450 },
      { name: 'Tipam Sandstone', from: 1200, to: 2500 },
      { name: 'Barail Coal Shale', from: 2500, to: 4200 },
    ],
  },
  {
    well_id: 'W-008',
    name: 'DLJN-HST-008',
    distance: '11.4 km NE',
    distanceMeters: 11400,
    target_depth: 3750,
    formation: 'Kopili Formation',
    incident_type: 'Gas Kick / Influx',
    severity: 'High',
    primary_risk: 'Abnormal Pressure Gas Kick at 3350m (SIDPP 420 psi)',
    spud_date: '11-Nov-2022',
    completion_date: '02-Mar-2023',
    summary:
      'Rapid ROP drilling break followed by 25 bbl pit gain. Well shut in on annular BOP. SIDPP recorded 420 psi, SICP 580 psi. Driller method executed successfully; mud weight raised from 1.16 SG to 1.28 SG with barite.',
    formations: [
      { name: 'Alluvium', from: 0, to: 400 },
      { name: 'Tipam Sandstone', from: 1150, to: 2400 },
      { name: 'Barail Coal Shale', from: 2400, to: 3200 },
      { name: 'Kopili Formation', from: 3200, to: 3750 },
    ],
  },
  {
    well_id: 'W-011',
    name: 'DLJN-HST-011',
    distance: '13.1 km SW',
    distanceMeters: 13100,
    target_depth: 3420,
    formation: 'Girujan Clay',
    incident_type: 'Wellbore Instability',
    severity: 'Medium',
    primary_risk: 'Reactive Shale Swelling & Bit Balling at 890m',
    spud_date: '05-May-2023',
    completion_date: '18-Aug-2023',
    summary:
      'Severe bit balling and tight pull of 60k lbs experienced while tripping in Upper Girujan clay. Polyamine shale inhibitors added to water-based system to maintain clay stability.',
    formations: [
      { name: 'Alluvium', from: 0, to: 350 },
      { name: 'Girujan Clay', from: 350, to: 1250 },
      { name: 'Tipam Sandstone', from: 1250, to: 2700 },
      { name: 'Barail Coal Shale', from: 2700, to: 3420 },
    ],
  },
  {
    well_id: 'W-014',
    name: 'DLJN-HST-014',
    distance: '6.5 km W',
    distanceMeters: 6500,
    target_depth: 4100,
    formation: 'Tipam Sandstone',
    incident_type: 'Safe / Baseline',
    severity: 'Safe',
    primary_risk: 'Normal Baseline Drilling (No critical anomalies)',
    spud_date: '10-Feb-2024',
    completion_date: '24-May-2024',
    summary:
      'Casing design and mud hydraulics executed strictly per regional baseline plan. Hydrostatic overbalance preserved throughout Tipam and Barail intervals with zero NPT incidents.',
    formations: [
      { name: 'Alluvium', from: 0, to: 410 },
      { name: 'Girujan Clay', from: 410, to: 1150 },
      { name: 'Tipam Sandstone', from: 1150, to: 2550 },
      { name: 'Barail Coal Shale', from: 2550, to: 4100 },
    ],
  },
];

export default function HistoricalDatabase({ onAskAiAboutWell }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormation, setSelectedFormation] = useState('ALL');
  const [selectedIncident, setSelectedIncident] = useState('ALL');
  const [selectedWellForReport, setSelectedWellForReport] = useState(null);

  // Available unique formations and incident types
  const formationsList = [
    'ALL',
    'Tipam Sandstone',
    'Barail Coal Shale',
    'Kopili Formation',
    'Namsang Formation',
    'Girujan Clay',
  ];

  const incidentsList = [
    'ALL',
    'Mud Loss',
    'Stuck Pipe',
    'Gas Kick / Influx',
    'Wellbore Instability',
    'Safe / Baseline',
  ];

  // Filter logic
  const filteredWells = useMemo(() => {
    return INITIAL_HISTORICAL_WELLS.filter((well) => {
      // Search term filter
      const matchesSearch =
        well.well_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        well.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        well.primary_risk.toLowerCase().includes(searchTerm.toLowerCase());

      // Formation filter
      const matchesFormation =
        selectedFormation === 'ALL' || well.formation === selectedFormation;

      // Incident filter
      const matchesIncident =
        selectedIncident === 'ALL' || well.incident_type === selectedIncident;

      return matchesSearch && matchesFormation && matchesIncident;
    });
  }, [searchTerm, selectedFormation, selectedIncident]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedFormation('ALL');
    setSelectedIncident('ALL');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden select-none">
      {/* 1. TOP HEADER & METRICS BAR */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-100 text-[#0077c8]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
              Historical Wells Knowledge Base
            </h2>
            <p className="text-[11px] text-gray-500 font-medium">
              Offset Completion Reports & Drilling Anomaly Telemetry • Assam Basin
            </p>
          </div>
        </div>

        {/* Count Badge & Fast Reset */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#0077c8] font-bold text-xs">
            {filteredWells.length} / {INITIAL_HISTORICAL_WELLS.length} Wells Displayed
          </span>
          {(searchTerm || selectedFormation !== 'ALL' || selectedIncident !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Reset search and filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROL BAR */}
      <div className="p-3 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Well Name, ID, or incident..."
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

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Formation Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-600 text-[11px] whitespace-nowrap">
              Formation:
            </span>
            <select
              value={selectedFormation}
              onChange={(e) => setSelectedFormation(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0077c8] focus:bg-white font-medium"
            >
              {formationsList.map((f) => (
                <option key={f} value={f}>
                  {f === 'ALL' ? 'All Formations' : f}
                </option>
              ))}
            </select>
          </div>

          {/* Incident Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-600 text-[11px] whitespace-nowrap">
              Incident:
            </span>
            <select
              value={selectedIncident}
              onChange={(e) => setSelectedIncident(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0077c8] focus:bg-white font-medium"
            >
              {incidentsList.map((inc) => (
                <option key={inc} value={inc}>
                  {inc === 'ALL' ? 'All Incidents' : inc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. RESPONSIVE DATA TABLE */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200 sticky top-0 z-10">
              <th className="py-2.5 px-3.5">Well ID & Name</th>
              <th className="py-2.5 px-3.5">Distance from Rig</th>
              <th className="py-2.5 px-3.5">Target Depth</th>
              <th className="py-2.5 px-3.5">Primary Formation</th>
              <th className="py-2.5 px-3.5">Primary Risk Encountered</th>
              <th className="py-2.5 px-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredWells.length > 0 ? (
              filteredWells.map((well) => {
                const isHighRisk = well.severity === 'High';
                const isMedRisk = well.severity === 'Medium';
                const isSafe = well.severity === 'Safe';

                return (
                  <tr
                    key={well.well_id}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    {/* Well ID & Name */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0077c8]"></span>
                        <span>{well.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 block">
                        {well.well_id}
                      </span>
                    </td>

                    {/* Distance from Active Rig */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className="font-semibold text-gray-800">
                        {well.distance}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-mono">
                        {well.distanceMeters}m radius
                      </span>
                    </td>

                    {/* Target Depth */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-gray-900 text-xs">
                        {well.target_depth.toLocaleString()}{' '}
                        <span className="text-[10px] font-normal text-gray-500">
                          m
                        </span>
                      </span>
                    </td>

                    {/* Formation */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium text-[11px] border border-slate-200">
                        {well.formation}
                      </span>
                    </td>

                    {/* Primary Risk Encountered */}
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-1.5 max-w-sm">
                        {isHighRisk ? (
                          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                        ) : isMedRisk ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span
                          className={`font-medium truncate ${
                            isHighRisk
                              ? 'text-red-700'
                              : isMedRisk
                              ? 'text-amber-800'
                              : 'text-emerald-700'
                          }`}
                          title={well.primary_risk}
                        >
                          {well.primary_risk}
                        </span>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedWellForReport(well)}
                        className="px-2.5 py-1 rounded-md bg-[#0077c8] hover:bg-[#005a9c] text-white text-[11px] font-bold shadow-sm transition-colors inline-flex items-center gap-1"
                        title={`View comprehensive drilling report for ${well.name}`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Report</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500 text-xs"
                >
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-gray-700">
                      No matching historical wells found.
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Try clearing your search query or loosening the formation / incident filters.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-3 py-1 bg-blue-50 text-[#0077c8] hover:bg-blue-100 font-bold rounded text-xs transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. FOOTER STATUS BAR */}
      <div className="px-4 py-2 bg-slate-50 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
        <span>
          Showing <strong>{filteredWells.length}</strong> of{' '}
          <strong>{INITIAL_HISTORICAL_WELLS.length}</strong> wells in Duliajan Shelf database
        </span>
        <span className="font-mono text-[10px]">
          OIL eRTMAC v2.4 • MongoDB Geodetic Coordinates
        </span>
      </div>

      {/* 5. DETAILED WELL REPORT MODAL */}
      {selectedWellForReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-[#0077c8] to-[#005a9c] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-200" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    Well Completion Report: {selectedWellForReport.name}
                  </h3>
                  <span className="text-[11px] text-blue-100 font-mono">
                    ID: {selectedWellForReport.well_id} • Offset: {selectedWellForReport.distance}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedWellForReport(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-gray-800">
              {/* Top Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">
                    Target TD
                  </span>
                  <span className="font-bold font-mono text-gray-900 text-sm">
                    {selectedWellForReport.target_depth}m
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">
                    Formation
                  </span>
                  <span className="font-semibold text-gray-900">
                    {selectedWellForReport.formation}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">
                    Spud Date
                  </span>
                  <span className="font-mono text-gray-700">
                    {selectedWellForReport.spud_date}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">
                    Completed
                  </span>
                  <span className="font-mono text-gray-700">
                    {selectedWellForReport.completion_date}
                  </span>
                </div>
              </div>

              {/* Geological Stratigraphy Column */}
              <div>
                <h4 className="font-bold text-gray-900 text-xs mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#0077c8]" />
                  <span>Encountered Geological Stratigraphy</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedWellForReport.formations.map((f, i) => (
                    <div
                      key={i}
                      className="p-2 rounded border border-gray-200 bg-white flex items-center justify-between text-[11px]"
                    >
                      <span className="font-semibold text-gray-800">
                        {f.name}
                      </span>
                      <span className="font-mono text-gray-500 text-[10px]">
                        {f.from}m - {f.to}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Drilling Incident Narrative */}
              <div>
                <h4 className="font-bold text-gray-900 text-xs mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Drilling Incident & Operational Resolution</span>
                </h4>
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-950 leading-relaxed font-sans">
                  <div className="font-bold text-xs mb-1 text-amber-900">
                    {selectedWellForReport.primary_risk}
                  </div>
                  <p className="text-[11px]">
                    {selectedWellForReport.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-slate-50 border-t border-gray-200 flex items-center justify-between gap-2">
              <span className="text-[11px] text-gray-500">
                Official OIL completion record
              </span>
              <div className="flex items-center gap-2">
                {onAskAiAboutWell && (
                  <button
                    onClick={() => {
                      const well = selectedWellForReport;
                      setSelectedWellForReport(null);
                      onAskAiAboutWell(well);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0077c8] hover:bg-blue-100 text-xs font-bold transition-colors"
                  >
                    💬 Ask AI About This Well
                  </button>
                )}
                <button
                  onClick={() => setSelectedWellForReport(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#0077c8] hover:bg-[#005a9c] text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
