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
  | { type: 'UNDO' }

interface State {
  plan: Plan
  previousPlan: Plan | null
}

const planReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_PLAN':
    case 'SET_PLAN':
      return { plan: action.payload, previousPlan: null }

    case 'ADD_STORY': {
      const groups = [...state.plan.groups]
      groups[action.payload.groupIndex] = {
        ...groups[action.payload.groupIndex],
        stories: [...groups[action.payload.groupIndex].stories, action.payload.story],
      }
      return { ...state, plan: { ...state.plan, groups } }
    }

    case 'DELETE_STORY': {
      const groups = [...state.plan.groups]
      groups[action.payload.groupIndex] = {
        ...groups[action.payload.groupIndex],
        stories: groups[action.payload.groupIndex].stories.filter(s => s.id !== action.payload.storyId),
      }
      return { ...state, plan: { ...state.plan, groups } }
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
      return { ...state, plan: { ...state.plan, groups } }
    }

    case 'MOVE_STORY': {
      const { fromGroupIndex, toGroupIndex, fromIndex, toIndex } = action.payload
      if (fromGroupIndex === toGroupIndex) {
        const groups = state.plan.groups.map((g, i) => {
          if (i !== fromGroupIndex) return g
          const stories = [...g.stories]
          const story = stories.splice(fromIndex, 1)[0]
          stories.splice(toIndex, 0, story)
          return { ...g, stories }
        })
        return { ...state, plan: { ...state.plan, groups } }
      }
      const groups = state.plan.groups.map((g, i) =>
        i === fromGroupIndex
          ? { ...g, stories: g.stories.filter((_, idx) => idx !== fromIndex) }
          : i === toGroupIndex
          ? { ...g, stories: [...g.stories.slice(0, toIndex), state.plan.groups[fromGroupIndex].stories[fromIndex], ...g.stories.slice(toIndex)] }
          : g
      )
      return { ...state, plan: { ...state.plan, groups } }
    }

    case 'TOGGLE_DONE': {
      const groups = [...state.plan.groups]
      const stories = [...groups[action.payload.groupIndex].stories]
      const story = stories.find(s => s.id === action.payload.storyId)
      if (story) {
        story.done = !story.done
      }
      return { ...state, plan: { ...state.plan, groups } }
    }

    case 'ADD_EPIC': {
      return { ...state, plan: { ...state.plan, epics: [...state.plan.epics, action.payload] } }
    }

    case 'ADD_GROUP': {
      return { ...state, plan: { ...state.plan, groups: [...state.plan.groups, action.payload] } }
    }

    case 'DELETE_GROUP': {
      const groups = state.plan.groups.filter((_, i) => i !== action.payload.groupIndex)
      return { ...state, plan: { ...state.plan, groups } }
    }

    case 'RENAME_GROUP': {
      const groups = [...state.plan.groups]
      const g: any = groups[action.payload.groupIndex]
      if (!g) return state
      groups[action.payload.groupIndex] = { ...g, name: action.payload.name }
      return { ...state, plan: { ...state.plan, groups } }
    }

    case 'REORDER_GROUPS': {
      const { fromIndex, toIndex } = action.payload
      const groups = [...state.plan.groups]
      const [moved] = groups.splice(fromIndex, 1)
      groups.splice(toIndex, 0, moved)
      // keep sprint numbers sequential
      const renumbered = groups.map((g: any, i) => g.type === 'sprint' ? { ...g, number: i + 1 } : g)
      return { ...state, plan: { ...state.plan, groups: renumbered } }
    }

    case 'UNDO': {
      if (!state.previousPlan) return state
      return { plan: state.previousPlan, previousPlan: null }
    }

    default:
      return state
  }
}

export { planReducer }
export type { Action, State }
