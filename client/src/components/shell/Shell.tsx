import React from 'react'
import { Rail } from './Rail'
import { Topbar } from './Topbar'
import { Outlet } from 'react-router-dom'

interface ShellProps {
  children?: React.ReactNode
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Rail />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />
        <div style={{ flex: 1, padding: '1rem', overflow: 'auto' }}>
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  )
}