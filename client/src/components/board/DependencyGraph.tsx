import React, { useMemo } from 'react'
import { Plan, Story } from '@/types/plan'
import { Panel } from '@/components/primitives'

interface Props {
  plan: Plan
}

interface Node {
  id: string
  story: Story
  x: number
  y: number
}

export const DependencyGraph: React.FC<Props> = ({ plan }) => {
  const { nodes, edges } = useMemo(() => {
    const allStories = plan.groups.flatMap(g => g.stories)
    const storyMap = new Map(allStories.map(s => [s.id, s]))

    const cols = Math.ceil(Math.sqrt(allStories.length))
    const rows = Math.ceil(allStories.length / cols)
    const cellW = 180
    const cellH = 80
    const padX = 40
    const padY = 40

    const nodes: Node[] = allStories.map((story, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      return {
        id: story.id,
        story,
        x: padX + col * cellW,
        y: padY + row * cellH,
      }
    })

    const edges: { from: Node; to: Node }[] = []
    for (const story of allStories) {
      for (const depId of story.depends_on) {
        const depStory = storyMap.get(depId)
        if (depStory) {
          const fromNode = nodes.find(n => n.id === depId)
          const toNode = nodes.find(n => n.id === story.id)
          if (fromNode && toNode) {
            edges.push({ from: fromNode, to: toNode })
          }
        }
      }
    }

    return { nodes, edges }
  }, [plan])

  if (nodes.length === 0) {
    return (
      <Panel radius="lg" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No stories to display</p>
      </Panel>
    )
  }

  const width = Math.max(...nodes.map(n => n.x)) + 200
  const height = Math.max(...nodes.map(n => n.y)) + 100

  return (
    <Panel radius="lg" style={{ padding: 16, overflow: 'auto' }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Dependency Graph</h3>
        <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>
          Arrows point from prerequisite → dependent story
        </p>
      </div>
      <svg width={width} height={height} style={{ display: 'block' }}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--primary)" />
          </marker>
        </defs>
        {edges.map((edge, i) => {
          const fromX = edge.from.x + 140
          const fromY = edge.from.y + 30
          const toX = edge.to.x
          const toY = edge.to.y + 30
          const midX = (fromX + toX) / 2
          return (
            <path
              key={i}
              d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={1.5}
              markerEnd="url(#arrowhead)"
              opacity={0.6}
            />
          )
        })}
        {nodes.map(node => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={140}
              height={50}
              rx={8}
              fill={node.story.done ? 'var(--success-soft)' : 'var(--surface)'}
              stroke={node.story.done ? 'var(--success)' : 'var(--border)'}
              strokeWidth={1}
            />
            <text
              x={node.x + 8}
              y={node.y + 16}
              fontSize={10}
              fontWeight={600}
              fill="var(--muted)"
            >
              {node.id}
            </text>
            <text
              x={node.x + 8}
              y={node.y + 32}
              fontSize={11}
              fontWeight={500}
              fill="var(--ink)"
            >
              {node.story.title.length > 18 ? node.story.title.slice(0, 18) + '…' : node.story.title}
            </text>
            <text
              x={node.x + 8}
              y={node.y + 44}
              fontSize={10}
              fill="var(--muted)"
            >
              {node.story.points ? `${node.story.points} pts` : 'No estimate'} · {node.story.priority}
            </text>
          </g>
        ))}
      </svg>
    </Panel>
  )
}
