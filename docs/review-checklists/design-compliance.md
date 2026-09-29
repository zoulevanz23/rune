# Design Compliance Checklist — SUPERSEDED

> **The checklist below matched the retired "instrument-panel" theme. It is kept for history only.**

Current rules (Modern Corporate):

- [ ] Colors come from `client/src/styles/tokens.css` and `scripts/check-contrast.mjs` passes
- [ ] Inter only (self-hosted 400/500/600/700); IDs in Inter 600, no mono
- [ ] Radii limited to 6/8/10/12/999px; spacing on the 4/8/12/16/24/32/48 scale
- [ ] No gradients, glow, glassmorphism, neon, or purple-AI look
- [ ] No colored side rails / accent lines on cards; epics identified by text tag + ID, not color alone
- [ ] No chamfers, registration marks, decorative glyphs, unicode glyph icons, or emoji
- [ ] Sentence case everywhere; uppercase only for 11px group labels
- [ ] `prefers-reduced-motion` disables transitions
- [ ] axe reports 0 violations; Lighthouse ≥ 95 on all categories

---

Original checklist (retired):

- [ ] Colors used are from the tokens in `client/src/styles/tokens.css` or `docs/design-tokens.md`
- [ ] Font usage matches the type tokens (Space Grotesk for headings, IBM Plex Sans for body, IBM Plex Mono for technical labels)
- [ ] Story cards use flat paper rectangles with colored left border — no rounded corners or drop shadows
- [ ] No cream/terracotta palette introduced
- [ ] No all-caps eyebrow labels
- [ ] No em-dash "WORD — fragment" headers
- [ ] Layout is left-aligned throughout
- [ ] Only one deliberate moment of motion (loading spinner)
- [ ] Buttons use `primary` for main action and `ghost` for secondary
- [ ] No arrow glyphs on button text
- [ ] `prefers-reduced-motion` is respected
