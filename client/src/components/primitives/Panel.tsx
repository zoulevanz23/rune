import React from 'react'

export type PanelVariant = 'surface' | 'surface-2' | 'bg'

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant
  bordered?: boolean
  padded?: boolean
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
}

const variantBg: Record<PanelVariant, string> = {
  surface: 'var(--surface)',
  'surface-2': 'var(--surface-2)',
  bg: 'var(--bg)',
}

const radiusMap: Record<string, string> = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  none: '0',
}

export const Panel: React.FC<PanelProps> = ({
  variant = 'surface',
  bordered = true,
  padded = true,
  radius = 'lg',
  children,
  style,
  className,
  ...props
}) => {
  const base: React.CSSProperties = {
    position: 'relative',
    borderRadius: radiusMap[radius],
    border: bordered ? '1px solid var(--border)' : 'none',
    padding: padded ? 'var(--card-padding)' : 0,
    background: variantBg[variant],
    color: 'var(--ink)',
    boxShadow: 'var(--shadow-1)',
    ...style,
  }

  return (
    <div {...props} style={base} className={className}>
      {children}
    </div>
  )
}