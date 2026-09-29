import React, { useEffect, useState } from 'react'
import { Epic, Story } from '@/types/plan'
import { Button, Chip, Drawer, Input, Select, Switch, Textarea } from '@/components/primitives'

export interface StoryLocation {
  groupIndex: number
  storyId: string
}

interface StoryDrawerProps {
  story?: Story | null
  groupLabel?: string
  epics: Epic[]
  isOpen: boolean
  onClose: () => void
  onEdit: (field: string, value: any) => void
  onToggleDone: () => void
  onDelete: () => void
}

const getCrit = (criteria: any): string[] => {
  if (Array.isArray(criteria)) return criteria
  if (typeof criteria === 'string') {
    try {
      const p = JSON.parse(criteria)
      return Array.isArray(p) ? p : [String(criteria)]
    } catch {
      return [String(criteria)]
    }
  }
  return []
}

export const StoryDrawer: React.FC<StoryDrawerProps> = ({
  story,
  groupLabel,
  epics,
  isOpen,
  onClose,
  onEdit,
  onToggleDone,
  onDelete,
}) => {
  const [title, setTitle] = useState('')
  const [criteria, setCriteria] = useState('')

  const storyId = story?.id
  useEffect(() => {
    if (!story) return
    setTitle(story.title)
    setCriteria(getCrit(story.criteria).join('\n'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId])

  if (!story) return null

  const commitTitle = () => {
    if (title.trim() && title.trim() !== story.title) onEdit('title', title.trim())
    else setTitle(story.title)
  }

  const commitCriteria = () => {
    const crits = criteria
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
    const current = getCrit(story.criteria)
    if (crits.join('|') !== current.join('|')) {
      onEdit('criteria', crits.length ? crits : ['No acceptance criteria yet'])
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width={420}
      title={story.id}
      description={groupLabel || 'Story details'}
      footer={
        <>
          <Button variant="ghost" onClick={onDelete} style={{ color: 'var(--danger-text)', marginRight: 'auto' }}>
            Delete story
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label htmlFor="story-title" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>
            Title
          </label>
          <Input
            id="story-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={e => {
              if (e.key === 'Enter') commitTitle()
            }}
          />
        </div>

        <div>
          <label htmlFor="story-criteria" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>
            Acceptance criteria
          </label>
          <Textarea
            id="story-criteria"
            value={criteria}
            onChange={e => setCriteria(e.target.value)}
            onBlur={commitCriteria}
            rows={6}
            hint="One criterion per line. Saved when you leave the field."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select
            label="Epic"
            value={story.epic_id}
            options={
              epics.length
                ? epics.map(e => ({ value: e.id, label: `${e.name} (${e.id})` }))
                : [{ value: '', label: 'No epics' }]
            }
            onChange={e => onEdit('epic_id', e.target.value)}
          />
          <Select
            label="Priority"
            value={story.priority}
            options={['High', 'Medium', 'Low'].map(v => ({ value: v, label: v }))}
            onChange={e => onEdit('priority', e.target.value)}
          />
          <Select
            label="Points"
            value={story.points == null ? '' : String(story.points)}
            options={[
              { value: '', label: 'Unestimated' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '5', label: '5' },
              { value: '8', label: '8' },
            ]}
            onChange={e => onEdit('points', e.target.value ? Number(e.target.value) : null)}
          />
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>Status</span>
            <div style={{ height: 38, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Switch checked={story.done} onChange={onToggleDone} />
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{story.done ? 'Done' : 'In progress'}</span>
            </div>
          </div>
        </div>

        <div>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>Tags</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Chip variant="outline" size="sm">
              {epics.find(e => e.id === story.epic_id)?.name || 'No epic'}
              <span style={{ fontWeight: 600, color: 'var(--ink-mute)' }}>{story.epic_id}</span>
            </Chip>
            <Chip variant="neutral" size="sm">{story.priority}</Chip>
            {story.done && <Chip variant="success" size="sm">Done</Chip>}
            <Chip variant="neutral" size="sm" className="tnum">
              {story.points != null ? `${story.points} pts` : 'No points'}
            </Chip>
          </div>
        </div>

        {story.depends_on.length > 0 && (
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            <span style={{ fontWeight: 500, color: 'var(--ink)' }}>Depends on: </span>
            {story.depends_on.join(', ')}
          </div>
        )}
      </div>
    </Drawer>
  )
}
