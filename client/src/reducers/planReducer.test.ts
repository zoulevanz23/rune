import { describe, it, expect } from 'vitest'
import { planReducer } from './planReducer'
import { Plan, Story } from '@/types/plan'

const makePlan = (): Plan => ({
  project_name: 'Test',
  methodology: 'scrum',
  epics: [{ id: 'E1', name: 'Epic 1' }],
  groups: [{ type: 'sprint', number: 1, name: 'Sprint 1', goal: 'Test', stories: [{ id: 'US-101', epic_id: 'E1', title: 'Story 1', criteria: ['AC'], points: 3, priority: 'High', depends_on: [], done: false }] }],
})

const emptyState = (plan: Plan) => ({ plan, previousPlan: null as Plan | null, past: [] as Plan[], future: [] as Plan[] })

describe('planReducer', () => {
  it('loads a plan', () => {
    const plan = makePlan()
    const state = planReducer(emptyState(plan), { type: 'LOAD_PLAN', payload: plan })
    expect(state.plan.project_name).toBe('Test')
    expect(state.past.length).toBe(0)
  })

  it('adds a story and pushes history', () => {
    const plan = makePlan()
    const newStory: Story = { id: 'US-102', epic_id: 'E1', title: 'Story 2', criteria: [], points: null, priority: 'Medium', depends_on: [], done: false }
    const state = planReducer(emptyState(plan), { type: 'ADD_STORY', payload: { groupIndex: 0, story: newStory } })
    expect(state.plan.groups[0].stories.length).toBe(2)
    expect(state.past.length).toBe(1)
  })

  it('deletes a story', () => {
    const plan = makePlan()
    const state = planReducer(emptyState(plan), { type: 'DELETE_STORY', payload: { groupIndex: 0, storyId: 'US-101' } })
    expect(state.plan.groups[0].stories.length).toBe(0)
  })

  it('edits a story', () => {
    const plan = makePlan()
    const state = planReducer(emptyState(plan), { type: 'EDIT_STORY', payload: { groupIndex: 0, storyId: 'US-101', field: 'title', value: 'Updated' } })
    expect(state.plan.groups[0].stories[0].title).toBe('Updated')
  })

  it('moves a story', () => {
    const plan = makePlan()
    const state = planReducer(emptyState(plan), { type: 'MOVE_STORY', payload: { fromGroupIndex: 0, toGroupIndex: 0, fromIndex: 0, toIndex: 0 } })
    expect(state.plan.groups[0].stories.length).toBe(1)
  })

  it('toggles done immutably', () => {
    const plan = makePlan()
    const state = planReducer(emptyState(plan), { type: 'TOGGLE_DONE', payload: { groupIndex: 0, storyId: 'US-101' } })
    expect(state.plan.groups[0].stories[0].done).toBe(true)
    expect(plan.groups[0].stories[0].done).toBe(false)
  })

  it('undoes and redoes', () => {
    const plan = makePlan()
    const s1 = planReducer(emptyState(plan), { type: 'ADD_STORY', payload: { groupIndex: 0, story: { id: 'US-102', epic_id: 'E1', title: 'S2', criteria: [], points: null, priority: 'Low', depends_on: [], done: false } } })
    expect(s1.past.length).toBe(1)
    const s2 = planReducer(s1, { type: 'UNDO' })
    expect(s2.plan.groups[0].stories.length).toBe(1)
    expect(s2.future.length).toBe(1)
    const s3 = planReducer(s2, { type: 'REDO' })
    expect(s3.plan.groups[0].stories.length).toBe(2)
  })

  it('bulk deletes', () => {
    const plan = makePlan()
    const with2 = planReducer(emptyState(plan), { type: 'ADD_STORY', payload: { groupIndex: 0, story: { id: 'US-102', epic_id: 'E1', title: 'S2', criteria: [], points: null, priority: 'Low', depends_on: [], done: false } } })
    const del = planReducer(with2, { type: 'BULK_DELETE', payload: { storyIds: ['US-101', 'US-102'] } })
    expect(del.plan.groups[0].stories.length).toBe(0)
  })

  it('bulk toggle done', () => {
    const plan = makePlan()
    const s = planReducer(emptyState(plan), { type: 'BULK_TOGGLE_DONE', payload: { storyIds: ['US-101'], done: true } })
    expect(s.plan.groups[0].stories[0].done).toBe(true)
  })
})
