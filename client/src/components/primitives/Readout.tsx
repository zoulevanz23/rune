import React from 'react'

export type ReadoutVariant = 'default' | 'metric' | 'status' | 'label'
export type ReadoutSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ReadoutProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'prefix'> {
  variant?: ReadoutVariant
  size?: ReadoutSize
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const sizeStyles: Record<ReadoutSize, React.CSSProperties> = {
  xs: { fontSize: '12px' },
  sm: { fontSize: '13px' },
  md: { fontSize: '14px' },
  lg: { fontSize: '16px' },
  xl: { fontSize: 'var(--fs-section)', fontWeight: 600, lineHeight: 1 },
}

const variantStyles: Record<ReadoutVariant, React.CSSProperties> = {
  default: { color: 'var(--ink)', fontWeight: 400 },
  metric: { color: 'var(--ink)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  status: { color: 'var(--muted)', fontWeight: 400 },
  label: { color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '11px' },
}

export const Readout: React.FC<ReadoutProps> = ({
  variant = 'default',
  size = 'sm',
  prefix,
  suffix,
  children,
  style,
  className,
  ...props
}) => {
  const base: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  }

  return (
    <span {...props} style={base} className={className}>
      {prefix}
      {children}
      {suffix}
    </span>
  )
}