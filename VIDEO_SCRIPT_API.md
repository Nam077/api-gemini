# Video Script Generation API

## Overview

The Video Script Generation API provides a 4-step stateless process to create comprehensive video scripts using AI. Each step builds upon the previous one to generate professional video content with characters, dialogue, and ready-to-use prompts for AI video generation tools.

## Base URL
```
POST /api/v1/video-script
```

## Authentication
Requires valid API key in environment variables (`GEMINI_API_KEY`).

## API Workflow

The API follows a 4-step process:
1. **Generate Content Strategy** - Define topic, tone, and key messages
2. **Generate Characters** - Create characters that fit the content
3. **Generate Dialogue** - Create scripted dialogue between characters
4. **Generate Final Script** - Compile everything into a comprehensive video prompt

---

## Step 1: Generate Content Strategy

### Endpoint
```
POST /api/v1/video-script/content/generate
```

### Description
Creates the foundational content strategy for your video including main message, key points, tone, and target audience.

### Request Body
```json
{
  "topic": "string (required)", // Video topic
  "tags": ["string"], // Optional tags for context
  "duration": "string", // e.g., "60s", "2min" (default: "60s")
  "existingContent": { // Optional: existing content to improve
    "mainMessage": "string",
    "keyPoints": ["string"],
    "tone": "string"
  }
}
```

### Response
```json
{
  "success": true,
  "data": {
    "contentId": "content_1717171200000_abc123def",
    "topic": "AI Marketing Tools",
    "tags": ["AI", "Marketing"],
    "mainMessage": "Discover how AI can transform your marketing strategy",
    "keyPoints": [
      "Automated content creation",
      "Data-driven insights",
      "Cost efficiency"
    ],
    "tone": "professional",
    "targetAudience": "Small business owners",
    "duration": "60s",
    "createdAt": "2025-06-01T10:00:00.000Z"
  },
  "meta": {
    "step": 1,
    "nextStep": "Create characters"
  }
}
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/v1/video-script/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI Marketing Tools for Small Business",
    "tags": ["AI", "marketing", "automation"],
    "duration": "90s"
  }'
```

---

## Step 2: Generate Characters

### Endpoint
```
POST /api/v1/video-script/characters/generate
```

### Description
Creates characters that fit your content strategy. Can generate new characters or improve existing ones.

### Request Body
```json
{
  "contentData": { // Required: Complete content data from Step 1
    "contentId": "string",
    "topic": "string",
    "tags": ["string"],
    "mainMessage": "string",
    "keyPoints": ["string"],
    "tone": "string",
    "targetAudience": "string",
    "duration": "string",
    "createdAt": "date"
  },
  "characterPrompt": "string", // Optional: Custom character requirements
  "existingCharacter": { // Optional: Character to improve
    "name": "string",
    "role": "string",
    "personality": ["string"],
    "appearance": "string"
  },
  "existingCharacters": [{ // Optional: Existing characters for harmony
    "characterId": "string",
    "name": "string",
    "role": "string",
    "description": "string",
    "personality": ["string"],
    "appearance": "string",
    "voiceStyle": "string"
  }]
}
```

### Response
```json
{
  "success": true,
  "data": {
    "characterId": "char_1717171200000_xyz789",
    "name": "Sarah Chen",
    "role": "Marketing Expert",
    "description": "Experienced digital marketing consultant specializing in AI tools",
    "personality": ["Professional", "Enthusiastic", "Knowledgeable"],
    "appearance": "Mid-30s professional woman, modern business attire",
    "voiceStyle": "Clear, confident, and approachable",
    "customPrompt": "Create a tech-savvy female presenter",
    "createdAt": "2025-06-01T10:05:00.000Z"
  },
  "meta": {
    "step": 2,
    "nextStep": "Generate dialogue"
  }
}
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/v1/video-script/characters/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "contentId": "content_1717171200000_abc123def",
      "topic": "AI Marketing Tools",
      "tone": "professional",
      "targetAudience": "Small business owners",
      "duration": "90s"
    },
    "characterPrompt": "Create a friendly female tech expert in her 30s"
  }'
```

---

## Step 3: Generate Dialogue

### Endpoint
```
POST /api/v1/video-script/dialogue/generate
```

### Description
Creates scripted dialogue for your characters with precise timing, emotions, and visual cues.

### Request Body
```json
{
  "contentData": { // Required: Complete content data from Step 1
    // Same structure as Step 2
  },
  "characters": [{ // Required: Array of characters from Step 2
    "characterId": "string",
    "name": "string",
    "role": "string",
    "description": "string",
    "personality": ["string"],
    "appearance": "string",
    "voiceStyle": "string"
  }],
  "dialoguePrompt": "string", // Optional: Custom dialogue requirements
  "dialogueCount": 5, // Optional: Number of dialogue segments (1-20)
  "existingDialogue": [{ // Optional: Existing dialogue to improve
    "timestamp": "string",
    "characterId": "string",
    "characterName": "string",
    "dialogue": "string",
    "emotion": "string",
    "action": "string"
  }]
}
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "0-15s",
      "characterId": "char_1717171200000_xyz789",
      "characterName": "Sarah Chen",
      "dialogue": "Xin chào! Bạn có biết AI có thể tăng hiệu quả marketing lên 300%?",
      "emotion": "enthusiastic",
      "action": "Nhìn camera với nụ cười tự tin",
      "visualCue": "Logo công ty xuất hiện ở góc màn hình"
    },
    {
      "timestamp": "15-30s",
      "characterId": "char_1717171200000_xyz789",
      "characterName": "Sarah Chen",
      "dialogue": "Với công cụ AI marketing, bạn có thể tự động hóa content, phân tích khách hàng và tối ưu ROI",
      "emotion": "confident",
      "action": "Giải thích bằng cử chỉ tay",
      "visualCue": "Hiển thị dashboard analytics"
    }
  ],
  "meta": {
    "step": 3,
    "nextStep": "Generate final script"
  }
}
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/v1/video-script/dialogue/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": { /* content from step 1 */ },
    "characters": [{ /* characters from step 2 */ }],
    "dialoguePrompt": "Make it more conversational and include specific examples",
    "dialogueCount": 6
  }'
```

---

## Step 4: Generate Final Script

### Endpoint
```
POST /api/v1/video-script/final/generate
```

### Description
Compiles all previous steps into a comprehensive final script with a detailed English prompt ready for AI video generation tools (Runway ML, Pika Labs, Sora, etc.).

### Request Body
```json
{
  "contentData": { // Required: Complete content data from Step 1
    // Same structure as previous steps
  },
  "characters": [{ // Required: Characters array from Step 2
    // Same structure as Step 3
  }],
  "dialogue": [{ // Required: Dialogue array from Step 3
    "timestamp": "string",
    "characterId": "string",
    "characterName": "string",
    "dialogue": "string",
    "emotion": "string",
    "action": "string",
    "visualCue": "string"
  }]
}
```

### Response
```json
{
  "success": true,
  "data": {
    "scriptId": "script_1717171200000_final123",
    "characters": [{ /* Complete character data */ }],
    "dialogue": [{ /* Complete dialogue data */ }],
    "prompt": "Create a 90-second promotional video about AI Marketing Tools featuring Sarah Chen, a professional marketing expert in her mid-30s wearing modern business attire. The video should have a clean, modern office setting with soft professional lighting...",
    "metadata": {
      "title": "Video Script: AI Marketing Tools",
      "duration": "90s",
      "charactersCount": 1,
      "createdAt": "2025-06-01T10:15:00.000Z"
    }
  },
  "meta": {
    "step": 4,
    "nextStep": "Complete - Ready for video generation!"
  }
}
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/v1/video-script/final/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": { /* from step 1 */ },
    "characters": [{ /* from step 2 */ }],
    "dialogue": [{ /* from step 3 */ }]
  }'
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

### Common HTTP Status Codes
- `400` - Bad Request (missing required fields)
- `500` - Internal Server Error (AI generation failed)

---

## Complete Workflow Example

### 1. Generate Content
```bash
# Step 1: Create content strategy
CONTENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/video-script/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Revolutionary Fitness App",
    "tags": ["fitness", "health", "mobile app"],
    "duration": "60s"
  }')

echo $CONTENT_RESPONSE
```

### 2. Generate Character
```bash
# Step 2: Create character (use contentData from step 1)
CHARACTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/video-script/characters/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": '$(echo $CONTENT_RESPONSE | jq .data)',
    "characterPrompt": "Create an energetic fitness trainer character"
  }')

echo $CHARACTER_RESPONSE
```

### 3. Generate Dialogue
```bash
# Step 3: Create dialogue (use contentData + characters)
DIALOGUE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/video-script/dialogue/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": '$(echo $CONTENT_RESPONSE | jq .data)',
    "characters": ['$(echo $CHARACTER_RESPONSE | jq .data)'],
    "dialogueCount": 4
  }')

echo $DIALOGUE_RESPONSE
```

### 4. Generate Final Script
```bash
# Step 4: Create final script
FINAL_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/video-script/final/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": '$(echo $CONTENT_RESPONSE | jq .data)',
    "characters": ['$(echo $CHARACTER_RESPONSE | jq .data)'],
    "dialogue": '$(echo $DIALOGUE_RESPONSE | jq .data)'
  }')

echo $FINAL_RESPONSE | jq .data.prompt
```

---

## Features

### ✅ **Stateless Design**
- Each API call is independent
- Frontend manages all data flow
- No server-side session storage

### ✅ **Flexible Content Generation**
- Support for content regeneration and improvement
- Custom prompts for characters and dialogue
- Configurable dialogue count (1-20 segments)

### ✅ **Multi-language Support**
- Vietnamese dialogue generation
- English video generation prompts
- Localized content strategies

### ✅ **AI Video Tool Ready**
- Comprehensive English prompts for Runway ML, Pika Labs, Sora
- Detailed scene descriptions with timing
- Character appearance and behavior specifications

### ✅ **Production Ready**
- Error handling and validation
- Fallback responses for AI failures
- Comprehensive logging and debugging

---

## Best Practices

1. **Always validate responses** before proceeding to next step
2. **Store intermediate results** in frontend for regeneration
3. **Use custom prompts** for specific character/dialogue requirements
4. **Set appropriate dialogue counts** based on video duration
5. **Test the generated video prompts** with your preferred AI video tool

---

## Support

For issues or questions about the Video Script Generation API, please refer to the main project documentation or contact the development team.