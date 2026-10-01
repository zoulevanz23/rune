export const landingNav = [
  { id: 'how', label: 'How it works' },
  { id: 'modes', label: 'Methodologies' },
  { id: 'caps', label: 'Capabilities' },
  { id: 'faq', label: 'FAQ' },
]

export const hero = {
  title: 'Turn a rough idea into a sprint plan',
  subtitle:
    'Rune reads your description and drafts epics, user stories and a board, in Scrum or Kanban. Edit, reorder, export and refine in plain language.',
  primaryCta: 'Start drafting, it\'s free',
  secondaryCta: 'See how it works',
  facts: ['No sign-up', 'Scrum and Kanban', 'Saved in your browser'],
  demoNote: 'A pet-care app where owners book dog walkers, follow the walk live on a map, and pay in the app. Needs reviews and push alerts.',
}

export const howItWorks = {
  title: 'From description to board in three steps',
  subtitle: 'No templates and no fields to map. Explain the app the way you would to a teammate.',
  steps: [
    {
      n: 1,
      title: 'Describe the app',
      desc: 'Paste a rough paragraph in plain language. Rune needs nothing else.',
    },
    {
      n: 2,
      title: 'Get epics and stories back',
      desc: 'Epics come with risks and a definition of done. Stories carry criteria, points and dependencies, returned as validated JSON, not prose.',
    },
    {
      n: 3,
      title: 'Work it as a board',
      desc: 'View it as a sprint plan or a Kanban flow. Drag to reorder, edit in place, export to Markdown or CSV.',
    },
  ],
}

export const methodologies = {
  title: 'One plan, two ways to run it',
  subtitle: 'Pick the methodology that fits your team. The board language stays the same.',
  scrum: {
    title: 'Scrum',
    desc: 'Numbered, sequential sprints. The deepest mode — sprint goals, timeline strip, velocity and scope controls.',
  },
  kanban: {
    title: 'Kanban',
    desc: 'Continuous flow, pull-based system. Focus on limiting work in progress.',
  },
}

export const capabilities = {
  title: 'A living workspace, not a one-shot export',
  items: [
    {
      title: 'Edit',
      desc: 'Click any card to rewrite it in place. Titles, criteria and points update instantly.',
    },
    {
      title: 'Reorder',
      desc: 'Drag stories between sprints or columns. A soft warning appears when a Kanban column is over its WIP limit, and it never blocks the move.',
    },
    {
      title: 'Export',
      desc: 'Copy as Markdown for docs, or download a Jira-ready CSV. PDF is there too.',
    },
    {
      title: 'Refine',
      desc: 'Ask for changes in plain language, like "make sprint 2 about onboarding". One-step undo included.',
    },
    {
      title: 'Save',
      desc: 'Plans stay in your browser with IndexedDB. No account and no backend storage.',
    },
  ],
}

export const faq = {
  title: 'Common questions',
  items: [
    {
      q: 'What makes Rune different from ChatGPT or Claude?',
      a: 'Rune is built for agile planning. It returns structured, validated JSON that maps straight onto a drag-and-drop board with sprints and WIP limits. You refine the plan on the board itself, with undo.',
    },
    {
      q: 'Do I need an account to use Rune?',
      a: 'No. Plans are saved in your browser, so you can come back and pick up where you left off.',
    },
    {
      q: 'Can I import the CSV into Jira or Linear?',
      a: 'The CSV export is Jira-ready. Linear\'s CSV importer lets you map columns, so it should work there with a quick mapping step.',
    },
    {
      q: 'How does the AI generation work?',
      a: 'Rune sends your description to an AI model and asks for a strict JSON structure. The result is validated before it becomes a board.',
    },
    {
      q: 'Is my data sent to the AI?',
      a: 'Only the description you write and your refine requests are sent to generate and update the plan. Saved plans stay in your browser.',
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
