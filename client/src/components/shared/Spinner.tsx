import React from 'react'

export const Spinner: React.FC = () => {
  const msgs = ['sketching epics.', 'drafting user stories.', 'laying out the board.', 'inking details.']
  const [idx, setIdx] = React.useState(0)
  React.useEffect(() => { const id = setInterval(() => setIdx(i => (i + 1) % msgs.length), 800); return () => clearInterval(id) }, [])
  return (
    <div role="status" aria-live="polite" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '32px 16px' }}>
      <div style={{ width: 160, height: 6, background: 'var(--surface-3)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: '40%', background: 'var(--primary)', borderRadius: 'var(--radius-pill)', animation: 'intake-scan 1.1s var(--ease) infinite' }} />
      </div>
      <span style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--font-sans)' }}>{msgs[idx]}</span>
      <style>{`@keyframes intake-scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }`}</style>
    </div>
  )
}
