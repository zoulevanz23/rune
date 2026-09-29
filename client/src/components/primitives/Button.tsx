import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { fontSize: '13px', padding: '0 12px', minHeight: '30px', height: '30px' },
  md: { fontSize: '14px', padding: '0 16px', minHeight: '36px', height: '36px' },
  lg: { fontSize: '16px', padding: '0 20px', minHeight: '44px', height: '44px' },
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, fullWidth, children, style, disabled, ...props }, ref) => {
    const getVariantStyle = (v: ButtonVariant): React.CSSProperties => {
      switch (v) {
        case 'primary':
          return {
            background: 'var(--primary)',
            color: 'var(--on-primary)',
            border: '1px solid transparent',
          }
        case 'secondary':
          return {
            background: 'var(--surface-2)',
            color: 'var(--ink)',
            border: '1px solid var(--border)',
          }
        case 'ghost':
          return {
            background: 'transparent',
            color: 'var(--ink)',
            border: '1px solid transparent',
          }
        case 'danger':
          return {
            background: 'var(--danger)',
            color: '#FFFFFF',
            border: '1px solid transparent',
          }
      }
    }

    const base: React.CSSProperties = {
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      borderRadius: 'var(--radius-md)',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled || loading ? 0.55 : 1,
      transition: 'background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)',
      whiteSpace: 'nowrap',
      lineHeight: 1,
      outline: 'none',
      ...sizeStyles[size],
      ...getVariantStyle(variant),
      ...style,
    }

    return (
      <button
        ref={ref}
        style={base}
        disabled={disabled || loading}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            if (variant === 'primary') e.currentTarget.style.background = 'var(--primary-hover)'
            else if (variant === 'secondary') {
              e.currentTarget.style.background = 'var(--surface-3)'
              e.currentTarget.style.borderColor = 'var(--border-strong)'
            }
            else if (variant === 'ghost') e.currentTarget.style.background = 'var(--surface-2)'
            else if (variant === 'danger') e.currentTarget.style.background = 'var(--danger-text)'
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            const vStyle = getVariantStyle(variant)
            if (vStyle.background) e.currentTarget.style.background = vStyle.background as string
            if (vStyle.border) e.currentTarget.style.borderColor = (vStyle as any).borderColor || 'transparent'
          }
        }}
        {...props}
      >
        {loading && (
          <span style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
            flexShrink: 0
          }} />
        )}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'