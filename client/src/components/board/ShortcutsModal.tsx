import React, { useEffect } from 'react'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SHORTCUTS = [
  { category: 'Navigation', shortcuts: [
    { key: '?', description: 'Show this help' },
    { key: 'Cmd/Ctrl + K', description: 'Focus board search' },
    { key: '/', description: 'Focus board search' },
    { key: 'Escape', description: 'Clear search / selection / close modal' },
    { key: '← / →', description: 'Scroll between sprints/columns' },
  ]},
  { category: 'Story Actions', shortcuts: [
    { key: 'Click ✓', description: 'Select story for bulk (left checkbox)' },
    { key: 'E', description: 'Expand/collapse story (on focused card)' },
    { key: 'D / ○', description: 'Toggle done (on focused card)' },
    { key: 'P', description: 'Cycle points (on focused card)' },
    { key: '✎ / Double-click', description: 'Edit story title + criteria' },
    { key: '×', description: 'Delete story' },
  ]},
  { category: 'Board Actions', shortcuts: [
    { key: 'Cmd/Ctrl + Z', description: 'Undo (30-deep history)' },
    { key: 'Cmd/Ctrl + Shift + Z / Cmd+Y', description: 'Redo' },
    { key: 'Cmd/Ctrl + S', description: 'Save plan' },
    { key: 'Cmd/Ctrl + M', description: 'Copy Markdown' },
    { key: 'Cmd/Ctrl + E', description: 'Export CSV' },
    { key: 'Cmd/Ctrl + P', description: 'Export PDF' },
    { key: 'Cmd/Ctrl + R', description: 'Focus refine input' },
  ]},
  { category: 'Bulk (when selecting)', shortcuts: [
    { key: 'Selected bar', description: '✓ Done / ○ Undone, Move to column, Delete, Clear' },
    { key: 'Search filter', description: 'Dims non-matching stories (title, ID, epic, priority)' },
  ]},
  { category: 'Drag & Drop', shortcuts: [
    { key: '⋮⋮ handle', description: 'Drag to reorder column/sprint' },
    { key: '⠿ handle', description: 'Drag story (including cross-column)' },
    { key: 'Space', description: 'Pick up focused story/column' },
    { key: 'Escape', description: 'Cancel drag / close modals' },
    { key: 'Arrow keys', description: 'Move dragged item' },
  ]},
  { category: 'Editing', shortcuts: [
    { key: 'Tab', description: 'Next field in story form' },
    { key: 'Shift + Tab', description: 'Previous field' },
    { key: 'Ctrl + Enter', description: 'Submit form' },
    { key: 'Escape', description: 'Cancel form / exit edit mode' },
  ]},
]

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(13, 26, 36, 0.85)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--grid-line)',
          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
          maxWidth: 560,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.2rem', borderBottom: '1px solid var(--grid-line)',
          background: 'var(--surface-alt)'
        }}>
          <h2 id="shortcuts-title" style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
            fontSize: '1.1rem', color: 'var(--bright)'
          }}>KEYBOARD SHORTCUTS</h2>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--grid-line)', color: 'var(--fog)',
            cursor: 'pointer', padding: '0.3rem 0.6rem',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem',
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)'
          }}>CLOSE</button>
        </div>

        <div style={{ padding: '1.2rem' }}>
          {SHORTCUTS.map((cat, catIdx) => (
            <div key={cat.category} style={{ marginBottom: catIdx === SHORTCUTS.length - 1 ? 0 : '1.5rem' }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem',
                letterSpacing: '0.08em', color: 'var(--amber)', marginBottom: '0.6rem',
                textTransform: 'uppercase'
              }}>{cat.category}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.4rem 1rem' }}>
                {cat.shortcuts.map((s, i) => (
                  <React.Fragment key={i}>
                    <kbd style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem',
                      background: 'var(--canvas)', border: '1px solid var(--grid-line)',
                      padding: '0.15rem 0.4rem', clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)',
                      color: 'var(--bright)', whiteSpace: 'nowrap'
                    }}>{s.key}</kbd>
                    <span style={{
                      fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.78rem',
                      color: 'var(--fog)', lineHeight: 1.5
                    }}>{s.description}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}