# ─── Étape 1 : construction ───────────────────────────────────────────────────
# On part d'une image Node légère (Alpine = ~5 Mo vs ~300 Mo pour la version complète)
FROM node:20-alpine AS builder

# On définit le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# On copie UNIQUEMENT les fichiers de dépendances en premier.
# Docker met en cache chaque instruction : si package.json n'a pas changé,
# npm install ne sera pas ré-exécuté au prochain build → gain de temps.
COPY package*.json ./
RUN npm install

# On copie le reste du code source
COPY . .

# On lance le build Vite → génère le dossier /app/dist
RUN npm run build


# ─── Étape 2 : serveur de production ──────────────────────────────────────────
# Multi-stage build : on repart d'une image nginx vierge.
# L'image finale ne contient plus Node ni node_modules → beaucoup plus légère.
FROM nginx:alpine

# On copie uniquement le résultat du build depuis l'étape précédente
COPY --from=builder /app/dist /usr/share/nginx/html

# On remplace la config nginx par défaut par la nôtre (reverse proxy vers l'API)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# On documente le port exposé (informatif, docker-compose s'occupe du mapping)
EXPOSE 80
