import React, { useState } from 'react'
import { Panel } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { IconButton } from '@/components/primitives'

const faqs = [
  { q: 'What makes Rune different from ChatGPT or Claude?', a: 'Rune is purpose-built for agile planning. It outputs structured, validated JSON that maps directly to a drag-and-drop board with methodology-aware features (sprints/WIP), not prose. You refine conversationally on the board itself, with undo.' },
  { q: 'Do I need an account to use Rune?', a: 'No. Plans save locally in your browser via IndexedDB. You can generate, edit, export, and return later without signing up. Cloud sync and sharing require a Pro account.' },
  { q: 'Can I import the CSV into Jira or Linear?', a: 'Yes. The CSV uses Jira-compatible headers: Summary, Description, Story Points, Priority, Epic Link, Sprint/Column. Import via Jira\'s CSV importer or Linear\'s CSV import.' },
  { q: 'How does the AI generation work?', a: 'Your description + methodology + config goes to a FastAPI backend which calls Gemini 2.5 Flash with a methodology-branched prompt. The response is parsed, validated, and hydrated into the board.' },
  { q: 'Is my data sent to the AI?', a: 'Only the description and config you provide are sent to the backend, which forwards to Google\'s Gemini API. Generated plans are not stored on our servers — they live in your browser (or your Supabase project if you enable cloud sync).' },
  { q: 'Can I self-host Rune?', a: 'Yes. The repo includes Docker Compose for frontend + backend. You\'ll need a Google AI Studio API key. See the deployment guide in /docs.' },
]

export const LandingFAQ: React.FC = () => (
  <div id="faq" style={{ scrollMarginTop: 24 }}>
    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
      <Readout variant="label" size="xs" style={{ marginBottom: '0.5rem', display: 'block' }}>FAQ</Readout>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.75rem', color: 'var(--bright)' }}>Common questions</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 800, margin: '0 auto' }}>
      {faqs.map((faq, i) => (
        <Panel key={i} variant="paper" chamfered={true} bordered={true} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'var(--surface)', borderBottom: '1px solid var(--grid-line)' }}>
            <Readout variant="label" size="xs" style={{ marginRight: '0.5rem', color: 'var(--amber)' }}>{String(i + 1).padStart(2, '0')}</Readout>
            <Readout variant="metric" size="md" style={{ flex: 1, textAlign: 'left' }}>{faq.q}</Readout>
            <IconButton size="sm" variant="ghost" aria-label="Expand" style={{ color: 'var(--fog)' }}>▾</IconButton>
          </div>
          <div style={{ padding: '1rem 1.25rem', background: 'var(--paper)', color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '0.86rem' }}>
            {faq.a}
          </div>
        </Panel>
      ))}
    </div>
  </div>
)