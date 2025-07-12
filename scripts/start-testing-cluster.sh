#!/bin/zsh
# Script to start the testing Docker cluster

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_COMPOSE_FILE="$SCRIPT_DIR/../testing/docker-compose.yml"

sh "$SCRIPT_DIR/build-ui-projects.sh"

echo "Starting testing Docker cluster..."

docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --build

echo "Testing Docker cluster started."

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 5;
MAX_RETRIES=30
RETRY_INTERVAL=2
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -s http://localhost/api/healthcheck > /dev/null 2>&1; then
    echo "Services are ready!"
    # Now that services are confirmed running, populate the test channel
    echo "Populating test channel..."
    sh "$SCRIPT_DIR/populate-test-channel.sh"
    exit 0
  fi
  
  echo "Services not ready yet, retrying in $RETRY_INTERVAL seconds..."
  sleep $RETRY_INTERVAL
  RETRY_COUNT=$((RETRY_COUNT + 1))
done

echo "Timed out waiting for services to be ready after $((MAX_RETRIES * RETRY_INTERVAL)) seconds."
echo "Services may still be starting. To populate test data later, run: sh $SCRIPT_DIR/populate-test-channel.sh"