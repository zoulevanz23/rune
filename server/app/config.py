import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env next to this file's parent (server/.env) regardless of cwd
_env_path = Path(__file__).resolve().parents[2] / ".env"
# fallback to server/.env if running from project root
_alt_path = Path(__file__).resolve().parent.parent / ".env"

class Settings(BaseSettings):
    GOOGLE_API_KEY: str = ""
    ALLOWED_ORIGIN: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=[str(_env_path), str(_alt_path), ".env"],
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
# Also ensure os.environ has the key for legacy code
if settings.GOOGLE_API_KEY and not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = settings.GOOGLE_API_KEY
