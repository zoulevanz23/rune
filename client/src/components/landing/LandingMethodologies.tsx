import React from 'react'
import { Panel } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { Chip } from '@/components/primitives'

export const LandingMethodologies: React.FC = () => (
  <div id="methods" style={{ scrollMarginTop: 24 }}>
    <Readout variant="label" size="xs" style={{ marginBottom: '0.8rem', display: 'block' }}>METHODOLOGIES — ONE INSTRUMENT, TWO MODES</Readout>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem' }}>
      <Panel variant="paper" chamfered={true} bordered={true} style={{ padding: '1.5rem' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.02rem', color: 'var(--ink)', marginBottom: '1rem' }}>Scrum</div>
        <Readout variant="status" size="sm" style={{ display: 'block', lineHeight: 1.5, marginBottom: '1rem' }}>Numbered sprints, sequential. Deepest mode — sprint goals, timeline strip, velocity and scope controls.</Readout>
        <div style={{ display: 'flex', gap: 7 }}>
          {[1, 2, 3].map(n => (
            <Panel key={n} variant="paper" chamfered={true} bordered={true} style={{ flex: 1, padding: '0.6rem', background: '#F4EFE2' }}>
              <Readout variant="metric" size="lg" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.3rem', lineHeight: 1, color: 'var(--ink)' }}>{String(n).padStart(2, '0')}</Readout>
              <Readout variant="label" size="xs" style={{ display: 'block', marginTop: '0.25rem' }}>SPRINT {String(n).padStart(2, '0')}</Readout>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ height: 12, background: '#E8E3D4', border: '1px solid var(--grid-line)' }} />
                <div style={{ height: 12, background: '#E8E3D4', border: '1px solid var(--grid-line)' }} />
              </div>
            </Panel>
          ))}
        </div>
      </Panel>
      <Panel variant="paper" chamfered={true} bordered={true} style={{ padding: '1.5rem' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.02rem', color: 'var(--ink)', marginBottom: '1rem' }}>Kanban</div>
        <Readout variant="status" size="sm" style={{ display: 'block', lineHeight: 1.5, marginBottom: '1rem' }}>Continuous flow. Named columns with WIP limits. No sprints, same board language.</Readout>
        <div style={{ display: 'flex', gap: 7 }}>
          {['Backlog', 'In Progress', 'Review', 'Done'].map((col, idx) => (
            <Panel key={col} variant="paper" chamfered={true} bordered={true} style={{ flex: 1, padding: '0.55rem', background: idx % 2 ? 'var(--surface)' : '#F4EFE2' }}>
              <Readout variant="label" size="xs" style={{ display: 'block', marginBottom: '0.5rem' }}>{col.toUpperCase()}</Readout>
              {idx === 1 && (
                <Chip variant="coral" size="xs" style={{ marginTop: 5 }}>WIP 3</Chip>
              )}
              <div style={{ marginTop: 7, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ height: 12, background: '#E8E3D4', border: '1px solid var(--grid-line)' }} />
                {idx === 0 && <div style={{ height: 12, background: '#E8E3D4', border: '1px solid var(--grid-line)' }} />}
              </div>
            </Panel>
          ))}
        </div>
      </Panel>
    </div>
  </div>
)