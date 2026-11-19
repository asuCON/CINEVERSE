from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.db.session import get_db
from app.models.movie import Movie
from app.services.tmdb import tmdb_service
from app.ml.recommender import recommender

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

    # Live TMDB search fallback if local search produced few results
    if search and len(movies) < 4 and tmdb_service.is_configured():
        live_results = tmdb_service.search_movies(search, limit=8)
        existing_tmdb_ids = {m.tmdb_id for m in movies if m.tmdb_id}
        for item in live_results:
            if item["tmdb_id"] not in existing_tmdb_ids:
                new_m = Movie(
                    tmdb_id=item["tmdb_id"],
                    title=item["title"],
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
                db.add(new_m)
                try:
                    db.commit()
                    db.refresh(new_m)
                    movies.append(new_m)
                    existing_tmdb_ids.add(item["tmdb_id"])
                except Exception:
                    db.rollback()

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
        movie = db.query(Movie).filter(Movie.backdrop_path.isnot(None)).order_by(Movie.popularity.desc()).first()
    if not movie:
        movie = db.query(Movie).first()
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

@router.post("/sync-tmdb")
def sync_tmdb(limit: int = Query(60, ge=10, le=100), db: Session = Depends(get_db)):
    """Fetch live trending, popular, and top-rated movies from TMDB API and retrain the ML recommender."""
    if not tmdb_service.is_configured():
        raise HTTPException(status_code=400, detail="TMDB API key is not configured")

    tmdb_movies = tmdb_service.fetch_curated_catalog(limit=limit)
    if not tmdb_movies:
        raise HTTPException(status_code=500, detail="Failed to fetch movies from TMDB")

    existing_tmdb_ids = {m[0] for m in db.query(Movie.tmdb_id).all() if m[0] is not None}
    added_count = 0

    for item in tmdb_movies:
        if item["tmdb_id"] in existing_tmdb_ids:
            # Update existing with fresh trailer & cast info
            m = db.query(Movie).filter(Movie.tmdb_id == item["tmdb_id"]).first()
            if m:
                if item.get("trailer_youtube_key") and not m.trailer_youtube_key:
                    m.trailer_youtube_key = item["trailer_youtube_key"]
                if item.get("cast") and not m.cast:
                    m.cast = item["cast"]
                if item.get("director") and not m.director:
                    m.director = item["director"]
                if item.get("keywords") and not m.keywords:
                    m.keywords = item["keywords"]
        else:
            new_movie = Movie(
                tmdb_id=item["tmdb_id"],
                title=item["title"],
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
            db.add(new_movie)
            added_count += 1

    db.commit()

    # Retrain ML model with full new movie catalog
    all_movies = db.query(Movie).all()
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

    return {
        "status": "success",
        "added_new": added_count,
        "total_catalog": len(all_movies),
        "ml_retrained": True
    }

@router.get("/{movie_id}")
def get_movie_detail(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # If movie is missing trailer and has tmdb_id, fetch on-the-fly
    if (not movie.trailer_youtube_key or not movie.director) and movie.tmdb_id and tmdb_service.is_configured():
        detail = tmdb_service.get_movie_details(movie.tmdb_id)
        if detail:
            formatted = tmdb_service.format_movie_data({}, detail)
            if formatted.get("trailer_youtube_key"):
                movie.trailer_youtube_key = formatted["trailer_youtube_key"]
            if formatted.get("director"):
                movie.director = formatted["director"]
            if formatted.get("cast"):
                movie.cast = formatted["cast"]
            db.commit()
            db.refresh(movie)

    return movie
