import asyncio
from app.config import settings

# Transient API errors worth retrying (demand spikes / rate limits).
_RETRYABLE_CODES = {429, 503}
_MAX_ATTEMPTS = 3
# Short backoffs — the old (8, 20)s waits were a big chunk of perceived latency.
_BACKOFF_SECONDS = (2, 4)


def _build_config():
    """Force structured JSON output with a tight token budget for speed."""
    from google.genai import types

    kwargs: dict = dict(
        response_mime_type="application/json",
        max_output_tokens=settings.GEMINI_MAX_OUTPUT_TOKENS,
        temperature=0.4,
        # Disable automatic function calling: we do plain JSON generation,
        # and this silences the SDK's "use Chat.send_message" warning.
        automatic_function_calling={"disable": True},
    )
    # Skip reasoning traces on thinking-capable models — much faster
    # time-to-first-token for a pure JSON task. Ignored by models that
    # don't support it.
    try:
        kwargs["thinking_config"] = types.ThinkingConfig(thinking_budget=0)
    except Exception:
        pass
    return types.GenerateContentConfig(**kwargs)


class GeminiClient:
    def __init__(self):
        key = settings.GOOGLE_API_KEY or ""
        self.model_name = settings.GEMINI_MODEL
        self.timeout = settings.GENERATION_TIMEOUT_SECONDS
        if key:
            from google.genai import Client
            self._client = Client(api_key=key)
        else:
            self._client = None

    async def _generate(self, prompt: str) -> str:
        if not self._client:
            raise ValueError("GOOGLE_API_KEY is missing. Set it in server/.env")

        config = _build_config()
        # Use the Chat API (send_message) per the SDK recommendation instead of
        # calling Models.generate_content directly — this removes the AFC warning.
        chat = self._client.aio.chats.create(model=self.model_name, config=config)

        for attempt in range(_MAX_ATTEMPTS):
            try:
                response = await asyncio.wait_for(
                    chat.send_message(prompt),
                    timeout=self.timeout,
                )
            except asyncio.TimeoutError:
                raise TimeoutError(
                    f"Model request timed out after {self.timeout}s. "
                    "Try a shorter description or fewer sprints."
                )
            except Exception as exc:
                if getattr(exc, "code", None) in _RETRYABLE_CODES and attempt + 1 < _MAX_ATTEMPTS:
                    await asyncio.sleep(_BACKOFF_SECONDS[attempt])
                    continue
                raise

            # Surface blocked/empty responses instead of silently returning "None".
            text = getattr(response, "text", None)
            if text:
                return text
            feedback = getattr(response, "prompt_feedback", None)
            reason = getattr(feedback, "block_reason", None) if feedback else None
            raise ValueError(
                f"Model returned an empty response (block_reason={reason}). "
                "The output was likely cut short or filtered."
            )
        raise RuntimeError("unreachable")

    async def generate_plan(self, prompt: str) -> str:
        return await self._generate(prompt)

    async def refine_plan(self, prompt: str) -> str:
        return await self._generate(prompt)
