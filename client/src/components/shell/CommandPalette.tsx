import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Home, Plus, FolderOpen, LayoutGrid, FileText, Download, Sun, Moon, Monitor, CornerDownLeft } from 'lucide-react'
import { Kbd } from '@/components/primitives'
import { usePlansRepository } from '@/hooks/usePlansRepository'
import { useTheme } from '@/context/ThemeContext'
import { useBoardActions } from '@/context/BoardActionsContext'

interface Result {
  id: string
  group: string
  label: string
  hint?: string
  icon: React.ReactNode
  run: () => void | Promise<void>
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { load, list } = usePlansRepository()
  const { theme, setTheme } = useTheme()
  const actions = useBoardActions()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [plans, setPlans] = useState<{ id: string; projectName?: string; savedAt?: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setQuery('')
    setActive(0)
    let cancelled = false
    list()
      .then(entries => {
        if (!cancelled) setPlans(entries.map(e => ({ id: e.id, projectName: e.projectName, savedAt: e.savedAt })))
      })
      .catch(() => {})
    const id = window.setTimeout(() => inputRef.current?.focus(), 20)
    return () => {
      cancelled = true
      window.clearTimeout(id)
    }
  }, [isOpen, list])

  const openPlan = async (id: string) => {
    const plan = await load(id)
    if (plan) {
      navigate('/board')
      window.dispatchEvent(new CustomEvent('load-plan', { detail: plan }))
    }
    onClose()
  }

  const results = useMemo<Result[]>(() => {
    const nav: Result[] = [
      { id: 'nav-home', group: 'Go to', label: 'Home', icon: <Home size={16} strokeWidth={1.7} />, run: () => { navigate('/'); onClose() } },
      { id: 'nav-new', group: 'Go to', label: 'New plan', icon: <Plus size={16} strokeWidth={1.7} />, run: () => { navigate('/new'); onClose() } },
      { id: 'nav-plans', group: 'Go to', label: 'My plans', icon: <FolderOpen size={16} strokeWidth={1.7} />, run: () => { navigate('/my-plans'); onClose() } },
      { id: 'nav-board', group: 'Go to', label: 'Board', icon: <LayoutGrid size={16} strokeWidth={1.7} />, run: () => { navigate('/board'); onClose() } },
    ]

    const planResults: Result[] = plans.map(p => ({
      id: `plan-${p.id}`,
      group: 'Plans',
      label: p.projectName || 'Untitled plan',
      hint: p.savedAt ? new Date(p.savedAt).toLocaleDateString() : undefined,
      icon: <FileText size={16} strokeWidth={1.7} />,
      run: () => openPlan(p.id),
    }))

    const actionResults: Result[] = [
      {
        id: 'action-theme',
        group: 'Actions',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        icon: theme === 'dark' ? <Sun size={16} strokeWidth={1.7} /> : <Moon size={16} strokeWidth={1.7} />,
        run: () => { setTheme(theme === 'dark' ? 'light' : 'dark'); onClose() },
      },
      ...(actions
        ? ([
            { id: 'action-md', group: 'Actions', label: 'Copy plan as Markdown', icon: <Download size={16} strokeWidth={1.7} />, run: () => { actions.exportMarkdown(); onClose() } },
            { id: 'action-csv', group: 'Actions', label: 'Export plan as CSV', icon: <Download size={16} strokeWidth={1.7} />, run: () => { actions.exportCsv(); onClose() } },
            { id: 'action-pdf', group: 'Actions', label: 'Export plan as PDF', icon: <Download size={16} strokeWidth={1.7} />, run: () => { actions.exportPdf(); onClose() } },
          ] as Result[])
        : []),
    ]

    const all = [...nav, ...planResults, ...actionResults]
    const q = query.trim().toLowerCase()
    if (!q) return all.slice(0, 12)
    return all.filter(r => r.label.toLowerCase().includes(q)).slice(0, 12)
  }, [query, plans, theme, actions, navigate, onClose, setTheme])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    if (!isOpen) return
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive(i => (results.length === 0 ? 0 : (i + 1) % results.length))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive(i => (results.length === 0 ? 0 : (i - 1 + results.length) % results.length))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const chosen = results[active]
        if (chosen) void chosen.run()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [isOpen, results, active, onClose])

  if (!isOpen) return null

  let lastGroup = ''

  return (
    <div
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--overlay)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '12vh 16px 16px',
        animation: 'paletteFade var(--dur-fast) var(--ease)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        style={{
          width: 560,
          maxWidth: '100%',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '70vh',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
          <Search size={18} strokeWidth={1.7} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search plans, pages and actions"
            aria-label="Search plans, pages and actions"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              color: 'var(--ink)',
              minWidth: 0,
            }}
          />
          <Kbd>Esc</Kbd>
        </div>

        <div ref={listRef} style={{ overflowY: 'auto', padding: 6 }}>
          {results.length === 0 && (
            <div style={{ padding: '20px 12px', textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
              No matches for “{query}”
            </div>
          )}
          {results.map((result, i) => {
            const showGroup = result.group !== lastGroup
            lastGroup = result.group
            return (
              <React.Fragment key={result.id}>
                {showGroup && (
                  <div
                    style={{
                      padding: '10px 10px 4px',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                    }}
                  >
                    {result.group}
                  </div>
                )}
                <button
                  data-index={i}
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => void result.run()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '9px 10px',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    background: i === active ? 'var(--surface-2)' : 'transparent',
                    color: 'var(--ink)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ display: 'inline-flex', color: 'var(--muted)', flexShrink: 0 }}>{result.icon}</span>
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {result.label}
                  </span>
                  {result.hint && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{result.hint}</span>}
                  {i === active && <CornerDownLeft size={14} strokeWidth={1.7} style={{ color: 'var(--muted)' }} />}
                </button>
              </React.Fragment>
            )
          })}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 14,
            padding: '8px 14px',
            borderTop: '1px solid var(--border)',
            fontSize: 12,
            color: 'var(--muted)',
            alignItems: 'center',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Kbd>↵</Kbd> open</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Kbd>Esc</Kbd> close</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {theme === 'system' && (
              <>
                <Monitor size={13} strokeWidth={1.7} /> System
              </>
            )}
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes paletteFade { from { opacity: 0; } to { opacity: 1; } }` }} />
    </div>
  )
}
