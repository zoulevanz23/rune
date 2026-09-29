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
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-2)',
        ...style,
      }}
    >
      <img
        src={runeImg}
        alt="A wall of handwritten sticky notes"
        loading="eager"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}
