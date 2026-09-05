import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, style, ...props }, ref) => {
    const base: React.CSSProperties = {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontSize: '0.85rem',
      fontWeight: 500,
      padding: '0.65em 1.2em',
      border: variant === 'primary' ? '1px solid var(--grid-line)' : '1px solid var(--grid-line)',
      background: variant === 'primary' ? 'var(--surface-alt)' : 'transparent',
      color: variant === 'primary' ? 'var(--bright)' : 'var(--fog)',
      cursor: 'pointer',
      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
      letterSpacing: '0.02em',
    }
    return (
      <button ref={ref} style={{ ...base, ...style }} {...props}>
        {children}
      </button>
    )
  }
)
