import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Group, Story, Epic } from '@/types/plan'
import { StoryCard } from './StoryCard'
import { Button, Chip, IconButton, Input, Panel, Progress, Select, Textarea } from '@/components/primitives'
import { GripVertical, Plus, X } from 'lucide-react'

interface GroupColumnProps {
  group: Group
  groupIndex: number
  epics: Epic[]
  doneColumnIndex: number | null
  onEditStory: (groupIndex: number, storyId: string, field: string, value: any) => void
  onDeleteStory: (groupIndex: number, storyId: string) => void
  onCyclePoints: (groupIndex: number, story: Story) => void
  onToggleDone: (groupIndex: number, storyId: string) => void
  onAddStory: (groupIndex: number, data?: { title: string; epicId: string; priority: string; points: number | null; criteria: string[] }) => void
  onMoveToDone: (fromIndex: number, storyId: string) => void
  onRenameGroup: (groupIndex: number, name: string) => void
  onDeleteGroup: (groupIndex: number) => void
  onOpenStory?: (groupIndex: number, storyId: string) => void
  selectedIds?: Set<string>
  onToggleSelect?: (id: string) => void
  matchesSearch?: (story: Story, epicName?: string) => boolean
}

export const GroupColumn: React.FC<GroupColumnProps> = ({
  group,
  groupIndex,
  epics,
  doneColumnIndex,
  onEditStory,
  onDeleteStory,
  onCyclePoints,
  onToggleDone,
  onAddStory,
  onMoveToDone,
  onRenameGroup,
  onDeleteGroup,
  onOpenStory,
  selectedIds,
  onToggleSelect,
  matchesSearch,
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newEpic, setNewEpic] = useState(epics[0]?.id || '')
  const [newPriority, setNewPriority] = useState('Medium')
  const [newPoints, setNewPoints] = useState<number | null>(null)
  const [newCriteria, setNewCriteria] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [editName, setEditName] = useState(group.name)

  const isKanban = group.type === 'column'
  const isDoneColumn = doneColumnIndex === groupIndex
  const wipLimit = isKanban ? group.wip_limit : null
  const wipExceeded = wipLimit !== null && group.stories.length > wipLimit

  const { setNodeRef, isOver } = useDroppable({ id: `column-${groupIndex}` })
  const { attributes: colAttrs, listeners: colListeners, setNodeRef: setColRef, transform: colTransform, isDragging: colDragging, transition: colTransition } = useSortable({
    id: `group-${groupIndex}`,
  })

  const handleAdd = () => {
    if (!newTitle.trim()) return
    const criteria = newCriteria.split('\n').map(s => s.trim()).filter(Boolean)
    onAddStory(groupIndex, {
      title: newTitle.trim(),
      epicId: newEpic || epics[0]?.id || '',
      priority: newPriority,
      points: newPoints,
      criteria: criteria.length ? criteria : ['Acceptance criterion 1', 'Acceptance criterion 2'],
    })
    setNewTitle('')
    setNewCriteria('')
    setShowAddForm(false)
  }

  const handleRename = () => {
    if (editName.trim() && editName.trim() !== group.name) onRenameGroup(groupIndex, editName.trim())
    setEditingName(false)
  }

  const totalPoints = group.stories.reduce((s, st) => s + (st.points || 0), 0)
  const donePoints = group.stories.filter(s => s.done).reduce((s, st) => s + (st.points || 0), 0)
  const progressPct = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0

  const nameInput = (
    <input
      autoFocus
      value={editName}
      onChange={e => setEditName(e.target.value)}
      onBlur={handleRename}
      onKeyDown={e => {
        if (e.key === 'Enter') handleRename()
        if (e.key === 'Escape') setEditingName(false)
      }}
      style={{
        width: '100%',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: 14,
        padding: '3px 6px',
        border: '1px solid var(--primary)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface)',
        color: 'var(--ink)',
        outline: 'none',
      }}
    />
  )

  return (
    <div
      ref={setColRef}
      style={{
        width: 328,
        minWidth: 328,
        background: isOver ? 'var(--primary-soft)' : 'var(--surface-2)',
        border: `1px solid ${isOver || colDragging ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        opacity: colDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(colTransform),
        transition: colTransition || 'background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)',
      }}
    >
      <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <span
            {...colAttrs}
            {...colListeners}
            title="Drag to reorder"
            style={{ cursor: 'grab', color: 'var(--ink-mute)', display: 'inline-flex', padding: 2, userSelect: 'none', marginTop: 2 }}
          >
            <GripVertical size={15} strokeWidth={1.7} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingName ? (
              nameInput
            ) : (
              <div
                onDoubleClick={() => {
                  setEditName(group.name)
                  setEditingName(true)
                }}
                title="Double-click to rename"
                style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', lineHeight: 1.3, cursor: 'text', overflowWrap: 'anywhere' }}
              >
                {isKanban ? group.name : `Sprint ${group.number} — ${group.name}`}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <span className="tnum" style={{ fontSize: 12, color: 'var(--muted)' }}>
                {group.stories.length} {group.stories.length === 1 ? 'story' : 'stories'} · {donePoints}/{totalPoints} pts
              </span>
              {wipLimit !== null && <Chip variant={wipExceeded ? 'warning' : 'outline'} size="xs">WIP {group.stories.length}/{wipLimit}</Chip>}
              {totalPoints > 0 && <span className="tnum" style={{ fontSize: 12, color: 'var(--muted)' }}>{progressPct}%</span>}
            </div>
            {group.type === 'sprint' && group.goal && (
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.4 }}>{group.goal}</div>
            )}
          </div>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label={`Delete ${isKanban ? 'column' : 'sprint'} ${group.name}`}
            tooltip={isKanban ? 'Delete column' : 'Delete sprint'}
            onClick={() => onDeleteGroup(groupIndex)}
            style={{ color: 'var(--muted)' }}
          >
            <X size={15} strokeWidth={1.7} />
          </IconButton>
        </div>
        {totalPoints > 0 && (
          <Progress value={progressPct} size="sm" tone={progressPct === 100 ? 'success' : 'primary'} style={{ marginTop: 8 }} />
        )}
      </div>

      <SortableContext items={group.stories.map(s => s.id)} strategy={verticalListSortingStrategy}>
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '60vh', padding: 12, minHeight: 80 }}>
          {group.stories.map(story => {
            const epicIndex = epics.findIndex(e => e.id === story.epic_id)
            const epicName = epics[epicIndex >= 0 ? epicIndex : 0]?.name
            const isFilteredOut = matchesSearch ? !matchesSearch(story, epicName) : false
            return (
              <StoryCard
                key={story.id}
                story={story}
                epicName={epicName}
                epicIndex={epicIndex >= 0 ? epicIndex : 0}
                onEdit={(field, value) => onEditStory(groupIndex, story.id, field, value)}
                onDelete={() => onDeleteStory(groupIndex, story.id)}
                onCyclePoints={() => onCyclePoints(groupIndex, story)}
                onToggleDone={() => onToggleDone(groupIndex, story.id)}
                onMoveToDone={doneColumnIndex !== null && !isDoneColumn ? () => onMoveToDone(groupIndex, story.id) : undefined}
                onOpen={onOpenStory ? () => onOpenStory(groupIndex, story.id) : undefined}
                isDoneColumn={isDoneColumn}
                selected={!!selectedIds?.has(story.id)}
                onToggleSelect={onToggleSelect ? () => onToggleSelect(story.id) : undefined}
                dimmed={isFilteredOut}
              />
            )
          })}
          {matchesSearch && group.stories.length > 0 && group.stories.filter(s => matchesSearch(s, epics.find(e => e.id === s.epic_id)?.name)).length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: '12px 0' }}>No matching stories</div>
          )}
          {group.stories.length === 0 && (
            <div
              style={{
                fontSize: 13,
                color: isOver ? 'var(--primary-text)' : 'var(--muted)',
                textAlign: 'center',
                padding: '20px 8px',
                border: `1px dashed ${isOver ? 'var(--primary)' : 'var(--border-strong)'}`,
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
              }}
            >
              {isOver ? 'Drop here' : isDoneColumn ? 'Done stories land here' : 'No stories yet'}
            </div>
          )}
        </div>
      </SortableContext>

      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        {showAddForm ? (
          <Panel variant="surface" radius="md" style={{ padding: 10 }}>
            <Input placeholder="Story title *" value={newTitle} onChange={e => setNewTitle(e.target.value)} autoFocus size="sm" style={{ marginBottom: 6 }} />
            <Textarea placeholder="Acceptance criteria — one per line" value={newCriteria} onChange={e => setNewCriteria(e.target.value)} rows={3} size="sm" style={{ marginBottom: 6 }} />
            <Select options={epics.map(e => ({ value: e.id, label: e.name }))} value={newEpic} onChange={e => setNewEpic(e.target.value)} size="sm" style={{ marginBottom: 6 }} />
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <Select
                options={['High', 'Medium', 'Low'].map(v => ({ value: v, label: v }))}
                value={newPriority}
                onChange={e => setNewPriority(e.target.value)}
                size="sm"
                style={{ flex: 1 }}
              />
              <Select
                options={[
                  { value: '', label: 'Points —' },
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '5', label: '5' },
                  { value: '8', label: '8' },
                ]}
                value={newPoints ?? ''}
                onChange={e => setNewPoints(e.target.value ? Number(e.target.value) : null)}
                size="sm"
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button variant="primary" onClick={handleAdd} size="sm" style={{ flex: 1 }}>
                Add story
              </Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)} size="sm" style={{ flex: 1 }}>
                Cancel
              </Button>
            </div>
          </Panel>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddForm(true)}
            fullWidth
            leftIcon={<Plus size={15} strokeWidth={1.7} />}
          >
            Add story
          </Button>
        )}
      </div>
    </div>
  )
}
