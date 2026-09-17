import React from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export const MethodologyToggle: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--surface-alt)',
      borderRadius: '8px',
      padding: '4px',
      gap: '4px',
      border: '1px solid var(--grid-line)',
      position: 'relative',
    }}>
      {(['scrum', 'kanban'] as const).map(opt => {
        const active = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              position: 'relative',
              minWidth: '100px',
              padding: '10px 20px',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              background: active ? 'var(--surface-alt)' : 'transparent',
              color: active ? 'var(--bright)' : 'var(--fog)',
              borderRadius: '6px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: active ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
              transform: active ? 'translateY(-1px)' : 'translateY(0)',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'var(--surface)'
                e.currentTarget.style.color = 'var(--ink-soft)'
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--fog)'
              }
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
