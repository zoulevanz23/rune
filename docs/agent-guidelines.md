# Agent Guidelines — Sprint Draft

Applies to any AI coding tool or human contributor working in this repo.

## Architecture (one-liner)
React SPA (client/) → POST /api/generate | /api/refine → FastAPI (server/) → Anthropic API.
Client never calls api.anthropic.com directly. Backend never stores plans (client-side IndexedDB only).
Full spec: docs/sprint-draft-master-prompt.md — read before starting any new stage.

## Non-negotiables
- The Plan/Group/Story/Epic shape is defined in exactly two places: client/src/types/plan.ts
  and server/app/schemas/plan.py. Changing one requires changing the other in the same commit.
  This is checked automatically by scripts/check_schema_sync.py at commit time and in CI.
- GroupColumn and StoryCard are shared components for Scrum + Kanban. Never fork them into
  per-methodology copies — branch on the `type` field instead.
- ANTHROPIC_API_KEY is read only in server/app/config.py. Any occurrence of "api.anthropic.com"
  under client/ will fail the pre-commit hook and CI — don't try to work around it, fix the
  architecture violation instead.
- Design tokens (color/type/layout) live in docs/design-tokens.md and client/src/styles/tokens.css.
  Check there before introducing any new color, font, or card style. See docs/review-checklists/design-compliance.md.

## Workflow
- For anything bigger than a one-file fix: plan first, and reference the specific Stage number
  from the master prompt (Stage 0–7).
- Land one stage at a time. Each stage should leave the app fully working before starting the next.
- Run the relevant checklist in docs/review-checklists/ before considering a stage done.

## Git / commits
- No AI attribution in commit messages.
- Never force-push. Never commit .env or anything matching *_KEY, *_SECRET — this is enforced
  by .pre-commit-config.yaml, not just requested here.
- Small, reviewable commits — one stage's worth of work per PR.

## Commands
- npm run dev (client/), uvicorn app.main:app --reload (server/)
- npm test / pytest before considering any stage done
- pre-commit run --all-files to check everything without committing
