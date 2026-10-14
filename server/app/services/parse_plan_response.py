import json
from typing import Any

from pydantic import ValidationError

from app.schemas.plan import Plan


def _extract_json_object(text: str) -> str | None:
    """Return the first balanced {...} block, ignoring braces inside strings."""
    start = text.find("{")
    if start == -1:
        return None
    depth = 0
    in_string = False
    escape = False
    for i in range(start, len(text)):
        c = text[i]
        if escape:
            escape = False
            continue
        if in_string and c == "\\":
            escape = True
            continue
        if c == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    return None


def _strip_fences(text: str) -> str:
    s = text.strip()
    if s.startswith("```"):
        s = s[3:]
        if s[:4].lower() == "json":
            s = s[4:]
        s = s.rsplit("```", 1)[0]
    return s.strip()


def parse_plan_response(raw: str) -> dict[str, Any]:
    text = raw.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    stripped = _strip_fences(text)
    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        pass

    extracted = _extract_json_object(stripped)
    if extracted:
        try:
            return json.loads(extracted)
        except json.JSONDecodeError:
            pass

    raise ValueError("Could not parse JSON from model response")


def _as_list(value: Any) -> list:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def _as_points(value: Any) -> int | None:
    """Coerce '3', 3.0, '3 pts', None -> int | None."""
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return int(value)
    digits = "".join(ch for ch in str(value) if ch.isdigit())
    return int(digits) if digits else None


def _normalize_story(story: dict, fallback_id: str, fallback_epic: str) -> dict:
    story_id = str(story.get("id") or fallback_id)
    return {
        "id": story_id,
        "epic_id": str(story.get("epic_id") or fallback_epic),
        "title": str(story.get("title") or "Untitled story"),
        "criteria": [str(c) for c in _as_list(story.get("criteria")) if c],
        "points": _as_points(story.get("points")),
        "priority": str(story.get("priority") or "Medium"),
        "depends_on": [str(d).strip() for d in _as_list(story.get("depends_on")) if str(d).strip()],
        "done": bool(story.get("done", False)),
    }


def repair_plan(data: dict[str, Any]) -> dict[str, Any]:
    """Coerce common model deviations into the shape the schema expects."""
    if not isinstance(data, dict):
        raise ValueError("Model response was not a JSON object")

    data["project_name"] = str(data.get("project_name") or "").strip()
    methodology = str(data.get("methodology") or "scrum").strip().lower()
    data["methodology"] = methodology

    epics = []
    for i, epic in enumerate(_as_list(data.get("epics"))):
        if not isinstance(epic, dict):
            continue
        epics.append(
            {
                "id": str(epic.get("id") or f"E{i + 1}"),
                "name": str(epic.get("name") or f"Epic {i + 1}"),
                "risk": epic.get("risk"),
                "definition_of_done": [str(d) for d in _as_list(epic.get("definition_of_done")) if d],
            }
        )
    data["epics"] = epics
    fallback_epic = epics[0]["id"] if epics else "E1"

    raw_groups = [g for g in _as_list(data.get("groups")) if isinstance(g, dict)]

    groups = []
    all_story_ids: set[str] = set()
    for i, group in enumerate(raw_groups):
        name = str(group.get("name") or f"Group {i + 1}")
        declared = str(group.get("type") or "").strip().lower()
        has_sprint_fields = "number" in group or "goal" in group

        if declared == "column" or (not declared and not has_sprint_fields and methodology == "kanban"):
            normalized: dict[str, Any] = {
                "type": "column",
                "name": name,
                "wip_limit": _as_points(group.get("wip_limit")),
                "stories": [],
            }
        else:
            normalized = {
                "type": "sprint",
                "number": _as_points(group.get("number")) or (i + 1),
                "name": name,
                "goal": str(group.get("goal") or ""),
                "stories": [],
            }

        for j, story in enumerate(_as_list(group.get("stories"))):
            if not isinstance(story, dict):
                continue
            norm = _normalize_story(story, f"US-{100 * (i + 1) + j + 1}", fallback_epic)
            all_story_ids.add(norm["id"])
            normalized["stories"].append(norm)
        groups.append(normalized)

    # Dependencies may only reference stories that exist, and never self-reference.
    for group in groups:
        for story in group["stories"]:
            story["depends_on"] = [
                dep
                for dep in dict.fromkeys(story["depends_on"])
                if dep in all_story_ids and dep != story["id"]
            ]

    data["groups"] = groups
    return data


def validate_plan(data: dict[str, Any]) -> Plan:
    try:
        return Plan(**data)
    except ValidationError as e:
        raise ValueError(f"Plan validation failed: {e}") from e


async def parse_and_validate(raw: str) -> Plan:
    parsed = parse_plan_response(raw)
    return validate_plan(repair_plan(parsed))