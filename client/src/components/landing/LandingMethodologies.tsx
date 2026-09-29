import React from 'react'
import { Panel, Chip } from '@/components/primitives'
import { SectionHeading } from './SectionHeading'
import { methodologies } from '@/content/landing'

const bar = (w: string): React.CSSProperties => ({
  height: 8,
  width: w,
  background: 'var(--surface-3)',
  borderRadius: 'var(--radius-pill)',
})

const miniCard: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  background: 'var(--surface-2)',
  borderRadius: 'var(--radius-md)',
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

export const LandingMethodologies: React.FC = () => (
  <section id="methods" style={{ scrollMarginTop: 24 }}>
    <SectionHeading title={methodologies.title} kicker={methodologies.kicker} align="center" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
      <Panel radius="lg" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{methodologies.scrum.title}</div>
          <Chip variant="primary" size="xs">Sprints</Chip>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)', marginBottom: 16 }}>
          {methodologies.scrum.desc}
        </p>
        <div style={{ display: 'flex', gap: 8 }} aria-hidden="true">
          {methodologies.scrum.sprints.map((s, i) => (
            <div key={s} style={miniCard}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{s}</div>
              <div style={bar(i === 0 ? '80%' : i === 1 ? '60%' : '40%')} />
              <div style={bar(i === 0 ? '55%' : '70%')} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel radius="lg" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{methodologies.kanban.title}</div>
          <Chip variant="neutral" size="xs">Continuous flow</Chip>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)', marginBottom: 16 }}>
          {methodologies.kanban.desc}
        </p>
        <div style={{ display: 'flex', gap: 8 }} aria-hidden="true">
          {methodologies.kanban.columns.map((c, i) => (
            <div key={c} style={miniCard}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c}</div>
              {i === 1 && <Chip variant="warning" size="xs" style={{ alignSelf: 'flex-start' }}>{methodologies.kanban.wip}</Chip>}
              <div style={bar('75%')} />
              {i === 0 && <div style={bar('55%')} />}
              {i === 3 && <div style={bar('65%')} />}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  </section>
)
