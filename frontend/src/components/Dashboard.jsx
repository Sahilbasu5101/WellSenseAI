import React, { useState, useEffect } from 'react';
import MifosHeader from './MifosHeader';
import MifosSidebar from './MifosSidebar';
import WellMap from './WellMap';
import DrillingSimulator from './DrillingSimulator';
import RagChat from './RagChat';
import HistoricalDatabase from './HistoricalDatabase';
import RiskAnalytics from './RiskAnalytics';
import OffsetWellMap from './OffsetWellMap';
import WellControlProtocols from './WellControlProtocols';
import HazardAlerts from './HazardAlerts';
import SystemSettings from './SystemSettings';
import {
  Activity,
  Layers,
  Search,
  Radio,
  ExternalLink,
  ChevronRight,
  Database,
  ShieldCheck,
  Building,
  Bot,
  Gauge,
  Navigation,
  CheckSquare,
  Bell,
  Settings,
} from 'lucide-react';

export default function Dashboard({ user, onLogout, onGoHome }) {
  const [activeSidebarItem, setActiveSidebarItem] = useState('live');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [nearbyWells, setNearbyWells] = useState([]);
  const [chatInitialQuery, setChatInitialQuery] = useState('');

  // Always reset scroll to top on dashboard mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle clicking "View Historical Data" from Leaflet map popup
  const handleSelectHistoricalWell = (well) => {
    const wellQuery = `What operational events, mud losses, or sticking anomalies occurred in historical well ${well.name} (${well.well_id})?`;
    setChatInitialQuery(wellQuery);
    setActiveSidebarItem('rag'); // Instantly open the dedicated AI tab!
  };

  return (
    <div className="min-h-screen lg:h-screen w-screen bg-[#f8fafc] flex flex-col font-sans text-gray-900 select-none overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {/* 1. Top Mifos-style Blue Application Header */}
      <MifosHeader user={user} onLogout={onLogout} onGoHome={onGoHome} />

      {/* 2. Main Body with Left Vertical Sidebar & Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Collapsible Gemini-Style Sidebar */}
        <MifosSidebar
          activeItem={activeSidebarItem}
          onSelectItem={setActiveSidebarItem}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={setIsSidebarOpen}
        />

        {/* Center/Right Content Area - Fluid Responsive Workspace */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto lg:overflow-hidden p-1.5 sm:p-2 space-y-1.5">
          {/* Compact Mifos Sub-Header Bar (Breadcrumb + Tab Buttons + Live Status) */}
          <div className="bg-white rounded-lg px-2.5 py-1 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-1.5 shrink-0">
            {/* Breadcrumb / 5 Dedicated Tab Switchers */}
            <div className="flex items-center space-x-1 text-xs font-medium text-gray-600 overflow-x-auto scrollbar-none">
              <span
                className="text-gray-500 hover:text-blue-600 cursor-pointer whitespace-nowrap"
                onClick={onGoHome}
              >
                Home
              </span>
              <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
              <button
                onClick={() => setActiveSidebarItem('live')}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  activeSidebarItem === 'live'
                    ? 'bg-blue-50 text-[#0077c8] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Live Surveillance
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setActiveSidebarItem('db')}
                className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeSidebarItem === 'db'
                    ? 'bg-blue-50 text-[#0077c8] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Database className="w-3 h-3" />
                <span>Historical Database</span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setActiveSidebarItem('risk')}
                className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeSidebarItem === 'risk'
                    ? 'bg-blue-50 text-[#0077c8] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Gauge className="w-3 h-3" />
                <span>Risk Analytics</span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setActiveSidebarItem('map')}
                className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeSidebarItem === 'map'
                    ? 'bg-blue-50 text-[#0077c8] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Navigation className="w-3 h-3" />
                <span>Offset Well Map</span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setActiveSidebarItem('verify')}
                className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeSidebarItem === 'verify'
                    ? 'bg-blue-50 text-[#0077c8] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <CheckSquare className="w-3 h-3" />
                <span>Well Control Protocols</span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setActiveSidebarItem('alerts')}
                className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeSidebarItem === 'alerts'
                    ? 'bg-blue-50 text-[#0077c8] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Bell className="w-3 h-3 text-red-600" />
                <span>Hazard Alerts</span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setActiveSidebarItem('rag')}
                className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeSidebarItem === 'rag'
                    ? 'bg-blue-50 text-[#0077c8] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Bot className="w-3 h-3 text-[#0077c8]" />
                <span>Knowledge Base AI</span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setActiveSidebarItem('settings')}
                className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeSidebarItem === 'settings'
                    ? 'bg-blue-50 text-[#0077c8] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Settings className="w-3 h-3 text-gray-500" />
                <span>Settings</span>
              </button>
            </div>

            {/* User Greeting & Status Indicators */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-800 font-bold hidden sm:inline text-[11px]">
                Welcome, <span className="text-[#0077c8]">{user?.username || 'mifos'}</span>!
              </span>

              <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-[#0077c8] font-semibold text-[10px]">
                <Radio className="w-2.5 h-2.5 text-blue-600" />
                <span>Rig: DLJN-ACT-001</span>
              </div>

              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse mr-1"></span>
                eRTMAC Live
              </span>

              {/* Blue Mifos Dashboard Button */}
              <button
                onClick={() => setActiveSidebarItem('live')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold shadow-sm transition-colors flex items-center gap-1 ${
                  activeSidebarItem === 'live'
                    ? 'bg-[#0077c8] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Active Drilling Surveillance"
              >
                <Activity className="w-2.5 h-2.5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>

          {/* 3. DYNAMIC WORKSPACE: Tab 8 Settings, Tab 7 Alerts, Tab 6 Protocols, Tab 5 Map, Tab 4 Risk, Tab 3 AI, Tab 2 Database, OR Tab 1 Surveillance */}
          {activeSidebarItem === 'settings' ? (
            <div className="flex-1 min-h-0 overflow-hidden h-full">
              <SystemSettings />
            </div>
          ) : activeSidebarItem === 'alerts' ? (
            <div className="flex-1 min-h-0 overflow-hidden h-full">
              <HazardAlerts
                onAskAi={(query) => {
                  setChatInitialQuery(query);
                  setActiveSidebarItem('rag');
                }}
              />
            </div>
          ) : activeSidebarItem === 'verify' ? (
            <div className="flex-1 min-h-0 overflow-hidden h-full">
              <WellControlProtocols
                onAskAi={(query) => {
                  setChatInitialQuery(query);
                  setActiveSidebarItem('rag');
                }}
              />
            </div>
          ) : activeSidebarItem === 'map' ? (
            <div className="flex-1 min-h-0 overflow-hidden h-full">
              <OffsetWellMap onSelectHistoricalWell={handleSelectHistoricalWell} />
            </div>
          ) : activeSidebarItem === 'risk' ? (
            <div className="flex-1 min-h-0 overflow-hidden h-full">
              <RiskAnalytics
                onNavigateLive={() => setActiveSidebarItem('live')}
                onNavigateAi={() => setActiveSidebarItem('rag')}
              />
            </div>
          ) : activeSidebarItem === 'rag' ? (
            <div className="flex-1 min-h-0 overflow-hidden h-full">
              <RagChat initialQuery={chatInitialQuery} isDedicatedTab={true} />
            </div>
          ) : activeSidebarItem === 'db' ? (
            <div className="flex-1 min-h-0 overflow-hidden h-full">
              <HistoricalDatabase
                onAskAiAboutWell={(well) => {
                  handleSelectHistoricalWell(well);
                }}
              />
            </div>
          ) : (
            /* Tab 1: Live Surveillance - Full Map on Left + Full Real-Time Simulator on Right! */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 sm:gap-2 flex-1 min-h-0 overflow-hidden">
              {/* LEFT HALF (Col 1 to 7): Interactive Leaflet Map Component */}
              <div className="lg:col-span-7 flex flex-col h-full min-h-[360px] lg:min-h-0 overflow-hidden">
                <WellMap
                  onSelectHistoricalWell={handleSelectHistoricalWell}
                  onWellsLoaded={setNearbyWells}
                />
              </div>

              {/* RIGHT HALF (Col 8 to 12): Dedicated Real-Time Drilling Simulator Workspace */}
              <div className="lg:col-span-5 flex flex-col h-full min-h-0 overflow-y-auto pr-0.5">
                <DrillingSimulator
                  nearbyWells={nearbyWells}
                  onRiskCalculated={(risk) => {}}
                  onOpenAiAnalysis={(prompt) => {
                    setChatInitialQuery(prompt);
                    setActiveSidebarItem('rag');
                  }}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
