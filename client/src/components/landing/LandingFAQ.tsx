import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { faq } from '@/content/landing'

export const LandingFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" style={{ scrollMarginTop: 24 }}>
      <SectionHeading title={faq.title} align="center" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 800, margin: '0 auto' }}>
        {faq.items.map((item, i) => {
          const open = openIndex === i
          return (
            <div key={item.q} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-1)' }}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  padding: '14px 20px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--ink)',
                  textAlign: 'left',
                }}
              >
                {item.q}
                <ChevronDown
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    color: 'var(--muted)',
                    transform: open ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--dur-fast) var(--ease)',
                  }}
                />
              </button>
              {open && (
                <p style={{ padding: '0 20px 16px', fontSize: 14, lineHeight: 1.6, color: 'var(--muted)' }}>
                  {item.a}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
