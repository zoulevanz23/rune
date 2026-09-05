import React, { useState } from 'react'
import { Button } from '../shared/Button'

export const RefineBar: React.FC<{ onRefine: (instruction: string) => void; loading: boolean; onUndo: () => void; canUndo: boolean }> = ({ onRefine, loading, onUndo, canUndo }) => {
  const [instruction, setInstruction] = useState('')
  const handleSubmit = () => {
    if (!instruction.trim()) return
    onRefine(instruction)
    setInstruction('')
  }
  return (
    <div style={{
      display: 'flex', gap: '0.4rem', marginTop: '1.2rem', padding: '0.5rem',
      background: 'var(--surface)', border: '1px solid var(--grid-line)',
      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
    }}>
      <input
        value={instruction}
        onChange={e => setInstruction(e.target.value)}
        placeholder="Refine this plan…  e.g. 'make sprint 2 focus on onboarding'"
        style={{
          flex: 1, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.82rem',
          padding: '0.55rem 0.7rem',
          border: '1px solid var(--grid-line)', background: 'var(--paper)', color: 'var(--ink)', outline: 'none',
        }}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      />
      <Button variant="primary" onClick={handleSubmit} disabled={loading || !instruction.trim()}>
        {loading ? 'Refining…' : 'Refine'}
      </Button>
      <Button variant="ghost" onClick={onUndo} disabled={!canUndo}>Undo</Button>
    </div>
  )
}
