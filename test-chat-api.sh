#!/bin/bash

# Chat Session API Test Script
echo "🚀 Testing Chat Session API..."
echo "=================================="

BASE_URL="http://localhost:3000/api/v1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing Health Check...${NC}"
curl -s "$BASE_URL/../health" | jq '.'
echo ""

echo -e "${BLUE}1. Creating new chat session...${NC}"
SESSION_RESPONSE=$(curl -s -X POST "$BASE_URL/chat/sessions" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "model": "gemini-2.5-flash-preview-05-20"
  }')

echo "$SESSION_RESPONSE" | jq '.'

# Extract sessionId from response
SESSION_ID=$(echo "$SESSION_RESPONSE" | jq -r '.data.sessionId')

if [ "$SESSION_ID" != "null" ] && [ -n "$SESSION_ID" ]; then
  echo -e "${GREEN}✅ Session created successfully: $SESSION_ID${NC}"
  echo ""
  
  echo -e "${BLUE}2. Sending first message...${NC}"
  curl -s -X POST "$BASE_URL/chat/sessions/$SESSION_ID/messages" \
    -H "Content-Type: application/json" \
    -d '{
      "message": "Xin chào! Tôi tên là Nam và tôi đang học lập trình."
    }' | jq '.'
  echo ""
  
  echo -e "${BLUE}3. Sending second message (test memory)...${NC}"
  curl -s -X POST "$BASE_URL/chat/sessions/$SESSION_ID/messages" \
    -H "Content-Type: application/json" \
    -d '{
      "message": "Bạn có nhớ tên tôi không?"
    }' | jq '.'
  echo ""
  
  echo -e "${BLUE}4. Getting chat history...${NC}"
  curl -s -X GET "$BASE_URL/chat/sessions/$SESSION_ID/history" | jq '.'
  echo ""
  
  echo -e "${BLUE}5. Saving conversation...${NC}"
  curl -s -X POST "$BASE_URL/chat/sessions/$SESSION_ID/save" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Test Conversation với Nam"
    }' | jq '.'
  echo ""
  
  echo -e "${BLUE}6. Getting active sessions...${NC}"
  curl -s -X GET "$BASE_URL/chat/sessions?userId=test_user_123" | jq '.'
  echo ""
  
  echo -e "${BLUE}7. Deleting session...${NC}"
  curl -s -X DELETE "$BASE_URL/chat/sessions/$SESSION_ID" | jq '.'
  echo ""
  
else
  echo -e "${RED}❌ Failed to create session!${NC}"
fi

echo -e "${GREEN}🎉 Test completed!${NC}"