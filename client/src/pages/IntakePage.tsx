import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IntakeSheet } from '@/components/intake/IntakeSheet'
import { Spinner } from '@/components/shared/Spinner'
import { usePlan } from '@/context/PlanContext'
import { useGeneratePlan } from '@/hooks/useGeneratePlan'
import { usePlansRepository } from '@/hooks/usePlansRepository'
import { useToast } from '@/components/primitives'
import { Panel } from '@/components/primitives'
import { Readout } from '@/components/primitives'
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

  const handleMethodologyChange = (m: string) => {
    setMethodology(m)
    if (m === 'kanban') setStep(3)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.2rem 0 2rem', gap: '1rem' }}>
      <IntakeSheet
        description={description}
        onDescriptionChange={setDescription}
        methodology={methodology}
        onMethodologyChange={handleMethodologyChange}
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
        <Panel variant="surface" chamfered={true} bordered={true} style={{ maxWidth: 980, width: '100%', padding: '1rem', borderColor: 'var(--coral)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <Readout variant="status" size="sm" style={{ color: 'var(--coral)' }}>{error}</Readout>
            <Button variant="primary" size="sm" onClick={handleGenerate}>Retry</Button>
          </div>
        </Panel>
      )}
      {loading && <Spinner />}
    </div>
  )
}