import React from 'react'
import runeImg from '@/design/rune_img.jpg'

interface Props {
  style?: React.CSSProperties
  className?: string
}

export const RuneImage: React.FC<Props> = ({ style, className }) => {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--canvas)',
        border: '1px solid var(--grid-line)',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        ...style,
      }}
    >
      <img
        src={runeImg}
        alt="Rune — board preview"
        loading="eager"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <span style={{
        position: 'absolute', top: 8, left: 8,
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.52rem',
        letterSpacing: '0.08em', color: 'var(--fog)',
        background: 'var(--surface-alt)', border: '1px solid var(--grid-line)',
        padding: '2px 6px', pointerEvents: 'none'
      }}>REC · FRAME</span>
      <span style={{
        position: 'absolute', bottom: 8, right: 8,
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.52rem',
        color: 'var(--fog)', pointerEvents: 'none'
      }}>RUNE · V2</span>
    </div>
  )
}
