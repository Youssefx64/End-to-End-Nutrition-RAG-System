import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routes import base, data, nlp
from routes.auth import auth_router
from helpers.config import get_settings
from stores.llm.LLMProviderFactory import LLMProviderFactory
from stores.vectordb.VectorDBProviderFactory import VectorDBProviderFactory
from stores.llm.templates.TemplateParser import TemplateParser
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from utils.metrics import setup_metrics

FRONTEND_DIST = Path(__file__).parent.parent / "frontend" / "dist"

app = FastAPI(
    title="NutriAI API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS — reads comma-separated origins from ALLOWED_ORIGINS env; defaults to *
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "*")
_origins = [o.strip() for o in _raw_origins.split(",")] if _raw_origins.strip() != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_metrics(app)


@app.on_event("startup")
async def startup_span():
    settings = get_settings()

    postgres_conn = (
        f"postgresql+asyncpg://{settings.POSTGRES_USERNAME}:{settings.POSTGRES_PASSWORD}"
        f"@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_MAIN_DATABASE}"
    )
    app.db_engine = create_async_engine(postgres_conn)
    app.db_client = sessionmaker(
        app.db_engine, class_=AsyncSession, expire_on_commit=False
    )

    try:
        from models.db_schemas.nutrition_rag.schemas.nutrition_rag_base import SQLAlchemyBase
        from models.db_schemas.nutrition_rag.schemas import Project, Asset, DataChunk, User
        async with app.db_engine.begin() as conn:
            await conn.run_sync(SQLAlchemyBase.metadata.create_all)
    except Exception as e:
        print(f"[startup] Table creation warning: {e}")

    llm_provider_factory = LLMProviderFactory(settings)
    vectordb_provider_factory = VectorDBProviderFactory(config=settings, db_client=app.db_client)

    app.generation_client = llm_provider_factory.create(provider_name=settings.GENERATION_BACKEND)
    app.generation_client.set_generation_model(model_id=settings.GENERATION_MODEL_ID)

    app.embedding_client = llm_provider_factory.create(provider_name=settings.EMBEDDING_BACKEND)
    app.embedding_client.set_embedding_model(
        model_id=settings.EMBEDDING_MODEL_ID,
        embedding_size=settings.EMBEDDING_MODEL_SIZE,
    )

    app.vectordb_client = vectordb_provider_factory.create(provider_name=settings.VECTOR_DB_BACKEND)
    await app.vectordb_client.connect()

    app.template_parser = TemplateParser(
        language=settings.PRIMARY_LANG,
        default_language=settings.DEFAULT_LANG,
    )


@app.on_event("shutdown")
async def shutdown_span():
    await app.db_engine.dispose()
    await app.vectordb_client.disconnect()


# API routers — must be registered BEFORE the SPA catch-all
app.include_router(base.base_router)
app.include_router(data.data_router)
app.include_router(nlp.nlp_router)
app.include_router(auth_router)

# ── Production static file serving ───────────────────────────────────────────
# When the React build exists (npm run build was run), FastAPI serves it directly.
# This enables a single-process production deployment.
if FRONTEND_DIST.is_dir():
    _assets_dir = FRONTEND_DIST / "assets"
    if _assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=str(_assets_dir)), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        """Catch-all: return index.html so React Router handles navigation."""
        return FileResponse(str(FRONTEND_DIST / "index.html"))
