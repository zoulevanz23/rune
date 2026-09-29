import React from 'react'
import { Panel, Select, Input } from '../primitives'
import { ChevronDown, ChevronRight } from 'lucide-react'

export const CustomizePanel: React.FC<{
  sprintCount: number; sprintLength: string; scopeMode: string; teamVelocity: string; numColumns: number;
  onSprintCountChange: (v: number) => void; onSprintLengthChange: (v: string) => void; onScopeModeChange: (v: string) => void; onTeamVelocityChange: (v: string) => void; onNumColumnsChange: (v: number) => void;
  isExpanded: boolean; onToggle: () => void;
}> = ({ sprintCount, sprintLength, scopeMode, teamVelocity, numColumns, onSprintCountChange, onSprintLengthChange, onScopeModeChange, onTeamVelocityChange, onNumColumnsChange, isExpanded, onToggle }) => {
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted)' }

  return (
    <div style={{ marginTop: '0.8rem', maxWidth: 640, width: '100%' }}>
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
          background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)',
          cursor: 'pointer', padding: '6px 10px', borderRadius: 'var(--radius-md)',
        }}
      >
        {isExpanded ? <ChevronDown size={14} strokeWidth={1.7} /> : <ChevronRight size={14} strokeWidth={1.7} />}
        Customize
      </button>
      {isExpanded && (
        <Panel style={{ marginTop: '0.6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <label style={labelStyle}>
            Sprint count (2–6)
            <Input type="number" min={2} max={6} value={sprintCount} onChange={e => onSprintCountChange(Number(e.target.value))} style={{ marginTop: 4 }} />
          </label>
          <label style={labelStyle}>
            Sprint length
            <Select value={sprintLength} onChange={e => onSprintLengthChange(e.target.value)} style={{ marginTop: 4 }}
              options={[{ value: '1 week', label: '1 week' }, { value: '2 weeks', label: '2 weeks' }]} />
          </label>
          <label style={labelStyle}>
            Scope mode
            <Select value={scopeMode} onChange={e => onScopeModeChange(e.target.value)} style={{ marginTop: 4 }}
              options={[{ value: 'MVP', label: 'MVP' }, { value: 'Full build', label: 'Full build' }]} />
          </label>
          <label style={labelStyle}>
            Team velocity (pts/sprint)
            <Input type="number" value={teamVelocity} placeholder="—" onChange={e => onTeamVelocityChange(e.target.value)} style={{ marginTop: 4 }} />
          </label>
          <label style={labelStyle}>
            Starting columns
            <Input type="number" min={4} max={6} value={numColumns} onChange={e => onNumColumnsChange(Number(e.target.value))} style={{ marginTop: 4 }} />
          </label>
        </Panel>
      )}
    </div>
  )
}
