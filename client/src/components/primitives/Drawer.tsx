import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export type DrawerSide = 'right' | 'left'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  width?: number | string
  side?: DrawerSide
  ariaLabel?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = 420,
  side = 'right',
  ariaLabel,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    previousActiveElement.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      previousActiveElement.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onMouseDown={e => {
        if (e.target === overlayRef.current) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--overlay)',
        zIndex: 1000,
        animation: 'drawerFadeIn var(--dur-fast) var(--ease)',
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || (typeof title === 'string' ? title : undefined)}
        style={{
          position: 'absolute',
          top: 0,
          [side]: 0,
          height: '100%',
          width: typeof width === 'number' ? `${width}px` : width,
          maxWidth: '100vw',
          background: 'var(--surface)',
          borderLeft: side === 'right' ? '1px solid var(--border)' : 'none',
          borderRight: side === 'left' ? '1px solid var(--border)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          boxShadow: 'var(--shadow-2)',
          animation: `drawerSlide${side === 'right' ? 'Right' : 'Left'} var(--dur-slow) var(--ease)`,
        }}
      >
        {(title || description) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {title && (
                <h2
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--muted)', margin: '4px 0 0' }}>
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close panel"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                flexShrink: 0,
                border: '1px solid transparent',
                background: 'transparent',
                color: 'var(--muted)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'background var(--dur-fast) var(--ease)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--surface-2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <X size={18} strokeWidth={1.7} />
            </button>
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>{children}</div>

        {footer && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            {footer}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drawerFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes drawerSlideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes drawerSlideLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}} />
    </div>
  )
}
