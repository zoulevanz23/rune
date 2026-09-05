import React from 'react'
export const Toast: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => {
  React.useEffect(() => { const id = setTimeout(onDismiss, 3000); return () => clearTimeout(id) }, [onDismiss])
  return (
    <div style={{ position: 'fixed', bottom: '1.2rem', right: '1.2rem', background: 'var(--paper)', color: 'var(--ink)', padding: '0.7rem 1rem', border: '1px solid var(--grid-line)', clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', zIndex: 1000, borderLeft: '2px solid var(--amber)' }}>
      {message} <button onClick={onDismiss} style={{ marginLeft: '0.8rem', background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer' }}>×</button>
    </div>
  )
}
