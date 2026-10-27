import os
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.models.movie import Movie
from app.api.api_v1 import api_router
from app.ml.recommender import recommender

def seed_database_and_train_recommender():
    """Seed initial movies if empty and fit the ML recommendation model."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = db.query(Movie).count()
        if count == 0:
            seed_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "seed_movies.json")
            if os.path.exists(seed_file_path):
                with open(seed_file_path, "r", encoding="utf-8") as f:
                    movies_data = json.load(f)
                    for item in movies_data:
                        movie = Movie(
                            id=item.get("id"),
                            tmdb_id=item.get("tmdb_id"),
                            title=item.get("title"),
                            original_title=item.get("original_title"),
                            overview=item.get("overview"),
                            poster_path=item.get("poster_path"),
                            backdrop_path=item.get("backdrop_path"),
                            release_date=item.get("release_date"),
                            release_year=item.get("release_year"),
                            vote_average=item.get("vote_average", 0.0),
                            vote_count=item.get("vote_count", 0),
                            popularity=item.get("popularity", 0.0),
                            genres=item.get("genres", []),
                            director=item.get("director"),
                            cast=item.get("cast", []),
                            keywords=item.get("keywords", []),
                            trailer_youtube_key=item.get("trailer_youtube_key")
                        )
                        db.add(movie)
                    db.commit()
                    print(f"✅ Loaded {len(movies_data)} seed movies into the database.")

        # Train / fit the recommender model
        all_movies = db.query(Movie).all()
        if all_movies:
            movie_records = [
                {
                    "id": m.id,
                    "title": m.title,
                    "overview": m.overview or "",
                    "genres": m.genres or [],
                    "director": m.director or "",
                    "cast": m.cast or [],
                    "keywords": m.keywords or [],
                    "vote_average": m.vote_average or 0.0,
                    "popularity": m.popularity or 0.0
                }
                for m in all_movies
            ]
            recommender.fit(movie_records)
            print(f"🤖 ML Recommender trained successfully on {len(movie_records)} titles.")
    except Exception as e:
        print(f"⚠️ Error during startup database seed or ML model fitting: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    seed_database_and_train_recommender()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "docs": f"{settings.API_V1_STR}/docs",
        "engine": "TF-IDF + Cosine Similarity Recommendation Core"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
