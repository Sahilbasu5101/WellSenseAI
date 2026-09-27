import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  Area,
} from 'recharts';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Gauge,
  Layers,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Bot,
  ExternalLink,
  Info,
} from 'lucide-react';

// Chart 1 Data: Historical Incidents by Formation
const FORMATION_INCIDENTS_DATA = [
  { formation: 'Alluvium', mudLoss: 1, stuckPipe: 0, total: 1 },
  { formation: 'Girujan Clay', mudLoss: 2, stuckPipe: 1, total: 3 },
  { formation: 'Namsang', mudLoss: 3, stuckPipe: 1, total: 4 },
  { formation: 'Tipam Sand', mudLoss: 7, stuckPipe: 2, total: 9 },
  { formation: 'Barail Shale', mudLoss: 2, stuckPipe: 6, total: 8 },
  { formation: 'Kopili Form', mudLoss: 1, stuckPipe: 3, total: 4 },
];

// Chart 2 Data: Depth vs. Risk Probability (%)
const DEPTH_PROBABILITY_DATA = [
  { depth: 400, riskProb: 5, formation: 'Alluvium' },
  { depth: 800, riskProb: 12, formation: 'Girujan Clay' },
  { depth: 1100, riskProb: 28, formation: 'Tipam Transition' },
  { depth: 1240, riskProb: 88, formation: 'Tipam Thief Zone (Mud Loss)' }, // Spike 1
  { depth: 1600, riskProb: 35, formation: 'Tipam Sandstone' },
  { depth: 2200, riskProb: 22, formation: 'Tipam Lower' },
  { depth: 2600, riskProb: 42, formation: 'Barail Upper' },
  { depth: 3140, riskProb: 76, formation: 'Barail Coal Shale (Stuck Pipe)' }, // Spike 2
  { depth: 3350, riskProb: 82, formation: 'Kopili Streaks (Gas Influx)' }, // Spike 3
  { depth: 3700, riskProb: 40, formation: 'Kopili Lower' },
  { depth: 4100, riskProb: 18, formation: 'Basement Transition' },
];

// Bottom Section Data: Top 3 Critical Formations in Duliajan Basin
const TOP_CRITICAL_FORMATIONS = [
  {
    rank: 1,
    formation: 'Tipam Sandstone',
    depthRange: '1,100m – 2,450m',
    frequency: '42%',
    incidentCount: '7 Mud Losses, 2 Stuck Pipes',
    primaryRisk: 'Severe Lost Circulation / Fractured Thief Zones',
    threatLevel: 'High',
    mitigation: 'Pre-treat active system with 60 bbl LCM pill (mica + walnut shells). Lower ECD and stage pump discharge.',
  },
  {
    rank: 2,
    formation: 'Barail Coal Shale',
    depthRange: '2,450m – 3,950m',
    frequency: '35%',
    incidentCount: '6 Stuck Pipes, 2 Mud Losses',
    primaryRisk: 'Differential Pipe Sticking / Sloughing Coal Bands',
    threatLevel: 'High',
    mitigation: 'Spot 55 bbl oil-based freeing pill, activate hydraulic jars with 40k lbs impact, and restrict static survey tool time.',
  },
  {
    rank: 3,
    formation: 'Kopili Formation',
    depthRange: '3,200m – 3,750m',
    frequency: '23%',
    incidentCount: '3 Gas Kicks, 1 Wellbore Tightness',
    primaryRisk: 'Overpressured Gas Influx / Kick Hazards',
    threatLevel: 'High',
    mitigation: 'Immediate soft shut-in on annular BOP. Execute Driller’s Method to displace influx and raise mud weight to 1.28 SG with barite.',
  },
];

export default function RiskAnalytics({ onNavigateLive, onNavigateAi }) {
  const [selectedFormationFilter, setSelectedFormationFilter] = useState('ALL');

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-y-auto select-none p-3 sm:p-4 space-y-3.5">
      {/* 1. TOP HEADER & WORKSPACE TITLE */}
      <div className="p-3 bg-slate-50 border border-gray-200 rounded-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-100 text-[#0077c8]">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                Predictive Risk Analytics Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0077c8] font-bold text-[10px]">
                Machine Learning Lookahead ±50m
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              Geostatistical Correlation & Historical Offset Hazard Modeling • Duliajan Shelf
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateLive && (
            <button
              onClick={onNavigateLive}
              className="px-3 py-1.5 rounded-lg bg-[#0077c8] hover:bg-[#005a9c] text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Launch Live Simulator</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI CARDS (TOP ROW - 4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        {/* Card 1: Total Offset Wells Analyzed */}
        <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs hover:border-blue-300 transition-all flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Total Offset Wells Analyzed
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#0077c8] font-mono">14</span>
              <span className="text-xs text-gray-500 font-medium">Wells</span>
            </div>
            <span className="text-[10px] text-gray-400 mt-1 block">
              15 km geodetic radius indexed
            </span>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-[#0077c8] shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: High-Risk Zones Identified */}
        <div className="p-3.5 bg-white border border-red-200 rounded-xl shadow-xs hover:border-red-300 transition-all flex items-start justify-between bg-red-50/15">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block mb-1">
              High-Risk Zones Identified
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-red-600 font-mono">3</span>
              <span className="text-xs text-red-600 font-medium">Zones</span>
            </div>
            <span className="text-[10px] text-red-600/80 mt-1 block font-medium">
              Tipam (Loss) & Barail (Stuck)
            </span>
          </div>
          <div className="p-2 rounded-lg bg-red-100 text-red-600 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Overall Safety Score */}
        <div className="p-3.5 bg-white border border-emerald-200 rounded-xl shadow-xs hover:border-emerald-300 transition-all flex items-start justify-between bg-emerald-50/15">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              Overall Safety Score
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-700 font-mono">85%</span>
              <span className="text-xs text-emerald-700 font-medium">Normal</span>
            </div>
            <span className="text-[10px] text-emerald-700/80 mt-1 block font-medium">
              Standard telemetry overbalance
            </span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Active Predictions */}
        <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs hover:border-blue-300 transition-all flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Active Predictions
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#0077c8] font-mono">2</span>
              <span className="text-xs text-gray-500 font-medium">Active Loops</span>
            </div>
            <span className="text-[10px] text-gray-400 mt-1 block">
              Lookahead window: ±50m depth
            </span>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-[#0077c8] shrink-0">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. CHARTS (MIDDLE ROW - 2 CHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 shrink-0">
        {/* Chart 1: Bar Chart - Historical Incidents by Formation */}
        <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0077c8]" />
                <span>Historical Incidents by Formation</span>
              </h3>
              <p className="text-[10px] text-gray-500">
                Mud Losses (Blue) vs. Stuck Pipes (Red) across Assam stratigraphic intervals
              </p>
            </div>
            <span className="text-[10px] font-mono text-gray-400 hidden sm:inline">
              N=29 Events
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={FORMATION_INCIDENTS_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="formation"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                />
                <Bar
                  dataKey="mudLoss"
                  name="Mud Losses"
                  fill="#0077c8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="stuckPipe"
                  name="Stuck Pipes"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Line Chart - Depth vs. Risk Probability (%) */}
        <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span>Depth vs. Risk Probability</span>
              </h3>
              <p className="text-[10px] text-gray-500">
                Machine learning risk probability (%) plotted against measured depth (m)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold text-[10px] border border-red-200">
              Peak: 88% at 1240m
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={DEPTH_PROBABILITY_DATA}
                margin={{ top: 10, right: 15, left: -15, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="depth"
                  unit="m"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <YAxis
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Risk Probability']}
                  labelFormatter={(depth) => `Measured Depth: ${depth}m`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="riskProb"
                  name="Predicted Hazard Probability (%)"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#dc2626', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#b91c1c' }}
                />
                {/* Specific key hazard dots */}
                <ReferenceDot x={1240} y={88} r={6} fill="#dc2626" stroke="#fff" />
                <ReferenceDot x={3140} y={76} r={6} fill="#f59e0b" stroke="#fff" />
                <ReferenceDot x={3350} y={82} r={6} fill="#dc2626" stroke="#fff" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: TOP 3 CRITICAL RISK FORMATIONS IN DULIAJAN BASIN */}
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-xs space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide">
              Top 3 Critical Risk Formations in Duliajan Basin
            </h3>
          </div>
          <span className="text-[10px] text-gray-500 font-medium">
            Ranked by historical anomaly frequency
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <th className="py-2 px-3 w-12 text-center">Rank</th>
                <th className="py-2 px-3">Formation</th>
                <th className="py-2 px-3">Depth Interval</th>
                <th className="py-2 px-3">Incident Frequency</th>
                <th className="py-2 px-3">Primary Risk Encountered</th>
                <th className="py-2 px-3">Recommended Mitigation Protocol</th>
                <th className="py-2 px-3 text-center">Threat Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TOP_CRITICAL_FORMATIONS.map((row) => (
                <tr key={row.rank} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-gray-900 font-mono">
                    #{row.rank}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-gray-900 whitespace-nowrap">
                    {row.formation}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-gray-700 whitespace-nowrap">
                    {row.depthRange}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-bold text-blue-700 font-mono">{row.frequency}</span>
                    <span className="text-[10px] text-gray-400 block font-normal">
                      {row.incidentCount}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-800 font-medium max-w-xs">
                    {row.primaryRisk}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 text-[11px] max-w-sm leading-relaxed">
                    {row.mitigation}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] border border-red-200">
                      {row.threatLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
