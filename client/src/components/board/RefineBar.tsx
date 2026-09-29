import React, { useState } from 'react'
import { Panel } from '@/components/primitives'
import { Button } from '@/components/primitives'
import { Chip } from '@/components/primitives'
import { Readout } from '@/components/primitives'

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

export const RefineBar: React.FC<{ onRefine: (instruction: string) => void; loading: boolean; onUndo: () => void; canUndo: boolean }> = ({ onRefine, loading, onUndo, canUndo }) => {
  const [instruction, setInstruction] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSubmit = () => {
    if (!instruction.trim()) return
    onRefine(instruction)
    setInstruction('')
    setShowSuggestions(false)
  }

  const handleSuggestion = (s: string) => {
    setInstruction(s)
    handleSubmit()
  }

  return (
    <Panel variant="paper" chamfered={true} bordered={true} style={{ padding: '0.75rem 0.9rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: '0.5rem' }}>
        <Readout variant="label" size="xs">REFINE — CONVERSATIONAL ITERATION</Readout>
        <Readout variant="status" size="xs">Use-case: tweak without regenerating</Readout>
      </div>
      <Readout variant="status" size="sm" style={{ lineHeight: 1.45, marginBottom: '0.5rem', display: 'block' }}>
        Describe changes in plain language — the board updates live. Try{' '}
        <span style={{ color: 'var(--ink)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem' }}>'make sprint 2 focus on onboarding'</span>{' '}·{' '}
        <span style={{ color: 'var(--ink)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem' }}>'split epic E2'</span>{' '}·{' '}
        <span style={{ color: 'var(--ink)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem' }}>'move US-101 to Done'</span>{' '}· then{' '}
        <span style={{ color: 'var(--ink)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem' }}>Undo</span>{' '}to revert.
      </Readout>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <input
            value={instruction}
            onChange={e => { setInstruction(e.target.value); setShowSuggestions(true) }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Refine this plan…  e.g. 'make sprint 2 focus on onboarding'"
            style={{
              width: '100%', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.82rem',
              padding: '0.55rem 0.7rem',
              border: '1px solid var(--grid-line)', background: '#F4EFE2', color: 'var(--ink)', outline: 'none',
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
            }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          {showSuggestions && instruction.length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
              background: 'var(--paper)', border: '1px solid var(--grid-line)',
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
              maxHeight: '200px', overflowY: 'auto', zIndex: 50,
            }}>
              {suggestions
                .filter(s => s.toLowerCase().includes(instruction.toLowerCase()))
                .slice(0, 6)
                .map(s => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '0.5rem 0.7rem',
                      fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.78rem',
                      color: 'var(--ink)', background: 'transparent', border: 'none',
                      borderBottom: '1px solid var(--grid-line)', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    {s}
                  </button>
                ))}
            </div>
          )}
        </div>
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !instruction.trim()} size="md">
          {loading ? 'Refining…' : 'Refine'}
        </Button>
        <Button variant="ghost" onClick={onUndo} disabled={!canUndo} size="md">Undo</Button>
      </div>
    </Panel>
  )
}