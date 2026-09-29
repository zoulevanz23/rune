import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlansRepository } from '@/hooks/usePlansRepository'
import { Panel } from '@/components/primitives'
import { Button } from '@/components/primitives'
import { Input } from '@/components/primitives'
import { Chip } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { IconButton } from '@/components/primitives'
import { Tabs, Tab } from '@/components/primitives'
import { Plan } from '@/types/plan'

interface SavedPlan {
  id: string
  projectName: string
  methodology: string
  savedAt: string
  plan: Plan
}

export const MyPlansPage: React.FC = () => {
  const { list, load, remove } = usePlansRepository()
  const navigate = useNavigate()
  const [plans, setPlans] = useState<SavedPlan[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'updated' | 'name'>('updated')

  useEffect(() => {
    list().then(setPlans).catch(() => setPlans([]))
  }, [list])

  const filteredPlans = useMemo(() => {
    let result = [...plans]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.projectName.toLowerCase().includes(q) ||
        p.methodology.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      )
    }
    result.sort((a, b) => {
      if (sortBy === 'name') return a.projectName.localeCompare(b.projectName)
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    })
    return result
  }, [plans, searchQuery, sortBy])

  const handleOpen = async (id: string) => {
    const plan = await load(id)
    if (plan) { navigate('/board'); window.dispatchEvent(new CustomEvent('load-plan', { detail: plan })) }
  }

  const handleDelete = async (id: string) => {
    await remove(id)
    list().then(setPlans).catch(() => {})
  }

  const getTotalPoints = (plan: Plan) => plan.groups.flatMap(g => g.stories).reduce((s, st) => s + (st.points || 0), 0)

  const getDonePoints = (plan: Plan) => plan.groups.flatMap(g => g.stories).filter(s => s.done).reduce((s, st) => s + (st.points || 0), 0)

  const renderThumbnail = (plan: Plan) => {
    const sprintGroups = plan.groups.filter(g => g.type === 'sprint')
    const columnGroups = plan.groups.filter(g => g.type === 'column')
    const groups = sprintGroups.length > 0 ? sprintGroups : columnGroups

    return (
      <div style={{ display: 'flex', gap: '2px', marginTop: '0.5rem', height: 40, overflow: 'hidden' }}>
        {groups.slice(0, 6).map((g, i) => (
          <div key={i} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--grid-line)', position: 'relative' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '4px', background: i % 5 === 0 ? 'var(--amber)' : i % 5 === 1 ? 'var(--coral)' : i % 5 === 2 ? 'var(--teal)' : i % 5 === 3 ? 'var(--violet)' : 'var(--sage)' }} />
              <div style={{ flex: 1, background: 'var(--canvas)' }} />
            </div>
          </div>
        ))}
        {groups.length > 6 && (
          <div style={{ width: 30, background: 'var(--surface)', border: '1px solid var(--grid-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'var(--fog)' }}>
            +{groups.length - 6}
          </div>
        )}
      </div>
    )
  }

  const viewTabs: Tab[] = [
    { id: 'grid', label: 'Grid', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="0" /><rect x="9" y="1" width="6" height="6" rx="0" /><rect x="1" y="9" width="6" height="6" rx="0" /><rect x="9" y="9" width="6" height="6" rx="0" /></svg> },
    { id: 'list', label: 'List', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="14" height="4" rx="0" /><rect x="1" y="7" width="14" height="4" rx="0" /><rect x="1" y="13" width="14" height="4" rx="0" /></svg> },
  ]

  const getProgressColor = (plan: Plan) => {
    const total = getTotalPoints(plan)
    const done = getDonePoints(plan)
    if (total === 0) return 'var(--fog)'
    if (done === total) return 'var(--green)'
    return 'var(--amber)'
  }

  const getProgressPct = (plan: Plan) => {
    const total = getTotalPoints(plan)
    const done = getDonePoints(plan)
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  const GridView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
      {filteredPlans.map(plan => (
        <Panel key={plan.id} variant="paper" chamfered={true} bordered={true} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'border-color 0.12s, box-shadow 0.12s' }} onClick={() => handleOpen(plan.id)} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--grid-line)'; e.currentTarget.style.boxShadow = 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{plan.projectName || 'Untitled'}</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <Chip variant={plan.methodology === 'scrum' ? 'amber' : 'default'} size="xs">{plan.methodology.toUpperCase()}</Chip>
                <Readout variant="status" size="xs">{new Date(plan.savedAt).toLocaleDateString()}</Readout>
              </div>
            </div>
            <IconButton size="sm" variant="ghost" aria-label="Delete plan" onClick={e => { e.stopPropagation(); handleDelete(plan.id) }} style={{ color: 'var(--coral)' }}>×</IconButton>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>
            {plan.plan.groups.length} {plan.methodology === 'scrum' ? 'sprints' : 'columns'} · {plan.plan.epics.length} epics · {plan.plan.groups.flatMap(g => g.stories).length} stories
          </div>
          {renderThumbnail(plan.plan)}
          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--grid-line)' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Readout variant="status" size="xs">{getDonePoints(plan.plan)}/{getTotalPoints(plan.plan)} pts</Readout>
              <Readout variant="metric" size="xs" style={{ color: getProgressColor(plan.plan) }}>
                {getProgressPct(plan.plan)}% done
              </Readout>
            </div>
            <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); handleOpen(plan.id) }}>Open</Button>
          </div>
        </Panel>
      ))}
    </div>
  )

  const ListView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {filteredPlans.map(plan => (
        <Panel key={plan.id} variant="paper" chamfered={true} bordered={true} style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, cursor: 'pointer' }} onClick={() => handleOpen(plan.id)}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{plan.projectName || 'Untitled'}</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem', fontSize: '0.65rem' }}>
              <Chip variant={plan.methodology === 'scrum' ? 'amber' : 'default'} size="xs">{plan.methodology.toUpperCase()}</Chip>
              <Readout variant="status" size="xs">{new Date(plan.savedAt).toLocaleDateString()}</Readout>
              <Readout variant="status" size="xs">{plan.plan.groups.length} {plan.methodology === 'scrum' ? 'sprints' : 'columns'}</Readout>
              <Readout variant="status" size="xs">{plan.plan.epics.length} epics</Readout>
              <Readout variant="status" size="xs">{plan.plan.groups.flatMap(g => g.stories).length} stories</Readout>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Readout variant="status" size="xs">{getDonePoints(plan.plan)}/{getTotalPoints(plan.plan)} pts</Readout>
            <Readout variant="metric" size="xs" style={{ color: getProgressColor(plan.plan) }}>
              {getProgressPct(plan.plan)}% done
            </Readout>
            <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); handleOpen(plan.id) }}>Open</Button>
            <IconButton size="sm" variant="danger" aria-label="Delete plan" onClick={e => { e.stopPropagation(); handleDelete(plan.id) }} style={{ color: 'var(--coral)' }}>×</IconButton>
          </div>
        </Panel>
      ))}
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <Readout variant="label" size="xs" style={{ marginBottom: '0.25rem', display: 'block' }}>ARCHIVE — SAVED PLANS</Readout>
          <Readout variant="status" size="sm">{filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''}</Readout>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Input
            placeholder="Search plans…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            size="sm"
            leftElement={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="5" /><path d="M10 10l4 4" /></svg>}
            style={{ minWidth: 220 }}
          />
          <Tabs tabs={viewTabs} activeTab={viewMode} onChange={id => setViewMode(id as 'grid' | 'list')} variant="enclosed" />
          <div style={{ display: 'flex', gap: '0.25rem' }} role="group" aria-label="Sort by">
            {(['updated', 'name'] as const).map(s => (
              <Chip key={s} variant={sortBy === s ? 'amber' : 'outline'} size="xs" onClick={() => setSortBy(s)}>
                {s === 'updated' ? 'Updated' : 'Name'}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {filteredPlans.length === 0 ? (
        <Panel variant="paper" chamfered={true} bordered={true} style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <Readout variant="label" size="sm" style={{ display: 'block', marginBottom: '1rem' }}>NO SAVED PLANS</Readout>
          <Readout variant="status" size="md" style={{ display: 'block', marginBottom: '1.5rem' }}>Generate your first plan from the spec sheet</Readout>
          <Button variant="primary" onClick={() => navigate('/new')} size="lg">Draft a plan</Button>
        </Panel>
      ) : (
        viewMode === 'grid' ? <GridView /> : <ListView />
      )}
    </div>
  )
}