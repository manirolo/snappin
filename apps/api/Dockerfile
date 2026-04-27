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

ARG SECRET_PLATFORM_TOKEN
ARG SECRET_PLATFORM_ENVIRONMENT
ARG INFISICAL_PROJECT_ID
ARG HUGEICONS_LICENSE_KEY
ARG GITHUB_TOKEN

ENV INFISICAL_TOKEN=${SECRET_PLATFORM_TOKEN}
ENV INFISICAL_ENVIRONMENT=${SECRET_PLATFORM_ENVIRONMENT:-dev}
ENV INFISICAL_PROJECT_ID=${INFISICAL_PROJECT_ID}
ENV HUGEICONS_LICENSE_KEY=${HUGEICONS_LICENSE_KEY}
ENV _GITHUB_TOKEN=${GITHUB_TOKEN}

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY .npmrc .

# ✅ install first, then copy full source, then build
# Replace both infisical run lines with hardcoded project ID
RUN infisical run --projectId=e9ed0d77-e8bb-40fb-8e05-4e5a5c3116cc -- pnpm install --frozen-lockfile --ignore-scripts
COPY --from=builder /app/out/full/ .
RUN infisical run --projectId=e9ed0d77-e8bb-40fb-8e05-4e5a5c3116cc -- pnpm turbo run build --filter=@snappin/api

RUN ls -R apps/api | grep dist || echo "No dist found"

FROM base AS runner
WORKDIR /app

ARG SECRET_PLATFORM_TOKEN
ARG SECRET_PLATFORM_ENVIRONMENT
ARG INFISICAL_PROJECT_ID
ENV INFISICAL_TOKEN=${SECRET_PLATFORM_TOKEN}
ENV INFISICAL_ENVIRONMENT=${SECRET_PLATFORM_ENVIRONMENT:-dev}
ENV INFISICAL_PROJECT_ID=${INFISICAL_PROJECT_ID}

RUN npm install -g pnpm
RUN addgroup --system --gid 1001 expressjs && adduser --system --uid 1001 expressjs

COPY --from=installer --chown=expressjs:expressjs /app .
COPY --from=installer --chown=expressjs:expressjs /app/apps/api/dist ./apps/api/dist

USER expressjs
WORKDIR /app/apps/api
ENV PORT=8080
EXPOSE 8080

CMD ["infisical", "run", "--projectId", "e9ed0d77-e8bb-40fb-8e05-4e5a5c3116cc", "--", "pnpm", "start"]