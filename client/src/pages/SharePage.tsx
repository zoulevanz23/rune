import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plan } from '@/types/plan'
import { Panel, Chip, Readout } from '@/components/primitives'
import { Spinner } from '@/components/shared/Spinner'
import { GroupColumn } from '@/components/board'
import { EpicLegend } from '@/components/board'

export const SharePage: React.FC<{ apiBaseUrl: string }> = ({ apiBaseUrl }) => {
  const { shareId } = useParams<{ shareId: string }>()
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/share/${shareId}`)
        if (!res.ok) throw new Error('Plan not found')
        const data = await res.json()
        setPlan(data)
      } catch (e) {
        setError('Shared plan not found or has expired')
      } finally {
        setLoading(false)
      }
    }
    if (shareId) fetchPlan()
  }, [shareId, apiBaseUrl])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spinner />
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div style={{ maxWidth: 600, margin: '48px auto', padding: '0 16px' }}>
        <Panel radius="lg" style={{ padding: 32, textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>Plan not found</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{error}</p>
        </Panel>
      </div>
    )
  }

  const allStories = plan.groups.flatMap(g => g.stories)
  const doneStories = allStories.filter(s => s.done).length
  const totalPoints = allStories.reduce((sum, s) => sum + (s.points || 0), 0)
  const donePoints = allStories.filter(s => s.done).reduce((sum, s) => sum + (s.points || 0), 0)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Chip variant="primary" size="xs">{plan.methodology === 'kanban' ? 'Kanban' : 'Scrum'}</Chip>
            <Readout variant="status" size="xs">Read-only</Readout>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{plan.project_name || 'Untitled Plan'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--muted)' }}>
          <span><strong className="tnum">{doneStories}/{allStories.length}</strong> stories</span>
          <span><strong className="tnum">{donePoints}/{totalPoints}</strong> points</span>
          <span><strong className="tnum">{plan.epics.length}</strong> epics</span>
        </div>
      </div>

      <EpicLegend epics={plan.epics} plan={plan} />

      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6, alignItems: 'flex-start' }}>
        {plan.groups.map((group, i) => (
          <GroupColumn
            key={`${group.type}-${group.name}-${i}`}
            group={group}
            groupIndex={i}
            epics={plan.epics}
            doneColumnIndex={plan.groups.findIndex(g => g.type === 'column' && g.name === 'Done')}
            readOnly
          />
        ))}
      </div>
    </div>
  )
}
