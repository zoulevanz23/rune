import React from 'react'
import { Plan } from '@/types/plan'
import { Panel } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { Chip } from '@/components/primitives'

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
  const pct = teamVelocity ? Math.min(100, Math.round((total / teamVelocity) * 100)) : (total > 0 ? Math.round((done / total) * 100) : 0)
  return { total, done, pct }
}

export const TimelineStrip: React.FC<TimelineStripProps> = ({ sprintCount, sprintLength, plan, teamVelocity }) => {
  const weeksPerSprint = sprintLength === '2 weeks' ? 2 : 1

  return (
    <Panel variant="surface" chamfered={true} bordered={true} style={{ padding: '0.75rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
        {Array.from({ length: sprintCount }, (_, i) => {
          const startWeek = i * weeksPerSprint + 1
          const endWeek = (i + 1) * weeksPerSprint
          const capacity = getSprintCapacity(i, plan, teamVelocity)
          const isOverCapacity = teamVelocity && capacity.total > teamVelocity

          return (
            <Panel key={i} variant="surface" chamfered={true} bordered={true} style={{ flex: 1, minWidth: 140, padding: 'var(--card-padding)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                <Readout variant="label" size="xs">SPRINT {String(i + 1).padStart(2, '0')}</Readout>
                <Readout variant="metric" size="xs">WEEKS {startWeek}–{endWeek}</Readout>
              </div>
              {plan && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontFamily: "'IBM Plex Mono', monospace" }}>
                    <Readout variant="status" size="xs">POINTS</Readout>
                    <Readout variant={isOverCapacity ? 'metric' : 'metric'} size="xs" style={{ color: isOverCapacity ? 'var(--coral)' : 'var(--bright)' }}>
                      {capacity.done}/{capacity.total} pts
                    </Readout>
                  </div>
                  <div style={{ height: 6, background: 'var(--canvas)', border: '1px solid var(--grid-line)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, capacity.pct)}%`,
                      background: isOverCapacity ? 'var(--coral)' : capacity.pct === 100 ? 'var(--green)' : 'var(--amber)',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  {teamVelocity && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', fontFamily: "'IBM Plex Mono', monospace" }}>
                      <Readout variant="status" size="xs">VEL: {teamVelocity}</Readout>
                      <Chip variant={isOverCapacity ? 'coral' : 'green'} size="xs">{isOverCapacity ? 'OVER' : 'OK'}</Chip>
                    </div>
                  )}
                </div>
              )}
            </Panel>
          )
        })}
      </div>
    </Panel>
  )
}