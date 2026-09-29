import React from 'react'
import { Panel } from '@/components/primitives'
import { stats } from '@/content/landing'

export const LandingStats: React.FC = () => (
  <section aria-label="Rune at a glance" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
    {stats.map(s => (
      <Panel key={s.label} radius="lg" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="tnum" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          {s.value}
        </span>
        <span style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--muted)' }}>{s.label}</span>
      </Panel>
    ))}
  </section>
)
