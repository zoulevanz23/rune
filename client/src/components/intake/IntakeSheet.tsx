import React from 'react'
import { Button } from '../shared/Button'
import { ChamferPanel } from '../shared/ChamferPanel'
import { MethodologyToggle } from './MethodologyToggle'

interface IntakeSheetProps {
  description: string
  onDescriptionChange: (v: string) => void
  methodology: string
  onMethodologyChange: (m: string) => void
  onGenerate: () => void
  loading: boolean
  charCount: number
}

export const IntakeSheet: React.FC<IntakeSheetProps> = ({
  description, onDescriptionChange, methodology, onMethodologyChange,
  onGenerate, loading, charCount,
}) => {
  return (
    <ChamferPanel tag="SPEC 00" style={{ maxWidth: 640, width: '100%', padding: '2rem 1.8rem 2.2rem' }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--ink-soft)', marginBottom: '0.6rem' }}>AGILE SPECIFICATION SHEET — REV 02</div>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.6rem', color: 'var(--ink)', marginBottom: '0.35rem', lineHeight: 1.1 }}>
        Rune
      </h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '1.4rem', fontSize: '0.82rem', lineHeight: 1.5 }}>
        Describe your app and we will draft the delivery plan on the board.
      </p>

      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--ink-soft)', marginBottom: '0.4rem' }}>METHODOLOGY</div>
        <MethodologyToggle value={methodology} onChange={onMethodologyChange} />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--ink-soft)', marginBottom: '0.4rem' }}>APP DESCRIPTION</div>
        <textarea
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder="Paste a rough description of your app…"
          style={{
            width: '100%', minHeight: 148, fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '0.9rem', lineHeight: 1.55, padding: '0.9rem 1rem',
            border: '1px solid var(--grid-line)',
            background: '#F4EFE2', color: 'var(--ink)', resize: 'vertical', outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.3rem' }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', color: 'var(--ink-soft)' }}>
          {String(charCount).padStart(3,'0')} CHARS
        </span>
        <a href="#" onClick={e => {
          e.preventDefault()
          onDescriptionChange('A collaborative task management app where teams can create boards, assign tasks with priorities and story points, track progress through epics, and organize work into sprints or continuous flow columns. Features include real-time updates, dependency tracking between tasks, and a visual board showing the status of every item.')
        }} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
          Use an example description
        </a>
      </div>

      <Button
        variant="primary"
        onClick={onGenerate}
        disabled={loading || !description.trim()}
        style={{ width: '100%' }}
      >
        {loading ? 'Generating…' : 'Generate plan'}
      </Button>
    </ChamferPanel>
  )
}
