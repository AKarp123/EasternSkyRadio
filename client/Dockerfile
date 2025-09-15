FROM node:20-slim AS frontend

WORKDIR /usr/src/app/client
COPY ./client/package*.json ./client/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY ./client .
RUN pnpm run build

FROM caddy:2.10.0-alpine AS caddy
COPY --from=frontend /usr/src/app/client/dist /usr/share/caddy
COPY ./Caddyfile /etc/caddy/Caddyfile