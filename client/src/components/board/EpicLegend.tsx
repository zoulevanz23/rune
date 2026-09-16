import React, { useState } from 'react'
import { Epic, Plan } from '@/types/plan'
import { ChamferPanel } from '../shared/ChamferPanel'

const epicColors = ['var(--amber)', 'var(--coral)', 'var(--teal)', 'var(--violet)', 'var(--sage)']

interface EpicLegendProps {
  epics: Epic[]
  plan?: Plan
}

const getEpicProgress = (epic: Epic, plan?: Plan) => {
  if (!plan) return { done: 0, total: 0, donePoints: 0, totalPoints: 0, pct: 0 }
  const stories = plan.groups.flatMap(g => g.stories.filter(s => s.epic_id === epic.id))
  const total = stories.length
  const done = stories.filter(s => s.done).length
  const totalPoints = stories.reduce((sum, s) => sum + (s.points || 0), 0)
  const donePoints = stories.filter(s => s.done).reduce((sum, s) => sum + (s.points || 0), 0)
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return { done, total, donePoints, totalPoints, pct }
}

export const EpicLegend: React.FC<EpicLegendProps> = ({ epics, plan }) => {
  const [expanded, setExpanded] = useState(false)
  if (!epics.length) return null
  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.08em', color: 'var(--fog)' }}>EPICS</span>
        {epics.map((epic, i) => {
          const progress = getEpicProgress(epic, plan)
          const color = epicColors[i % epicColors.length]
          return (
            <span key={epic.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', border: '1px solid var(--grid-line)', background: 'var(--surface)', padding: '2px 6px' }} onClick={() => setExpanded(!expanded)}>
              <span style={{ width: 10, height: 10, background: color, display: 'inline-block', clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)' }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'var(--bright)' }}>{epic.name}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--fog)' }}>{epic.id}</span>
              {plan && (
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem',
                  color: progress.pct === 100 ? 'var(--sage)' : progress.pct > 0 ? 'var(--amber)' : 'var(--fog)',
                  marginLeft: '0.2rem'
                }}>{progress.pct}%</span>
              )}
            </span>
          )
        })}
        <button onClick={() => setExpanded(!expanded)} style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', background: 'none', border: '1px solid var(--grid-line)', color: 'var(--fog)', cursor: 'pointer', padding: '2px 6px' }}>{expanded ? 'HIDE DOD' : 'SHOW DOD'}</button>
      </div>
      {expanded && plan && (
        <ChamferPanel style={{ marginTop: '0.7rem', padding: '0.9rem 1rem' }}>
          {epics.map((epic, i) => {
            const progress = getEpicProgress(epic, plan)
            const color = epicColors[i % epicColors.length]
            return (
              <div key={epic.id} style={{ marginBottom: '0.9rem', borderLeft: `2px solid ${color}`, paddingLeft: '0.7rem' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.82rem', color: 'var(--ink)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {epic.name} <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, fontSize: '0.62rem', color: 'var(--ink-soft)' }}>{epic.id}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: progress.pct === 100 ? 'var(--sage)' : progress.pct > 0 ? 'var(--amber)' : 'var(--fog)' }}>
                    {progress.done}/{progress.total} stories · {progress.donePoints}/{progress.totalPoints} pts · {progress.pct}%
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--canvas)', border: '1px solid var(--grid-line)', marginTop: '0.4rem', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${progress.pct}%`, background: color,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                {epic.risk && <div style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: '0.4rem' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em' }}>RISK —</span> {epic.risk}</div>}
                {epic.definition_of_done && epic.definition_of_done.length > 0 && (
                  <div style={{ marginTop: '0.3rem' }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.06em', color: 'var(--ink-soft)' }}>DEFINITION OF DONE</div>
                    <div style={{ marginTop: '0.2rem' }}>{epic.definition_of_done.map((d, j) => <div key={j} style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', paddingLeft: '0.7rem', position: 'relative', lineHeight: 1.4 }}><span style={{ position: 'absolute', left: 0 }}>—</span>{d}</div>)}</div>
                  </div>
                )}
              </div>
            )
          })}
        </ChamferPanel>
      )}
    </div>
  )
}
