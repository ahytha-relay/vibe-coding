#!/bin/zsh
# Script to start the testing Docker cluster

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_COMPOSE_FILE="$SCRIPT_DIR/../testing/docker-compose.yml"

echo "Starting testing Docker cluster..."

docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --build

echo "Testing Docker cluster started."
