import React from 'react'
import { Panel } from '@/components/primitives'
import { Readout } from '@/components/primitives'

const capabilities = [
  { code: '01', name: 'EDIT', desc: 'Click any card to rewrite it in place. Title, criteria and points update instantly — the plan is a living workspace, not a one-shot export.', c: 'var(--amber)' },
  { code: '02', name: 'REORDER', desc: 'Drag stories between sprints or columns. WIP badge turns coral as a soft warning when a Kanban column is over limit — never blocks the move.', c: 'var(--coral)' },
  { code: '03', name: 'EXPORT', desc: 'Copy as Markdown for docs or export a Jira-ready CSV. Same data, two formats — no reformatting by hand.', c: 'var(--teal)' },
  { code: '04', name: 'REFINE', desc: 'Ask for changes in plain language — "make sprint 2 about onboarding" — the full plan updates live. One-step undo included.', c: 'var(--violet)' },
  { code: '05', name: 'SAVE', desc: 'Plans persist in your browser via IndexedDB. No account, no backend storage — come back anytime, pick up where you left off.', c: 'var(--sage)' },
]

export const LandingCapabilities: React.FC = () => (
  <div id="caps" style={{ scrollMarginTop: 24 }}>
    <Readout variant="label" size="xs" style={{ marginBottom: '0.8rem', display: 'block' }}>CAPABILITIES — SPEC SHEET</Readout>
    <Panel variant="paper" chamfered={true} bordered={true} style={{ padding: 0 }}>
      {capabilities.map(r => (
        <div key={r.code} style={{ display: 'grid', gridTemplateColumns: '56px 130px 1fr', gap: 14, alignItems: 'center', padding: '0.95rem 1.1rem', borderBottom: '1px solid var(--grid-line)', borderLeft: `3px solid ${r.c}` }}>
          <Readout variant="metric" size="sm" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', color: 'var(--ink)' }}>{r.code}</Readout>
          <Readout variant="label" size="sm" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: '0.82rem', color: 'var(--ink)', letterSpacing: '0.04em' }}>{r.name}</Readout>
          <Readout variant="status" size="sm" style={{ lineHeight: 1.45 }}>{r.desc}</Readout>
        </div>
      ))}
    </Panel>
  </div>
)