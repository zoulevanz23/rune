import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LandingHero, LandingHowItWorks, LandingMethodologies, LandingCapabilities, LandingPricing, LandingFAQ, LandingFooter } from '@/components/landing'
import { Panel } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { Button } from '@/components/primitives'
import { Logo } from '@/components/shared/Logo'
import { RuneImage } from '@/components/shared/RuneImage'

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
  const r1 = useReveal()
  const r2 = useReveal()
  const r3 = useReveal()
  const r4 = useReveal()

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.8rem', paddingBottom: '1.2rem' }}>
      <style>{`html{scroll-behavior:smooth}`}</style>

      {/* NAV */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '0.9rem 0 0.7rem', borderBottom: '1px solid var(--grid-line)', flexWrap: 'wrap' }}>
        <Logo size={64} withWordmark mono="v2 · INSTRUMENT" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href="#how" onClick={e => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.84rem', color: 'var(--ink-soft)', textDecoration: 'none' }}>How it works</a>
          <a href="#methods" onClick={e => { e.preventDefault(); document.getElementById('methods')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.84rem', color: 'var(--ink-soft)', textDecoration: 'none' }}>Methodologies</a>
          <a href="#caps" onClick={e => { e.preventDefault(); document.getElementById('caps')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.84rem', color: 'var(--ink-soft)', textDecoration: 'none' }}>Capabilities</a>
          <a href="#pricing" onClick={e => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.84rem', color: 'var(--ink-soft)', textDecoration: 'none' }}>Pricing</a>
          <Button variant="primary" onClick={() => navigate('/new')} size="md" style={{ padding: '0.55em 1.1em', fontSize: '0.76rem' }}>Start drafting</Button>
        </div>
      </div>

      {/* HERO */}
      <LandingHero />

      {/* IMAGE — Rune static */}
      <div ref={rv} style={{ scrollMarginTop: 24 }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <RuneImage style={{ aspectRatio: '16 / 9', width: '100%' }} />
        </div>
        <div style={{ maxWidth: 980, margin: '0.5rem auto 0', display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.06em', color: 'var(--ink-soft)' }}>
          <span>BOARD PREVIEW — NO FAKE DATA</span><span>FRAME 00</span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <LandingHowItWorks />

      {/* METHODOLOGIES */}
      <LandingMethodologies />

      {/* CAPABILITIES */}
      <LandingCapabilities />

      {/* PRICING */}
      <LandingPricing />

      {/* FAQ */}
      <LandingFAQ />

      {/* CLOSING CTA */}
      <LandingFooter />
    </div>
  )
}