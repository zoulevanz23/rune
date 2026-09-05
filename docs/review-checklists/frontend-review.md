# Frontend Review Checklist

- [ ] Components use React Context + useReducer for state
- [ ] No direct Anthropic API calls in client code
- [ ] Drag-and-drop uses @dnd-kit/core
- [ ] IndexedDB operations wrapped in try/catch
- [ ] Auto-save is debounced (~800ms)
- [ ] Toast notifications for save failures
- [ ] Responsive design for mobile (horizontal scroll with affordance)
- [ ] All imports from @/ alias resolve correctly
- [ ] Vitest tests pass for reducer, export functions, and components
- [ ] Design tokens from client/src/styles/tokens.css match docs/design-tokens.md
