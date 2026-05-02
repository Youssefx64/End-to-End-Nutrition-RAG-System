# NutriAI — Full-Stack AI Nutrition Platform

A production-ready full-stack AI SaaS built on FastAPI (RAG backend) + React/Vite (frontend).

## Architecture

- **Production**: FastAPI serves the built React app — **single port 5000**, one process
- **Development**: Two processes — Vite dev server (port 5000) + FastAPI (port 8000)
- **Database**: PostgreSQL (Replit built-in) with pgvector for vector similarity search
- **LLM Providers**: Cohere (default) or OpenAI
- **Auth**: JWT (`python-jose`) + bcrypt, tokens in `localStorage`

## Workflows

| Workflow | Command | Port | Purpose |
|---|---|---|---|
| **Start application** | `cd frontend && npm run build && cd ../src && uvicorn main:app --host 0.0.0.0 --port 5000` | 5000 | **Production** — builds React then serves via FastAPI |
| Backend API | `cd src && uvicorn main:app --host 0.0.0.0 --port 8000 --reload` | 8000 | Development API with hot-reload |

## Running Locally

### Option A — Production mode (single port)
```bash
bash start.sh
# App + API on http://localhost:5000
```

### Option B — Development mode (two ports, hot-reload)
```bash
bash dev.sh
# Frontend → http://localhost:5000  (Vite dev server with HMR)
# Backend  → http://localhost:8000  (uvicorn --reload)
```

### Manual setup
```bash
# 1. Copy and fill in environment variables
cp src/.env.example src/.env
# Edit src/.env — set POSTGRES_*, COHERE_API_KEY, JWT_SECRET_KEY

# 2. Install Python deps
pip install -r src/requirements.txt

# 3. Install Node deps
cd frontend && npm install

# 4. Build frontend
npm run build

# 5. Start server
cd ../src && uvicorn main:app --host 0.0.0.0 --port 5000
```

## Project Structure

```
start.sh                           # Production startup script
dev.sh                             # Development startup script (two servers)
.gitignore

frontend/                          # React + Vite SaaS UI
├── src/
│   ├── App.jsx                    # Router + auth guards
│   ├── index.css                  # Tailwind base + component classes
│   ├── context/AuthContext.jsx    # JWT auth state (login/register/logout)
│   ├── services/api.js            # Axios client with auth interceptor
│   ├── components/Layout.jsx      # Sidebar + responsive shell
│   └── pages/
│       ├── Landing.jsx            # Public marketing page
│       ├── Login.jsx / Register.jsx
│       ├── Dashboard.jsx          # Knowledge base stats + quick actions
│       ├── Chat.jsx               # RAG-powered AI chat
│       ├── Documents.jsx          # Upload + process + index documents
│       └── Profile.jsx            # Account management
├── dist/                          # Production build output (served by FastAPI)
├── vite.config.js                 # Proxy /api/* → :8000 (dev only), build config
└── package.json

src/                               # FastAPI backend
├── main.py                        # App, CORS, startup, routers, static file serving
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Template — copy to .env
├── requirements.txt               # Python dependencies
├── routes/
│   ├── auth.py                    # JWT auth: /register /login /me
│   ├── base.py                    # GET /api/v1/
│   ├── data.py                    # File upload & chunking
│   └── nlp.py                     # Indexing, search, RAG answers
├── models/db_schemas/.../schemas/
│   ├── user.py                    # User model (auto-created at startup)
│   ├── project.py / asset.py / data_chunk.py
├── controllers/                   # Core RAG logic (untouched)
└── helpers/config.py              # Pydantic settings (JWT_SECRET_KEY, ALLOWED_ORIGINS added)
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` — Create account, returns JWT
- `POST /api/v1/auth/login`    — Sign in, returns JWT
- `GET  /api/v1/auth/me`       — Current user (Bearer token required)
- `PUT  /api/v1/auth/me`       — Update profile (Bearer token required)

### RAG Core (unchanged)
- `GET  /api/v1/`                           — App info / health
- `POST /api/v1/data/upload/{project_id}`   — Upload file
- `POST /api/v1/data/process/{project_id}`  — Chunk file
- `POST /api/v1/nlp/index/push/{project_id}`— Embed & index
- `GET  /api/v1/nlp/index/info/{project_id}`— Index info
- `POST /api/v1/nlp/index/search/{project_id}` — Semantic search
- `POST /api/v1/nlp/index/answer/{project_id}` — RAG Q&A

### Docs
- `GET /api/docs`      — Swagger UI
- `GET /api/redoc`     — ReDoc

## Environment Variables (src/.env)

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_*` | Yes | PostgreSQL connection (auto-set by Replit) |
| `COHERE_API_KEY` | Yes* | Cohere API key (*or OpenAI) |
| `JWT_SECRET_KEY` | Yes | Random secret for JWT signing |
| `ALLOWED_ORIGINS` | No | CORS origins, comma-separated or `*` |
| `GENERATION_BACKEND` | No | `COHERE` or `OPENAI` (default: COHERE) |
| `VECTOR_DB_BACKEND` | No | `PGVECTOR` or `QDRANT` (default: PGVECTOR) |

Generate a strong JWT secret:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## Production Checklist

- [ ] Set `JWT_SECRET_KEY` to a strong random value in `src/.env`
- [ ] Set `ALLOWED_ORIGINS` to your actual domain (not `*`)
- [ ] Set your `COHERE_API_KEY` or `OPENAI_API_KEY`
- [ ] Ensure `src/.env` is NOT committed (it's in `.gitignore`)

## Tech Stack

**Backend**: FastAPI 0.110, uvicorn, SQLAlchemy 2 (async), asyncpg, pgvector, python-jose, bcrypt, langchain 0.1, Cohere/OpenAI

**Frontend**: React 18, Vite 5, React Router 6, Tailwind CSS 3, Framer Motion, Lucide React, Axios, React Hot Toast, React Dropzone, React Markdown
