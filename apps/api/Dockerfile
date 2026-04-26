FROM node:20-alpine AS base
RUN apk add --no-cache bash && \
    npm install -g @infisical/cli

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo pnpm
COPY . .
RUN turbo prune @snappin/api --docker

FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
RUN npm install -g pnpm turbo
WORKDIR /app

# Abstraction layer
ARG SECRET_PLATFORM_TOKEN
ARG SECRET_PLATFORM_ENVIRONMENT
ENV INFISICAL_TOKEN=${SECRET_PLATFORM_TOKEN}
ENV INFISICAL_ENVIRONMENT=${SECRET_PLATFORM_ENVIRONMENT:-dev}

RUN pnpm config set fetch-timeout 60000 && \
    pnpm config set fetch-retry-mintimeout 10000 && \
    pnpm config set fetch-retry-maxtimeout 60000

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies using Infisical
RUN infisical run -- pnpm install --frozen-lockfile --ignore-scripts
COPY --from=builder /app/out/full/ .

RUN infisical run -- pnpm turbo run build --filter=@snappin/api

RUN ls -R apps/api | grep dist || echo "No dist found"

FROM base AS runner
WORKDIR /app

ARG SECRET_PLATFORM_TOKEN
ARG SECRET_PLATFORM_ENVIRONMENT
ENV INFISICAL_TOKEN=${SECRET_PLATFORM_TOKEN}
ENV INFISICAL_ENVIRONMENT=${SECRET_PLATFORM_ENVIRONMENT:-dev}

RUN npm install -g pnpm
RUN addgroup --system --gid 1001 expressjs && adduser --system --uid 1001 expressjs

COPY --from=installer --chown=expressjs:expressjs /app .
COPY --from=installer --chown=expressjs:expressjs /app/apps/api/dist ./apps/api/dist

USER expressjs
WORKDIR /app/apps/api
ENV PORT=8080
EXPOSE 8080

CMD ["infisical", "run", "--", "pnpm", "start"]