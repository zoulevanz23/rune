import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IntakeSheet } from '@/components/intake/IntakeSheet'
import { CustomizePanel } from '@/components/intake/CustomizePanel'
import { Spinner } from '@/components/shared/Spinner'
import { Button } from '@/components/shared/Button'
import { usePlan } from '@/context/PlanContext'
import { useGeneratePlan } from '@/hooks/useGeneratePlan'
import { usePlansRepository } from '@/hooks/usePlansRepository'

export const IntakePage: React.FC<{ apiBaseUrl: string }> = ({ apiBaseUrl }) => {
  const { dispatch } = usePlan()
  const navigate = useNavigate()
  const { loading, error, generate } = useGeneratePlan(apiBaseUrl)
  const { save } = usePlansRepository()
  const [description, setDescription] = useState('')
  const [methodology, setMethodology] = useState('scrum')
  const [customExpanded, setCustomExpanded] = useState(false)
  const [sprintCount, setSprintCount] = useState(3)
  const [sprintLength, setSprintLength] = useState('2 weeks')
  const [scopeMode, setScopeMode] = useState('MVP')
  const [teamVelocity, setTeamVelocity] = useState('')
  const [numColumns, setNumColumns] = useState(4)
  const [toast, setToast] = useState<string | null>(null)

  const handleGenerate = async () => {
    const config: Record<string, any> = {
      description, methodology, sprint_count: sprintCount, sprint_length: sprintLength, scope_mode: scopeMode, team_velocity: teamVelocity ? Number(teamVelocity) : undefined, num_columns: numColumns,
    }
    const plan = await generate(config)
    if (plan) {
      dispatch({ type: 'SET_PLAN', payload: plan })
      await save(plan).catch(() => {})
      navigate('/board')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.2rem 0 2rem', gap: 0 }}>
      <IntakeSheet description={description} onDescriptionChange={setDescription} methodology={methodology} onMethodologyChange={m => { setMethodology(m); setCustomExpanded(false) }} onGenerate={handleGenerate} loading={loading} charCount={description.length} />
      {methodology === 'scrum' && (
        <CustomizePanel sprintCount={sprintCount} sprintLength={sprintLength} scopeMode={scopeMode} teamVelocity={teamVelocity} numColumns={numColumns} onSprintCountChange={setSprintCount} onSprintLengthChange={setSprintLength} onScopeModeChange={setScopeMode} onTeamVelocityChange={setTeamVelocity} onNumColumnsChange={setNumColumns} isExpanded={customExpanded} onToggle={() => setCustomExpanded(!customExpanded)} />
      )}
      {error && (
        <div style={{ marginTop: '1rem', background: 'var(--surface)', border: '1px solid var(--coral)', padding: '0.7rem 0.9rem', maxWidth: 640, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', color: 'var(--coral)' }}>{error}</span>
          <Button variant="ghost" onClick={handleGenerate}>Retry</Button>
        </div>
      )}
      {loading && <div style={{ marginTop: '1rem' }}><Spinner /></div>}
      {toast && <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: 'var(--paper)', color: 'var(--ink)', padding: '0.8rem 1rem', border: '1px solid var(--grid-line)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem' }}>{toast}</div>}
    </div>
  )
}
