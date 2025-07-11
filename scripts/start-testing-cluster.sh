#!/bin/zsh
# Script to start the testing Docker cluster

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_COMPOSE_FILE="$SCRIPT_DIR/../testing/docker-compose.yml"

(
  cd "$SCRIPT_DIR/../channel-ui" || exit 1
  npm run build
  if [ $? -ne 0 ]; then
    echo "Channel UI build failed. Exiting."
    exit 1
  fi
  echo "Channel UI build completed successfully."
)

echo "Starting testing Docker cluster..."

docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --build

echo "Testing Docker cluster started."
