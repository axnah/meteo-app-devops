# Dockerfile
# Étape 1: Construction (si vous avez des étapes de build complexes ou des devDependencies pour les tests)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
# Installer toutes les dépendances, y compris devDependencies pour les tests
RUN yarn install --frozen-lockfile
COPY . .
# Exécuter les tests dans l'image de build. Si les tests échouent, le build échoue.
RUN yarn test

# Étape 2: Production (image finale plus légère)
FROM node:18-alpine AS production
WORKDIR /app
COPY package.json yarn.lock ./
# Installer uniquement les dépendances de production
RUN yarn install --production --frozen-lockfile
# Copier le code source de l'étape de build (ou de votre machine locale si pas d'étape de build)
COPY --from=builder /app/src ./src
# Exposer le port
EXPOSE 3000
# Commande pour démarrer l'application
CMD ["node", "src/server.js"]