# Video Script Generation API - Test Commands
# Base URL: http://localhost:3000/api/v1/video-script

echo "🎬 Testing Video Script Generation API..."

# ============================================
# STEP 1: GENERATE CONTENT
# ============================================
echo "1️⃣ Step 1: Generate Content Strategy..."
curl -X POST "http://localhost:3000/api/v1/video-script/content/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Quảng cáo AI ToolCheap",
    "tags": ["AI", "automation", "productivity", "tools"],
    "duration": "60s"
  }'

# Save contentId from response above, example: content_1748779123_abc123def
# Replace CONTENT_ID_HERE with actual contentId in commands below

# ============================================
# STEP 2A: GENERATE CHARACTER 1 (Auto)
# ============================================
echo "2️⃣ Step 2A: Generate Character 1 (Auto)..."
curl -X POST "http://localhost:3000/api/v1/video-script/characters/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "CONTENT_ID_HERE"
  }'

# ============================================
# STEP 2B: GENERATE CHARACTER 2 (Custom)
# ============================================
echo "2️⃣ Step 2B: Generate Character 2 (Custom)..."
curl -X POST "http://localhost:3000/api/v1/video-script/characters/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "CONTENT_ID_HERE",
    "characterPrompt": "Người quảng cáo, hài hước, năng động"
  }'

# ============================================
# STEP 2C: GENERATE CHARACTER 3 (Custom)
# ============================================
echo "2️⃣ Step 2C: Generate Character 3 (Custom)..."
curl -X POST "http://localhost:3000/api/v1/video-script/characters/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "CONTENT_ID_HERE",
    "characterPrompt": "Người mù công nghệ, ngoại hình khờ khạo, dễ thương"
  }'

# ============================================
# STEP 3: GENERATE DIALOGUE
# ============================================
echo "3️⃣ Step 3: Generate Dialogue..."
curl -X POST "http://localhost:3000/api/v1/video-script/dialogue/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "CONTENT_ID_HERE"
  }'

# ============================================
# STEP 4: GENERATE FINAL SCRIPT
# ============================================
echo "4️⃣ Step 4: Generate Final Script & Prompt..."
curl -X POST "http://localhost:3000/api/v1/video-script/final/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "CONTENT_ID_HERE"
  }'

# ============================================
# HELPER: GET CONTENT INFO
# ============================================
echo "📋 Helper: Get Content Info..."
curl -X GET "http://localhost:3000/api/v1/video-script/content/CONTENT_ID_HERE"

# ============================================
# HELPER: GET ALL CHARACTERS
# ============================================
echo "👥 Helper: Get All Characters..."
curl -X GET "http://localhost:3000/api/v1/video-script/characters/CONTENT_ID_HERE"

# ============================================
# REAL EXAMPLE (Replace with actual contentId)
# ============================================

# Example contentId: content_1748779123_abc123def
# curl -X POST "http://localhost:3000/api/v1/video-script/characters/generate" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "contentId": "content_1748779123_abc123def",
#     "characterPrompt": "Người bán hàng chuyên nghiệp, thân thiện"
#   }'