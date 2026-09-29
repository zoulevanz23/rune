import React from 'react'
import { Panel } from '@/components/primitives'
import { SectionHeading } from './SectionHeading'
import { howItWorks } from '@/content/landing'

export const LandingHowItWorks: React.FC = () => (
  <section id="how" style={{ scrollMarginTop: 24 }}>
    <SectionHeading title={howItWorks.title} kicker={howItWorks.kicker} align="center" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
      {howItWorks.steps.map(s => (
        <Panel key={s.n} radius="lg" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span
            aria-hidden="true"
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-soft)',
              color: 'var(--primary-text)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {s.n}
          </span>
          <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>{s.title}</div>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)' }}>{s.desc}</p>
        </Panel>
      ))}
    </div>
  </section>
)
