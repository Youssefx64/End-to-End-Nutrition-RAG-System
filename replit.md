# NutriAI — Full-Stack AI Nutrition Platform

A full-stack AI SaaS built on FastAPI (RAG backend) + React/Vite (frontend).

## Architecture

- **Frontend**: React 18 + Vite 5, runs on **port 5000** (webview)
- **Backend**: FastAPI (Python 3.12), runs on **port 8000** (console)
- **Proxy**: Vite proxies `/api/*` → `localhost:8000`
- **Database**: PostgreSQL (Replit built-in) with pgvector for vector similarity search
- **LLM Providers**: Cohere (default) or OpenAI for embeddings and generation
- **Vector DB**: PGVector (PostgreSQL extension) or Qdrant
- **Auth**: JWT (`python-jose`) + bcrypt password hashing, tokens in `localStorage`

## Workflows

| Workflow | Command | Port | Purpose |
|---|---|---|---|
| Start application | `cd frontend && npm run dev` | 5000 | React/Vite webview |
| Backend API | `cd src && uvicorn main:app --host 0.0.0.0 --port 8000 --reload` | 8000 | FastAPI console |

## Project Structure

```
frontend/                          # React + Vite SaaS UI
├── src/
│   ├── App.jsx                    # Router + auth guards
│   ├── index.css                  # Tailwind base + component classes
│   ├── context/AuthContext.jsx    # JWT auth state (login/register/logout)
│   ├── services/api.js            # Axios client with auth interceptor
│   ├── components/Layout.jsx      # Sidebar + responsive shell
│   └── pages/
│       ├── Landing.jsx            # Public marketing page
│       ├── Login.jsx              # Sign-in form
│       ├── Register.jsx           # Sign-up form
│       ├── Dashboard.jsx          # Knowledge base stats + quick actions
│       ├── Chat.jsx               # RAG-powered AI chat
│       ├── Documents.jsx          # Upload + process + index documents
│       └── Profile.jsx            # Account management
├── vite.config.js                 # Proxy /api/* → localhost:8000
├── tailwind.config.js             # Dark green theme (brand-600 = #16a34a)
└── package.json

src/                               # FastAPI backend (UNCHANGED CORE LOGIC)
├── main.py                        # FastAPI app, CORS, startup, routers
├── routes/
│   ├── auth.py                    # JWT auth: /register /login /me (NEW)
│   ├── base.py                    # GET /api/v1/
│   ├── data.py                    # File upload & chunking
│   └── nlp.py                     # Indexing, search, RAG answers
├── models/db_schemas/nutrition_rag/schemas/
│   ├── user.py                    # User SQLAlchemy model (NEW)
│   ├── project.py
│   ├── asset.py
│   └── data_chunk.py
├── controllers/                   # Core RAG logic (UNTOUCHED)
│   ├── ProcessController.py       # File loading & chunking (langchain)
│   └── NLPController.py           # Embedding, vector DB, RAG pipeline
└── helpers/config.py              # Pydantic settings
```

## API Endpoints

### Auth (new)
- `POST /api/v1/auth/register` — Create account, returns JWT
- `POST /api/v1/auth/login` — Sign in, returns JWT
- `GET  /api/v1/auth/me` — Get current user (requires Bearer token)
- `PUT  /api/v1/auth/me` — Update profile (requires Bearer token)

### RAG Core (unchanged)
- `GET  /api/v1/` — App info
- `POST /api/v1/data/upload/{project_id}` — Upload file
- `POST /api/v1/data/process/{project_id}` — Chunk uploaded file
- `POST /api/v1/nlp/index/push/{project_id}` — Embed & index chunks
- `GET  /api/v1/nlp/index/info/{project_id}` — Index info
- `POST /api/v1/nlp/index/search/{project_id}` — Semantic search
- `POST /api/v1/nlp/index/answer/{project_id}` — RAG Q&A

## Environment Variables

Key variables in `src/.env`:

| Variable | Description |
|---|---|
| `POSTGRES_*` | PostgreSQL connection (auto-populated from Replit DB) |
| `COHERE_API_KEY` | Cohere API key (required for default LLM/embedding) |
| `OPENAI_API_KEY` | OpenAI API key (if using OpenAI backend) |
| `GENERATION_BACKEND` | `COHERE` or `OPENAI` |
| `EMBEDDING_BACKEND` | `COHERE` or `OPENAI` |
| `VECTOR_DB_BACKEND` | `PGVECTOR` or `QDRANT` |
| `JWT_SECRET_KEY` | Secret for signing JWTs (defaults to dev key) |

## Frontend Tech Stack

- React 18 + React Router 6
- Vite 5 (dev server + proxy)
- Tailwind CSS 3 (dark surface theme, brand green `#16a34a`)
- Framer Motion (page transitions, animations)
- Lucide React (icons)
- Axios (HTTP client with JWT interceptor)
- React Hot Toast (notifications)
- React Dropzone (file upload)
- React Markdown (chat message rendering)

## Setup Notes

- PostgreSQL is Replit's built-in DB
- pgvector extension is enabled automatically at startup
- All SQLAlchemy tables (including `users`) are auto-created on startup
- `ProcessController.py` uses langchain 0.3.x (Python 3.12 compatible)
- bcrypt is used directly (not via passlib) for Python 3.12 compatibility
