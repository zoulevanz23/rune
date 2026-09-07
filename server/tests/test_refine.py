from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock
from app.main import app

client = TestClient(app)


def test_refine_returns_plan():
    plan = {"project_name": "Test", "methodology": "scrum", "epics": [{"id": "E1", "name": "Test Epic", "risk": "none", "definition_of_done": []}], "groups": [{"type": "sprint", "number": 1, "name": "Sprint 1", "goal": "test", "stories": []}]}
    mock_instance = MagicMock()
    mock_instance.refine_plan = AsyncMock(return_value='{"project_name": "Test", "methodology": "scrum", "epics": [{"id": "E1", "name": "Test Epic", "risk": "none", "definition_of_done": []}], "groups": [{"type": "sprint", "number": 1, "name": "Sprint 1", "goal": "test", "stories": []}]}')
    with patch('app.services.gemini_client.GeminiClient', return_value=mock_instance):
        response = client.post("/api/refine", json={"plan": plan, "instruction": "make sprint 1 shorter"})
    assert response.status_code == 200
    data = response.json()
    assert "project_name" in data and "groups" in data
