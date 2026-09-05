import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Plan } from '@/types/plan'
import { planReducer, Action, State } from '@/reducers/planReducer'

interface PlanContextType {
  state: State
  dispatch: React.Dispatch<Action>
  plan: Plan
}

const PlanContext = createContext<PlanContextType | null>(null)

const defaultPlan: Plan = {
  project_name: '',
  methodology: 'scrum',
  epics: [],
  groups: [],
}

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(planReducer, { plan: defaultPlan, previousPlan: null })

  return (
    <PlanContext.Provider value={{ state, dispatch, plan: state.plan }}>
      {children}
    </PlanContext.Provider>
  )
}

export const usePlan = () => {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan must be used within PlanProvider')
  return ctx
}
