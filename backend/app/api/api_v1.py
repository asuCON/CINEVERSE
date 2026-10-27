from fastapi import APIRouter
from app.api.endpoints import movies, recommendations, user

api_router = APIRouter()

api_router.include_router(movies.router, prefix="/movies", tags=["Movies"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(user.router, prefix="/user", tags=["User Interactions"])
