import React from 'react'
import { CalendarRange, Columns3 } from 'lucide-react'

const options = [
  { id: 'scrum', label: 'Scrum', desc: 'Sprints with goals and velocity', icon: <CalendarRange size={16} strokeWidth={1.75} /> },
  { id: 'kanban', label: 'Kanban', desc: 'Continuous flow with WIP limits', icon: <Columns3 size={16} strokeWidth={1.75} /> },
]

export const MethodologyToggle: React.FC<{
  value: string
  onChange: (v: string) => void
}> = ({ value, onChange }) => {
  return (
    <div role="radiogroup" aria-label="Methodology" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, maxWidth: 520 }}>
      {options.map(opt => {
        const active = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              textAlign: 'left',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              background: active ? 'var(--primary-soft)' : 'var(--surface)',
              border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
              color: active ? 'var(--primary-text)' : 'var(--ink)',
              boxShadow: active ? 'var(--shadow-1)' : 'none',
              transition: 'border-color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.boxShadow = 'var(--shadow-1)'
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            <span style={{ display: 'inline-flex', marginTop: 2, flexShrink: 0 }} aria-hidden="true">{opt.icon}</span>
            <span>
              <span style={{ display: 'block', fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{opt.label}</span>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{opt.desc}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
