import React from 'react'
import { Panel } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { Button } from '@/components/primitives'
import { Chip } from '@/components/primitives'

const plans = [
  { n: '01', name: 'Free', price: '$0', desc: 'For solo makers and side projects', features: ['Unlimited local plans', 'Scrum & Kanban boards', 'Markdown & CSV export', 'Conversational refine', 'Offline-first (IndexedDB)'], cta: 'Start drafting', variant: 'ghost' as const, highlight: false },
  { n: '02', name: 'Pro', price: '$12', period: '/mo', desc: 'For professional PMs and leads', features: ['Everything in Free', 'Cloud sync across devices', 'Share links (view/edit)', 'Comments & @mentions', 'Plan templates library', 'Priority support'], cta: 'Upgrade to Pro', variant: 'primary' as const, highlight: true },
  { n: '03', name: 'Team', price: '$36', period: '/mo', desc: 'For collaborative teams', features: ['Everything in Pro', 'Team workspace', 'Real-time co-editing', 'Admin controls & audit log', 'SSO (SAML/OIDC)', 'Custom prompt templates'], cta: 'Contact sales', variant: 'ghost' as const, highlight: false },
]

export const LandingPricing: React.FC = () => (
  <div id="pricing" style={{ scrollMarginTop: 24 }}>
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <Readout variant="label" size="xs" style={{ marginBottom: '0.5rem', display: 'block' }}>PRICING — FAIR, TRANSPARENT</Readout>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.75rem', color: 'var(--bright)' }}>Choose your tier</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.1rem', maxWidth: 1000, margin: '0 auto' }}>
      {plans.map(p => (
        <Panel key={p.n} variant="paper" chamfered={true} bordered={true} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', borderColor: p.highlight ? 'var(--amber)' : 'var(--grid-line)', boxShadow: p.highlight ? '0 0 0 1px var(--amber)' : 'none', position: 'relative' }}>
          <Readout variant="label" size="xs" style={{ marginBottom: '0.75rem' }}>{p.n}</Readout>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.02rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>{p.name}</div>
          <Readout variant="status" size="sm" style={{ marginBottom: '1rem', lineHeight: 1.5 }}>{p.desc}</Readout>
          <div style={{ marginBottom: '1.25rem', flex: 1 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '2.5rem', color: 'var(--ink)', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 4 }}>
              {p.price} <Readout variant="status" size="sm">{p.period || ''}</Readout>
            </div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
            {p.features.map((f, i) => (
              <li key={i} style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', lineHeight: 1.45, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ width: 6, height: 6, marginTop: '0.45rem', flexShrink: 0, background: 'var(--amber)', clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 0 100%)' }} />
                {f}
              </li>
            ))}
          </ul>
          <Button variant={p.variant} onClick={() => {}} fullWidth size="md" style={{ marginTop: '1rem' }}>
            {p.cta}
          </Button>
          {p.highlight && <div style={{ position: 'absolute', top: '-1px', left: '-1px', right: '-1px', height: 2, background: 'var(--amber)' }} />}
        </Panel>
      ))}
    </div>
  </div>
)