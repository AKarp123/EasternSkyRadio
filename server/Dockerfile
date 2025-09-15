# ---- Backend Build ----
FROM oven/bun:1.2.20-slim AS backend-build


WORKDIR /usr/src/app/server
COPY ./server/package.json ./server/bun.lock ./
RUN bun install
COPY ./server .
RUN bun run build

FROM node:24-slim as backend-prod
WORKDIR /app
COPY --from=backend-build /usr/src/app/server/dist ./dist
COPY --from=backend-build /usr/src/app/server/package.json ./
COPY --from=backend-build /usr/src/app/server/bun.lock ./
COPY --from=backend-build /usr/src/app/server/node_modules ./node_modules
ENV FORCE_COLOR=1
ENV NODE_ENV=production

EXPOSE 3000

# You will need to set the MONGO_URI environment variable
# when you run the container in production.
# e.g., docker run -p 3000:3000 -e MONGO_URI="your_prod_mongo_uri" my-prod-app
CMD ["node", "dist/src/start.js"]