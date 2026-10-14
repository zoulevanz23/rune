from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import generate, refine, share
from app.config import settings

app = FastAPI(title="Rune API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api")
app.include_router(refine.router, prefix="/api")
app.include_router(share.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/health")
def api_health():
    return {"status": "ok"}


@app.get("/v1/models")
def openai_models_stub():
    """Stub for OpenAI-compatible tooling (IDE extensions, gateways) that polls
    GET /v1/models on localhost:8000. Without this the server logs a 404 next
    to every /health check. We are not an OpenAI endpoint, so return an empty
    list instead of 404 noise."""
    return {"object": "list", "data": []}
