import React from 'react'
export const Spinner: React.FC = () => {
  const msgs = ['sketching epics…', 'drafting user stories…', 'laying out the board…', 'inking details…']
  const [idx, setIdx] = React.useState(0)
  React.useEffect(() => { const id = setInterval(() => setIdx(i => (i + 1) % msgs.length), 800); return () => clearInterval(id) }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem', padding: '2rem' }}>
      <div style={{ width: 36, height: 2, background: 'var(--grid-line)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--amber)', animation: 'scan 1s linear infinite', width: '40%' }} />
      </div>
      <span style={{ color: 'var(--fog)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', letterSpacing: '0.06em' }}>{msgs[idx]}</span>
      <style>{`@keyframes scan { 0%{ transform: translateX(-100%)} 100%{ transform: translateX(350%)}}`}</style>
    </div>
  )
}
