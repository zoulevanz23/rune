import React from 'react'

export interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  variant?: 'underline' | 'segmented' | 'line' | 'enclosed'
  fullWidth?: boolean
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  fullWidth = false,
}) => {
  // Map legacy variant names
  const effectiveVariant = variant === 'line' ? 'underline' : variant === 'enclosed' ? 'segmented' : variant

  if (effectiveVariant === 'segmented') {
    return (
      <div
        role="tablist"
        style={{
          display: 'inline-flex',
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-md)',
        padding: '3px',
        gap: '2px',
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              aria-selected={isActive}
              role="tab"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 500,
                padding: '6px 16px',
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                color: isActive ? 'var(--ink)' : 'var(--muted)',
                background: isActive ? 'var(--surface)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                boxShadow: isActive ? 'var(--shadow-1)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease)',
                opacity: tab.disabled ? 0.5 : 1,
                outline: 'none',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          )
        })}
      </div>
    )
  }

  // Default: underline tabs
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        gap: 0,
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={isActive}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 500,
              padding: '10px 16px',
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              color: tab.disabled ? 'var(--muted)' : isActive ? 'var(--primary-text)' : 'var(--muted)',
              background: 'transparent',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--primary-text)' : '2px solid transparent',
              marginBottom: '-1px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)',
              opacity: tab.disabled ? 0.5 : 1,
              outline: 'none',
              whiteSpace: 'nowrap',
              flex: fullWidth ? 1 : 'none',
              justifyContent: fullWidth ? 'center' : 'flex-start',
            }}
            onMouseEnter={(e) => {
              if (!tab.disabled && !isActive) {
                e.currentTarget.style.color = 'var(--ink)'
              }
            }}
            onMouseLeave={(e) => {
              if (!tab.disabled && !isActive) {
                e.currentTarget.style.color = 'var(--muted)'
              }
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}