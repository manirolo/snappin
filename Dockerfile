FROM node:20-alpine AS base
RUN apk add --no-cache bash curl libc6-compat

FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm turbo

# Copy root workspace files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy all packages and apps source
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install all dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build only api
RUN pnpm turbo run build --filter=@snappin/api

FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm
RUN addgroup -S app && adduser -S app -G app

# Copy everything built
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/packages ./packages
COPY --from=builder --chown=app:app /app/apps/api ./apps/api

USER app
WORKDIR /app/apps/api
EXPOSE 8080

CMD ["node", "dist/index.js"]