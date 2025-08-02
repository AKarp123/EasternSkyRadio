FROM node:20-slim AS frontend

WORKDIR /usr/src/app/client
COPY ./client/package*.json ./
RUN npm install
COPY ./client .
RUN npm run build

FROM caddy:2.10.0-alpine AS caddy
COPY --from=frontend /usr/src/app/client/dist /usr/share/caddy
COPY ./Caddyfile /etc/caddy/Caddyfile