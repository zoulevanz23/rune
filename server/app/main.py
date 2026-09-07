from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import generate, refine
from app.config import settings

app = FastAPI(title="Rune API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGIN, "http://localhost:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api")
app.include_router(refine.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
