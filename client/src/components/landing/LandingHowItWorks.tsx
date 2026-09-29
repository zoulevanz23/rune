import React from 'react'
import { Panel } from '@/components/primitives'
import { Readout } from '@/components/primitives'

const steps = [
  { n: '01', t: 'Describe the app, in plain language', d: 'Paste a rough paragraph. No template to fill, no fields to map — just how you would explain it to a teammate.' },
  { n: '02', t: 'Get epics and user stories back', d: 'Structured epics with risks and definition of done. Stories with criteria, points and dependencies — validated JSON, not prose.' },
  { n: '03', t: 'See it laid out as a board', d: 'Sprint plan or Kanban flow, same language. Drag to reorder, edit in place, export to Markdown or CSV.' },
]

const accent = ['var(--amber)', 'var(--coral)', 'var(--teal)', 'var(--violet)', 'var(--sage)']

export const LandingHowItWorks: React.FC = () => (
  <div id="how" style={{ scrollMarginTop: 24 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: 12 }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.65rem', color: 'var(--bright)' }}>How it works</div>
      <Readout variant="label" size="xs">THREE STEPS — NO TEMPLATES</Readout>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.1rem' }}>
      {steps.map((s, i) => (
        <Panel key={s.n} variant="paper" chamfered={true} bordered={true} style={{ padding: '1.6rem 1.3rem 1.4rem', borderLeft: `3px solid ${accent[i % accent.length]}` }}>
          <Readout variant="metric" size="xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.9rem', lineHeight: 1, color: 'var(--ink)' }}>{s.n}</Readout>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.98rem', color: 'var(--ink)', marginTop: '0.7rem', lineHeight: 1.3 }}>{s.t}</div>
          <Readout variant="status" size="sm" style={{ display: 'block', lineHeight: 1.55, marginTop: '0.55rem' }}>{s.d}</Readout>
        </Panel>
      ))}
    </div>
  </div>
)