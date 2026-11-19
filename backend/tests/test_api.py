import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "online"
    assert "engine" in data

def test_movies_list(client):
    response = client.get("/api/movies/")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "items" in data
    assert isinstance(data["items"], list)

def test_featured_movie(client):
    response = client.get("/api/movies/featured")
    assert response.status_code == 200
    data = response.json()
    assert "title" in data

def test_genres_list(client):
    response = client.get("/api/movies/genres")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_for_you_recommendations(client):
    response = client.get("/api/recommendations/for-you?user_id=test_user&top_n=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
