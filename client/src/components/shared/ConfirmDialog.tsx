import React from 'react'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export const ConfirmDialog: React.FC<Props> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  danger = true
}) => {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--paper)',
        color: 'var(--ink)',
        border: '1px solid var(--grid-line)',
        borderRadius: '12px',
        padding: '1.5rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}>
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: '1.1rem',
          color: 'var(--ink)',
          marginBottom: '0.75rem',
          marginTop: 0,
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: '0.9rem',
          color: 'var(--ink-soft)',
          lineHeight: 1.5,
          marginBottom: '1.5rem',
          margin: 0,
        }}>
          {message}
        </p>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onCancel}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 500,
              padding: '0.6rem 1.2rem',
              border: '1px solid var(--grid-line)',
              background: 'var(--surface-alt)',
              color: 'var(--bright)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface)'
              e.currentTarget.style.borderColor = 'var(--bright)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface-alt)'
              e.currentTarget.style.borderColor = 'var(--grid-line)'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.7rem 1.5rem',
              border: 'none',
              background: danger ? 'var(--coral)' : 'var(--amber)',
              color: '#fff',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: danger ? '0 2px 8px rgba(189, 86, 70, 0.3)' : '0 2px 8px rgba(201, 138, 52, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = danger ? '0 4px 12px rgba(189, 86, 70, 0.4)' : '0 4px 12px rgba(201, 138, 52, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = danger ? '0 2px 8px rgba(189, 86, 70, 0.3)' : '0 2px 8px rgba(201, 138, 52, 0.3)'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}