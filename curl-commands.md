# Chat Session API - Individual cURL Commands for Testing
# Copy and paste each command to test individually

echo "🚀 Starting individual API tests..."

# ============================================
# 1. HEALTH CHECK
# ============================================
echo "1️⃣ Testing health check..."
curl -X GET "http://localhost:3000/health"

# ============================================  
# 2. CREATE CHAT SESSION
# ============================================
echo "2️⃣ Creating new chat session..."
curl -X POST "http://localhost:3000/api/v1/chat/sessions" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "model": "gemini-2.5-flash-preview-05-20"
  }'

# Save the sessionId from response above, example: chat_1748777866760_o7i1f31bg
# Replace SESSION_ID_HERE with actual sessionId in commands below

# ============================================
# 3. SEND FIRST MESSAGE
# ============================================
echo "3️⃣ Sending first message..."
curl -X POST "http://localhost:3000/api/v1/chat/sessions/SESSION_ID_HERE/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Xin chào! Tôi tên là Nam và tôi đang học JavaScript."
  }'

# ============================================
# 4. SEND SECOND MESSAGE (Test Memory)
# ============================================
echo "4️⃣ Testing memory with second message..."
curl -X POST "http://localhost:3000/api/v1/chat/sessions/SESSION_ID_HERE/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Bạn có nhớ tên tôi không?"
  }'

# ============================================
# 5. GET CHAT HISTORY
# ============================================
echo "5️⃣ Getting chat history..."
curl -X GET "http://localhost:3000/api/v1/chat/sessions/SESSION_ID_HERE/history"

# ============================================
# 6. SAVE CONVERSATION
# ============================================
echo "6️⃣ Saving conversation..."
curl -X POST "http://localhost:3000/api/v1/chat/sessions/SESSION_ID_HERE/save" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Conversation với Nam"
  }'

# ============================================
# 7. GET ACTIVE SESSIONS
# ============================================
echo "7️⃣ Getting active sessions..."
curl -X GET "http://localhost:3000/api/v1/chat/sessions?userId=user123"

# ============================================
# 8. LOAD CONVERSATION FROM DATABASE
# ============================================
echo "8️⃣ Loading conversation from database..."
curl -X POST "http://localhost:3000/api/v1/chat/sessions/SESSION_ID_HERE/load" \
  -H "Content-Type: application/json" \
  -d '{
    "savedHistory": [
      {
        "role": "user",
        "parts": [{"text": "Tôi tên là Nam"}]
      },
      {
        "role": "model", 
        "parts": [{"text": "Chào Nam! Rất vui được gặp bạn."}]
      }
    ]
  }'

# ============================================
# 9. DELETE SESSION
# ============================================
echo "9️⃣ Deleting session..."
curl -X DELETE "http://localhost:3000/api/v1/chat/sessions/SESSION_ID_HERE"

# ============================================
# EXAMPLE WITH REAL SESSION ID (Replace with actual)
# ============================================

# Example session ID: chat_1748777866760_o7i1f31bg
# curl -X POST "http://localhost:3000/api/v1/chat/sessions/chat_1748777866760_o7i1f31bg/messages" \
#   -H "Content-Type: application/json" \
#   -d '{"message": "Hello World!"}'