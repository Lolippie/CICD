# MovieJS

Application de catalogue de films utilisée comme **projet fil rouge du cours CI/CD**
(Master 1 ingénierie logicielle, en alternance).

Construite avec **Vite** (frontend vanilla JS), une **API Express**, et **MongoDB**,
le tout orchestré avec **Docker Compose**. Elle sert de support pour construire
progressivement une pipeline complète : lint, tests, sécurité, build d'images,
déploiement staging/prod sur un VPS.

---

## Architecture

```
navigateur → http://localhost:8080
                    │
                    ▼
             nginx (app)
              │          │
              ▼          ▼
         GET /       GET /api/movies
    fichiers Vite      API Express
                           │
                           ▼
                        MongoDB
                    (volume persistant)
```

| Service | Rôle | Image |
|---------|------|-------|
| `db` | Base de données | `mongo:7` |
| `api` | API REST Node.js / Express | `node:20-alpine` |
| `app` | Frontend buildé + nginx | `nginx:alpine` |

---

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2 (inclus avec Docker Desktop)
- [Node.js](https://nodejs.org/) ≥ 20 pour le développement local (lint, tests, `npm run dev`)

---

## Démarrage rapide

```bash
# Cloner le projet
git clone <url-du-repo>
cd cicd

# Construire les images et démarrer tous les services
docker compose up --build

# L'application est disponible sur http://localhost:8080
```

Au premier démarrage, l'API insère automatiquement les films depuis `public/movies.json`
dans MongoDB (seed). Les démarrages suivants réutilisent la base existante.

---

## Commandes utiles

```bash
# Démarrer en arrière-plan
docker compose up --build -d

# Voir les logs d'un service en temps réel
docker compose logs -f api
docker compose logs -f db

# Lister les conteneurs en cours
docker compose ps

# Arrêter les conteneurs (données conservées)
docker compose down

# Arrêter ET supprimer les données (remise à zéro complète)
docker compose down -v
```

---

## Qualité & tests

```bash
# Lint (ESLint, flat config) — src/, api/, tests/
npm run lint

# Tests unitaires + fonctionnels (Vitest)
npm test
npm run test:watch

# Tests end-to-end (Playwright, contre l'app buildée)
npm run build
npm run test:e2e
```

Un hook **`pre-push`** (Husky) lance `npm run lint` avant chaque push et bloque
l'envoi si le lint échoue. Il s'installe automatiquement à la racine du projet
après `npm install` (script `prepare`) — aucune action manuelle nécessaire.

---

## Structure du projet

```
cicd/
├── docker/
│   ├── Dockerfile          # Frontend : build Vite → nginx
│   ├── Dockerfile.api      # API : Node.js / Express
│   └── nginx.conf          # Config nginx + reverse proxy /api/
├── api/
│   ├── server.js           # API Express + seed MongoDB
│   └── package.json
├── public/
│   └── movies.json         # Source de données initiale (seed)
├── src/
│   ├── main.js             # Logique frontend (filtres, tri, DOM)
│   ├── fetch.js            # Appel à /api/movies
│   └── style.css
├── tests/
│   ├── unit/                # Tests unitaires (Vitest)
│   ├── functional/          # Tests fonctionnels, ex. API ↔ Mongo (Vitest)
│   └── e2e/                 # Tests end-to-end (Playwright)
├── seedMovies.js           # Script : génère public/movies.json depuis l'API TMDB
├── eslint.config.js        # Lint (flat config)
├── index.html
├── docker-compose.yml      # Orchestration des 3 services
└── package.json            # Dépendances et scripts (dev, build, lint, test)
```

---

## Concepts Docker abordés

| Concept | Fichier |
|---------|---------|
| `FROM`, `WORKDIR`, `COPY`, `RUN`, `EXPOSE` | `docker/Dockerfile` |
| **Multi-stage build** (Node → nginx) | `docker/Dockerfile` |
| Mise en cache des layers (`package.json` d'abord) | `docker/Dockerfile` |
| `.dockerignore` | `.dockerignore` |
| Services, volumes, variables d'environnement | `docker-compose.yml` |
| DNS interne Docker (noms de services) | `MONGODB_URI`, `nginx.conf` |
| `depends_on` et ses limites | `docker-compose.yml` + `api/server.js` |
| Reverse proxy nginx | `docker/nginx.conf` |
| Volume nommé (persistance) | `docker-compose.yml` → `mongo_data` |

---

## Développement sans Docker

```bash
# Installer les dépendances frontend (installe aussi le hook pre-push)
npm install

# Lancer le serveur de développement Vite
npm run dev
```

> En mode dev, l'app lit `public/movies.json` directement.
> L'API et MongoDB ne sont pas nécessaires.
