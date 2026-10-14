import json


def build_refine_prompt(plan: dict, instruction: str) -> str:
    plan_json = json.dumps(plan, indent=2)
    return f"""You are an agile plan refinement assistant. Given the current plan and a refinement instruction, return the FULL updated plan as strict JSON. Change as little as possible — only modify what the instruction asks for.

Schema:
{{
  "project_name": "string",
  "methodology": "scrum" | "kanban",
  "epics": [{{"id": "E1", "name": "string", "risk": "string", "definition_of_done": ["string", "string"]}}],
  "groups": [{{
    "type": "sprint" | "column",
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
      "depends_on": [],
      "done": false
    }}]
  }}]
}}

Current plan:
{plan_json}

Instruction:
{instruction}

Return ONLY the full updated JSON plan. No markdown fences, no commentary. Preserve every field the instruction does not affect.
"""


ACTIONS = {
    "add-stories": "Look for gaps in coverage — missing features, edge cases, error handling, or user flows that should be explicit stories. Add 2-5 new stories distributed across the appropriate groups.",
    "split-stories": "Split large stories (5 or more points) into smaller, independently deliverable and testable stories of 1-3 points each.",
    "re-prioritize": "Re-prioritize stories by importance to core user value. High priority work should come earlier. Respect dependencies when re-ordering.",
    "estimate": "Add Fibonacci story point estimates (1, 2, 3, 5, 8) to any story missing them. Weigh complexity, uncertainty and effort.",
    "add-dependencies": "Add missing dependencies between stories where one logically requires another (e.g. checkout depends on cart). Only reference story ids that exist.",
    "improve-criteria": "Rewrite vague or missing acceptance criteria so they are specific, testable and measurable. Give every story 2-3 criteria.",
}


def build_action_prompt(plan: dict, action: str) -> str:
    plan_json = json.dumps(plan, indent=2)
    description = ACTIONS.get(action, action)

    return f"""You are an agile plan refinement assistant. Apply exactly one transformation to the current plan and return the FULL updated plan as strict JSON. Change nothing else.

Transformation: {description}

Schema:
{{
  "project_name": "string",
  "methodology": "scrum" | "kanban",
  "epics": [{{"id": "E1", "name": "string", "risk": "string", "definition_of_done": ["string", "string"]}}],
  "groups": [{{
    "type": "sprint" | "column",
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
      "depends_on": [],
      "done": false
    }}]
  }}]
}}

Current plan:
{plan_json}

Return ONLY the full updated JSON plan. No markdown fences, no commentary. Preserve all existing story ids and preserve the done flags exactly.
"""