FROM node:20-alpine AS base
RUN apk add --no-cache bash curl libc6-compat

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo pnpm
COPY . .
RUN turbo prune @snappin/api --docker

FROM base AS installer
WORKDIR /app
RUN npm install -g pnpm turbo

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile --ignore-scripts
COPY --from=builder /app/out/full/ .

RUN pnpm turbo run build --filter=@snappin/api

FROM base AS runner
WORKDIR /app
RUN npm install -g pnpm

RUN addgroup -S app && adduser -S app -G app

COPY --from=installer --chown=app:app /app .

USER app
WORKDIR /app/apps/api
EXPOSE 8080

CMD ["pnpm", "start"]