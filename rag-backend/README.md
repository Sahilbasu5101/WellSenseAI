# WellSense AI - Drilling RAG Microservice

FastAPI backend microservice for Retrieval-Augmented Generation (RAG) specialized in **historical drilling events, well control incidents, and telemetry analysis**.

## 🛠️ Tech Stack

- **FastAPI**: High-performance asynchronous web API framework with interactive OpenAPI documentation.
- **LangChain**: Document processing pipelines and text splitting with `RecursiveCharacterTextSplitter`.
- **PyMuPDF (`fitz`)**: Fast PDF document parsing and page-by-page text extraction.
- **ChromaDB (`langchain-chroma`)**: Persistent local vector database for document embeddings and similarity search.
- **sentence-transformers (`all-MiniLM-L6-v2`)**: Pretrained local neural embeddings model (384-dimensional dense vectors).
- **CORS Middleware**: Preconfigured for React frontends (`http://localhost:3000`, `http://localhost:5173`, etc.).

---

## 📁 Project Architecture

```
WellSense_AI/
│
├── app/
│   ├── __init__.py
│   ├── config.py           # Application settings & environment variables
│   ├── schemas.py          # Pydantic data models for request & response validation
│   ├── rag_service.py      # Core RAG pipeline (PyMuPDF parser, chunking, ChromaDB, query retrieval & synthesis)
│   └── main.py             # FastAPI app with CORS middleware and routes
│
├── sample_docs/            # Generated sample historical drilling incident PDFs
│   ├── deepwater_horizon_incident.pdf
│   ├── montara_wellhead_blowout.pdf
│   └── north_sea_hpht_lost_circulation.pdf
│
├── chroma_db/              # Persistent Chroma vector store files
├── create_sample_pdfs.py   # Script to generate sample drilling incident PDFs
├── test_rag.py             # End-to-end automated test suite
├── run_server.py           # Quick launcher for Uvicorn server
├── requirements.txt        # Python dependency manifest
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Generate Sample Drilling Event PDFs (Optional)
To create 3 sample drilling incident reports in `sample_docs/`:
```bash
python create_sample_pdfs.py
```

### 3. Run the Microservice
Start the FastAPI server via Uvicorn:
```bash
python run_server.py
# Or directly:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Once running:
- **API Base URL**: `http://localhost:8000`
- **Interactive Swagger UI**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 📡 API Endpoints

### 1. `POST /upload-docs`
Ingests a directory of PDF files, parses text using `PyMuPDF` (`fitz`), chunks content using `RecursiveCharacterTextSplitter`, computes embeddings with `sentence-transformers`, and saves them to local `ChromaDB`.

#### Request:
```bash
curl -X POST "http://localhost:8000/upload-docs" \
  -H "Content-Type: application/json" \
  -d '{
    "directory_path": "./sample_docs"
  }'
```

#### Response (`200 OK`):
```json
{
  "status": "success",
  "message": "Successfully indexed 3 PDF file(s) into 6 chunks stored in ChromaDB.",
  "directory": "./sample_docs",
  "total_files_processed": 3,
  "total_chunks_stored": 6,
  "indexed_files": [
    {
      "file_name": "deepwater_horizon_incident.pdf",
      "file_path": "C:\\...\\sample_docs\\deepwater_horizon_incident.pdf",
      "pages": 1,
      "chunks": 2
    },
    {
      "file_name": "montara_wellhead_blowout.pdf",
      "file_path": "C:\\...\\sample_docs\\montara_wellhead_blowout.pdf",
      "pages": 1,
      "chunks": 2
    },
    {
      "file_name": "north_sea_hpht_lost_circulation.pdf",
      "file_path": "C:\\...\\sample_docs\\north_sea_hpht_lost_circulation.pdf",
      "pages": 1,
      "chunks": 2
    }
  ]
}
```

---

### 2. `POST /query-knowledge`
Searches ChromaDB for the **top 3 most relevant chunks** using vector similarity and synthesizes a structured engineering report on historical drilling events.

#### Request:
```bash
curl -X POST "http://localhost:8000/query-knowledge" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What caused the blowout preventer failure during the deepwater drilling operation?"
  }'
```

#### Response (`200 OK`):
```json
{
  "query": "What caused the blowout preventer failure during the deepwater drilling operation?",
  "model_used": "Mock Drilling Event Synthesizer (Domain-Aware LLM)",
  "answer": "### Historical Drilling Operations & Incident Analysis\n\n**Inquiry:** *\"What caused the blowout preventer failure...\"*",
  "retrieved_chunks": [
    {
      "chunk_index": 1,
      "text": "Incident Investigation: Deepwater Horizon Macondo Well Blowout (2010)...",
      "source": "deepwater_horizon_incident.pdf",
      "page": 1,
      "similarity_score": 0.6806,
      "metadata": {
        "source": "deepwater_horizon_incident.pdf",
        "page": 1,
        "chunk_index": 0
      }
    },
    {
      "chunk_index": 2,
      "text": "while zero pressure was measured on the kill line. Rig personnel misinterpreted this differential pressure...",
      "source": "deepwater_horizon_incident.pdf",
      "page": 1,
      "similarity_score": 0.7178,
      "metadata": {
        "source": "deepwater_horizon_incident.pdf",
        "page": 1,
        "chunk_index": 1
      }
    },
    {
      "chunk_index": 3,
      "text": "Field Case Study: North Sea HPHT Lost Circulation and Induced Kick (2015)...",
      "source": "north_sea_hpht_lost_circulation.pdf",
      "page": 1,
      "similarity_score": 1.0082,
      "metadata": {
        "source": "north_sea_hpht_lost_circulation.pdf",
        "page": 1,
        "chunk_index": 0
      }
    }
  ]
}
```

---

### 3. `POST /predict-risk` (Predictive Analytics)
Evaluates real-time drilling telemetry (`current_depth`, `formation`, and `nearby_wells_data`). Detects whether the current drill bit depth is within **50 meters** of any historical risks (such as mud losses, stuck pipe events, or gas kicks) found in nearby historical offset wells.

#### Request:
```bash
curl -X POST "http://localhost:8000/predict-risk" \
  -H "Content-Type: application/json" \
  -d '{
    "current_depth": 1220.0,
    "formation": "Tipam Sandstone",
    "nearby_wells_data": [
      {
        "well_id": "W-002",
        "name": "DLJN-HST-002",
        "distance": 3200.0,
        "incidents": [
          {
            "depth": 1240.0,
            "type": "Severe Mud Loss",
            "formation": "Tipam Sandstone",
            "description": "Sudden pit drop of 120 bbl in permeable fractured sandstone.",
            "mitigation": "Pumped 60 bbl LCM pill with mica and walnut shells under hesitation squeeze."
          }
        ]
      }
    ]
  }'
```

#### Response (`200 OK` - High Risk Example):
```json
{
  "risk_level": "High",
  "alert_message": "CRITICAL DRILLING ALERT [HIGH RISK]: Current depth 1220.0m is within 20.0m of a historical Severe Mud Loss incident recorded at 1240.0m in offset well DLJN-HST-002.",
  "historical_context": "### Offset Historical Well Hazard Analysis\n\n- **Target Formation:** Tipam Sandstone\n- **Closest Incident:** Severe Mud Loss at 1240.0m in `DLJN-HST-002` (Offset delta: 20.0m)\n- **Geological / Mechanical Context:** Sudden pit drop of 120 bbl in permeable fractured sandstone.\n- **Recommended Mitigation Protocol:** Pumped 60 bbl LCM pill with mica and walnut shells under hesitation squeeze.\n\n**Total Correlated Offset Risks:** 1 historical event(s) detected in the vicinity.",
  "correlated_incidents": [
    {
      "well_id": "W-002",
      "well_name": "DLJN-HST-002",
      "risk_depth": 1240.0,
      "risk_type": "Severe Mud Loss",
      "depth_delta_meters": 20.0
    }
  ]
}
```

#### Safe Response (No risks within 50m):
```json
{
  "risk_level": "Safe",
  "alert_message": "Safe: Current depth 500.0m is clear of all known historical drilling hazards within 50m.",
  "historical_context": "No critical operational anomalies (mud losses, stuck pipe, kicks) were recorded within a ±50m depth window...",
  "correlated_incidents": []
}
```

---

### 4. Auxiliary Endpoints

- `GET /health`: Check service health (`{"status": "healthy"}`).
- `GET /stats`: Retrieve vector database statistics (total indexed chunks, collection name, embedding model).
- `DELETE /clear`: Purge and reset the ChromaDB collection.

---

## ⚛️ React Frontend Integration Example

```javascript
// Example React component function calling the RAG microservice
async function askDrillingAssistant(userQuery) {
  try {
    const response = await fetch("http://localhost:8000/query-knowledge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: userQuery }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    console.log("Synthesized Answer:", data.answer);
    console.log("Top 3 Sources:", data.retrieved_chunks);
    return data;
  } catch (error) {
    console.error("Failed to query knowledge base:", error);
  }
}
```

---

## 🧪 Running Automated Tests

Run the included test script to verify end-to-end functionality, CORS headers, ingestion, and vector retrieval:
```bash
python test_rag.py
```
