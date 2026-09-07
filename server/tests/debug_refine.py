import sys; sys.path.insert(0, '.')
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock
from app.main import app
client = TestClient(app)
plan = {"project_name": "Test", "methodology": "scrum", "epics": [], "groups": []}
mock_instance = MagicMock()
mock_instance.refine_plan = AsyncMock(return_value='{"project_name": "Test"}')
with patch('app.routers.refine.GeminiClient', return_value=mock_instance):
    r = client.post('/api/refine', json={'plan': plan, 'instruction': 'test'})
    print(r.status_code, r.text)
