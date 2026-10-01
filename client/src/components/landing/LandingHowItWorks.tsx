import React from 'react'
import { howItWorks } from '@/content/landing'

export const LandingHowItWorks: React.FC = () => (
  <section id="how" style={{ scrollMarginTop: 24, padding: '72px 0' }}>
    <div style={{ maxWidth: '60ch', marginBottom: 32 }}>
      <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 38px)', color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
        {howItWorks.title}
      </h2>
      <p style={{ margin: '12px 0 0', fontSize: 15, color: 'var(--muted)' }}>{howItWorks.subtitle}</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      {howItWorks.steps.map(s => (
        <div
          key={s.n}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 24,
          }}
        >
          <b
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {s.n}
          </b>
          <h3 style={{ fontSize: 18, margin: '0 0 8px', color: 'var(--ink)' }}>{s.title}</h3>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--muted)' }}>{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
)
