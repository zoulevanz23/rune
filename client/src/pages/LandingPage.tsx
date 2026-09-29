import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LandingHero, LandingHowItWorks, LandingMethodologies, LandingCapabilities, LandingPricing, LandingFAQ, LandingFooter } from '@/components/landing'
import { Button } from '@/components/primitives'
import { Logo } from '@/components/shared/Logo'
import { RuneImage } from '@/components/shared/RuneImage'
import { landingNav, preview } from '@/content/landing'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(14px)'
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

export const LandingPage: React.FC<{ apiBaseUrl: string }> = () => {
  const navigate = useNavigate()
  const rv = useReveal()

  return (
    <div style={{ maxWidth: 'var(--marketing-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 56, paddingBottom: 24 }}>
      <style>{`html{scroll-behavior:smooth}`}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '12px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <Logo size={36} withWordmark />
        <nav aria-label="Landing" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {landingNav.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={e => { e.preventDefault(); document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
            >
              {link.label}
            </a>
          ))}
          <Button variant="primary" onClick={() => navigate('/new')} size="sm">Start drafting</Button>
        </nav>
      </div>

      <LandingHero />

      <div ref={rv} style={{ maxWidth: 880, margin: '0 auto', width: '100%' }}>
        <RuneImage style={{ aspectRatio: '16 / 9', width: '100%' }} />
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>{preview.caption}</p>
      </div>

      <LandingHowItWorks />
      <LandingMethodologies />
      <LandingCapabilities />
      <LandingPricing />
      <LandingFAQ />
      <LandingFooter />
    </div>
  )
}
