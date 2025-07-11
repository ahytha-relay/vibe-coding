#!/bin/bash

# Check if channel ID was provided as an argument
if [ "$1" ]; then
  CHANNEL_ID="$1"
  echo "Using provided channel ID: $CHANNEL_ID"
else
  # Create a test channel
  echo "Creating test channel..."
  CHANNEL_TEMPLATE_ID="test-template-id"
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
    -d "{\"content\": \"$CONTENT\"}"
done

echo "Test channel populated."

echo "Open http://localhost/channel-ui/$CHANNEL_ID in your browser to view the channel."