import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Sliders, Compass, Eye } from 'lucide-react';
import { NODE_API_URL } from '../config';

export default function WellMap({ onSelectHistoricalWell, onWellsLoaded }) {
  const [radiusKm, setRadiusKm] = useState(15);
  const [activeWell, setActiveWell] = useState(null);
  const [nearbyWells, setNearbyWells] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const circleRef = useRef(null);

  // 1. Fetch Active Well from Express Backend (or fallback)
  useEffect(() => {
    let isCancelled = false;
    async function fetchActiveWell() {
      try {
        setLoading(true);
        const res = await fetch(`${NODE_API_URL}/api/wells/active`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success && data.well && !isCancelled) {
          setActiveWell(data.well);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('[WellMap] Using fallback active well (Express offline):', err.message);
          setActiveWell({
            well_id: 'W-001',
            name: 'DLJN-ACT-001',
            status: 'Active',
            location: { coordinates: [95.41571, 27.366965] },
            total_depth: 3840,
            formations: [
              { name: 'Alluvium', depth_start: 0, depth_end: 420 },
              { name: 'Tipam Sandstone', depth_start: 1280, depth_end: 2650 },
              { name: 'Barail Coal Shale', depth_start: 2650, depth_end: 3840 },
            ],
          });
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    fetchActiveWell();
    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Fetch Nearby Historical Wells when activeWell or radiusKm changes
  useEffect(() => {
    if (!activeWell || !activeWell.location?.coordinates) return;

    let isCancelled = false;
    const [lng, lat] = activeWell.location.coordinates;
    const radiusMeters = radiusKm * 1000;

    async function fetchNearbyWells() {
      try {
        const url = `${NODE_API_URL}/api/wells/nearby?lat=${lat}&lng=${lng}&radius=${radiusMeters}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success && !isCancelled) {
          setNearbyWells(data.wells || []);
          if (onWellsLoaded) onWellsLoaded(data.wells || []);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('[WellMap] Using fallback offset wells (Express offline):', err.message);
          const mockOffsets = [
            {
              well_id: 'W-002',
              name: 'DLJN-HST-002',
              status: 'Historical',
              total_depth: 3950,
              distance: 3200,
              location: { coordinates: [lng + 0.015, lat + 0.012] },
              formations: [{ name: 'Tipam Sandstone', depth_start: 1100, depth_end: 2400 }],
              incidents: [{ depth: 1240, type: 'Severe Mud Loss', description: 'Pit drop 120 bbl. Cured with 60 bbl LCM.' }]
            },
            {
              well_id: 'W-006',
              name: 'DLJN-HST-006',
              status: 'Historical',
              total_depth: 4200,
              distance: 7800,
              location: { coordinates: [lng - 0.035, lat + 0.025] },
              formations: [{ name: 'Barail Coal Shale', depth_start: 2600, depth_end: 3600 }],
              incidents: [{ depth: 3140, type: 'Differentially Stuck Pipe', description: 'Overpull 165k lbs. Spotted oil-based pill.' }]
            },
            {
              well_id: 'W-008',
              name: 'DLJN-HST-008',
              status: 'Historical',
              total_depth: 3600,
              distance: 11400,
              location: { coordinates: [lng + 0.05, lat - 0.04] },
              formations: [{ name: 'Kopili Formation', depth_start: 3200, depth_end: 3600 }],
              incidents: [{ depth: 3350, type: 'Gas Kick Influx', description: 'SIDPP 420 psi, SICP 580 psi. Driller method circulated out.' }]
            },
            {
              well_id: 'W-013',
              name: 'DLJN-HST-013',
              status: 'Historical',
              total_depth: 4120,
              distance: 7162,
              location: { coordinates: [lng + 0.045, lat + 0.045] },
              formations: [{ name: 'Barail Coal Shale', depth_start: 2700, depth_end: 4120 }],
              incidents: []
            }
          ];
          setNearbyWells(mockOffsets);
          if (onWellsLoaded) onWellsLoaded(mockOffsets);
        }
      }
    }

    fetchNearbyWells();
    return () => {
      isCancelled = true;
    };
  }, [activeWell, radiusKm]);

  // 3. Initialize Leaflet Map (Safe against StrictMode & React 19)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter = [27.366965, 95.41571];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
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

  // Handle browser zoom / container resize seamlessly
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
    // Also trigger on slight delays
    const timer = setTimeout(handleResize, 300);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // 4. Update Map Markers and Circle Layer whenever activeWell, nearbyWells, or radiusKm changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (!activeWell || !activeWell.location?.coordinates) return;

    const [actLng, actLat] = activeWell.location.coordinates;
    const activeCenter = [actLat, actLng];

    // Smoothly pan to active well
    map.panTo(activeCenter);

    // Update or create Radius Circle
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }
    circleRef.current = L.circle(activeCenter, {
      radius: radiusKm * 1000,
      color: '#0077c8',
      fillColor: '#0077c8',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '4, 4',
    }).addTo(map);

    // Distinct RED Active Well Icon
    const redActiveIcon = L.divIcon({
      className: 'custom-active-marker',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div class="active-well-pulse"></div>
          <div style="position: relative; width: 26px; height: 26px; background-color: #dc2626; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 10px rgba(220,38,38,0.5); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17],
    });

    const activePopupHtml = `
      <div style="padding: 10px; font-family: inherit; max-width: 240px;">
        <div style="font-size: 10px; font-weight: bold; color: #dc2626; text-transform: uppercase; margin-bottom: 2px;">
          ● Active Drilling Rig
        </div>
        <div style="font-size: 13px; font-weight: 800; color: #111827;">
          ${activeWell.name} (${activeWell.well_id})
        </div>
        <div style="font-size: 11px; color: #4b5563; margin-top: 6px; line-height: 1.4;">
          <div><b>Target TD:</b> ${activeWell.total_depth}m</div>
          <div><b>Location:</b> ${actLat.toFixed(4)}°N, ${actLng.toFixed(4)}°E</div>
          <div><b>Status:</b> Live Stream Active</div>
        </div>
      </div>
    `;

    L.marker(activeCenter, { icon: redActiveIcon })
      .bindPopup(activePopupHtml)
      .addTo(markersGroup);

    // Distinct BLUE Historical Wells Icons
    nearbyWells.forEach((well) => {
      const coords = well.location?.coordinates;
      if (!coords || coords.length < 2) return;
      const wellPos = [coords[1], coords[0]];
      const distStr = well.distance ? `${(well.distance / 1000).toFixed(2)} km` : 'Within radius';

      const blueHistoricalIcon = L.divIcon({
        className: 'custom-historical-marker',
        html: `
          <div style="width: 22px; height: 22px; background-color: #0b66b3; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 6px rgba(11,102,179,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -11],
      });

      // Construct popup with dynamic button hook
      const popupDiv = document.createElement('div');
      popupDiv.style.padding = '12px';
      popupDiv.style.fontFamily = 'inherit';
      popupDiv.style.maxWidth = '250px';

      popupDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 9px; font-weight: bold; text-transform: uppercase; color: #0077c8; background: #eff6ff; padding: 2px 6px; border-radius: 4px;">
            Historical Well
          </span>
          <span style="font-size: 11px; font-weight: 600; color: #6b7280;">
            ${distStr}
          </span>
        </div>
        <div style="font-size: 13px; font-weight: bold; color: #111827;">
          ${well.name} <span style="font-size: 11px; color: #6b7280;">(${well.well_id})</span>
        </div>
        <div style="font-size: 11px; color: #4b5563; margin-top: 6px; line-height: 1.4;">
          <div><b>Total Depth:</b> ${well.total_depth}m</div>
          <div><b>Status:</b> ${well.status}</div>
          <div><b>Formation:</b> ${well.formations?.[well.formations.length - 1]?.name || 'Assam Basin'}</div>
        </div>
      `;

      const viewBtn = document.createElement('button');
      viewBtn.innerHTML = '🔍 View Historical Data';
      viewBtn.style.marginTop = '8px';
      viewBtn.style.width = '100%';
      viewBtn.style.padding = '6px 10px';
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
  }, [activeWell, nearbyWells, radiusKm, onSelectHistoricalWell]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full min-h-0">
      {/* Range Slider & Control Bar */}
      <div className="px-3 py-1.5 bg-slate-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-blue-100 text-[#0077c8]">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">
              Offset Surveillance Map
            </h3>
            <span className="text-[9px] text-gray-500">
              MongoDB 2dsphere • Duliajan, Assam
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 whitespace-nowrap">
            <Sliders className="w-3 h-3 text-blue-600" />
            <span className="text-[10px]">Radius:</span>
            <span className="px-1.5 py-0.2 rounded bg-[#0077c8] text-white font-mono font-bold text-[10px]">
              {radiusKm} km
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-20 sm:w-28 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0077c8]"
            title={`Adjust search radius from 1km to 20km (current: ${radiusKm}km)`}
          />
        </div>
      </div>

      {/* Map Legend Strip */}
      <div className="px-2.5 py-0.5 bg-white border-b border-gray-100 flex items-center justify-between text-[10px] text-gray-600 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="font-bold text-gray-900">Active: {activeWell?.name || 'W-001'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0077c8]"></span>
            <span>Historical: <strong className="text-blue-700">{nearbyWells.length} wells</strong></span>
          </div>
        </div>
        <span className="text-[9px] text-gray-500 hidden sm:inline">
          Duliajan Shelf (Assam Basin)
        </span>
      </div>

      {/* Native Leaflet Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full flex-1 min-h-[280px] h-full"
        style={{ zIndex: 1 }}
      />
    </div>
  );
}
