import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/primitives'
import { useNavigate } from 'react-router-dom'
import { hero } from '@/content/landing'

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const plan: [string, [string, string, number][]][] = [
  ['Sprint 1', [['Walker sign-up', 'Accounts', 3], ['Booking flow', 'Booking', 5]]],
  ['Sprint 2', [['Live walk map', 'Tracking', 8], ['In-app payments', 'Payments', 5]]],
  ['Sprint 3', [['Reviews', 'Trust', 3], ['Push alerts', 'Engagement', 2]]],
]

export const LandingHero: React.FC = () => {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [chipText, setChipText] = useState('Waiting')
  const [chipOk, setChipOk] = useState(false)
  const [barActive, setBarActive] = useState(false)
  const [cards, setCards] = useState<JSX.Element[]>([])
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const note = hero.demoNote

  useEffect(() => {
    if (reducedMotion) {
      setText(note)
      setChipText('Ready: 6 stories, 21 pts')
      setChipOk(true)
      return
    }

    let timeout: NodeJS.Timeout
    const runDemo = async () => {
      // Reset
      setText('')
      setChipText('Waiting')
      setChipOk(false)
      setBarActive(false)
      setCards([])

      await new Promise(r => timeout = setTimeout(r, 700))

      // Type text
      setChipText('Describing')
      for (let i = 0; i <= note.length; i++) {
        setText(note.slice(0, i))
        await new Promise(r => timeout = setTimeout(r, 24))
      }

      await new Promise(r => timeout = setTimeout(r, 500))

      // Progress bar
      setChipText('Drafting 3 sprints')
      setBarActive(true)
      await new Promise(r => timeout = setTimeout(r, 1200))

      // Drop cards
      const newCards: JSX.Element[] = []
      let totalPoints = 0
      plan.forEach((sprint, i) => {
        const sprintPts = sprint[1].reduce((sum, s) => sum + s[2], 0)
        totalPoints += sprintPts
        sprint[1].forEach((story, j) => {
          newCards.push(
            <div
              key={`${i}-${j}`}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '9px 10px',
                fontSize: '12.5px',
                color: 'var(--ink)',
                fontWeight: 500,
                animation: 'drop 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.2) both',
                animationDelay: `${i * 0.28 + j * 0.14}s`,
              }}
            >
              {story[0]}
              <small style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, font: '400 11px var(--mono)', color: 'var(--muted)' }}>
                <span>{story[1]}</span>
                <span>{story[2]} pts</span>
              </small>
            </div>
          )
        })
      })
      setCards(newCards)
      setChipText(`Ready: 6 stories, ${totalPoints} pts`)
      setChipOk(true)

      await new Promise(r => timeout = setTimeout(r, 6000))
      runDemo()
    }

    runDemo()
    return () => clearTimeout(timeout)
  }, [reducedMotion, note])

  return (
    <>
      <style>{`
        @keyframes drop {
          from { opacity: 0; transform: translateY(-14px) scale(0.96); }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes sweep {
          to { width: 100%; }
        }
        .caret {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: var(--primary);
          vertical-align: text-bottom;
          margin-left: 1px;
          animation: blink 1s steps(1) infinite;
        }
        .bar-inner {
          display: block;
          height: 100%;
          width: 0;
          background: var(--primary);
        }
        .bar.go .bar-inner {
          animation: sweep 1.1s ease-in-out forwards;
        }
      `}</style>

      <section style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 48, alignItems: 'center', padding: '160px 0 140px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            {hero.title}
          </h1>
          <p style={{ fontSize: 18, margin: '20px 0 28px', maxWidth: '46ch', lineHeight: 1.6, color: 'var(--muted)' }}>
            {hero.subtitle}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={() => navigate('/new')} style={{ minWidth: 210 }}>
              {hero.primaryCta}
            </Button>
            <Button variant="secondary" onClick={() => scrollTo('how')}>
              {hero.secondaryCta}
            </Button>
          </div>
          <ul style={{ margin: '28px 0 0', padding: 0, listStyle: 'none', display: 'flex', gap: '8px 20px', flexWrap: 'wrap', fontSize: 13, color: 'var(--muted)' }}>
            {hero.facts.map((fact, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', marginRight: 8 }} />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            boxShadow: '0 1px 2px rgba(15, 27, 45, 0.06), 0 8px 24px rgba(15, 27, 45, 0.06)',
            overflow: 'hidden',
          }}
          aria-label="Live demo: a description becomes a board"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>
            <span>New plan</span>
            <span
              style={{
                font: '500 12px var(--mono)',
                padding: '3px 10px',
                borderRadius: 999,
                background: chipOk ? 'color-mix(in srgb, var(--success) 16%, transparent)' : 'var(--primary-soft)',
                color: chipOk ? 'var(--success)' : 'var(--primary)',
                transition: 'background 0.3s, color 0.3s',
              }}
            >
              {chipText}
            </span>
          </div>
          <div style={{ padding: 16, minHeight: 96, fontSize: 15, color: 'var(--ink)', borderBottom: '1px solid var(--border)' }}>
            {text}
            {!reducedMotion && <span className="caret" />}
          </div>
          <div className={`bar ${barActive ? 'go' : ''}`} style={{ height: 2, background: 'var(--border)', overflow: 'hidden' }}>
            <span className="bar-inner" />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              padding: 14,
              background: 'var(--bg)',
              minHeight: 230,
            }}
          >
            {plan.map((sprint, i) => (
              <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ margin: '0 0 2px', fontSize: 12, color: 'var(--ink)', display: 'flex', justifyContent: 'space-between' }}>
                  {sprint[0]}
                  <span style={{ fontWeight: 500, color: 'var(--muted)' }}>
                    {sprint[1].reduce((sum, s) => sum + s[2], 0)} pts
                  </span>
                </h4>
                {cards.filter((_, idx) => {
                  const cardIdx = Math.floor(idx / 2)
                  return cardIdx === i
                })}
                {cards.length === 0 && (
                  <>
                    <div style={{ height: 44, borderRadius: 8, border: '1px dashed var(--border)' }} />
                    <div style={{ height: 44, borderRadius: 8, border: '1px dashed var(--border)' }} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
