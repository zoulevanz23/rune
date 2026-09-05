from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock
from server.app.main import app

client = TestClient(app)


def test_generate_returns_plan():
    mock_instance = MagicMock()
    mock_instance.generate_plan = AsyncMock(return_value='{"project_name": "Test", "methodology": "scrum", "epics": [], "groups": [{"type": "sprint", "number": 1, "name": "Sprint 1", "goal": "Test", "stories": []}]}')
    with patch('server.app.services.gemini_client.GeminiClient', return_value=mock_instance):
        response = client.post("/api/generate", json={"description": "A task management app", "methodology": "scrum"})
    assert response.status_code == 200
    data = response.json()
    assert "project_name" in data and "groups" in data


def test_generate_kanban():
    mock_instance = MagicMock()
    mock_instance.generate_plan = AsyncMock(return_value='{"project_name": "Test", "methodology": "kanban", "epics": [], "groups": [{"type": "column", "name": "Backlog", "wip_limit": null, "stories": []}, {"type": "column", "name": "In Progress", "wip_limit": 3, "stories": []}, {"type": "column", "name": "Review", "wip_limit": 3, "stories": []}, {"type": "column", "name": "Done", "wip_limit": null, "stories": []}]}')
    with patch('server.app.services.gemini_client.GeminiClient', return_value=mock_instance):
        response = client.post("/api/generate", json={"description": "A kanban board app", "methodology": "kanban"})
    assert response.status_code == 200
    data = response.json()
    assert data["methodology"] == "kanban" and len(data["groups"]) == 4 and data["groups"][0]["type"] == "column"


def test_refine_returns_plan():
    plan = {"project_name": "Test", "methodology": "scrum", "epics": [{"id": "E1", "name": "Test Epic", "risk": "none", "definition_of_done": []}], "groups": [{"type": "sprint", "number": 1, "name": "Sprint 1", "goal": "test", "stories": []}]}
    mock_instance = MagicMock()
    mock_instance.refine_plan = AsyncMock(return_value='{"project_name": "Test", "methodology": "scrum", "epics": [{"id": "E1", "name": "Test Epic", "risk": "none", "definition_of_done": []}], "groups": [{"type": "sprint", "number": 1, "name": "Sprint 1", "goal": "test", "stories": []}]}')
    with patch('server.app.services.gemini_client.GeminiClient', return_value=mock_instance):
        response = client.post("/api/refine", json={"plan": plan, "instruction": "make sprint 1 shorter"})
    assert response.status_code == 200
    data = response.json()
    assert "project_name" in data and "groups" in data
