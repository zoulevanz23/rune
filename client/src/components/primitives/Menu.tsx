import React, { useEffect, useId, useRef, useState } from 'react'

export interface MenuItem {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  onSelect?: () => void
}

export interface MenuProps {
  trigger: React.ReactElement
  items: MenuItem[]
  align?: 'start' | 'end'
  label?: string
}

export const Menu: React.FC<MenuProps> = ({ trigger, items, align = 'end', label }) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const triggerEl = React.cloneElement(trigger, {
    ref: triggerRef,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: (e: React.MouseEvent) => {
      ;(trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e)
      setOpen(v => !v)
    },
  } as Partial<unknown> as never)

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {triggerEl}
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [align === 'end' ? 'right' : 'left']: 0,
            minWidth: 200,
            maxWidth: 300,
            padding: 6,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-2)',
            zIndex: 900,
            animation: 'menuFadeIn var(--dur-fast) var(--ease)',
          }}
        >
          {items.map(item => (
            <button
              key={item.id}
              role="menuitem"
              type="button"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false)
                item.onSelect?.()
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 10px',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                textAlign: 'left',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                color: item.danger ? 'var(--danger-text)' : 'var(--ink)',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
                transition: 'background var(--dur-fast) var(--ease)',
              }}
              onMouseEnter={e => {
                if (!item.disabled) e.currentTarget.style.background = 'var(--surface-2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {item.icon && <span style={{ display: 'inline-flex', color: 'var(--muted)' }}>{item.icon}</span>}
              <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
              {item.shortcut && (
                <span className="tnum" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{item.shortcut}</span>
              )}
            </button>
          ))}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes menuFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
          `}} />
        </div>
      )}
    </div>
  )
}
