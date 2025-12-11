#!/bin/bash

# Test Health Endpoint
echo "🔍 Testing Health Endpoint..."
curl https://chatbot-viv6.onrender.com/api/health
echo -e "\n\n"

# Test Chat Endpoint
echo "💬 Testing Chat Endpoint..."
curl -X POST https://chatbot-viv6.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "sessionId": "test123"}'
echo -e "\n"

