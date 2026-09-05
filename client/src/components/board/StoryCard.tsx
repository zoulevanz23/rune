import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Story } from '@/types/plan'

const epicColors = ['var(--amber)', 'var(--coral)', 'var(--teal)', 'var(--violet)', 'var(--sage)']

interface StoryCardProps {
  story: Story
  epicName?: string
  epicIndex: number
  onEdit: (field: string, value: string) => void
  onDelete: () => void
  onCyclePoints: () => void
  onToggleDone: () => void
  onMoveToDone?: () => void
  isDoneColumn?: boolean
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story, epicName, epicIndex, onEdit, onDelete, onCyclePoints, onToggleDone, onMoveToDone, isDoneColumn,
}) => {
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const getCrit = (): string[] => {
    const v: any = story.criteria
    if (Array.isArray(v)) return v
    if (typeof v === 'string') { try { const p = JSON.parse(v); return Array.isArray(p) ? p : [String(v)] } catch { return [String(v)] } }
    return []
  }
  const [editTitle, setEditTitle] = useState(story.title)
  const [editCriteria, setEditCriteria] = useState(getCrit().join('\n'))
  const [hover, setHover] = useState(false)
  const borderColor = epicColors[epicIndex % epicColors.length]
  const critList = getCrit()

  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
  } = useSortable({ id: story.id, disabled: editing })

  const style: React.CSSProperties = {
    background: 'var(--paper)',
    color: 'var(--ink)',
    border: '1px solid var(--grid-line)',
    borderLeft: `3px solid ${borderColor}`,
    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
    padding: expanded ? '0.9rem 1rem 0.75rem' : '0.7rem 0.85rem 0.6rem',
    marginBottom: '0.7rem',
    opacity: isDragging ? 0.25 : story.done ? 0.55 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
  }

  const stopDrag = (e: React.SyntheticEvent) => e.stopPropagation()

  const handleSave = () => {
    if (editTitle.trim()) onEdit('title', editTitle.trim())
    const crits = editCriteria.split('\n').map(s=>s.trim()).filter(Boolean)
    onEdit('criteria', crits.length ? crits : story.criteria)
    setEditing(false)
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
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', color: 'var(--ink-soft)', display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ fontSize:'0.55rem', opacity:0.5, cursor:'grab', userSelect:'none' }} title="Drag">⠿</span>
          {story.id}
        </span>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <button
            onPointerDown={stopDrag}
            onClick={e => { e.stopPropagation(); if (editing) handleSave(); else { setEditTitle(story.title); setEditCriteria(getCrit().join('\n')); setEditing(true) } }}
            title={editing ? 'Save' : 'Edit'}
            style={{
              background: editing ? 'var(--ink)' : 'var(--paper)',
              color: editing ? 'var(--paper)' : 'var(--ink)',
              border: '1px solid var(--grid-line)',
              width: 22, height: 22, cursor: 'pointer', fontSize: '0.62rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink:0
            }}
          >{editing ? '✓' : '✎'}</button>
          <span
            onPointerDown={stopDrag}
            onClick={e => { e.stopPropagation(); onCyclePoints() }}
            title="Cycle points"
            style={{
              width: 22, height: 22,
              background: story.points !== null && story.points !== undefined ? 'var(--ink)' : 'transparent',
              color: story.points !== null && story.points !== undefined ? 'var(--paper)' : 'var(--fog)',
              border: story.points !== null && story.points !== undefined ? 'none' : '1px dashed var(--grid-line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.58rem', fontFamily: "'IBM Plex Mono', monospace",
              cursor: 'pointer',
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
              flexShrink:0, opacity: story.points !== null ? 1 : 0.6
            }}
          >{story.points ?? '·'}</span>
          <button
            onPointerDown={stopDrag}
            onClick={e => { e.stopPropagation(); setExpanded(v=>!v) }}
            title={expanded ? 'Minimize' : 'Expand — bigger view'}
            style={{
              background: expanded ? 'var(--paper)' : 'var(--amber)',
              color: expanded ? 'var(--ink)' : '#fff',
              border: `1px solid ${expanded ? 'var(--grid-line)' : 'var(--amber)'}`,
              width: 26, height: 26, cursor: 'pointer', fontSize: '0.78rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink:0, boxShadow: expanded ? 'none' : '0 1px 6px rgba(0,0,0,0.18)'
            }}
          >{expanded ? '−' : '⛶'}</button>
          <button
            onPointerDown={stopDrag}
            onClick={e => { e.stopPropagation(); onToggleDone() }}
            title={story.done ? 'Mark undone' : 'Mark done'}
            style={{ background: story.done ? 'var(--teal)' : 'transparent', border: `1px solid ${story.done ? 'var(--teal)' : 'var(--grid-line)'}`, width: 20, height: 20, borderRadius: '50%', cursor: 'pointer', color: story.done ? '#fff' : 'var(--ink-soft)', fontSize: '0.62rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink:0 }}
          >{story.done ? '✓' : '○'}</button>
          <button
            onPointerDown={stopDrag}
            onClick={e => { e.stopPropagation(); onDelete() }}
            title="Delete"
            style={{ background: 'var(--paper)', border: '1px solid var(--grid-line)', width: 22, height: 22, cursor: 'pointer', color: 'var(--coral)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink:0 }}
          >×</button>
        </div>
      </div>

      <div style={{ borderTop: '1px dashed var(--grid-line)', margin: '0 -0.2rem 0.5rem', opacity: 0.6 }} />

      {editing ? (
        <div onPointerDown={stopDrag}>
          <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" autoFocus style={{ width: '100%', fontFamily: "'IBM Plex Sans', sans-serif", border: '1px solid var(--grid-line)', background: '#F4EFE2', padding: '0.4rem', marginBottom: '0.4rem', color: 'var(--ink)', fontSize:'0.84rem', outline:'none' }} />
          <textarea value={editCriteria} onChange={e => setEditCriteria(e.target.value)} placeholder="One criterion per line" style={{ width: '100%', fontFamily: "'IBM Plex Sans', sans-serif", border: '1px solid var(--grid-line)', background: '#F4EFE2', padding: '0.4rem', height: 72, color: 'var(--ink)', fontSize:'0.78rem', outline:'none' }} />
          <div style={{ display:'flex', gap:6, marginTop:6 }}>
            <button onPointerDown={stopDrag} onClick={e=>{e.stopPropagation(); handleSave()}} style={{ flex:1, fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', padding:'0.4rem', background:'var(--ink)', color:'var(--paper)', border:'none', cursor:'pointer' }}>SAVE</button>
            <button onPointerDown={stopDrag} onClick={e=>{e.stopPropagation(); setEditing(false)}} style={{ flex:1, fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', padding:'0.4rem', background:'var(--paper)', border:'1px solid var(--grid-line)', cursor:'pointer', color:'var(--ink)' }}>CANCEL</button>
          </div>
        </div>
      ) : (
        <div onDoubleClick={() => { setEditTitle(story.title); setEditCriteria(getCrit().join('\n')); setEditing(true) }} style={{ cursor: 'text' }}>
          <div style={{ fontWeight: 600, fontSize: '0.86rem', lineHeight: 1.35, marginBottom: '0.35rem', textDecoration: story.done ? 'line-through' : 'none', color: story.done ? 'var(--ink-soft)' : 'var(--ink)' }}>{story.title}</div>
          {critList.slice(0, expanded ? 99 : 2).map((c, i) => (
            <div key={i} style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', lineHeight: 1.4, paddingLeft: '0.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>—</span>{c}
            </div>
          ))}
          {critList.length > 2 && !expanded && <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.58rem', color:'var(--ink-soft)', marginTop:4 }}>+{critList.length - 2} more — expand to see</div>}
          {story.depends_on.length > 0 && (
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'var(--ink-soft)', marginTop: '0.35rem' }}>needs {story.depends_on.join(', ')}</div>
          )}
        </div>
      )}

      <div style={{ marginTop: '0.55rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems:'center' }}>
        <span style={{ background: borderColor, color: '#fff', padding: '1px 5px', fontSize: '0.58rem', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.04em' }}>{epicName}</span>
        {story.priority && <span style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '1px 5px', fontSize: '0.58rem', fontFamily: "'IBM Plex Mono', monospace" }}>{story.priority}</span>}
        {!isDoneColumn && onMoveToDone && (
          <button onPointerDown={stopDrag} onClick={e=>{e.stopPropagation(); onMoveToDone()}} title="Move to Done" style={{ marginLeft:'auto', fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.56rem', letterSpacing:'0.06em', background:'var(--surface)', border:'1px solid var(--grid-line)', color:'var(--fog)', cursor:'pointer', padding:'2px 6px', clipPath:'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}>→ DONE</button>
        )}
      </div>
    </div>
  )
}
