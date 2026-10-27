from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.db.session import get_db
from app.models.movie import Movie
from app.models.user_interaction import Watchlist, Rating

router = APIRouter()

class RatingRequest(BaseModel):
    rating: float = Field(..., ge=0.5, le=5.0, description="Rating between 0.5 and 5.0")
    user_id: Optional[str] = "default_user"

class WatchlistRequest(BaseModel):
    user_id: Optional[str] = "default_user"
    is_watched: Optional[bool] = False

# --- Watchlist Endpoints ---

@router.get("/watchlist")
def get_watchlist(
    user_id: str = Query("default_user"),
    db: Session = Depends(get_db)
):
    items = (
        db.query(Watchlist, Movie)
        .join(Movie, Watchlist.movie_id == Movie.id)
        .filter(Watchlist.user_id == user_id)
        .order_by(Watchlist.created_at.desc())
        .all()
    )
    return [
        {
            "id": w.id,
            "movie_id": w.movie_id,
            "is_watched": w.is_watched,
            "created_at": w.created_at,
            "movie": m
        }
        for w, m in items
    ]

@router.post("/watchlist/{movie_id}")
def add_to_watchlist(
    movie_id: int,
    payload: Optional[WatchlistRequest] = None,
    db: Session = Depends(get_db)
):
    user_id = payload.user_id if payload else "default_user"
    is_watched = payload.is_watched if payload else False

    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    existing = db.query(Watchlist).filter(
        Watchlist.user_id == user_id,
        Watchlist.movie_id == movie_id
    ).first()

    if existing:
        return {"status": "exists", "item": existing}

    new_item = Watchlist(
        user_id=user_id,
        movie_id=movie_id,
        is_watched=is_watched
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {"status": "added", "item": new_item}

@router.delete("/watchlist/{movie_id}")
def remove_from_watchlist(
    movie_id: int,
    user_id: str = Query("default_user"),
    db: Session = Depends(get_db)
):
    item = db.query(Watchlist).filter(
        Watchlist.user_id == user_id,
        Watchlist.movie_id == movie_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not in watchlist")

    db.delete(item)
    db.commit()
    return {"status": "removed", "movie_id": movie_id}

@router.patch("/watchlist/{movie_id}/toggle-watched")
def toggle_watched(
    movie_id: int,
    user_id: str = Query("default_user"),
    db: Session = Depends(get_db)
):
    item = db.query(Watchlist).filter(
        Watchlist.user_id == user_id,
        Watchlist.movie_id == movie_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not in watchlist")

    item.is_watched = not item.is_watched
    db.commit()
    db.refresh(item)
    return {"status": "updated", "is_watched": item.is_watched}

# --- Ratings Endpoints ---

@router.get("/ratings")
def get_user_ratings(
    user_id: str = Query("default_user"),
    db: Session = Depends(get_db)
):
    ratings = (
        db.query(Rating, Movie)
        .join(Movie, Rating.movie_id == Movie.id)
        .filter(Rating.user_id == user_id)
        .order_by(Rating.updated_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "movie_id": r.movie_id,
            "rating": r.rating,
            "updated_at": r.updated_at,
            "movie": m
        }
        for r, m in ratings
    ]

@router.post("/ratings/{movie_id}")
def submit_rating(
    movie_id: int,
    payload: RatingRequest,
    db: Session = Depends(get_db)
):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    existing = db.query(Rating).filter(
        Rating.user_id == payload.user_id,
        Rating.movie_id == movie_id
    ).first()

    if existing:
        existing.rating = payload.rating
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return {"status": "updated", "rating": existing}

    new_rating = Rating(
        user_id=payload.user_id,
        movie_id=movie_id,
        rating=payload.rating
    )
    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)
    return {"status": "created", "rating": new_rating}

@router.delete("/ratings/{movie_id}")
def delete_rating(
    movie_id: int,
    user_id: str = Query("default_user"),
    db: Session = Depends(get_db)
):
    item = db.query(Rating).filter(
        Rating.user_id == user_id,
        Rating.movie_id == movie_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Rating not found")

    db.delete(item)
    db.commit()
    return {"status": "deleted", "movie_id": movie_id}
