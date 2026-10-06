import React, { useMemo } from 'react'
import { Plan } from '@/types/plan'
import { Panel, Readout } from '@/components/primitives'

interface Props {
  plan: Plan
}

export const Analytics: React.FC<Props> = ({ plan }) => {
  const stats = useMemo(() => {
    const allStories = plan.groups.flatMap(g => g.stories)
    const totalStories = allStories.length
    const doneStories = allStories.filter(s => s.done).length
    const totalPoints = allStories.reduce((sum, s) => sum + (s.points || 0), 0)
    const donePoints = allStories.filter(s => s.done).reduce((sum, s) => sum + (s.points || 0), 0)

    const sprints = plan.groups.filter(g => g.type === 'sprint')
    const sprintData = sprints.map(sprint => {
      const stories = sprint.stories
      const total = stories.reduce((sum, s) => sum + (s.points || 0), 0)
      const done = stories.filter(s => s.done).reduce((sum, s) => sum + (s.points || 0), 0)
      return {
        name: `Sprint ${sprint.number}`,
        total,
        done,
        remaining: total - done,
      }
    })

    const epics = plan.epics.map(epic => {
      const stories = allStories.filter(s => s.epic_id === epic.id)
      const done = stories.filter(s => s.done).length
      return {
        name: epic.name,
        total: stories.length,
        done,
        pct: stories.length > 0 ? Math.round((done / stories.length) * 100) : 0,
      }
    })

    const priorities = {
      High: allStories.filter(s => s.priority === 'High').length,
      Medium: allStories.filter(s => s.priority === 'Medium').length,
      Low: allStories.filter(s => s.priority === 'Low').length,
    }

    return {
      totalStories,
      doneStories,
      totalPoints,
      donePoints,
      sprintData,
      epics,
      priorities,
      completionPct: totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : totalStories > 0 ? Math.round((doneStories / totalStories) * 100) : 0,
    }
  }, [plan])

  const maxPoints = Math.max(...stats.sprintData.map(s => s.total), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Panel radius="lg" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>Sprint Burndown</h3>
        {stats.sprintData.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.sprintData.map(sprint => (
              <div key={sprint.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 70, fontSize: 12, fontWeight: 500, color: 'var(--muted)' }}>{sprint.name}</span>
                <div style={{ flex: 1, height: 24, background: 'var(--surface-3)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${(sprint.done / maxPoints) * 100}%`,
                      background: 'var(--primary)',
                      borderRadius: 6,
                      transition: 'width 0.3s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${(sprint.remaining / maxPoints) * 100}%`,
                      background: 'var(--surface-2)',
                      borderRadius: 6,
                    }}
                  />
                </div>
                <span className="tnum" style={{ width: 80, fontSize: 12, textAlign: 'right', color: 'var(--muted)' }}>
                  {sprint.done}/{sprint.total} pts
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>No sprint data available</p>
        )}
      </Panel>

      <Panel radius="lg" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>Epic Progress</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats.epics.map(epic => (
            <div key={epic.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{epic.name}</span>
                <span className="tnum" style={{ fontSize: 12, color: 'var(--muted)' }}>{epic.done}/{epic.total} ({epic.pct}%)</span>
              </div>
              <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${epic.pct}%`,
                    background: 'var(--primary)',
                    borderRadius: 3,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel radius="lg" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>Priority Distribution</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          {Object.entries(stats.priorities).map(([priority, count]) => (
            <div key={priority} style={{ textAlign: 'center' }}>
              <div className="tnum" style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)' }}>{count}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{priority}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel radius="lg" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div>
            <Readout variant="label" size="xs">Completion</Readout>
            <div className="tnum" style={{ fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{stats.completionPct}%</div>
          </div>
          <div>
            <Readout variant="label" size="xs">Stories</Readout>
            <div className="tnum" style={{ fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{stats.doneStories}/{stats.totalStories}</div>
          </div>
          <div>
            <Readout variant="label" size="xs">Points</Readout>
            <div className="tnum" style={{ fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{stats.donePoints}/{stats.totalPoints}</div>
          </div>
          <div>
            <Readout variant="label" size="xs">Epics</Readout>
            <div className="tnum" style={{ fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{plan.epics.length}</div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
