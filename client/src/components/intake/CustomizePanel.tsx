import React from 'react'
import { ChamferPanel } from '../shared/ChamferPanel'

export const CustomizePanel: React.FC<{
  sprintCount: number; sprintLength: string; scopeMode: string; teamVelocity: string; numColumns: number;
  onSprintCountChange: (v: number) => void; onSprintLengthChange: (v: string) => void; onScopeModeChange: (v: string) => void; onTeamVelocityChange: (v: string) => void; onNumColumnsChange: (v: number) => void;
  isExpanded: boolean; onToggle: () => void;
}> = ({ sprintCount, sprintLength, scopeMode, teamVelocity, numColumns, onSprintCountChange, onSprintLengthChange, onScopeModeChange, onTeamVelocityChange, onNumColumnsChange, isExpanded, onToggle }) => {
  return (
    <div style={{ marginTop: '0.8rem', maxWidth: 640, width: '100%' }}>
      <button onClick={onToggle} style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.06em',
        background: 'var(--surface)', border: '1px solid var(--grid-line)', color: 'var(--fog)', cursor: 'pointer',
        padding: '0.35em 0.6em',
      }}>
        {isExpanded ? '▾  HIDE CUSTOMIZE' : '▸  CUSTOMIZE'}
      </button>
      {isExpanded && (
        <ChamferPanel style={{ marginTop: '0.6rem', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', color: 'var(--ink-soft)' }}>
            SPRINT COUNT — 2–6
            <input type="number" min={2} max={6} value={sprintCount} onChange={e => onSprintCountChange(Number(e.target.value))} style={{ display: 'block', width: '100%', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', padding: '0.4rem', border: '1px solid var(--grid-line)', background: '#F4EFE2', color: 'var(--ink)', marginTop: '0.3rem', outline: 'none' }} />
          </label>
          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', color: 'var(--ink-soft)' }}>
            SPRINT LENGTH
            <select value={sprintLength} onChange={e => onSprintLengthChange(e.target.value)} style={{ display: 'block', width: '100%', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', padding: '0.4rem', border: '1px solid var(--grid-line)', background: '#F4EFE2', color: 'var(--ink)', marginTop: '0.3rem' }}>
              <option value="1 week">1 week</option><option value="2 weeks">2 weeks</option>
            </select>
          </label>
          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', color: 'var(--ink-soft)' }}>
            SCOPE MODE
            <select value={scopeMode} onChange={e => onScopeModeChange(e.target.value)} style={{ display: 'block', width: '100%', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', padding: '0.4rem', border: '1px solid var(--grid-line)', background: '#F4EFE2', color: 'var(--ink)', marginTop: '0.3rem' }}>
              <option value="MVP">MVP</option><option value="Full build">Full build</option>
            </select>
          </label>
          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', color: 'var(--ink-soft)' }}>
            VELOCITY — PTS/SPRINT
            <input type="number" value={teamVelocity} onChange={e => onTeamVelocityChange(e.target.value)} placeholder="—" style={{ display: 'block', width: '100%', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', padding: '0.4rem', border: '1px solid var(--grid-line)', background: '#F4EFE2', color: 'var(--ink)', marginTop: '0.3rem', outline: 'none' }} />
          </label>
          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', color: 'var(--ink-soft)' }}>
            STARTING COLUMNS
            <input type="number" min={4} max={6} value={numColumns} onChange={e => onNumColumnsChange(Number(e.target.value))} style={{ display: 'block', width: '100%', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', padding: '0.4rem', border: '1px solid var(--grid-line)', background: '#F4EFE2', color: 'var(--ink)', marginTop: '0.3rem', outline: 'none' }} />
          </label>
        </ChamferPanel>
      )}
    </div>
  )
}
