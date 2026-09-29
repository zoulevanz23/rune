import React from 'react'
import { Button, Dialog, Kbd } from '@/components/primitives'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SHORTCUTS: { category: string; shortcuts: { key: string; description: string }[] }[] = [
  {
    category: 'Navigation',
    shortcuts: [
      { key: 'Cmd/Ctrl + K', description: 'Open the command palette' },
      { key: '/', description: 'Focus the board filter' },
      { key: '?', description: 'Show this help' },
      { key: 'Escape', description: 'Clear filter or selection, close dialogs' },
    ],
  },
  {
    category: 'Plan actions',
    shortcuts: [
      { key: 'Cmd/Ctrl + Z', description: 'Undo' },
      { key: 'Cmd/Ctrl + Shift + Z', description: 'Redo' },
      { key: 'Cmd/Ctrl + S', description: 'Save plan' },
      { key: 'Cmd/Ctrl + M', description: 'Copy Markdown' },
      { key: 'Cmd/Ctrl + E', description: 'Export CSV' },
      { key: 'Cmd/Ctrl + P', description: 'Export PDF' },
      { key: 'Cmd/Ctrl + R', description: 'Focus the refine input' },
    ],
  },
  {
    category: 'Stories',
    shortcuts: [
      { key: 'Double-click title', description: 'Edit title and criteria in place' },
      { key: 'Maximize button', description: 'Open the story details panel' },
      { key: 'Points button', description: 'Cycle story points (1, 2, 3, 5, 8)' },
      { key: 'Checkbox', description: 'Select a story for bulk actions' },
    ],
  },
  {
    category: 'Bulk actions',
    shortcuts: [
      { key: 'Selection bar', description: 'Mark done, move between groups, delete, clear' },
      { key: 'Filters', description: 'Dim non-matching stories on the board, hide them in the table' },
    ],
  },
  {
    category: 'Drag and drop',
    shortcuts: [
      { key: 'Drag handle', description: 'Reorder columns or sprints' },
      { key: 'Drag a card', description: 'Move a story, including across columns' },
      { key: 'Space', description: 'Pick up the focused item' },
      { key: 'Arrow keys', description: 'Move the dragged item' },
      { key: 'Escape', description: 'Cancel the drag' },
    ],
  },
]

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => (
  <Dialog isOpen={isOpen} onClose={onClose} title="Keyboard shortcuts" size="lg" footer={<Button variant="secondary" onClick={onClose}>Close</Button>}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
      {SHORTCUTS.map(cat => (
        <section key={cat.category}>
          <h3
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 8,
            }}
          >
            {cat.category}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 12px', alignItems: 'center' }}>
            {cat.shortcuts.map(s => (
              <React.Fragment key={s.key}>
                {s.key.length <= 12 ? (
                  <Kbd>{s.key}</Kbd>
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{s.key}</span>
                )}
                <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>{s.description}</span>
              </React.Fragment>
            ))}
          </div>
        </section>
      ))}
    </div>
  </Dialog>
)
