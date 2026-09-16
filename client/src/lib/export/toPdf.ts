import { Plan } from '@/types/plan'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportToPdf(plan: Plan): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  // Cover page
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text(plan.project_name || 'Untitled Plan', 20, 30)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`${plan.methodology.toUpperCase()} Plan`, 20, 40)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 48)

  // Epic legend
  if (plan.epics.length > 0) {
    doc.addPage()
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Epics', 20, 20)
    autoTable(doc, {
      head: [['ID', 'Name', 'Risk', 'Definition of Done']],
      body: plan.epics.map(e => [
        e.id,
        e.name,
        e.risk || '-',
        e.definition_of_done?.join('; ') || '-'
      ]),
      startY: 28,
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: { 3: { cellWidth: 80 } }
    })
  }

  // Sprint/Column pages
  for (const group of plan.groups) {
    doc.addPage()
    const title = group.type === 'sprint' ? `Sprint ${group.number}: ${group.name}` : group.name
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 20, 20)
    if (group.type === 'sprint' && group.goal) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Goal: ${group.goal}`, 20, 28)
    }

    const startY = group.type === 'sprint' && group.goal ? 35 : 28
    autoTable(doc, {
      head: [['ID', 'Title', 'Points', 'Priority', 'Criteria', 'Done']],
      body: group.stories.map(s => [
        s.id,
        s.title,
        s.points ?? '-',
        s.priority,
        s.criteria.join('\n'),
        s.done ? '✓' : '○'
      ]),
      startY,
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: { 4: { cellWidth: 80 } }
    })
  }

  doc.save(`${(plan.project_name || 'plan').replace(/\s+/g, '_')}_plan.pdf`)
}