import React from 'react'
import { useLocation } from 'react-router-dom'
import { usePlan } from '@/context/PlanContext'
import { useTheme } from '@/context/ThemeContext'
import { Readout } from '@/components/primitives'
import { Chip } from '@/components/primitives'
import { IconButton } from '@/components/primitives'

const SunIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke={active ? 'var(--amber)' : 'var(--fog)'} strokeWidth="2">
    <circle cx="10" cy="10" r="4" />
    <path d="M10 2v2M10 16v2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M2 10h2M16 10h2M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42" />
  </svg>
)

const MoonIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke={active ? 'var(--amber)' : 'var(--fog)'} strokeWidth="2">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)

const DensityComfortableIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="12" height="4" />
    <rect x="2" y="8" width="12" height="4" />
    <rect x="2" y="14" width="12" height="4" />
  </svg>
)

const DensityCompactIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="1" width="12" height="3" />
    <rect x="2" y="5.5" width="12" height="3" />
    <rect x="2" y="10" width="12" height="3" />
    <rect x="2" y="14.5" width="12" height="3" />
  </svg>
)

export const Topbar: React.FC = () => {
  const { plan } = usePlan()
  const { theme, setTheme, density, setDensity } = useTheme()
  const location = useLocation()
  const onBoard = location.pathname === '/board' && !!plan.project_name

  return (
    <div style={{
      height: 52,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--grid-line)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: '0.95rem',
          color: 'var(--bright)',
        }}>
          {onBoard ? plan.project_name : 'Rune'}
        </span>
        {onBoard && (
          <Chip variant="amber" size="sm">
            {plan.methodology.toUpperCase()}
          </Chip>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Readout variant="status" size="xs">
          {new Date().toISOString().slice(0, 10)}
        </Readout>

        <div style={{ display: 'flex', gap: '0.25rem' }} role="group" aria-label="Theme">
          {(['dark', 'light'] as const).map(t => {
            const active = theme === t
            return (
              <IconButton
                key={t}
                size="sm"
                variant={active ? 'primary' : 'ghost'}
                aria-label={`${t} theme`}
                aria-pressed={active}
                onClick={() => setTheme(t)}
                style={{ borderColor: active ? 'var(--amber)' : 'var(--grid-line)', boxShadow: active ? '0 0 0 1px var(--amber)' : 'none' }}
              >
                {t === 'dark' ? <MoonIcon active={active} /> : <SunIcon active={active} />}
              </IconButton>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.25rem' }} role="group" aria-label="Density">
          {(['comfortable', 'compact'] as const).map(d => {
            const active = density === d
            return (
              <IconButton
                key={d}
                size="sm"
                variant={active ? 'primary' : 'ghost'}
                aria-label={`${d} density`}
                aria-pressed={active}
                onClick={() => setDensity(d)}
                style={{ borderColor: active ? 'var(--amber)' : 'var(--grid-line)' }}
              >
                {d === 'comfortable' ? <DensityComfortableIcon /> : <DensityCompactIcon />}
              </IconButton>
            )
          })}
        </div>
      </div>
    </div>
  )
}