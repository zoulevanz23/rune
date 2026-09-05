# Sprint Draft — Product/Architecture Spec

See the full build prompt pasted at the top of AGENTS.md for the complete spec. This document is a summary pointer.

## Summary

Sprint Draft is a web app that turns a plain-English app description into a full agile delivery plan. Users paste a rough idea, pick a methodology (Scrum or Kanban), and Claude analyzes it to generate epics, user stories, and a board.

**Stack**: React 18 + TypeScript (Vite) → FastAPI (Python) → Anthropic API

**Key features by stage**:
- Stage 0: Methodology toggle (Scrum/Kanban)
- Stage 1: Editable board with drag-and-drop
- Stage 2: Export to Markdown and CSV
- Stage 3: Plan configuration (Scrum-specific customization)
- Stage 4: Richer plan content (risks, dependencies, DoD)
- Stage 5: Save/load plans in IndexedDB
- Stage 6: Conversational refinement with undo
- Stage 7: Progress tracking (optional)

**Full spec**: See the master build prompt at the top of this file.
