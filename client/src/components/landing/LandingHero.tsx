import React from 'react'
import { Button } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { useNavigate } from 'react-router-dom'

export const LandingHero: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '68vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.52rem', letterSpacing: '0.08em', color: 'var(--ink-soft)' }}>
        <Readout variant="status" size="xs" style={{ border: '1px solid var(--grid-line)', background: 'var(--surface)', padding: '3px 7px' }}>COORD · 00 · 00</Readout>
        <Readout variant="metric" size="xs" style={{ border: '1px solid var(--grid-line)', background: 'var(--surface)', padding: '3px 7px', color: 'var(--amber)' }}>● INSTRUMENT READY</Readout>
      </div>
      <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.52rem', letterSpacing: '0.08em', color: 'var(--ink-soft)', border: '1px solid var(--grid-line)', background: 'var(--surface)', padding: '3px 7px' }}>GRID 28 · SCALE 1:1 · REV 02</div>

      <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '22rem', lineHeight: 1, color: 'var(--bright)', opacity: 0.03, pointerEvents: 'none', letterSpacing: '-0.06em' }}>01</div>

      <Readout variant="label" size="sm" style={{ marginBottom: '1rem', letterSpacing: '0.18em', border: '1px solid var(--grid-line)', padding: '5px 12px', background: 'var(--surface)', display: 'inline-block' }}>ROUGH IDEA → STRUCTURED PLAN</Readout>

      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 'clamp(3.2rem, 6.5vw, 5.6rem)', lineHeight: 0.88, color: 'var(--bright)', marginBottom: '1rem', letterSpacing: '-0.04em', maxWidth: 920 }}>
        Turn a rough idea<br/>into a sprint plan
      </h1>

      <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '1.14rem', lineHeight: 1.55, color: 'var(--ink-soft)', maxWidth: 680, marginBottom: '1.8rem' }}>
        Rune reads your description and drafts epics, user stories and a board — Scrum or Kanban, same instrument. Edit, reorder, export, refine in plain language.
      </p>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.6rem' }}>
        <Button variant="primary" onClick={() => navigate('/new')} size="lg" style={{ padding: '1.05em 2.2em', fontSize: '0.98rem', minWidth: 220, letterSpacing: '0.02em' }}>
          Start drafting — free
        </Button>
        <a href="#how" onClick={e => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-soft)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
          See how it works
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 7, height: 7, background: 'var(--amber)', clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 280, height: 1, background: 'var(--grid-line)', position: 'relative' }}>
          {[0, 25, 50, 75, 100].map(t => (
            <div key={t} style={{ position: 'absolute', left: `${t}%`, top: -4, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)' }}>
              <div style={{ width: 1, height: 8, background: 'var(--grid-line)' }} />
              <Readout variant="status" size="xs" style={{ marginTop: 2 }}>{t}</Readout>
            </div>
          ))}
        </div>
        <span style={{ width: 7, height: 7, border: '1px solid var(--grid-line)', background: 'transparent' }} />
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: 20, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'var(--ink-soft)', letterSpacing: '0.08em', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span>01 Describe</span><Readout variant="status" size="xs">—</Readout><span>02 Generate</span><Readout variant="status" size="xs">—</Readout><span>03 Work the board</span>
      </div>
    </div>
  )
}