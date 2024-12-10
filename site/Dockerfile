# Base is used for all steps and contains necessary dependencies
FROM node:22.12.0-alpine3.19 AS base
WORKDIR /app

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER=true
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN apk add --no-cache libc6-compat bash
RUN apk update

FROM base AS builder

COPY . .
RUN pnpx turbo prune --scope=site --docker

FROM base AS installer

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .

COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY --from=builder /app/out/full/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN  \
    --mount=type=secret,id=SENTRY_DSN \  
    export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) && \
    export NEXT_PUBLIC_SENTRY_DSN=$(cat /run/secrets/SENTRY_DSN) && \
    pnpx turbo run build --filter=site...

FROM base AS runner

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/site/next.config.js .
COPY --from=installer /app/site/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/site/.next/standalone .
COPY --from=installer --chown=nextjs:nodejs /app/site/.next/static ./site/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/site/public ./site/public

EXPOSE 3000
CMD node site/server.js 
