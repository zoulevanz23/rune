import asyncio
from app.config import settings


class GeminiClient:
    def __init__(self):
        key = settings.GOOGLE_API_KEY or ""
        if key:
            from google.genai import Client
            self._client = Client(api_key=key)
            self.model_name = "gemini-3.6-flash"
        else:
            self._client = None
            self.model_name = "gemini-3.6-flash"

    async def generate_plan(self, prompt: str, model: str = "gemini-3.6-flash", max_tokens: int = 1000) -> str:
        if not self._client:
            raise ValueError("GOOGLE_API_KEY is missing. Set it in server/.env")
        response = await asyncio.to_thread(
            self._client.models.generate_content,
            model=self.model_name,
            contents=prompt,
        )
        return getattr(response, "text", str(response))

    async def refine_plan(self, prompt: str, model: str = "gemini-3.6-flash", max_tokens: int = 1000) -> str:
        if not self._client:
            raise ValueError("GOOGLE_API_KEY is missing. Set it in server/.env")
        response = await asyncio.to_thread(
            self._client.models.generate_content,
            model=self.model_name,
            contents=prompt,
        )
        return getattr(response, "text", str(response))
