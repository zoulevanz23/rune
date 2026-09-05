import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlansRepository } from '@/hooks/usePlansRepository'
import { ChamferPanel } from '@/components/shared/ChamferPanel'

export const MyPlansPage: React.FC = () => {
  const { list, load, remove } = usePlansRepository()
  const [plans, setPlans] = useState<Array<{ id: string; projectName: string; methodology: string; savedAt: string }>>([])
  const navigate = useNavigate()
  useEffect(() => { list().then(setPlans).catch(() => setPlans([])) }, [list])
  const handleOpen = async (id: string) => {
    const plan = await load(id)
    if (plan) { navigate('/board'); window.dispatchEvent(new CustomEvent('load-plan', { detail: plan })) }
  }
  const handleDelete = async (id: string) => { await remove(id); list().then(setPlans).catch(() => {}) }
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0.5rem 0' }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--fog)', marginBottom: '0.8rem' }}>ARCHIVE — SAVED PLANS</div>
      {plans.length === 0 ? (
        <ChamferPanel style={{ padding: '1.4rem', textAlign: 'center' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-soft)' }}>NO SAVED PLANS — GENERATE ONE FROM NEW SPEC</div>
        </ChamferPanel>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {plans.map(plan => (
            <ChamferPanel key={plan.id} style={{ padding: '0.9rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleOpen(plan.id)}>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{plan.projectName || 'Untitled'}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'var(--ink-soft)' }}>{plan.methodology.toUpperCase()} · {new Date(plan.savedAt).toLocaleDateString()}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); handleDelete(plan.id) }} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', background: 'none', border: '1px solid var(--grid-line)', color: 'var(--coral)', cursor: 'pointer', padding: '0.3em 0.6em' }}>DELETE</button>
            </ChamferPanel>
          ))}
        </div>
      )}
    </div>
  )
}
