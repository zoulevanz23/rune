import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom'
import { PlanProvider, usePlan } from '@/context/PlanContext'
import { LandingPage } from '@/pages/LandingPage'
import { IntakePage } from '@/pages/IntakePage'
import { BoardPage } from '@/pages/BoardPage'
import { MyPlansPage } from '@/pages/MyPlansPage'
import { RegistrationFrame } from '@/components/shared/RegistrationFrame'
import logoSrc from '@/design/runnie_logo.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const Rail: React.FC = () => {
  const linkStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '16px 6px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.58rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: active ? 'var(--bright)' : 'var(--fog)',
    background: active ? 'var(--surface)' : 'transparent',
    borderLeft: active ? '2px solid var(--amber)' : '2px solid transparent',
    textDecoration: 'none',
  })
  const icon = (d: string) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d={d} />
    </svg>
  )
  return (
    <nav style={{
      width: 64,
      background: 'var(--surface-alt)',
      borderRight: '1px solid var(--grid-line)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      flexShrink: 0,
    }}>
      <div style={{ height: 52, borderBottom: '1px solid var(--grid-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={logoSrc} alt="Rune" width={36} height={36} style={{ width:36, height:36, objectFit:'contain', display:'block' }} />
      </div>
      <NavLink to="/" style={({ isActive }) => linkStyle(isActive)}>{icon("M3 3h12v12H3z")} <span>Home</span></NavLink>
      <NavLink to="/new" style={({ isActive }) => linkStyle(isActive)}>{icon("M3 5h12M3 9h12M3 13h8")} <span>New</span></NavLink>
      <NavLink to="/my-plans" style={({ isActive }) => linkStyle(isActive)}>{icon("M4 3h10v12H4z M6 6h6M6 9h6M6 12h4")} <span>Plans</span></NavLink>
      <NavLink to="/board" style={({ isActive }) => linkStyle(isActive)}>{icon("M3 4h5v5H3z M10 4h5v5H10z M3 11h5v5H3z M10 11h5v5H10z")} <span>Board</span></NavLink>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.5rem', color: 'var(--fog)', textAlign: 'center', lineHeight: 1.4 }}>REV<br/>02</div>
    </nav>
  )
}

const Topbar: React.FC = () => {
  const { plan } = usePlan()
  const loc = useLocation()
  const title = plan.project_name || 'Rune'
  const onBoard = loc.pathname === '/board' && !!plan.project_name
  return (
    <div style={{
      height: 52,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--grid-line)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: 'var(--bright)' }}>{onBoard ? title : 'Rune'}</span>
        {onBoard && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', padding: '2px 6px', border: '1px solid var(--grid-line)', color: 'var(--fog)' }}>{plan.methodology.toUpperCase()}</span>}
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: 'var(--fog)', letterSpacing: '0.06em' }}>{new Date().toISOString().slice(0,10)}</span>
    </div>
  )
}

const AppContent: React.FC = () => {
  const { dispatch } = usePlan()

  React.useEffect(() => {
    const handler = (e: CustomEvent) => {
      dispatch({ type: 'SET_PLAN', payload: e.detail })
    }
    window.addEventListener('load-plan', handler as EventListener)
    return () => window.removeEventListener('load-plan', handler as EventListener)
  }, [dispatch])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Rail />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />
        <div style={{ flex: 1, padding: '14px 12px', overflow: 'auto' }}>
          <RegistrationFrame style={{ padding: '12px' }}>
            <Routes>
              <Route path="/" element={<LandingPage apiBaseUrl={API_BASE_URL} />} />
              <Route path="/new" element={<IntakePage apiBaseUrl={API_BASE_URL} />} />
              <Route path="/board" element={<BoardPage apiBaseUrl={API_BASE_URL} />} />
              <Route path="/my-plans" element={<MyPlansPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </RegistrationFrame>
        </div>
      </div>
    </div>
  )
}

const App: React.FC = () => (
  <BrowserRouter>
    <PlanProvider>
      <AppContent />
    </PlanProvider>
  </BrowserRouter>
)

export default App
