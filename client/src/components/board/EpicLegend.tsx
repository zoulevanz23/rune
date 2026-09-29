import React, { useState } from 'react'
import { Epic, Plan } from '@/types/plan'
import { Button, Chip, Panel, Progress, Readout } from '@/components/primitives'

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
    <Panel radius="lg" style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Readout variant="label" size="xs">Epics</Readout>
          {epics.map(epic => {
            const progress = getEpicProgress(epic, plan)
            return (
              <span key={epic.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Chip variant="outline" size="sm">
                  {epic.name}
                  <span style={{ fontWeight: 600, color: 'var(--ink-mute)' }}>{epic.id}</span>
                </Chip>
                {plan && (
                  <span className="tnum" style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {progress.pct}%
                  </span>
                )}
              </span>
            )
          })}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(v => !v)} aria-expanded={expanded}>
          {expanded ? 'Hide details' : 'Show details'}
        </Button>
      </div>

      {expanded && plan && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {epics.map(epic => {
            const progress = getEpicProgress(epic, plan)
            return (
              <div
                key={epic.id}
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{epic.name}</span>
                  <Chip variant="outline" size="xs">{epic.id}</Chip>
                  <span className="tnum" style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--muted)' }}>
                    {progress.done}/{progress.total} stories · {progress.donePoints}/{progress.totalPoints} pts · {progress.pct}%
                  </span>
                </div>
                <Progress value={progress.pct} size="sm" tone={progress.pct === 100 ? 'success' : 'primary'} style={{ marginTop: 8 }} />
                {epic.risk && (
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }}>
                    <span style={{ fontWeight: 500, color: 'var(--ink)' }}>Risk: </span>
                    {epic.risk}
                  </div>
                )}
                {epic.definition_of_done && epic.definition_of_done.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <Readout variant="label" size="xs">Definition of done</Readout>
                    <ul style={{ margin: '6px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {epic.definition_of_done.map((d, j) => (
                        <li key={j} style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Panel>
  )
}
