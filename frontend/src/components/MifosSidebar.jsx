import React, { useState } from 'react';
import {
  Menu,
  X,
  Radio,
  Database,
  Gauge,
  Navigation,
  CheckSquare,
  Bot,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function MifosSidebar({
  activeItem = 'live',
  onSelectItem,
  isSidebarOpen: externalIsOpen,
  onToggleSidebar,
}) {
  // Support both controlled and uncontrolled state
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isSidebarOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggleSidebar) {
      onToggleSidebar(!isSidebarOpen);
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const [hovered, setHovered] = useState(null);

  const sidebarItems = [
    { id: 'live', icon: Radio, label: 'Live Surveillance' },
    { id: 'db', icon: Database, label: 'Historical Database' },
    { id: 'rag', icon: Bot, label: 'Knowledge Base AI' },
    { id: 'risk', icon: Gauge, label: 'Risk Analytics' },
    { id: 'map', icon: Navigation, label: 'Offset Well Map' },
    { id: 'verify', icon: CheckSquare, label: 'Well Control Protocols' },
    { id: 'alerts', icon: Bell, label: 'Hazard & Proximity Alerts' },
    { id: 'settings', icon: Settings, label: 'System Settings' },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col select-none shrink-0 shadow-sm z-30 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-[260px]' : 'w-20'
      }`}
    >
      {/* Top Header: Hamburger Menu Icon Toggle Button */}
      <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
        {isSidebarOpen ? (
          <>
            <div className="flex items-center gap-2 overflow-hidden">
              <button
                onClick={handleToggle}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <span className="font-bold text-xs text-gray-800 tracking-wide uppercase truncate">
                Navigation
              </span>
            </div>
            <button
              onClick={handleToggle}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Collapse"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <button
              onClick={handleToggle}
              className="p-2 rounded-lg hover:bg-blue-50 hover:text-[#0077c8] text-gray-700 transition-colors focus:outline-none"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Items List */}
      <nav className="flex-1 py-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <div key={item.id} className="relative group px-2">
              <button
                onClick={() => onSelectItem && onSelectItem(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className={`w-full flex items-center rounded-lg transition-all duration-150 ${
                  isSidebarOpen
                    ? 'px-3 py-2.5 gap-3 justify-start'
                    : 'py-2.5 justify-center'
                } ${
                  isActive
                    ? 'border-l-4 border-[#0077c8] bg-blue-50 text-[#0077c8] font-bold shadow-sm'
                    : 'border-l-4 border-transparent text-gray-600 hover:bg-slate-50 hover:text-gray-900 font-medium'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-[#0077c8]' : 'text-gray-500 group-hover:text-gray-800'
                  }`}
                />

                {/* Text Label - visible only when expanded */}
                {isSidebarOpen && (
                  <span className="text-xs truncate transition-opacity duration-200 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>

              {/* Floating Tooltip (Gemini Style) when Collapsed */}
              {!isSidebarOpen && hovered === item.id && (
                <div className="absolute left-[78px] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-medium rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none animate-in fade-in slide-in-from-left-1 duration-150">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-gray-100 shrink-0">
        {isSidebarOpen ? (
          <div className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-lg border border-gray-100 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
            <div className="min-w-0 flex-1">
              <span className="block font-bold text-gray-800 truncate text-[11px]">
                eRTMAC Online
              </span>
              <span className="block text-gray-500 text-[10px] truncate">
                OIL Duliajan Core
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"
              title="eRTMAC System Connected"
            ></span>
          </div>
        )}
      </div>
    </aside>
  );
}
