import { Plan } from '@/types/plan'

export function toMarkdown(plan: Plan): string {
  const lines: string[] = [`# ${plan.project_name}`]

  if (plan.methodology === 'kanban') {
    lines.push('')
    lines.push('## Methodology: Kanban')
  } else {
    lines.push('')
    lines.push('## Methodology: Scrum')
  }

  if (plan.epics.length > 0) {
    lines.push('')
    lines.push('### Epics')
    plan.epics.forEach(epic => {
      lines.push(`- **${epic.name}** (${epic.id})`)
      if (epic.risk) lines.push(`  - Risk: ${epic.risk}`)
      if (epic.definition_of_done?.length) {
        lines.push(`  - Definition of Done:`)
        epic.definition_of_done.forEach(d => lines.push(`    - ${d}`))
      }
    })
  }

  lines.push('')
  for (const group of plan.groups) {
    const heading = group.type === 'sprint'
      ? `## Sprint ${group.number} — ${group.name}`
      : `## ${group.name}`
    lines.push(heading)
    if (group.type === 'sprint' && group.goal) {
      lines.push(`Goal: ${group.goal}`)
    }
    if (group.type === 'column' && group.wip_limit) {
      lines.push(`WIP Limit: ${group.wip_limit}`)
    }

    for (const story of group.stories) {
      lines.push('')
      lines.push(`### ${story.id} — ${story.title}`)
      lines.push(`- **Priority:** ${story.priority}`)
      if (story.points !== null && story.points !== undefined) {
        lines.push(`- **Points:** ${story.points}`)
      }
      lines.push(`- **Epic:** ${story.epic_id}`)
      if (story.depends_on.length > 0) {
        lines.push(`- **Depends on:** ${story.depends_on.join(', ')}`)
      }
      lines.push(`- **Criteria:**`)
      story.criteria.forEach(c => lines.push(`  - ${c}`))
    }
  }

  return lines.join('\n')
}
