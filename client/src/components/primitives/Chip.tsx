import React from 'react'

export type ChipVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'outline' | 'default' | 'amber' | 'coral' | 'green'
export type ChipSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant
  size?: ChipSize
  pill?: boolean
  removable?: boolean
  onRemove?: () => void
}

export const Chip: React.FC<ChipProps> = ({
  variant = 'neutral',
  size = 'sm',
  pill = false,
  removable,
  onRemove,
  children,
  style,
  className,
  ...props
}) => {
  const getVariantStyles = (v: ChipVariant): React.CSSProperties => {
    switch (v) {
      case 'primary':
      case 'amber':
        return { background: 'var(--primary-soft)', color: 'var(--primary-text)', border: '1px solid transparent' }
      case 'success':
      case 'green':
        return { background: 'var(--success-soft)', color: 'var(--success-text)', border: '1px solid transparent' }
      case 'warning':
        return { background: 'var(--warning-soft)', color: 'var(--warning-text)', border: '1px solid transparent' }
      case 'danger':
      case 'coral':
        return { background: 'var(--danger-soft)', color: 'var(--danger-text)', border: '1px solid transparent' }
      case 'outline':
        return { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--border)' }
      case 'neutral':
      case 'default':
      default:
        return { background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid transparent' }
    }
  }

  const sizeStyles: Record<ChipSize, React.CSSProperties> = {
    xs: { fontSize: '11px', padding: '1px 6px', height: '18px' },
    sm: { fontSize: '12px', padding: '2px 8px', height: '22px' },
    md: { fontSize: '13px', padding: '3px 10px', height: '26px' },
    lg: { fontSize: '14px', padding: '4px 12px', height: '30px' },
  }

  const base: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-sm)',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    boxSizing: 'border-box',
    ...sizeStyles[size],
    ...getVariantStyles(variant),
    ...style,
  }

  return (
    <span {...props} style={base} className={className}>
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '14px',
            height: '14px',
            padding: 0,
            background: 'transparent',
            color: 'currentColor',
            border: 'none',
            cursor: 'pointer',
            opacity: 0.7,
            borderRadius: '50%',
            lineHeight: 1,
          }}
          aria-label="Remove tag"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  )
}