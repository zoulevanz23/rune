import asyncio
import json
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

# Deliberately messy model output: markdown fences, string points,
# missing fields, sprint group missing "goal", dangling dependency.
MESSY = """
Here you go!

```json
{
  "project_name": "TaskFlow",
  "methodology": "Scrum",
  "epics": [
    {"id": "E1", "name": "Auth", "definition_of_done": ["can log in"]}
  ],
  "groups": [
    {
      "type": "sprint",
      "number": 1,
      "name": "Foundation",
      "goal": "ship auth",
      "stories": [
        {"id": "US-101", "epic_id": "E1", "title": "Sign up",
         "criteria": ["email works"], "points": "3", "priority": "High",
         "depends_on": ["US-999"]}
      ]
    },
    {
      "type": "sprint",
      "number": 2,
      "name": "Boards",
      "stories": [
        {"id": "US-201", "epic_id": "E1", "title": "Drag cards",
         "criteria": ["drag works", "drops work", "persists"], "points": 5,
         "priority": "Medium", "depends_on": ["US-101"]}
      ]
    }
  ]
}
```
"""


def test_generate_survives_messy_model_output():
    with patch("app.services.gemini_client.GeminiClient.generate_plan", new=callable_await(MESSY)):
        with patch("app.services.gemini_client.GeminiClient.__init__", return_value=None):
            client = TestClient(app)
            r = client.post("/api/generate", json={"description": "A task manager"})
            assert r.status_code == 200, r.text
            data = r.json()
            assert len(data["groups"]) == 2
            assert data["groups"][0]["type"] == "sprint"
            # string "3" -> int 3
            assert data["groups"][0]["stories"][0]["points"] == 3
            # dangling dep US-999 dropped, valid one kept
            assert data["groups"][0]["stories"][0]["depends_on"] == []
            assert data["groups"][1]["stories"][0]["depends_on"] == ["US-101"]
            # sprint 2 had no goal -> defaulted
            assert data["groups"][1]["goal"] == ""


def test_generate_does_not_use_422_for_model_failure():
    with patch("app.services.gemini_client.GeminiClient.generate_plan",
               new=callable_await("not json at all")):
        with patch("app.services.gemini_client.GeminiClient.__init__", return_value=None):
            client = TestClient(app)
            r = client.post("/api/generate", json={"description": "x"})
            assert r.status_code == 502, r.status_code


def test_generate_accepts_explicit_nulls():
    with patch("app.services.gemini_client.GeminiClient.generate_plan", new=callable_await(MESSY)):
        with patch("app.services.gemini_client.GeminiClient.__init__", return_value=None):
            client = TestClient(app)
            r = client.post("/api/generate", json={
                "description": "x", "methodology": None,
                "sprint_count": None, "team_velocity": None,
            })
            assert r.status_code == 200, r.text


def callable_await(value):
    async def _inner(*_a, **_k):
        return value
    return _inner
