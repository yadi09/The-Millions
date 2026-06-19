#!/usr/bin/env bash
# Issues TLS certs and writes them to deploy/certs/.
#
# Two modes, chosen automatically from $SERVER_NAME in deploy/.env:
#
#   SERVER_NAME=_  or empty                  →  self-signed cert (EC2 dry-run, IP-only)
#   SERVER_NAME=foo.example                  →  Let's Encrypt cert via certbot
#   SERVER_NAME="a.example b.example c.ex"   →  same, multi-host SAN cert
#
# When SERVER_NAME contains spaces, every token is added as an additional
# -d hostname on the certbot command (subject alternative name). The first
# token is the "primary" — it's the directory name certbot uses for the
# cert files and it must resolve to this server when this script runs.
#
# The nginx container mounts deploy/certs/ as /etc/nginx/certs (read-only).
# Files produced: deploy/certs/fullchain.pem  and  deploy/certs/privkey.pem
#
# Re-runs are safe: self-signed regenerates; LE only renews when within 30 days
# of expiry. A cron entry (added by deploy.sh) re-runs this weekly.

set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$DIR/.env"
WEBROOT="$DIR/certbot-webroot"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "deploy/.env not found — run init-secrets.sh first." >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

# Set CERTS_DIR AFTER sourcing .env so a stray relative `CERTS_DIR=./certs`
# in the env file can't redirect cert output to the wrong place. This script
# always writes to deploy/certs/ regardless of where it's invoked from, and
# docker-compose mounts the same directory.
CERTS_DIR="$DIR/certs"

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

# Tokenize SERVER_NAME into ordered hostnames. The first one is "primary"
# (used as the certbot --cert-name and as the live/ directory path the
# script copies from). All tokens are added as -d hostnames so we get a
# multi-SAN cert.
read -r -a HOSTS <<< "$SERVER_NAME"
PRIMARY="${HOSTS[0]}"

echo "==> Let's Encrypt cert for: ${HOSTS[*]}  (primary: $PRIMARY)"

# Build the -d argument list. Each hostname must already resolve to this
# server in DNS before this script runs — Let's Encrypt validates with a
# live HTTP-01 challenge per hostname.
CERTBOT_HOSTS=()
for h in "${HOSTS[@]}"; do
  CERTBOT_HOSTS+=(-d "$h")
done

EMAIL="${CERTBOT_EMAIL:-admin@${PRIMARY}}"

# If a cert already exists, valid for >30 days, AND covers every hostname
# we want, skip. If it doesn't cover all hosts, force a renewal so we
# pick up the new SAN list.
NEED_REISSUE=0
if [[ -f "$CERTS_DIR/fullchain.pem" ]]; then
  if openssl x509 -checkend 2592000 -noout -in "$CERTS_DIR/fullchain.pem" 2>/dev/null; then
    # Pull existing SAN list and check every requested host is present.
    EXISTING_SAN="$(openssl x509 -in "$CERTS_DIR/fullchain.pem" -noout -ext subjectAltName 2>/dev/null | tr ',' '\n' | grep -oE 'DNS:[^,[:space:]]+' | sed 's/DNS://')"
    for h in "${HOSTS[@]}"; do
      if ! grep -qx "$h" <<< "$EXISTING_SAN"; then
        echo "    existing cert is missing hostname '$h' — will re-issue."
        NEED_REISSUE=1
        break
      fi
    done
    if [[ $NEED_REISSUE -eq 0 ]]; then
      echo "    existing cert valid for >30 days and covers all hostnames; skipping."
      exit 0
    fi
  else
    NEED_REISSUE=1
  fi
else
  NEED_REISSUE=1
fi

cd "$DIR"
# Stop nginx so port 80 is free for certbot --standalone.
docker compose -f docker-compose.prod.yml stop nginx 2>/dev/null || true

# --cert-name pins the directory certbot writes to, so the copy lines
# below work consistently even when re-issuing with a different hostname
# list. --force-renewal forces a new cert when we already had one (e.g.
# adding a hostname to an existing cert).
FORCE=""
if [[ $NEED_REISSUE -eq 1 && -f "$CERTS_DIR/fullchain.pem" ]]; then
  FORCE="--force-renewal"
fi

docker run --rm \
  -p 80:80 \
  -v "$DIR/certbot-letsencrypt:/etc/letsencrypt" \
  -v "$WEBROOT:/var/www/certbot" \
  certbot/certbot:latest certonly --standalone \
    --non-interactive --agree-tos \
    --email "$EMAIL" \
    --cert-name "$PRIMARY" \
    $FORCE \
    "${CERTBOT_HOSTS[@]}"

# Copy the issued cert into the path nginx mounts. cert-name pinned the
# directory to $PRIMARY above.
sudo cp "$DIR/certbot-letsencrypt/live/$PRIMARY/fullchain.pem" "$CERTS_DIR/"
sudo cp "$DIR/certbot-letsencrypt/live/$PRIMARY/privkey.pem"   "$CERTS_DIR/"
sudo chown "$(id -u):$(id -g)" "$CERTS_DIR/fullchain.pem" "$CERTS_DIR/privkey.pem"
chmod 600 "$CERTS_DIR/privkey.pem"

# Restart nginx so it picks up the new cert.
docker compose -f docker-compose.prod.yml up -d nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload || true

echo "✅ Let's Encrypt cert issued for ${HOSTS[*]} and installed."
