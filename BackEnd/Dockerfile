# syntax=docker/dockerfile:1.7

# ============================================================
# Stage 1 — deps + build
# ============================================================
FROM node:22-alpine AS builder
WORKDIR /app

# Install build-time tools needed by some native deps (bcrypt, etc).
RUN apk add --no-cache python3 make g++

# Install deps with a reproducible install (uses package-lock.json).
COPY package.json package-lock.json ./
RUN npm ci

# Copy schema first so prisma generate output is cacheable independent of src/.
COPY prisma ./prisma
RUN npx prisma generate

# Copy source and build.
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Prune devDependencies so we copy a slim node_modules into the runtime image.
RUN npm prune --omit=dev

# ============================================================
# Stage 2 — runtime
# ============================================================
FROM node:22-alpine AS runtime
WORKDIR /app

# Non-root user. The official node image already has uid 1000 "node"; reuse it.
ENV NODE_ENV=production \
    PORT=4000

# Tini for proper PID-1 signal handling (graceful SIGTERM on container stop).
RUN apk add --no-cache tini wget

# Copy the pruned runtime artifacts from the builder.
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Entrypoint runs migrations against the linked Postgres before starting the
# server. Seed is NOT auto-run — it has to be invoked explicitly the first
# time, with ADMIN_EMAIL/ADMIN_PASSWORD set.
COPY --chown=node:node docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER node
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --spider http://localhost:4000/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
