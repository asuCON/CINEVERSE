# Import all models here so Alembic or Base.metadata.create_all finds them
from app.db.session import Base
from app.models.movie import Movie
from app.models.user_interaction import Rating, Watchlist
