import React from 'react'
import { Panel, Button, Chip } from '@/components/primitives'
import { Check } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { pricing } from '@/content/landing'

export const LandingPricing: React.FC = () => (
  <section id="pricing" style={{ scrollMarginTop: 24 }}>
    <SectionHeading title={pricing.title} kicker={pricing.kicker} align="center" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 1000, margin: '0 auto' }}>
      {pricing.plans.map(p => (
        <Panel
          key={p.name}
          radius="lg"
          style={{
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            borderColor: p.highlight ? 'var(--primary)' : undefined,
            boxShadow: p.highlight ? 'var(--shadow-2)' : undefined,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</div>
            {p.highlight && <Chip variant="primary" size="xs">Most popular</Chip>}
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>{p.desc}</p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '20px 0 4px' }}>
            <span className="tnum" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>{p.price}</span>
            {p.period && <span style={{ fontSize: 14, color: 'var(--muted)' }}>{p.period}</span>}
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {p.features.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, lineHeight: 1.45, color: 'var(--ink)' }}>
                <Check size={15} strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2, color: 'var(--primary-text)' }} />
                {f}
              </li>
            ))}
          </ul>

          <Button
            variant={p.highlight ? 'primary' : 'secondary'}
            fullWidth
            size="md"
            style={{ marginTop: 24 }}
            onClick={() => {}}
          >
            {p.cta}
          </Button>
        </Panel>
      ))}
    </div>
  </section>
)
