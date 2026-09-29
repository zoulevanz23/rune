import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PlanProvider } from '@/context/PlanContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/components/primitives'

const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })))
const IntakePage = lazy(() => import('@/pages/IntakePage').then(m => ({ default: m.IntakePage })))
const BoardPage = lazy(() => import('@/pages/BoardPage').then(m => ({ default: m.BoardPage })))
const MyPlansPage = lazy(() => import('@/pages/MyPlansPage').then(m => ({ default: m.MyPlansPage })))
const StyleguidePage = lazy(() => import('@/pages/StyleguidePage').then(m => ({ default: m.StyleguidePage })))
const Shell = lazy(() => import('@/components/shell').then(m => ({ default: m.Shell })))

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const RouteFallback: React.FC = () => (
  <div role="status" aria-label="Loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        border: '3px solid var(--surface-3)',
        borderTopColor: 'var(--primary)',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  </div>
)

const AppContent: React.FC = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage apiBaseUrl={API_BASE_URL} />} />
        <Route element={<Shell />}>
          <Route path="/new" element={<IntakePage apiBaseUrl={API_BASE_URL} />} />
          <Route path="/board" element={<BoardPage apiBaseUrl={API_BASE_URL} />} />
          <Route path="/my-plans" element={<MyPlansPage />} />
          <Route path="/styleguide" element={<StyleguidePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  )
}

const App: React.FC = () => (
  <BrowserRouter>
    <ThemeProvider>
      <PlanProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </PlanProvider>
    </ThemeProvider>
  </BrowserRouter>
)

export default App
