# Video Script Generation API - Stateless Version
# FE sends JSON data, no server-side memory storage

echo "🎬 Testing Stateless Video Script Generation API..."

# ============================================
# STEP 1: GENERATE CONTENT (First time)
# ============================================
echo "1️⃣ Step 1: Generate Content Strategy..."
curl -X POST "http://localhost:3000/api/v1/video-script/content/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Quảng cáo AI ToolCheap",
    "tags": ["AI", "automation", "productivity"],
    "duration": "60s"
  }'

# ============================================
# STEP 1B: REGENERATE CONTENT (With existing content)
# ============================================
echo "1️⃣B Step 1B: Regenerate Content with modifications..."
curl -X POST "http://localhost:3000/api/v1/video-script/content/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Quảng cáo AI ToolCheap - Phiên bản cải thiện",
    "tags": ["AI", "automation", "productivity", "affordable"],
    "duration": "90s",
    "existingContent": {
      "mainMessage": "AI ToolCheap: Giải pháp AI thông minh, hiệu quả với chi phí tối ưu",
      "keyPoints": ["Giá cả phải chăng", "Tăng tốc công việc", "Đa năng"],
      "tone": "Chuyên nghiệp nhưng thân thiện"
    }
  }'

# ============================================
# STEP 2: GENERATE CHARACTER (FE sends contentData)
# ============================================
echo "2️⃣ Step 2: Generate Character..."
curl -X POST "http://localhost:3000/api/v1/video-script/characters/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "contentId": "content_1748780410282_d632w5hcq",
      "topic": "Quảng cáo AI ToolCheap",
      "tags": ["AI", "automation", "productivity"],
      "mainMessage": "AI ToolCheap: Giải pháp AI thông minh, hiệu quả với chi phí tối ưu",
      "keyPoints": ["Giá cả phải chăng", "Tăng tốc công việc", "Đa năng", "Dễ sử dụng"],
      "tone": "Chuyên nghiệp nhưng thân thiện",
      "targetAudience": "Cá nhân, freelancer, chủ doanh nghiệp nhỏ",
      "duration": "60s",
      "createdAt": "2025-06-01T12:20:23.391Z"
    },
    "characterPrompt": "Người quảng cáo, hài hước, năng động, truyền cảm hứng"
  }'

# ============================================
# STEP 2B: REGENERATE CHARACTER (With existing character)
# ============================================
echo "2️⃣B Step 2B: Regenerate Character with modifications..."
curl -X POST "http://localhost:3000/api/v1/video-script/characters/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "contentId": "content_1748780410282_d632w5hcq",
      "topic": "Quảng cáo AI ToolCheap",
      "tags": ["AI", "automation", "productivity"],
      "mainMessage": "AI ToolCheap: Giải pháp AI thông minh, hiệu quả với chi phí tối ưu",
      "keyPoints": ["Giá cả phải chăng", "Tăng tốc công việc", "Đa năng", "Dễ sử dụng"],
      "tone": "Chuyên nghiệp nhưng thân thiện",
      "targetAudience": "Cá nhân, freelancer, chủ doanh nghiệp nhỏ",
      "duration": "60s",
      "createdAt": "2025-06-01T12:20:23.391Z"
    },
    "characterPrompt": "Người mù công nghệ, ngoại hình khờ khạo, dễ thương",
    "existingCharacter": {
      "name": "Alex",
      "role": "Presenter",
      "personality": ["Friendly", "Professional"],
      "appearance": "Young professional style"
    }
  }'

# ============================================
# STEP 3: GENERATE DIALOGUE (FE sends contentData + characters)
# ============================================
echo "3️⃣ Step 3: Generate Dialogue..."
curl -X POST "http://localhost:3000/api/v1/video-script/dialogue/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "contentId": "content_1748780410282_d632w5hcq",
      "topic": "Quảng cáo AI ToolCheap",
      "tags": ["AI", "automation", "productivity"],
      "mainMessage": "AI ToolCheap: Giải pháp AI thông minh, hiệu quả với chi phí tối ưu",
      "keyPoints": ["Giá cả phải chăng", "Tăng tốc công việc", "Đa năng", "Dễ sử dụng"],
      "tone": "Chuyên nghiệp nhưng thân thiện",
      "targetAudience": "Cá nhân, freelancer, chủ doanh nghiệp nhỏ",
      "duration": "60s",
      "createdAt": "2025-06-01T12:20:23.391Z"
    },
    "characters": [
      {
        "characterId": "char_001",
        "name": "Alex",
        "role": "Presenter",
        "description": "Dynamic tech presenter",
        "personality": ["Enthusiastic", "Knowledgeable", "Friendly"],
        "appearance": "Modern professional style",
        "voiceStyle": "Clear and confident",
        "customPrompt": "Người quảng cáo hài hước",
        "createdAt": "2025-06-01T12:25:00.000Z"
      }
    ],
    "dialogueCount": 8
  }'

# ============================================
# STEP 3B: GENERATE DIALOGUE WITH CUSTOM COUNT & REGENERATION
# ============================================
echo "3️⃣B Step 3B: Generate Dialogue with specific count and existing dialogue..."
curl -X POST "http://localhost:3000/api/v1/video-script/dialogue/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "contentId": "content_1748780410282_d632w5hcq",
      "topic": "Quảng cáo AI ToolCheap",
      "tags": ["AI", "automation", "productivity"],
      "mainMessage": "AI ToolCheap: Giải pháp AI thông minh, hiệu quả với chi phí tối ưu",
      "keyPoints": ["Giá cả phải chăng", "Tăng tốc công việc", "Đa năng", "Dễ sử dụng"],
      "tone": "Chuyên nghiệp nhưng thân thiện",
      "targetAudience": "Cá nhân, freelancer, chủ doanh nghiệp nhỏ",
      "duration": "60s",
      "createdAt": "2025-06-01T12:20:23.391Z"
    },
    "characters": [
      {
        "characterId": "char_001",
        "name": "Alex",
        "role": "Presenter",
        "description": "Dynamic tech presenter",
        "personality": ["Enthusiastic", "Knowledgeable", "Friendly"],
        "appearance": "Modern professional style",
        "voiceStyle": "Clear and confident",
        "customPrompt": "Người quảng cáo hài hước",
        "createdAt": "2025-06-01T12:25:00.000Z"
      }
    ],
    "dialogueCount": 6,
    "existingDialogue": [
      {
        "timestamp": "0-10s",
        "characterId": "char_001",
        "characterName": "Alex",
        "dialogue": "Chào bạn! Bạn có bao giờ cảm thấy việc sử dụng AI quá đắt đỏ?",
        "emotion": "friendly",
        "action": "Looking at camera, smiling",
        "visualCue": "Problem visualization"
      }
    ]
  }'

# ============================================
# STEP 4: GENERATE FINAL SCRIPT (FE sends everything)
# ============================================
echo "4️⃣ Step 4: Generate Final Script..."
curl -X POST "http://localhost:3000/api/v1/video-script/final/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "contentId": "content_1748780410282_d632w5hcq",
      "topic": "Quảng cáo AI ToolCheap",
      "tags": ["AI", "automation", "productivity"],
      "mainMessage": "AI ToolCheap: Giải pháp AI thông minh, hiệu quả với chi phí tối ưu",
      "keyPoints": ["Giá cả phải chăng", "Tăng tốc công việc", "Đa năng", "Dễ sử dụng"],
      "tone": "Chuyên nghiệp nhưng thân thiện",
      "targetAudience": "Cá nhân, freelancer, chủ doanh nghiệp nhỏ",
      "duration": "60s",
      "createdAt": "2025-06-01T12:20:23.391Z"
    },
    "characters": [
      {
        "characterId": "char_001",
        "name": "Alex",
        "role": "Presenter",
        "description": "Dynamic tech presenter",
        "personality": ["Enthusiastic", "Knowledgeable", "Friendly"],
        "appearance": "Modern professional style",
        "voiceStyle": "Clear and confident",
        "customPrompt": "Người quảng cáo hài hước",
        "createdAt": "2025-06-01T12:25:00.000Z"
      }
    ],
    "dialogue": [
      {
        "timestamp": "0-10s",
        "characterId": "char_001",
        "characterName": "Alex",
        "dialogue": "Chào bạn! Bạn có bao giờ cảm thấy việc sử dụng AI quá đắt đỏ?",
        "emotion": "friendly",
        "action": "Looking at camera, smiling",
        "visualCue": "Problem visualization"
      },
      {
        "timestamp": "10-50s",
        "characterId": "char_001",
        "characterName": "Alex",
        "dialogue": "AI ToolCheap sẽ thay đổi hoàn toàn suy nghĩ của bạn!",
        "emotion": "excited",
        "action": "Gesturing enthusiastically",
        "visualCue": "Product demo"
      },
      {
        "timestamp": "50-60s",
        "characterId": "char_001",
        "characterName": "Alex",
        "dialogue": "Hãy thử ngay hôm nay và cảm nhận sự khác biệt!",
        "emotion": "confident",
        "action": "Pointing to CTA",
        "visualCue": "Call to action button"
      }
    ]
  }'

# ============================================
# WORKFLOW SUMMARY
# ============================================
echo "📋 WORKFLOW SUMMARY:"
echo "1. FE calls Step 1 → Gets contentData"
echo "2. FE stores contentData, calls Step 2 with contentData → Gets character"
echo "3. FE stores characters[], calls Step 3 with contentData + characters → Gets dialogue"
echo "4. FE stores dialogue[], calls Step 4 with all data → Gets final script"
echo ""
echo "✅ Benefits:"
echo "- No server memory needed"
echo "- FE controls all data"
echo "- Easy to regenerate any step"
echo "- Can modify existing data"
echo "- Stateless and scalable"