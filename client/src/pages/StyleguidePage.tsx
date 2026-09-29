import React, { useState } from 'react'
import {
  Button, IconButton, Chip, Readout, Panel, Input, Textarea, Select, Tabs, Dialog, Drawer,
  Tooltip, useToast, Checkbox, Radio, Switch, Menu, Progress, Skeleton,
  SkeletonText, EmptyState, Kbd,
} from '@/components/primitives'
import { Plus, Download, Trash2, ChevronDown, Search, Layers } from 'lucide-react'

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 12 }}>{title}</h2>
    <Panel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>
    </Panel>
  </section>
)

const Swatches: React.FC = () => (
  <Section title="Color tokens">
    {[
      ['--bg', 'var(--bg)'], ['--surface', 'var(--surface)'], ['--surface-2', 'var(--surface-2)'],
      ['--surface-3', 'var(--surface-3)'], ['--nav', 'var(--nav)'], ['--primary', 'var(--primary)'],
      ['--success', 'var(--success)'], ['--warning', 'var(--warning)'], ['--danger', 'var(--danger)'],
      ['--border', 'var(--border)'], ['--ink', 'var(--ink)'], ['--muted', 'var(--muted)'],
    ].map(([name, value]) => (
      <div key={name} style={{ width: 132 }}>
        <div style={{ height: 44, borderRadius: 'var(--radius-md)', background: value, border: '1px solid var(--border)' }} />
        <div className="tnum" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{name}</div>
      </div>
    ))}
  </Section>
)

export const StyleguidePage: React.FC = () => {
  const [tab, setTab] = useState('buttons')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checked, setChecked] = useState(true)
  const [radio, setRadio] = useState('scrum')
  const [on, setOn] = useState(true)
  const { show } = useToast()

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '8px 4px 64px' }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 26, fontWeight: 600, marginBottom: 4 }}>Rune style guide</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>
        Hidden reference route at <code>/styleguide</code>. Not linked from navigation.
      </p>

      <Swatches />

      <Section title="Typography">
        <Readout variant="label" size="xs">Section label</Readout>
        <Readout variant="metric" size="lg">24 pts</Readout>
        <Readout variant="status" size="xs">Saved</Readout>
        <span style={{ fontSize: 14, color: 'var(--ink)' }}>Body 14px Inter</span>
        <span style={{ fontSize: 20, fontWeight: 600 }}>Heading 20px</span>
        <Kbd>⌘</Kbd><Kbd>K</Kbd><Kbd>Enter</Kbd>
      </Section>

      <Section title="Buttons">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="primary" loading>Saving</Button>
        <Button variant="primary" leftIcon={<Plus size={16} strokeWidth={1.7} />}>With icon</Button>
        <IconButton aria-label="Add"><Plus size={18} strokeWidth={1.7} /></IconButton>
        <IconButton aria-label="Download" variant="secondary"><Download size={18} strokeWidth={1.7} /></IconButton>
        <IconButton aria-label="Delete" variant="danger"><Trash2 size={18} strokeWidth={1.7} /></IconButton>
        <Tooltip content="Tooltip content"><span style={{ fontSize: 14, color: 'var(--muted)' }}>Hover me</span></Tooltip>
      </Section>

      <Section title="Tags">
        <Chip size="xs">xs</Chip>
        <Chip size="sm">sm</Chip>
        <Chip variant="primary">primary</Chip>
        <Chip variant="success">success</Chip>
        <Chip variant="warning">warning</Chip>
        <Chip variant="danger">danger</Chip>
        <Chip variant="outline" pill>pill</Chip>
        <Chip removable onRemove={() => show('Removed', 'info')}>removable</Chip>
      </Section>

      <Section title="Form controls">
        <Input placeholder="Text input" size="sm" style={{ maxWidth: 220 }} />
        <Input placeholder="With error" error="Required" size="sm" style={{ maxWidth: 220 }} />
        <Select size="sm" aria-label="Example select" options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]} style={{ maxWidth: 180 }} />
        <Textarea placeholder="Textarea" rows={2} style={{ maxWidth: 260 }} />
        <Checkbox label="Checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
        <Switch label="Switch" checked={on} onChange={e => setOn(e.target.checked)} />
        <div style={{ display: 'flex', gap: 12 }}>
          <Radio name="sg-radio" label="Scrum" checked={radio === 'scrum'} onChange={() => setRadio('scrum')} />
          <Radio name="sg-radio" label="Kanban" checked={radio === 'kanban'} onChange={() => setRadio('kanban')} />
        </div>
      </Section>

      <Section title="Overlays & menus">
        <Button variant="secondary" onClick={() => setDialogOpen(true)}>Open dialog</Button>
        <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
        <Button variant="secondary" onClick={() => show('Saved to this device', 'success')}>Toast</Button>
        <Menu
          label="Demo menu"
          trigger={<IconButton aria-label="Menu"><ChevronDown size={18} strokeWidth={1.7} /></IconButton>}
          items={[
            { id: 'rename', label: 'Rename', icon: <Search size={16} strokeWidth={1.7} /> },
            { id: 'export', label: 'Export', shortcut: '⌘E' },
            { id: 'delete', label: 'Delete', danger: true, icon: <Trash2 size={16} strokeWidth={1.7} /> },
          ]}
        />
      </Section>

      <Section title="Feedback">
        <Progress value={62} label="Sprint progress" showValue />
        <Progress value={100} tone="success" showValue style={{ maxWidth: 220 }} />
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <Skeleton height={80} radius="var(--radius-lg)" />
          <div><Skeleton width="60%" /><div style={{ height: 8 }} /><SkeletonText lines={3} /></div>
          <EmptyState compact icon={<Layers size={18} strokeWidth={1.7} />} title="No plans yet" description="Generate your first plan to see it here." action={<Button size="sm">New plan</Button>} />
        </div>
      </Section>

      <Section title="Navigation">
        <Tabs
          activeTab={tab}
          onChange={setTab}
          tabs={[{ id: 'buttons', label: 'Buttons' }, { id: 'forms', label: 'Forms' }, { id: 'nav', label: 'Navigation' }]}
        />
        <Tabs
          variant="segmented"
          activeTab={tab}
          onChange={setTab}
          tabs={[{ id: 'buttons', label: 'Board' }, { id: 'forms', label: 'Table' }, { id: 'nav', label: 'Timeline' }]}
        />
      </Section>

      <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} title="Dialog title" description="Short description of what this dialog does."
        footer={<><Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={() => setDialogOpen(false)}>Confirm</Button></>}>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>Dialog body content.</p>
      </Dialog>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Drawer title" description="Right-hand slide-in panel."
        footer={<Button onClick={() => setDrawerOpen(false)}>Close</Button>}>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>Drawer body content.</p>
      </Drawer>

    </div>
  )
}

export default StyleguidePage
