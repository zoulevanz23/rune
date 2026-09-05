import { Plan } from '@/types/plan'

export function toCsv(plan: Plan): string {
  const header = `Group,Epic,ID,Title,Description,Story Points,Priority,Epic Link`
  const rows = plan.groups.flatMap(group => {
    const groupLabel = group.type === 'sprint' ? `Sprint ${group.number}` : group.name
    return group.stories.map(story => {
      const epic = plan.epics.find(e => e.id === story.epic_id)
      const criteria = story.criteria.join('; ')
      const points = story.points ?? ''
      return `"${groupLabel}","${epic?.name ?? ''}","${story.id}","${story.title}","${criteria}","${points}","${story.priority}","${story.epic_id}"`
    })
  })
  return [header, ...rows].join('\n')
}

export function downloadCsv(plan: Plan): void {
  const csv = toCsv(plan)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${plan.project_name}-plan.csv`
  a.click()
  URL.revokeObjectURL(url)
}
