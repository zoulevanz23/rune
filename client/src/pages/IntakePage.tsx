import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'
import { IntakeSheet } from '@/components/intake/IntakeSheet'
import { Spinner } from '@/components/shared/Spinner'
import { usePlan } from '@/context/PlanContext'
import { useGeneratePlan } from '@/hooks/useGeneratePlan'
import { usePlansRepository } from '@/hooks/usePlansRepository'
import { useToast } from '@/components/primitives'
import { Button } from '@/components/primitives'

export const IntakePage: React.FC<{ apiBaseUrl: string }> = ({ apiBaseUrl }) => {
  const { dispatch } = usePlan()
  const navigate = useNavigate()
  const { loading, error, generate } = useGeneratePlan(apiBaseUrl)
  const { save } = usePlansRepository()
  const { show } = useToast()
  const [description, setDescription] = useState('')
  const [methodology, setMethodology] = useState('scrum')
  const [step, setStep] = useState(1)
  const [sprintCount, setSprintCount] = useState(3)
  const [sprintLength, setSprintLength] = useState('2 weeks')
  const [scopeMode, setScopeMode] = useState('MVP')
  const [teamVelocity, setTeamVelocity] = useState('')
  const [numColumns, setNumColumns] = useState(4)

  const handleGenerate = async () => {
    const config: Record<string, any> = {
      description, methodology, sprint_count: sprintCount, sprint_length: sprintLength, scope_mode: scopeMode, team_velocity: teamVelocity ? Number(teamVelocity) : undefined, num_columns: numColumns,
    }
    const plan = await generate(config)
    if (plan) {
      dispatch({ type: 'SET_PLAN', payload: plan })
      await save(plan).catch(() => {})
      show('Plan generated!', 'success')
      navigate('/board')
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 0 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, lineHeight: 1.2 }}>Create a plan</h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5, maxWidth: 640 }}>
          Describe your app in plain language — Rune drafts the epics, user stories and a board you can refine.
        </p>
      </div>

      <IntakeSheet
        description={description}
        onDescriptionChange={setDescription}
        methodology={methodology}
        onMethodologyChange={setMethodology}
        onGenerate={handleGenerate}
        loading={loading}
        charCount={description.length}
        step={step}
        onStepChange={setStep}
        sprintCount={sprintCount}
        sprintLength={sprintLength}
        scopeMode={scopeMode}
        teamVelocity={teamVelocity}
        numColumns={numColumns}
        onSprintCountChange={setSprintCount}
        onSprintLengthChange={setSprintLength}
        onScopeModeChange={setScopeMode}
        onTeamVelocityChange={setTeamVelocity}
        onNumColumnsChange={setNumColumns}
      />

      {error && (
        <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '12px 16px', background: 'var(--danger-soft)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-lg)', color: 'var(--danger-text)', fontSize: 14 }}>
          <CircleAlert size={18} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden="true" />
          <span style={{ flex: 1, minWidth: 200, lineHeight: 1.4 }}>{error}</span>
          <Button variant="secondary" size="sm" onClick={handleGenerate}>Retry</Button>
        </div>
      )}

      {loading && <Spinner />}
    </div>
  )
}
