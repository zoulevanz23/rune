import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Plus, FolderOpen, LayoutGrid, Layers, CalendarRange, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { usePlan } from '@/context/PlanContext'
import logoSrc from '@/design/runnie_logo.png'

const STORAGE_KEY = 'rune-sidebar-collapsed'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
  matchExact?: boolean
}

const itemStyle = (active: boolean, collapsed: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: collapsed ? 'center' : 'flex-start',
  gap: collapsed ? 0 : 10,
  height: 38,
  padding: collapsed ? '0' : '0 12px',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  fontWeight: 500,
  textDecoration: 'none',
  color: active ? '#FFFFFF' : 'var(--nav-text)',
  background: active ? 'var(--nav-active)' : 'transparent',
  transition: 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)',
})

const groupLabel: React.CSSProperties = {
  padding: '0 12px',
  margin: '18px 0 6px',
  fontFamily: 'var(--font-sans)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--nav-muted)',
}

const NavSection: React.FC<{
  label: string
  items: NavItem[]
  location: { pathname: string; search: string }
  collapsed: boolean
}> = ({ label, items, location, collapsed }) => (
  <div>
    {!collapsed && <div style={groupLabel}>{label}</div>}
    <ul style={{ listStyle: 'none', margin: 0, padding: collapsed ? '0' : '0 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map(item => {
        const active = item.matchExact
          ? location.pathname === item.to
          : location.pathname === item.to && !location.search.includes('view=')
        return (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className="app-nav-item"
              style={itemStyle(active, collapsed)}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <span style={{ display: 'inline-flex', flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              )}
            </NavLink>
          </li>
        )
      })}
    </ul>
  </div>
)

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const { plan } = usePlan()
  const isScrum = plan.methodology === 'scrum'

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  const toggleCollapsed = () => {
    setCollapsed(v => {
      const next = !v
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {
        /* storage unavailable */
      }
      return next
    })
  }

  const workspace: NavItem[] = [
    { to: '/', label: 'Home', icon: <Home size={18} strokeWidth={1.7} /> },
    { to: '/new', label: 'New plan', icon: <Plus size={18} strokeWidth={1.7} /> },
    { to: '/my-plans', label: 'My plans', icon: <FolderOpen size={18} strokeWidth={1.7} /> },
  ]

  const currentPlan: NavItem[] = [
    { to: '/board', label: 'Board', icon: <LayoutGrid size={18} strokeWidth={1.7} />, matchExact: true },
    { to: '/board?view=epics', label: 'Epics', icon: <Layers size={18} strokeWidth={1.7} /> },
    ...(isScrum ? [{ to: '/board?view=timeline', label: 'Timeline', icon: <CalendarRange size={18} strokeWidth={1.7} /> } as NavItem] : []),
  ]

  const boardActive =
    location.pathname === '/board' && (location.search.includes('view=epics') || location.search.includes('view=timeline'))

  return (
    <nav
      className="app-sidebar"
      aria-label="Main navigation"
      style={{
        width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        flexDirection: 'column',
        background: 'var(--nav)',
        color: 'var(--nav-text)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0 8px 16px',
        transition: 'width var(--dur) var(--ease)',
      }}
    >
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10,
          padding: collapsed ? 0 : '0 8px',
        }}
      >
        <img src={logoSrc} alt="" width={28} height={28} style={{ width: 28, height: 28, objectFit: 'contain', display: 'block' }} />
        {!collapsed && (
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            Rune
          </span>
        )}
      </div>

      <div>
        <NavSection label="Workspace" items={workspace} location={location} collapsed={collapsed} />
        <div>
          {!collapsed && <div style={groupLabel}>Current plan</div>}
          <ul style={{ listStyle: 'none', margin: 0, padding: collapsed ? '0' : '0 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {currentPlan.map(item => {
              const active =
                item.matchExact
                  ? location.pathname === item.to && !boardActive
                  : item.to.includes('view=epics')
                    ? location.search.includes('view=epics')
                    : location.search.includes('view=timeline')
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="app-nav-item"
                    style={itemStyle(active, collapsed)}
                    aria-current={active ? 'page' : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    <span style={{ display: 'inline-flex', flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && <span style={{ lineHeight: 1 }}>{item.label}</span>}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 10 }}>
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 10,
            width: '100%',
            height: 36,
            padding: collapsed ? 0 : '0 12px',
            background: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--nav-muted)',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
            e.currentTarget.style.color = 'var(--nav-text)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--nav-muted)'
          }}
        >
          {collapsed ? <PanelLeftOpen size={16} strokeWidth={1.7} /> : <PanelLeftClose size={16} strokeWidth={1.7} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </nav>
  )
}
