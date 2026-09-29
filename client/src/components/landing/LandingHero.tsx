import React from 'react'
import { Button } from '@/components/primitives'
import { Chip } from '@/components/primitives'
import { useNavigate } from 'react-router-dom'
import { hero } from '@/content/landing'

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export const LandingHero: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 8px 40px', gap: 16 }}>
      <Chip variant="primary" size="sm">{hero.eyebrow}</Chip>

      <h1 style={{ fontSize: 'var(--fs-hero)', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.02em', maxWidth: 900 }}>
        {hero.titleTop}
        <br />
        {hero.titleBottom}
      </h1>

      <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 640 }}>
        {hero.subtitle}
      </p>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
        <Button variant="primary" onClick={() => navigate('/new')} size="lg" style={{ minWidth: 210 }}>
          {hero.primaryCta}
        </Button>
        <a
          href="#how"
          onClick={e => { e.preventDefault(); scrollTo('how') }}
          style={{ fontSize: 14, fontWeight: 500, color: 'var(--primary-text)', textUnderlineOffset: 4, textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color var(--dur-fast) var(--ease)' }}
          onMouseEnter={e => { e.currentTarget.style.textDecorationColor = 'currentColor' }}
          onMouseLeave={e => { e.currentTarget.style.textDecorationColor = 'transparent' }}
        >
          {hero.secondaryCta}
        </a>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
        {hero.steps.map((s, i) => (
          <React.Fragment key={s}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--surface-2)',
                  color: 'var(--muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {i + 1}
              </span>
              {s}
            </span>
            {i < hero.steps.length - 1 && <span aria-hidden="true" style={{ color: 'var(--border-strong)' }}>—</span>}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}
