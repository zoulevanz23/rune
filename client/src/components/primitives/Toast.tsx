import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration?: number
  action?: { label: string; onClick: () => void }
}

interface ToastContextType {
  show: (message: string, type?: ToastType, options?: { duration?: number; action?: { label: string; onClick: () => void } }) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, type: ToastType = 'info', options?: { duration?: number; action?: { label: string; onClick: () => void } }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts(prev => {
      const next = [...prev, { id, message, type, duration: options?.duration ?? 2600, action: options?.action }]
      // Max 3 visible toasts
      return next.length > 3 ? next.slice(-3) : next
    })
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const typeIcon: Record<ToastType, React.ReactNode> = {
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
}

const ToastItemComp: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const id = setTimeout(() => onDismiss(toast.id), toast.duration)
      return () => clearTimeout(id)
    }
  }, [toast, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        minWidth: '280px',
        maxWidth: '480px',
        background: 'var(--nav)',
        color: 'var(--nav-text)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-2)',
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        lineHeight: 1.4,
        animation: 'toastSlideUp 0.2s ease',
      }}
    >
      <span style={{ flexShrink: 0, display: 'inline-flex' }}>
        {typeIcon[toast.type]}
      </span>
      <span style={{ flex: 1 }}>
        {toast.message}
      </span>
      {toast.action && (
        <button
          onClick={(e) => { e.stopPropagation(); toast.action!.onClick() }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--primary-text)',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast.action.label}
        </button>
      )}
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '20px',
          height: '20px',
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: 'var(--nav-muted)',
          cursor: 'pointer',
          flexShrink: 0,
          borderRadius: '50%',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItemComp toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toastSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  )
}