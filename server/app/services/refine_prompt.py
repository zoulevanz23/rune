import json


def build_refine_prompt(plan: dict, instruction: str) -> str:
    plan_json = json.dumps(plan, indent=2)
    return f"""You are an agile plan refinement assistant. Given the following current plan and a refinement instruction, return the FULL updated plan as strict JSON matching this schema. Change as little as possible — only modify what the instruction asks for.

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
      "depends_on": []
    }}]
  }}]
}}

Current plan:
{plan_json}

Instruction:
{instruction}

Return ONLY the full updated JSON plan. No markdown fences, no commentary. Preserve all fields that are not affected by the instruction.
"""
