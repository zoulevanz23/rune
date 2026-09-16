import React from 'react'
import { Plan } from '@/types/plan'

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
    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
      {Array.from({ length: sprintCount }, (_, i) => {
        const startWeek = i * weeksPerSprint + 1
        const endWeek = (i + 1) * weeksPerSprint
        const capacity = getSprintCapacity(i, plan, teamVelocity)
        const isOverCapacity = teamVelocity && capacity.total > teamVelocity
        return (
          <div key={i} style={{
            flex: 1, background: 'var(--surface)', border: '1px solid var(--grid-line)',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
            padding: 'var(--card-padding)',
          }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.08em', color: 'var(--fog)' }}>SPRINT {String(i+1).padStart(2,'0')}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'var(--bright)' }}>WEEKS {startWeek}–{endWeek}</div>
            {plan && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontFamily: "'IBM Plex Mono', monospace" }}>
                  <span style={{ color: 'var(--fog)' }}>POINTS</span>
                  <span style={{ color: isOverCapacity ? 'var(--coral)' : 'var(--bright)' }}>{capacity.done}/{capacity.total} pts</span>
                </div>
                <div style={{ height: 4, background: 'var(--canvas)', border: '1px solid var(--grid-line)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, capacity.pct)}%`,
                    background: isOverCapacity ? 'var(--coral)' : capacity.pct === 100 ? 'var(--sage)' : 'var(--amber)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                {teamVelocity && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--fog)' }}>
                    <span>VEL: {teamVelocity}</span>
                    <span>{isOverCapacity ? '⚠ OVER' : 'OK'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
