import React from 'react'
import { Pencil, GripVertical, Download, MessageSquare, HardDrive } from 'lucide-react'
import { capabilities } from '@/content/landing'

const icons = [
  <Pencil size={22} strokeWidth={2} key="edit" />,
  <GripVertical size={22} strokeWidth={2} key="reorder" />,
  <Download size={22} strokeWidth={2} key="export" />,
  <MessageSquare size={22} strokeWidth={2} key="refine" />,
  <HardDrive size={22} strokeWidth={2} key="save" />,
]

export const LandingCapabilities: React.FC = () => (
  <section id="caps" style={{ scrollMarginTop: 24, paddingTop: 0 }}>
    <div style={{ maxWidth: '60ch', marginBottom: 32 }}>
      <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 38px)', color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
        {capabilities.title}
      </h2>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
      {capabilities.items.map((item, i) => (
        <div
          key={item.title}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 24,
            gridColumn: i < 2 ? 'span 3' : 'span 2',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(15, 27, 45, 0.06), 0 8px 24px rgba(15, 27, 45, 0.06)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <span style={{ color: 'var(--primary)', marginBottom: 14, display: 'block' }}>{icons[i]}</span>
          <h3 style={{ fontSize: 17, margin: '0 0 6px', color: 'var(--ink)' }}>{item.title}</h3>
          <p style={{ margin: 0, fontSize: 14.5, color: 'var(--muted)' }}>{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
)
