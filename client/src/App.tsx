import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PlanProvider } from '@/context/PlanContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/components/primitives'
import { LandingPage } from '@/pages/LandingPage'
import { IntakePage } from '@/pages/IntakePage'
import { BoardPage } from '@/pages/BoardPage'
import { MyPlansPage } from '@/pages/MyPlansPage'
import { Shell } from '@/components/shell'
import { StyleguidePage } from '@/pages/StyleguidePage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const AppContent: React.FC = () => {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<LandingPage apiBaseUrl={API_BASE_URL} />} />
        <Route path="/new" element={<IntakePage apiBaseUrl={API_BASE_URL} />} />
        <Route path="/board" element={<BoardPage apiBaseUrl={API_BASE_URL} />} />
        <Route path="/my-plans" element={<MyPlansPage />} />
        <Route path="/styleguide" element={<StyleguidePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Shell>
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