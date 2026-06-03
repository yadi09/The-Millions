#!/usr/bin/env bash
# Generates strong secrets and writes deploy/.env (chmod 600).
# Idempotent in the safe direction: if deploy/.env already exists, it refuses
# to overwrite. Use --rotate-jwt or --rotate-db-password to rotate individual
# secrets in place. Other fields require manual editing.
#
# What gets generated:
#   POSTGRES_PASSWORD      24-char random alphanumeric
#   JWT_SECRET             64-char hex (openssl rand -hex 32)
#   ADMIN_PASSWORD         16-char random with mixed classes
#
# What the operator MUST set after this script runs:
#   SERVER_NAME            hostname (e.g. themillions.co.uk) or `_` for IP-only
#   CORS_ORIGINS           e.g. https://themillions.co.uk
#   CLOUDINARY_*           from your Cloudinary dashboard
#   ADMIN_EMAIL            the email you'll use to log in

set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$DIR/.env"
EXAMPLE_FILE="$DIR/.env.example"

# Subshells turn off pipefail just for these reads. /dev/urandom is infinite,
# so `head -c N` closes the pipe after N bytes and `tr` exits with SIGPIPE
# (141). Under `set -o pipefail` that would kill the script — wrap in a
# subshell where pipefail is off.
#
# Alphanumeric-only on purpose. Symbols are awkward: a `;`, `*`, `$`, or `"`
# in a value silently breaks bash sourcing (`set -a; source .env`) and docker
# compose's .env parser. Length compensates for the smaller class: 20 alnum
# chars = log2(62^20) ≈ 119 bits — far more than enough.
gen_alnum() { ( set +o pipefail; tr -dc 'A-Za-z0-9' </dev/urandom | head -c "$1" ); }
gen_hex()   { openssl rand -hex "$1"; }

if [[ -f "$ENV_FILE" ]]; then
  echo "deploy/.env already exists. Refusing to overwrite." >&2
  echo "To rotate individual secrets, edit the file directly." >&2
  exit 1
fi

if [[ ! -f "$EXAMPLE_FILE" ]]; then
  echo "deploy/.env.example missing — cannot proceed." >&2
  exit 1
fi

POSTGRES_PASSWORD="$(gen_alnum 24)"
JWT_SECRET="$(gen_hex 32)"
ADMIN_PASSWORD="$(gen_alnum 20)"
AGENT_API_KEY="$(gen_hex 32)"

cp "$EXAMPLE_FILE" "$ENV_FILE"
chmod 600 "$ENV_FILE"

# In-place substitution. Use a non-/ delimiter for safety on values with /.
sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=${POSTGRES_PASSWORD}|" "$ENV_FILE"
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET}|" "$ENV_FILE"
sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=${ADMIN_PASSWORD}|" "$ENV_FILE"
sed -i "s|^AGENT_API_KEY=.*|AGENT_API_KEY=${AGENT_API_KEY}|" "$ENV_FILE"

cat <<EOF

✅ deploy/.env created (chmod 600).

Generated secrets:
  POSTGRES_PASSWORD  $POSTGRES_PASSWORD
  JWT_SECRET         (64 hex chars — see deploy/.env)
  ADMIN_PASSWORD     $ADMIN_PASSWORD
  AGENT_API_KEY      (64 hex chars — see deploy/.env)

⚠️  STILL TO FILL IN MANUALLY (edit deploy/.env):
  SERVER_NAME        your domain, or '_' for the EC2 IP dry-run
  CORS_ORIGINS       your public URL(s), comma-separated
  CLOUDINARY_*       from your Cloudinary dashboard
  ADMIN_EMAIL        the email you'll log in with

Once those are set, run: ./deploy/deploy.sh

Save the ADMIN_PASSWORD somewhere safe — you'll need it the first time you
log in to the admin panel. You can rotate it later via the (forthcoming)
password-change endpoint or by re-seeding.
EOF
