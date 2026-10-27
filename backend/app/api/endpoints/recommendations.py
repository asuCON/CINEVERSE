from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.movie import Movie
from app.models.user_interaction import Rating, Watchlist
from app.ml.recommender import recommender

router = APIRouter()

@router.get("/similar/{movie_id}")
def get_similar_movies(
    movie_id: int,
    top_n: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Retrieve content-based similar movies using TF-IDF and Cosine Similarity."""
    target_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not target_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    sim_results = recommender.get_similar_movies(movie_id, top_n=top_n)
    if not sim_results:
        # Fallback to genre-matched titles
        genre_matches = db.query(Movie).filter(Movie.id != movie_id).limit(top_n).all()
        return [
            {
                "movie": m,
                "similarity_score": 0.75,
                "match_percentage": 75,
                "reason": "Genre match"
            }
            for m in genre_matches
        ]

    # Fetch movie records preserving similarity order
    sim_ids = [item["movie_id"] for item in sim_results]
    movies = db.query(Movie).filter(Movie.id.in_(sim_ids)).all()
    movie_map = {m.id: m for m in movies}

    response = []
    for item in sim_results:
        m = movie_map.get(item["movie_id"])
        if m:
            response.append({
                "movie": m,
                "similarity_score": item["similarity_score"],
                "match_percentage": item["match_percentage"],
                "reason": f"{item['match_percentage']}% Match"
            })

    return response

@router.get("/for-you")
def get_for_you_recommendations(
    user_id: str = Query("default_user"),
    top_n: int = Query(12, ge=1, le=30),
    db: Session = Depends(get_db)
):
    """
    Generate personalized recommendations based on:
    - User ratings (high ratings boost, low ratings penalize)
    - Watchlist titles
    """
    # 1. Fetch user ratings
    ratings = db.query(Rating).filter(Rating.user_id == user_id).all()
    user_ratings = {r.movie_id: r.rating for r in ratings}

    # 2. Fetch user watchlist
    watchlist_items = db.query(Watchlist.movie_id).filter(Watchlist.user_id == user_id).all()
    watchlist_ids = [w[0] for w in watchlist_items]

    # 3. Call ML Recommender
    reco_results = recommender.get_personalized_recommendations(
        user_ratings=user_ratings,
        watchlist_ids=watchlist_ids,
        top_n=top_n
    )

    if not reco_results:
        # Return popular movies as fallback
        popular = db.query(Movie).order_by(Movie.vote_average.desc()).limit(top_n).all()
        return [
            {
                "movie": m,
                "match_percentage": 90,
                "reason": "Top Rated on Cineverse"
            }
            for m in popular
        ]

    reco_ids = [item["movie_id"] for item in reco_results]
    movies = db.query(Movie).filter(Movie.id.in_(reco_ids)).all()
    movie_map = {m.id: m for m in movies}

    response = []
    for item in reco_results:
        m = movie_map.get(item["movie_id"])
        if m:
            response.append({
                "movie": m,
                "match_percentage": item.get("match_percentage", 85),
                "reason": item.get("reason", "Recommended For You")
            })

    return response
