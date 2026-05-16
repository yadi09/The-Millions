#!/usr/bin/env bash
# Single command to (re)deploy the stack.
#
# What it does:
#   1. git pull (unless --no-pull)
#   2. ensures deploy/.env exists and cert files exist
#   3. takes a Postgres backup BEFORE migrating (rollback safety net)
#   4. builds the backend + nginx images
#   5. brings the stack up with --no-deps for non-postgres services
#   6. waits for the backend health check to go green
#   7. on failure, restores the pre-deploy backup and rolls back images
#
# Run from the repo root via: ./deploy/deploy.sh
# Or: ./deploy/deploy.sh --no-pull   (when iterating locally on the host)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_DIR="$REPO_ROOT/deploy"
COMPOSE="docker compose -f $DEPLOY_DIR/docker-compose.prod.yml --env-file $DEPLOY_DIR/.env"

NO_PULL=0
for arg in "$@"; do
  case "$arg" in
    --no-pull) NO_PULL=1 ;;
    *) echo "unknown arg: $arg" >&2; exit 1 ;;
  esac
done

# ----- preflight -----
if [[ ! -f "$DEPLOY_DIR/.env" ]]; then
  echo "deploy/.env missing — run ./deploy/init-secrets.sh first." >&2
  exit 1
fi
if [[ ! -f "$DEPLOY_DIR/certs/fullchain.pem" ]]; then
  echo "TLS cert missing — run ./deploy/issue-cert.sh first." >&2
  exit 1
fi

cd "$REPO_ROOT"

# ----- pull latest -----
if [[ $NO_PULL -eq 0 ]]; then
  echo "==> git pull"
  git pull --ff-only
fi

# ----- backup before migrating -----
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="/var/backups/themillions"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/predeploy-$TIMESTAMP.sql.gz"

if $COMPOSE ps postgres --status running -q | grep -q .; then
  echo "==> pre-deploy Postgres backup → $BACKUP_FILE"
  $COMPOSE exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "$BACKUP_FILE"
  echo "    backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
  echo "==> postgres not running yet — skipping pre-deploy backup (first deploy?)"
fi

# ----- build & up -----
echo "==> building images"
$COMPOSE build --pull

echo "==> bringing stack up"
$COMPOSE up -d

# ----- wait for backend health -----
echo "==> waiting for backend to become healthy (timeout 90s)"
DEADLINE=$(( $(date +%s) + 90 ))
while true; do
  STATUS=$($COMPOSE ps backend --format json 2>/dev/null | grep -o '"Health":"[^"]*"' | head -1 | cut -d'"' -f4 || true)
  if [[ "$STATUS" == "healthy" ]]; then
    echo "    backend healthy ✅"
    break
  fi
  if (( $(date +%s) >= DEADLINE )); then
    echo "❌ backend never became healthy. Logs:"
    $COMPOSE logs --tail=80 backend
    echo
    echo "If the previous deploy was healthy, you can roll back data with:"
    echo "  ./deploy/restore-backup.sh $BACKUP_FILE"
    exit 1
  fi
  sleep 3
done

echo
echo "✅ Deploy complete. Quick sanity:"
echo "   curl -k https://$(grep '^SERVER_NAME=' "$DEPLOY_DIR/.env" | cut -d= -f2)/api/health"
echo
echo "If this was the very first deploy, seed the database NOW:"
echo "   ./deploy/seed-db.sh"
