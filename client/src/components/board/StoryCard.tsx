import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Story } from '@/types/plan'
import { Button, Checkbox, Chip, IconButton, Input, Textarea } from '@/components/primitives'
import { ArrowRight, Check, Maximize2, Pencil, Trash2 } from 'lucide-react'

interface StoryCardProps {
  story: Story
  epicName?: string
  epicIndex: number
  onEdit: (field: string, value: any) => void
  onDelete: () => void
  onCyclePoints: () => void
  onToggleDone: () => void
  onMoveToDone?: () => void
  onOpen?: () => void
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
  story, epicName, onEdit, onDelete, onCyclePoints, onToggleDone, onMoveToDone, onOpen, isDoneColumn, selected, onToggleSelect, dimmed,
}) => {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(story.title)
  const [editCriteria, setEditCriteria] = useState(getCrit(story.criteria).join('\n'))
  const [hover, setHover] = useState(false)
  const critList = getCrit(story.criteria)

  const { setNodeRef, attributes, listeners, isDragging, transform, transition } = useSortable({ id: story.id, disabled: editing })

  const stopDrag = (e: React.SyntheticEvent) => { e.stopPropagation() }
  const handleSave = () => {
    if (editTitle.trim()) onEdit('title', editTitle.trim())
    const crits = editCriteria.split('\n').map(s => s.trim()).filter(Boolean)
    onEdit('criteria', crits.length ? crits : story.criteria)
    setEditing(false)
  }

  const lift = hover && !isDragging && !editing ? ' translateY(-1px)' : ''
  const style: React.CSSProperties = {
    background: 'var(--surface)',
    border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-md)',
    boxShadow: selected ? '0 0 0 3px var(--primary-soft)' : hover ? 'var(--shadow-2)' : 'var(--shadow-1)',
    padding: '12px',
    marginBottom: 8,
    opacity: dimmed ? 0.3 : isDragging ? 0.4 : 1,
    transform: `${CSS.Transform.toString(transform)}${lift}`,
    transition: transition || 'box-shadow var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)',
    cursor: editing ? 'default' : 'grab',
    position: 'relative',
  }

  const startEdit = () => {
    setEditTitle(story.title)
    setEditCriteria(getCrit(story.criteria).join('\n'))
    setEditing(true)
  }

  return (
    <div ref={setNodeRef} style={style} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...(!editing ? listeners : {})} {...attributes} role="group">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span onPointerDown={stopDrag} style={{ display: 'inline-flex' }}>
          <Checkbox
            checked={!!selected}
            onChange={() => onToggleSelect?.()}
            aria-label={selected ? `Deselect ${story.id}` : `Select ${story.id}`}
            style={{ minHeight: 18 }}
          />
        </span>
        <span className="tnum" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mute)', letterSpacing: '0.02em' }}>{story.id}</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 2 }}>
          <IconButton size="sm" variant="ghost" aria-label={`Edit ${story.id}`} onClick={e => { e.stopPropagation(); startEdit() }} onPointerDown={stopDrag}>
            <Pencil size={14} strokeWidth={1.7} />
          </IconButton>
          <IconButton size="sm" variant="ghost" aria-label={`Open ${story.id} details`} onClick={e => { e.stopPropagation(); onOpen?.() }} onPointerDown={stopDrag}>
            <Maximize2 size={14} strokeWidth={1.7} />
          </IconButton>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label={story.done ? `Mark ${story.id} not done` : `Mark ${story.id} done`}
            aria-pressed={story.done}
            onClick={e => { e.stopPropagation(); onToggleDone() }}
            onPointerDown={stopDrag}
            style={story.done ? { color: 'var(--success)', background: 'var(--success-soft)' } : undefined}
          >
            <Check size={15} strokeWidth={2} />
          </IconButton>
          <IconButton size="sm" variant="ghost" aria-label={`Delete ${story.id}`} onClick={e => { e.stopPropagation(); onDelete() }} onPointerDown={stopDrag} style={{ color: 'var(--muted)' }}>
            <Trash2 size={14} strokeWidth={1.7} />
          </IconButton>
        </span>
      </div>

      {editing ? (
        <div onPointerDown={stopDrag}>
          <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" autoFocus size="sm" style={{ marginBottom: 8 }} />
          <Textarea value={editCriteria} onChange={e => setEditCriteria(e.target.value)} placeholder="One acceptance criterion per line" size="sm" style={{ marginBottom: 8, minHeight: 72 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" onClick={e => { e.stopPropagation(); handleSave() }} style={{ flex: 1 }}>Save</Button>
            <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setEditing(false) }} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div onDoubleClick={startEdit} style={{ cursor: 'text' }}>
          <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 6, textDecoration: story.done ? 'line-through' : 'none', color: story.done ? 'var(--muted)' : 'var(--ink)' }}>
            {story.title}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {critList.slice(0, 2).map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--border-strong)', marginTop: 7, flexShrink: 0 }} />
                <span>{c}</span>
              </div>
            ))}
            {critList.length > 2 && (
              <span style={{ fontSize: 12, color: 'var(--ink-mute)', paddingLeft: 11 }}>
                +{critList.length - 2} more criteria
              </span>
            )}
            {story.depends_on.length > 0 && (
              <span style={{ fontSize: 12, color: 'var(--ink-mute)', paddingLeft: 11 }}>
                Needs {story.depends_on.join(', ')}
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip variant="outline" size="xs">
          {epicName || 'No epic'}
          {story.epic_id && <span style={{ fontWeight: 600, color: 'var(--ink-mute)' }}>{story.epic_id}</span>}
        </Chip>
        {story.priority && <Chip variant="neutral" size="xs">{story.priority}</Chip>}
        {story.done && <Chip variant="success" size="xs">Done</Chip>}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onCyclePoints() }}
          onPointerDown={stopDrag}
          aria-label={`Story points: ${story.points ?? 'none'}. Change points`}
          style={{
            marginLeft: 'auto',
            height: 18,
            padding: '0 6px',
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            color: story.points ? 'var(--ink)' : 'var(--ink-mute)',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          {story.points ? `${story.points} pts` : 'pts —'}
        </button>
        {!isDoneColumn && onMoveToDone && (
          <IconButton size="sm" variant="ghost" aria-label="Move to Done" tooltip="Move to Done" onClick={e => { e.stopPropagation(); onMoveToDone() }} onPointerDown={stopDrag}>
            <ArrowRight size={14} strokeWidth={1.7} />
          </IconButton>
        )}
      </div>
    </div>
  )
}
