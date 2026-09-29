import React, { useState, useRef, useEffect } from 'react'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const positionStyles = {
  top: { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
  bottom: { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
  left: { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
  right: { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
}) => {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const childRef = useRef<HTMLElement>(null)

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay)
  }

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
  }

  useEffect(() => {
    const node = childRef.current
    if (!node) return
    node.addEventListener('mouseenter', show)
    node.addEventListener('focus', show)
    node.addEventListener('mouseleave', hide)
    node.addEventListener('blur', hide)
    return () => {
      node.removeEventListener('mouseenter', show)
      node.removeEventListener('focus', show)
      node.removeEventListener('mouseleave', hide)
      node.removeEventListener('blur', hide)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [delay])

  const child = React.isValidElement(children) ? children : <span>{children}</span>

  return (
    <span
      ref={childRef}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {React.cloneElement(child, {
        onMouseEnter: (e: React.MouseEvent) => { show(); child.props.onMouseEnter?.(e) },
        onMouseLeave: (e: React.MouseEvent) => { hide(); child.props.onMouseLeave?.(e) },
        onFocus: (e: React.FocusEvent) => { show(); child.props.onFocus?.(e) },
        onBlur: (e: React.FocusEvent) => { hide(); child.props.onBlur?.(e) },
      })}
      {visible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            ...positionStyles[position],
            zIndex: 100,
            background: 'var(--nav)',
            color: 'var(--nav-text)',
            padding: '6px 10px',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-2)',
            pointerEvents: 'none',
            animation: 'tooltipFadeIn 0.12s ease',
          }}
        >
          {content}
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tooltipFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}} />
    </span>
  )
}