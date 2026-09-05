# Design Compliance Checklist

Verify before considering any UI change done.

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
