import React from 'react'

export const TimelineStrip: React.FC<{ sprintCount: number; sprintLength: string }> = ({ sprintCount, sprintLength }) => {
  const weeksPerSprint = sprintLength === '2 weeks' ? 2 : 1
  return (
    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
      {Array.from({ length: sprintCount }, (_, i) => {
        const startWeek = i * weeksPerSprint + 1
        const endWeek = (i + 1) * weeksPerSprint
        return (
          <div key={i} style={{
            flex: 1, background: 'var(--surface)', border: '1px solid var(--grid-line)',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
            padding: '0.5rem 0.65rem',
          }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.08em', color: 'var(--fog)' }}>SPRINT {String(i+1).padStart(2,'0')}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'var(--bright)' }}>WEEKS {startWeek}–{endWeek}</div>
          </div>
        )
      })}
    </div>
  )
}
