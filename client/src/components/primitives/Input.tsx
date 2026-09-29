import React from 'react'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  size?: InputSize
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

const sizeStyles: Record<InputSize, React.CSSProperties> = {
  sm: { fontSize: '13px', padding: '0 10px', height: '32px' },
  md: { fontSize: '14px', padding: '0 12px', height: '38px' },
  lg: { fontSize: '16px', padding: '0 16px', height: '44px' },
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, size = 'md', leftElement, rightElement, style, className, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || `input-${generatedId}`

    const baseInputStyle: React.CSSProperties = {
      fontFamily: 'var(--font-sans)',
      width: '100%',
      border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
      background: error ? 'var(--danger-soft)' : 'var(--surface)',
      color: 'var(--ink)',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)',
      ...sizeStyles[size],
    }

    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      width: '100%',
      ...style,
    }

    return (
      <div style={wrapperStyle} className={className}>
        {label && (
          <label htmlFor={inputId} style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'var(--ink)',
            fontWeight: 500,
          }}>
            {label}
          </label>
        )}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%' }}>
          {leftElement && (
            <span style={{
              position: 'absolute',
              left: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted)',
              pointerEvents: 'none',
            }}>
              {leftElement}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            style={{
              ...baseInputStyle,
              paddingLeft: leftElement ? '36px' : (sizeStyles[size].padding as string).split(' ')[1],
              paddingRight: rightElement ? '36px' : (sizeStyles[size].padding as string).split(' ')[1],
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--primary)'
              e.currentTarget.style.boxShadow = `0 0 0 2px ${error ? 'var(--danger-soft)' : 'var(--primary-soft)'}`
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            {...props}
          />
          {rightElement && (
            <span style={{
              position: 'absolute',
              right: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted)',
            }}>
              {rightElement}
            </span>
          )}
        </div>
        {error && (
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: 'var(--danger-text)',
            fontWeight: 500,
          }}>
            {error}
          </span>
        )}
        {hint && !error && (
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: 'var(--muted)',
          }}>
            {hint}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'