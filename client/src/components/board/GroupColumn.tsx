import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Group, Story, Epic } from '@/types/plan'
import { StoryCard } from './StoryCard'
import { Panel } from '@/components/primitives'
import { Button } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { Chip } from '@/components/primitives'
import { Input } from '@/components/primitives'
import { Select } from '@/components/primitives'
import { Textarea } from '@/components/primitives'

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
  selectedIds?: Set<string>
  onToggleSelect?: (id: string) => void
  matchesSearch?: (story: Story, epicName?: string) => boolean
}

const epicColors = ['var(--amber)', 'var(--coral)', 'var(--teal)', 'var(--violet)', 'var(--sage)'] as const

export const GroupColumn: React.FC<GroupColumnProps> = ({
  group, groupIndex, epics, doneColumnIndex, onEditStory, onDeleteStory, onCyclePoints, onToggleDone, onAddStory, onMoveToDone, onRenameGroup, onDeleteGroup, selectedIds, onToggleSelect, matchesSearch,
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
  const { attributes: colAttrs, listeners: colListeners, setNodeRef: setColRef, transform: colTransform, isDragging: colDragging, transition: colTransition } = useSortable({ id: `group-${groupIndex}` })

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

  return (
    <div
      ref={setColRef}
      style={{
        minWidth: 300,
        maxWidth: 340,
        background: isOver ? 'var(--surface-alt)' : 'var(--surface)',
        border: `1px solid ${isOver || colDragging ? 'var(--amber)' : 'var(--grid-line)'}`,
        clipPath: 'polygon(0 0, calc(100% - var(--chamfer)) 0, 100% var(--chamfer), 100% 100%, 0 100%)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        opacity: colDragging ? 0.45 : 1,
        transform: CSS.Transform.toString(colTransform),
        transition: colTransition || 'background 0.12s, border-color 0.12s',
      }}
    >
      <div style={{ padding: 'var(--card-padding)', borderBottom: '1px solid var(--grid-line)', background: 'var(--surface-alt)' }}>
        {isKanban ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span {...colAttrs} {...colListeners} title="Drag to reorder column" style={{ cursor: 'grab', fontSize: '0.62rem', color: 'var(--fog)', padding: '2px 4px', border: '1px solid transparent', userSelect: 'none' }}>⋮⋮</span>
            {editingName ? (
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditingName(false) }}
                style={{ flex: 1, minWidth: 120, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.9rem', padding: '2px 6px', border: '1px solid var(--grid-line)', background: 'var(--paper)', color: 'var(--ink)', outline: 'none' }}
              />
            ) : (
              <span onDoubleClick={() => { setEditName(group.name); setEditingName(true) }} title="Double-click to rename" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: 'var(--bright)', fontSize: '0.95rem', letterSpacing: '0.02em', cursor: 'text', borderBottom: '1px dashed transparent' }}>{group.name}</span>
            )}
            {group.wip_limit !== null && (
              <Chip
                variant={wipExceeded ? 'coral' : 'outline'}
                size="sm"
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem' }}
              >
                WIP {group.wip_limit} · {group.stories.length}
              </Chip>
            )}
            <Readout variant="status" size="xs">
              {group.stories.length} · {donePoints}/{totalPoints} pts
            </Readout>
            <Button variant="danger" size="sm" onClick={() => onDeleteGroup(groupIndex)} style={{ marginLeft: 'auto', padding: '2px 6px', fontSize: '0.65rem' }}>
              ×
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span {...colAttrs} {...colListeners} title="Drag to reorder sprint" style={{ cursor: 'grab', fontSize: '0.62rem', color: 'var(--fog)', padding: '2px 4px', userSelect: 'none' }}>⋮⋮</span>
            <Readout variant="metric" size="lg" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.9rem', lineHeight: 1, color: 'var(--bright)' }}>
              {String(group.number).padStart(2, '0')}
            </Readout>
            <div style={{ flex: 1, minWidth: 0 }}>
              {editingName ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditingName(false) }}
                  style={{ width: '100%', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.88rem', padding: '2px 6px', border: '1px solid var(--grid-line)', background: 'var(--paper)', color: 'var(--ink)', outline: 'none' }}
                />
              ) : (
                <div onDoubleClick={() => { setEditName(group.name); setEditingName(true) }} title="Double-click to rename" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: 'var(--bright)', fontSize: '0.88rem', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'text', borderBottom: '1px dashed transparent' }}>{group.name}</div>
              )}
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'var(--fog)', letterSpacing: '0.06em', display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
                <span>{group.stories.length} STORIES · {donePoints}/{totalPoints} PTS</span>
                {totalPoints > 0 && (
                  <Readout variant={progressPct === 100 ? 'status' : 'metric'} size="xs" style={{ color: progressPct === 100 ? 'var(--green)' : 'var(--amber)' }}>
                    {progressPct}% goal
                  </Readout>
                )}
                <Button variant="danger" size="sm" onClick={() => onDeleteGroup(groupIndex)} style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                  ×
                </Button>
              </div>
            </div>
          </div>
        )}
        {group.type === 'sprint' && group.goal && (
          <div style={{ fontSize: '0.72rem', color: 'var(--fog)', marginTop: '0.45rem', lineHeight: 1.4 }}>
            {group.goal}
          </div>
        )}
      </div>

      <SortableContext items={group.stories.map(s => s.id)} strategy={verticalListSortingStrategy}>
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '60vh', padding: 'var(--card-padding)', background: isOver ? 'rgba(201,138,52,0.06)' : 'var(--surface)', minHeight: 80 }}>
          {group.stories.map((story) => {
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
                isDoneColumn={isDoneColumn}
                selected={!!selectedIds?.has(story.id)}
                onToggleSelect={onToggleSelect ? () => onToggleSelect(story.id) : undefined}
                dimmed={isFilteredOut}
              />
            )
          })}
          {matchesSearch && group.stories.filter(s => matchesSearch(s, epics.find(e => e.id === s.epic_id)?.name)).length === 0 && group.stories.length > 0 && (
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'var(--fog)', textAlign: 'center', padding: '0.6rem 0' }}>No matches in this column</div>
          )}
          {group.stories.length === 0 && (
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: isOver ? 'var(--amber)' : 'var(--fog)', textAlign: 'center', padding: '1.6rem 0', border: `1px dashed ${isOver ? 'var(--amber)' : 'var(--grid-line)'}`, background: isOver ? 'rgba(201,138,52,0.08)' : 'transparent' }}>
              {isOver ? 'DROP HERE — ' : ''}{isDoneColumn ? 'DONE — drag here' : 'NO STORIES — drop here'}
            </div>
          )}
        </div>
      </SortableContext>

      <div style={{ padding: 'var(--card-padding)', borderTop: '1px solid var(--grid-line)', background: 'var(--surface-alt)' }}>
        {showAddForm ? (
          <Panel variant="paper" chamfered={true} bordered={true} style={{ padding: '0.6rem' }}>
            <Input
              placeholder="Title *"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
              size="sm"
              style={{ marginBottom: '0.35rem' }}
            />
            <Textarea
              placeholder="Acceptance criteria — one per line"
              value={newCriteria}
              onChange={e => setNewCriteria(e.target.value)}
              rows={3}
              size="sm"
              style={{ marginBottom: '0.35rem' }}
            />
            <Select
              options={epics.map(e => ({ value: e.id, label: e.name }))}
              value={newEpic}
              onChange={e => setNewEpic(e.target.value)}
              size="sm"
              style={{ marginBottom: '0.35rem' }}
            />
            <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.35rem' }}>
              <Select
                options={['High', 'Medium', 'Low'].map(v => ({ value: v, label: v }))}
                value={newPriority}
                onChange={e => setNewPriority(e.target.value)}
                size="sm"
                style={{ flex: 1 }}
              />
              <Select
                options={[{ value: '', label: 'Points —' }, { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '5', label: '5' }, { value: '8', label: '8' }]}
                value={newPoints ?? ''}
                onChange={e => setNewPoints(e.target.value ? Number(e.target.value) : null)}
                size="sm"
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <Button variant="primary" onClick={handleAdd} size="sm" style={{ flex: 1 }}>Add story</Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)} size="sm" style={{ flex: 1 }}>Cancel</Button>
            </div>
          </Panel>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setShowAddForm(true)} fullWidth style={{ borderStyle: 'dashed', background: 'transparent', color: 'var(--fog)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.06em' }}>
            + ADD STORY
          </Button>
        )}
      </div>
    </div>
  )
}