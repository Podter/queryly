# Base
FROM node:22-slim AS base
WORKDIR /app
RUN --mount=type=cache,target=/root/.npm \
    npm install -g bun@latest

# Dependencies
FROM base AS deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production

# Build
FROM deps AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile
COPY . .
RUN bun run build

# Final
FROM gcr.io/distroless/nodejs22:nonroot AS final
WORKDIR /app
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 4321
EXPOSE ${PORT}
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["/app/dist/server/entry.mjs"]
