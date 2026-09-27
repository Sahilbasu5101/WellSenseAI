import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass,
  Sliders,
  Filter,
  Layers,
  MapPin,
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Radio,
  ExternalLink,
  ChevronRight,
  Eye,
  Info,
} from 'lucide-react';

const DULIAJAN_CENTER = {
  lat: 27.3653,
  lng: 95.3197,
};

const BASE_HISTORICAL_WELLS = [
  {
    well_id: 'W-002',
    name: 'DLJN-HST-002',
    status: 'Historical',
    lat: 27.3821,
    lng: 95.3412,
    total_depth: 3950,
    distanceMeters: 3200,
    distanceKm: 3.2,
    bearing: 'NW',
    formation: 'Tipam Sandstone',
    incident_type: 'Mud Loss',
    incident_desc: 'Severe Mud Loss at 1240m (120 bbl drop cured with LCM pill)',
    spud_year: 2019,
  },
  {
    well_id: 'W-005',
    name: 'DLJN-HST-005',
    status: 'Historical',
    lat: 27.3251,
    lng: 95.3121,
    total_depth: 3600,
    distanceMeters: 4800,
    distanceKm: 4.8,
    bearing: 'S',
    formation: 'Namsang Formation',
    incident_type: 'Mud Loss',
    incident_desc: 'Circulation loss in coarse gravel beds at 1264m',
    spud_year: 2020,
  },
  {
    well_id: 'W-006',
    name: 'DLJN-HST-006',
    status: 'Historical',
    lat: 27.3712,
    lng: 95.3985,
    total_depth: 4200,
    distanceMeters: 7800,
    distanceKm: 7.8,
    bearing: 'E',
    formation: 'Barail Coal Shale',
    incident_type: 'Stuck Pipe',
    incident_desc: 'Differentially stuck pipe at 3140m (165k lbs overpull freed with jarring)',
    spud_year: 2021,
  },
  {
    well_id: 'W-008',
    name: 'DLJN-HST-008',
    status: 'Historical',
    lat: 27.4391,
    lng: 95.3854,
    total_depth: 3750,
    distanceMeters: 11400,
    distanceKm: 11.4,
    bearing: 'NE',
    formation: 'Kopili Formation',
    incident_type: 'Gas Kick',
    incident_desc: 'Abnormal pressure gas kick at 3350m (SIDPP 420 psi)',
    spud_year: 2022,
  },
  {
    well_id: 'W-011',
    name: 'DLJN-HST-011',
    status: 'Historical',
    lat: 27.2845,
    lng: 95.2311,
    total_depth: 3420,
    distanceMeters: 13100,
    distanceKm: 13.1,
    bearing: 'SW',
    formation: 'Girujan Clay',
    incident_type: 'Wellbore Instability',
    incident_desc: 'Severe reactive shale swelling and tight pull at 890m',
    spud_year: 2023,
  },
  {
    well_id: 'W-014',
    name: 'DLJN-HST-014',
    status: 'Historical',
    lat: 27.3592,
    lng: 95.2541,
    total_depth: 4100,
    distanceMeters: 6500,
    distanceKm: 6.5,
    bearing: 'W',
    formation: 'Tipam Sandstone',
    incident_type: 'Normal Baseline',
    incident_desc: 'Normal baseline offset logs with zero NPT incidents',
    spud_year: 2024,
  },
  {
    well_id: 'W-018',
    name: 'DLJN-HST-018',
    status: 'Historical',
    lat: 27.4102,
    lng: 95.2891,
    total_depth: 3880,
    distanceMeters: 5900,
    distanceKm: 5.9,
    bearing: 'NW',
    formation: 'Tipam Sandstone',
    incident_type: 'Mud Loss',
    incident_desc: 'Moderate seepage of 35 bbl/hr across fractured upper sand',
    spud_year: 2021,
  },
  {
    well_id: 'W-022',
    name: 'DLJN-HST-022',
    status: 'Historical',
    lat: 27.3195,
    lng: 95.4121,
    total_depth: 4350,
    distanceMeters: 10400,
    distanceKm: 10.4,
    bearing: 'SE',
    formation: 'Barail Coal Shale',
    incident_type: 'Stuck Pipe',
    incident_desc: 'Sloughing coal caused pack-off while reaming at 3410m',
    spud_year: 2022,
  },
  {
    well_id: 'W-027',
    name: 'DLJN-HST-027',
    status: 'Historical',
    lat: 27.4512,
    lng: 95.3101,
    total_depth: 3620,
    distanceMeters: 9600,
    distanceKm: 9.6,
    bearing: 'N',
    formation: 'Girujan Clay',
    incident_type: 'Wellbore Instability',
    incident_desc: 'Tight hole during casing run at 1120m, circulated out gumbo',
    spud_year: 2020,
  },
];

export default function OffsetWellMap({ onSelectHistoricalWell }) {
  // Filter States
  const [radiusKm, setRadiusKm] = useState(12);
  const [maxDepth, setMaxDepth] = useState(4500);
  const [selectedIncidents, setSelectedIncidents] = useState({
    'Mud Loss': true,
    'Stuck Pipe': true,
    'Gas Kick': true,
    'Wellbore Instability': true,
    'Normal Baseline': true,
  });

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const circleRef = useRef(null);

  // Toggle individual incident checkbox
  const handleToggleIncident = (type) => {
    setSelectedIncidents((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleResetFilters = () => {
    setRadiusKm(12);
    setMaxDepth(4500);
    setSelectedIncidents({
      'Mud Loss': true,
      'Stuck Pipe': true,
      'Gas Kick': true,
      'Wellbore Instability': true,
      'Normal Baseline': true,
    });
  };

  // Filter wells based on Radius, Depth, and Incident types
  const filteredWells = useMemo(() => {
    return BASE_HISTORICAL_WELLS.filter((well) => {
      // Radius filter
      if (well.distanceKm > radiusKm) return false;
      // Target Depth filter
      if (well.total_depth > maxDepth) return false;
      // Incident Checkbox filter
      if (!selectedIncidents[well.incident_type]) return false;
      return true;
    });
  }, [radiusKm, maxDepth, selectedIncidents]);

  // Closest well calculation
  const closestWell = useMemo(() => {
    if (filteredWells.length === 0) return null;
    return [...filteredWells].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }, [filteredWells]);

  // Deepest well calculation
  const deepestWell = useMemo(() => {
    if (filteredWells.length === 0) return null;
    return [...filteredWells].sort((a, b) => b.total_depth - a.total_depth)[0];
  }, [filteredWells]);

  // 1. Initialize Leaflet Map (Safe against React 19 / StrictMode)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [DULIAJAN_CENTER.lat, DULIAJAN_CENTER.lng],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors • Oil India eRTMAC',
        maxZoom: 18,
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersGroupRef.current = null;
        circleRef.current = null;
      }
    };
  }, []);

  // 2. ResizeObserver for seamless browser zooming / window resizing
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    let observer = null;
    if (mapContainerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => handleResize());
      observer.observe(mapContainerRef.current);
    }
    const timer = setTimeout(handleResize, 250);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // 3. Update Markers & Radius Circle dynamically when filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const activeCenter = [DULIAJAN_CENTER.lat, DULIAJAN_CENTER.lng];

    // Update Radius Circle
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }
    circleRef.current = L.circle(activeCenter, {
      radius: radiusKm * 1000,
      color: '#0077c8',
      fillColor: '#0077c8',
      fillOpacity: 0.07,
      weight: 2,
      dashArray: '5, 5',
    }).addTo(map);

    // Active Rig Marker (Red, with pulsing halo)
    const activeRigIcon = L.divIcon({
      className: 'custom-active-rig-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; background-color: rgba(220, 38, 38, 0.35); border-radius: 50%; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 28px; height: 28px; background-color: #dc2626; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 12px rgba(220,38,38,0.6); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });

    const activePopupContent = `
      <div style="padding: 10px; font-family: inherit; max-width: 250px;">
        <div style="font-size: 10px; font-weight: bold; color: #dc2626; text-transform: uppercase; margin-bottom: 2px;">
          ● Active Drilling Rig
        </div>
        <div style="font-size: 14px; font-weight: 800; color: #111827;">
          DLJN-ACT-001 (W-001)
        </div>
        <div style="font-size: 11px; color: #4b5563; margin-top: 6px; line-height: 1.4;">
          <div><b>Coordinates:</b> ${DULIAJAN_CENTER.lat}°N, ${DULIAJAN_CENTER.lng}°E</div>
          <div><b>Target TD:</b> 3,840m (Barail Coal Shale)</div>
          <div><b>Current Status:</b> Live Telemetry Stream Active</div>
        </div>
      </div>
    `;

    L.marker(activeCenter, { icon: activeRigIcon })
      .bindPopup(activePopupContent)
      .addTo(markersGroup);

    // Blue Historical Wells Markers
    filteredWells.forEach((well) => {
      const wellPos = [well.lat, well.lng];

      const blueHistoricalIcon = L.divIcon({
        className: 'custom-offset-historical-marker',
        html: `
          <div style="width: 26px; height: 26px; background-color: #0077c8; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 3px 8px rgba(0,119,200,0.5); display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -13],
      });

      // Construct interactive custom Leaflet popup
      const popupDiv = document.createElement('div');
      popupDiv.style.padding = '12px';
      popupDiv.style.fontFamily = 'inherit';
      popupDiv.style.maxWidth = '260px';

      popupDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 9px; font-weight: bold; text-transform: uppercase; color: #0077c8; background: #eff6ff; padding: 2px 6px; border-radius: 4px;">
            Historical Offset Well
          </span>
          <span style="font-size: 11px; font-weight: 700; color: #4b5563;">
            ${well.distanceKm} km ${well.bearing}
          </span>
        </div>
        <div style="font-size: 13px; font-weight: 800; color: #111827;">
          ${well.name} <span style="font-size: 11px; color: #6b7280; font-weight: normal;">(${well.well_id})</span>
        </div>
        <div style="font-size: 11px; color: #4b5563; margin-top: 6px; line-height: 1.4;">
          <div><b>Target TD:</b> ${well.total_depth.toLocaleString()}m</div>
          <div><b>Primary Formation:</b> ${well.formation}</div>
          <div style="margin-top: 4px; padding: 4px 6px; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 4px; color: #991b1b; font-size: 10px;">
            <b>Historical Incident:</b> ${well.incident_desc}
          </div>
        </div>
      `;

      const viewBtn = document.createElement('button');
      viewBtn.innerHTML = '🔍 View Well History';
      viewBtn.style.marginTop = '10px';
      viewBtn.style.width = '100%';
      viewBtn.style.padding = '7px 10px';
      viewBtn.style.backgroundColor = '#0077c8';
      viewBtn.style.color = '#ffffff';
      viewBtn.style.fontSize = '11px';
      viewBtn.style.fontWeight = 'bold';
      viewBtn.style.borderRadius = '6px';
      viewBtn.style.border = 'none';
      viewBtn.style.cursor = 'pointer';

      viewBtn.onclick = () => {
        if (onSelectHistoricalWell) {
          onSelectHistoricalWell(well);
        }
      };

      popupDiv.appendChild(viewBtn);

      L.marker(wellPos, { icon: blueHistoricalIcon })
        .bindPopup(popupDiv)
        .addTo(markersGroup);
    });
  }, [radiusKm, filteredWells, onSelectHistoricalWell]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col lg:flex-row h-full w-full overflow-hidden select-none">
      {/* 1. LEFT 80% AREA: FULL-SCREEN INTERACTIVE LEAFLET MAP */}
      <div className="flex-1 lg:w-[80%] h-full flex flex-col relative overflow-hidden min-h-[380px]">
        {/* Top Floating Map Info Ribbon */}
        <div className="absolute top-3 left-14 z-[400] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200 shadow-md flex items-center gap-3 text-xs text-gray-800 pointer-events-auto">
          <div className="flex items-center gap-1.5 font-bold text-[#0077c8]">
            <Compass className="w-4 h-4" />
            <span>Duliajan Shelf (27.3653°N, 95.3197°E)</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <strong className="text-gray-900">Active Rig</strong>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0077c8]"></span>
              <span>Offset Wells: <strong>{filteredWells.length}</strong></span>
            </span>
            <span className="inline-flex items-center gap-1 text-blue-700 font-mono font-bold">
              Radius: {radiusKm} km
            </span>
          </div>
        </div>

        {/* Leaflet Map Canvas */}
        <div
          ref={mapContainerRef}
          className="w-full h-full flex-1"
          style={{ zIndex: 1 }}
        />
      </div>

      {/* 2. RIGHT 20% PANEL: GEOSPATIAL FILTER ENGINE */}
      <div className="w-full lg:w-[20%] lg:min-w-[280px] lg:max-w-xs bg-slate-50 border-t lg:border-t-0 lg:border-l border-gray-200 p-3 sm:p-4 flex flex-col justify-between overflow-y-auto space-y-4 shrink-0">
        <div className="space-y-4">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-blue-100 text-[#0077c8]">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  Spatial Filters
                </h3>
                <span className="text-[10px] text-gray-500 font-medium">
                  Geodetic Range & Incidents
                </span>
              </div>
            </div>

            <button
              onClick={handleResetFilters}
              className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
              title="Reset all spatial filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Slider 1: Search Radius (km) */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Radius (km)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#0077c8] text-white font-mono font-bold text-xs">
                {radiusKm} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0077c8]"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-mono">
              <span>1 km</span>
              <span>12 km (Default)</span>
              <span>25 km</span>
            </div>
          </div>

          {/* Slider 2: Target Depth (m) */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#0077c8]" />
                <span>Target Depth (m)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-gray-900 border border-gray-300 font-mono font-bold text-xs">
                ≤ {maxDepth}m
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="4500"
              step="50"
              value={maxDepth}
              onChange={(e) => setMaxDepth(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0077c8]"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-mono">
              <span>2,000m</span>
              <span>3,500m</span>
              <span>4,500m</span>
            </div>
          </div>

          {/* Multi-Select Checkboxes: Filter by Incident */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs space-y-2">
            <span className="font-bold text-gray-900 text-xs block mb-1">
              Filter by Incident
            </span>
            <div className="space-y-1.5">
              {[
                { type: 'Mud Loss', label: 'Mud Loss / Thief Zone', color: 'text-blue-700' },
                { type: 'Stuck Pipe', label: 'Differentially Stuck Pipe', color: 'text-amber-700' },
                { type: 'Gas Kick', label: 'Gas Kick / Influx', color: 'text-red-700' },
                { type: 'Wellbore Instability', label: 'Wellbore Instability', color: 'text-purple-700' },
                { type: 'Normal Baseline', label: 'Normal Baseline Drilling', color: 'text-emerald-700' },
              ].map((item) => (
                <label
                  key={item.type}
                  className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!selectedIncidents[item.type]}
                    onChange={() => handleToggleIncident(item.type)}
                    className="w-3.5 h-3.5 rounded text-[#0077c8] focus:ring-[#0077c8] border-gray-300"
                  />
                  <span className={`text-[11px] font-medium ${item.color}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Spatial Metrics Summary Card (Bottom) */}
        <div className="pt-2">
          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
            <div className="font-bold text-gray-900 text-xs flex items-center justify-between">
              <span>Spatial Density</span>
              <span className="px-2 py-0.5 rounded bg-[#0077c8] text-white font-mono font-bold text-[10px]">
                {filteredWells.length} Wells
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-gray-600">
              <div className="flex justify-between">
                <span>Closest Offset:</span>
                <strong className="text-gray-900 font-mono">
                  {closestWell ? `${closestWell.name} (${closestWell.distanceKm}km)` : 'None'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Deepest TD:</span>
                <strong className="text-gray-900 font-mono">
                  {deepestWell ? `${deepestWell.total_depth}m` : 'None'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Active Rig:</span>
                <strong className="text-red-700">DLJN-ACT-001</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
