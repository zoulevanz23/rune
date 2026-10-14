import React from 'react'
import { methodologies } from '@/content/landing'

export const LandingMethodologies: React.FC = () => {
  return (
    <section id="modes" style={{ scrollMarginTop: 24, paddingTop: 0 }}>
      <div style={{ maxWidth: '60ch', marginBottom: 32 }}>
        <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 38px)', color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
          {methodologies.title}
        </h2>
        <p style={{ margin: '12px 0 0', fontSize: 15, color: 'var(--muted)' }}>{methodologies.subtitle}</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        {methodologies.items.map((m) => (
          <div
            key={m.name}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '16px 18px',
              boxShadow: '0 1px 2px rgba(15, 27, 45, 0.06)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(15, 27, 45, 0.06), 0 8px 24px rgba(15, 27, 45, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(15, 27, 45, 0.06)'
            }}
          >
            <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{m.name}</h3>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--muted)' }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
