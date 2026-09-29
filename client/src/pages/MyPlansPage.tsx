import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen, LayoutGrid, List, Search, SearchX, Trash2 } from 'lucide-react'
import { usePlansRepository } from '@/hooks/usePlansRepository'
import { Panel, Button, Input, Chip, Progress, IconButton, Tabs, Select, EmptyState } from '@/components/primitives'
import type { Tab } from '@/components/primitives'
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

  const getProgressPct = (plan: Plan) => {
    const total = getTotalPoints(plan)
    const done = getDonePoints(plan)
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  const groupName = (p: SavedPlan) => (p.methodology === 'scrum' ? 'sprints' : 'columns')

  const renderThumbnail = (plan: Plan) => {
    const sprintGroups = plan.groups.filter(g => g.type === 'sprint')
    const columnGroups = plan.groups.filter(g => g.type === 'column')
    const groups = sprintGroups.length > 0 ? sprintGroups : columnGroups

    return (
      <div aria-hidden="true" style={{ display: 'flex', gap: 6, height: 44 }}>
        {groups.slice(0, 6).map((g, i) => {
          const total = g.stories.reduce((s, st) => s + (st.points || 0), 0)
          const done = g.stories.filter(s => s.done).reduce((s, st) => s + (st.points || 0), 0)
          const pct = total > 0 ? Math.round((done / total) * 100) : 0
          return (
            <div key={i} style={{ flex: 1, background: 'var(--surface-3)', borderRadius: 'var(--radius-sm)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${pct}%`, background: pct === 100 ? 'var(--success)' : 'var(--primary)', opacity: 0.85 }} />
            </div>
          )
        })}
        {groups.length > 6 && (
          <div style={{ width: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--muted)', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
            +{groups.length - 6}
          </div>
        )}
      </div>
    )
  }

  const viewTabs: Tab[] = [
    { id: 'grid', label: 'Grid', icon: <LayoutGrid size={15} strokeWidth={1.75} /> },
    { id: 'list', label: 'List', icon: <List size={15} strokeWidth={1.75} /> },
  ]

  const deleteButton = (p: SavedPlan) => (
    <IconButton
      size="sm"
      variant="ghost"
      aria-label={`Delete ${p.projectName || 'Untitled plan'}`}
      onClick={e => { e.stopPropagation(); handleDelete(p.id) }}
    >
      <Trash2 size={15} strokeWidth={1.75} />
    </IconButton>
  )

  const progressBlock = (p: SavedPlan) => {
    const pct = getProgressPct(p.plan)
    const tone = pct === 100 ? 'success' : 'primary'
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 140, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12 }}>
          <span className="tnum" style={{ color: 'var(--muted)' }}>{getDonePoints(p.plan)} / {getTotalPoints(p.plan)} pts</span>
          <span className="tnum" style={{ color: pct === 100 ? 'var(--success-text)' : 'var(--primary-text)', fontWeight: 600 }}>{pct}%</span>
        </div>
        <Progress value={pct} tone={tone} size="sm" />
      </div>
    )
  }

  const GridView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {filteredPlans.map(p => (
        <Panel
          key={p.id}
          radius="lg"
          style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer', transition: 'border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)' }}
          onClick={() => handleOpen(p.id)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-2)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-1)'; e.currentTarget.style.transform = 'none' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.projectName || 'Untitled'}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 6 }}>
                <Chip variant={p.methodology === 'scrum' ? 'primary' : 'neutral'} size="xs">
                  {p.methodology === 'scrum' ? 'Scrum' : 'Kanban'}
                </Chip>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(p.savedAt).toLocaleDateString()}</span>
              </div>
            </div>
            {deleteButton(p)}
          </div>

          <div style={{ fontSize: 12, color: 'var(--muted)' }} className="tnum">
            {p.plan.groups.length} {groupName(p)} · {p.plan.epics.length} epics · {p.plan.groups.flatMap(g => g.stories).length} stories
          </div>

          {renderThumbnail(p.plan)}

          <div style={{ marginTop: 2, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            {progressBlock(p)}
            <Button variant="secondary" size="sm" onClick={e => { e.stopPropagation(); handleOpen(p.id) }}>Open</Button>
          </div>
        </Panel>
      ))}
    </div>
  )

  const ListView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {filteredPlans.map(p => (
        <Panel
          key={p.id}
          radius="lg"
          style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', cursor: 'pointer' }}
          onClick={() => handleOpen(p.id)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-2)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-1)' }}
        >
          <div style={{ flex: '1 1 260px', minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {p.projectName || 'Untitled'}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 6, fontSize: 12, color: 'var(--muted)' }} className="tnum">
              <Chip variant={p.methodology === 'scrum' ? 'primary' : 'neutral'} size="xs">
                {p.methodology === 'scrum' ? 'Scrum' : 'Kanban'}
              </Chip>
              <span>{new Date(p.savedAt).toLocaleDateString()}</span>
              <span>{p.plan.groups.length} {groupName(p)}</span>
              <span>{p.plan.epics.length} epics</span>
              <span>{p.plan.groups.flatMap(g => g.stories).length} stories</span>
            </div>
          </div>
          <div style={{ flex: '1 1 200px', minWidth: 160, display: 'flex' }}>{progressBlock(p)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={e => { e.stopPropagation(); handleOpen(p.id) }}>Open</Button>
            {deleteButton(p)}
          </div>
        </Panel>
      ))}
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '8px 0 32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, lineHeight: 1.2 }}>My plans</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>
            {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''}
            {filteredPlans.length !== plans.length ? ` of ${plans.length}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Input
            placeholder="Search plans…"
            aria-label="Search plans"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            size="sm"
            leftElement={<Search size={14} strokeWidth={1.75} />}
            style={{ width: 200 }}
          />
          <Select
            aria-label="Sort plans"
            size="sm"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'updated' | 'name')}
            options={[{ value: 'updated', label: 'Recently updated' }, { value: 'name', label: 'Name A–Z' }]}
            style={{ width: 168 }}
          />
          <Tabs tabs={viewTabs} activeTab={viewMode} onChange={id => setViewMode(id as 'grid' | 'list')} variant="segmented" />
        </div>
      </div>

      {filteredPlans.length === 0 ? (
        <Panel radius="lg" style={{ padding: '8px 16px' }}>
          {plans.length === 0 ? (
            <EmptyState
              icon={<FolderOpen size={20} strokeWidth={1.75} />}
              title="No saved plans yet"
              description="Describe an app and Rune drafts a delivery plan you can edit, refine and reopen here."
              action={<Button variant="primary" size="md" onClick={() => navigate('/new')}>Create a plan</Button>}
            />
          ) : (
            <EmptyState
              icon={<SearchX size={20} strokeWidth={1.75} />}
              title="No matching plans"
              description={`Nothing matches “${searchQuery}”.`}
              action={<Button variant="secondary" size="md" onClick={() => setSearchQuery('')}>Clear search</Button>}
            />
          )}
        </Panel>
      ) : (
        viewMode === 'grid' ? <GridView /> : <ListView />
      )}
    </div>
  )
}
