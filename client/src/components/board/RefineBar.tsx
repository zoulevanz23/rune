import React, { useRef, useState } from 'react'
import { Button, Input, Panel, Readout } from '@/components/primitives'

const suggestions = [
  'Rebalance sprints',
  'Add onboarding epic',
  'Cut scope to MVP',
  'Split large stories',
  'Add acceptance criteria',
  'Prioritize technical debt',
]

const actions = [
  { id: 'add-stories', label: 'Add stories' },
  { id: 'split-stories', label: 'Split large' },
  { id: 're-prioritize', label: 'Re-prioritize' },
  { id: 'estimate', label: 'Estimate' },
  { id: 'add-dependencies', label: 'Dependencies' },
  { id: 'improve-criteria', label: 'Criteria' },
]

const pill: React.CSSProperties = {
  height: 26,
  padding: '0 10px',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  borderRadius: 'var(--radius-pill)',
  cursor: 'pointer',
  transition: 'background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)',
}

interface RefineBarProps {
  onRefine: (instruction: string) => void
  onRefineAction: (action: string) => void
  loading: boolean
}

export const RefineBar: React.FC<RefineBarProps> = ({ onRefine, onRefineAction, loading }) => {
  const [instruction, setInstruction] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!instruction.trim() || loading) return
    onRefine(instruction.trim())
    setInstruction('')
    inputRef.current?.focus()
  }

  return (
    <Panel radius="lg" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
        <Readout variant="label" size="xs">Refine plan</Readout>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          Describe a change in plain language, or pick a quick action.
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {suggestions.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setInstruction(s)
              inputRef.current?.focus()
            }}
            style={{
              ...pill,
              fontWeight: 500,
              color: 'var(--ink)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--surface-2)'
              e.currentTarget.style.borderColor = 'var(--border-strong)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--surface)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {actions.map(a => (
          <button
            key={a.id}
            type="button"
            onClick={() => onRefineAction(a.id)}
            disabled={loading}
            aria-busy={loading}
            style={{
              ...pill,
              fontWeight: 600,
              color: 'var(--primary-text)',
              background: 'var(--primary-soft)',
              border: '1px solid var(--primary)',
              opacity: loading ? 0.55 : 1,
            }}
            onMouseEnter={e => {
              if (loading) return
              e.currentTarget.style.background = 'var(--primary)'
              e.currentTarget.style.color = 'var(--on-primary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--primary-soft)'
              e.currentTarget.style.color = 'var(--primary-text)'
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Input
          ref={inputRef}
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
          placeholder={'Refine this plan… e.g. "make sprint 2 focus on onboarding"'}
          aria-label="Refine instruction"
          onKeyDown={e => {
            if (e.key === 'Enter') handleSubmit()
          }}
        />
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !instruction.trim()} loading={loading}>
          {loading ? 'Refining…' : 'Refine'}
        </Button>
      </div>
    </Panel>
  )
}