<div align="center">

<br />

<img src="https://img.shields.io/badge/-NutriAI-000000?style=for-the-badge&logo=leaf&logoColor=22c55e" height="60" alt="NutriAI" />

# NutriAI

### AI-powered nutrition intelligence — grounded in your own documents

<p align="center">
  Upload nutrition PDFs → Process & embed → Ask questions → Get precise, evidence-based answers
</p>

<br />

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

<br />

![NutriAI Landing](https://img.shields.io/badge/Status-Production%20Ready-22c55e?style=flat-square)
![RAG](https://img.shields.io/badge/Architecture-RAG%20Pipeline-8b5cf6?style=flat-square)
![JWT](https://img.shields.io/badge/Auth-JWT-f59e0b?style=flat-square)
![Cohere](https://img.shields.io/badge/LLM-Cohere%20%7C%20OpenAI-ef4444?style=flat-square)

</div>

---

## Overview

**NutriAI** is a production-ready full-stack SaaS platform that brings AI-powered question answering to your private nutrition knowledge base. Built on Retrieval-Augmented Generation (RAG), every answer is grounded in documents you upload — not model hallucinations.

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Upload PDF  │───▶│ Chunk + Embed│───▶│ pgvector Index │───▶│  LLM Answer  │
│  or TXT file │    │  (Cohere /   │    │  Vector Search │    │ (RAG-grounded│
│              │    │   OpenAI)    │    │  Similarity    │    │   response)  │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
```

---

## Features

- **RAG Pipeline** — Upload → Chunk → Embed → Index → Retrieve → Generate
- **Semantic Search** — Vector similarity search via pgvector or Qdrant
- **Multi-LLM Support** — Cohere (`command-a-03-2025`) or OpenAI, switchable via env
- **JWT Authentication** — Secure register/login with 7-day tokens
- **Premium UI** — Dark-mode SaaS interface built with Framer Motion animations
- **Single-port Production** — FastAPI serves the compiled React build on one port
- **Private Knowledge Base** — Per-user, per-project document isolation
- **Real-time Processing Feedback** — Step-by-step upload → chunk → index progress UI
- **Swagger & ReDoc** — Auto-generated API documentation at `/api/docs`
- **Metrics** — Prometheus metrics via `starlette-exporter`

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | FastAPI 0.110 + Uvicorn |
| ORM | SQLAlchemy 2.0 (async) + asyncpg |
| Vector DB | pgvector (PostgreSQL) · Qdrant |
| LLM / Embeddings | Cohere 5.6 · OpenAI 2.2 |
| RAG | LangChain 0.1 |
| Auth | python-jose (JWT) · bcrypt 4.1 |
| PDF Parsing | PyMuPDF 1.24 |
| Monitoring | Prometheus · starlette-exporter |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router 6 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion 11 |
| Icons | Lucide React |
| HTTP | Axios |
| Markdown | react-markdown |
| File Upload | react-dropzone |
| Notifications | react-hot-toast |

---

## Project Structure

```
nutriai/
├── src/                          # FastAPI backend
│   ├── main.py                   # App factory, CORS, routers, static serving
│   ├── .env.example              # Environment variable template
│   ├── requirements.txt
│   ├── routes/
│   │   ├── auth.py               # POST /register, /login  GET|PUT /me
│   │   ├── data.py               # POST /upload, /process
│   │   ├── nlp.py                # POST /index/push, /answer  GET /index/info
│   │   └── schema/               # Pydantic request/response models
│   ├── controllers/
│   │   ├── DataController.py     # File validation & path management
│   │   ├── NLPController.py      # RAG orchestration
│   │   └── ProcessController.py  # Chunking logic (do not modify)
│   ├── models/
│   │   ├── db_schemas/           # SQLAlchemy ORM models
│   │   │   └── user.py           # User model (auto-created on startup)
│   │   └── ProjectModel.py       # Project creation and retrieval
│   └── helpers/
│       └── config.py             # Pydantic Settings (env vars)
│
├── frontend/                     # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx               # Router + auth guards
│   │   ├── index.css             # Tailwind + design system tokens
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # JWT state management
│   │   ├── services/
│   │   │   └── api.js            # Axios client + interceptors
│   │   ├── components/
│   │   │   └── Layout.jsx        # Sidebar shell + route transitions
│   │   └── pages/
│   │       ├── Landing.jsx       # Public marketing page
│   │       ├── Login.jsx         # Split-screen auth
│   │       ├── Register.jsx      # Split-screen auth
│   │       ├── Dashboard.jsx     # Stats + quick actions
│   │       ├── Chat.jsx          # RAG chat interface
│   │       ├── Documents.jsx     # Upload + process + index
│   │       └── Profile.jsx       # Account management
│   └── dist/                     # Production build (served by FastAPI)
│
├── start.sh                      # Production startup script
├── dev.sh                        # Development startup (two servers)
├── .gitignore
└── README.MD
```

---

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL with pgvector extension
- Cohere API key **or** OpenAI API key

### 1 — Clone & install

```bash
git clone https://github.com/Youssefx64/End-to-End-Nutrition-RAG-System.git
cd End-to-End-Nutrition-RAG-System

# Python dependencies
pip install -r src/requirements.txt

# Node dependencies
cd frontend && npm install && cd ..
```

### 2 — Configure environment

```bash
cp src/.env.example src/.env
```

Open `src/.env` and fill in:

```env
# Required
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_MAIN_DATABASE=nutriai

# Generate a strong secret:  python3 -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET_KEY=your_random_secret_here

# Pick one LLM provider
COHERE_API_KEY=your_cohere_key_here
# OPENAI_API_KEY=your_openai_key_here
# GENERATION_BACKEND=OPENAI
```

### 3 — Run

**Production mode** (single port 5000 — builds React then serves via FastAPI):
```bash
bash start.sh
# → http://localhost:5000
```

**Development mode** (hot-reload on both frontend and backend):
```bash
bash dev.sh
# Frontend → http://localhost:5000  (Vite HMR)
# Backend  → http://localhost:8000  (uvicorn --reload)
```

---

## API Reference

Base URL: `http://localhost:5000/api/v1`

Interactive docs: [`/api/docs`](http://localhost:5000/api/docs) (Swagger UI) · [`/api/redoc`](http://localhost:5000/api/redoc)

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Create account → returns JWT | — |
| `POST` | `/auth/login` | Sign in → returns JWT | — |
| `GET` | `/auth/me` | Get current user | Bearer |
| `PUT` | `/auth/me` | Update profile | Bearer |

### Data Pipeline

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/data/upload/{project_id}` | Upload PDF or TXT file | Bearer |
| `POST` | `/data/process/{project_id}` | Chunk file into DataChunks | Bearer |

**Process request body:**
```json
{
  "file_id": "abc123.pdf",
  "chunk_size": 512,
  "overlap_size": 50,
  "do_reset": 0
}
```

### NLP / RAG

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/nlp/index/push/{project_id}` | Embed chunks → push to vector DB | Bearer |
| `GET` | `/nlp/index/info/{project_id}` | Vector DB collection stats | Bearer |
| `POST` | `/nlp/index/search/{project_id}` | Semantic similarity search | Bearer |
| `POST` | `/nlp/index/answer/{project_id}` | RAG question answering | Bearer |

**Answer request body:**
```json
{
  "text": "What are the best plant-based protein sources?",
  "limit": 5
}
```

**Answer response:**
```json
{
  "signal": "rag_answer_success",
  "answer": "Based on your documents, the top complete plant proteins are...",
  "full_prompt": "...",
  "chat_history": []
}
```

---

## RAG Architecture

```
User Question
      │
      ▼
┌─────────────────────────────────────────────────────┐
│                   NLPController                      │
│                                                     │
│  1. Embed question  ──▶  Cohere/OpenAI Embeddings   │
│                                                     │
│  2. Vector search   ──▶  pgvector / Qdrant          │
│                          (cosine similarity, top-K) │
│                                                     │
│  3. Build prompt    ──▶  Retrieved chunks           │
│                          + question template        │
│                                                     │
│  4. Generate        ──▶  Cohere command-a-03-2025   │
│                          or OpenAI GPT              │
└─────────────────────────────────────────────────────┘
      │
      ▼
  Grounded Answer
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `JWT_SECRET_KEY` | ✅ | — | Random secret for JWT signing |
| `ALLOWED_ORIGINS` | — | `*` | CORS origins (comma-separated) |
| `POSTGRES_USERNAME` | ✅ | — | PostgreSQL username |
| `POSTGRES_PASSWORD` | ✅ | — | PostgreSQL password |
| `POSTGRES_HOST` | ✅ | `localhost` | PostgreSQL host |
| `POSTGRES_PORT` | ✅ | `5432` | PostgreSQL port |
| `POSTGRES_MAIN_DATABASE` | ✅ | — | Database name |
| `GENERATION_BACKEND` | — | `COHERE` | `COHERE` or `OPENAI` |
| `EMBEDDING_BACKEND` | — | `COHERE` | `COHERE` or `OPENAI` |
| `COHERE_API_KEY` | ✅* | — | Cohere API key |
| `OPENAI_API_KEY` | ✅* | — | OpenAI API key |
| `GENERATION_MODEL_ID` | — | `command-a-03-2025` | LLM model identifier |
| `EMBEDDING_MODEL_ID` | — | `embed-multilingual-v3.0` | Embedding model |
| `VECTOR_DB_BACKEND` | — | `PGVECTOR` | `PGVECTOR` or `QDRANT` |
| `FILE_MAX_SIZE` | — | `10` | Max upload size in MB |

*One of `COHERE_API_KEY` or `OPENAI_API_KEY` is required.

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — features, how it works, CTA |
| `/register` | Create account |
| `/login` | Sign in |
| `/dashboard` | Knowledge base stats, quick actions, getting started |
| `/chat` | AI chat — RAG-powered Q&A against your documents |
| `/documents` | Upload, process, and index documents |
| `/profile` | Edit profile, security info |

---

## Production Checklist

Before deploying:

- [ ] Set `JWT_SECRET_KEY` to a cryptographically strong random value
- [ ] Set `ALLOWED_ORIGINS` to your actual domain (not `*`)
- [ ] Set your `COHERE_API_KEY` or `OPENAI_API_KEY`
- [ ] Ensure `src/.env` is **not** committed (protected by `.gitignore`)
- [ ] Configure PostgreSQL with the pgvector extension enabled

Generate a strong secret key:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Enable pgvector in PostgreSQL:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes, following existing code patterns
# 4. Test your changes
bash dev.sh

# 5. Commit with a clear message
git commit -m "feat: add your feature description"

# 6. Push and open a Pull Request
git push origin feature/your-feature-name
```

**Important:** Do not modify `src/controllers/ProcessController.py` — this file is part of the core RAG pipeline and is intentionally preserved as-is.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with FastAPI · React · pgvector · Cohere

<br />

**[Live Demo](#)** · **[Report Bug](../../issues)** · **[Request Feature](../../issues)**

</div>
