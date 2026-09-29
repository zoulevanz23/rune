import React from 'react'

export type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  size?: SelectSize
  options: SelectOption[]
  placeholder?: string
}

const sizeStyles: Record<SelectSize, React.CSSProperties> = {
  sm: { fontSize: '13px', padding: '0 32px 0 10px', height: '32px' },
  md: { fontSize: '14px', padding: '0 36px 0 12px', height: '38px' },
  lg: { fontSize: '16px', padding: '0 40px 0 16px', height: '44px' },
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, size = 'md', options, placeholder, style, className, id, ...props }, ref) => {
    const generatedId = React.useId()
    const selectId = id || `select-${generatedId}`

    const base: React.CSSProperties = {
      fontFamily: 'var(--font-sans)',
      width: '100%',
      border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
      background: error ? 'var(--danger-soft)' : 'var(--surface)',
      color: 'var(--ink)',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      appearance: 'none',
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23566275' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 10px center',
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
          <label htmlFor={selectId} style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'var(--ink)',
            fontWeight: 500,
          }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
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
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select'