import { describe, it, expect } from 'vitest'
import { toMarkdown } from './toMarkdown'
import { Plan } from '@/types/plan'

describe('toMarkdown', () => {
  it('renders a simple plan', () => {
    const plan: Plan = {
      project_name: 'Test App',
      methodology: 'scrum',
      epics: [{ id: 'E1', name: 'Test Epic', risk: 'Risk', definition_of_done: ['Done 1'] }],
      groups: [{ type: 'sprint', number: 1, name: 'Sprint 1', goal: 'Test', stories: [{ id: 'US-101', epic_id: 'E1', title: 'Story', criteria: ['AC1'], points: 3, priority: 'High', depends_on: [], done: false }] }],
    }
    const md = toMarkdown(plan)
    expect(md).toContain('Sprint 1')
    expect(md).toContain('Story')
  })
})
