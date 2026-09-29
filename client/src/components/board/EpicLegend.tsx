import React, { useState } from 'react'
import { Epic, Plan } from '@/types/plan'
import { Panel } from '@/components/primitives'
import { Chip } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { Button } from '@/components/primitives'

const epicColors = ['var(--amber)', 'var(--coral)', 'var(--teal)', 'var(--violet)', 'var(--sage)'] as const

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
    <Panel variant="surface" chamfered={true} bordered={true} style={{ marginBottom: '1.2rem', padding: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Readout variant="label" size="xs">EPICS</Readout>
          {epics.map((epic, i) => {
            const progress = getEpicProgress(epic, plan)
            const color = epicColors[i % epicColors.length]
            return (
              <Chip
                key={epic.id}
                variant={progress.pct === 100 ? 'green' : progress.pct > 0 ? 'amber' : 'default'}
                size="sm"
                style={{ background: progress.pct === 100 ? 'var(--green)' : progress.pct > 0 ? 'var(--amber)' : color, cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}
              >
                <span style={{ width: 8, height: 8, display: 'inline-block', marginRight: '0.3rem', clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)', background: color }} />
                <Readout variant="status" size="xs">{epic.name}</Readout>
                <Readout variant="status" size="xs">{epic.id}</Readout>
                {plan && (
                  <Readout variant={progress.pct === 100 ? 'metric' : progress.pct > 0 ? 'metric' : 'status'} size="xs" style={{ color: progress.pct === 100 ? 'var(--green)' : progress.pct > 0 ? 'var(--amber)' : 'var(--fog)' }}>
                    {progress.pct}%
                  </Readout>
                )}
              </Chip>
            )
          })}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'HIDE DOD' : 'SHOW DOD'}
        </Button>
      </div>
      {expanded && plan && (
        <div style={{ marginTop: '0.75rem' }}>
          {epics.map((epic, i) => {
            const progress = getEpicProgress(epic, plan)
            const color = epicColors[i % epicColors.length]
            return (
              <Panel key={epic.id} variant="paper" chamfered={true} bordered={true} style={{ marginBottom: '0.9rem', padding: '0.9rem 1rem', borderLeft: `3px solid ${color}` }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.82rem', color: 'var(--ink)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {epic.name} <Readout variant="status" size="xs">{epic.id}</Readout>
                  <Readout variant={progress.pct === 100 ? 'metric' : progress.pct > 0 ? 'metric' : 'status'} size="xs" style={{ color: progress.pct === 100 ? 'var(--green)' : progress.pct > 0 ? 'var(--amber)' : 'var(--fog)' }}>
                    {progress.done}/{progress.total} stories · {progress.donePoints}/{progress.totalPoints} pts · {progress.pct}%
                  </Readout>
                </div>
                <div style={{ height: 6, background: 'var(--canvas)', border: '1px solid var(--grid-line)', marginTop: '0.4rem', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${progress.pct}%`, background: color,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                {epic.risk && (
                  <div style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: '0.4rem' }}>
                    <Readout variant="label" size="xs" style={{ marginRight: '0.35rem' }}>RISK</Readout>
                    {epic.risk}
                  </div>
                )}
                {epic.definition_of_done && epic.definition_of_done.length > 0 && (
                  <div style={{ marginTop: '0.3rem' }}>
                    <Readout variant="label" size="xs" style={{ marginBottom: '0.2rem', display: 'block' }}>DEFINITION OF DONE</Readout>
                    <div style={{ marginTop: '0.2rem' }}>
                      {epic.definition_of_done.map((d, j) => (
                        <div key={j} style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', paddingLeft: '0.7rem', position: 'relative', lineHeight: 1.4 }}>
                          <span style={{ position: 'absolute', left: 0 }}>—</span>{d}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Panel>
            )
          })}
        </div>
      )}
    </Panel>
  )
}