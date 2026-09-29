import React from 'react'

export const SectionHeading: React.FC<{
  title: string
  kicker?: string
  align?: 'left' | 'center'
}> = ({ title, kicker, align = 'left' }) => (
  <div style={{ textAlign: align, marginBottom: 24, maxWidth: 720, marginLeft: align === 'center' ? 'auto' : undefined, marginRight: align === 'center' ? 'auto' : undefined }}>
    {kicker && <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{kicker}</div>}
    <h2 style={{ fontSize: 'var(--fs-section)', fontWeight: 700, lineHeight: 1.2 }}>{title}</h2>
  </div>
)
