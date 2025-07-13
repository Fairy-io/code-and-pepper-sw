FROM node:22-alpine AS prod_dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

# ----

FROM prod_dependencies as builder

WORKDIR /app

RUN npm ci

COPY tsconfig.json tsconfig.json
COPY tsconfig.docker.json tsconfig.build.json
COPY src src

RUN npm run build

# ----

FROM prod_dependencies

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]
