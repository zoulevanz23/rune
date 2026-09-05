import json
import re
from typing import Any
from pydantic import ValidationError

from server.app.schemas.plan import Plan


def parse_plan_response(raw: str) -> dict[str, Any]:
    text = raw.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    stripped = text.strip("`").strip()
    if stripped.startswith("json"):
        stripped = stripped[4:].strip()
    if stripped.startswith("```"):
        stripped = stripped[3:]
    if stripped.endswith("```"):
        stripped = stripped[:-3]
    stripped = stripped.strip("`").strip()

    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", stripped, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    match = re.search(r"\{.*\}", stripped, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    raise ValueError("Could not parse JSON from model response")


def validate_plan(data: dict[str, Any]) -> Plan:
    try:
        return Plan(**data)
    except ValidationError as e:
        raise ValueError(f"Plan validation failed: {e}") from e


async def parse_and_validate(raw: str) -> Plan:
    parsed = parse_plan_response(raw)
    return validate_plan(parsed)
