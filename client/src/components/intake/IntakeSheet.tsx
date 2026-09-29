import React from 'react'
import { Panel, Button, Textarea } from '@/components/primitives'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MethodologyToggle } from './MethodologyToggle'
import { CustomizePanel } from './CustomizePanel'

const examplePrompts = [
  { label: 'Freelancer invoicing app', text: 'A freelancing tool for tracking time against clients, sending branded invoices, recording payments and chasing unpaid work.' },
  { label: 'Marketplace MVP', text: 'A marketplace where buyers browse listings, message sellers and check out securely, with ratings after every purchase.' },
  { label: 'Internal HR tool', text: 'An HR workspace for onboarding new hires, running review cycles and approving time off.' },
  { label: 'SaaS dashboard', text: 'A B2B SaaS product with email login, team workspaces, subscription billing and usage analytics.' },
]

const steps = [
  { n: 1, label: 'Describe', title: 'Describe your app', desc: 'Paste a rough idea or a full spec — the more detail you give, the sharper the plan.' },
  { n: 2, label: 'Method', title: 'Choose a methodology', desc: 'Both options build the same board: Scrum adds sprints, Kanban adds WIP limits.' },
  { n: 3, label: 'Configure', title: 'Configure your plan', desc: 'Sensible defaults for now — you can change any of this later on the board.' },
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
  const current = steps[step - 1]

  const summaryRows: Array<[string, string]> = [['Method', methodology === 'scrum' ? 'Scrum' : 'Kanban']]
  if (methodology === 'scrum') {
    summaryRows.push(['Sprints', String(sprintCount)])
    summaryRows.push(['Sprint length', sprintLength])
    summaryRows.push(['Scope', scopeMode])
    if (teamVelocity) summaryRows.push(['Velocity', `${teamVelocity} pts/sprint`])
  } else {
    summaryRows.push(['Columns', String(numColumns)])
  }
  const estStories = Math.max(1, Math.round(charCount / 120))

  return (
    <div className="intake-grid">
      <Panel radius="xl" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
        <div role="group" aria-label={`Step ${step} of ${steps.length}`} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <div aria-current={step === s.n ? 'step' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 'var(--radius-pill)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    background: step === s.n ? 'var(--primary)' : step > s.n ? 'var(--primary-soft)' : 'var(--surface-3)',
                    color: step === s.n ? 'var(--on-primary)' : step > s.n ? 'var(--primary-text)' : 'var(--muted)',
                  }}
                >
                  {s.n}
                </span>
                <span style={{ fontSize: 13, fontWeight: step === s.n ? 600 : 500, color: step === s.n ? 'var(--ink)' : 'var(--muted)' }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span aria-hidden="true" style={{ width: 24, height: 1, background: step > s.n ? 'var(--primary)' : 'var(--border)', margin: '0 2px' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600, lineHeight: 1.25 }}>{current.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>{current.desc}</p>
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Textarea
              label="App description"
              value={description}
              onChange={e => onDescriptionChange(e.target.value)}
              placeholder="Paste a rough description of your app…"
              rows={8}
              size="md"
              hint={`${charCount} characters`}
            />
            <div>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Start from an example</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {examplePrompts.map(ex => (
                  <Button key={ex.label} variant="secondary" size="sm" onClick={() => onDescriptionChange(ex.text)}>
                    {ex.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <MethodologyToggle value={methodology} onChange={onMethodologyChange} />
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.55 }}>
              {methodology === 'scrum'
                ? 'Scrum plans the work into numbered sprints with goals, a timeline strip and velocity tracking.'
                : 'Kanban plans the work as a continuous flow with WIP limits and no fixed sprints.'}
            </p>
          </div>
        )}

        {step === 3 && (
          <CustomizePanel
            sprintCount={sprintCount}
            sprintLength={sprintLength}
            scopeMode={scopeMode}
            teamVelocity={teamVelocity}
            numColumns={numColumns}
            onSprintCountChange={onSprintCountChange}
            onSprintLengthChange={onSprintLengthChange}
            onScopeModeChange={onScopeModeChange}
            onTeamVelocityChange={onTeamVelocityChange}
            onNumColumnsChange={onNumColumnsChange}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 'auto', paddingTop: 4 }}>
          {step > 1 ? (
            <Button variant="ghost" size="md" leftIcon={<ChevronLeft size={16} strokeWidth={2} />} onClick={() => onStepChange(step - 1)}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < steps.length ? (
            <Button
              variant="primary"
              size="md"
              rightIcon={<ChevronRight size={16} strokeWidth={2} />}
              disabled={!description.trim()}
              onClick={() => onStepChange(step + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button variant="primary" size="md" loading={loading} disabled={!description.trim()} onClick={onGenerate}>
              {loading ? 'Generating…' : 'Generate plan'}
            </Button>
          )}
        </div>
      </Panel>

      <Panel variant="surface-2" radius="lg" style={{ padding: 'var(--space-4)', position: 'sticky', top: 'calc(var(--topbar-h) + 16px)', height: 'fit-content', boxShadow: 'none' }}>
        <span style={{ display: 'block', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 12 }}>
          Summary
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {summaryRows.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
              <span style={{ color: 'var(--muted)' }}>{label}</span>
              <span style={{ color: 'var(--ink)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 2 }}>
            <span style={{ color: 'var(--muted)' }}>Est. stories</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{estStories}</span>
          </div>
        </div>
      </Panel>
    </div>
  )
}
