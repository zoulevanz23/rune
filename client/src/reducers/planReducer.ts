import { Plan, Group, Story, Epic } from '@/types/plan'

type Action =
  | { type: 'LOAD_PLAN'; payload: Plan }
  | { type: 'ADD_STORY'; payload: { groupIndex: number; story: Story } }
  | { type: 'DELETE_STORY'; payload: { groupIndex: number; storyId: string } }
  | { type: 'EDIT_STORY'; payload: { groupIndex: number; storyId: string; field: string; value: any } }
  | { type: 'MOVE_STORY'; payload: { fromGroupIndex: number; toGroupIndex: number; fromIndex: number; toIndex: number } }
  | { type: 'SET_PLAN'; payload: Plan }
  | { type: 'TOGGLE_DONE'; payload: { groupIndex: number; storyId: string } }
  | { type: 'ADD_EPIC'; payload: Epic }
  | { type: 'ADD_GROUP'; payload: Group }
  | { type: 'DELETE_GROUP'; payload: { groupIndex: number } }
  | { type: 'RENAME_GROUP'; payload: { groupIndex: number; name: string } }
  | { type: 'REORDER_GROUPS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'BULK_DELETE'; payload: { storyIds: string[] } }
  | { type: 'BULK_TOGGLE_DONE'; payload: { storyIds: string[]; done: boolean } }
  | { type: 'BULK_MOVE'; payload: { storyIds: string[]; toGroupIndex: number } }
  | { type: 'UNDO' }
  | { type: 'REDO' }

interface State {
  plan: Plan
  previousPlan: Plan | null
  past: Plan[]
  future: Plan[]
}

const HISTORY_LIMIT = 30

const clonePlan = (p: Plan): Plan => JSON.parse(JSON.stringify(p))

const pushHistory = (state: State, nextPlan: Plan): State => {
  const snapshot = clonePlan(state.plan)
  const past = [...state.past, snapshot].slice(-HISTORY_LIMIT)
  return { plan: nextPlan, previousPlan: snapshot, past, future: [] }
}

const planReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_PLAN':
      return { plan: clonePlan(action.payload), previousPlan: null, past: [], future: [] }
    case 'SET_PLAN':
      return pushHistory(state, clonePlan(action.payload))

    case 'ADD_STORY': {
      const groups = [...state.plan.groups]
      groups[action.payload.groupIndex] = {
        ...groups[action.payload.groupIndex],
        stories: [...groups[action.payload.groupIndex].stories, action.payload.story],
      }
      return pushHistory(state, { ...state.plan, groups })
    }

    case 'DELETE_STORY': {
      const groups = [...state.plan.groups]
      groups[action.payload.groupIndex] = {
        ...groups[action.payload.groupIndex],
        stories: groups[action.payload.groupIndex].stories.filter(s => s.id !== action.payload.storyId),
      }
      return pushHistory(state, { ...state.plan, groups })
    }

    case 'EDIT_STORY': {
      const groups = [...state.plan.groups]
      const stories = [...groups[action.payload.groupIndex].stories]
      const idx = stories.findIndex(s => s.id === action.payload.storyId)
      if (idx >= 0) {
        let v: any = action.payload.value
        if (action.payload.field === 'criteria') {
          if (typeof v === 'string') {
            try { const p = JSON.parse(v); if (Array.isArray(p)) v = p; else v = [String(v)] } catch { v = v ? [String(v)] : [] }
          }
          if (!Array.isArray(v)) v = [String(v)]
        }
        stories[idx] = { ...stories[idx], [action.payload.field]: v }
      }
      groups[action.payload.groupIndex] = { ...groups[action.payload.groupIndex], stories }
      return pushHistory(state, { ...state.plan, groups })
    }

    case 'MOVE_STORY': {
      const { fromGroupIndex, toGroupIndex, fromIndex, toIndex } = action.payload
      let groups: Group[]
      if (fromGroupIndex === toGroupIndex) {
        groups = state.plan.groups.map((g, i) => {
          if (i !== fromGroupIndex) return g
          const stories = [...g.stories]
          const story = stories.splice(fromIndex, 1)[0]
          stories.splice(toIndex, 0, story)
          return { ...g, stories }
        })
      } else {
        groups = state.plan.groups.map((g, i) =>
          i === fromGroupIndex
            ? { ...g, stories: g.stories.filter((_, idx) => idx !== fromIndex) }
            : i === toGroupIndex
            ? { ...g, stories: [...g.stories.slice(0, toIndex), state.plan.groups[fromGroupIndex].stories[fromIndex], ...g.stories.slice(toIndex)] }
            : g
        )
      }
      return pushHistory(state, { ...state.plan, groups })
    }

    case 'TOGGLE_DONE': {
      const groups = state.plan.groups.map((g, gi) => {
        if (gi !== action.payload.groupIndex) return g
        return {
          ...g,
          stories: g.stories.map(s => s.id === action.payload.storyId ? { ...s, done: !s.done } : s)
        }
      })
      return pushHistory(state, { ...state.plan, groups })
    }

    case 'ADD_EPIC': {
      return pushHistory(state, { ...state.plan, epics: [...state.plan.epics, action.payload] })
    }

    case 'ADD_GROUP': {
      return pushHistory(state, { ...state.plan, groups: [...state.plan.groups, action.payload] })
    }

    case 'DELETE_GROUP': {
      const groups = state.plan.groups.filter((_, i) => i !== action.payload.groupIndex)
      return pushHistory(state, { ...state.plan, groups })
    }

    case 'RENAME_GROUP': {
      const groups = [...state.plan.groups]
      const g: any = groups[action.payload.groupIndex]
      if (!g) return state
      groups[action.payload.groupIndex] = { ...g, name: action.payload.name }
      return pushHistory(state, { ...state.plan, groups })
    }

    case 'REORDER_GROUPS': {
      const { fromIndex, toIndex } = action.payload
      const groups = [...state.plan.groups]
      const [moved] = groups.splice(fromIndex, 1)
      groups.splice(toIndex, 0, moved)
      const renumbered = groups.map((g: any, i) => g.type === 'sprint' ? { ...g, number: i + 1 } : g)
      return pushHistory(state, { ...state.plan, groups: renumbered })
    }

    case 'BULK_DELETE': {
      const ids = new Set(action.payload.storyIds)
      const groups = state.plan.groups.map(g => ({ ...g, stories: g.stories.filter(s => !ids.has(s.id)) }))
      return pushHistory(state, { ...state.plan, groups })
    }

    case 'BULK_TOGGLE_DONE': {
      const ids = new Set(action.payload.storyIds)
      const groups = state.plan.groups.map(g => ({
        ...g,
        stories: g.stories.map(s => ids.has(s.id) ? { ...s, done: action.payload.done } : s)
      }))
      return pushHistory(state, { ...state.plan, groups })
    }

    case 'BULK_MOVE': {
      const ids = new Set(action.payload.storyIds)
      const toMove: Story[] = []
      const groupsWithout = state.plan.groups.map(g => {
        const keep: Story[] = []
        for (const s of g.stories) {
          if (ids.has(s.id)) toMove.push(s)
          else keep.push(s)
        }
        return { ...g, stories: keep }
      })
      const groups = groupsWithout.map((g, i) => i === action.payload.toGroupIndex ? { ...g, stories: [...g.stories, ...toMove] } : g)
      return pushHistory(state, { ...state.plan, groups })
    }

    case 'UNDO': {
      if (state.past.length === 0) {
        if (!state.previousPlan) return state
        return { plan: clonePlan(state.previousPlan), previousPlan: null, past: [], future: [clonePlan(state.plan)] }
      }
      const prev = state.past[state.past.length - 1]
      const past = state.past.slice(0, -1)
      const future = [clonePlan(state.plan), ...state.future].slice(0, HISTORY_LIMIT)
      return { plan: clonePlan(prev), previousPlan: past.length ? clonePlan(past[past.length - 1]) : null, past, future }
    }

    case 'REDO': {
      if (state.future.length === 0) return state
      const next = state.future[0]
      const future = state.future.slice(1)
      const past = [...state.past, clonePlan(state.plan)].slice(-HISTORY_LIMIT)
      return { plan: clonePlan(next), previousPlan: clonePlan(state.plan), past, future }
    }

    default:
      return state
  }
}

export { planReducer }
export type { Action, State }
