import React, { useState } from 'react';
import LoginModal from './components/LoginModal';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  FileSearch,
  Gauge,
  Globe,
  LogIn,
  MapPin,
  Menu,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Live Risk Simulator State on Landing Page
  const [simDepth, setSimDepth] = useState(1220);
  const [simFormation, setSimFormation] = useState('Tipam Sandstone');
  const [simSearchRadius, setSimSearchRadius] = useState(15);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (window.location.hash) {
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch (e) {
        window.location.hash = '';
      }
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const calculateSimulatedRisk = (depth, formation) => {
    if (formation === 'Tipam Sandstone' && Math.abs(depth - 1240) <= 50) {
      const delta = Math.abs(depth - 1240);
      return {
        level: 'High',
        badgeColor: 'bg-red-50 text-red-700 border-red-200',
        cardBg: 'bg-red-50/50 border-red-200',
        icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
        alert: `CRITICAL DRILLING ALERT: Bit is within ${delta}m of historical Severe Mud Loss (1240m) in offset well DLJN-HST-002.`,
        advice: 'Pre-treat active system with 60 bbl LCM pill (mica + walnut shells). Lower ECD and stage pump rate.',
        offsetWell: 'DLJN-HST-002 (3.2 km NW)',
      };
    }
    if (formation === 'Barail Coal Shale' && Math.abs(depth - 3140) <= 50) {
      const delta = Math.abs(depth - 3140);
      return {
        level: 'Medium',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        cardBg: 'bg-amber-50/50 border-amber-200',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        alert: `ELEVATED RISK ALERT: Bit is within ${delta}m of historical Differentially Stuck Pipe event (3140m) in DLJN-HST-006.`,
        advice: 'Maintain continuous rotation, spot pipe-freeing lubricant, and restrict static tool face orientation time.',
        offsetWell: 'DLJN-HST-006 (7.8 km E)',
      };
    }
    return {
      level: 'Safe',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cardBg: 'bg-emerald-50/40 border-emerald-200',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      alert: `PARAMETERS NORMAL: No historical offset well anomalies within 50m of current depth (${depth}m).`,
      advice: 'Drilling telemetry aligns with regional baseline. Continue standard parameter tracking.',
      offsetWell: 'Offset baselines clear within 15 km',
    };
  };

  const currentRisk = calculateSimulatedRisk(simDepth, simFormation);

  // If user is authenticated, render the Mifos-style Decision Support Dashboard
  if (isAuthenticated) {
    return (
      <ErrorBoundary>
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onGoHome={() => setIsAuthenticated(false)}
        />
      </ErrorBoundary>
    );
  }

  // Otherwise, render the modern white-theme Landing Page
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Login Modal Popup */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-xs md:text-sm font-medium text-blue-900 text-center flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white">
          SIH 2026
        </span>
        <span>Problem Statement 26121 • Oil India Limited (OIL) • eRTMAC Integrated Intelligence</span>
      </div>

      {/* 2. NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-blue-900">
                WellSense <span className="text-blue-600">AI</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-gray-500 -mt-1">
                Nearby Wells Intelligence
              </span>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#home" className="text-blue-600 hover:text-blue-700 transition-colors">
              Home
            </a>
            <a href="#problem-solution" className="hover:text-blue-600 transition-colors">
              Problem & Solution
            </a>
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#simulator" className="hover:text-blue-600 transition-colors">
              Interactive Demo
            </a>
            <a href="#architecture" className="hover:text-blue-600 transition-colors">
              Architecture
            </a>
            <a href="#tech-stack" className="hover:text-blue-600 transition-colors">
              Tech Stack
            </a>
          </nav>

          {/* Right Action: Login Button & Go to Dashboard */}
          <div className="hidden md:flex items-center gap-3">
            {/* LOGIN BUTTON */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              <span>Login</span>
            </button>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg border border-blue-200"
            >
              Login
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-4 space-y-2 text-sm font-medium text-gray-700">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-blue-50 text-blue-600">
              Home
            </a>
            <a href="#problem-solution" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-50">
              Problem & Solution
            </a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-50">
              Features
            </a>
            <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-50">
              Interactive Demo
            </a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-50">
              Architecture
            </a>
            <a href="#tech-stack" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-50">
              Tech Stack
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); setIsLoginModalOpen(true); }}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Login to eRTMAC
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setIsLoginModalOpen(true); }}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time eRTMAC Integration • Geological Offset Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Empowering Drilling Decisions with <span className="text-blue-700">AI</span> &amp; Institutional Memory.
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A Nearby Wells Intelligence System (NWIS) that seamlessly integrates with eRTMAC to proactively mitigate
              drilling risks using historical data, RAG, and Geospatial Mapping.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                Launch Prototype
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl shadow-sm transition-all duration-200"
              >
                View Documentation
              </a>
            </div>

            {/* Key Metrics Strip */}
            <div className="mt-14 pt-8 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-xs uppercase tracking-wider font-semibold text-gray-500">Active Rig Focus</div>
                <div className="text-xl font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Duliajan Basin
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Upper Assam Shelf</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-xs uppercase tracking-wider font-semibold text-gray-500">Offset Coverage</div>
                <div className="text-xl font-bold text-gray-900 mt-1">15km Radius</div>
                <div className="text-xs text-gray-500 mt-0.5">MongoDB 2dsphere indexing</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-xs uppercase tracking-wider font-semibold text-gray-500">RAG Document Base</div>
                <div className="text-xl font-bold text-gray-900 mt-1">Completion Reports</div>
                <div className="text-xs text-gray-500 mt-0.5">PyMuPDF + ChromaDB</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-xs uppercase tracking-wider font-semibold text-gray-500">Risk Lookahead</div>
                <div className="text-xl font-bold text-blue-700 mt-1">&plusmn;50 Meters</div>
                <div className="text-xs text-gray-500 mt-0.5">Mud Loss / Stuck Pipe / Kicks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE PROBLEM & SOLUTION SECTION */}
      <section id="problem-solution" className="py-16 md:py-24 bg-slate-50/80 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">Operational Paradigm Shift</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              From Reactive Troubleshooting to Proactive AI Intelligence
            </p>
            <p className="mt-4 text-base text-gray-600">
              Comparing traditional manual offset well research against the automated WellSense AI approach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Problem Card */}
            <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500"></div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100 mb-4">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  The Problem
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Drilling teams waste hours manually digging through historical reports.
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-6">
                  When anomalies occur at the rig site, critical historical completion reports, daily drilling reports (DDRs),
                  and mud logs remain buried in non-digitized PDFs, disjointed folders, and legacy file shares.
                </p>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✕
                    </div>
                    <span className="text-sm text-gray-700">
                      <strong>Unproductive Time (NPT):</strong> Hours lost trying to verify if offset wells had lost circulation at current depth.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✕
                    </div>
                    <span className="text-sm text-gray-700">
                      <strong>Tribal Knowledge Drain:</strong> Critical well control experiences retire with senior engineers without digital preservation.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✕
                    </div>
                    <span className="text-sm text-gray-700">
                      <strong>Blind Formation Transitions:</strong> Approaching high-pressure zones without timely warning causes sudden kicks and blowouts.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-red-600 font-semibold flex items-center gap-1.5">
                <span>Result: Costly stuck pipe incidents, wellbore damage, and delayed drilling decisions.</span>
              </div>
            </div>

            {/* The Solution Card */}
            <div className="bg-white p-8 rounded-2xl border border-blue-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  The WellSense Solution
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Instantly access offset well knowledge via AI RAG &amp; Geospatial Mapping.
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-6">
                  WellSense AI connects directly to real-time eRTMAC sensor feeds, queries adjacent historical wells within
                  a 15km radius via MongoDB GeoJSON, and retrieves mitigation recipes in milliseconds.
                </p>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-sm text-gray-700">
                      <strong>Geospatial Radial Filter:</strong> MongoDB <code>$geoNear</code> identifies nearby historical wells within exact meters of the bit.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-sm text-gray-700">
                      <strong>Depth-Correlated RAG:</strong> Parses completion PDFs with PyMuPDF, chunks by depth/formation, and stores in ChromaDB.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-sm text-gray-700">
                      <strong>Proactive Risk Lookahead:</strong> Automatic alerts triggered whenever drill depth is within 50m of historical hazard zones.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-blue-700 font-semibold flex items-center gap-1.5">
                <span>Outcome: Accelerated decisions, zero non-productive time, and standardized well control safety.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE FEATURES GRID */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">Engineered for eRTMAC Centers</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Intelligent Core Capabilities
            </p>
            <p className="mt-4 text-base text-gray-600">
              Four specialized modules delivering end-to-end intelligence for drilling superintendents and monitoring engineers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Geospatial Mapping</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Visualize nearby historical wells within a custom radius of your active rig (e.g., Duliajan, Assam basin)
                  using GeoJSON Point coordinates and spherical indexing.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-blue-600 font-medium">
                MongoDB $geoNear • 2dsphere
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                  <FileSearch className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Knowledge Base</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  NLP &amp; OCR driven extraction from past Daily Drilling Reports (DDRs) and Well Completion Reports.
                  Vector search over chunked lithology notes and mud summaries.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-indigo-600 font-medium">
                PyMuPDF • LangChain • ChromaDB
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Predictive Risk Alerts</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Proactive warnings for mud loss, stuck pipe, and overpressure zones based on historical depth matching
                  within &plusmn;50 meters of the current bit position.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-amber-600 font-medium">
                FastAPI /predict-risk Engine
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
                  <Radio className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Seamless eRTMAC Sync</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Acts as a parallel intelligence layer to real-time data streams. Ingests current WITSML surface telemetry
                  without interfering with real-time operations.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-teal-600 font-medium">
                REST API • Parallel Sidecar Layer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE TELEMETRY & RISK SIMULATOR */}
      <section id="simulator" className="py-16 md:py-24 bg-slate-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-3">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              Live Interactive Prototype
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Test the Predictive Risk Lookahead Engine
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Simulate the active rig bit penetrating the Assam Basin lithology. Adjust the current depth and formation to
              watch the 50m offset hazard detector respond dynamically.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-blue-600" />
                      Current Drill Bit Depth
                    </label>
                    <span className="text-base font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                      {simDepth} meters
                    </span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="3800"
                    step="10"
                    value={simDepth}
                    onChange={(e) => setSimDepth(Number(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] text-gray-600 mt-1 font-mono">
                    <span>400m (Surface)</span>
                    <span className="text-amber-600 font-semibold">1240m (Mud Loss Zone)</span>
                    <span className="text-red-600 font-semibold">3140m (Stuck Pipe Zone)</span>
                    <span>3800m (TD)</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-900 block mb-2">Target Geological Formation</label>
                  <select
                    value={simFormation}
                    onChange={(e) => setSimFormation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 font-medium"
                  >
                    <option value="Alluvium">Alluvium (0m - 500m)</option>
                    <option value="Girujan Clay">Girujan Clay (500m - 1100m)</option>
                    <option value="Tipam Sandstone">Tipam Sandstone (1100m - 2400m) [High Permeability]</option>
                    <option value="Barail Coal Shale">Barail Coal Shale (2400m - 3400m) [Sticking Hazard]</option>
                    <option value="Kopili Formation">Kopili Formation (3400m - 3800m) [HPHT Overpressure]</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Geospatial Search Radius</label>
                    <span className="text-xs font-semibold text-gray-600">{simSearchRadius} km</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={simSearchRadius}
                    onChange={(e) => setSimSearchRadius(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-gray-500 mb-2">Quick Test Scenarios:</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSimDepth(1230);
                        setSimFormation('Tipam Sandstone');
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 rounded-md border border-red-200 transition-colors"
                    >
                      Trigger Mud Loss (1230m)
                    </button>
                    <button
                      onClick={() => {
                        setSimDepth(3135);
                        setSimFormation('Barail Coal Shale');
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md border border-amber-200 transition-colors"
                    >
                      Trigger Stuck Pipe (3135m)
                    </button>
                    <button
                      onClick={() => {
                        setSimDepth(750);
                        setSimFormation('Girujan Clay');
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                    >
                      Safe Depth (750m)
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Output Card Column */}
              <div className="lg:col-span-7">
                <div className={`p-6 rounded-xl border ${currentRisk.cardBg} transition-all duration-300`}>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200/60">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-200/80">
                        {currentRisk.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Real-Time Lookahead Evaluation
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {currentRisk.level === 'Safe' ? 'Wellbore Stability Verified' : 'Hazard Lookahead Alert'}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold uppercase rounded-full border shadow-sm ${currentRisk.badgeColor}`}
                    >
                      {currentRisk.level} Risk
                    </span>
                  </div>

                  <div className="mt-4 space-y-3.5">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 mb-1">Alert Message</div>
                      <p className="text-sm font-medium text-gray-900 leading-snug">{currentRisk.alert}</p>
                    </div>

                    <div className="bg-white/80 p-3.5 rounded-lg border border-gray-200/70">
                      <div className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        AI Synthesized Historical Mitigation Recipe:
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed font-mono">{currentRisk.advice}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200/40">
                      <span>Correlated Offset: <strong>{currentRisk.offsetWell}</strong></span>
                      <span>Detection Latency: <strong>38 ms</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SYSTEM ARCHITECTURE PIPELINE */}
      <section id="architecture" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">Modular Enterprise Architecture</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              End-to-End Intelligence Pipeline
            </p>
            <p className="mt-4 text-base text-gray-600">
              Decoupled microservice architecture designed for high availability and low-latency rig telemetry integration.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 rounded-xl border border-gray-200 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">LAYER 01</div>
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600" />
                Active Rig Ingestion
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ingests WITSML and surface drilling streams (current depth, ROP, bit location, active formation) from eRTMAC monitoring servers.
              </p>
              <div className="mt-4 text-[11px] font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
                W-001 • Lat 27.3653, Lon 95.3197
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-gray-200 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">LAYER 02</div>
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                Node.js Geospatial Engine
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                MongoDB <code>2dsphere</code> index evaluates a <code>$geoNear</code> aggregation pipeline to pinpoint historical wells within 15 km in &lt;10ms.
              </p>
              <div className="mt-4 text-[11px] font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
                /api/wells/nearby?radius=15000
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-gray-200 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">LAYER 03</div>
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                FastAPI RAG Microservice
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                PyMuPDF extracts lithology notes and mud summaries. LangChain and sentence-transformers embed text into local persistent ChromaDB collections.
              </p>
              <div className="mt-4 text-[11px] font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
                ChromaDB • all-MiniLM-L6-v2
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-gray-200 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">LAYER 04</div>
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                Predictive Risk Dispatcher
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Evaluates bit depth against 50m historical anomaly zones. Dispatches synthesized engineering alerts and mitigation recipes directly to rig crews.
              </p>
              <div className="mt-4 text-[11px] font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
                POST /predict-risk • 50m Horizon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TECH STACK SECTION */}
      <section id="tech-stack" className="py-16 bg-slate-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">Robust Technical Foundation</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Built with Enterprise-Grade Open Source Tools
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {[
              { name: 'React.js', role: 'Interactive Dashboard' },
              { name: 'Node.js & Express', role: 'Geospatial API Service' },
              { name: 'Python (FastAPI)', role: 'RAG & Analytics Microservice' },
              { name: 'MongoDB (GeoJSON)', role: '2dsphere Spherical Queries' },
              { name: 'ChromaDB', role: 'Local Vector Knowledge Store' },
              { name: 'LangChain', role: 'Document Pipeline & Chunking' },
              { name: 'Sentence-Transformers', role: 'Dense Neural Embeddings' },
              { name: 'PyMuPDF (fitz)', role: 'High-Speed PDF Parsing' },
              { name: 'React-Leaflet', role: 'Basin Interactive Map' },
              { name: 'Tailwind CSS', role: 'Enterprise UI System' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2 hover:border-blue-400 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-sm font-bold text-gray-900">{tech.name}</span>
                <span className="text-xs text-gray-500 border-l border-gray-200 pl-2">{tech.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-8 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              W
            </div>
            <span className="font-semibold text-gray-900">
              Built for SIH 2026 - Problem Statement 26121 (Oil India Limited)
            </span>
          </div>

          <div className="text-center sm:text-right font-medium text-gray-700">
            Designed &amp; Developed by <span className="text-blue-700 font-bold">Sahil Basu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
