import React from 'react'
import { Panel } from '@/components/primitives'
import { Pencil, GripVertical, Download, MessageSquare, HardDrive } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { capabilities } from '@/content/landing'

const icons = [
  <Pencil size={18} strokeWidth={1.75} key="edit" />,
  <GripVertical size={18} strokeWidth={1.75} key="reorder" />,
  <Download size={18} strokeWidth={1.75} key="export" />,
  <MessageSquare size={18} strokeWidth={1.75} key="refine" />,
  <HardDrive size={18} strokeWidth={1.75} key="save" />,
]

export const LandingCapabilities: React.FC = () => (
  <section id="caps" style={{ scrollMarginTop: 24 }}>
    <SectionHeading title={capabilities.title} kicker={capabilities.kicker} align="center" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {capabilities.items.map((item, i) => (
        <Panel key={item.title} radius="lg" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span
            aria-hidden="true"
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-soft)',
              color: 'var(--primary-text)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icons[i % icons.length]}
          </span>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{item.title}</div>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)' }}>{item.desc}</p>
        </Panel>
      ))}
    </div>
  </section>
)
