import React, { useState } from 'react'
import { methodologies } from '@/content/landing'

const skeletonCard = () => (
  <div
    style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      padding: 8,
    }}
  >
    <div style={{ display: 'block', height: 6, borderRadius: 3, background: 'var(--border)' }} />
    <div style={{ display: 'block', height: 6, borderRadius: 3, background: 'var(--border)', width: '60%', marginTop: 6 }} />
  </div>
)

export const LandingMethodologies: React.FC = () => {
  const [mode, setMode] = useState<'scrum' | 'kanban'>('scrum')

  return (
    <section id="modes" style={{ scrollMarginTop: 24, paddingTop: 0 }}>
      <div style={{ maxWidth: '60ch', marginBottom: 32 }}>
        <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 38px)', color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
          {methodologies.title}
        </h2>
        <p style={{ margin: '12px 0 0', fontSize: 15, color: 'var(--muted)' }}>{methodologies.subtitle}</p>
      </div>

      <div
        style={{
          display: 'inline-flex',
          background: 'var(--surface-2)',
          borderRadius: 10,
          padding: 4,
          marginBottom: 20,
          position: 'relative',
        }}
        role="tablist"
      >
        <span
          style={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: 4,
            borderRadius: 8,
            background: 'var(--surface)',
            boxShadow: '0 1px 2px rgba(15, 27, 45, 0.06), 0 8px 24px rgba(15, 27, 45, 0.06)',
            transition: 'transform 0.25s cubic-bezier(0.3, 0.8, 0.3, 1), width 0.25s',
            transform: mode === 'scrum' ? 'translateX(0)' : 'translateX(100%)',
            width: mode === 'scrum' ? 'calc(50% - 4px)' : 'calc(50% - 4px)',
          }}
        />
        <button
          role="tab"
          aria-selected={mode === 'scrum'}
          onClick={() => setMode('scrum')}
          style={{
            position: 'relative',
            zIndex: 1,
            border: 'none',
            background: 'none',
            padding: '8px 20px',
            font: '600 14px var(--font-sans)',
            color: mode === 'scrum' ? 'var(--ink)' : 'var(--muted)',
            cursor: 'pointer',
            borderRadius: 8,
            transition: 'color 0.2s',
          }}
        >
          Scrum
        </button>
        <button
          role="tab"
          aria-selected={mode === 'kanban'}
          onClick={() => setMode('kanban')}
          style={{
            position: 'relative',
            zIndex: 1,
            border: 'none',
            background: 'none',
            padding: '8px 20px',
            font: '600 14px var(--font-sans)',
            color: mode === 'kanban' ? 'var(--ink)' : 'var(--muted)',
            cursor: 'pointer',
            borderRadius: 8,
            transition: 'color 0.2s',
          }}
        >
          Kanban
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: 0,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(15, 27, 45, 0.06), 0 8px 24px rgba(15, 27, 45, 0.06)',
        }}
      >
        <div style={{ padding: 24, borderRight: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 20, margin: '0 0 8px', color: 'var(--ink)' }}>
            {mode === 'scrum' ? methodologies.scrum.title : methodologies.kanban.title}
          </h3>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>
            {mode === 'scrum' ? methodologies.scrum.desc : methodologies.kanban.desc}
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gap: 12,
            padding: 18,
            background: 'var(--bg)',
            overflowX: 'auto',
          }}
        >
          {mode === 'scrum' ? (
            <>
              {['Sprint 1', 'Sprint 2', 'Sprint 3'].map((sprint, i) => (
                <div
                  key={sprint}
                  style={{
                    background: 'var(--surface-2)',
                    borderRadius: 8,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    minWidth: 120,
                    animation: 'drop 0.45s both',
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 12, color: 'var(--ink)' }}>{sprint}</h4>
                  {skeletonCard()}
                  {skeletonCard()}
                </div>
              ))}
            </>
          ) : (
            <>
              {['Backlog', 'In progress', 'Review', 'Done'].map((col, i) => (
                <div
                  key={col}
                  style={{
                    background: 'var(--surface-2)',
                    borderRadius: 8,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    minWidth: 120,
                    animation: 'drop 0.45s both',
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: 'var(--ink)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {col}
                    {i === 1 && (
                      <span
                        style={{
                          font: '500 11px var(--mono)',
                          background: 'var(--warning-soft)',
                          color: 'var(--warning)',
                          padding: '2px 8px',
                          borderRadius: 999,
                          animation: 'pulse 1.6s 2',
                        }}
                      >
                        WIP 3
                      </span>
                    )}
                  </h4>
                  {skeletonCard()}
                  {i === 0 && skeletonCard()}
                  {i === 3 && skeletonCard()}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes drop {
          from { opacity: 0; transform: translateY(-14px) scale(0.96); }
        }
        @keyframes pulse {
          50% { transform: scale(1.12); }
        }
      `}</style>
    </section>
  )
}
