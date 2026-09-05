import React from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export const MethodologyToggle: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div style={{
      display: 'inline-flex',
      border: '1px solid var(--grid-line)',
      background: 'var(--surface)',
      padding: 2,
      gap: 2,
    }}>
      {(['scrum', 'kanban'] as const).map(opt => {
        const active = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              minWidth: 92,
              padding: '0.45em 0.9em',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              background: active ? 'var(--paper)' : 'transparent',
              color: active ? 'var(--ink)' : 'var(--fog)',
              clipPath: active ? 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' : 'none',
              transition: 'background 0.12s, color 0.12s',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
