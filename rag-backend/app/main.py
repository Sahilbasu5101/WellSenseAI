import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import (
    UploadDocsRequest,
    UploadDocsResponse,
    QueryRequest,
    QueryResponse,
    StatsResponse,
    PredictRiskRequest,
    PredictRiskResponse
)
from app.rag_service import rag_service
from app.risk_service import risk_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("rag_api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Using Embedding Model: {settings.EMBEDDING_MODEL_NAME}")
    logger.info(f"ChromaDB Persistence: {settings.CHROMA_PERSIST_DIR}")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="FastAPI Backend for Retrieval-Augmented Generation (RAG) Microservice specializing in historical drilling events.",
    lifespan=lifespan
)

# CORS middleware for React / frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint verifying API status."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.get("/stats", response_model=StatsResponse, tags=["RAG Operations"])
async def get_stats():
    """Returns statistics regarding indexed documents and vector counts."""
    return rag_service.get_stats()

@app.post(
    "/upload-docs",
    response_model=UploadDocsResponse,
    status_code=status.HTTP_200_OK,
    tags=["RAG Operations"],
    summary="Ingest PDF documents from directory"
)
async def upload_docs(payload: UploadDocsRequest):
    """
    Ingests a directory containing PDF files:
    1. Discovers all `.pdf` files in the specified directory.
    2. Parses text page-by-page using PyMuPDF (fitz).
    3. Chunks the text with RecursiveCharacterTextSplitter.
    4. Computes sentence-transformer embeddings and persists to ChromaDB.
    """
    directory_path = payload.directory_path.strip()
    logger.info(f"Received request to index directory: {directory_path}")

    try:
        total_files, total_chunks, summaries = rag_service.ingest_directory(directory_path)
    except FileNotFoundError as fnf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"The provided directory path does not exist: {str(fnf)}"
        )
    except Exception as e:
        logger.exception("Error occurred during document ingestion")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to ingest documents: {str(e)}"
        )

    if total_files == 0:
        return UploadDocsResponse(
            status="warning",
            message=f"No PDF files found in directory: '{directory_path}'. Please check directory path and file extensions.",
            directory=directory_path,
            total_files_processed=0,
            total_chunks_stored=0,
            indexed_files=[]
        )

    return UploadDocsResponse(
        status="success",
        message=f"Successfully indexed {total_files} PDF file(s) into {total_chunks} chunks stored in ChromaDB.",
        directory=directory_path,
        total_files_processed=total_files,
        total_chunks_stored=total_chunks,
        indexed_files=summaries
    )

@app.post(
    "/query-knowledge",
    response_model=QueryResponse,
    status_code=status.HTTP_200_OK,
    tags=["RAG Operations"],
    summary="Query historical drilling events knowledge"
)
async def query_knowledge(payload: QueryRequest):
    """
    Accepts a query payload `{"query": "string"}`:
    1. Searches ChromaDB for the top 3 most relevant chunks based on embedding similarity.
    2. Synthesizes a detailed technical response focused on historical drilling events.
    3. Returns the answer along with metadata and source citations.
    """
    query_text = payload.query.strip()
    if not query_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The 'query' string cannot be empty."
        )

    logger.info(f"Processing query: '{query_text}'")
    try:
        answer, retrieved_chunks, model_used = rag_service.query(query_text, top_k=settings.TOP_K_RESULTS)
        return QueryResponse(
            query=query_text,
            answer=answer,
            model_used=model_used,
            retrieved_chunks=retrieved_chunks
        )
    except Exception as e:
        logger.exception("Error processing knowledge query")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to query knowledge base: {str(e)}"
        )

@app.post(
    "/predict-risk",
    response_model=PredictRiskResponse,
    status_code=status.HTTP_200_OK,
    tags=["Predictive Analytics"],
    summary="Predict drilling risks using offset well history"
)
async def predict_risk(payload: PredictRiskRequest):
    """
    Checks if `current_depth` is within 50 meters of any historical risks
    (such as severe mud losses, stuck pipe events, or gas kicks) found in `nearby_wells_data`.
    
    Returns:
    - `risk_level`: 'High', 'Medium', 'Low', or 'Safe'
    - `alert_message`: Actionable warning or safe status
    - `historical_context`: Geological context, offset incident details, and mitigations
    """
    logger.info(
        f"Evaluating predictive risk at depth={payload.current_depth}m, "
        f"formation='{payload.formation}' with {len(payload.nearby_wells_data)} offset wells."
    )
    try:
        result = risk_service.evaluate_risk(
            current_depth=payload.current_depth,
            formation=payload.formation,
            nearby_wells_data=payload.nearby_wells_data,
            threshold_meters=50.0
        )
        return PredictRiskResponse(**result)
    except Exception as e:
        logger.exception("Error evaluating predictive risk")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to evaluate predictive risk: {str(e)}"
        )

@app.delete("/clear", tags=["Maintenance"])
async def clear_database():
    """Resets and purges the ChromaDB collection."""
    success = rag_service.clear_database()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clear ChromaDB collection."
        )
    return {"status": "success", "message": "ChromaDB collection cleared successfully."}
