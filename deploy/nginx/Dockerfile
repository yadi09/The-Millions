# syntax=docker/dockerfile:1.7
#
# This image is two things at once:
#   1) The build environment for the Vite frontend (stage `web-builder`).
#   2) The runtime nginx that serves the built static files + reverse-proxies
#      /api/* to the backend container.
#
# Build context: the repository root (so we can COPY ./FrontEnd into the builder).

# ============================================================
# Stage 1 — build the SPA
# ============================================================
FROM node:22-alpine AS web-builder
WORKDIR /web

# Install just enough to install deps (pnpm-lock present, but the FrontEnd
# package.json says npm scripts; using npm here keeps the build self-contained
# without adding pnpm to the image).
RUN apk add --no-cache python3 make g++

COPY FrontEnd/package.json FrontEnd/pnpm-lock.yaml ./
# npm reads package.json fine and ignores pnpm-lock; install without lockfile
# strictness so we don't fight pnpm vs npm. (Reproducibility on prod is
# acceptable here since FE deps are pinned with caret ranges and we rebuild
# from scratch per deploy.)
RUN npm install --no-audit --no-fund

COPY FrontEnd/ ./
RUN npm run build

# ============================================================
# Stage 2 — nginx runtime
# ============================================================
FROM nginx:1.27-alpine AS runtime

# Drop the default site so our template is the only one.
RUN rm /etc/nginx/conf.d/default.conf

# Two templated configs: one for the http→https redirect, one for the TLS
# server. The official nginx image runs envsubst over /etc/nginx/templates/*
# at container start (NGINX_ENVSUBST_TEMPLATE_DIR), so $SERVER_NAME is the
# only knob we need to flip when moving between hosts.
COPY deploy/nginx/templates/ /etc/nginx/templates/

# Built SPA assets.
COPY --from=web-builder /web/dist /usr/share/nginx/html

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --spider http://localhost/ || exit 1
