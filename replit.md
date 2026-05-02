# Nutrition RAG App

A FastAPI-based Retrieval-Augmented Generation (RAG) application for managing and querying nutrition information.

## Architecture

- **Backend**: FastAPI (Python 3.12) running on port 5000
- **Database**: PostgreSQL (Replit built-in) with pgvector extension for vector similarity search
- **LLM Providers**: Cohere (default) or OpenAI for embeddings and text generation
- **Vector DB**: PGVector (PostgreSQL extension) or Qdrant
- **File Processing**: Supports `.txt` and `.pdf` files (uses PyMuPDF for PDFs)

## Project Structure

```
src/
├── main.py                    # FastAPI app entry point
├── .env                       # Environment variables (see .env.example)
├── requirements.txt           # Python dependencies
├── routes/                    # API route handlers
│   ├── base.py                # /api/v1/ health/info
│   ├── data.py                # /api/v1/data/ file upload & processing
│   └── nlp.py                 # /api/v1/nlp/ indexing, search, RAG answers
├── controllers/               # Business logic
│   ├── BaseController.py      # File path helpers
│   ├── DataController.py      # File validation
│   ├── ProjectController.py   # Project path management
│   ├── ProcessController.py   # File loading & chunking (native Python, no langchain)
│   └── NLPController.py       # Embedding, vector DB, RAG pipeline
├── models/                    # Data models
│   ├── db_schemas/            # SQLAlchemy ORM models (Project, Asset, DataChunk)
│   └── enums/                 # Enum definitions
├── stores/
│   ├── llm/                   # LLM providers (OpenAI, Cohere)
│   └── vectordb/              # Vector DB providers (PGVector, Qdrant)
├── helpers/config.py          # Pydantic settings (reads from .env)
└── utils/metrics.py           # Prometheus metrics middleware
```

## API Endpoints

- `GET /api/v1/` — App info
- `POST /api/v1/data/upload/{project_id}` — Upload a file
- `POST /api/v1/data/process/{project_id}` — Chunk the uploaded file
- `POST /api/v1/nlp/index/push/{project_id}` — Embed & index chunks into vector DB
- `GET /api/v1/nlp/index/info/{project_id}` — Get index info
- `POST /api/v1/nlp/index/search/{project_id}` — Semantic search
- `POST /api/v1/nlp/index/answer/{project_id}` — RAG-based Q&A

## Environment Variables

Key variables in `src/.env`:

| Variable | Description |
|---|---|
| `POSTGRES_*` | PostgreSQL connection details (auto-populated from Replit DB) |
| `COHERE_API_KEY` | Cohere API key (required for default LLM/embedding) |
| `OPENAI_API_KEY` | OpenAI API key (if using OpenAI backend) |
| `GENERATION_BACKEND` | `COHERE` or `OPENAI` |
| `EMBEDDING_BACKEND` | `COHERE` or `OPENAI` |
| `VECTOR_DB_BACKEND` | `PGVECTOR` or `QDRANT` |

## Setup Notes

- PostgreSQL is Replit's built-in DB (`heliumdb` on host `helium`)
- The `pgvector` extension is enabled automatically at app startup
- SQLAlchemy tables are created automatically on startup
- `ProcessController.py` uses native Python + PyMuPDF (no langchain dependency) to avoid pydantic v1/v2 compatibility issues with langsmith

## Running

```bash
cd src && uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

## API Keys Required

To use LLM features, add your API key:
- Cohere: Set `COHERE_API_KEY` in `src/.env`
- OpenAI: Set `OPENAI_API_KEY` in `src/.env`
