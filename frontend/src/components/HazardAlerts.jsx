import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Filter,
  Check,
  Clock,
  MapPin,
  Bot,
  Layers,
  ArrowRight,
  Bell,
  RefreshCw,
  Search,
} from 'lucide-react';

const INITIAL_ALERTS = [
  {
    id: 'alt-001',
    severity: 'critical', // Red
    title: 'Approaching 1200m Tipam Sandstone — Severe Mud Loss Zone',
    message: 'Critical: Approaching 1200m Tipam Sandstone. 80% probability of Mud Loss based on well DLJN-HST-005.',
    timestamp: '2 minutes ago',
    depth: '1,200 m',
    formation: 'Tipam Sandstone',
    offsetRef: 'DLJN-HST-005',
    distance: '3.8 km',
    acknowledged: false,
    acknowledgedAt: null,
    recommendation: 'Pre-mix 50 bbl mica/calcium carbonate LCM pill. Reduce pump rate to 350 GPM.',
  },
  {
    id: 'alt-002',
    severity: 'warning', // Yellow/Amber
    title: 'Torque & Drag Anomaly Predicted at 1450m',
    message: 'Caution: Torque spike predicted at 1450m based on historical data.',
    timestamp: '18 minutes ago',
    depth: '1,450 m',
    formation: 'Lower Tipam / Girujan Clay',
    offsetRef: 'DLJN-04 & DLJN-HST-002',
    distance: '2.4 km',
    acknowledged: true,
    acknowledgedAt: '12 mins ago',
    recommendation: 'Monitor surface torque gauge. Maintain RPM > 110 and rotate drill string continuously.',
  },
  {
    id: 'alt-003',
    severity: 'info', // Blue
    title: 'Optimal Drilling Window (1,500m – 1,800m)',
    message: 'Safe Zone: Next 300m historically clear of major incidents.',
    timestamp: '45 minutes ago',
    depth: '1,500m – 1,800m',
    formation: 'Upper Barail Marine Sand',
    offsetRef: 'DLJN-HST-001, DLJN-04',
    distance: 'Regional',
    acknowledged: true,
    acknowledgedAt: 'Auto-verified',
    recommendation: 'Maintain standard ROP of 18-24 m/hr with 1.12 SG water-based drilling mud.',
  },
  {
    id: 'alt-004',
    severity: 'critical', // Red
    title: 'Abnormal Pore Pressure Transition Ahead at 2,450m',
    message: 'Critical: Sudden pore pressure gradient increase from 1.15 to 1.34 SG expected at Barail Coal-Shale cap.',
    timestamp: '1 hour ago',
    depth: '2,450 m',
    formation: 'Barail Coal Shale',
    offsetRef: 'DLJN-HST-006',
    distance: '4.2 km',
    acknowledged: false,
    acknowledgedAt: null,
    recommendation: 'Execute flow check immediately upon 1m ROP break. Ready trip tank and PVT alarms.',
  },
  {
    id: 'alt-005',
    severity: 'warning', // Yellow/Amber
    title: 'Differential Sticking Risk in Permeable Sandstone',
    message: 'Caution: High differential overbalance (380 psi) projected across depleted 2,820m reservoir sand.',
    timestamp: '2 hours ago',
    depth: '2,820 m',
    formation: 'Barail Main Sand',
    offsetRef: 'DLJN-HST-003',
    distance: '5.1 km',
    acknowledged: false,
    acknowledgedAt: null,
    recommendation: 'Limit stationary directional survey time to < 15 minutes. Circulate lubricant pill.',
  },
  {
    id: 'alt-006',
    severity: 'info', // Blue
    title: 'Surface Casing Pressure Integrity Verified',
    message: 'Safe Zone: Casing shoe at 950m successfully pressure tested to 1.55 SG EMW equivalent.',
    timestamp: '3 hours ago',
    depth: '950 m',
    formation: 'Namsang Gravel / Sand',
    offsetRef: 'Rig Telemetry',
    distance: 'Rig DLJN-ACT-001',
    acknowledged: true,
    acknowledgedAt: 'Logged by Rig Supv',
    recommendation: 'No formation breakdown detected. Safe to commence 12-1/4" hole section.',
  },
];

export default function HazardAlerts({ onAskAi }) {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnackOnly, setFilterUnackOnly] = useState(false);

  // Acknowledge single alert handler
  const handleAcknowledge = (alertId) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === alertId
          ? {
              ...item,
              acknowledged: true,
              acknowledgedAt: 'Just now by Rig Engineer',
            }
          : item
      )
    );
  };

  // Acknowledge all pending critical alerts
  const handleAcknowledgeAll = () => {
    setAlerts((prev) =>
      prev.map((item) => ({
        ...item,
        acknowledged: true,
        acknowledgedAt: item.acknowledged ? item.acknowledgedAt : 'Just now by Rig Engineer',
      }))
    );
  };

  // Count severities
  const counts = useMemo(() => {
    return {
      all: alerts.length,
      critical: alerts.filter((a) => a.severity === 'critical').length,
      warning: alerts.filter((a) => a.severity === 'warning').length,
      info: alerts.filter((a) => a.severity === 'info').length,
      unackCritical: alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length,
    };
  }, [alerts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) {
        return false;
      }
      if (filterUnackOnly && alert.acknowledged) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = alert.title.toLowerCase().includes(q);
        const matchMessage = alert.message.toLowerCase().includes(q);
        const matchFormation = alert.formation.toLowerCase().includes(q);
        const matchRef = alert.offsetRef.toLowerCase().includes(q);
        const matchDepth = alert.depth.toLowerCase().includes(q);
        if (!matchTitle && !matchMessage && !matchFormation && !matchRef && !matchDepth) {
          return false;
        }
      }
      return true;
    });
  }, [alerts, selectedSeverity, filterUnackOnly, searchQuery]);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">
      {/* Top Banner / Controls Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0 shadow-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-2xs">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-gray-900 leading-tight">
                  Hazard & Proximity Alerts
                </h1>
                {counts.unackCritical > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                    {counts.unackCritical} Unacknowledged
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Real-time & lookahead operational warnings chronologically ordered with offset well intelligence
              </p>
            </div>
          </div>

          {/* Quick Action: Acknowledge All */}
          {counts.unackCritical > 0 && (
            <button
              onClick={handleAcknowledgeAll}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Acknowledge All Critical ({counts.unackCritical})</span>
            </button>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="max-w-4xl mx-auto mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
          {/* Severity Dropdown & Status Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Filter by Severity:</span>
            </div>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-2.5 py-1.5 bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs cursor-pointer"
            >
              <option value="all">All Severities ({counts.all})</option>
              <option value="critical">Critical / High Risk ({counts.critical})</option>
              <option value="warning">Warning / Caution ({counts.warning})</option>
              <option value="info">Safe Zone / Info ({counts.info})</option>
            </select>

            <button
              onClick={() => setFilterUnackOnly(!filterUnackOnly)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                filterUnackOnly
                  ? 'bg-red-50 border-red-300 text-red-700 font-bold'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending Acknowledgment Only
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search depth, formation, well..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#0077c8] text-gray-800 placeholder-gray-400 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Main Centered Content Container */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Summary Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-blue-50 text-[#0077c8] flex items-center justify-center font-bold text-sm">
                {counts.all}
              </div>
              <div>
                <div className="text-[11px] text-gray-500 font-medium">Total Alerts</div>
                <div className="text-xs font-bold text-gray-800">Timeline Feed</div>
              </div>
            </div>

            <div className="bg-white border border-red-200 rounded-lg p-2.5 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                {counts.critical}
              </div>
              <div>
                <div className="text-[11px] text-red-600 font-medium">Critical (Red)</div>
                <div className="text-xs font-bold text-red-800">{counts.unackCritical} Pending Ack</div>
              </div>
            </div>

            <div className="bg-white border border-amber-200 rounded-lg p-2.5 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                {counts.warning}
              </div>
              <div>
                <div className="text-[11px] text-amber-600 font-medium">Warning (Yellow)</div>
                <div className="text-xs font-bold text-amber-800">Cautionary Trends</div>
              </div>
            </div>

            <div className="bg-white border border-blue-200 rounded-lg p-2.5 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                {counts.info}
              </div>
              <div>
                <div className="text-[11px] text-blue-600 font-medium">Safe Zone (Blue)</div>
                <div className="text-xs font-bold text-blue-800">Clear Formations</div>
              </div>
            </div>
          </div>

          {/* Vertical Timeline Feed */}
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-gray-800">No Alerts Match Your Filters</h3>
              <p className="text-xs text-gray-500 mt-1">
                Try adjusting the severity dropdown or clearing your search query.
              </p>
              <button
                onClick={() => {
                  setSelectedSeverity('all');
                  setFilterUnackOnly(false);
                  setSearchQuery('');
                }}
                className="mt-3 px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 before:absolute before:left-2.5 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200 space-y-4">
              {filteredAlerts.map((alert) => {
                const isCritical = alert.severity === 'critical';
                const isWarning = alert.severity === 'warning';
                const isInfo = alert.severity === 'info';

                // Node styling on timeline
                const nodeColor = isCritical
                  ? 'bg-red-600 ring-4 ring-red-100'
                  : isWarning
                  ? 'bg-amber-500 ring-4 ring-amber-100'
                  : 'bg-blue-600 ring-4 ring-blue-100';

                // Card container styling
                const cardBorder = isCritical
                  ? 'border-l-4 border-l-red-600 border-gray-200'
                  : isWarning
                  ? 'border-l-4 border-l-amber-500 border-gray-200'
                  : 'border-l-4 border-l-blue-600 border-gray-200';

                return (
                  <div key={alert.id} className="relative group">
                    {/* Timeline Node Icon / Dot */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-4 w-5 h-5 rounded-full ${nodeColor} flex items-center justify-center text-white z-10 transition-transform group-hover:scale-110`}
                    >
                      {isCritical ? (
                        <AlertOctagon className="w-3 h-3" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <Info className="w-3 h-3" />
                      )}
                    </div>

                    {/* Alert Card */}
                    <div
                      className={`bg-white rounded-lg border p-4 shadow-xs hover:shadow-md transition-shadow ${cardBorder}`}
                    >
                      {/* Top Row: Severity Tag, Formation/Depth, Timestamp */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {isCritical && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                              <AlertOctagon className="w-3 h-3 text-red-600" />
                              <span>High Risk Alert</span>
                            </span>
                          )}
                          {isWarning && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Cautionary Warning</span>
                            </span>
                          )}
                          {isInfo && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#0077c8]" />
                              <span>Safe Zone Status</span>
                            </span>
                          )}

                          <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                            Depth: {alert.depth}
                          </span>
                          <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                            Formation: <strong className="text-gray-700">{alert.formation}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{alert.timestamp}</span>
                        </div>
                      </div>

                      {/* Title & Primary Warning Message */}
                      <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">
                        {alert.title}
                      </h3>
                      <p
                        className={`text-xs font-medium leading-relaxed mb-3 ${
                          isCritical
                            ? 'text-red-900 bg-red-50/70 p-2.5 rounded border border-red-100'
                            : isWarning
                            ? 'text-amber-900 bg-amber-50/70 p-2.5 rounded border border-amber-100'
                            : 'text-blue-900 bg-blue-50/70 p-2.5 rounded border border-blue-100'
                        }`}
                      >
                        {alert.message}
                      </p>

                      {/* Operational Recommendation & Offset Well Reference */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-2 px-2.5 rounded bg-gray-50 border border-gray-100 mb-3">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                            Institutional Source / Offset Well
                          </span>
                          <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#0077c8]" />
                            {alert.offsetRef} ({alert.distance})
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
                            Recommended Action
                          </span>
                          <span className="text-gray-700 font-medium block mt-0.5 leading-snug">
                            {alert.recommendation}
                          </span>
                        </div>
                      </div>

                      {/* Footer Actions: Acknowledge & Consult AI */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                        {/* Acknowledge State / Button */}
                        <div>
                          {isCritical ? (
                            alert.acknowledged ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Acknowledged by Rig Engineer</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAcknowledge(alert.id)}
                                className="px-3 py-1.5 rounded-md text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Acknowledge Alert</span>
                              </button>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                              <CheckCircle2 className="w-3 h-3 text-gray-300" />
                              <span>{alert.acknowledgedAt || 'Logged in Real-Time Telemetry'}</span>
                            </span>
                          )}
                        </div>

                        {/* Ask Knowledge Base AI */}
                        {onAskAi && (
                          <button
                            onClick={() =>
                              onAskAi(
                                `What are the mitigation procedures and offset well learnings for: ${alert.message} at depth ${alert.depth} in ${alert.formation}?`
                              )
                            }
                            className="text-xs font-semibold text-[#0077c8] hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Bot className="w-3.5 h-3.5" />
                            <span>Ask Knowledge Base AI</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
