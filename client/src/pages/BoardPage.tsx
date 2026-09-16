import React, { useState, useCallback } from 'react'
import { DndContext, DragEndEvent, DragStartEvent, DragOverEvent, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { usePlan } from '@/context/PlanContext'
import { useRefinePlan } from '@/hooks/useRefinePlan'
import { usePlansRepository } from '@/hooks/usePlansRepository'
import { GroupColumn } from '@/components/board/GroupColumn'
import { EpicLegend } from '@/components/board/EpicLegend'
import { TimelineStrip } from '@/components/board/TimelineStrip'
import { RefineBar } from '@/components/board/RefineBar'
import { ShortcutsModal } from '@/components/board/ShortcutsModal'
import { toMarkdown, downloadCsv, exportToPdf } from '@/lib/export'
import { Button } from '@/components/shared/Button'
import { Story } from '@/types/plan'

export const BoardPage: React.FC<{ apiBaseUrl: string }> = ({ apiBaseUrl }) => {
  const { plan, dispatch, state } = usePlan()
  const { refine, loading: refining } = useRefinePlan(apiBaseUrl)
  const { save, remove: removePlan } = usePlansRepository()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkTarget, setBulkTarget] = useState('')

  const doneColumnIndex = plan.groups.findIndex(g => g.type === 'column' && (g as any).name === 'Done')
  const isGroupDrag = !!activeId?.startsWith('group-')
  const activeStory = activeId && !isGroupDrag ? plan.groups.flatMap(g=>g.stories).find(s=>s.id===activeId) ?? null : null
  const activeGroup = isGroupDrag ? plan.groups[parseInt(activeId!.replace('group-',''),10)] : null
  const activeEpicIdx = activeStory ? plan.epics.findIndex(e=>e.id===activeStory.epic_id) : -1

  const handleEditStory = useCallback((groupIndex: number, storyId: string, field: string, value: any) => { dispatch({ type: 'EDIT_STORY', payload: { groupIndex, storyId, field, value } }) }, [dispatch])
  const handleDeleteStory = useCallback((groupIndex: number, storyId: string) => { dispatch({ type: 'DELETE_STORY', payload: { groupIndex, storyId } }) }, [dispatch])
  const handleCyclePoints = useCallback((groupIndex: number, story: Story) => {
    const cycle = [1, 2, 3, 5, 8, null]
    const idx = cycle.indexOf(story.points)
    const next = cycle[(idx + 1) % cycle.length]
    dispatch({ type: 'EDIT_STORY', payload: { groupIndex, storyId: story.id, field: 'points', value: next } })
  }, [dispatch])
  const handleToggleDone = useCallback((groupIndex: number, storyId: string) => {
    const story = plan.groups[groupIndex]?.stories.find(s=>s.id===storyId)
    dispatch({ type: 'TOGGLE_DONE', payload: { groupIndex, storyId } })
    // if marking done and not already in Done column, offer to move there on next click is via → DONE button
    if (story && !story.done && doneColumnIndex !== null && groupIndex !== doneColumnIndex) {
      // don't auto-move, keep explicit via button to avoid surprise
    }
  }, [dispatch, plan.groups, doneColumnIndex])
  const handleAddStory = useCallback((groupIndex: number, data?: { title: string; epicId: string; priority: string; points: number | null; criteria: string[] }) => {
    const newStory: Story = {
      id: `US-${100 + plan.groups.flatMap(g => g.stories).length + 1}`,
      epic_id: data?.epicId || plan.epics[0]?.id || '',
      title: data?.title?.trim() || 'New story',
      criteria: data?.criteria?.length ? data.criteria : ['Acceptance criterion 1', 'Acceptance criterion 2'],
      points: data?.points ?? null,
      priority: data?.priority || 'Medium',
      depends_on: [],
      done: false,
    }
    dispatch({ type: 'ADD_STORY', payload: { groupIndex, story: newStory } })
  }, [dispatch, plan])
  const handleMoveStory = useCallback((fromGroupIndex: number, toGroupIndex: number, fromIndex: number, toIndex: number) => { dispatch({ type: 'MOVE_STORY', payload: { fromGroupIndex, toGroupIndex, fromIndex, toIndex } }) }, [dispatch])
  const handleMoveToDone = useCallback((fromIndex: number, storyId: string) => {
    if (doneColumnIndex === null || doneColumnIndex === fromIndex) return
    const fromStoryIdx = plan.groups[fromIndex]?.stories.findIndex(s=>s.id===storyId) ?? -1
    if (fromStoryIdx < 0) return
    const targetLen = plan.groups[doneColumnIndex].stories.length
    handleMoveStory(fromIndex, doneColumnIndex, fromStoryIdx, targetLen)
    setToast('Moved to Done')
    setTimeout(()=>setToast(null), 2000)
  }, [doneColumnIndex, plan.groups, handleMoveStory])
  const handleAddGroup = useCallback(() => {
    if (!newGroupName.trim()) return
    const trimmed = newGroupName.trim()
    const firstType = (plan.groups[0] as any)?.type || (plan.methodology === 'scrum' ? 'sprint' : 'column')
    const newGroup: any = firstType === 'sprint'
      ? { type: 'sprint', number: Math.max(0, ...plan.groups.filter(g=>g.type==='sprint').map((g:any)=>g.number)) + 1, name: trimmed, goal: '', stories: [] }
      : { type: 'column', name: trimmed, wip_limit: null, stories: [] }
    dispatch({ type: 'ADD_GROUP', payload: newGroup })
    setNewGroupName('')
    setShowAddGroup(false)
    setToast(`${firstType==='sprint'?'Sprint':'Column'} "${trimmed}" added`)
    setTimeout(()=>setToast(null), 2000)
  }, [newGroupName, plan.groups, plan.methodology, dispatch])
  const handleRenameGroup = useCallback((idx: number, name: string) => {
    if (!name.trim()) return
    dispatch({ type: 'RENAME_GROUP', payload: { groupIndex: idx, name: name.trim() } })
  }, [dispatch])
  const handleDeleteGroup = useCallback((idx: number) => {
    if (plan.groups.length <= 1) { setToast('Need at least one group'); setTimeout(()=>setToast(null),2000); return }
    const g: any = plan.groups[idx]
    if (!confirm(`Delete "${g.name}"? Stories inside will be lost.`)) return
    dispatch({ type: 'DELETE_GROUP', payload: { groupIndex: idx } })
    setToast('Group deleted')
    setTimeout(()=>setToast(null),2000)
  }, [plan.groups, dispatch])
  const handleRefine = useCallback(async (instruction: string) => {
    const updated = await refine(plan, instruction)
    if (updated) { dispatch({ type: 'SET_PLAN', payload: updated }); save(updated).catch(() => setToast('Auto-save failed')) }
  }, [plan, refine, dispatch, save])
  const handleUndo = useCallback(() => { dispatch({ type: 'UNDO' }) }, [dispatch])
  const handleRedo = useCallback(() => { dispatch({ type: 'REDO' }) }, [dispatch])
  const canUndo = !!(state.previousPlan || (state.past && state.past.length > 0))
  const canRedo = !!(state.future && state.future.length > 0)
  const handleSave = useCallback(async () => { try { await save(plan); setToast('Plan saved'); setTimeout(() => setToast(null), 3000) } catch { setToast('Save failed'); setTimeout(() => setToast(null), 3000) } }, [plan, save])
  const handleExportMarkdown = useCallback(() => { const md = toMarkdown(plan); navigator.clipboard.writeText(md).catch(() => {}); setToast('Markdown copied to clipboard'); setTimeout(() => setToast(null), 3000) }, [plan])
  const handleExportCsv = useCallback(() => { downloadCsv(plan); setToast('CSV downloaded'); setTimeout(() => setToast(null), 3000) }, [plan])
  const handleExportPdf = useCallback(() => { exportToPdf(plan); setToast('PDF exported'); setTimeout(() => setToast(null), 3000) }, [plan])

  // helpers for bulk + search
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }, [])
  const handleBulkDelete = useCallback(() => {
    if (selectedIds.size === 0) return
    if (!confirm(`Delete ${selectedIds.size} stories?`)) return
    dispatch({ type: 'BULK_DELETE', payload: { storyIds: Array.from(selectedIds) } })
    setSelectedIds(new Set())
    setToast(`Deleted ${selectedIds.size} stories`)
    setTimeout(()=>setToast(null),2000)
  }, [selectedIds, dispatch])
  const handleBulkDone = useCallback((done: boolean) => {
    if (selectedIds.size === 0) return
    dispatch({ type: 'BULK_TOGGLE_DONE', payload: { storyIds: Array.from(selectedIds), done } })
    setSelectedIds(new Set())
    setToast(`${done ? 'Marked done' : 'Marked undone'}: ${selectedIds.size}`)
    setTimeout(()=>setToast(null),2000)
  }, [selectedIds, dispatch])
  const handleBulkMove = useCallback(() => {
    if (selectedIds.size === 0 || bulkTarget === '') return
    dispatch({ type: 'BULK_MOVE', payload: { storyIds: Array.from(selectedIds), toGroupIndex: Number(bulkTarget) } })
    setToast(`Moved ${selectedIds.size} stories`)
    setTimeout(()=>setToast(null),2000)
    setSelectedIds(new Set())
    setBulkTarget('')
  }, [selectedIds, bulkTarget, dispatch])

  const matchesSearch = useCallback((story: Story, epicName?: string) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return story.title.toLowerCase().includes(q) || story.id.toLowerCase().includes(q) || story.criteria.join(' ').toLowerCase().includes(q) || (epicName && epicName.toLowerCase().includes(q)) || story.priority.toLowerCase().includes(q)
  }, [searchQuery])

  // Global keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      // search focus shortcuts always work (even in input? check)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        document.getElementById('board-search')?.focus()
        return
      }
      if (e.key === '/' && !isInput) {
        e.preventDefault()
        document.getElementById('board-search')?.focus()
        return
      }

      if (isInput) return

      if (e.key === '?' && e.shiftKey) {
        e.preventDefault()
        setShowShortcuts(true)
        return
      }
      if (e.key === 'Escape') {
        if (searchQuery) { setSearchQuery(''); return }
        if (selectedIds.size) { setSelectedIds(new Set()); return }
        setShowShortcuts(false)
        return
      }
      if (e.key === 'm' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleExportMarkdown()
        return
      }
      if (e.key === 'e' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleExportCsv()
        return
      }
      if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleExportPdf()
        return
      }
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleSave()
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) handleRedo()
        else handleUndo()
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        handleRedo()
        return
      }
      if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const refineInput = document.querySelector('input[placeholder*="Refine"]') as HTMLInputElement
        refineInput?.focus()
        return
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleExportMarkdown, handleExportCsv, handleExportPdf, handleSave, handleUndo, handleRedo, searchQuery, selectedIds.size])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over) { setActiveId(null); return }
    const aId = active.id as string
    const oId = over.id as string
    // column reorder: group-0 -> group-2
    if (aId.startsWith('group-') && oId.startsWith('group-')) {
      const from = parseInt(aId.replace('group-',''),10)
      const to = parseInt(oId.replace('group-',''),10)
      if (from !== to) dispatch({ type:'REORDER_GROUPS', payload:{ fromIndex: from, toIndex: to } })
      setActiveId(null)
      return
    }
    // dropping a column onto a story (should reorder column to that story's column position)
    if (aId.startsWith('group-')) {
      const from = parseInt(aId.replace('group-',''),10)
      // find which column the over story belongs to
      const targetCol = plan.groups.findIndex(g => g.stories.some(s=>s.id===oId))
      if (targetCol >=0 && targetCol !== from) dispatch({ type:'REORDER_GROUPS', payload:{ fromIndex: from, toIndex: targetCol } })
      setActiveId(null)
      return
    }
    // story moves
    const activeId = aId
    const overId = oId
    const fromIdx = plan.groups.findIndex(g => g.stories.some(s => s.id === activeId))
    if (fromIdx < 0) { setActiveId(null); return }
    let toIdx: number = -1
    let toStoryIdx: number = -1
    if (overId.startsWith('column-')) {
      toIdx = parseInt(overId.replace('column-',''), 10)
      toStoryIdx = plan.groups[toIdx]?.stories.length ?? 0
    } else if (overId.startsWith('group-')) {
      toIdx = parseInt(overId.replace('group-',''),10)
      toStoryIdx = plan.groups[toIdx]?.stories.length ?? 0
    } else {
      toIdx = plan.groups.findIndex(g => g.stories.some(s => s.id === overId))
      if (toIdx >= 0) toStoryIdx = plan.groups[toIdx].stories.findIndex(s => s.id === overId)
    }
    if (toIdx >= 0) {
      const fromStoryIdx = plan.groups[fromIdx].stories.findIndex(s => s.id === activeId)
      if (toIdx === fromIdx && activeId === overId) { setActiveId(null); return }
      const targetIdx = toStoryIdx >= 0 ? toStoryIdx : plan.groups[toIdx].stories.length
      let adj = targetIdx
      if (fromIdx === toIdx && fromStoryIdx < targetIdx) adj = targetIdx
      handleMoveStory(fromIdx, toIdx, fromStoryIdx, adj)
    }
    setActiveId(null)
  }, [plan.groups, handleMoveStory, dispatch])
  const handleDragStart = useCallback((event: DragStartEvent) => { setActiveId(event.active.id as string) }, [])

  if (!plan.groups.length && !plan.epics.length) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', color: 'var(--fog)', letterSpacing: '0.08em' }}>NO ACTIVE PLAN — GENERATE ONE FROM NEW SPEC</div>
        <div style={{ marginTop: '1rem' }}><Button variant="ghost" onClick={() => window.location.href = '/'}>Go to New Spec</Button></div>
      </div>
    )
  }

  const allStoryIds = plan.groups.flatMap(g => g.stories.map(s=>s.id))

  const displayName = (plan.project_name || 'Untitled Plan').replace(/\*\*/g, '').trim()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', borderBottom: '1px solid var(--grid-line)', paddingBottom: '0.8rem' }}>
        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--fog)' }}>PLAN — {plan.methodology.toUpperCase()}</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.05rem', color: 'var(--bright)', lineHeight: 1.25, overflowWrap:'anywhere', wordBreak:'break-word', whiteSpace:'normal' }}>{displayName}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', flexShrink: 0, alignItems:'center' }}>
          <Button variant="ghost" onClick={handleExportMarkdown} style={{ fontSize: '0.7rem', padding: '0.4em 0.7em' }}>Copy Markdown</Button>
          <Button variant="ghost" onClick={handleExportCsv} style={{ fontSize: '0.7rem', padding: '0.4em 0.7em' }}>Export CSV</Button>
          <Button variant="ghost" onClick={handleExportPdf} style={{ fontSize: '0.7rem', padding: '0.4em 0.7em' }}>Export PDF</Button>
          <Button variant="ghost" onClick={handleSave} style={{ fontSize: '0.7rem', padding: '0.4em 0.7em' }}>Save</Button>
          <Button variant="ghost" onClick={() => { removePlan(plan.project_name || 'plan').catch(() => {}) }} style={{ fontSize: '0.7rem', padding: '0.4em 0.7em' }}>Delete</Button>
          <Button variant="ghost" onClick={() => setShowShortcuts(true)} style={{ fontSize: '0.7rem', padding: '0.4em 0.7em' }} title="Shortcuts (?)">⌘?</Button>
        </div>
      </div>

      {/* refine — top, with use-case */}
      <div style={{ background:'var(--paper)', border:'1px solid var(--grid-line)', clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', padding:'0.75rem 0.9rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:6 }}>
          <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.58rem', letterSpacing:'0.08em', color:'var(--ink-soft)' }}>REFINE — CONVERSATIONAL ITERATION</div>
          <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.58rem', color:'var(--fog)' }}>Use-case: tweak without regenerating</div>
        </div>
        <div style={{ fontSize:'0.72rem', color:'var(--ink-soft)', lineHeight:1.45, marginBottom:8 }}>
          Describe changes in plain language — the board updates live. Try <span style={{ color:'var(--ink)', fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.68rem' }}>'make sprint 2 focus on onboarding'</span> · <span style={{ color:'var(--ink)', fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.68rem' }}>'split epic E2'</span> · <span style={{ color:'var(--ink)', fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.68rem' }}>'move US-101 to Done'</span> · then <span style={{ color:'var(--ink)', fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.68rem' }}>Undo</span> to revert.
        </div>
        <RefineBar onRefine={handleRefine} loading={refining} onUndo={handleUndo} canUndo={canUndo} />
        {canRedo && <div style={{ marginTop: 6, textAlign: 'right' }}><button onClick={handleRedo} style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.6rem', background:'var(--surface)', border:'1px solid var(--grid-line)', color:'var(--ink-soft)', cursor:'pointer', padding:'2px 8px' }}>Redo ↷</button></div>}
      </div>

      {/* search + bulk toolbar */}
      <div style={{ display:'flex', gap: '0.5rem', flexWrap:'wrap', alignItems:'center', background:'var(--surface)', border:'1px solid var(--grid-line)', clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)', padding:'0.6rem 0.7rem' }}>
        <div style={{ flex:'1 1 220px', display:'flex', alignItems:'center', gap:6, background:'var(--paper)', border:'1px solid var(--grid-line)', padding:'0.35rem 0.5rem' }}>
          <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.6rem', color:'var(--fog)' }}>⌕</span>
          <input id="board-search" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search — title, ID, epic, priority …  (/ or Cmd+K)" style={{ flex:1, border:'none', outline:'none', background:'transparent', fontFamily:"'IBM Plex Sans', sans-serif", fontSize:'0.78rem', color:'var(--ink)' }} />
          {searchQuery && <button onClick={()=>setSearchQuery('')} style={{ fontSize:'0.6rem', background:'var(--ink)', color:'var(--paper)', border:'none', cursor:'pointer', padding:'2px 5px', fontFamily:"'IBM Plex Mono', monospace" }}>✕</button>}
        </div>
        <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.58rem', color:'var(--fog)', whiteSpace:'nowrap' }}>{plan.groups.flatMap(g=>g.stories).filter(s=>matchesSearch(s, plan.epics.find(e=>e.id===s.epic_id)?.name)).length}/{plan.groups.flatMap(g=>g.stories).length} match</span>
        <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.58rem', color:'var(--fog)' }}>·</span>
        <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.58rem', color:'var(--fog)' }}>{state.past.length} undo · {state.future.length} redo</span>
        <button onClick={handleUndo} disabled={!canUndo} style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', padding:'0.3rem 0.5rem', border:'1px solid var(--grid-line)', background: canUndo ? 'var(--surface-alt)' : 'transparent', color: canUndo ? 'var(--bright)' : 'var(--fog)', cursor: canUndo ? 'pointer':'not-allowed', opacity: canUndo ? 1 : 0.5 }}>↩ Undo</button>
        <button onClick={handleRedo} disabled={!canRedo} style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', padding:'0.3rem 0.5rem', border:'1px solid var(--grid-line)', background: canRedo ? 'var(--surface-alt)' : 'transparent', color: canRedo ? 'var(--bright)' : 'var(--fog)', cursor: canRedo ? 'pointer':'not-allowed', opacity: canRedo ? 1 : 0.5 }}>↷ Redo</button>
      </div>

      {selectedIds.size > 0 && (
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', alignItems:'center', background:'var(--amber)', border:'1px solid var(--amber)', clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)', padding:'0.6rem 0.7rem', color:'#fff' }}>
          <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', fontWeight:600 }}>{selectedIds.size} SELECTED</span>
          <button onClick={()=>handleBulkDone(true)} style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', padding:'0.3rem 0.5rem', background:'#fff', color:'var(--ink)', border:'none', cursor:'pointer' }}>✓ Done</button>
          <button onClick={()=>handleBulkDone(false)} style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', padding:'0.3rem 0.5rem', background:'transparent', color:'#fff', border:'1px solid rgba(255,255,255,0.6)', cursor:'pointer' }}>○ Undone</button>
          <select value={bulkTarget} onChange={e=>setBulkTarget(e.target.value)} style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', padding:'0.3rem', border:'1px solid rgba(255,255,255,0.6)', background:'#fff', color:'var(--ink)' }}>
            <option value="">Move to…</option>
            {plan.groups.map((g,i)=><option key={i} value={i}>{g.type==='sprint' ? `Sprint ${(g as any).number} — ${(g as any).name}` : (g as any).name}</option>)}
          </select>
          <button onClick={handleBulkMove} disabled={bulkTarget===''} style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', padding:'0.3rem 0.5rem', background: bulkTarget ? '#fff' : 'rgba(255,255,255,0.3)', color:'var(--ink)', border:'none', cursor: bulkTarget ? 'pointer':'not-allowed', opacity: bulkTarget?1:0.6 }}>Move</button>
          <button onClick={handleBulkDelete} style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', padding:'0.3rem 0.5rem', background:'var(--coral)', color:'#fff', border:'1px solid #fff', cursor:'pointer' }}>Delete</button>
          <button onClick={()=>setSelectedIds(new Set())} style={{ marginLeft:'auto', fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', padding:'0.3rem 0.5rem', background:'transparent', color:'#fff', border:'1px solid rgba(255,255,255,0.6)', cursor:'pointer' }}>Clear</button>
        </div>
      )}

      {plan.methodology === 'scrum' && plan.groups.filter(g => g.type === 'sprint').length > 0 && (
        <TimelineStrip
          sprintCount={plan.groups.filter(g => g.type === 'sprint').length}
          sprintLength="2 weeks"
          plan={plan}
        />
      )}

      <EpicLegend epics={plan.epics} plan={plan} />

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <SortableContext items={plan.groups.map((_,i)=>`group-${i}`)} strategy={horizontalListSortingStrategy}>
          <div style={{ display: 'flex', gap: '0.7rem', overflowX: 'auto', paddingBottom: '0.6rem', alignItems:'flex-start' }}>
            {plan.groups.map((group, i) => (
              <GroupColumn key={`${group.type}-${(group as any).name}-${i}`} group={group} groupIndex={i} epics={plan.epics} doneColumnIndex={doneColumnIndex} onEditStory={handleEditStory} onDeleteStory={handleDeleteStory} onCyclePoints={handleCyclePoints} onToggleDone={handleToggleDone} onAddStory={handleAddStory} onMoveToDone={handleMoveToDone} onRenameGroup={handleRenameGroup} onDeleteGroup={handleDeleteGroup} selectedIds={selectedIds} onToggleSelect={toggleSelect} matchesSearch={matchesSearch} />
            ))}
            {showAddGroup ? (
              <div style={{ minWidth: 280, maxWidth: 320, background:'var(--surface)', border:'1px dashed var(--amber)', clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', padding:'0.8rem', flexShrink:0, alignSelf:'flex-start' }}>
                <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.58rem', letterSpacing:'0.08em', color:'var(--fog)', marginBottom:6 }}>NEW {plan.methodology==='scrum' ? 'SPRINT' : 'COLUMN'}</div>
                <input autoFocus value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} placeholder={plan.methodology==='scrum' ? 'Sprint name' : 'Column name'} onKeyDown={e=>{if(e.key==='Enter') handleAddGroup(); if(e.key==='Escape') setShowAddGroup(false)}} style={{ width:'100%', fontFamily:"'IBM Plex Sans', sans-serif", fontSize:'0.82rem', padding:'0.5rem', border:'1px solid var(--grid-line)', background:'var(--paper)', color:'var(--ink)', outline:'none', marginBottom:8 }} />
                <div style={{ display:'flex', gap:6 }}>
                  <Button variant="primary" onClick={handleAddGroup} style={{ flex:1, fontSize:'0.7rem' }}>Add</Button>
                  <Button variant="ghost" onClick={()=>setShowAddGroup(false)} style={{ flex:1, fontSize:'0.7rem' }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <button onClick={()=>setShowAddGroup(true)} style={{ minWidth:220, height:120, border:'1px dashed var(--grid-line)', background:'transparent', color:'var(--fog)', cursor:'pointer', fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.68rem', letterSpacing:'0.08em', flexShrink:0, clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', alignSelf:'flex-start' }}>
                ＋ ADD {plan.methodology==='scrum' ? 'SPRINT' : 'COLUMN'}
              </button>
            )}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeStory ? (
            <div style={{ width: 300, transform: 'rotate(1.2deg)', opacity: 0.97, boxShadow: '0 12px 28px rgba(0,0,0,0.38)' }}>
              <div style={{ background:'var(--paper)', color:'var(--ink)', border:'1px solid var(--grid-line)', borderLeft:`3px solid ${['var(--amber)','var(--coral)','var(--teal)','var(--violet)','var(--sage)'][Math.max(0,activeEpicIdx)%5]}`, clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', padding:'0.7rem 0.85rem' }}>
                <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', color:'var(--ink-soft)' }}>{activeStory.id}</div>
                <div style={{ fontWeight:600, fontSize:'0.86rem', marginTop:4, lineHeight:1.3 }}>{activeStory.title}</div>
                <div style={{ fontSize:'0.74rem', color:'var(--ink-soft)', marginTop:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{activeStory.criteria[0] || ''}</div>
              </div>
            </div>
          ) : activeGroup ? (
            <div style={{ width: 300, transform: 'rotate(1deg)', opacity: 0.96, boxShadow: '0 12px 28px rgba(0,0,0,0.38)' }}>
              <div style={{ background:'var(--surface)', border:'1px solid var(--amber)', clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', padding:'0.9rem', color:'var(--bright)' }}>
                <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600 }}>{(activeGroup as any).name}</div>
                <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', color:'var(--fog)', marginTop:4 }}>{activeGroup.type === 'sprint' ? `SPRINT ${(activeGroup as any).number}` : `COLUMN`} · {(activeGroup as any).stories?.length ?? 0} stories</div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {toast && <div style={{ position: 'fixed', bottom: '1.2rem', right: '1.2rem', background: 'var(--paper)', color: 'var(--ink)', padding: '0.6rem 0.9rem', border: '1px solid var(--grid-line)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', zIndex: 1000 }}>{toast}</div>}
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  )
}
