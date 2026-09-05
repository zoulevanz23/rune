import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  tag?: string
}

export const ChamferPanel: React.FC<Props> = ({ tag, children, style, ...rest }) => {
  return (
    <div
      style={{
        background: 'var(--paper)',
        color: 'var(--ink)',
        border: '1px solid var(--grid-line)',
        clipPath: 'polygon(0 0, calc(100% - var(--chamfer)) 0, 100% var(--chamfer), 100% 100%, 0 100%)',
        position: 'relative',
        ...style,
      }}
      {...rest}
    >
      {children}
      {tag && (
        <span style={{
          position: 'absolute',
          right: '0.6rem',
          bottom: '0.4rem',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.6rem',
          letterSpacing: '0.06em',
          color: 'var(--ink-soft)',
        }}>{tag}</span>
      )}
    </div>
  )
}
