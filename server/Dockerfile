# ---- Backend Build ----
FROM oven/bun:1.2.19-slim AS backend-build

ENV FORCE_COLOR=1

WORKDIR /usr/src/app/server
COPY ./server/package.json ./server/bun.lock ./

RUN bun install
COPY ./server .
RUN bunx tsc --project tsconfig.json

EXPOSE 3000

# You will need to set the MONGO_URI environment variable
# when you run the container in production.
# e.g., docker run -p 3000:3000 -e MONGO_URI="your_prod_mongo_uri" my-prod-app
CMD ["node", "dist/src/server.js"]