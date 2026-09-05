import React, { useState } from 'react'
import { Epic } from '@/types/plan'
import { ChamferPanel } from '../shared/ChamferPanel'

const epicColors = ['var(--amber)', 'var(--coral)', 'var(--teal)', 'var(--violet)', 'var(--sage)']

export const EpicLegend: React.FC<{ epics: Epic[] }> = ({ epics }) => {
  const [expanded, setExpanded] = useState(false)
  if (!epics.length) return null
  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.08em', color: 'var(--fog)' }}>EPICS</span>
        {epics.map((epic, i) => (
          <span key={epic.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', border: '1px solid var(--grid-line)', background: 'var(--surface)', padding: '2px 6px' }} onClick={() => setExpanded(!expanded)}>
            <span style={{ width: 10, height: 10, background: epicColors[i % epicColors.length], display: 'inline-block', clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)' }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'var(--bright)' }}>{epic.name}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--fog)' }}>{epic.id}</span>
          </span>
        ))}
        <button onClick={() => setExpanded(!expanded)} style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', background: 'none', border: '1px solid var(--grid-line)', color: 'var(--fog)', cursor: 'pointer', padding: '2px 6px' }}>{expanded ? 'HIDE DOD' : 'SHOW DOD'}</button>
      </div>
      {expanded && (
        <ChamferPanel style={{ marginTop: '0.7rem', padding: '0.9rem 1rem' }}>
          {epics.map((epic, i) => (
            <div key={epic.id} style={{ marginBottom: '0.9rem', borderLeft: `2px solid ${epicColors[i % epicColors.length]}`, paddingLeft: '0.7rem' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.82rem', color: 'var(--ink)', marginBottom: '0.2rem' }}>{epic.name} <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, fontSize: '0.62rem', color: 'var(--ink-soft)' }}>{epic.id}</span></div>
              {epic.risk && <div style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', lineHeight: 1.4 }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em' }}>RISK —</span> {epic.risk}</div>}
              {epic.definition_of_done && epic.definition_of_done.length > 0 && (
                <div style={{ marginTop: '0.3rem' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.06em', color: 'var(--ink-soft)' }}>DEFINITION OF DONE</div>
                  <div style={{ marginTop: '0.2rem' }}>{epic.definition_of_done.map((d, j) => <div key={j} style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', paddingLeft: '0.7rem', position: 'relative', lineHeight: 1.4 }}><span style={{ position: 'absolute', left: 0 }}>—</span>{d}</div>)}</div>
                </div>
              )}
            </div>
          ))}
        </ChamferPanel>
      )}
    </div>
  )
}
