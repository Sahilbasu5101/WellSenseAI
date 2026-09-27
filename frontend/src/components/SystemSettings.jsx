import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Bot,
  Bell,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Server,
  Radio,
  MapPin,
  Cpu,
  Layers,
  Shield,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general');

  // General Settings State
  const [generalConfig, setGeneralConfig] = useState({
    defaultRadiusKm: 10,
    activeRigId: 'DLJN-ACT-001',
    operatingBasin: 'Duliajan (Upper Assam Shelf)',
    drillingTargetDepth: 3850,
    coordinateDatum: 'WGS 84 / UTM Zone 46N',
    telemetryRefreshSec: 5,
  });

  // AI & RAG Config State
  const [aiConfig, setAiConfig] = useState({
    vectorDbUrl: 'http://localhost:8000/chroma_db',
    llmApiKey: 'sk-oil-rtmac-duliajan-ai9982410-sec',
    llmModel: 'gemini-1.5-pro-drilling-domain',
    embeddingModel: 'sentence-transformers/all-MiniLM-L6-v2',
    chunkSize: 1000,
    chunkOverlap: 200,
    similarityThreshold: 0.78,
  });

  // Show/hide API key
  const [showApiKey, setShowApiKey] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    criticalKickAlerts: true,
    mudLossWarnings: true,
    proximityAlerts: true,
    torqueDragSpikes: true,
    audioAlerts: true,
    emailSmsDispatch: false,
    dailySummaryReport: true,
  });

  // Re-indexing state
  const [isReindexing, setIsReindexing] = useState(false);
  const [reindexSuccess, setReindexSuccess] = useState(false);

  // Save changes feedback
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleReindex = () => {
    setIsReindexing(true);
    setReindexSuccess(false);

    // Simulate vector store indexing
    setTimeout(() => {
      setIsReindexing(false);
      setReindexSuccess(true);
      setTimeout(() => setReindexSuccess(false), 5000);
    }, 2000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleReset = () => {
    setGeneralConfig({
      defaultRadiusKm: 10,
      activeRigId: 'DLJN-ACT-001',
      operatingBasin: 'Duliajan (Upper Assam Shelf)',
      drillingTargetDepth: 3850,
      coordinateDatum: 'WGS 84 / UTM Zone 46N',
      telemetryRefreshSec: 5,
    });
    setAiConfig({
      vectorDbUrl: 'http://localhost:8000/chroma_db',
      llmApiKey: 'sk-oil-rtmac-duliajan-ai9982410-sec',
      llmModel: 'gemini-1.5-pro-drilling-domain',
      embeddingModel: 'sentence-transformers/all-MiniLM-L6-v2',
      chunkSize: 1000,
      chunkOverlap: 200,
      similarityThreshold: 0.78,
    });
    setNotifications({
      criticalKickAlerts: true,
      mudLossWarnings: true,
      proximityAlerts: true,
      torqueDragSpikes: true,
      audioAlerts: true,
      emailSmsDispatch: false,
      dailySummaryReport: true,
    });
    setSaveSuccess(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">
      {/* Top Banner / Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077c8] shadow-2xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                System Settings & Configuration
              </h1>
              <p className="text-xs text-gray-500">
                Configure operational parameters, AI/RAG vector pipeline, and telemetry alert thresholds
              </p>
            </div>
          </div>

          {/* Save Status Banner */}
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold shadow-2xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings saved successfully!</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Settings Container: Side Tabs + Form Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Vertical Side-Tabs Navigation */}
          <div className="md:col-span-3 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 pb-1">
              Configuration Tabs
            </div>

            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-[#0077c8] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-white hover:text-gray-900'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>General Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-[#0077c8] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-white hover:text-gray-900'
              }`}
            >
              <Bot className="w-4 h-4 shrink-0" />
              <span>AI & RAG Config</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-[#0077c8] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-white hover:text-gray-900'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
            </button>

            {/* Quick Specs Card */}
            <div className="mt-6 p-3 bg-white rounded-lg border border-gray-200 text-xs shadow-2xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                System Status
              </span>
              <div className="flex items-center justify-between text-gray-600">
                <span>RTMAC Server:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Online
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>ChromaDB Vector:</span>
                <span className="font-semibold text-blue-600">4 Docs / 18 Chunks</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Offset Wells Index:</span>
                <span className="font-semibold text-gray-800">14 Wells (2dsphere)</span>
              </div>
            </div>
          </div>

          {/* Right Content Area: Form Card */}
          <div className="md:col-span-9 bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <form onSubmit={handleSave} className="space-y-6">
              {/* 1. GENERAL SETTINGS */}
              {activeTab === 'general' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#0077c8]" />
                      <span>General Operational Parameters</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Configure active rig telemetry inputs, spatial filter radius, and regional basin defaults.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Default Map Radius (km) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Default Map Radius (km)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={generalConfig.defaultRadiusKm}
                          onChange={(e) =>
                            setGeneralConfig({
                              ...generalConfig,
                              defaultRadiusKm: Number(e.target.value),
                            })
                          }
                          className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs font-medium"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                          km
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Proximity boundary circle drawn around the active rig for offset well lookup.
                      </p>
                    </div>

                    {/* Active Rig ID */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Active Rig ID
                      </label>
                      <input
                        type="text"
                        value={generalConfig.activeRigId}
                        onChange={(e) =>
                          setGeneralConfig({
                            ...generalConfig,
                            activeRigId: e.target.value,
                          })
                        }
                        className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs font-mono font-medium"
                        required
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        Current high-priority drilling package streaming real-time telemetry.
                      </p>
                    </div>

                    {/* Operating Basin (Default: Duliajan) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Operating Basin
                      </label>
                      <input
                        type="text"
                        value={generalConfig.operatingBasin}
                        onChange={(e) =>
                          setGeneralConfig({
                            ...generalConfig,
                            operatingBasin: e.target.value,
                          })
                        }
                        className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs font-medium"
                        required
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        Geological basin context for lithology and stratigraphy lookups.
                      </p>
                    </div>

                    {/* Drilling Target Depth */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Planned Target Depth (m)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={generalConfig.drillingTargetDepth}
                          onChange={(e) =>
                            setGeneralConfig({
                              ...generalConfig,
                              drillingTargetDepth: Number(e.target.value),
                            })
                          }
                          className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs font-medium"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                          meters
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Total planned measured depth (MD) for current wellbore.
                      </p>
                    </div>

                    {/* Coordinate Datum */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Geodetic Datum & Projection
                      </label>
                      <input
                        type="text"
                        value={generalConfig.coordinateDatum}
                        onChange={(e) =>
                          setGeneralConfig({
                            ...generalConfig,
                            coordinateDatum: e.target.value,
                          })
                        }
                        className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs font-medium"
                      />
                    </div>

                    {/* Telemetry Refresh Rate */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Telemetry Polling Interval
                      </label>
                      <select
                        value={generalConfig.telemetryRefreshSec}
                        onChange={(e) =>
                          setGeneralConfig({
                            ...generalConfig,
                            telemetryRefreshSec: Number(e.target.value),
                          })
                        }
                        className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs font-medium cursor-pointer"
                      >
                        <option value={2}>2 Seconds (High Resolution)</option>
                        <option value={5}>5 Seconds (Recommended)</option>
                        <option value={10}>10 Seconds (Bandwidth Conservative)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. AI & RAG CONFIG */}
              {activeTab === 'ai' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#0077c8]" />
                      <span>AI & RAG Vector Pipeline Configuration</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Modular architecture endpoints for LLM providers, ChromaDB vector store, and document re-indexing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Vector Database URL */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Vector Database URL
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Database className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={aiConfig.vectorDbUrl}
                            onChange={(e) =>
                              setAiConfig({ ...aiConfig, vectorDbUrl: e.target.value })
                            }
                            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md bg-white text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs font-medium"
                            required
                          />
                        </div>
                        <span className="px-2.5 py-2 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Connected
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        ChromaDB vector endpoint housing embedded Duliajan offset well completion reports & SOPs.
                      </p>
                    </div>

                    {/* LLM API Key */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        LLM API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={aiConfig.llmApiKey}
                          onChange={(e) =>
                            setAiConfig({ ...aiConfig, llmApiKey: e.target.value })
                          }
                          className="w-full text-xs border border-gray-300 rounded-md pl-3 pr-10 py-2 bg-white text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs font-medium"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                        >
                          {showApiKey ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Secured API credential for conversational reasoning and lookahead hazard synthesis.
                      </p>
                    </div>

                    {/* Grid of Model Parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Reasoning LLM Model
                        </label>
                        <select
                          value={aiConfig.llmModel}
                          onChange={(e) =>
                            setAiConfig({ ...aiConfig, llmModel: e.target.value })
                          }
                          className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs font-medium cursor-pointer"
                        >
                          <option value="gemini-1.5-pro-drilling-domain">
                            Gemini 1.5 Pro (Domain Specialized)
                          </option>
                          <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-Low Latency)</option>
                          <option value="llama-3-70b-petrophysics">
                            LLaMA-3 70B (Petrophysics Tuned)
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Embedding Model
                        </label>
                        <input
                          type="text"
                          value={aiConfig.embeddingModel}
                          onChange={(e) =>
                            setAiConfig({ ...aiConfig, embeddingModel: e.target.value })
                          }
                          className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0077c8] shadow-2xs font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Re-index Historical Documents Card */}
                  <div className="mt-4 p-4 rounded-lg bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                        <FileCheck className="w-4 h-4 text-[#0077c8]" />
                        <span>Re-index Historical Offset Documents</span>
                      </div>
                      <p className="text-[11px] text-blue-700 mt-0.5">
                        Trigger recursive chunking & vector regeneration across all PDF well completion files.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleReindex}
                      disabled={isReindexing}
                      className="px-3.5 py-2 rounded-md text-xs font-bold bg-[#0077c8] hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin' : ''}`}
                      />
                      <span>
                        {isReindexing ? 'Re-indexing Vectors...' : 'Re-index Historical Documents'}
                      </span>
                    </button>
                  </div>

                  {reindexSuccess && (
                    <div className="p-2.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        ChromaDB vector store successfully rebuilt: 4 PDF files processed, 18 chunks embedded with 384-dim tensors.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 3. NOTIFICATIONS CONFIG */}
              {activeTab === 'notifications' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#0077c8]" />
                      <span>Real-Time Alert & Notification Preferences</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Toggle operational triggers for telemetry alarms, mud loss warnings, and rig dispatches.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Critical Kick Alerts */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          <span>Critical Kick & Blowout Alerts</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Trigger high-priority red banner and hard shut-in reminders on pit gain &gt; 5 bbls.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.criticalKickAlerts}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              criticalKickAlerts: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0077c8]"></div>
                      </label>
                    </div>

                    {/* Mud Loss Warnings */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>Mud Loss & Thief Zone Warnings</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Warn crew 50 meters prior to entering historically depleted Tipam Sandstone fractures.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.mudLossWarnings}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              mudLossWarnings: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0077c8]"></div>
                      </label>
                    </div>

                    {/* Proximity Alerts */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          <span>Offset Well Proximity Radar</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Alert when active bit trajectory is within 3 km of known blowout or stuck-pipe wells.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.proximityAlerts}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              proximityAlerts: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0077c8]"></div>
                      </label>
                    </div>

                    {/* Torque & Drag Spikes */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>Torque & Drag Anomalies</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Flag erratic rotary torque spikes (&gt; 18 kft-lbs) indicating differential sticking.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.torqueDragSpikes}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              torqueDragSpikes: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0077c8]"></div>
                      </label>
                    </div>

                    {/* Sound / Audio Alarm */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-gray-800">
                          Rig Control Room Audio Sirens
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Play browser audible chime upon critical high-risk lookahead prediction.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.audioAlerts}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              audioAlerts: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0077c8]"></div>
                      </label>
                    </div>

                    {/* SMS / Email Dispatch */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-gray-800">
                          Automated SMS / Email Dispatch
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Immediately dispatch emergency SOP summary to Duliajan Basin Superintendent on duty.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailSmsDispatch}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              emailSmsDispatch: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0077c8]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Buttons: Save Changes & Reset */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-md text-xs font-bold bg-[#0077c8] hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
