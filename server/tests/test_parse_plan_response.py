import pytest
from app.services.parse_plan_response import parse_plan_response, validate_plan


def test_parse_clean_json():
    raw = '{"project_name": "Test", "methodology": "scrum", "epics": [], "groups": []}'
    result = parse_plan_response(raw)
    assert result["project_name"] == "Test"


def test_parse_fenced_json():
    raw = "```json\n{\"project_name\": \"Test\"}\n```"
    result = parse_plan_response(raw)
    assert result["project_name"] == "Test"


def test_parse_regex_fallback():
    raw = "Here is the plan: {\"project_name\": \"Test\"} thanks"
    result = parse_plan_response(raw)
    assert result["project_name"] == "Test"


def test_validate_plan():
    data = {"project_name": "Test", "methodology": "scrum", "epics": [], "groups": []}
    plan = validate_plan(data)
    assert plan.project_name == "Test"


def test_validate_invalid():
    from app.services.parse_plan_response import parse_and_validate
    # Bad JSON should raise ValueError
    with pytest.raises(ValueError):
        import asyncio
        asyncio.run(parse_and_validate("not json at all"))
