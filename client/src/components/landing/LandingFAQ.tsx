import React from 'react'
import { faq } from '@/content/landing'

export const LandingFAQ: React.FC = () => (
  <section id="faq" style={{ scrollMarginTop: 24, paddingTop: 0 }}>
    <div style={{ maxWidth: '60ch', margin: '0 auto 32px' }}>
      <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 38px)', color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em', textAlign: 'center' }}>
        {faq.title}
      </h2>
    </div>
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {faq.items.map((item, i) => (
        <details
          key={item.q}
          open={i === 0}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            marginBottom: 10,
            transition: 'border-color 0.2s',
          }}
        >
          <summary
            style={{
              listStyle: 'none',
              cursor: 'pointer',
              padding: '16px 18px',
              color: 'var(--ink)',
              fontWeight: 600,
              fontSize: 15,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            {item.q}
            <style>{`
              details > summary::-webkit-details-marker {
                display: none;
              }
              details > summary::after {
                content: "";
                width: 8px;
                height: 8px;
                border-right: 2px solid var(--muted);
                border-bottom: 2px solid var(--muted);
                transform: rotate(45deg);
                margin-top: 5px;
                transition: transform 0.25s;
              }
              details[open] > summary::after {
                transform: rotate(225deg);
                margin-top: 8px;
              }
            `}</style>
          </summary>
          <p
            style={{
              margin: 0,
              padding: '0 18px 18px',
              fontSize: 15,
              color: 'var(--muted)',
              animation: 'fadeIn 0.3s',
            }}
          >
            {item.a}
          </p>
        </details>
      ))}
    </div>
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-4px); }
      }
    `}</style>
  </section>
)
