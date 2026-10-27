from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime
from datetime import datetime
from app.db.session import Base

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    tmdb_id = Column(Integer, unique=True, index=True, nullable=True)
    title = Column(String(255), index=True, nullable=False)
    original_title = Column(String(255), nullable=True)
    overview = Column(Text, nullable=True)
    poster_path = Column(String(255), nullable=True)
    backdrop_path = Column(String(255), nullable=True)
    release_date = Column(String(50), nullable=True)
    release_year = Column(Integer, nullable=True, index=True)
    vote_average = Column(Float, default=0.0)
    vote_count = Column(Integer, default=0)
    popularity = Column(Float, default=0.0)
    genres = Column(JSON, default=list)  # List of genre names e.g. ["Sci-Fi", "Adventure"]
    director = Column(String(255), nullable=True)
    cast = Column(JSON, default=list)  # Top cast members
    keywords = Column(JSON, default=list)
    trailer_youtube_key = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
