import React from 'react'
import { Button } from '@/components/primitives'
import { useNavigate } from 'react-router-dom'
import { footer } from '@/content/landing'

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <div
        style={{
          background: 'var(--primary)',
          borderRadius: 16,
          padding: '56px 24px',
          textAlign: 'center',
          color: 'var(--on-primary)',
          margin: '24px 0 56px',
        }}
      >
        <h2 style={{ color: 'var(--on-primary)', fontSize: 'clamp(26px, 3.4vw, 36px)', margin: 0 }}>{footer.headline}</h2>
        <p style={{ margin: '10px 0 24px', color: 'var(--on-primary)', opacity: 0.9 }}>{footer.sub}</p>
        <Button
          onClick={() => navigate('/new')}
          style={{ background: 'var(--surface)', color: 'var(--primary-text)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {footer.cta}
        </Button>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '22px 0', fontSize: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span>© 2026 Rune. {footer.credit}</span>
          <span>
            <a
              href="https://github.com/zoulevanz23"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit' }}
            >
              GitHub
            </a>
            {' '}&nbsp;{' '}
            <a
              href="https://www.linkedin.com/in/josh-ivan-sartin-312287376/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit' }}
            >
              LinkedIn
            </a>
          </span>
        </div>
      </footer>
    </>
  )
}
