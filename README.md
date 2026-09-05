# Rune — Instrument-Grade Agile Drafting

Turn a **rough idea → structured plan**. Paste an app description, pick **Scrum** or **Kanban**, and Rune drafts epics, user stories and a working board you can edit, reorder, export and refine conversationally.

![Rune](client/public/runnie_logo.png)

### Live
- **Marketing + App:** single Vite SPA at `/` (landing) → `/new` (spec intake) → `/board` → `/my-plans`
- **Design System v2:** flat, instrument-panel — `--canvas #0D1A24` / `--surface #14262F` / `--paper #E8E3D4`, chamfered `14px` top-right (`clip-path`), hairline `var(--grid-line) #2A4655`, registration corner marks, no radius/gradient/shadow. Full tokens: `docs/design-tokens.md`.

### Features (Current — Stages 0–7)
- **Intake:** free-text description + Scrabble tile counter, **MethodologyToggle** rocker (Scrum default, Kanban with WIP limits), **CustomizePanel** (Scrum-only collapsed): sprint count 2–6, length 1/2 weeks, MVP/Full build, velocity, starting columns — all fed to the prompt.
- **Generation:** `POST /api/generate` → Gemini `3.6-flash` (`google-genai`) with methodology-branched prompts; `parse_plan_response` strips fences + regex fallback + Pydantic validation.
- **Board (shared components):**
  - `GroupColumn` + `StoryCard` shared for Scrum (large `01/02` Space Grotesk numerals, goal, `done/total` pts) and Kanban (column name + `WIP n` coral warning, drag accent)
  - **Columns draggable:** `⋮⋮` handle on each header → `REORDER_GROUPS` (horizontal sortable, Scrum renumbers)
  - **Stories draggable:** `⠿` handle, `DragOverlay` preview, `useDroppable column-{i}` drop zones (`DROP HERE` amber), cross-column moves via `MOVE_STORY`
  - **Edit:** `✎` toggles inline title + criteria (one per line), `→ DONE` moves to Done column, `○/✓` toggle done (dims + strikethrough), `×` delete, points cycle `1·2·3·5·8·—` via square stamp
  - **Expand:** prominent `⛶ → −` (`amōber 26px`) expands inline inside the column (shows all criteria + `+N more` hint when collapsed)
  - **Add Story:** `+ ADD STORY` form — title*, criteria textarea, epic picker, priority, points — creates `US-1xx`
  - **Add/Rename/Delete Group:** `＋ ADD SPRINT/COLUMN` trailing tile, double-click name to rename (`RENAME_GROUP`), `×` to delete (`DELETE_GROUP`, confirms, keeps ≥1)
- **Refine:** **top** of board now — `REFINE — CONVERSATIONAL ITERATION` paper panel with use-case caption (`'make sprint 2 focus on onboarding'` etc.) + sticky `Refine this plan…` input + `Undo` (one-step `previousPlan` snapshot)
- **TimelineStrip** (Scrum only): sprint → week ranges; **EpicLegend** with risk + definition-of-done expand
- **Persistence:** IndexedDB via `idb` (`lib/db.ts` `sprint-draft` store) — `usePlansRepository.list/load/save/remove`, auto-save on refine, toast on failure. `/my-plans` list (chamfered paper cards) reopens via `load-plan` window event.
- **Export:** `Copy as Markdown` (Sprint/Column headings + criteria bullets) and `Export CSV` (Jira-friendly `Summary/Description/Story Points/Priority/Epic Link`, `Sprint` vs `Column` header)
- **Landing:** `/` = SaaS marketing page reusing v2 tokens — Nav (logo 64px `runnie_logo.png`, How it works / Methodologies / Capabilities / Start drafting), hero (centered `clamp 3.2–5.6rem` headline, only visible on first viewport `68vh` → next scroll reveals video), loop media via `RuneVideo` / `RuneImage` (`rune_vid.mp4` 46MB lazy, `rune_img.jpg` static, both `RuneVideo.tsx` / `RuneImage.tsx` chamfered), How it works (01-03), Methodologies (Scrum/Kanban abstract diagrams), Capabilities spec-sheet, closing CTA, footer — all `useReveal()` scroll fade, `html {scroll-behavior:smooth}`.
- **Shell:** `App.tsx` rail `64px` (`Home/New/Plans/Board` with `runnie_logo 36px` `RU` fallback) + topbar (`Rune` wordmark, plan name, methodology chip, date) + `RegistrationFrame` corner brackets + graph-paper `28px` grid.
- **Quality:** `prefers-reduced-motion`, responsive horizontal scroll, debounced saves, try/catch on all IDB calls.

### Stack

**Frontend:** React 18 + TypeScript + Vite 6, React Router `/`, `/new`, `/board`, `/my-plans`, Context + `useReducer` (`planReducer` — `LOAD_PLAN/SET_PLAN/ADD_STORY/DELETE_STORY/EDIT_STORY/MOVE_STORY/TOGGLE_DONE/ADD_GROUP/DELETE_GROUP/RENAME_GROUP/REORDER_GROUPS/UNDO`), `@dnd-kit/core` + `@dnd-kit/sortable`, `idb` 8, `google-genai` client via backend.

**Backend:** FastAPI (Python 3.11+) — `GET /health`, `POST /api/generate` (`GenerateRequest` → `GenerationConfig` → `GeminiClient.generate_plan` on `gemini-3.6-flash`) + `POST /api/refine` (`RefineRequest`), `schemas/plan.py` (`Plan/Group/Story/Epic` mirrors `types/plan.ts`), `services/gemini_client.py` (lazy `Client(api_key=GOOGLE_API_KEY)`, `models.generate_content`), `services/parse_plan_response.py` (defensive), `services/generate_prompt.py` / `refine_prompt.py`, `config.py` (`GOOGLE_API_KEY`, `ALLOWED_ORIGIN` via `pydantic-settings`, env_file `server/.env` or project `.env`), CORS locked to `ALLOWED_ORIGIN`.

**Fonts:** Space Grotesk 500/600 (headings, large numerals), IBM Plex Sans 400/500 (body), IBM Plex Mono 400/500 (IDs/points/WIP/timestamps) — self-hosted in `client/public/fonts` + Google Fonts preconnect fallback.

### Project Structure
```
rune/
├── client/
│   ├── src/
│   │   ├── pages/          LandingPage.tsx (SaaS) / IntakePage.tsx (spec) / BoardPage.tsx (dnd) / MyPlansPage.tsx
│   │   ├── components/board  GroupColumn.tsx (droppable+sotable column) / StoryCard.tsx (expand ✎, points, ○, drag) / EpicLegend.tsx / TimelineStrip.tsx / RefineBar.tsx
│   │   ├── components/shared Logo.tsx (runnie_logo.png) / ChamferPanel.tsx / RegistrationFrame.tsx / Button.tsx / RuneImage.tsx / RuneVideo.tsx
│   │   ├── components/intake IntakeSheet.tsx (SPEC 00) / MethodologyToggle.tsx / CustomizePanel.tsx
│   │   ├── context/PlanContext.tsx / reducers/planReducer.ts (12 actions) / hooks/useGeneratePlan|useRefinePlan|usePlansRepository.ts
│   │   ├── lib/db.ts / export/toMarkdown.ts|toCsv.ts
│   │   ├── types/plan.ts     // keep in sync with server/app/schemas/plan.py
│   │   ├── design/runnie_logo.png + rune_vid.mp4 + rune_img.jpg
│   │   └── styles/tokens.css + globals.css
│   ├── public/fonts/ + public/runnie_logo.png + rune_img.jpg
│   └── index.html
├── server/
│   ├── app/main.py + config.py + routers/generate.py|refine.py + schemas/plan.py + services/gemini_client.py|generate_prompt.py|refine_prompt.py|parse_plan_response.py
│   ├── tests/  test_generate.py (3) / test_refine.py (1) / test_parse_plan_response.py (5)
│   └── .env.example
├── docs/design-tokens.md + review-checklists/ + sprint-draft-master-prompt.md + agent-guidelines.md
├── scripts/guard_secrets.py | block_direct_api_calls.py | check_schema_sync.py
└── .pre-commit-config.yaml + .github/workflows/ci.yml
```

### Quick Start

**Backend** (needs `GOOGLE_API_KEY` from https://aistudio.google.com/app/apikey — `AIza...`, not `AQ.`):
```bash
cd server
cp .env.example .env  # set GOOGLE_API_KEY=AIza... and ALLOWED_ORIGIN=http://localhost:5173
pip install -r requirements.txt
# from project root (so server/.env is found) — not from inside server/
python -m uvicorn server.app.main:app --reload
# → http://127.0.0.1:8000 , GET /health
```

**Frontend:**
```bash
cd client
cp .env.example .env  # VITE_API_BASE_URL=http://localhost:8000
npm install
npm run dev
# → http://localhost:5173
```

**Env examples:**
```env
# server/.env
GOOGLE_API_KEY=AIza...
ALLOWED_ORIGIN=http://localhost:5173

# client/.env
VITE_API_BASE_URL=http://localhost:8000
```

### Scripts
```bash
cd client && npm run test        # vitest 9 tests (reducer, Button, toMarkdown)
cd client && npm run build       # tsc + vite (assets: rune_img, runnie_logo)
cd server && python -m pytest tests/ -v  # 9 tests
pre-commit run --all-files       # guard secrets + block api.anthropic.com in client/ + schema-sync
```

### Roadmap — Next
- **Collaboration & Real-time** (picked): Supabase Realtime + presence cursors / comments + `@mentions` + share link + optimistic `planReducer` sync (see docs/plans/ — plan drafted, not yet built — tell me anonymous vs auth).
- **Polish:** virtualized columns (100+ stories), `n`-deep undo/history, `Cmd+K` search, bulk move, PDF export.

### License
Private — instrument-grade agile drafting for Rune.
