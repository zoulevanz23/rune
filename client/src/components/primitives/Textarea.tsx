import React from 'react'

export type TextareaSize = 'sm' | 'md' | 'lg'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  size?: TextareaSize
}

const sizeStyles: Record<TextareaSize, React.CSSProperties> = {
  sm: { fontSize: '13px', padding: '8px 10px' },
  md: { fontSize: '14px', padding: '10px 12px' },
  lg: { fontSize: '16px', padding: '12px 16px' },
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, size = 'md', style, className, id, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || `textarea-${generatedId}`

    const base: React.CSSProperties = {
      fontFamily: 'var(--font-sans)',
      width: '100%',
      border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
      background: error ? 'var(--danger-soft)' : 'var(--surface)',
      color: 'var(--ink)',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      resize: 'vertical',
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
          <label htmlFor={textareaId} style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'var(--ink)',
            fontWeight: 500,
          }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          style={base}
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

Textarea.displayName = 'Textarea'