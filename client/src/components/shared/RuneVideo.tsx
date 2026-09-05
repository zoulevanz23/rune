import React, { useEffect, useRef } from 'react'
import runeVid from '@/design/rune_vid.mp4'

interface Props {
  className?: string
  style?: React.CSSProperties
}

export const RuneVideo: React.FC<Props> = ({ className, style }) => {
  const vRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = vRef.current
    if (!v) return
    // only fetch metadata until in view, then play
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    }, { threshold: 0.15 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--canvas)',
        border: '1px solid var(--grid-line)',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        contain: 'content',
        contentVisibility: 'auto',
        ...style,
      }}
    >
      <video
        ref={vRef}
        src={runeVid}
        loop
        muted
        playsInline
        preload="metadata"
        autoPlay={false}
        controls={false}
        disablePictureInPicture
        onContextMenu={e => e.preventDefault()}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none', willChange: 'auto' }}
      />
      <span style={{
        position: 'absolute', top: 8, left: 8,
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.52rem',
        letterSpacing: '0.08em', color: 'var(--fog)',
        background: 'var(--surface-alt)', border: '1px solid var(--grid-line)',
        padding: '2px 6px', pointerEvents: 'none'
      }}>REC · LOOP</span>
      <span style={{
        position: 'absolute', bottom: 8, right: 8,
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.52rem',
        color: 'var(--fog)', pointerEvents: 'none'
      }}>RUNE · V2</span>
    </div>
  )
}
