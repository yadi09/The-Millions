#!/usr/bin/env bash
# Issues TLS certs and writes them to deploy/certs/.
#
# Two modes, chosen automatically from $SERVER_NAME in deploy/.env:
#
#   SERVER_NAME=_  or empty    →  self-signed cert (EC2 dry-run, IP-only)
#   SERVER_NAME=foo.example    →  Let's Encrypt cert via certbot
#
# The nginx container mounts deploy/certs/ as /etc/nginx/certs (read-only).
# Files produced: deploy/certs/fullchain.pem  and  deploy/certs/privkey.pem
#
# Re-runs are safe: self-signed regenerates; LE only renews when within 30 days
# of expiry. A cron entry (added by deploy.sh) re-runs this weekly.

set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$DIR/.env"
CERTS_DIR="$DIR/certs"
WEBROOT="$DIR/certbot-webroot"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "deploy/.env not found — run init-secrets.sh first." >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

mkdir -p "$CERTS_DIR" "$WEBROOT"

# ----- Self-signed mode (IP-only or wildcard hostname) -----
if [[ -z "${SERVER_NAME:-}" || "${SERVER_NAME}" == "_" ]]; then
  echo "==> self-signed cert (SERVER_NAME=${SERVER_NAME:-empty})"
  if [[ -f "$CERTS_DIR/fullchain.pem" && -f "$CERTS_DIR/privkey.pem" ]]; then
    # Don't churn on every deploy; only regenerate if older than 300 days.
    if [[ -n "$(find "$CERTS_DIR/fullchain.pem" -mtime +300 2>/dev/null)" ]]; then
      echo "    existing self-signed cert is >300d old; regenerating."
    else
      echo "    existing self-signed cert is fresh; skipping."
      exit 0
    fi
  fi
  openssl req -x509 -nodes -newkey rsa:2048 \
    -keyout "$CERTS_DIR/privkey.pem" \
    -out "$CERTS_DIR/fullchain.pem" \
    -days 365 \
    -subj "/CN=themillions-dryrun" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
  chmod 600 "$CERTS_DIR/privkey.pem"
  echo "✅ self-signed cert written to $CERTS_DIR"
  echo "   (browsers will warn — click through for the dry-run.)"
  exit 0
fi

# ----- Let's Encrypt mode -----
echo "==> Let's Encrypt cert for ${SERVER_NAME}"

# Use the certbot docker image so we don't pollute the host with python deps.
# Standalone mode is simplest for first issuance: certbot binds :80 itself,
# which means we have to stop nginx briefly.
#
# Better long-term: webroot mode while nginx is running. For now we keep this
# script focused on first issuance + later renewals; renewals don't need
# downtime in webroot mode.

EMAIL="${CERTBOT_EMAIL:-admin@${SERVER_NAME}}"

# If a cert already exists and is not within 30 days of expiry, skip.
if [[ -f "$CERTS_DIR/fullchain.pem" ]]; then
  if openssl x509 -checkend 2592000 -noout -in "$CERTS_DIR/fullchain.pem" 2>/dev/null; then
    echo "    existing cert valid for >30 days; skipping renewal."
    exit 0
  fi
fi

cd "$DIR"
# Stop nginx so port 80 is free for certbot --standalone.
docker compose -f docker-compose.prod.yml stop nginx 2>/dev/null || true

docker run --rm \
  -p 80:80 \
  -v "$DIR/certbot-letsencrypt:/etc/letsencrypt" \
  -v "$WEBROOT:/var/www/certbot" \
  certbot/certbot:latest certonly --standalone \
    --non-interactive --agree-tos \
    --email "$EMAIL" \
    -d "$SERVER_NAME"

# Copy the issued cert into the path nginx mounts.
sudo cp "$DIR/certbot-letsencrypt/live/$SERVER_NAME/fullchain.pem" "$CERTS_DIR/"
sudo cp "$DIR/certbot-letsencrypt/live/$SERVER_NAME/privkey.pem"   "$CERTS_DIR/"
sudo chown "$(id -u):$(id -g)" "$CERTS_DIR/fullchain.pem" "$CERTS_DIR/privkey.pem"
chmod 600 "$CERTS_DIR/privkey.pem"

# Restart nginx so it picks up the new cert.
docker compose -f docker-compose.prod.yml up -d nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload || true

echo "✅ Let's Encrypt cert issued for $SERVER_NAME and installed."
