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

ARG INFISICAL_CLIENT_ID
ARG INFISICAL_CLIENT_SECRET
ARG INFISICAL_PROJECT_ID
ARG SECRET_PLATFORM_ENVIRONMENT
ARG HUGEICONS_LICENSE_KEY
ARG GITHUB_TOKEN

ENV INFISICAL_CLIENT_ID=${INFISICAL_CLIENT_ID}
ENV INFISICAL_CLIENT_SECRET=${INFISICAL_CLIENT_SECRET}
ENV INFISICAL_PROJECT_ID=${INFISICAL_PROJECT_ID}
ENV INFISICAL_ENVIRONMENT=${SECRET_PLATFORM_ENVIRONMENT:-staging}
ENV HUGEICONS_LICENSE_KEY=${HUGEICONS_LICENSE_KEY}
ENV _GITHUB_TOKEN=${GITHUB_TOKEN}

RUN pnpm config set fetch-timeout 60000 && \
    pnpm config set fetch-retry-mintimeout 10000 && \
    pnpm config set fetch-retry-maxtimeout 60000

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY .npmrc .

RUN infisical run \
    --projectId=e9ed0d77-e8bb-40fb-8e05-4e5a5c3116cc \
    --machine-identity-client-id=${INFISICAL_CLIENT_ID} \
    --machine-identity-client-secret=${INFISICAL_CLIENT_SECRET} \
    -- pnpm install --frozen-lockfile --ignore-scripts

COPY --from=builder /app/out/full/ .

RUN infisical run \
    --projectId=e9ed0d77-e8bb-40fb-8e05-4e5a5c3116cc \
    --machine-identity-client-id=${INFISICAL_CLIENT_ID} \
    --machine-identity-client-secret=${INFISICAL_CLIENT_SECRET} \
    -- pnpm turbo run build --filter=@snappin/api

RUN ls -R apps/api | grep dist || echo "No dist found"

FROM base AS runner
WORKDIR /app

ARG INFISICAL_CLIENT_ID
ARG INFISICAL_CLIENT_SECRET
ARG INFISICAL_PROJECT_ID
ARG SECRET_PLATFORM_ENVIRONMENT

ENV INFISICAL_CLIENT_ID=${INFISICAL_CLIENT_ID}
ENV INFISICAL_CLIENT_SECRET=${INFISICAL_CLIENT_SECRET}
ENV INFISICAL_PROJECT_ID=${INFISICAL_PROJECT_ID}
ENV INFISICAL_ENVIRONMENT=${SECRET_PLATFORM_ENVIRONMENT:-staging}

RUN npm install -g pnpm
RUN addgroup --system --gid 1001 expressjs && adduser --system --uid 1001 expressjs

COPY --from=installer --chown=expressjs:expressjs /app .
COPY --from=installer --chown=expressjs:expressjs /app/apps/api/dist ./apps/api/dist

USER expressjs
WORKDIR /app/apps/api
ENV PORT=8080
EXPOSE 8080

CMD infisical run \
    --projectId=e9ed0d77-e8bb-40fb-8e05-4e5a5c3116cc \
    -- pnpm start