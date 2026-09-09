import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChamferPanel } from '@/components/shared/ChamferPanel'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/shared/Button'
import { RuneImage } from '@/components/shared/RuneImage'

const accent = ['var(--amber)','var(--coral)','var(--teal)','var(--violet)','var(--sage)']

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
    <div style={{ maxWidth: 1320, margin: '0 auto', display:'flex', flexDirection:'column', gap: '2.8rem', paddingBottom:'1.2rem' }}>
      <style>{`html{scroll-behavior:smooth}`}</style>
      {/* NAV */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '0.9rem 0 0.7rem', borderBottom: '1px solid var(--grid-line)', flexWrap:'wrap' }}>
        <Logo size={64} withWordmark mono="v2 · INSTRUMENT" />
        <div style={{ display:'flex', alignItems:'center', gap: 22 }}>
          <a href="#how" onClick={e=>{e.preventDefault(); document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}} style={{ fontFamily:"'IBM Plex Sans', sans-serif", fontSize:'0.84rem', color:'var(--fog)', textDecoration:'none' }}>How it works</a>
          <a href="#methods" onClick={e=>{e.preventDefault(); document.getElementById('methods')?.scrollIntoView({behavior:'smooth'})}} style={{ fontFamily:"'IBM Plex Sans', sans-serif", fontSize:'0.84rem', color:'var(--fog)', textDecoration:'none' }}>Methodologies</a>
          <a href="#caps" onClick={e=>{e.preventDefault(); document.getElementById('caps')?.scrollIntoView({behavior:'smooth'})}} style={{ fontFamily:"'IBM Plex Sans', sans-serif", fontSize:'0.84rem', color:'var(--fog)', textDecoration:'none' }}>Capabilities</a>
          <Button variant="primary" onClick={()=>navigate('/new')} style={{ padding:'0.55em 1.1em', fontSize:'0.76rem' }}>Start drafting</Button>
        </div>
      </div>

      {/* HERO — ONLY this is visible on initial load, tightened */}
      <div style={{ minHeight:'68vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'1rem 1rem 0.5rem', position:'relative' }}>
        {/* unique: corner instrument readouts */}
        <div style={{ position:'absolute', top:8, left:0, display:'flex', gap:6, fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.52rem', letterSpacing:'0.08em', color:'var(--fog)' }}>
          <span style={{ border:'1px solid var(--grid-line)', background:'var(--surface)', padding:'3px 7px' }}>COORD · 00 · 00</span>
          <span style={{ border:'1px solid var(--grid-line)', background:'var(--surface)', padding:'3px 7px', color:'var(--amber)' }}>● INSTRUMENT READY</span>
        </div>
        <div style={{ position:'absolute', top:8, right:0, fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.52rem', letterSpacing:'0.08em', color:'var(--fog)', border:'1px solid var(--grid-line)', background:'var(--surface)', padding:'3px 7px' }}>GRID 28 · SCALE 1:1 · REV 02</div>
        {/* faint large backdrop numeral */}
        <div style={{ position:'absolute', top:'46%', left:'50%', transform:'translate(-50%,-50%)', fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'22rem', lineHeight:1, color:'var(--bright)', opacity:0.03, pointerEvents:'none', letterSpacing:'-0.06em' }}>01</div>

        <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', letterSpacing:'0.18em', color:'var(--fog)', marginBottom:'1.1rem', border:'1px solid var(--grid-line)', padding:'5px 12px', background:'var(--surface)', display:'inline-block' }}>ROUGH IDEA → STRUCTURED PLAN</div>
        <h1 style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'clamp(3.2rem, 6.5vw, 5.6rem)', lineHeight:0.88, color:'var(--bright)', marginBottom:'1rem', letterSpacing:'-0.04em', maxWidth: 920 }}>
          Turn a rough idea<br/>into a sprint plan
        </h1>
        <p style={{ fontFamily:"'IBM Plex Sans', sans-serif", fontSize:'1.14rem', lineHeight:1.55, color:'var(--fog)', maxWidth: 680, marginBottom:'1.8rem' }}>
          Rune reads your description and drafts epics, user stories and a board — Scrum or Kanban, same instrument. Edit, reorder, export, refine in plain language.
        </p>
        <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap', justifyContent:'center' }}>
          <Button variant="primary" onClick={()=>navigate('/new')} style={{ padding:'1.05em 2.2em', fontSize:'0.98rem', minWidth: 220, letterSpacing:'0.02em' }}>Start drafting — free</Button>
          <a href="#how" onClick={e=>{e.preventDefault(); document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}} style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.7rem', color:'var(--fog)', textDecoration:'underline', textUnderlineOffset:4 }}>See how it works</a>
        </div>
        {/* unique: drafting scale bar */}
        <div style={{ marginTop:'1.6rem', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:7, height:7, background:'var(--amber)', clipPath:'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)' }} />
          <div style={{ display:'flex', alignItems:'center', gap:0, width: 280, height:1, background:'var(--grid-line)', position:'relative' }}>
            {[0,25,50,75,100].map(t=>(
              <div key={t} style={{ position:'absolute', left:`${t}%`, top:-4, display:'flex', flexDirection:'column', alignItems:'center', transform:'translateX(-50%)' }}>
                <div style={{ width:1, height:8, background:'var(--grid-line)' }} />
                <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.5rem', color:'var(--fog)', marginTop:2 }}>{t}</span>
              </div>
            ))}
          </div>
          <span style={{ width:7, height:7, border:'1px solid var(--grid-line)', background:'transparent' }} />
        </div>
        <div style={{ marginTop:'1rem', display:'flex', gap:20, fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', color:'var(--fog)', letterSpacing:'0.08em', flexWrap:'wrap', justifyContent:'center' }}>
          <span>01 Describe</span><span style={{color:'var(--grid-line)'}}>—</span><span>02 Generate</span><span style={{color:'var(--grid-line)'}}>—</span><span>03 Work the board</span>
        </div>
      </div>

      {/* IMAGE — Rune static, wrapped component */}
      <div ref={rv} style={{ scrollMarginTop: 24 }}>
        <div style={{ maxWidth: 980, margin:'0 auto' }}>
          <RuneImage style={{ aspectRatio:'16 / 9', width:'100%' }} />
        </div>
        <div style={{ maxWidth:980, margin:'0.5rem auto 0', display:'flex', justifyContent:'space-between', fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.55rem', letterSpacing:'0.06em', color:'var(--fog)' }}>
          <span>BOARD PREVIEW — NO FAKE DATA</span><span>FRAME 00</span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" ref={r1} style={{ scrollMarginTop: 24 }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:'1.2rem', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'1.65rem', color:'var(--bright)' }}>How it works</div>
          <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.6rem', letterSpacing:'0.1em', color:'var(--fog)' }}>THREE STEPS — NO TEMPLATES</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.1rem' }}>
          {[
            { n:'01', t:'Describe the app, in plain language', d:'Paste a rough paragraph. No template to fill, no fields to map — just how you would explain it to a teammate.' },
            { n:'02', t:'Get epics and user stories back', d:'Structured epics with risks and definition of done. Stories with criteria, points and dependencies — validated JSON, not prose.' },
            { n:'03', t:'See it laid out as a board', d:'Sprint plan or Kanban flow, same language. Drag to reorder, edit in place, export to Markdown or CSV.' },
          ].map((s,i)=>(
            <ChamferPanel key={s.n} style={{ padding:'1.6rem 1.3rem 1.4rem', borderLeft:`3px solid ${accent[i%accent.length]}` }}>
              <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'1.9rem', lineHeight:1, color:'var(--ink)' }}>{s.n}</div>
              <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'0.98rem', color:'var(--ink)', marginTop:'0.7rem', lineHeight:1.3 }}>{s.t}</div>
              <div style={{ fontSize:'0.86rem', color:'var(--ink-soft)', lineHeight:1.55, marginTop:'0.55rem' }}>{s.d}</div>
            </ChamferPanel>
          ))}
        </div>
      </div>

      {/* METHODOLOGIES */}
      <div id="methods" ref={r2} style={{ scrollMarginTop: 24 }}>
        <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.6rem', letterSpacing:'0.1em', color:'var(--fog)', marginBottom:'0.8rem' }}>METHODOLOGIES — ONE INSTRUMENT, TWO MODES</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.1rem' }}>
          <ChamferPanel style={{ padding:'1.5rem' }}>
            <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'1.02rem', color:'var(--ink)' }}>Scrum</div>
            <div style={{ fontSize:'0.83rem', color:'var(--ink-soft)', marginBottom:'1rem', lineHeight:1.5 }}>Numbered sprints, sequential. Deepest mode — sprint goals, timeline strip, velocity and scope controls.</div>
            <div style={{ display:'flex', gap:7 }}>
              {[1,2,3].map(n=>(
                <div key={n} style={{ flex:1, border:'1px solid var(--grid-line)', background:'#F4EFE2', padding:'0.6rem', clipPath:'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}>
                  <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'1.3rem', lineHeight:1, color:'var(--ink)' }}>{String(n).padStart(2,'0')}</div>
                  <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.58rem', color:'var(--ink-soft)' }}>SPRINT {String(n).padStart(2,'0')}</div>
                  <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:5 }}>
                    <div style={{ height:12, background:'var(--surface-alt)', border:'1px solid var(--grid-line)' }} />
                    <div style={{ height:12, background:'var(--surface-alt)', border:'1px solid var(--grid-line)' }} />
                  </div>
                </div>
              ))}
            </div>
          </ChamferPanel>
          <ChamferPanel style={{ padding:'1.5rem' }}>
            <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'1.02rem', color:'var(--ink)' }}>Kanban</div>
            <div style={{ fontSize:'0.83rem', color:'var(--ink-soft)', marginBottom:'1rem', lineHeight:1.5 }}>Continuous flow. Named columns with WIP limits. No sprints, same board language.</div>
            <div style={{ display:'flex', gap:7 }}>
              {['Backlog','In Progress','Review','Done'].map((col,idx)=>(
                <div key={col} style={{ flex:1, border:'1px solid var(--grid-line)', background: idx%2? 'var(--surface)' : '#F4EFE2', padding:'0.55rem', clipPath:'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}>
                  <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.58rem', color:'var(--ink-soft)' }}>{col.toUpperCase()}</div>
                  {idx===1 && <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.52rem', color:'var(--fog)', border:'1px solid var(--grid-line)', display:'inline-block', padding:'1px 3px', marginTop:5 }}>WIP 3</div>}
                  <div style={{ marginTop:7, display:'flex', flexDirection:'column', gap:5 }}>
                    <div style={{ height:12, background:'var(--surface-alt)', border:'1px solid var(--grid-line)' }} />
                    {idx===0 && <div style={{ height:12, background:'var(--surface-alt)', border:'1px solid var(--grid-line)' }} />}
                  </div>
                </div>
              ))}
            </div>
          </ChamferPanel>
        </div>
      </div>

      {/* CAPABILITIES */}
      <div id="caps" ref={r3} style={{ scrollMarginTop: 24 }}>
        <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.6rem', letterSpacing:'0.1em', color:'var(--fog)', marginBottom:'0.8rem' }}>CAPABILITIES — SPEC SHEET</div>
        <div style={{ border:'1px solid var(--grid-line)', background:'var(--paper)', clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}>
          {[
            { code:'01', name:'EDIT', desc:'Click any card to rewrite it in place. Title, criteria and points update instantly — the plan is a living workspace, not a one-shot export.', c:accent[0] },
            { code:'02', name:'REORDER', desc:'Drag stories between sprints or columns. WIP badge turns coral as a soft warning when a Kanban column is over limit — never blocks the move.', c:accent[1] },
            { code:'03', name:'EXPORT', desc:'Copy as Markdown for docs or export a Jira-ready CSV. Same data, two formats — no reformatting by hand.', c:accent[2] },
            { code:'04', name:'REFINE', desc:'Ask for changes in plain language — “make sprint 2 about onboarding” — the full plan updates live. One-step undo included.', c:accent[3] },
            { code:'05', name:'SAVE', desc:'Plans persist in your browser via IndexedDB. No account, no backend storage — come back anytime, pick up where you left off.', c:accent[4] },
          ].map(r=>(
            <div key={r.code} style={{ display:'grid', gridTemplateColumns:'56px 130px 1fr', gap:14, alignItems:'center', padding:'0.95rem 1.1rem', borderBottom:'1px solid var(--grid-line)', borderLeft:`3px solid ${r.c}` }}>
              <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.7rem', color:'var(--ink-soft)' }}>{r.code}</span>
              <span style={{ fontFamily:"'IBM Plex Sans', sans-serif", fontWeight:600, fontSize:'0.82rem', color:'var(--ink)', letterSpacing:'0.04em' }}>{r.name}</span>
              <span style={{ fontSize:'0.82rem', color:'var(--ink-soft)', lineHeight:1.45 }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CLOSING CTA */}
      <div ref={r4} style={{ textAlign:'center', padding:'1.2rem 1rem 0.2rem' }}>
        <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'1.75rem', color:'var(--bright)', marginBottom:'0.5rem' }}>Paste your next idea.</div>
        <div style={{ fontSize:'0.88rem', color:'var(--fog)', marginBottom:'1.2rem' }}>No sign up. Your plan stays in your browser. Start drafting in the spec sheet.</div>
        <Button variant="primary" onClick={()=>navigate('/new')} style={{ padding:'0.85em 1.6em', fontSize:'0.88rem', minWidth:190 }}>Open spec sheet</Button>
      </div>

      <div style={{ borderTop:'1px solid var(--grid-line)', padding:'0.9rem 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10, background:'var(--canvas)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', color:'var(--fog)' }}>© {new Date().getFullYear()} Rune — instrument-grade agile drafting</span>
          <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem', color:'var(--fog)' }}>· Developed by Josh Ivan Sartin</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:15 }}>
          <a href="https://github.com/zoulevanz23" target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none', color:'var(--fog)', fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/josh-ivan-sartin-312287376/" target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none', color:'var(--fog)', fontFamily:"'IBM Plex Mono', monospace", fontSize:'0.62rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}
