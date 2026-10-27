# 🎬 CINEVERSE

> **A Netflix-style cinematic movie discovery experience powered by Machine Learning recommendations.**

Cineverse combines a sleek, responsive streaming-platform interface with content-based and interactive user-preference recommendation models.

---

## 🚀 Quick Overview

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS
- **Backend**: Python + FastAPI + SQLAlchemy
- **Machine Learning**: pandas + NumPy + scikit-learn (TF-IDF vectorizer + Cosine Similarity + Hybrid profile ranking)
- **Database**: SQLite (local development default) / PostgreSQL (production-ready)
- **Movie Catalog**: TMDB API integration + bundled offline seed catalog (500+ top titles)

---

## 📁 Repository Structure

```text
CINEVERSE/
├── backend/                  # FastAPI & ML Recommendation Engine
│   ├── app/
│   │   ├── api/              # REST Endpoints (movies, recommendations, watchlist, ratings)
│   │   ├── core/             # Configuration & environment settings
│   │   ├── db/               # SQLAlchemy models and database sessions
│   │   ├── ml/               # TF-IDF Recommender & dataset processing
│   │   ├── models/           # Data & interaction models
│   │   └── main.py           # Application entrypoint
│   ├── data/                 # Seed datasets and vector matrices
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Backend environment template
│
├── frontend/                 # React + Vite + TypeScript Client
│   ├── src/
│   │   ├── components/       # Hero banner, movie rows, modals, rating widgets
│   │   ├── context/          # User interactions & watchlist state
│   │   ├── pages/            # Home, For You, Watchlist, Search
│   │   ├── services/         # API client
│   │   └── types/            # TypeScript interfaces
│   ├── package.json          # Frontend dependencies
│   └── tailwind.config.js    # Cinematic dark-theme styling
│
└── README.md
```

---

## 🛠️ Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
