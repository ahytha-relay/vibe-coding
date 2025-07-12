#!/bin/bash

# Create test channelTemplate if it doesn't exist
echo "Creating test channel template..."
CHANNEL_TEMPLATE_RESPONSE=$(curl -s -X POST http://localhost/api/channel/templates \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Template", "bannerImage": "https://example.com/banner.jpg"}')
CHANNEL_TEMPLATE_ID=$(echo $CHANNEL_TEMPLATE_RESPONSE | jq -r '.id')
echo "Test channel template created."

# Check if channel ID was provided as an argument
if [ "$1" ]; then
  CHANNEL_ID="$1"
  echo "Using provided channel ID: $CHANNEL_ID"
else
  # Create a test channel
  echo "Creating test channel..."
  CHANNEL_RESPONSE=$(curl -s -X POST http://localhost/api/channel/ \
    -H "Content-Type: application/json" \
    -d '{"channelTemplateId": "'$CHANNEL_TEMPLATE_ID'"}')
  CHANNEL_ID=$(echo $CHANNEL_RESPONSE | jq -r '.id')
  
  echo "Created channel with ID: $CHANNEL_ID"
fi

# Add test messages
echo "Adding test messages..."
MESSAGES=("Hello, <b>world!</b>" "<iframe src=\"https://www.youtube.com/embed/tgbNymZ7vqY\"> </iframe>")
for MSG in "${MESSAGES[@]}"; do
  CONTENT=$(echo "$MSG" | sed 's/"/\\"/g')  # Escape double quotes for JSON
  echo "Adding message: $CONTENT"
  curl -s -X POST http://localhost/api/channel/$CHANNEL_ID/messages \
    -H "Content-Type: application/json" \
    -d "{\"content\": \"$CONTENT\"}" > /dev/null
done

echo "Test channel populated."

echo "Open http://localhost/channel-ui/$CHANNEL_ID in your browser to view the channel."