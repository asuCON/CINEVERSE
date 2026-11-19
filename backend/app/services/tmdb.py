import requests
from typing import List, Dict, Any, Optional
from app.core.config import settings

class TMDBService:
    def __init__(self):
        self.api_key = settings.TMDB_API_KEY
        self.base_url = settings.TMDB_BASE_URL
        self.image_base_url = settings.TMDB_IMAGE_BASE_URL
        self.genre_cache: Dict[int, str] = {}

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 10)

    def _get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        if not self.is_configured():
            return None
        
        req_params = {"api_key": self.api_key}
        if params:
            req_params.update(params)

        try:
            url = f"{self.base_url}{endpoint}"
            response = requests.get(url, params=req_params, timeout=10)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"[TMDB] Request error {response.status_code} for {endpoint}: {response.text}")
                return None
        except Exception as e:
            print(f"[TMDB] Network error for {endpoint}: {e}")
            return None

    def get_genre_map(self) -> Dict[int, str]:
        """Fetch and cache genre ID to name mapping."""
        if not self.genre_cache:
            data = self._get("/genre/movie/list")
            if data and "genres" in data:
                self.genre_cache = {g["id"]: g["name"] for g in data["genres"]}
        return self.genre_cache

    def format_movie_data(self, item: Dict[str, Any], detail: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Convert raw TMDB response to Cineverse Movie dictionary format."""
        genre_map = self.get_genre_map()

        # Extract genres
        genres = []
        if detail and "genres" in detail:
            genres = [g["name"] for g in detail["genres"]]
        elif "genre_ids" in item:
            genres = [genre_map.get(gid) for gid in item["genre_ids"] if gid in genre_map]
        elif "genres" in item and isinstance(item["genres"], list):
            genres = [g["name"] if isinstance(g, dict) else str(g) for g in item["genres"]]

        # Extract trailer key
        trailer_key = None
        if detail and "videos" in detail and "results" in detail["videos"]:
            for v in detail["videos"]["results"]:
                if v.get("site") == "YouTube" and v.get("type") in ["Trailer", "Teaser"]:
                    trailer_key = v.get("key")
                    if v.get("type") == "Trailer":
                        break

        # Extract Director and Cast
        director = None
        cast = []
        if detail and "credits" in detail:
            crew = detail["credits"].get("crew", [])
            for member in crew:
                if member.get("job") == "Director":
                    director = member.get("name")
                    break
            cast = [actor.get("name") for actor in detail["credits"].get("cast", [])[:5]]

        # Extract Keywords
        keywords = []
        if detail and "keywords" in detail:
            kw_list = detail["keywords"].get("keywords", [])
            keywords = [k.get("name") for k in kw_list[:8]]

        # Poster & Backdrop URLs
        poster_path = item.get("poster_path")
        if poster_path and not poster_path.startswith("http"):
            poster_url = f"{self.image_base_url}/w780{poster_path}"
        else:
            poster_url = poster_path

        backdrop_path = item.get("backdrop_path")
        if backdrop_path and not backdrop_path.startswith("http"):
            backdrop_url = f"{self.image_base_url}/original{backdrop_path}"
        else:
            backdrop_url = backdrop_path or poster_url

        release_date = item.get("release_date") or ""
        release_year = int(release_date.split("-")[0]) if release_date and "-" in release_date else None

        # Runtime
        runtime_min = detail.get("runtime") if detail else None
        runtime_formatted = None
        if runtime_min:
            h = runtime_min // 60
            m = runtime_min % 60
            runtime_formatted = f"{h}h {m}m" if h > 0 else f"{m}m"

        return {
            "tmdb_id": item.get("id"),
            "title": item.get("title") or item.get("name", "Untitled"),
            "original_title": item.get("original_title"),
            "overview": item.get("overview") or "",
            "poster_path": poster_url,
            "backdrop_path": backdrop_url,
            "release_date": release_date,
            "release_year": release_year,
            "vote_average": round(float(item.get("vote_average", 0.0)), 1),
            "vote_count": int(item.get("vote_count", 0)),
            "popularity": round(float(item.get("popularity", 0.0)), 1),
            "genres": genres,
            "director": director,
            "cast": cast,
            "keywords": keywords,
            "trailer_youtube_key": trailer_key,
            "runtime": runtime_formatted
        }

    def get_movie_details(self, tmdb_id: int) -> Optional[Dict[str, Any]]:
        """Fetch deep metadata including videos, credits, and keywords for a movie."""
        return self._get(f"/movie/{tmdb_id}", params={"append_to_response": "videos,credits,keywords"})

    def fetch_curated_catalog(self, limit: int = 60) -> List[Dict[str, Any]]:
        """Fetch a rich mix of trending, popular, and top-rated movies with trailers and credits."""
        if not self.is_configured():
            return []

        movie_ids = []
        raw_items = []

        # 1. Trending movies (current week)
        trending = self._get("/trending/movie/week")
        if trending and "results" in trending:
            for m in trending["results"][:20]:
                if m["id"] not in movie_ids:
                    movie_ids.append(m["id"])
                    raw_items.append(m)

        # 2. Top Rated
        top_rated = self._get("/movie/top_rated", params={"page": 1})
        if top_rated and "results" in top_rated:
            for m in top_rated["results"][:25]:
                if m["id"] not in movie_ids:
                    movie_ids.append(m["id"])
                    raw_items.append(m)

        # 3. Popular
        popular = self._get("/movie/popular", params={"page": 1})
        if popular and "results" in popular:
            for m in popular["results"][:25]:
                if m["id"] not in movie_ids:
                    movie_ids.append(m["id"])
                    raw_items.append(m)

        print(f"[TMDB] Fetched {len(raw_items)} candidate movies. Fetching trailers and credits...")

        formatted_movies = []
        for item in raw_items[:limit]:
            tmdb_id = item["id"]
            detail = self.get_movie_details(tmdb_id)
            formatted = self.format_movie_data(item, detail)
            # Only include movies that have posters and overviews
            if formatted["poster_path"] and formatted["overview"]:
                formatted_movies.append(formatted)

        print(f"[TMDB] Successfully prepared {len(formatted_movies)} rich movies with trailers and cast.")
        return formatted_movies

    def search_movies(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Live search TMDB by title or keyword."""
        data = self._get("/search/movie", params={"query": query, "include_adult": False})
        if not data or "results" not in data:
            return []

        results = []
        for item in data["results"][:limit]:
            formatted = self.format_movie_data(item)
            if formatted["poster_path"]:
                results.append(formatted)
        return results

tmdb_service = TMDBService()
