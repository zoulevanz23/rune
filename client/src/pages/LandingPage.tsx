import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { LandingHero, LandingHowItWorks, LandingMethodologies, LandingCapabilities, LandingFAQ, LandingFooter } from '@/components/landing'
import { Button } from '@/components/primitives'
import { Logo } from '@/components/shared/Logo'
import { landingNav } from '@/content/landing'
import { useTheme } from '@/context/ThemeContext'

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
  const { resolvedTheme, setTheme } = useTheme()
  const [howItWorksVisible, setHowItWorksVisible] = useState(false)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHowItWorksVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (howItWorksRef.current) {
      observer.observe(howItWorksRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing">
      <style>{`html{scroll-behavior:smooth}.landing section[id]{scroll-margin-top:76px}`}</style>

      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'color-mix(in srgb, var(--bg) 82%, transparent)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid transparent',
          transition: 'border-color 0.2s',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--marketing-max)',
            margin: '0 auto',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            height: 60,
          }}
        >
          <Logo size={32} withWordmark />
          <nav aria-label="Landing" style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
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
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                transition: 'transform 0.35s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(180deg)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg)' }}
            >
              {resolvedTheme === 'light' ? <Moon size={18} strokeWidth={1.7} /> : <Sun size={18} strokeWidth={1.7} />}
            </button>
            <Button variant="primary" onClick={() => navigate('/new')} size="sm">Start drafting</Button>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        style={{
          maxWidth: 'var(--marketing-max)',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 72,
          paddingTop: 72,
          paddingBottom: 24,
        }}
      >
        <LandingHero />
        <div
          ref={howItWorksRef}
          style={{
            opacity: howItWorksVisible ? 1 : 0,
            transform: howItWorksVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <LandingHowItWorks />
        </div>
        <LandingMethodologies />
        <LandingCapabilities />
        <LandingFAQ />
        <LandingFooter />
      </main>
    </div>
  )
}
