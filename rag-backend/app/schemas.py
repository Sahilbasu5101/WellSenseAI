from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class UploadDocsRequest(BaseModel):
    directory_path: str = Field(
        ...,
        description="Absolute or relative path to the directory containing PDF documents",
        examples=["./sample_docs", "C:/path/to/drilling_pdfs"]
    )

class IndexedFileSummary(BaseModel):
    file_name: str
    file_path: str
    pages: int
    chunks: int

class UploadDocsResponse(BaseModel):
    status: str
    message: str
    directory: str
    total_files_processed: int
    total_chunks_stored: int
    indexed_files: List[IndexedFileSummary]

class QueryRequest(BaseModel):
    query: str = Field(
        ...,
        description="Query string about historical drilling events, well operations, or incidents",
        examples=["What caused the blowout preventer failure during the deepwater drilling operation?"]
    )

class RetrievedChunk(BaseModel):
    chunk_index: int
    text: str
    source: str
    page: Optional[int] = None
    similarity_score: Optional[float] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class QueryResponse(BaseModel):
    query: str
    answer: str
    model_used: str
    retrieved_chunks: List[RetrievedChunk]

class StatsResponse(BaseModel):
    collection_name: str
    total_vector_count: int
    persist_directory: str
    embedding_model: str
    llm_mode: str

class PredictRiskRequest(BaseModel):
    current_depth: float = Field(
        ...,
        description="Current drill bit depth in meters",
        examples=[1245.0]
    )
    formation: str = Field(
        ...,
        description="Current geological formation name",
        examples=["Tipam Sandstone"]
    )
    nearby_wells_data: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="List of nearby historical well documents, including their formations and incident logs"
    )

class PredictRiskResponse(BaseModel):
    risk_level: str = Field(
        ...,
        description="Assessed risk level: 'High', 'Medium', 'Low', or 'Safe'",
        examples=["High"]
    )
    alert_message: str = Field(
        ...,
        description="Actionable warning alert or safety confirmation message"
    )
    historical_context: str = Field(
        ...,
        description="Detailed historical context and mitigation insights based on offset well events"
    )
    correlated_incidents: Optional[List[Dict[str, Any]]] = Field(
        default_factory=list,
        description="Historical risk incidents detected within proximity"
    )
