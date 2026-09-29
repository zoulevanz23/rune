import React from 'react'
import { Input, Select } from '../primitives'

export const CustomizePanel: React.FC<{
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
}> = ({ sprintCount, sprintLength, scopeMode, teamVelocity, numColumns, onSprintCountChange, onSprintLengthChange, onScopeModeChange, onTeamVelocityChange, onNumColumnsChange }) => {
  return (
    <div className="intake-fields">
      <Input
        label="Sprint count"
        hint="2–6"
        type="number"
        min={2}
        max={6}
        value={sprintCount}
        onChange={e => onSprintCountChange(Number(e.target.value))}
      />
      <Select
        label="Sprint length"
        options={[{ value: '1 week', label: '1 week' }, { value: '2 weeks', label: '2 weeks' }]}
        value={sprintLength}
        onChange={e => onSprintLengthChange(e.target.value)}
      />
      <Select
        label="Scope"
        options={[{ value: 'MVP', label: 'MVP' }, { value: 'Full build', label: 'Full build' }]}
        value={scopeMode}
        onChange={e => onScopeModeChange(e.target.value)}
      />
      <Input
        label="Team velocity"
        hint="Points per sprint"
        type="number"
        value={teamVelocity}
        placeholder="Optional"
        onChange={e => onTeamVelocityChange(e.target.value)}
      />
      <Input
        label="Starting columns"
        hint="4–6"
        type="number"
        min={4}
        max={6}
        value={numColumns}
        onChange={e => onNumColumnsChange(Number(e.target.value))}
      />
    </div>
  )
}
