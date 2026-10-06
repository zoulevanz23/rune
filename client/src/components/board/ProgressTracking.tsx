import React, { useMemo } from 'react'
import { Plan } from '@/types/plan'
import { Panel, Readout } from '@/components/primitives'

interface Props {
  plan: Plan
}

export const ProgressTracking: React.FC<Props> = ({ plan }) => {
  const progress = useMemo(() => {
    const allStories = plan.groups.flatMap(g => g.stories)
    const totalStories = allStories.length
    const doneStories = allStories.filter(s => s.done).length
    const totalPoints = allStories.reduce((sum, s) => sum + (s.points || 0), 0)
    const donePoints = allStories.filter(s => s.done).reduce((sum, s) => sum + (s.points || 0), 0)

    const groups = plan.groups.map((group, i) => {
      const stories = group.stories
      const done = stories.filter(s => s.done).length
      const points = stories.reduce((sum, s) => sum + (s.points || 0), 0)
      const donePoints = stories.filter(s => s.done).reduce((sum, s) => sum + (s.points || 0), 0)
      return {
        name: group.type === 'sprint' ? `Sprint ${(group as any).number}` : group.name,
        index: i,
        totalStories: stories.length,
        doneStories: done,
        totalPoints: points,
        donePoints,
        pct: points > 0 ? Math.round((donePoints / points) * 100) : stories.length > 0 ? Math.round((done / stories.length) * 100) : 0,
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

    return {
      totalStories,
      doneStories,
      totalPoints,
      donePoints,
      groups,
      epics,
      overallPct: totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : totalStories > 0 ? Math.round((doneStories / totalStories) * 100) : 0,
    }
  }, [plan])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Panel radius="lg" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Overall Progress</h3>
          <span className="tnum" style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>{progress.overallPct}%</span>
        </div>
        <div style={{ height: 12, background: 'var(--surface-3)', borderRadius: 6, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress.overallPct}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--primary-text))',
              borderRadius: 6,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{progress.doneStories} of {progress.totalStories} stories done</span>
          <span className="tnum" style={{ fontSize: 12, color: 'var(--muted)' }}>{progress.donePoints} of {progress.totalPoints} points</span>
        </div>
      </Panel>

      <Panel radius="lg" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>Group Progress</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {progress.groups.map(group => (
            <div key={group.index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{group.name}</span>
                <span className="tnum" style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {group.doneStories}/{group.totalStories} stories · {group.pct}%
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${group.pct}%`,
                    background: group.pct === 100 ? 'var(--success)' : 'var(--primary)',
                    borderRadius: 4,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel radius="lg" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>Epic Completion</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {progress.epics.map(epic => (
            <div key={epic.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{epic.name}</span>
              <div style={{ width: 100, height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${epic.pct}%`,
                    background: epic.pct === 100 ? 'var(--success)' : 'var(--primary)',
                    borderRadius: 3,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <span className="tnum" style={{ width: 40, fontSize: 12, textAlign: 'right', color: 'var(--muted)' }}>{epic.pct}%</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
