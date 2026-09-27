# WellSense AI - React & Tailwind Landing Page

Modern, enterprise-grade landing page for **WellSense AI** (An AI-powered Nearby Wells Intelligence System for eRTMAC).

Built for **SIH 2026 - Problem Statement 26121 (Oil India Limited)**.

---

## 🎨 Design System

- **Theme**: Strictly **Light Theme** (Clean white `bg-white` and light slate `bg-slate-50`).
- **Corporate Accents**: Deep oilfield corporate blue (`#1d4ed8` / `text-blue-700`) with alert red (`#dc2626`) and warning amber (`#d97706`).
- **Typography**: Clean high-contrast typography (`text-gray-900` headings, `text-gray-600` paragraphs).
- **Icons**: Lucide React.
- **Responsiveness**: Fully responsive across mobile, tablet, and widescreen displays.

---

## 🚀 Key Sections

1. **Navbar**:
   - Clean white background with subtle border.
   - Text logo: **WellSense AI** (bold, blue) with telemetry icon.
   - Links: Home, Problem & Solution, Features, Interactive Demo, Architecture, Tech Stack.
   - Action: "Go to Dashboard" button.
2. **Hero Section**:
   - Headline: *"Empowering Drilling Decisions with AI & Institutional Memory."*
   - Subtitle: *"A Nearby Wells Intelligence System (NWIS) that seamlessly integrates with eRTMAC to proactively mitigate drilling risks using historical data, RAG, and Geospatial Mapping."*
   - Primary CTA: "Launch Prototype" + Secondary CTA: "View Documentation".
   - Key Metrics Strip: Duliajan Basin, 15 km Radius, Completion Reports, &plusmn;50m Lookahead.
3. **Problem & Solution**:
   - Side-by-side comparison between manual PDF digging (NPT, tribal knowledge loss) and WellSense AI automated offset RAG.
4. **Core Features Grid**:
   - Geospatial Mapping (MongoDB `$geoNear` 2dsphere)
   - AI-Powered Knowledge Base (PyMuPDF + LangChain + ChromaDB)
   - Predictive Risk Alerts (Depth matching within 50m)
   - Seamless eRTMAC Sync (Parallel telemetry sidecar)
5. **Interactive Telemetry & Risk Simulator**:
   - Real-time interactive depth slider (400m to 3800m), formation selector, and radius control.
   - Live visual lookahead card showing calculated risk (High, Medium, Safe) with AI-synthesized mitigation recipes and offset well distances.
6. **Architecture Pipeline**:
   - 4-layer technical breakdown (Rig Ingestion &rarr; Node.js Spatial Engine &rarr; FastAPI RAG &rarr; Risk Dispatcher).
7. **Tech Stack Grid**:
   - Minimal badges for React.js, Node.js, Python, MongoDB, ChromaDB, LangChain, Sentence-Transformers, PyMuPDF, React-Leaflet, and Tailwind CSS.
8. **Footer**:
   - "Built for SIH 2026 - Problem Statement 26121 (Oil India Limited)"
   - "Designed & Developed by Sahil Basu"

---

## 💻 Running the Landing Page

```bash
cd frontend
npm install
npm run dev
```

The application will run on **`http://localhost:3000`**.
