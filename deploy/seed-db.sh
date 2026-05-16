#!/usr/bin/env bash
# Seeds the production DB ONCE. Idempotent (the seed uses upsert), but the
# admin user is only created on the first run with the ADMIN_PASSWORD you set
# in deploy/.env. After that, change the password via the admin UI (when
# implemented) or `npx prisma db seed` with a different ADMIN_PASSWORD won't
# update an existing user — the seed uses `update: {}`.

set -euo pipefail
DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE="docker compose -f $DEPLOY_DIR/docker-compose.prod.yml --env-file $DEPLOY_DIR/.env"

# shellcheck disable=SC1090
set -a; source "$DEPLOY_DIR/.env"; set +a

if [[ -z "${ADMIN_PASSWORD:-}" || "$ADMIN_PASSWORD" == "REPLACE_ME" ]]; then
  echo "ADMIN_PASSWORD not set in deploy/.env. Set it before seeding." >&2
  exit 1
fi

echo "==> seeding DB (admin: $ADMIN_EMAIL)"
$COMPOSE exec -e ADMIN_EMAIL="$ADMIN_EMAIL" -e ADMIN_PASSWORD="$ADMIN_PASSWORD" backend npx prisma db seed

echo "✅ Seed complete. Test login:"
echo "   curl -k -X POST https://${SERVER_NAME}/api/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}'"
