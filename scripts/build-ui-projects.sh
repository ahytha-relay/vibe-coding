#!/bin/bash

# Build UI projects for testing
# This script builds both the channel-ui and builder-ui projects

set -e  # Exit on any error

echo "Building channel-ui project..."
cd "$(dirname "$0")/../channel-ui"
npm run build

echo "Building builder-ui project..."
cd "$(dirname "$0")/../builder-ui"
npm run build

echo "Both UI projects have been built successfully."
echo "You can now run docker-compose up in the testing directory to start the testing environment."
