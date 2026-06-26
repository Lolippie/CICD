# MovieJS

Projet pédagogique JavaScript / Docker réalisé en cours B1 au CEFIM.

Une application de catalogue de films construite avec **Vite** (frontend vanilla JS),
une **API Express**, et **MongoDB** — le tout orchestré avec **Docker Compose**.

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

---

## Démarrage rapide

```bash
# Cloner le projet
git clone <url-du-repo>
cd movieJS

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

## Structure du projet

```
movieJS/
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
├── index.html
├── docker-compose.yml      # Orchestration des 3 services
└── package.json            # Dépendances Vite
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
# Installer les dépendances frontend
npm install

# Lancer le serveur de développement Vite
npm run dev
```

> En mode dev, l'app lit `public/movies.json` directement.
> L'API et MongoDB ne sont pas nécessaires.
