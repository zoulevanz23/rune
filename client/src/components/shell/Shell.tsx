import React, { useCallback, useEffect, useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, Plus, FolderOpen, LayoutGrid, Search } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { CommandPalette } from './CommandPalette'

const tabStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  minHeight: 56,
  textDecoration: 'none',
  fontFamily: 'var(--font-sans)',
  fontSize: 11,
  fontWeight: 500,
  color: active ? 'var(--primary-text)' : 'var(--muted)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
})

export const Shell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  const closeSearch = useCallback(() => setSearchOpen(false), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    setSearchOpen(false)
  }, [location.pathname, location.search])

  const tabs = [
    { to: '/', label: 'Home', icon: <Home size={20} strokeWidth={1.7} />, exact: true },
    { to: '/new', label: 'New', icon: <Plus size={20} strokeWidth={1.7} /> },
    { to: '/my-plans', label: 'Plans', icon: <FolderOpen size={20} strokeWidth={1.7} /> },
    { to: '/board', label: 'Board', icon: <LayoutGrid size={20} strokeWidth={1.7} /> },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar onOpenSearch={() => setSearchOpen(true)} />

        <main id="main-content" className="app-shell" style={{ flex: 1 }}>
          {children ?? <Outlet />}
        </main>
      </div>

      <nav
        className="app-tabbar"
        aria-label="Primary"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 600,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          boxShadow: 'var(--shadow-2)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <button type="button" onClick={() => setSearchOpen(true)} aria-label="Open search" style={tabStyle(false)}>
          <Search size={20} strokeWidth={1.7} />
          Search
        </button>
        {tabs.map(tab => (
          <NavLink key={tab.to} to={tab.to} end={tab.exact} style={({ isActive }) => tabStyle(isActive)}>
            {tab.icon}
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <CommandPalette isOpen={searchOpen} onClose={closeSearch} />
    </div>
  )
}
