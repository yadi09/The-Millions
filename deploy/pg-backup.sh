#!/usr/bin/env bash
# Daily Postgres backup. Designed to be run from cron.
#
# Writes /var/backups/themillions/YYYY-MM-DD.sql.gz and keeps the last 14.
# Larger retention policies (off-host, S3, etc.) are operator-specific and
# left out of this script — add a separate rsync/aws-cli step if desired.
#
# Install via:
#   sudo crontab -e
#   0 3 * * * /home/ubuntu/The-Millions/deploy/pg-backup.sh >> /var/log/themillions-backup.log 2>&1

set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE="docker compose -f $DEPLOY_DIR/docker-compose.prod.yml --env-file $DEPLOY_DIR/.env"

BACKUP_DIR="/var/backups/themillions"
DATE="$(date +%Y-%m-%d)"
OUT="$BACKUP_DIR/$DATE.sql.gz"
RETENTION_DAYS=14

mkdir -p "$BACKUP_DIR"

echo "[$(date -Iseconds)] starting backup → $OUT"

$COMPOSE exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "$OUT"

SIZE="$(du -h "$OUT" | cut -f1)"
echo "[$(date -Iseconds)] backup ok, size $SIZE"

# Trim old backups
find "$BACKUP_DIR" -name '*.sql.gz' -mtime "+$RETENTION_DAYS" -delete
echo "[$(date -Iseconds)] pruned backups older than $RETENTION_DAYS days"
