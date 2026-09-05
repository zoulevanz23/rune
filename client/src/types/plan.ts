export interface Epic {
  id: string
  name: string
  risk?: string
  definition_of_done?: string[]
}

export interface Story {
  id: string
  epic_id: string
  title: string
  criteria: string[]
  points: number | null
  priority: string
  depends_on: string[]
  done: boolean
}

export interface SprintGroup {
  type: 'sprint'
  number: number
  name: string
  goal: string
  stories: Story[]
}

export interface ColumnGroup {
  type: 'column'
  name: string
  wip_limit: number | null
  stories: Story[]
}

export type Group = SprintGroup | ColumnGroup

export interface Plan {
  project_name: string
  methodology: string
  epics: Epic[]
  groups: Group[]
}
