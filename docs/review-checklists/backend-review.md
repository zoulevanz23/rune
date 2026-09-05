# Backend Review Checklist

- [ ] Pydantic schemas match TypeScript types exactly
- [ ] No hardcoded ANTHROPIC_API_KEY in client code
- [ ] CORS restricted to allowed origins, not wildcarded
- [ ] Defensive JSON parsing in parse_plan_response.py (strip fences, regex fallback)
- [ ] Pydantic validation before responding
- [ ] Retry Claude call once if validation fails
- [ ] `claude-sonnet-4-6` with `max_tokens=1000`
- [ ] All handlers are async def (I/O-bound)
- [ ] pydantic-settings reads from environment variables
- [ ] pytest tests pass
