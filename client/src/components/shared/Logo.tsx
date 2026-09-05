import React from 'react'
import logoSrc from '@/design/runnie_logo.png'

export const Logo: React.FC<{ size?: number; withWordmark?: boolean; mono?: string; variant?: 'light' | 'dark' }> = ({ size = 38, withWordmark = false, mono, variant = 'light' }) => {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
      <img
        src={logoSrc}
        alt="Rune"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit:'contain', flexShrink:0, display:'block' }}
      />
      {withWordmark && (
        <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
          <span style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'0.95rem', letterSpacing:'0.01em', color: variant==='dark' ? 'var(--ink)' : 'var(--bright)' }}>Rune</span>
          {mono && <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.52rem', letterSpacing:'0.1em', color: variant==='dark' ? 'var(--ink-soft)' : 'var(--fog)' }}>{mono}</span>}
        </div>
      )}
    </div>
  )
}
