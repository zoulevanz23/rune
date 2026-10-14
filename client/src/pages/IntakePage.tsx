import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleAlert, Sparkles, ArrowRight } from 'lucide-react'
import { Panel, Button, Textarea, Input, Select, useToast } from '@/components/primitives'
import { Spinner } from '@/components/shared/Spinner'
import { usePlan } from '@/context/PlanContext'
import { useGeneratePlan, GenerateConfig } from '@/hooks/useGeneratePlan'
import { usePlansRepository } from '@/hooks/usePlansRepository'

const examplePrompts = [
  { label: 'Freelancer invoicing app', text: 'A freelancing tool for tracking time against clients, sending branded invoices, recording payments and chasing unpaid work.' },
  { label: 'Marketplace MVP', text: 'A marketplace where buyers browse listings, message sellers and check out securely, with ratings after every purchase.' },
  { label: 'Internal HR tool', text: 'An HR workspace for onboarding new hires, running review cycles and approving time off.' },
  { label: 'SaaS dashboard', text: 'A B2B SaaS product with email login, team workspaces, subscription billing and usage analytics.' },
]

const methodologies = [
  { value: '', label: 'Auto (AI decides)' },
  { value: 'scrum', label: 'Scrum' },
  { value: 'kanban', label: 'Kanban' },
  { value: 'scrumban', label: 'Scrumban' },
  { value: 'shape-up', label: 'Shape Up' },
  { value: 'story-mapping', label: 'Story Mapping' },
  { value: 'moscow', label: 'MoSCoW' },
  { value: 'lean-canvas', label: 'Lean Canvas' },
  { value: 'design-sprint', label: 'Design Sprint' },
  { value: 'okr', label: 'OKR-based' },
  { value: 'feature-based', label: 'Feature-based' },
]

const projectTypes = [
  { value: '', label: 'Not specified' },
  { value: 'greenfield', label: 'Greenfield (new project)' },
  { value: 'brownfield', label: 'Brownfield (existing codebase)' },
]

const riskTolerances = [
  { value: '', label: 'Not specified' },
  { value: 'conservative', label: 'Conservative (proven tech)' },
  { value: 'moderate', label: 'Moderate (some new tech)' },
  { value: 'aggressive', label: 'Aggressive (cutting-edge)' },
]

export const IntakePage: React.FC<{ apiBaseUrl: string }> = ({ apiBaseUrl }) => {
  const { dispatch } = usePlan()
  const navigate = useNavigate()
  const { loading, error, generate } = useGeneratePlan(apiBaseUrl)
  const { save } = usePlansRepository()
  const { show } = useToast()

  const [description, setDescription] = useState('')
  const [methodology, setMethodology] = useState('')
  const [projectType, setProjectType] = useState('')
  const [riskTolerance, setRiskTolerance] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [deadline, setDeadline] = useState('')
  const [techStack, setTechStack] = useState('')
  const [sprintCount, setSprintCount] = useState('')
  const [sprintLength, setSprintLength] = useState('')
  const [scopeMode, setScopeMode] = useState('')
  const [teamVelocity, setTeamVelocity] = useState('')
  const [numColumns, setNumColumns] = useState('')

  const handleGenerate = async () => {
    const config: GenerateConfig = { description: description.trim() }
    if (methodology) config.methodology = methodology
    if (projectType) config.project_type = projectType
    if (riskTolerance) config.risk_tolerance = riskTolerance
    if (teamSize) config.team_size = Number(teamSize)
    if (deadline.trim()) config.deadline = deadline.trim()
    if (techStack.trim()) config.tech_stack = techStack.trim()
    if (sprintCount) config.sprint_count = Number(sprintCount)
    if (sprintLength) config.sprint_length = sprintLength
    if (scopeMode) config.scope_mode = scopeMode
    if (teamVelocity) config.team_velocity = Number(teamVelocity)
    if (numColumns) config.num_columns = Number(numColumns)

    const plan = await generate(config)
    if (plan) {
      dispatch({ type: 'SET_PLAN', payload: plan })
      await save(plan).catch(() => {})
      show('Plan generated!', 'success')
      navigate('/board')
    }
  }

  const examplePill: React.CSSProperties = {
    padding: '8px 14px',
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--ink)',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-pill)',
    cursor: 'pointer',
    transition: 'background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)',
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 0 64px' }}>
      <div style={{ marginBottom: 32, maxWidth: 640 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--primary-soft)', color: 'var(--primary-text)' }}>
            <Sparkles size={18} strokeWidth={1.7} />
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--primary-text)' }}>
            New plan
          </span>
        </div>
        <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
          What are we building?
        </h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          Describe your app in plain language. Rune drafts the epics, user stories and a board you can refine.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, alignItems: 'start' }}>
        <Panel radius="xl" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label htmlFor="app-description" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--ink)' }}>
              App description
            </label>
            <Textarea
              id="app-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Paste a rough description of your app…"
              rows={12}
              size="md"
              hint={`${description.length} characters`}
            />
          </div>

          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--ink)' }}>
              Start from an example
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {examplePrompts.map(ex => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => setDescription(ex.text)}
                  style={examplePill}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--primary-soft)'
                    e.currentTarget.style.borderColor = 'var(--primary)'
                    e.currentTarget.style.color = 'var(--primary-text)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--surface)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--ink)'
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        <Panel radius="xl" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 4px', color: 'var(--ink)' }}>Context</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              Optional — helps the AI generate a better plan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <Select label="Methodology" options={methodologies} value={methodology} onChange={e => setMethodology(e.target.value)} />
            <Select label="Project type" options={projectTypes} value={projectType} onChange={e => setProjectType(e.target.value)} />
            <Input label="Team size" type="number" min={1} value={teamSize} placeholder="e.g., 5" onChange={e => setTeamSize(e.target.value)} />
            <Input label="Deadline" value={deadline} placeholder="e.g., 3 months" onChange={e => setDeadline(e.target.value)} />
            <Input label="Tech stack" value={techStack} placeholder="e.g., React, Python" onChange={e => setTechStack(e.target.value)} />
            <Select label="Risk tolerance" options={riskTolerances} value={riskTolerance} onChange={e => setRiskTolerance(e.target.value)} />
            <Input label="Sprint count" type="number" min={2} max={6} value={sprintCount} placeholder="2-6" onChange={e => setSprintCount(e.target.value)} />
            <Select
              label="Sprint length"
              options={[{ value: '', label: 'Default' }, { value: '1 week', label: '1 week' }, { value: '2 weeks', label: '2 weeks' }, { value: '3 weeks', label: '3 weeks' }]}
              value={sprintLength}
              onChange={e => setSprintLength(e.target.value)}
            />
            <Select
              label="Scope"
              options={[{ value: '', label: 'Default' }, { value: 'MVP', label: 'MVP' }, { value: 'Full build', label: 'Full build' }]}
              value={scopeMode}
              onChange={e => setScopeMode(e.target.value)}
            />
            <Input label="Team velocity" type="number" value={teamVelocity} placeholder="Points/sprint" onChange={e => setTeamVelocity(e.target.value)} />
            <Input label="Columns (Kanban)" type="number" min={3} max={6} value={numColumns} placeholder="3-6" onChange={e => setNumColumns(e.target.value)} />
          </div>
        </Panel>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <Button
          variant="primary"
          size="md"
          loading={loading}
          disabled={!description.trim() || loading}
          onClick={handleGenerate}
          rightIcon={<ArrowRight size={16} strokeWidth={2} />}
        >
          {loading ? 'Generating…' : 'Generate plan'}
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 16,
            padding: '12px 16px', background: 'var(--danger-soft)', border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-lg)', color: 'var(--danger-text)', fontSize: 14,
          }}
        >
          <CircleAlert size={18} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden="true" />
          <span style={{ flex: 1, minWidth: 200, lineHeight: 1.4 }}>{error}</span>
          <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={loading}>Retry</Button>
        </div>
      )}

      {loading && <Spinner />}
    </div>
  )
}