## Stage 1: Install prod dependencies
FROM oven/bun:1.2.3 as prod_dependencies

WORKDIR /app
COPY package.json .
COPY bun.lock .
RUN ["bun", "install", "--production"]

## Stage 2: Install dev dependencies
FROM prod_dependencies as dev_dependencies

WORKDIR /app

RUN ["bun", "install"]

## Stage 3: Build the application
FROM dev_dependencies as builder

WORKDIR /app

COPY src src
COPY bunfig.toml bunfig.toml
COPY preload.ts preload.ts
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json

RUN ["bun", "run", "build"]

# ------

## Stage 4: Copy the built application to production dependencies
FROM prod_dependencies as prod

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/schema.gql ./dist/src/schema.gql

CMD [ "bun", "start" ]

EXPOSE 3000

# ------

## Stage 5: Create deploy utils
FROM dev_dependencies

WORKDIR /app

COPY bunfig.toml bunfig.toml
COPY preload.ts preload.ts
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY src src
COPY scripts scripts
COPY test test
COPY test_e2e test_e2e

CMD ["sleep", "infinity"]
