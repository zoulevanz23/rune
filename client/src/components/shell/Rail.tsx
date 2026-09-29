import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Panel } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { IconButton } from '@/components/primitives'
import logoSrc from '@/design/runnie_logo.png'

const railItems = [
  { path: '/', label: 'Home', icon: 'M3 9l3-3 4 4 5-5 M3 14h12' },
  { path: '/new', label: 'New', icon: 'M9 3v12M3 9h12' },
  { path: '/my-plans', label: 'Plans', icon: 'M4 3h10v12H4z M6 6h6M6 9h6M6 12h4' },
  { path: '/board', label: 'Board', icon: 'M3 3h5v5H3z M10 3h5v5H10z M3 10h5v5H3z M10 10h5v5H10z' },
] as const

export const Rail: React.FC = () => {
  const location = useLocation()

  return (
    <nav
      style={{
        width: 64,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-alt)',
        borderRight: '1px solid var(--grid-line)',
      }}
      aria-label="Main navigation"
    >
      <div style={{
        height: 52,
        borderBottom: '1px solid var(--grid-line)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img src={logoSrc} alt="Rune" width={36} height={36} style={{ width: 36, height: 36, objectFit: 'contain', display: 'block' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0.5rem 0' }}>
        {railItems.map(({ path, label, icon }) => {
          const isActive = location.pathname === path
          return (
            <NavLink
              key={path}
              to={path}
              style={({ isActive: active }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '0.65rem 0.5rem',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.58rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: active ? 'var(--bright)' : 'var(--fog)',
                background: active ? 'var(--surface)' : 'transparent',
                borderLeft: active ? '2px solid var(--amber)' : '2px solid transparent',
                marginLeft: -2,
                transition: 'color 0.12s, background 0.12s, border-color 0.12s',
                position: 'relative',
              })}
              title={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ flexShrink: 0 }}>
                <path d={icon} />
              </svg>
              <span style={{ lineHeight: 1 }}>{label}</span>
            </NavLink>
          )
        })}

        <div style={{ flex: 1 }} />
      </div>

      <div style={{
        padding: '0.75rem',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '0.5rem',
        color: 'var(--fog)',
        textAlign: 'center',
        lineHeight: 1.4,
        borderTop: '1px solid var(--grid-line)',
      }}>
        REV<br/>02
      </div>
    </nav>
  )
}