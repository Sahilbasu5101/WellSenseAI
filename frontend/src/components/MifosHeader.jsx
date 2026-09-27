import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  Building2,
  Layers,
  FileBarChart,
  Shield,
  Users,
  SlidersHorizontal,
  Search,
  Bell,
  User,
  HelpCircle,
  Settings,
  LogOut,
  Compass,
  Radio,
} from 'lucide-react';

export default function MifosHeader({ user, onLogout, onGoHome }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('wells');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-[#0077c8] text-white shadow-md select-none sticky top-0 z-40">
      <div className="flex items-center justify-between px-2.5 py-1 min-h-[44px]">
        {/* Left Side: Brand Logo, Chevron, and Navigation Tabs */}
        <div className="flex items-center space-x-1 lg:space-x-2.5 overflow-x-auto scrollbar-none">
          {/* Logo Brandmark */}
          <button
            onClick={onGoHome}
            title="Return to Home Landing Page"
            className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded bg-white text-[#0077c8] font-black flex items-center justify-center text-base shadow-sm">
              W
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:inline">WellSense AI</span>
          </button>

          {/* Mifos Style Chevron Separator */}
          <ChevronRight className="w-4 h-4 text-blue-200 shrink-0 hidden md:block" />

          {/* Mifos Top Navigation Items */}
          <nav className="flex items-center space-x-1 text-xs font-medium">
            <button
              onClick={() => setActiveNav('wells')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeNav === 'wells' ? 'bg-[#005a9c] font-bold text-white shadow-inner' : 'hover:bg-white/10 text-blue-50'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>eRTMAC Rig Monitor</span>
            </button>

            <button
              onClick={() => setActiveNav('institution')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeNav === 'institution' ? 'bg-[#005a9c] font-bold text-white' : 'hover:bg-white/10 text-blue-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Oil India Limited</span>
            </button>

            <button
              onClick={() => setActiveNav('reports')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap hidden sm:flex ${
                activeNav === 'reports' ? 'bg-[#005a9c] font-bold text-white' : 'hover:bg-white/10 text-blue-50'
              }`}
            >
              <FileBarChart className="w-3.5 h-3.5" />
              <span>Well Completion Reports</span>
            </button>

            <button
              onClick={() => setActiveNav('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap hidden lg:flex ${
                activeNav === 'admin' ? 'bg-[#005a9c] font-bold text-white' : 'hover:bg-white/10 text-blue-50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => setActiveNav('wizard')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap hidden xl:flex ${
                activeNav === 'wizard' ? 'bg-[#005a9c] font-bold text-white' : 'hover:bg-white/10 text-blue-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Config Wizard</span>
            </button>
          </nav>
        </div>

        {/* Right Side: Search, Language, Notifications, and User Menu */}
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
          {/* Search Field */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-white/70" />
            <input
              type="text"
              placeholder="Search Activity / Wells..."
              className="w-40 lg:w-48 pl-8 pr-2.5 py-1 bg-white/15 border border-white/20 rounded text-xs text-white placeholder-blue-100 focus:outline-none focus:bg-white/25 focus:ring-1 focus:ring-white"
            />
          </div>

          {/* Language Selector */}
          <div className="hidden lg:flex flex-col text-[10px] text-right leading-tight">
            <span className="text-blue-200">Language</span>
            <span className="underline cursor-pointer font-semibold text-white">English</span>
          </div>

          {/* Quick Action Compass / Tool */}
          <button
            title="Geospatial Orientation"
            className="p-1.5 rounded hover:bg-white/10 text-white transition-colors"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <button
            title="Active Rig Alerts"
            className="p-1.5 rounded hover:bg-white/10 text-white relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </button>

          {/* User Profile Dropdown (Exact Mifos Structure from Screenshot) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#005a9c] hover:bg-[#004e87] text-white transition-colors border border-blue-400/40"
              title="User Account"
            >
              <div className="w-6 h-6 rounded-full bg-white text-[#0077c8] flex items-center justify-center font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold max-w-[85px] truncate hidden sm:inline">
                {user?.username || 'Operator'}
              </span>
            </button>

            {/* Dropdown Menu (Matches User Log Out Page in image) */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-200 py-1 z-50 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-gray-100 bg-slate-50">
                  <div className="font-bold text-gray-900 truncate">{user?.username || 'mifos'}</div>
                  <div className="text-[10px] text-gray-500 truncate">{user?.email || 'operator@oilindia.in'}</div>
                  <div className="text-[10px] text-blue-600 font-semibold mt-0.5">{user?.rig || 'Duliajan Basin'}</div>
                </div>

                <a
                  href="#help"
                  onClick={(e) => { e.preventDefault(); setProfileDropdownOpen(false); }}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <span>Help</span>
                </a>

                <a
                  href="#profile"
                  onClick={(e) => { e.preventDefault(); setProfileDropdownOpen(false); }}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Profile</span>
                </a>

                <a
                  href="#settings"
                  onClick={(e) => { e.preventDefault(); setProfileDropdownOpen(false); }}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Settings</span>
                </a>

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 text-red-600 font-semibold transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
