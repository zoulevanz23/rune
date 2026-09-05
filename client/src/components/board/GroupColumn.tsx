import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Group, Story, Epic } from '@/types/plan'
import { StoryCard } from './StoryCard'
import { Button } from '../shared/Button'

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
}

export const GroupColumn: React.FC<GroupColumnProps> = ({
  group, groupIndex, epics, doneColumnIndex, onEditStory, onDeleteStory, onCyclePoints, onToggleDone, onAddStory, onMoveToDone, onRenameGroup, onDeleteGroup,
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

  const { setNodeRef, isOver } = useDroppable({ id: `column-${groupIndex}` })
  const { attributes: colAttrs, listeners: colListeners, setNodeRef: setColRef, transform: colTransform, isDragging: colDragging, transition: colTransition } = useSortable({ id: `group-${groupIndex}` })

  const handleAdd = () => {
    if (!newTitle.trim()) return
    const criteria = newCriteria.split('\n').map(s=>s.trim()).filter(Boolean)
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

  return (
    <div
      ref={setColRef}
      style={{
        minWidth: 300,
        maxWidth: 340,
        background: isOver ? 'var(--surface-alt)' : 'var(--surface)',
        border: `1px solid ${isOver || colDragging ? 'var(--amber)' : 'var(--grid-line)'}`,
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        opacity: colDragging ? 0.45 : 1,
        transform: CSS.Transform.toString(colTransform),
        transition: colTransition || 'background 0.12s, border-color 0.12s',
      }}
    >
      <div style={{ padding: '0.9rem 0.9rem 0.7rem', borderBottom: '1px solid var(--grid-line)', background: 'var(--surface-alt)' }}>
        {isKanban ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span {...colAttrs} {...colListeners} title="Drag to reorder column" style={{ cursor:'grab', fontSize:'0.62rem', color:'var(--fog)', padding:'2px 4px', border:'1px solid transparent', userSelect:'none' }}>⋮⋮</span>
            {editingName ? (
              <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)} onBlur={handleRename} onKeyDown={e=>{if(e.key==='Enter') handleRename(); if(e.key==='Escape') setEditingName(false)}} style={{ flex:1, minWidth:120, fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'0.9rem', padding:'2px 6px', border:'1px solid var(--grid-line)', background:'var(--paper)', color:'var(--ink)', outline:'none' }} />
            ) : (
              <span onDoubleClick={()=>{setEditName(group.name); setEditingName(true)}} title="Double-click to rename" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: 'var(--bright)', fontSize: '0.95rem', letterSpacing: '0.02em', cursor:'text', borderBottom:'1px dashed transparent' }}>{group.name}</span>
            )}
            {group.wip_limit !== null && (
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem',
                background: group.stories.length > group.wip_limit! ? 'var(--coral)' : 'transparent',
                color: group.stories.length > group.wip_limit! ? '#fff' : 'var(--fog)',
                border: `1px solid ${group.stories.length > group.wip_limit! ? 'var(--coral)' : 'var(--grid-line)'}`,
                padding: '1px 4px',
              }}>WIP {group.wip_limit}</span>
            )}
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'var(--fog)' }}>{group.stories.length} · {donePoints}/{totalPoints} pts</span>
            <button onClick={()=>onDeleteGroup(groupIndex)} title="Delete column" style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--coral)', cursor:'pointer', fontSize:'0.7rem', padding:'0 4px', opacity:0.6 }}>×</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span {...colAttrs} {...colListeners} title="Drag to reorder sprint" style={{ cursor:'grab', fontSize:'0.62rem', color:'var(--fog)', padding:'2px 4px', userSelect:'none' }}>⋮⋮</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.9rem', lineHeight: 1, color: 'var(--bright)' }}>{String(group.number).padStart(2, '0')}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              {editingName ? (
                <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)} onBlur={handleRename} onKeyDown={e=>{if(e.key==='Enter') handleRename(); if(e.key==='Escape') setEditingName(false)}} style={{ width:'100%', fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'0.88rem', padding:'2px 6px', border:'1px solid var(--grid-line)', background:'var(--paper)', color:'var(--ink)', outline:'none' }} />
              ) : (
                <div onDoubleClick={()=>{setEditName(group.name); setEditingName(true)}} title="Double-click to rename" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: 'var(--bright)', fontSize: '0.88rem', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor:'text', borderBottom:'1px dashed transparent' }}>{group.name}</div>
              )}
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'var(--fog)', letterSpacing: '0.06em', display:'flex', gap:6, alignItems:'center' }}>
                <span>{group.stories.length} STORIES · {donePoints}/{totalPoints} PTS</span>
                <button onClick={()=>onDeleteGroup(groupIndex)} title="Delete sprint" style={{ background:'none', border:'none', color:'var(--coral)', cursor:'pointer', fontSize:'0.6rem', opacity:0.6 }}>×</button>
              </div>
            </div>
          </div>
        )}
        {group.type === 'sprint' && group.goal && (
          <div style={{ fontSize: '0.72rem', color: 'var(--fog)', marginTop: '0.45rem', lineHeight: 1.4 }}>{group.goal}</div>
        )}
      </div>

      <SortableContext items={group.stories.map(s => s.id)} strategy={verticalListSortingStrategy}>
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '60vh', padding: '0.7rem', background: isOver ? 'rgba(201,138,52,0.06)' : 'var(--surface)', minHeight: 80 }}>
          {group.stories.map((story) => {
            const epicIndex = epics.findIndex(e => e.id === story.epic_id)
            return (
              <StoryCard
                key={story.id}
                story={story}
                epicName={epics[epicIndex >= 0 ? epicIndex : 0]?.name}
                epicIndex={epicIndex >= 0 ? epicIndex : 0}
                onEdit={(field, value) => onEditStory(groupIndex, story.id, field, value)}
                onDelete={() => onDeleteStory(groupIndex, story.id)}
                onCyclePoints={() => onCyclePoints(groupIndex, story)}
                onToggleDone={() => onToggleDone(groupIndex, story.id)}
                onMoveToDone={doneColumnIndex !== null && !isDoneColumn ? () => onMoveToDone(groupIndex, story.id) : undefined}
                isDoneColumn={isDoneColumn}
              />
            )
          })}
          {group.stories.length === 0 && (
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: isOver ? 'var(--amber)' : 'var(--fog)', textAlign: 'center', padding: '1.6rem 0', border: `1px dashed ${isOver ? 'var(--amber)' : 'var(--grid-line)'}`, background: isOver ? 'rgba(201,138,52,0.08)' : 'transparent' }}>{isOver ? 'DROP HERE — ' : ''}{isDoneColumn ? 'DONE — drag here' : 'NO STORIES — drop here'}</div>
          )}
        </div>
      </SortableContext>

      <div style={{ padding: '0.6rem 0.7rem', borderTop: '1px solid var(--grid-line)', background: 'var(--surface-alt)' }}>
        {showAddForm ? (
          <div style={{ background: 'var(--paper)', border: '1px solid var(--grid-line)', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)', padding: '0.6rem' }}>
            <input placeholder="Title *" value={newTitle} onChange={e => setNewTitle(e.target.value)} autoFocus style={{ width: '100%', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.8rem', padding: '0.4rem', border: '1px solid var(--grid-line)', background: '#F4EFE2', color: 'var(--ink)', marginBottom: '0.35rem', outline: 'none' }} />
            <textarea placeholder="Acceptance criteria — one per line" value={newCriteria} onChange={e=>setNewCriteria(e.target.value)} rows={3} style={{ width: '100%', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.76rem', padding: '0.4rem', border: '1px solid var(--grid-line)', background: '#F4EFE2', color: 'var(--ink)', marginBottom: '0.35rem', outline: 'none', resize:'vertical' }} />
            <select value={newEpic} onChange={e => setNewEpic(e.target.value)} style={{ width: '100%', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', padding: '0.3rem', border: '1px solid var(--grid-line)', background: '#F4EFE2', marginBottom: '0.35rem', color: 'var(--ink)' }}>
              {epics.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.35rem' }}>
              <select value={newPriority} onChange={e => setNewPriority(e.target.value)} style={{ flex: 1, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', padding: '0.3rem', border: '1px solid var(--grid-line)', background: '#F4EFE2', color: 'var(--ink)' }}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
              <select value={newPoints ?? ''} onChange={e => setNewPoints(e.target.value ? Number(e.target.value) : null)} style={{ flex: 1, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', padding: '0.3rem', border: '1px solid var(--grid-line)', background: '#F4EFE2', color: 'var(--ink)' }}>
                <option value="">Points —</option>
                <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={5}>5</option><option value={8}>8</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <Button variant="primary" onClick={handleAdd} style={{ flex: 1, fontSize: '0.7rem', padding: '0.4em' }}>Add story</Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)} style={{ flex: 1, fontSize: '0.7rem', padding: '0.4em' }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddForm(true)} style={{ width: '100%', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.06em', padding: '0.55rem', border: '1px dashed var(--grid-line)', background: 'transparent', color: 'var(--fog)', cursor: 'pointer' }}>+ ADD STORY</button>
        )}
      </div>
    </div>
  )
}
