import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Story } from '@/types/plan'
import { Panel } from '@/components/primitives'
import { Button } from '@/components/primitives'
import { IconButton } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { Chip } from '@/components/primitives'
import { Input } from '@/components/primitives'
import { Textarea } from '@/components/primitives'

const epicColors = ['var(--amber)', 'var(--coral)', 'var(--teal)', 'var(--violet)', 'var(--sage)'] as const

interface StoryCardProps {
  story: Story
  epicName?: string
  epicIndex: number
  onEdit: (field: string, value: any) => void
  onDelete: () => void
  onCyclePoints: () => void
  onToggleDone: () => void
  onMoveToDone?: () => void
  isDoneColumn?: boolean
  selected?: boolean
  onToggleSelect?: () => void
  dimmed?: boolean
}

const getCrit = (criteria: any): string[] => {
  if (Array.isArray(criteria)) return criteria
  if (typeof criteria === 'string') {
    try { const p = JSON.parse(criteria); return Array.isArray(p) ? p : [String(criteria)] }
    catch { return [String(criteria)] }
  }
  return []
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story, epicName, epicIndex, onEdit, onDelete, onCyclePoints, onToggleDone, onMoveToDone, isDoneColumn, selected, onToggleSelect, dimmed,
}) => {
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [editTitle, setEditTitle] = useState(story.title)
  const [editCriteria, setEditCriteria] = useState(getCrit(story.criteria).join('\n'))
  const [hover, setHover] = useState(false)
  const borderColor = epicColors[epicIndex % epicColors.length]
  const critList = getCrit(story.criteria)

  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
  } = useSortable({ id: story.id, disabled: editing })

  const stopDrag = (e: React.SyntheticEvent) => e.stopPropagation()

  const handleSave = () => {
    if (editTitle.trim()) onEdit('title', editTitle.trim())
    const crits = editCriteria.split('\n').map(s => s.trim()).filter(Boolean)
    onEdit('criteria', crits.length ? crits : story.criteria)
    setEditing(false)
  }

  const style: React.CSSProperties = {
    background: selected ? 'rgba(201,138,52,0.08)' : 'var(--paper)',
    color: 'var(--ink)',
    border: `1px solid ${selected ? 'var(--amber)' : 'var(--grid-line)'}`,
    borderLeft: `3px solid ${borderColor}`,
    clipPath: 'polygon(0 0, calc(100% - var(--chamfer)) 0, 100% var(--chamfer), 100% 100%, 0 100%)',
    padding: 'var(--card-padding)',
    marginBottom: 'var(--gap-sm)',
    opacity: dimmed ? 0.28 : isDragging ? 0.25 : story.done ? 0.55 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    fontSize: 'var(--font-size-base)',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...(!editing ? listeners : {})}
      {...attributes}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label={selected ? 'Deselect (bulk)' : 'Select for bulk'}
            aria-pressed={!!selected}
            onClick={e => { e.stopPropagation(); onToggleSelect?.() }}
            onPointerDown={stopDrag}
            style={{ width: '22px', height: '22px', fontSize: '0.55rem', color: selected ? 'var(--amber)' : 'var(--ink-soft)', background: selected ? 'rgba(201,138,52,0.1)' : 'transparent', borderColor: selected ? 'var(--amber)' : 'var(--grid-line)' }}
          >
            {selected ? '✓' : '☐'}
          </IconButton>
          <span style={{ fontSize: '0.55rem', opacity: 0.5, cursor: 'grab', userSelect: 'none' }} title="Drag">⠿</span>
          <Readout variant="status" size="xs">{story.id}</Readout>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <IconButton
            size="sm"
            variant={editing ? 'primary' : 'ghost'}
            aria-label={editing ? 'Save' : 'Edit'}
            onClick={e => { e.stopPropagation(); if (editing) handleSave(); else { setEditTitle(story.title); setEditCriteria(getCrit(story.criteria).join('\n')); setEditing(true) } }}
            onPointerDown={stopDrag}
          >
            {editing ? '✓' : '✎'}
          </IconButton>
          <IconButton
            size="sm"
            variant={story.points !== null && story.points !== undefined ? 'primary' : 'ghost'}
            aria-label="Cycle points"
            onClick={e => { e.stopPropagation(); onCyclePoints() }}
            onPointerDown={stopDrag}
            style={{ width: '28px', height: '28px', clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
          >
            {story.points ?? '·'}
          </IconButton>
          <IconButton
            size="sm"
            variant={expanded ? 'ghost' : 'primary'}
            aria-label={expanded ? 'Minimize' : 'Expand — bigger view'}
            onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
            onPointerDown={stopDrag}
            style={{ width: '30px', height: '30px' }}
          >
            {expanded ? '−' : '⛶'}
          </IconButton>
          <IconButton
            size="sm"
            variant={story.done ? 'primary' : 'ghost'}
            aria-label={story.done ? 'Mark undone' : 'Mark done'}
            onClick={e => { e.stopPropagation(); onToggleDone() }}
            onPointerDown={stopDrag}
            style={{ width: '24px', height: '24px', borderRadius: '50%', clipPath: 'none', color: story.done ? '#fff' : 'var(--ink-soft)', background: story.done ? 'var(--green)' : 'transparent', borderColor: story.done ? 'var(--green)' : 'var(--grid-line)' }}
          >
            {story.done ? '✓' : '○'}
          </IconButton>
          <IconButton
            size="sm"
            variant="danger"
            aria-label="Delete"
            onClick={e => { e.stopPropagation(); onDelete() }}
            onPointerDown={stopDrag}
            style={{ width: '24px', height: '24px' }}
          >
            ×
          </IconButton>
        </div>
      </div>

      <div style={{ borderTop: '1px dashed var(--grid-line)', margin: '0 -0.2rem 0.5rem', opacity: 0.6 }} />

      {editing ? (
        <div onPointerDown={stopDrag}>
          <Input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="Title"
            autoFocus
            size="sm"
            style={{ marginBottom: '0.4rem' }}
          />
          <Textarea
            value={editCriteria}
            onChange={e => setEditCriteria(e.target.value)}
            placeholder="One criterion per line"
            size="sm"
            style={{ marginBottom: '0.5rem', minHeight: '72px' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="primary" size="sm" onClick={e => { e.stopPropagation(); handleSave() }} style={{ flex: 1 }}>SAVE</Button>
            <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setEditing(false) }} style={{ flex: 1 }}>CANCEL</Button>
          </div>
        </div>
      ) : (
        <div onDoubleClick={() => { setEditTitle(story.title); setEditCriteria(getCrit(story.criteria).join('\n')); setEditing(true) }} style={{ cursor: 'text' }}>
          <div style={{ fontWeight: 600, fontSize: '0.86rem', lineHeight: 1.35, marginBottom: '0.35rem', textDecoration: story.done ? 'line-through' : 'none', color: story.done ? 'var(--ink-soft)' : 'var(--ink)' }}>
            {story.title}
          </div>
          {critList.slice(0, expanded ? 99 : 2).map((c, i) => (
            <div key={i} style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', lineHeight: 1.4, paddingLeft: '0.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>—</span>{c}
            </div>
          ))}
          {critList.length > 2 && !expanded && (
            <Readout variant="status" size="xs" style={{ marginTop: '0.35rem' }}>
              +{critList.length - 2} more — expand to see
            </Readout>
          )}
          {story.depends_on.length > 0 && (
            <Readout variant="status" size="xs" style={{ marginTop: '0.35rem', color: 'var(--ink-soft)' }}>
              needs {story.depends_on.join(', ')}
            </Readout>
          )}
        </div>
      )}

      <div style={{ marginTop: '0.55rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip variant="default" size="sm" style={{ background: borderColor, color: '#fff' }}>
          {epicName}
        </Chip>
        {story.priority && (
          <Chip variant="outline" size="sm">
            {story.priority}
          </Chip>
        )}
        {!isDoneColumn && onMoveToDone && (
          <Button
            variant="ghost"
            size="sm"
            onClick={e => { e.stopPropagation(); onMoveToDone() }}
            onPointerDown={stopDrag}
            style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.56rem', letterSpacing: '0.06em', clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}
          >
            → DONE
          </Button>
        )}
      </div>
    </div>
  )
}