import React from 'react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  secondaryAction?: React.ReactNode
  compact?: boolean
  style?: React.CSSProperties
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact,
  style,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 8,
      padding: compact ? '24px 16px' : '48px 24px',
      fontFamily: 'var(--font-sans)',
      color: 'var(--ink)',
      ...style,
    }}
  >
    {icon && (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: compact ? 36 : 44,
          height: compact ? 36 : 44,
          marginBottom: 4,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          color: 'var(--muted)',
        }}
      >
        {icon}
      </div>
    )}
    <div style={{ fontSize: compact ? 14 : 16, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
    {description && (
      <div style={{ fontSize: compact ? 13 : 14, lineHeight: 1.5, color: 'var(--muted)', maxWidth: 420 }}>
        {description}
      </div>
    )}
    {(action || secondaryAction) && (
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {action}
        {secondaryAction}
      </div>
    )}
  </div>
)

export interface KbdProps {
  children: React.ReactNode
  size?: 'sm' | 'md'
}

export const Kbd: React.FC<KbdProps> = ({ children, size = 'sm' }) => (
  <kbd
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: size === 'sm' ? 20 : 24,
      height: size === 'sm' ? 20 : 24,
      padding: '0 6px',
      fontFamily: 'var(--font-sans)',
      fontSize: size === 'sm' ? 11 : 12,
      fontWeight: 500,
      color: 'var(--muted)',
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderBottomWidth: 2,
      borderRadius: 'var(--radius-sm)',
      lineHeight: 1,
      boxSizing: 'border-box',
    }}
  >
    {children}
  </kbd>
)
