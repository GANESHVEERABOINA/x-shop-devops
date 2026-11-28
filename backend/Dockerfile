
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
USER root
RUN apk update && apk upgrade --no-cache
ENV NODE_ENV=production
COPY --from=build --chown=101:101 /app/node_modules ./node_modules
COPY --chown=101:101 . .
USER 101:101
EXPOSE 4000
CMD ["node", "server.js"]
