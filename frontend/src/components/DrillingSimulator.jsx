import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpRight,
  Sparkles,
  Bot,
} from 'lucide-react';
import { RAG_API_URL } from '../config';

export default function DrillingSimulator({
  nearbyWells = [],
  onRiskCalculated,
  onOpenAiAnalysis,
}) {
  const [isDrilling, setIsDrilling] = useState(false);
  const [currentDepth, setCurrentDepth] = useState(1200); // starts near Tipam formation
  const [formation, setFormation] = useState('Tipam Sandstone');
  const [riskData, setRiskData] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);

  // Auto-drilling interval: Increases currentDepth by 10 meters every 3 seconds
  useEffect(() => {
    let interval = null;
    if (isDrilling) {
      interval = setInterval(() => {
        setCurrentDepth((prev) => {
          if (prev >= 4200) {
            setIsDrilling(false);
            return prev;
          }
          return prev + 10;
        });
      }, 3000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isDrilling]);

  // Sync formation with depth realistically
  useEffect(() => {
    if (currentDepth < 600) setFormation('Alluvium');
    else if (currentDepth < 1100) setFormation('Girujan Clay');
    else if (currentDepth < 2500) setFormation('Tipam Sandstone');
    else if (currentDepth < 3500) setFormation('Barail Coal Shale');
    else setFormation('Kopili Formation');
  }, [currentDepth]);

  // Send currentDepth to Python /predict-risk via useEffect hook
  useEffect(() => {
    let isCancelled = false;

    async function evaluatePredictiveRisk() {
      setLoadingRisk(true);
      try {
        const payload = {
          current_depth: parseFloat(currentDepth),
          formation: formation,
          nearby_wells_data: nearbyWells,
        };

        const res = await fetch(`${RAG_API_URL}/predict-risk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!isCancelled) {
          setRiskData(data);
          if (onRiskCalculated) onRiskCalculated(data);
        }
      } catch (err) {
        // Fallback realistic simulation if Python backend isn't reached
        if (!isCancelled) {
          let simulated = {
            risk_level: 'Safe',
            alert_message: `Safe: Current depth ${currentDepth}m is clear of historical offset hazards within 50m.`,
            historical_context: `Offset wells in ${formation} show stable parameters around ${currentDepth}m.`,
            correlated_incidents: [],
          };

          // Proximity to 1240m Mud Loss
          if (Math.abs(currentDepth - 1240) <= 50) {
            const delta = Math.abs(currentDepth - 1240);
            simulated = {
              risk_level: 'High',
              alert_message: `CRITICAL DRILLING ALERT [HIGH RISK]: Bit at ${currentDepth}m is within ${delta}m of historical Severe Mud Loss recorded at 1240m in offset well DLJN-HST-002!`,
              historical_context: `Historical Mud Loss in Tipam Sandstone: Sudden pit drop of 120 bbl was mitigated by pumping a 60 bbl LCM pill with mica and walnut shells under hesitation squeeze.`,
              correlated_incidents: [{ well_id: 'W-002', type: 'Severe Mud Loss', delta }],
            };
          } else if (Math.abs(currentDepth - 3140) <= 50) {
            const delta = Math.abs(currentDepth - 3140);
            simulated = {
              risk_level: 'Medium',
              alert_message: `ELEVATED RISK ALERT [MEDIUM RISK]: Bit at ${currentDepth}m is within ${delta}m of historical Differentially Stuck Pipe event at 3140m in DLJN-HST-006!`,
              historical_context: `Historical Stuck Pipe in Barail Coal Shale: Overpull exceeded 165,000 lbs. Remediated by spotting a 55 bbl oil-based pipe-freeing pill with 40k lbs jarring impact.`,
              correlated_incidents: [{ well_id: 'W-006', type: 'Differentially Stuck Pipe', delta }],
            };
          }

          setRiskData(simulated);
          if (onRiskCalculated) onRiskCalculated(simulated);
        }
      } finally {
        if (!isCancelled) setLoadingRisk(false);
      }
    }

    evaluatePredictiveRisk();

    return () => {
      isCancelled = true;
    };
  }, [currentDepth, formation, nearbyWells]);

  const riskLevel = riskData?.risk_level || 'Safe';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
      {/* Simulator Header */}
      <div className="px-3 py-1.5 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-blue-100 text-[#0077c8]">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">
              Real-Time Drilling Simulator
            </h3>
            <span className="text-[9px] text-gray-500 font-medium">
              Python /predict-risk Lookahead Loop
            </span>
          </div>
        </div>

        {/* Drilling Play/Pause Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsDrilling(!isDrilling)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all ${
              isDrilling
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isDrilling ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Start Drilling</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsDrilling(false);
              setCurrentDepth(1200);
            }}
            title="Reset to 1200m"
            className="p-1 rounded-md border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-2 space-y-1.5">
        {/* Real-Time Depth & Formation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-center">
          <div className="p-1 bg-blue-50/70 border border-blue-100 rounded">
            <span className="text-[8px] uppercase font-bold text-gray-500 block">Current Depth</span>
            <span className="text-sm font-extrabold text-blue-700 font-mono">
              {currentDepth} <span className="text-[9px] font-normal">m</span>
            </span>
          </div>

          <div className="p-1 bg-slate-50 border border-gray-200 rounded">
            <span className="text-[8px] uppercase font-bold text-gray-500 block">Formation</span>
            <span className="text-[10px] font-bold text-gray-900 truncate block" title={formation}>
              {formation}
            </span>
          </div>

          <div className="p-1 bg-slate-50 border border-gray-200 rounded">
            <span className="text-[8px] uppercase font-bold text-gray-500 block">ROP (Rate)</span>
            <span className="text-[11px] font-extrabold text-gray-800 font-mono">
              {isDrilling ? '18.4' : '0.0'} <span className="text-[8px] font-normal">m/hr</span>
            </span>
          </div>

          <div className="p-1 bg-slate-50 border border-gray-200 rounded">
            <span className="text-[8px] uppercase font-bold text-gray-500 block">Mud Weight</span>
            <span className="text-[11px] font-extrabold text-gray-800 font-mono">
              1.16 <span className="text-[8px] font-normal">SG</span>
            </span>
          </div>
        </div>

        {/* Manual Depth Slider for Instant Hazard Testing */}
        <div>
          <div className="flex items-center justify-between text-[10px] mb-0.5">
            <span className="font-semibold text-gray-600">Bit Position (400m - 3800m):</span>
            <span className="font-mono text-blue-600 font-bold">{currentDepth}m</span>
          </div>
          <input
            type="range"
            min="400"
            max="3800"
            step="5"
            value={currentDepth}
            onChange={(e) => setCurrentDepth(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-[#0077c8]"
          />
          <div className="flex justify-between text-[8px] text-gray-500 mt-0.5 font-medium">
            <button
              onClick={() => setCurrentDepth(1235)}
              className="text-red-600 font-bold hover:underline"
            >
              1235m (Mud Loss)
            </button>
            <button
              onClick={() => setCurrentDepth(3140)}
              className="text-amber-600 font-bold hover:underline"
            >
              3140m (Stuck Pipe)
            </button>
            <button
              onClick={() => setCurrentDepth(800)}
              className="text-emerald-600 font-bold hover:underline"
            >
              800m (Safe Zone)
            </button>
          </div>
        </div>

        {/* PROMINENT RISK ALERT DISPLAY (RED / YELLOW / GREEN) */}
        <div
          className={`p-2 rounded-lg border transition-all duration-300 ${
            riskLevel === 'High'
              ? 'bg-red-50/80 border-red-300 shadow-sm'
              : riskLevel === 'Medium'
              ? 'bg-amber-50/80 border-amber-300 shadow-sm'
              : 'bg-emerald-50/70 border-emerald-200'
          }`}
        >
          <div className="flex items-start gap-2">
            <div className="mt-0.5 shrink-0">
              {riskLevel === 'High' ? (
                <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center animate-bounce shadow-sm">
                  <ShieldAlert className="w-3 h-3" />
                </div>
              ) : riskLevel === 'Medium' ? (
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-3 h-3" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1.5">
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full tracking-wider ${
                    riskLevel === 'High'
                      ? 'bg-red-600 text-white'
                      : riskLevel === 'Medium'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {riskLevel} Risk Alert
                </span>
                <span className="text-[9px] font-mono text-gray-500">
                  {loadingRisk ? 'Evaluating...' : 'Live Lookahead: ±50m'}
                </span>
              </div>

              {/* Alert Message */}
              <p
                className={`text-[11px] font-bold mt-0.5 leading-tight ${
                  riskLevel === 'High'
                    ? 'text-red-900'
                    : riskLevel === 'Medium'
                    ? 'text-amber-900'
                    : 'text-emerald-900'
                }`}
              >
                {riskData?.alert_message || 'Parameters normal.'}
              </p>

              {/* Historical Context / Advice */}
              {riskData?.historical_context && (
                <div className="mt-1 p-1 bg-white/90 rounded border border-gray-200 text-[10px] text-gray-700 leading-normal font-sans">
                  <span className="font-bold text-[#0077c8] inline-block mr-1">Mitigation:</span>
                  <span>
                    {riskData.historical_context.replace(/###.*?\n/g, '').replace(/\*\*/g, '').slice(0, 160)}...
                  </span>
                </div>
              )}

              {/* Direct link to dedicated Knowledge Base AI tab */}
              {onOpenAiAnalysis && riskLevel !== 'Safe' && (
                <button
                  onClick={() => {
                    const prompt = `What are the historical mitigation procedures and offset reports for ${riskLevel} risk: "${riskData?.alert_message}" in ${formation} at ${currentDepth}m?`;
                    onOpenAiAnalysis(prompt);
                  }}
                  className="mt-1.5 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-[#0077c8] font-bold text-[10px] flex items-center gap-1 transition-colors border border-blue-200"
                  title="Open Dedicated AI Assistant Tab"
                >
                  <Bot className="w-3 h-3 text-[#0077c8]" />
                  <span>Consult Knowledge Base AI Tab →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
