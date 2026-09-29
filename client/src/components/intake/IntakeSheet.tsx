import React, { useState } from 'react'
import { Panel } from '@/components/primitives'
import { Button } from '@/components/primitives'
import { Readout } from '@/components/primitives'
import { Chip } from '@/components/primitives'
import { Input } from '@/components/primitives'
import { Textarea } from '@/components/primitives'
import { Select } from '@/components/primitives'
import { Tabs } from '@/components/primitives'

const methodTabs = [
  { id: 'scrum', label: 'Scrum', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="0" />
      <rect x="9" y="1" width="6" height="6" rx="0" />
      <rect x="1" y="9" width="6" height="6" rx="0" />
      <rect x="9" y="9" width="6" height="6" rx="0" />
    </svg>
  ) },
  { id: 'kanban', label: 'Kanban', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="4" height="14" rx="0" />
      <rect x="6" y="1" width="4" height="14" rx="0" />
      <rect x="11" y="1" width="4" height="14" rx="0" />
    </svg>
  ) },
]

const examplePrompts = [
  { label: 'Freelancer invoicing app', desc: 'Time tracking, invoices, payments' },
  { label: 'Marketplace MVP', desc: 'Buyers, sellers, listings, checkout' },
  { label: 'Internal HR tool', desc: 'Onboarding, reviews, time off' },
  { label: 'SaaS dashboard', desc: 'Auth, teams, billing, analytics' },
]

export const IntakeSheet: React.FC<{
  description: string
  onDescriptionChange: (v: string) => void
  methodology: string
  onMethodologyChange: (m: string) => void
  onGenerate: () => void
  loading: boolean
  charCount: number
  step: number
  onStepChange: (s: number) => void
  sprintCount: number
  sprintLength: string
  scopeMode: string
  teamVelocity: string
  numColumns: number
  onSprintCountChange: (v: number) => void
  onSprintLengthChange: (v: string) => void
  onScopeModeChange: (v: string) => void
  onTeamVelocityChange: (v: string) => void
  onNumColumnsChange: (v: number) => void
}> = ({
  description, onDescriptionChange, methodology, onMethodologyChange,
  onGenerate, loading, charCount, step, onStepChange,
  sprintCount, sprintLength, scopeMode, teamVelocity, numColumns,
  onSprintCountChange, onSprintLengthChange, onScopeModeChange, onTeamVelocityChange, onNumColumnsChange,
}) => {
  const [customExpanded, setCustomExpanded] = useState(false)

  const steps = [
    { n: 1, label: 'Describe', desc: 'Paste your app idea' },
    { n: 2, label: 'Method', desc: 'Choose Scrum or Kanban' },
    { n: 3, label: 'Configure', desc: 'Tune sprints & velocity' },
  ]

  return (
    <Panel variant="paper" chamfered={true} bordered={true} tag="SPEC 00" style={{ maxWidth: 980, width: '100%', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <Readout variant="label" size="xs">AGILE SPECIFICATION SHEET — REV 02</Readout>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.6rem', color: 'var(--ink)', marginTop: '0.35rem', lineHeight: 1.1 }}>Rune</h1>
            <Readout variant="status" size="sm" style={{ marginTop: '0.25rem', display: 'block' }}>Describe your app and we will draft the delivery plan on the board.</Readout>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {steps.map(s => (
              <Chip key={s.n} variant={step === s.n ? 'amber' : 'outline'} size="sm" style={{ fontSize: '0.55rem', padding: '2px 8px' }}>
                <Readout variant="metric" size="xs">{String(s.n).padStart(2, '0')}</Readout>
                {s.label}
              </Chip>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Textarea
              label="APP DESCRIPTION"
              value={description}
              onChange={e => onDescriptionChange(e.target.value)}
              placeholder="Paste a rough description of your app…"
              rows={6}
              size="md"
              hint={`${String(charCount).padStart(3, '0')} CHARS`}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {examplePrompts.map((ex, i) => (
                <Chip key={i} variant="outline" size="sm" onClick={() => onDescriptionChange(
                  'A collaborative task management app where teams can create boards, assign tasks with priorities and story points, track progress through epics, and organize work into sprints or continuous flow columns. Features include real-time updates, dependency tracking between tasks, and a visual board showing the status of every item.'
                )}>
                  {ex.label}
                </Chip>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" onClick={() => onStepChange(2)} size="md">Continue →</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Readout variant="label" size="xs" style={{ marginBottom: '0.25rem', display: 'block' }}>METHODOLOGY</Readout>
            <Tabs tabs={methodTabs} activeTab={methodology} onChange={onMethodologyChange} variant="enclosed" fullWidth />
            <Readout variant="status" size="sm" style={{ display: 'block', lineHeight: 1.5 }}>
              {methodology === 'scrum'
                ? 'Scrum: numbered sprints with goals, timeline strip, velocity tracking, and scope controls.'
                : 'Kanban: continuous flow columns with WIP limits, no sprints, same board language.'}
            </Readout>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="ghost" onClick={() => onStepChange(1)} size="md">← Back</Button>
              <Button variant="primary" onClick={() => onStepChange(3)} size="md">Continue →</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Readout variant="label" size="xs" style={{ marginBottom: '0.25rem', display: 'block' }}>SPRINT CONFIGURATION</Readout>
            <Panel variant="surface" chamfered={true} bordered={true} style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <Input
                label="SPRINT COUNT — 2–6"
                type="number"
                min={2}
                max={6}
                value={sprintCount}
                onChange={e => onSprintCountChange(Number(e.target.value))}
                size="sm"
              />
              <Select
                label="SPRINT LENGTH"
                options={[{ value: '1 week', label: '1 week' }, { value: '2 weeks', label: '2 weeks' }]}
                value={sprintLength}
                onChange={e => onSprintLengthChange(e.target.value)}
                size="sm"
              />
              <Select
                label="SCOPE MODE"
                options={[{ value: 'MVP', label: 'MVP' }, { value: 'Full build', label: 'Full build' }]}
                value={scopeMode}
                onChange={e => onScopeModeChange(e.target.value)}
                size="sm"
              />
              <Input
                label="VELOCITY — PTS/SPRINT"
                type="number"
                value={teamVelocity}
                onChange={e => onTeamVelocityChange(e.target.value)}
                placeholder="—"
                size="sm"
              />
              <Input
                label="STARTING COLUMNS"
                type="number"
                min={4}
                max={6}
                value={numColumns}
                onChange={e => onNumColumnsChange(Number(e.target.value))}
                size="sm"
              />
            </Panel>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="ghost" onClick={() => onStepChange(2)} size="md">← Back</Button>
              <Button variant="primary" onClick={onGenerate} disabled={loading || !description.trim()} size="md" loading={loading}>
                {loading ? 'Generating…' : 'Generate plan'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Panel variant="surface" chamfered={true} bordered={true} style={{ padding: '1.25rem', height: 'fit-content', position: 'sticky', top: '1.5rem' }}>
        <Readout variant="label" size="xs" style={{ marginBottom: '0.75rem', display: 'block' }}>LIVE PREVIEW</Readout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Readout variant="status" size="xs">METHOD</Readout>
            <Readout variant="metric" size="xs">{methodology.toUpperCase()}</Readout>
          </div>
          {methodology === 'scrum' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Readout variant="status" size="xs">SPRINTS</Readout>
                  <Readout variant="metric" size="xs">{sprintCount}</Readout>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Readout variant="status" size="xs">LENGTH</Readout>
                  <Readout variant="metric" size="xs">{sprintLength}</Readout>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Readout variant="status" size="xs">SCOPE</Readout>
                  <Readout variant="metric" size="xs">{scopeMode}</Readout>
                </div>
                {teamVelocity && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Readout variant="status" size="xs">VELOCITY</Readout>
                    <Readout variant="metric" size="xs">{teamVelocity} pts/sprint</Readout>
                  </div>
                )}
              </>
            )}
            {methodology === 'kanban' && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Readout variant="status" size="xs">COLUMNS</Readout>
              <Readout variant="metric" size="xs">{numColumns}</Readout>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--grid-line)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            <Readout variant="status" size="xs">EST. STORIES</Readout>
            <Readout variant="metric" size="xs">{Math.max(1, Math.round(charCount / 120))}</Readout>
          </div>
        </div>
      </Panel>
    </Panel>
  )
}