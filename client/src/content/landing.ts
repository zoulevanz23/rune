export const landingNav = [
  { id: 'how', label: 'How it works' },
  { id: 'methods', label: 'Methodologies' },
  { id: 'caps', label: 'Capabilities' },
  { id: 'pricing', label: 'Pricing' },
]

export const hero = {
  eyebrow: 'Agile planning',
  titleTop: 'Turn a rough idea',
  titleBottom: 'into a sprint plan',
  subtitle:
    'Rune reads your description and drafts epics, user stories and a board — Scrum or Kanban. Edit, reorder, export and refine in plain language.',
  primaryCta: 'Start drafting — free',
  secondaryCta: 'See how it works',
  steps: ['Describe', 'Generate', 'Work the board'],
}

export const preview = {
  alt: 'A wall of handwritten sticky notes',
  caption: 'From rough notes to a structured plan.',
}

export const howItWorks = {
  title: 'How it works',
  kicker: 'Three steps, no templates',
  steps: [
    {
      n: 1,
      title: 'Describe the app, in plain language',
      desc: 'Paste a rough paragraph. No template to fill, no fields to map — just how you would explain it to a teammate.',
    },
    {
      n: 2,
      title: 'Get epics and user stories back',
      desc: 'Structured epics with risks and definition of done. Stories with criteria, points and dependencies — validated JSON, not prose.',
    },
    {
      n: 3,
      title: 'See it laid out as a board',
      desc: 'Sprint plan or Kanban flow, same language. Drag to reorder, edit in place, export to Markdown or CSV.',
    },
  ],
}

export const methodologies = {
  title: 'Methodologies',
  kicker: 'One plan, two modes',
  scrum: {
    title: 'Scrum',
    desc: 'Numbered sprints, sequential. Deepest mode — sprint goals, timeline strip, velocity and scope controls.',
    sprints: ['Sprint 1', 'Sprint 2', 'Sprint 3'],
  },
  kanban: {
    title: 'Kanban',
    desc: 'Continuous flow. Named columns with WIP limits. No sprints, same board language.',
    columns: ['Backlog', 'In progress', 'Review', 'Done'],
    wip: 'WIP 3',
  },
}

export const capabilities = {
  title: 'Capabilities',
  kicker: 'What you can do',
  items: [
    {
      title: 'Edit',
      desc: 'Click any card to rewrite it in place. Title, criteria and points update instantly — the plan is a living workspace, not a one-shot export.',
    },
    {
      title: 'Reorder',
      desc: 'Drag stories between sprints or columns. A soft warning appears when a Kanban column is over its WIP limit — it never blocks the move.',
    },
    {
      title: 'Export',
      desc: 'Copy as Markdown for docs or export a Jira-ready CSV. Same data, two formats — no reformatting by hand.',
    },
    {
      title: 'Refine',
      desc: 'Ask for changes in plain language — “make sprint 2 about onboarding” — the full plan updates live. One-step undo included.',
    },
    {
      title: 'Save',
      desc: 'Plans persist in your browser via IndexedDB. No account, no backend storage — come back anytime, pick up where you left off.',
    },
  ],
}

export const pricing = {
  title: 'Pricing',
  kicker: 'Fair, transparent',
  plans: [
    {
      name: 'Free',
      price: '$0',
      period: '',
      desc: 'For solo makers and side projects',
      features: [
        'Unlimited local plans',
        'Scrum & Kanban boards',
        'Markdown & CSV export',
        'Conversational refine',
        'Offline-first (IndexedDB)',
      ],
      cta: 'Start drafting',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/mo',
      desc: 'For professional PMs and leads',
      features: [
        'Everything in Free',
        'Cloud sync across devices',
        'Share links (view/edit)',
        'Comments & @mentions',
        'Plan templates library',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
    },
    {
      name: 'Team',
      price: '$36',
      period: '/mo',
      desc: 'For collaborative teams',
      features: [
        'Everything in Pro',
        'Team workspace',
        'Real-time co-editing',
        'Admin controls & audit log',
        'SSO (SAML/OIDC)',
        'Custom prompt templates',
      ],
      cta: 'Contact sales',
      highlight: false,
    },
  ],
}

export const faq = {
  title: 'Common questions',
  items: [
    {
      q: 'What makes Rune different from ChatGPT or Claude?',
      a: 'Rune is purpose-built for agile planning. It outputs structured, validated JSON that maps directly to a drag-and-drop board with methodology-aware features (sprints/WIP), not prose. You refine conversationally on the board itself, with undo.',
    },
    {
      q: 'Do I need an account to use Rune?',
      a: 'No. Plans save locally in your browser via IndexedDB. You can generate, edit, export, and return later without signing up. Cloud sync and sharing require a Pro account.',
    },
    {
      q: 'Can I import the CSV into Jira or Linear?',
      a: "Yes. The CSV uses Jira-compatible headers: Summary, Description, Story Points, Priority, Epic Link, Sprint/Column. Import via Jira's CSV importer or Linear's CSV import.",
    },
    {
      q: 'How does the AI generation work?',
      a: 'Your description + methodology + config goes to a FastAPI backend which calls Gemini 2.5 Flash with a methodology-branched prompt. The response is parsed, validated, and hydrated into the board.',
    },
    {
      q: 'Is my data sent to the AI?',
      a: "Only the description and config you provide are sent to the backend, which forwards to Google's Gemini API. Generated plans are not stored on our servers — they live in your browser (or your Supabase project if you enable cloud sync).",
    },
    {
      q: 'Can I self-host Rune?',
      a: 'Yes. The repo includes Docker Compose for frontend + backend. You’ll need a Google AI Studio API key. See the deployment guide in /docs.',
    },
  ],
}

export const footer = {
  headline: 'Paste your next idea.',
  sub: 'No sign-up. Your plan stays in your browser.',
  cta: 'Start drafting',
  credit: 'Developed by Josh Ivan Sartin',
}
