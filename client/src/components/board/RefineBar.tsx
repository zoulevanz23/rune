import React, { useRef, useState } from 'react'
import { Button, Input, Panel, Readout } from '@/components/primitives'

const suggestions = [
  'Rebalance sprints',
  'Add onboarding epic',
  'Cut scope to MVP',
  'Split large stories',
  'Add acceptance criteria',
  'Prioritize technical debt',
  'Move US-101 to Done',
  'Rename sprint 2',
]

interface RefineBarProps {
  onRefine: (instruction: string) => void
  loading: boolean
}

export const RefineBar: React.FC<RefineBarProps> = ({ onRefine, loading }) => {
  const [instruction, setInstruction] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!instruction.trim() || loading) return
    onRefine(instruction.trim())
    setInstruction('')
    inputRef.current?.focus()
  }

  const fill = (s: string) => {
    setInstruction(s)
    inputRef.current?.focus()
  }

  return (
    <Panel radius="lg" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
        <Readout variant="label" size="xs">Refine plan</Readout>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Describe a change in plain language — the board updates live.</span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {suggestions.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => fill(s)}
            style={{
              height: 26,
              padding: '0 10px',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              color: 'var(--ink)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              transition: 'background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)',
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

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Input
          ref={inputRef}
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
          placeholder="Refine this plan… e.g. “make sprint 2 focus on onboarding”"
          aria-label="Refine instruction"
          onKeyDown={e => {
            if (e.key === 'Enter') handleSubmit()
          }}
        />
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !instruction.trim()} loading={loading}>
          {loading ? 'Refining' : 'Refine'}
        </Button>
      </div>
    </Panel>
  )
}
