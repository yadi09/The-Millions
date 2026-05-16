#!/bin/sh
# Container entrypoint for the backend.
#
# 1. Waits briefly for Postgres to be reachable.
# 2. Runs `prisma migrate deploy` — applies any pending migrations.
#    This is safe to run on every boot: it is a no-op when there are none.
# 3. Hands off to the CMD (node dist/server.js) via `exec` so signals are
#    forwarded directly to the Node process (tini → entrypoint → node).
#
# This script does NOT run `prisma db seed`. Seeding writes content + admin
# user; it is a one-time operator action that must be invoked with explicit
# ADMIN_EMAIL / ADMIN_PASSWORD env vars. See docs/DEPLOYMENT.md.

set -e

echo "[entrypoint] running prisma migrate deploy..."
npx prisma migrate deploy

echo "[entrypoint] starting: $*"
exec "$@"
