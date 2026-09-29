import React from 'react'

export type IconButtonVariant = 'ghost' | 'secondary' | 'primary' | 'danger'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: IconButtonSize
  variant?: IconButtonVariant
  'aria-label': string
  tooltip?: string
}

const sizeStyles: Record<IconButtonSize, React.CSSProperties> = {
  sm: { width: '30px', height: '30px', minWidth: '30px' },
  md: { width: '36px', height: '36px', minWidth: '36px' },
  lg: { width: '44px', height: '44px', minWidth: '44px' },
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = 'md', variant = 'ghost', 'aria-label': ariaLabel, tooltip, children, style, disabled, ...props }, ref) => {
    const getVariantStyle = (v: IconButtonVariant): React.CSSProperties => {
      switch (v) {
        case 'ghost':
          return { background: 'transparent', color: 'var(--ink)', border: '1px solid transparent' }
        case 'secondary':
          return { background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--border)' }
        case 'primary':
          return { background: 'var(--primary)', color: 'var(--on-primary)', border: '1px solid transparent' }
        case 'danger':
          return { background: 'var(--danger-soft)', color: 'var(--danger-text)', border: '1px solid transparent' }
      }
    }

    const base: React.CSSProperties = {
      fontFamily: 'var(--font-sans)',
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)',
      outline: 'none',
      ...sizeStyles[size],
      ...getVariantStyle(variant),
      ...style,
    }

    return (
      <button
        ref={ref}
        style={base}
        disabled={disabled}
        aria-label={ariaLabel}
        title={tooltip || ariaLabel}
        onMouseEnter={(e) => {
          if (!disabled) {
            if (variant === 'ghost') e.currentTarget.style.background = 'var(--surface-2)'
            else if (variant === 'secondary') {
              e.currentTarget.style.background = 'var(--surface-3)'
              e.currentTarget.style.borderColor = 'var(--border-strong)'
            }
            else if (variant === 'primary') e.currentTarget.style.background = 'var(--primary-hover)'
            else if (variant === 'danger') e.currentTarget.style.background = 'var(--danger)'
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            const vStyle = getVariantStyle(variant)
            e.currentTarget.style.background = vStyle.background as string
            e.currentTarget.style.color = vStyle.color as string
            e.currentTarget.style.borderColor = (vStyle.border as string).split(' ')[2] || 'transparent'
          }
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'