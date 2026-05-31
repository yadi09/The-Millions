#!/usr/bin/env bash
# Bootstraps a fresh Ubuntu 22.04 host (EC2, Fast Host, anything) to run the
# Docker Compose stack.
#
# What it does:
#   - apt update + unattended-upgrades for security patches
#   - installs docker engine + compose plugin (official Docker apt repo)
#   - adds the invoking user to the docker group
#   - configures a 2 GB swap file (matters on t3.small / 2 GB RAM hosts)
#   - configures ufw: deny incoming except 22, 80, 443
#   - opens /var/backups/themillions for Postgres dumps
#   - installs git (used by deploy.sh) and certbot dependencies
#
# Idempotent — safe to run again.
#
# Run as a user with sudo. NOT as root.

set -euo pipefail

if [[ $EUID -eq 0 ]]; then
  echo "Run as a regular user with sudo, not root." >&2
  exit 1
fi

USER_TO_ADD="${USER:-ubuntu}"

echo "==> apt update + base packages"
sudo apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
  ca-certificates curl gnupg lsb-release ufw git unattended-upgrades

echo "==> enabling unattended-upgrades"
sudo dpkg-reconfigure -plow unattended-upgrades || true

echo "==> installing Docker engine + compose plugin"
if ! command -v docker >/dev/null 2>&1; then
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin
fi
echo "    docker: $(docker --version)"
echo "    compose: $(docker compose version)"

echo "==> adding $USER_TO_ADD to docker group"
sudo usermod -aG docker "$USER_TO_ADD"
echo "    (log out + back in for group to take effect on this shell)"

echo "==> swap file (tries 2G → 1G → 512M based on available disk)"
if swapon --show | grep -q "^/swapfile"; then
  echo "    swap already active; skipping."
else
  # Clean up a partial swapfile left by a previous failed run.
  if [[ -f /swapfile ]]; then
    echo "    found stale /swapfile (not active) — removing."
    sudo rm -f /swapfile
  fi

  AVAIL_MB=$(df -m / | awk 'NR==2 {print $4}')
  echo "    available: ${AVAIL_MB} MB on /"

  SWAP_MB=0
  for candidate in 2048 1024 512; do
    # Need ~150 MB headroom so the FS isn't fully consumed.
    if [[ $AVAIL_MB -ge $((candidate + 150)) ]]; then
      SWAP_MB=$candidate
      break
    fi
  done

  if [[ $SWAP_MB -eq 0 ]]; then
    echo "    ⚠️  Not enough free space for even a 512 MB swap file. Skipping swap."
    echo "       Strongly recommended: expand the root volume to >=20 GB and re-run this script."
  else
    echo "    creating ${SWAP_MB} MB swap file..."
    if sudo fallocate -l "${SWAP_MB}M" /swapfile; then
      sudo chmod 600 /swapfile
      sudo mkswap /swapfile
      sudo swapon /swapfile
      if ! grep -q '^/swapfile' /etc/fstab; then
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
      fi
      echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swap.conf >/dev/null
      sudo sysctl -p /etc/sysctl.d/99-swap.conf
    else
      echo "    ⚠️  swap allocation failed — continuing without swap."
      sudo rm -f /swapfile
    fi
  fi
fi

echo "==> firewall (ufw): allow 22, 80, 443; deny rest"
sudo ufw --force reset >/dev/null
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status verbose

echo "==> backup directory: /var/backups/themillions"
sudo mkdir -p /var/backups/themillions
sudo chown "$USER_TO_ADD:$USER_TO_ADD" /var/backups/themillions

echo
echo "✅ Setup complete."
echo "   Next: cd into the cloned repo, run ./deploy/init-secrets.sh, then ./deploy/deploy.sh"
