from app.types import GenerationConfig


def build_scrum_prompt(config: GenerationConfig) -> str:
    sprint_count = config.sprint_count
    sprint_length = config.sprint_length
    scope_mode = config.scope_mode
    team_velocity = config.team_velocity

    prompt = f"""You are an agile delivery plan generator. Given the following app description, produce a complete Scrum plan as strict JSON matching this schema:

{{
  "project_name": "string",
  "methodology": "scrum",
  "epics": [{{"id": "E1", "name": "string", "risk": "string", "definition_of_done": ["string", "string"]}}],
  "groups": [{{
    "type": "sprint",
    "number": 1,
    "name": "string",
    "goal": "string",
    "stories": [{{
      "id": "US-101",
      "epic_id": "E1",
      "title": "string",
      "criteria": ["string", "string"],
      "points": 3,
      "priority": "High",
      "depends_on": []
    }}]
  }}]
}}

Requirements:
- Exactly {sprint_count} sprint groups, numbered 1 through {sprint_count}
- Each sprint has a name and a goal
- Distribute 3-6 epics across the sprints
- Each story must have: id (US-NNN), epic_id, title, criteria (2-3 bullets), points (Fibonacci: 1,2,3,5,8), priority (High/Medium/Low)
- Sprint {sprint_count} should contain scope_mode={scope_mode} work
- {"If team_velocity is provided, size sprints to roughly that many points total per sprint" if team_velocity else ""}
- Each epic needs a risk field (riskiest assumption) and 2-3 definition_of_done items
- Return ONLY raw JSON, no markdown fences, no commentary

App description:
{config.description}
"""
    return prompt


def build_kanban_prompt(config: GenerationConfig) -> str:
    prompt = f"""You are an agile delivery plan generator. Given the following app description, produce a complete Kanban plan as strict JSON matching this schema:

{{
  "project_name": "string",
  "methodology": "kanban",
  "epics": [{{"id": "E1", "name": "string", "risk": "string", "definition_of_done": ["string", "string"]}}],
  "groups": [{{
    "type": "column",
    "name": "string",
    "wip_limit": 3,
    "stories": [{{
      "id": "US-101",
      "epic_id": "E1",
      "title": "string",
      "criteria": ["string", "string"],
      "points": null,
      "priority": "High",
      "depends_on": []
    }}]
  }}]
}}

Requirements:
- Exactly 4 column groups: Backlog, In Progress, Review, Done
- Distribute 3-6 epics, mostly into Backlog (realistic flow start)
- A few stories in In Progress and Review if the description implies work is underway
- None pre-filled into Done
- Points are optional per story in Kanban — omit if not meaningful; include if they help prioritize
- Each story must have: id (US-NNN), epic_id, title, criteria (2-3 bullets), priority (High/Medium/Low)
- Each epic needs a risk field and 2-3 definition_of_done items
- In-progress and Review columns should have a small WIP limit (2-4)
- Return ONLY raw JSON, no markdown fences, no commentary

App description:
{config.description}
"""
    return prompt
