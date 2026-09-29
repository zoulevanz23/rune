import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Undo2, Redo2, Download, Sun, Moon, Monitor, Check, ChevronRight } from 'lucide-react'
import { IconButton, Menu, Kbd } from '@/components/primitives'
import { useTheme } from '@/context/ThemeContext'
import { usePlan } from '@/context/PlanContext'
import { useBoardActions } from '@/context/BoardActionsContext'

const pageTitles: Record<string, string> = {
  '/': 'Home',
  '/new': 'New plan',
  '/my-plans': 'My plans',
  '/board': 'Board',
  '/styleguide': 'Style guide',
}

interface TopbarProps {
  onOpenSearch: () => void
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSearch }) => {
  const location = useLocation()
  const { plan } = usePlan()
  const { theme, setTheme } = useTheme()
  const actions = useBoardActions()

  const baseTitle = pageTitles[location.pathname] ?? 'Rune'
  const view = new URLSearchParams(location.search).get('view')
  const viewTitle = view ? view.charAt(0).toUpperCase() + view.slice(1) : null
  const planName =
    location.pathname === '/board' && plan.project_name ? plan.project_name.replace(/\*\*/g, '').trim() : null

  const themeIcon =
    theme === 'dark' ? <Moon size={16} strokeWidth={1.7} /> : theme === 'light' ? <Sun size={16} strokeWidth={1.7} /> : <Monitor size={16} strokeWidth={1.7} />
  const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'

  const crumb = (label: string, isLast: boolean, to?: string) => (
    <React.Fragment key={`${label}-${to ?? 'current'}`}>
      {to && !isLast ? (
        <Link
          to={to}
          style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
        >
          {label}
        </Link>
      ) : (
        <span
          style={{
            color: 'var(--ink)',
            fontSize: 14,
            fontWeight: isLast ? 600 : 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: isLast ? 260 : 180,
          }}
        >
          {label}
        </span>
      )}
      {!isLast && <ChevronRight size={14} strokeWidth={1.7} style={{ color: 'var(--ink-mute)', flexShrink: 0 }} />}
    </React.Fragment>
  )

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        height: 'var(--topbar-h)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
        {crumb(baseTitle, !planName && !viewTitle, location.pathname === '/' ? undefined : '/')}
        {viewTitle && crumb(viewTitle, !planName)}
        {planName && crumb(planName, true)}
      </nav>

      <button
        onClick={onOpenSearch}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          height: 34,
          padding: '0 10px',
          minWidth: 40,
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          color: 'var(--muted)',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--surface-3)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--surface-2)'
        }}
      >
        <Search size={16} strokeWidth={1.7} />
        <span className="topbar-search-label">Search</span>
        <span style={{ display: 'inline-flex', gap: 3, marginLeft: 4 }}>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Undo"
            tooltip="Undo (⌘Z)"
            disabled={!actions.canUndo}
            onClick={actions.undo}
          >
            <Undo2 size={17} strokeWidth={1.7} />
          </IconButton>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Redo"
            tooltip="Redo (⇧⌘Z)"
            disabled={!actions.canRedo}
            onClick={actions.redo}
          >
            <Redo2 size={17} strokeWidth={1.7} />
          </IconButton>

          <Menu
            label="Export"
            trigger={
              <IconButton size="sm" variant="ghost" aria-label="Export">
                <Download size={17} strokeWidth={1.7} />
              </IconButton>
            }
            items={[
              { id: 'md', label: 'Copy Markdown', shortcut: '⌘M', onSelect: actions.exportMarkdown },
              { id: 'csv', label: 'Export CSV', shortcut: '⌘E', onSelect: actions.exportCsv },
              { id: 'pdf', label: 'Export PDF', shortcut: '⌘P', onSelect: actions.exportPdf },
              { id: 'save', label: 'Save plan', shortcut: '⌘S', onSelect: actions.save },
            ]}
          />
        </div>
      )}

      <Menu
        label="Theme"
        trigger={
          <IconButton size="sm" variant="ghost" aria-label={`Theme: ${themeLabel}`}>
            {themeIcon}
          </IconButton>
        }
        items={[
          {
            id: 'light',
            label: (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                Light {theme === 'light' && <Check size={15} strokeWidth={2} />}
              </span>
            ),
            onSelect: () => setTheme('light'),
          },
          {
            id: 'dark',
            label: (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                Dark {theme === 'dark' && <Check size={15} strokeWidth={2} />}
              </span>
            ),
            onSelect: () => setTheme('dark'),
          },
          {
            id: 'system',
            label: (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                System {theme === 'system' && <Check size={15} strokeWidth={2} />}
              </span>
            ),
            onSelect: () => setTheme('system'),
          },
        ]}
      />
    </header>
  )
}
