#!/bin/bash

# GA4 Webhook Test Script
# Usage: ./test-ga4-webhook.sh [local|production]

# Configuration
WEBHOOK_SECRET="your-webhook-secret-here"  # Replace with actual secret
ENV=${1:-local}

if [ "$ENV" = "local" ]; then
  URL="http://localhost:8888/.netlify/functions/ga4-webhook"
else
  URL="https://colorcocktailfactory.com/.netlify/functions/ga4-webhook"
fi

echo "Testing GA4 Webhook: $URL"
echo "-----------------------------------"

# Test 1: Purchase Event
echo ""
echo "Test 1: Valid Purchase Event"
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -d '{
    "event_name": "purchase",
    "transaction_id": "test-'$(date +%s)'",
    "value": 95.00,
    "currency": "USD",
    "city": "Chicago",
    "class_name": "Date Night Pottery on the Wheel",
    "class_id": "date-night-wheel",
    "class_category": "pottery",
    "booking_provider": "rezclick",
    "link_url": "https://rezclick.com/booking/test"
  }' | jq .

echo ""
echo "-----------------------------------"

# Test 2: Generate Lead Event
echo ""
echo "Test 2: Valid Generate Lead Event"
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -d '{
    "event_name": "generate_lead",
    "city": "Eugene",
    "class_name": "Beginner Wheel Throwing",
    "class_id": "beginner-wheel",
    "booking_provider": "eventbrite"
  }' | jq .

echo ""
echo "-----------------------------------"

# Test 3: Missing transaction_id (should fail)
echo ""
echo "Test 3: Invalid Purchase (missing transaction_id - should return 400)"
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -d '{
    "event_name": "purchase",
    "value": 95.00,
    "currency": "USD",
    "city": "Chicago"
  }' | jq .

echo ""
echo "-----------------------------------"

# Test 4: Invalid secret (should fail)
echo ""
echo "Test 4: Invalid Webhook Secret (should return 401)"
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: wrong-secret" \
  -d '{
    "event_name": "purchase",
    "transaction_id": "test-123",
    "value": 95.00,
    "currency": "USD"
  }' | jq .

echo ""
echo "-----------------------------------"
echo ""
echo "✅ Tests complete! Check GA4 Realtime reports to verify events."
echo "   GA4 → Realtime → Event count by Event name"
