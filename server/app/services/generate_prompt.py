from app.types import GenerationConfig


def build_prompt(config: GenerationConfig) -> str:
    sections = []

    if config.methodology:
        sections.append(f"Methodology: {config.methodology}")
    if config.sprint_count:
        sections.append(f"Sprint count: {config.sprint_count}")
    if config.sprint_length:
        sections.append(f"Sprint length: {config.sprint_length}")
    if config.scope_mode:
        sections.append(f"Scope: {config.scope_mode}")
    if config.team_velocity:
        sections.append(f"Team velocity: {config.team_velocity} points per sprint")
    if config.num_columns:
        sections.append(f"Number of columns: {config.num_columns}")
    if config.team_size:
        sections.append(f"Team size: {config.team_size} developers")
    if config.deadline:
        sections.append(f"Deadline: {config.deadline}")
    if config.tech_stack:
        sections.append(f"Tech stack: {config.tech_stack}")
    if config.project_type:
        sections.append(f"Project type: {config.project_type}")
    if config.risk_tolerance:
        sections.append(f"Risk tolerance: {config.risk_tolerance}")

    context = "\n".join(f"- {s}" for s in sections) if sections else "- No additional context provided"

    # Keep output small by default: fewer groups/stories = fewer tokens = faster.
    # An explicit sprint_count from the user is always honoured.
    sprint_target = (
        f"exactly {config.sprint_count} sprint groups"
        if config.sprint_count
        else "2-4 sprint groups (prefer fewer)"
    )

    prompt = f"""You are an agile delivery plan generator. Given the app description and context below, produce a complete agile plan as strict JSON matching this schema:

{{
  "project_name": "string",
  "methodology": "scrum" or "kanban",
  "epics": [
    {{"id": "E1", "name": "string", "risk": "string", "definition_of_done": ["string", "string"]}}
  ],
  "groups": [
    {{
      "type": "sprint",
      "number": 1,
      "name": "string",
      "goal": "string",
      "stories": [
        {{
          "id": "US-101",
          "epic_id": "E1",
          "title": "string",
          "criteria": ["string", "string"],
          "points": 3,
          "priority": "High",
          "depends_on": [],
          "done": false
        }}
      ]
    }},
    {{
      "type": "column",
      "name": "string",
      "wip_limit": 3,
      "stories": []
    }}
  ]
}}

Context:
{context}

Requirements:
- Choose the methodology (scrum or kanban) that best fits the app description
- For scrum: create {sprint_target}, each with a name, a goal, and at most 5 stories
- For kanban: create 3-4 column groups (e.g. Backlog, In Progress, Review, Done) with sensible WIP limits
- Create 3-4 epics that logically group the work
- Every story needs: id (US-NNN, unique), epic_id, title, criteria (exactly 2 bullets, keep each under 15 words), points (Fibonacci 1/2/3/5/8 for scrum, may be null for kanban), priority (High/Medium/Low), depends_on (array of story ids that must exist), done (false)
- Every epic needs a risk (riskiest assumption) and 2 definition_of_done items
- Distribute stories realistically across groups; do not put everything in the first group
- Respect team size, deadline, and tech stack context when sizing and sequencing work
- Only reference story ids that actually exist in depends_on
- Be concise: short titles, short criteria. Return ONLY the JSON, no commentary.

App description:
{config.description}
"""
    return prompt
