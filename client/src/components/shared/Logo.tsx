import React from 'react'
import logoSrc from '@/design/runnie_logo.png'

export const Logo: React.FC<{ size?: number; withWordmark?: boolean; mono?: string; variant?: 'light' | 'dark' }> = ({ size = 38, withWordmark = false, mono, variant = 'light' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img
        src={logoSrc}
        alt="Rune"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0, display: 'block' }}
      />
      {withWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Rune
          </span>
          {mono && (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, color: 'var(--muted)', marginTop: 2 }}>
              {mono}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
