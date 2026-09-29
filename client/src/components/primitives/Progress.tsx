import React from 'react'

export type ProgressTone = 'primary' | 'success' | 'warning' | 'danger'

export interface ProgressProps {
  value: number
  max?: number
  label?: string
  tone?: ProgressTone
  showValue?: boolean
  size?: 'sm' | 'md'
  style?: React.CSSProperties
}

const toneColor: Record<ProgressTone, string> = {
  primary: 'var(--primary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  tone = 'primary',
  showValue = false,
  size = 'md',
  style,
}) => {
  const clamped = Math.max(0, Math.min(value, max))
  const pct = max === 0 ? 0 : Math.round((clamped / max) * 100)
  const height = size === 'sm' ? 6 : 8

  return (
    <div style={{ width: '100%', ...style }}>
      {(label || showValue) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 8,
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--muted)',
            marginBottom: 6,
          }}
        >
          {label && <span>{label}</span>}
          {showValue && <span className="tnum" style={{ color: 'var(--ink)', fontWeight: 500 }}>{pct}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        style={{
          width: '100%',
          height,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--surface-3)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 'var(--radius-pill)',
            background: toneColor[tone],
            transition: 'width var(--dur) var(--ease)',
          }}
        />
      </div>
    </div>
  )
}
