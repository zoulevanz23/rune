import React from 'react'
import { Epic, Group, Plan, Story } from '@/types/plan'
import { Checkbox, Chip, EmptyState, Panel } from '@/components/primitives'
import { Table2 } from 'lucide-react'

interface TableViewProps {
  plan: Plan
  epics: Epic[]
  matchesSearch?: (story: Story, epicName?: string) => boolean
  selectedIds?: Set<string>
  onToggleSelect?: (id: string) => void
  onToggleDone?: (groupIndex: number, storyId: string) => void
  onOpenStory?: (groupIndex: number, storyId: string) => void
}

const groupLabel = (group: Group) =>
  group.type === 'sprint' ? `Sprint ${group.number}` : group.name

const th: React.CSSProperties = {
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--muted)',
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--surface)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  whiteSpace: 'nowrap',
}

export const TableView: React.FC<TableViewProps> = ({
  plan,
  epics,
  matchesSearch,
  selectedIds,
  onToggleSelect,
  onToggleDone,
  onOpenStory,
}) => {
  const rows: { groupIndex: number; story: Story; epicName?: string }[] = []
  plan.groups.forEach((group, groupIndex) => {
    group.stories.forEach(story => {
      const epicName = epics.find(e => e.id === story.epic_id)?.name
      rows.push({ groupIndex, story, epicName })
    })
  })

  const filtered = matchesSearch ? rows.filter(r => matchesSearch(r.story, r.epicName)) : rows

  if (!filtered.length) {
    return (
      <Panel radius="lg" style={{ padding: 8 }}>
        <EmptyState
          compact
          icon={<Table2 size={18} strokeWidth={1.7} />}
          title={rows.length ? 'No stories match the current filters' : 'No stories yet'}
          description={rows.length ? 'Adjust the search or filters to see more.' : 'Add a story from the board view.'}
        />
      </Panel>
    )
  }

  return (
    <Panel radius="lg" padded={false} style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ ...th, width: 44 }} aria-label="Select" />
              <th style={th}>ID</th>
              <th style={th}>Story</th>
              <th style={th}>Epic</th>
              <th style={th}>Priority</th>
              <th style={{ ...th, textAlign: 'right' }}>Points</th>
              <th style={th}>Group</th>
              <th style={{ ...th, width: 110 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ groupIndex, story, epicName }) => (
              <tr
                key={story.id}
                onClick={() => onOpenStory?.(groupIndex, story.id)}
                style={{
                  borderBottom: '1px solid var(--border)',
                  cursor: onOpenStory ? 'pointer' : 'default',
                  opacity: selectedIds?.has(story.id) ? 0.85 : 1,
                  background: selectedIds?.has(story.id) ? 'var(--primary-soft)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!selectedIds?.has(story.id)) e.currentTarget.style.background = 'var(--surface-2)'
                }}
                onMouseLeave={e => {
                  if (!selectedIds?.has(story.id)) e.currentTarget.style.background = 'transparent'
                }}
              >
                <td style={{ padding: '8px 12px' }} onClick={e => e.stopPropagation()}>
                  <Checkbox
                    checked={!!selectedIds?.has(story.id)}
                    onChange={() => onToggleSelect?.(story.id)}
                    aria-label={`Select ${story.id}`}
                    style={{ minHeight: 18 }}
                  />
                </td>
                <td className="tnum" style={{ padding: '10px 12px', fontWeight: 600, fontSize: 13, color: 'var(--ink-mute)', whiteSpace: 'nowrap' }}>
                  {story.id}
                </td>
                <td style={{ padding: '10px 12px', color: story.done ? 'var(--muted)' : 'var(--ink)', textDecoration: story.done ? 'line-through' : 'none', minWidth: 220 }}>
                  {story.title}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <Chip variant="outline" size="xs">
                    {epicName || 'No epic'}
                    <span style={{ fontWeight: 600, color: 'var(--ink-mute)' }}>{story.epic_id}</span>
                  </Chip>
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--muted)', fontSize: 13 }}>{story.priority}</td>
                <td className="tnum" style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--ink)' }}>
                  {story.points ?? '—'}
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--muted)', fontSize: 13, whiteSpace: 'nowrap' }}>
                  {groupLabel(plan.groups[groupIndex])}
                </td>
                <td style={{ padding: '8px 12px' }} onClick={e => e.stopPropagation()}>
                  {story.done ? (
                    <Chip variant="success" size="xs">Done</Chip>
                  ) : (
                    <Chip variant="neutral" size="xs">In progress</Chip>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
