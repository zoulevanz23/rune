import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useSearchParams } from 'react-router-dom'
import { usePlan } from '@/context/PlanContext'
import { useRefinePlan } from '@/hooks/useRefinePlan'
import { usePlansRepository } from '@/hooks/usePlansRepository'
import {
  EpicLegend,
  GroupColumn,
  RefineBar,
  ShortcutsModal,
  StoryDrawer,
  StoryLocation,
  TableView,
  TimelineStrip,
} from '@/components/board'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { toMarkdown, downloadCsv, exportToPdf } from '@/lib/export'
import { BoardActionsProvider } from '@/context/BoardActionsContext'
import {
  Button,
  Chip,
  EmptyState,
  IconButton,
  Input,
  Menu,
  Panel,
  Readout,
  Select,
  Tabs,
  useToast,
} from '@/components/primitives'
import { Story } from '@/types/plan'
import { Clock, LayoutGrid, Layers, MoreHorizontal, Plus, Search, Table2, Trash2, X } from 'lucide-react'

const VIEWS = ['board', 'table', 'timeline'] as const
type View = (typeof VIEWS)[number]

export const BoardPage: React.FC<{ apiBaseUrl: string }> = ({ apiBaseUrl }) => {
  const { plan, dispatch, state } = usePlan()
  const { refine, loading: refining } = useRefinePlan(apiBaseUrl)
  const { save, remove: removePlan } = usePlansRepository()
  const { show } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const rawView = searchParams.get('view')
  const view: View = (VIEWS as readonly string[]).includes(rawView || '') ? (rawView as View) : 'board'
  const setView = (next: View) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev)
      if (next === 'board') p.delete('view')
      else p.set('view', next)
      return p
    })
  }

  const [activeId, setActiveId] = useState<string | null>(null)
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [epicFilter, setEpicFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkTarget, setBulkTarget] = useState('')
  const [openStory, setOpenStory] = useState<StoryLocation | null>(null)
  const [nameDraft, setNameDraft] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; groupIndex: number; groupName: string }>({
    isOpen: false,
    groupIndex: -1,
    groupName: '',
  })

  const lastSavedRef = useRef(plan)
  const dirty = lastSavedRef.current !== plan

  useEffect(() => {
    setNameDraft((plan.project_name || '').replace(/\*\*/g, '').trim())
  }, [plan.project_name])

  const doneColumnIndex = plan.groups.findIndex(g => g.type === 'column' && g.name === 'Done')
  const isGroupDrag = !!activeId?.startsWith('group-')
  const activeStory = activeId && !isGroupDrag ? plan.groups.flatMap(g => g.stories).find(s => s.id === activeId) ?? null : null
  const activeGroup = isGroupDrag ? plan.groups[parseInt(activeId!.replace('group-', ''), 10)] : null

  const handleEditStory = useCallback(
    (groupIndex: number, storyId: string, field: string, value: any) =>
      dispatch({ type: 'EDIT_STORY', payload: { groupIndex, storyId, field, value } }),
    [dispatch]
  )
  const handleDeleteStory = useCallback(
    (groupIndex: number, storyId: string) => {
      dispatch({ type: 'DELETE_STORY', payload: { groupIndex, storyId } })
      setOpenStory(prev => (prev && prev.storyId === storyId ? null : prev))
      setSelectedIds(prev => {
        if (!prev.has(storyId)) return prev
        const next = new Set(prev)
        next.delete(storyId)
        return next
      })
    },
    [dispatch]
  )
  const handleCyclePoints = useCallback(
    (groupIndex: number, story: Story) => {
      const cycle = [1, 2, 3, 5, 8, null]
      const idx = cycle.indexOf(story.points as any)
      const next = cycle[(idx + 1) % cycle.length]
      dispatch({ type: 'EDIT_STORY', payload: { groupIndex, storyId: story.id, field: 'points', value: next } })
    },
    [dispatch]
  )
  const handleToggleDone = useCallback(
    (groupIndex: number, storyId: string) => dispatch({ type: 'TOGGLE_DONE', payload: { groupIndex, storyId } }),
    [dispatch]
  )
  const handleAddStory = useCallback(
    (
      groupIndex: number,
      data?: { title: string; epicId: string; priority: string; points: number | null; criteria: string[] }
    ) => {
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
    },
    [dispatch, plan]
  )
  const handleMoveStory = useCallback(
    (fromGroupIndex: number, toGroupIndex: number, fromIndex: number, toIndex: number) =>
      dispatch({ type: 'MOVE_STORY', payload: { fromGroupIndex, toGroupIndex, fromIndex, toIndex } }),
    [dispatch]
  )
  const handleMoveToDone = useCallback(
    (fromIndex: number, storyId: string) => {
      if (doneColumnIndex < 0 || doneColumnIndex === fromIndex) return
      const fromStoryIdx = plan.groups[fromIndex]?.stories.findIndex(s => s.id === storyId) ?? -1
      if (fromStoryIdx < 0) return
      const targetLen = plan.groups[doneColumnIndex].stories.length
      handleMoveStory(fromIndex, doneColumnIndex, fromStoryIdx, targetLen)
      show('Moved to Done', 'success')
    },
    [doneColumnIndex, plan.groups, handleMoveStory, show]
  )
  const handleAddGroup = useCallback(() => {
    if (!newGroupName.trim()) return
    const trimmed = newGroupName.trim()
    const firstType = (plan.groups[0] as any)?.type || (plan.methodology === 'scrum' ? 'sprint' : 'column')
    const newGroup: any =
      firstType === 'sprint'
        ? {
            type: 'sprint',
            number: Math.max(0, ...plan.groups.filter(g => g.type === 'sprint').map(g => (g as any).number)) + 1,
            name: trimmed,
            goal: '',
            stories: [],
          }
        : { type: 'column', name: trimmed, wip_limit: null, stories: [] }
    dispatch({ type: 'ADD_GROUP', payload: newGroup })
    setNewGroupName('')
    setShowAddGroup(false)
    show(`${firstType === 'sprint' ? 'Sprint' : 'Column'} “${trimmed}” added`, 'success')
  }, [newGroupName, plan.groups, plan.methodology, dispatch, show])
  const handleRenameGroup = useCallback(
    (idx: number, name: string) => {
      if (!name.trim()) return
      dispatch({ type: 'RENAME_GROUP', payload: { groupIndex: idx, name: name.trim() } })
    },
    [dispatch]
  )
  const handleDeleteGroup = useCallback(
    (idx: number) => {
      if (plan.groups.length <= 1) {
        show('A plan needs at least one group', 'warning')
        return
      }
      const g: any = plan.groups[idx]
      setDeleteDialog({ isOpen: true, groupIndex: idx, groupName: g.name })
    },
    [plan.groups, show]
  )

  const confirmDeleteGroup = useCallback(() => {
    if (deleteDialog.groupIndex >= 0) {
      dispatch({ type: 'DELETE_GROUP', payload: { groupIndex: deleteDialog.groupIndex } })
      show('Group deleted', 'success')
    }
    setDeleteDialog({ isOpen: false, groupIndex: -1, groupName: '' })
  }, [deleteDialog.groupIndex, dispatch, show])

  const handleRefine = useCallback(
    async (instruction: string) => {
      const updated = await refine(plan, instruction)
      if (updated) {
        dispatch({ type: 'SET_PLAN', payload: updated })
        save(updated)
          .then(() => {
            lastSavedRef.current = updated
          })
          .catch(() => show('Auto-save failed', 'error'))
      }
    },
    [plan, refine, dispatch, save, show]
  )

  const handleUndo = useCallback(() => dispatch({ type: 'UNDO' }), [dispatch])
  const handleRedo = useCallback(() => dispatch({ type: 'REDO' }), [dispatch])
  const canUndo = !!(state.previousPlan || (state.past && state.past.length > 0))
  const canRedo = !!(state.future && state.future.length > 0)

  const handleSave = useCallback(async () => {
    try {
      await save(plan)
      lastSavedRef.current = plan
      show('Plan saved', 'success')
    } catch {
      show('Save failed', 'error')
    }
  }, [plan, save, show])
  const handleExportMarkdown = useCallback(() => {
    navigator.clipboard.writeText(toMarkdown(plan)).catch(() => {})
    show('Markdown copied to clipboard', 'success')
  }, [plan, show])
  const handleExportCsv = useCallback(() => {
    downloadCsv(plan)
    show('CSV downloaded', 'success')
  }, [plan, show])
  const handleExportPdf = useCallback(() => {
    exportToPdf(plan)
    show('PDF exported', 'success')
  }, [plan, show])

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
    show(`Deleted ${selectedIds.size} ${selectedIds.size === 1 ? 'story' : 'stories'}`, 'success')
  }, [selectedIds, dispatch, show])
  const handleBulkDone = useCallback(
    (done: boolean) => {
      if (selectedIds.size === 0) return
      dispatch({ type: 'BULK_TOGGLE_DONE', payload: { storyIds: Array.from(selectedIds), done } })
      setSelectedIds(new Set())
      show(`${done ? 'Marked done' : 'Marked not done'}: ${selectedIds.size}`, 'success')
    },
    [selectedIds, dispatch, show]
  )
  const handleBulkMove = useCallback(() => {
    if (selectedIds.size === 0 || bulkTarget === '') return
    dispatch({ type: 'BULK_MOVE', payload: { storyIds: Array.from(selectedIds), toGroupIndex: Number(bulkTarget) } })
    show(`Moved ${selectedIds.size} ${selectedIds.size === 1 ? 'story' : 'stories'}`, 'success')
    setSelectedIds(new Set())
    setBulkTarget('')
  }, [selectedIds, bulkTarget, dispatch, show])

  const filtersActive = !!searchQuery.trim() || !!epicFilter || !!priorityFilter
  const matchesSearch = useCallback(
    (story: Story, epicName?: string) => {
      const q = searchQuery.trim().toLowerCase()
      if (q) {
        const epicForStory = plan.epics.find(e => e.id === story.epic_id)?.name || epicName || ''
        const haystack = [story.title, story.id, story.criteria.join(' '), epicForStory, story.priority]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (epicFilter && story.epic_id !== epicFilter) return false
      if (priorityFilter && story.priority !== priorityFilter) return false
      return true
    },
    [searchQuery, epicFilter, priorityFilter, plan.epics]
  )

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setEpicFilter('')
    setPriorityFilter('')
  }, [])

  // Global keyboard shortcuts (the command palette owns Cmd/Ctrl + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if (e.key === '/' && !isInput) {
        e.preventDefault()
        document.getElementById('board-filter')?.focus()
        return
      }

      if (isInput) return

      if (e.key === '?') {
        e.preventDefault()
        setShowShortcuts(true)
        return
      }
      if (e.key === 'Escape') {
        if (filtersActive) {
          clearFilters()
          return
        }
        if (selectedIds.size) {
          setSelectedIds(new Set())
          return
        }
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
  }, [handleExportMarkdown, handleExportCsv, handleExportPdf, handleSave, handleUndo, handleRedo, filtersActive, clearFilters, selectedIds.size])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over) {
        setActiveId(null)
        return
      }
      const aId = active.id as string
      const oId = over.id as string
      if (aId.startsWith('group-') && oId.startsWith('group-')) {
        const from = parseInt(aId.replace('group-', ''), 10)
        const to = parseInt(oId.replace('group-', ''), 10)
        if (from !== to) dispatch({ type: 'REORDER_GROUPS', payload: { fromIndex: from, toIndex: to } })
        setActiveId(null)
        return
      }
      if (aId.startsWith('group-')) {
        const from = parseInt(aId.replace('group-', ''), 10)
        const targetCol = plan.groups.findIndex(g => g.stories.some(s => s.id === oId))
        if (targetCol >= 0 && targetCol !== from) {
          dispatch({ type: 'REORDER_GROUPS', payload: { fromIndex: from, toIndex: targetCol } })
        }
        setActiveId(null)
        return
      }
      const fromIdx = plan.groups.findIndex(g => g.stories.some(s => s.id === aId))
      if (fromIdx < 0) {
        setActiveId(null)
        return
      }
      let toIdx = -1
      let toStoryIdx = -1
      if (oId.startsWith('column-') || oId.startsWith('group-')) {
        toIdx = parseInt(oId.replace(/^(column-|group-)/, ''), 10)
        toStoryIdx = plan.groups[toIdx]?.stories.length ?? 0
      } else {
        toIdx = plan.groups.findIndex(g => g.stories.some(s => s.id === oId))
        if (toIdx >= 0) toStoryIdx = plan.groups[toIdx].stories.findIndex(s => s.id === oId)
      }
      if (toIdx >= 0) {
        const fromStoryIdx = plan.groups[fromIdx].stories.findIndex(s => s.id === aId)
        if (toIdx === fromIdx && aId === oId) {
          setActiveId(null)
          return
        }
        const targetIdx = toStoryIdx >= 0 ? toStoryIdx : plan.groups[toIdx].stories.length
        handleMoveStory(fromIdx, toIdx, fromStoryIdx, targetIdx)
      }
      setActiveId(null)
    },
    [plan.groups, handleMoveStory, dispatch]
  )
  const handleDragStart = useCallback((event: DragStartEvent) => setActiveId(event.active.id as string), [])

  const commitName = () => {
    const cleaned = nameDraft.trim()
    if (cleaned !== (plan.project_name || '').replace(/\*\*/g, '').trim()) {
      dispatch({ type: 'SET_PLAN', payload: { ...plan, project_name: cleaned } })
    }
  }

  const openStoryObj = useMemo(() => {
    if (!openStory) return null
    return plan.groups[openStory.groupIndex]?.stories.find(s => s.id === openStory.storyId) ?? null
  }, [openStory, plan.groups])

  const openGroup = openStory ? plan.groups[openStory.groupIndex] : undefined
  const openGroupLabel = !openGroup
    ? ''
    : openGroup.type === 'sprint'
      ? `Sprint ${openGroup.number} — ${openGroup.name}`
      : openGroup.name

  const allStories = plan.groups.flatMap(g => g.stories)
  const totalStories = allStories.length
  const doneStories = allStories.filter(s => s.done).length
  const totalPoints = allStories.reduce((sum, s) => sum + (s.points || 0), 0)
  const donePoints = allStories.filter(s => s.done).reduce((sum, s) => sum + (s.points || 0), 0)
  const epicsDone = plan.epics.filter(e => {
    const stories = allStories.filter(s => s.epic_id === e.id)
    return stories.length > 0 && stories.every(s => s.done)
  }).length
  const progressPct = totalPoints
    ? Math.round((donePoints / totalPoints) * 100)
    : totalStories
      ? Math.round((doneStories / totalStories) * 100)
      : 0
  const matchCount = allStories.filter(s => matchesSearch(s, plan.epics.find(e => e.id === s.epic_id)?.name)).length

  if (!plan.groups.length && !plan.epics.length) {
    return (
      <Panel radius="lg" style={{ padding: 8 }}>
        <EmptyState
          icon={<Layers size={20} strokeWidth={1.7} />}
          title="No active plan"
          description="Generate a plan from your project brief to see the board."
          action={
            <Button variant="primary" onClick={() => (window.location.href = '/')}>
              Start a new plan
            </Button>
          }
        />
      </Panel>
    )
  }

  const boardActions = {
    canUndo,
    canRedo,
    undo: handleUndo,
    redo: handleRedo,
    save: handleSave,
    exportMarkdown: handleExportMarkdown,
    exportCsv: handleExportCsv,
    exportPdf: handleExportPdf,
  }

  const kpis: { label: string; value: string; sub: string }[] = [
    { label: 'Stories', value: String(totalStories), sub: `${doneStories} done` },
    { label: 'Points', value: String(totalPoints), sub: `${donePoints} done` },
    { label: 'Epics', value: String(plan.epics.length), sub: `${epicsDone} complete` },
    { label: 'Progress', value: `${progressPct}%`, sub: totalPoints ? 'By points' : 'By stories' },
  ]

  return (
    <BoardActionsProvider value={boardActions}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* ---- Page header ---- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <Chip variant="primary" size="xs">{plan.methodology === 'kanban' ? 'Kanban' : 'Scrum'}</Chip>
              <Readout variant="status" size="xs">
                {dirty ? 'Unsaved changes' : 'Saved'}
              </Readout>
            </div>
            <h1 style={{ margin: 0 }}>
            <input
              value={nameDraft}
              onChange={e => setNameDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={e => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
              }}
              aria-label="Plan name"
              placeholder="Untitled plan"
              style={{
                width: '100%',
                fontFamily: 'var(--font-sans)',
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                padding: '2px 6px',
                marginLeft: -6,
                outline: 'none',
              }}
              onFocus={e => {
                e.currentTarget.style.background = 'var(--surface)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
              onBlurCapture={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'transparent'
              }}
            />
            </h1>
          </div>
          <Menu
            label="Plan actions"
            trigger={
              <IconButton size="sm" variant="secondary" aria-label="Plan actions">
                <MoreHorizontal size={17} strokeWidth={1.7} />
              </IconButton>
            }
            items={[
              { id: 'save', label: 'Save plan', shortcut: '⌘S', onSelect: handleSave },
              { id: 'shortcuts', label: 'Keyboard shortcuts', shortcut: '?', onSelect: () => setShowShortcuts(true) },
              {
                id: 'delete',
                label: 'Delete plan',
                danger: true,
                icon: <Trash2 size={15} strokeWidth={1.7} />,
                onSelect: () => {
                  removePlan(plan.project_name || 'plan').catch(() => show('Could not delete plan', 'error'))
                },
              },
            ]}
          />
        </div>

        {/* ---- KPI tiles ---- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {kpis.map(kpi => (
            <Panel key={kpi.label} radius="lg" style={{ padding: '14px 16px' }}>
              <Readout variant="label" size="xs">{kpi.label}</Readout>
              <div className="tnum" style={{ fontSize: 26, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.1, marginTop: 6 }}>
                {kpi.value}
              </div>
              <span className="tnum" style={{ fontSize: 13, color: 'var(--muted)' }}>{kpi.sub}</span>
            </Panel>
          ))}
        </div>

        {/* ---- Refine ---- */}
        <RefineBar onRefine={handleRefine} loading={refining} />

        {/* ---- Views ---- */}
        <Tabs
          tabs={[
            { id: 'board', label: 'Board', icon: <LayoutGrid size={15} strokeWidth={1.7} /> },
            { id: 'table', label: 'Table', icon: <Table2 size={15} strokeWidth={1.7} /> },
            { id: 'timeline', label: 'Timeline', icon: <Clock size={15} strokeWidth={1.7} /> },
          ]}
          activeTab={view}
          onChange={id => setView(id as View)}
        />

        {/* ---- Filter row ---- */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Input
            id="board-filter"
            size="sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter stories by title, ID, epic…"
            aria-label="Filter stories"
            leftElement={<Search size={15} strokeWidth={1.7} />}
            rightElement={
              searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear filter"
                  style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0, display: 'inline-flex' }}
                >
                  <X size={14} strokeWidth={2} />
                </button>
              ) : undefined
            }
            style={{ flex: '1 1 260px', maxWidth: 360 }}
          />
          <Select
            size="sm"
            aria-label="Filter by epic"
            value={epicFilter}
            onChange={e => setEpicFilter(e.target.value)}
            options={[{ value: '', label: 'All epics' }, ...plan.epics.map(e => ({ value: e.id, label: `${e.name} (${e.id})` }))]}
            style={{ width: 190 }}
          />
          <Select
            size="sm"
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            options={[
              { value: '', label: 'All priorities' },
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]}
            style={{ width: 150 }}
          />
          <span className="tnum" style={{ fontSize: 13, color: 'var(--muted)' }}>
            {matchCount} of {totalStories} {totalStories === 1 ? 'story' : 'stories'}
          </span>
          {filtersActive && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>

        {/* ---- Bulk action bar ---- */}
        {selectedIds.size > 0 && (
          <div
            style={{
              position: 'sticky',
              top: 'calc(var(--topbar-h) + 8px)',
              zIndex: 400,
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
              background: 'var(--nav)',
              color: 'var(--nav-text)',
              border: '1px solid var(--nav-2)',
              borderRadius: 'var(--radius-lg)',
              padding: '10px 14px',
              boxShadow: 'var(--shadow-2)',
            }}
          >
            <span className="tnum" style={{ fontSize: 13, fontWeight: 600 }}>
              {selectedIds.size} selected
            </span>
            <Button size="sm" variant="secondary" onClick={() => handleBulkDone(true)}>
              Mark done
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleBulkDone(false)}>
              Mark not done
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Select
                size="sm"
                aria-label="Move selected stories to"
                value={bulkTarget}
                onChange={e => setBulkTarget(e.target.value)}
                options={[
                  { value: '', label: 'Move to…' },
                  ...plan.groups.map((g, i) => ({
                    value: String(i),
                    label: g.type === 'sprint' ? `Sprint ${g.number} — ${g.name}` : g.name,
                  })),
                ]}
                style={{ width: 190 }}
              />
              <Button size="sm" variant="secondary" onClick={handleBulkMove} disabled={bulkTarget === ''}>
                Move
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleBulkDelete}
              style={{ background: 'var(--danger)', color: '#FFFFFF' }}
            >
              Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} style={{ color: 'var(--nav-text)', marginLeft: 'auto' }}>
              Clear
            </Button>
          </div>
        )}

        {/* ---- Views content ---- */}
        {view === 'board' && (
          <>
            <EpicLegend epics={plan.epics} plan={plan} />
            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
              <SortableContext items={plan.groups.map((_, i) => `group-${i}`)} strategy={horizontalListSortingStrategy}>
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6, alignItems: 'flex-start' }}>
                  {plan.groups.map((group, i) => (
                    <GroupColumn
                      key={`${group.type}-${group.name}-${i}`}
                      group={group}
                      groupIndex={i}
                      epics={plan.epics}
                      doneColumnIndex={doneColumnIndex}
                      onEditStory={handleEditStory}
                      onDeleteStory={handleDeleteStory}
                      onCyclePoints={handleCyclePoints}
                      onToggleDone={handleToggleDone}
                      onAddStory={handleAddStory}
                      onMoveToDone={handleMoveToDone}
                      onRenameGroup={handleRenameGroup}
                      onDeleteGroup={handleDeleteGroup}
                      onOpenStory={(groupIndex, storyId) => setOpenStory({ groupIndex, storyId })}
                      selectedIds={selectedIds}
                      onToggleSelect={toggleSelect}
                      matchesSearch={matchesSearch}
                    />
                  ))}
                  {showAddGroup ? (
                    <div
                      style={{
                        width: 328,
                        minWidth: 328,
                        background: 'var(--surface)',
                        border: '1px dashed var(--primary)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 12,
                        flexShrink: 0,
                        alignSelf: 'flex-start',
                      }}
                    >
                      <Readout variant="label" size="xs">New {plan.methodology === 'scrum' ? 'sprint' : 'column'}</Readout>
                      <div style={{ marginTop: 8 }}>
                        <Input
                          autoFocus
                          size="sm"
                          value={newGroupName}
                          onChange={e => setNewGroupName(e.target.value)}
                          placeholder={plan.methodology === 'scrum' ? 'Sprint name' : 'Column name'}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddGroup()
                            if (e.key === 'Escape') setShowAddGroup(false)
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <Button variant="primary" onClick={handleAddGroup} size="sm" style={{ flex: 1 }}>
                          Add
                        </Button>
                        <Button variant="ghost" onClick={() => setShowAddGroup(false)} size="sm" style={{ flex: 1 }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddGroup(true)}
                      style={{
                        width: 220,
                        minHeight: 120,
                        border: '1px dashed var(--border-strong)',
                        background: 'transparent',
                        color: 'var(--muted)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        fontSize: 14,
                        fontWeight: 500,
                        borderRadius: 'var(--radius-xl)',
                        flexShrink: 0,
                        alignSelf: 'flex-start',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Plus size={16} strokeWidth={1.7} />
                      Add {plan.methodology === 'scrum' ? 'sprint' : 'column'}
                    </button>
                  )}
                </div>
              </SortableContext>
              <DragOverlay dropAnimation={null}>
                {activeStory ? (
                  <div
                    style={{
                      width: 300,
                      background: 'var(--surface)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-2)',
                      padding: 12,
                      opacity: 0.97,
                    }}
                  >
                    <div className="tnum" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mute)' }}>{activeStory.id}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4, lineHeight: 1.4 }}>{activeStory.title}</div>
                  </div>
                ) : activeGroup ? (
                  <div
                    style={{
                      width: 328,
                      background: 'var(--surface-2)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: 'var(--shadow-2)',
                      padding: 12,
                      opacity: 0.97,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{activeGroup.name}</div>
                    <div className="tnum" style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                      {activeGroup.type === 'sprint' ? `Sprint ${activeGroup.number} · ` : ''}
                      {activeGroup.stories?.length ?? 0} stories
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </>
        )}

        {view === 'table' && (
          <TableView
            plan={plan}
            epics={plan.epics}
            matchesSearch={matchesSearch}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleDone={handleToggleDone}
            onOpenStory={(groupIndex, storyId) => setOpenStory({ groupIndex, storyId })}
          />
        )}

        {view === 'timeline' &&
          (plan.methodology === 'scrum' ? (
            <TimelineStrip
              sprintCount={plan.groups.filter(g => g.type === 'sprint').length}
              sprintLength="2 weeks"
              plan={plan}
            />
          ) : (
            <Panel radius="lg" style={{ padding: 8 }}>
              <EmptyState
                compact
                icon={<Clock size={18} strokeWidth={1.7} />}
                title="No timeline for Kanban"
                description="The timeline view shows sprints. Switch this plan to Scrum to see it."
              />
            </Panel>
          ))}

        <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

        <StoryDrawer
          story={openStoryObj}
          groupLabel={openGroupLabel}
          epics={plan.epics}
          isOpen={!!openStoryObj}
          onClose={() => setOpenStory(null)}
          onEdit={(field, value) => openStory && handleEditStory(openStory.groupIndex, openStory.storyId, field, value)}
          onToggleDone={() => openStory && handleToggleDone(openStory.groupIndex, openStory.storyId)}
          onDelete={() => openStory && handleDeleteStory(openStory.groupIndex, openStory.storyId)}
        />

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title={`Delete “${deleteDialog.groupName}”?`}
          message="Stories inside will be lost. You can undo this straight after."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeleteGroup}
          onCancel={() => setDeleteDialog({ isOpen: false, groupIndex: -1, groupName: '' })}
          danger
        />
      </div>
    </BoardActionsProvider>
  )
}
