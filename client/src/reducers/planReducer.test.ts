import { describe, it, expect } from 'vitest'
import { planReducer } from './planReducer'
import { Plan, Story, Epic } from '@/types/plan'

const makePlan = (): Plan => ({
  project_name: 'Test',
  methodology: 'scrum',
  epics: [{ id: 'E1', name: 'Epic 1' }],
  groups: [{ type: 'sprint', number: 1, name: 'Sprint 1', goal: 'Test', stories: [{ id: 'US-101', epic_id: 'E1', title: 'Story 1', criteria: ['AC'], points: 3, priority: 'High', depends_on: [], done: false }] }],
})

describe('planReducer', () => {
  it('loads a plan', () => {
    const plan = makePlan()
    const state = planReducer({ plan, previousPlan: null }, { type: 'SET_PLAN', payload: plan })
    expect(state.plan.project_name).toBe('Test')
  })

  it('adds a story', () => {
    const plan = makePlan()
    const newStory: Story = { id: 'US-102', epic_id: 'E1', title: 'Story 2', criteria: [], points: null, priority: 'Medium', depends_on: [], done: false }
    const state = planReducer({ plan, previousPlan: null }, { type: 'ADD_STORY', payload: { groupIndex: 0, story: newStory } })
    expect(state.plan.groups[0].stories.length).toBe(2)
  })

  it('deletes a story', () => {
    const plan = makePlan()
    const state = planReducer({ plan, previousPlan: null }, { type: 'DELETE_STORY', payload: { groupIndex: 0, storyId: 'US-101' } })
    expect(state.plan.groups[0].stories.length).toBe(0)
  })

  it('edits a story', () => {
    const plan = makePlan()
    const state = planReducer({ plan, previousPlan: null }, { type: 'EDIT_STORY', payload: { groupIndex: 0, storyId: 'US-101', field: 'title', value: 'Updated' } })
    expect(state.plan.groups[0].stories[0].title).toBe('Updated')
  })

  it('moves a story', () => {
    const plan = makePlan()
    const state = planReducer({ plan, previousPlan: null }, { type: 'MOVE_STORY', payload: { fromGroupIndex: 0, toGroupIndex: 0, fromIndex: 0, toIndex: 0 } })
    expect(state.plan.groups[0].stories.length).toBe(1)
  })

  it('toggles done', () => {
    const plan = makePlan()
    const state = planReducer({ plan, previousPlan: null }, { type: 'TOGGLE_DONE', payload: { groupIndex: 0, storyId: 'US-101' } })
    expect(state.plan.groups[0].stories[0].done).toBe(true)
  })

  it('undoes', () => {
    const plan = makePlan()
    const state = planReducer({ plan, previousPlan: null }, { type: 'SET_PLAN', payload: plan })
    expect(state.previousPlan).toBeNull()
  })
})
