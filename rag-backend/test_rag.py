import os
import json
from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    client = TestClient(app)
    print("=" * 70)
    print("RUNNING END-TO-END TESTS FOR WELLSENSE RAG MICROSERVICE")
    print("=" * 70)

    # 1. Health check
    print("\n[1] Testing GET /health...")
    resp = client.get("/health")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    print(f"-> Status 200 OK: {resp.json()}")

    # 2. CORS Headers Check
    print("\n[2] Testing CORS Headers on GET / ...")
    resp = client.get("/", headers={"Origin": "http://localhost:3000"})
    assert resp.status_code == 200
    assert "access-control-allow-origin" in resp.headers, "CORS header missing!"
    print(f"-> CORS Header present: access-control-allow-origin: {resp.headers.get('access-control-allow-origin')}")

    # 3. Test /upload-docs with sample_docs directory
    print("\n[3] Testing POST /upload-docs with sample_docs/ ...")
    sample_dir = os.path.abspath("./sample_docs")
    resp = client.post("/upload-docs", json={"directory_path": sample_dir})
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    print(f"-> Ingestion status: {data['status']}")
    print(f"-> Message: {data['message']}")
    print(f"-> Processed files: {data['total_files_processed']}, Chunks stored: {data['total_chunks_stored']}")
    for f in data["indexed_files"]:
        print(f"   * {f['file_name']}: {f['pages']} page(s), {f['chunks']} chunk(s)")

    # 4. Check Stats
    print("\n[4] Testing GET /stats ...")
    resp = client.get("/stats")
    assert resp.status_code == 200
    stats = resp.json()
    print(f"-> Total vector count in ChromaDB: {stats['total_vector_count']}")
    assert stats["total_vector_count"] > 0, "Vector store should not be empty!"

    # 5. Query 1: Blowout Preventer
    print("\n[5] Testing POST /query-knowledge (Query 1: BOP Failure)...")
    q1 = "What caused the blowout preventer failure during the deepwater drilling operation?"
    resp = client.post("/query-knowledge", json={"query": q1})
    assert resp.status_code == 200, f"Query failed: {resp.text}"
    res1 = resp.json()
    print(f"-> Query: {res1['query']}")
    print(f"-> Model Used: {res1['model_used']}")
    print(f"-> Top Chunks Retrieved: {len(res1['retrieved_chunks'])}")
    for c in res1["retrieved_chunks"]:
        print(f"   [Chunk #{c['chunk_index']} | Source: {c['source']} (Page {c['page']}) | Distance/Score: {c['similarity_score']}]")
        print(f"   Snippet: {c['text'][:120]}...\n")
    print(f"-> Synthesized Answer:\n{res1['answer']}\n")

    # 6. Query 2: Lost Circulation & Kick
    print("\n[6] Testing POST /query-knowledge (Query 2: Lost Circulation & Kick)...")
    q2 = "What happened during the North Sea lost circulation and kick event?"
    resp = client.post("/query-knowledge", json={"query": q2})
    assert resp.status_code == 200
    res2 = resp.json()
    print(f"-> Top source: {res2['retrieved_chunks'][0]['source']}")
    print(f"-> Answer snippet: {res2['answer'][:200]}...")

    # 7. Error handling: Non-existent directory
    print("\n[7] Testing error handling for non-existent directory...")
    resp = client.post("/upload-docs", json={"directory_path": "./non_existent_folder_xyz"})
    assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
    print(f"-> Correctly returned 404: {resp.json()['detail']}")

    # 8. Error handling: Empty query
    print("\n[8] Testing error handling for empty query...")
    resp = client.post("/query-knowledge", json={"query": "   "})
    assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
    print(f"-> Correctly returned 400: {resp.json()['detail']}")

    # 9. Test /predict-risk: High Risk (within 20m of mud loss)
    print("\n[9] Testing POST /predict-risk (High Risk Scenario: Mud Loss within 20m)...")
    payload_high = {
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
    }
    resp = client.post("/predict-risk", json=payload_high)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    risk_data = resp.json()
    print(f"-> Risk Level: {risk_data['risk_level']}")
    print(f"-> Alert Message: {risk_data['alert_message']}")
    print(f"-> Historical Context:\n{risk_data['historical_context']}\n")
    assert risk_data["risk_level"] in ["High", "Medium"], f"Expected High or Medium risk, got {risk_data['risk_level']}"
    assert len(risk_data["correlated_incidents"]) > 0

    # 10. Test /predict-risk: Safe Status (No risk within 50m)
    print("\n[10] Testing POST /predict-risk (Safe Scenario: Depth 500m, no risks nearby)...")
    payload_safe = {
        "current_depth": 500.0,
        "formation": "Alluvium",
        "nearby_wells_data": [
            {
                "well_id": "W-002",
                "name": "DLJN-HST-002",
                "distance": 3200.0,
                "incidents": [
                    {
                        "depth": 1240.0,
                        "type": "Severe Mud Loss",
                        "formation": "Tipam Sandstone"
                    }
                ]
            }
        ]
    }
    resp = client.post("/predict-risk", json=payload_safe)
    assert resp.status_code == 200
    safe_data = resp.json()
    print(f"-> Risk Level: {safe_data['risk_level']}")
    print(f"-> Alert Message: {safe_data['alert_message']}")
    assert safe_data["risk_level"] == "Safe", f"Expected 'Safe', got {safe_data['risk_level']}"
    assert len(safe_data["correlated_incidents"]) == 0

    print("\n" + "=" * 70)
    print("ALL TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
