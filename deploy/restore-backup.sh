#!/usr/bin/env bash
# Restore a Postgres backup produced by pg-backup.sh or by deploy.sh's
# pre-deploy snapshot. Destructive: wipes current DB contents and replaces
# with the backup.
#
# Usage: ./deploy/restore-backup.sh /var/backups/themillions/predeploy-20260516-103000.sql.gz

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <path-to-backup.sql.gz>" >&2
  exit 1
fi

BACKUP="$1"
if [[ ! -f "$BACKUP" ]]; then
  echo "Backup file not found: $BACKUP" >&2
  exit 1
fi

DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE="docker compose -f $DEPLOY_DIR/docker-compose.prod.yml --env-file $DEPLOY_DIR/.env"

echo "⚠️  About to wipe the current DB and restore from:"
echo "    $BACKUP"
read -r -p "Type RESTORE to continue: " confirm
if [[ "$confirm" != "RESTORE" ]]; then
  echo "aborted."
  exit 1
fi

echo "==> stopping backend so it doesn't write during the restore"
$COMPOSE stop backend

echo "==> recreating DB"
$COMPOSE exec -T postgres sh -c '
  psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$POSTGRES_DB\""
  psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE \"$POSTGRES_DB\""
'

echo "==> restoring"
gunzip -c "$BACKUP" | $COMPOSE exec -T postgres sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"'

echo "==> restarting backend"
$COMPOSE start backend

echo "✅ restore complete. Verify with: curl -k https://\$SERVER_NAME/api/health"
