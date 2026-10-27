from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.db.session import get_db
from app.models.movie import Movie

router = APIRouter()

@router.get("/")
def get_movies(
    db: Session = Depends(get_db),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    search: Optional[str] = Query(None, description="Search by title, director, or keyword"),
    min_rating: Optional[float] = Query(None, ge=0.0, le=10.0),
    year: Optional[int] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    query = db.query(Movie)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Movie.title.ilike(search_filter),
                Movie.director.ilike(search_filter),
                Movie.overview.ilike(search_filter)
            )
        )

    if min_rating:
        query = query.filter(Movie.vote_average >= min_rating)

    if year:
        query = query.filter(Movie.release_year == year)

    movies = query.all()

    # In-memory filter for JSON genres list
    if genre:
        genre_lower = genre.lower()
        movies = [
            m for m in movies
            if m.genres and any(genre_lower in g.lower() for g in m.genres)
        ]

    total = len(movies)
    paginated = movies[skip:skip + limit]

    return {
        "total": total,
        "items": paginated
    }

@router.get("/featured")
def get_featured_movie(db: Session = Depends(get_db)):
    """Return top featured hero movie (e.g. Interstellar or highest popularity)."""
    movie = db.query(Movie).filter(Movie.title == "Interstellar").first()
    if not movie:
        movie = db.query(Movie).order_by(Movie.popularity.desc()).first()
    if not movie:
        raise HTTPException(status_code=404, detail="No movies found")
    return movie

@router.get("/genres")
def get_genres(db: Session = Depends(get_db)):
    """Return distinct genres across the movie catalog."""
    movies = db.query(Movie.genres).all()
    genre_set = set()
    for (genres_list,) in movies:
        if isinstance(genres_list, list):
            genre_set.update(genres_list)
    return sorted(list(genre_set))

@router.get("/{movie_id}")
def get_movie_detail(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie
