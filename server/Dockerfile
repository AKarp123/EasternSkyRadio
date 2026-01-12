FROM node:25-slim
WORKDIR /app/server
COPY ./server/package*.json ./
RUN npm install


COPY ./server/src ./src
COPY ./server/migrations ./migrations
COPY ./server/tsconfig.json ./

RUN npx tsc
ENV FORCE_COLOR=1
ENV NODE_ENV=production

EXPOSE 3000

# You will need to set the MONGO_URI environment variable
# when you run the container in production.
# e.g., docker run -p 3000:3000 -e MONGO_URI="your_prod_mongo_uri" my-prod-app
CMD ["node", "dist/src/start.js"]