import React from 'react'
import { Plan } from '@/types/plan'
import { Chip, Panel, Progress, Readout } from '@/components/primitives'

interface TimelineStripProps {
  sprintCount: number
  sprintLength: string
  plan?: Plan
  teamVelocity?: number
}

const getSprintCapacity = (sprintIndex: number, plan?: Plan, teamVelocity?: number) => {
  if (!plan) return { total: 0, done: 0, pct: 0 }
  const sprintGroups = plan.groups.filter(g => g.type === 'sprint')
  const sprint = sprintGroups[sprintIndex]
  if (!sprint) return { total: 0, done: 0, pct: 0 }
  const total = sprint.stories.reduce((sum, s) => sum + (s.points || 0), 0)
  const done = sprint.stories.filter(s => s.done).reduce((sum, s) => sum + (s.points || 0), 0)
  const pct = teamVelocity
    ? Math.min(100, Math.round((total / teamVelocity) * 100))
    : total > 0
      ? Math.round((done / total) * 100)
      : 0
  return { total, done, pct }
}

export const TimelineStrip: React.FC<TimelineStripProps> = ({ sprintCount, sprintLength, plan, teamVelocity }) => {
  const weeksPerSprint = sprintLength === '2 weeks' ? 2 : 1

  return (
    <Panel radius="lg" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
        <Readout variant="label" size="xs">Timeline</Readout>
        <span className="tnum" style={{ fontSize: 13, color: 'var(--muted)' }}>
          {sprintCount} {sprintCount === 1 ? 'sprint' : 'sprints'} · {sprintLength}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'stretch' }}>
        {Array.from({ length: sprintCount }, (_, i) => {
          const startWeek = i * weeksPerSprint + 1
          const endWeek = (i + 1) * weeksPerSprint
          const capacity = getSprintCapacity(i, plan, teamVelocity)
          const isOverCapacity = Boolean(teamVelocity && capacity.total > teamVelocity)

          return (
            <div
              key={i}
              style={{
                flex: '1 1 180px',
                minWidth: 160,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Sprint {i + 1}</span>
                <span className="tnum" style={{ fontSize: 12, color: 'var(--muted)' }}>
                  Weeks {startWeek}–{endWeek}
                </span>
              </div>
              {plan && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Points</span>
                    <span className="tnum" style={{ fontSize: 13, fontWeight: 600, color: isOverCapacity ? 'var(--danger-text)' : 'var(--ink)' }}>
                      {capacity.done}/{capacity.total}
                    </span>
                  </div>
                  <Progress
                    value={capacity.pct}
                    size="sm"
                    tone={isOverCapacity ? 'danger' : capacity.pct === 100 ? 'success' : 'primary'}
                  />
                  {teamVelocity && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span className="tnum" style={{ fontSize: 12, color: 'var(--muted)' }}>Velocity {teamVelocity}</span>
                      <Chip variant={isOverCapacity ? 'danger' : 'success'} size="xs">
                        {isOverCapacity ? 'Over' : 'On track'}
                      </Chip>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
