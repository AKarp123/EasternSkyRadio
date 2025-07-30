# ---- Base Node ----
FROM node:20-slim AS base
WORKDIR /usr/src/app

# ---- Frontend Build ----
FROM base AS frontend-build
WORKDIR /usr/src/app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# ---- Backend Build ----
FROM oven/bun:1.1.0-slim AS backend-build
WORKDIR /usr/src/app/server
COPY server/package.json server/bun.lock ./
RUN bun install
COPY server/ ./
RUN bun run build

FROM caddy:2.7.4-alpine AS caddy

COPY --from=frontend-build /usr/src/app/client/dist /usr/share/caddy
COPY ./Caddyfile /etc/caddy/Caddyfile



# ---- Production Image ----
FROM oven/bun:1.1.0-slim AS production
WORKDIR /usr/src/app
COPY --from=backend-build /usr/src/app/server/dist ./server/dist
COPY --from=frontend-build /usr/src/app/client/dist ./client/dist




EXPOSE 3000

# You will need to set the MONGO_URI environment variable
# when you run the container in production.
# e.g., docker run -p 3000:3000 -e MONGO_URI="your_prod_mongo_uri" my-prod-app
CMD ["bun", "run", "server/dist/app.js"]