# Nocturne Studio

- `app/` - front Next.js (dashboard), port 3000
- `api/` - backend FastAPI + PostgreSQL (table `projects`), port 8000

## Lancer

1. Base de donnees (Docker Desktop demarre) :
   ```
   cd api
   docker compose up -d
   ```
   Postgres ecoute sur `localhost:5433`, la table `projects` et 6 projets de demo sont crees par `api/db/init.sql`.
2. API :
   ```
   cd api
   py -3 -m venv .venv
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```
3. Front :
   ```
   cd app
   npm install
   npm run dev
   ```

Configuration : `api/.env` (`DATABASE_URL`, `CORS_ORIGINS`) et `app/.env.local` (`NEXT_PUBLIC_API_URL`), voir les `.env.example`.

## Endpoints

| Methode | Route | Role |
|---|---|---|
| GET | `/health` | etat API + base |
| GET | `/projects` | liste des projets |
| POST | `/projects` | creer un projet (valide : nom 3-60, budget 500-1 000 000, type connu) |
| PATCH | `/projects/{id}` | progression / statut |
| DELETE | `/projects/{id}` | archiver (supprimer) |

## Tests

- `cd api; .\.venv\Scripts\python.exe -m pytest` (necessite la base demarree)
- `cd app; npm test; npm run lint; npm run build`
