export const landingNav = [
  { id: 'how', label: 'How it works' },
  { id: 'modes', label: 'Methodologies' },
  { id: 'caps', label: 'Capabilities' },
  { id: 'faq', label: 'FAQ' },
]

export const hero = {
  title: 'Turn a rough idea into a sprint plan',
  subtitle:
    'Rune reads your description and drafts epics, user stories and a board. Refine it with AI, track progress, map dependencies, and share a read-only link with your team.',
  primaryCta: 'Start drafting, it\'s free',
  secondaryCta: 'See how it works',
  facts: ['No sign-up', '10+ methodologies', 'AI refine actions', 'Analytics & progress', 'Shareable links'],
  demoNote: 'A pet-care app where owners book dog walkers, follow the walk live on a map, and pay in the app. Needs reviews and push alerts.',
}

export const howItWorks = {
  title: 'From description to board in three steps',
  subtitle: 'No templates and no fields to map. Explain the app the way you would to a teammate.',
  steps: [
    {
      n: 1,
      title: 'Describe the app',
      desc: 'Paste a rough paragraph in plain language. Add optional context — team size, deadline, tech stack — for a sharper plan.',
    },
    {
      n: 2,
      title: 'Get epics and stories back',
      desc: 'Epics come with risks and a definition of done. Stories carry criteria, points and dependencies, returned as validated JSON rather than prose.',
    },
    {
      n: 3,
      title: 'Work it as a board',
      desc: 'View it as a board, table, dependency graph or timeline. Drag to reorder, refine with AI, and share a read-only link.',
    },
  ],
}

export const methodologies = {
  title: 'One plan, many ways to run it',
  subtitle: 'Pick the methodology that fits your team, or let Rune choose from the description. The board language stays the same.',
  items: [
    { name: 'Scrum', desc: 'Numbered sprints with goals and velocity' },
    { name: 'Kanban', desc: 'Continuous flow with WIP limits' },
    { name: 'Scrumban', desc: 'Sprints with pull-based WIP limits' },
    { name: 'Shape Up', desc: 'Fixed cycles, variable scope' },
    { name: 'Story Mapping', desc: 'Organised by the user journey' },
    { name: 'MoSCoW', desc: 'Must / Should / Could / Won\'t have' },
    { name: 'Lean Canvas', desc: 'Problem and solution driven' },
    { name: 'Design Sprint', desc: 'A five-day prototype cycle' },
    { name: 'OKR-based', desc: 'Planned around objectives and key results' },
    { name: 'Feature-based', desc: 'Organised by feature area' },
  ],
}

export const capabilities = {
  title: 'A living workspace, not a one-shot export',
  items: [
    {
      title: 'AI refine actions',
      desc: 'One-click transformations: add missing stories, split oversized ones, re-prioritise, estimate unestimated work, wire up dependencies, and sharpen acceptance criteria.',
    },
    {
      title: 'Dependency graph',
      desc: 'See story dependencies as a graph so blockers and critical paths are obvious before they bite.',
    },
    {
      title: 'Analytics and progress',
      desc: 'Sprint burndown, epic completion, priority distribution and overall progress by points or story count.',
    },
    {
      title: 'Shareable links',
      desc: 'Generate a read-only link for stakeholders. No account needed for whoever opens it.',
    },
    {
      title: 'Auto-saved',
      desc: 'Every edit persists automatically, so a refresh never costs you progress. Undo and redo included.',
    },
    {
      title: 'Export anywhere',
      desc: 'Copy as Markdown for docs, download a Jira-ready CSV, or export a PDF for stakeholder reviews.',
    },
  ],
}

export const faq = {
  title: 'Common questions',
  items: [
    {
      q: 'What makes Rune different from ChatGPT or Claude?',
      a: 'Rune is built for agile planning. It returns structured, validated JSON that maps straight onto a drag-and-drop board with sprints, WIP limits and dependency tracking, then lets you refine it with AI without leaving the board.',
    },
    {
      q: 'Do I need an account to use Rune?',
      a: 'No. Plans are saved in your browser, so you can close the tab and pick up where you left off.',
    },
    {
      q: 'Will my progress survive a refresh?',
      a: 'Yes. Every change is auto-saved to your browser within a second, so marking stories done or dragging them around is never lost.',
    },
    {
      q: 'Can I import the CSV into Jira or Linear?',
      a: 'The CSV export is Jira-ready. Linear\'s CSV importer lets you map columns, so it should work there with a quick mapping step.',
    },
    {
      q: 'How does the AI generation work?',
      a: 'Rune asks a model for a strict JSON structure describing your epics and stories. The result is validated and repaired before it becomes a board, so malformed output is caught before you ever see it.',
    },
    {
      q: 'Is my data sent to the AI?',
      a: 'Only the description you write and your refine requests are sent, to generate and update the plan. Saved plans stay in your browser.',
    },
    {
      q: 'Can I share a plan with colleagues?',
      a: 'Yes. Use Share plan in the plan menu to generate a read-only link. Anyone with the link can view the board without an account.',
    },
    {
      q: 'Can I self-host Rune?',
      a: 'Yes. See the GitHub repository for setup instructions.',
    },
  ],
}

export const footer = {
  headline: 'Paste your next idea.',
  sub: 'No sign-up. Your plan stays in your browser.',
  cta: 'Start drafting',
  credit: 'Developed by Josh Ivan Sartin',
}