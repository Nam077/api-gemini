# Custom Prompts Examples 🎭

## Character Generation với Custom Prompts

### 1. Tự động tạo character (không cần prompt)
```bash
curl -X POST http://localhost:3000/api/v1/video-script/characters/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "topic": "Học lập trình JavaScript",
      "mainMessage": "JavaScript dễ học hơn bạn nghĩ",
      "keyPoints": ["Syntax đơn giản", "Ứng dụng thực tế", "Cộng đồng hỗ trợ"],
      "tone": "friendly",
      "duration": "60s"
    }
  }'
```

### 2. Custom character prompt - Nhân vật cụ thể
```bash
curl -X POST http://localhost:3000/api/v1/video-script/characters/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "topic": "Học lập trình JavaScript",
      "mainMessage": "JavaScript dễ học hơn bạn nghĩ",
      "keyPoints": ["Syntax đơn giản", "Ứng dụng thực tế", "Cộng đồng hỗ trợ"],
      "tone": "friendly", 
      "duration": "60s"
    },
    "characterPrompt": "Tạo nhân vật là một cô gái trẻ 25 tuổi, developer kinh nghiệm 3 năm, tính cách hướng ngoại, thích chia sẻ kiến thức. Tên là Minh Anh, có background thiết kế web."
  }'
```

### 3. Custom character prompt - Phong cách đặc biệt
```bash
curl -X POST http://localhost:3000/api/v1/video-script/characters/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "topic": "Marketing Digital",
      "mainMessage": "Bán hàng online hiệu quả",
      "tone": "professional"
    },
    "characterPrompt": "Tạo nhân vật kiểu anime/manga style. Là một mentor giàu kinh nghiệm, tuổi 30-35, phong cách lịch lãm như sensei. Có câu nói đặc trưng và cách nói chuyện inspiring."
  }'
```

## Dialogue Generation với Custom Prompts

### 1. Tự động tạo dialogue (không cần prompt)
```bash
curl -X POST http://localhost:3000/api/v1/video-script/dialogue/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "topic": "Học lập trình JavaScript",
      "mainMessage": "JavaScript dễ học hơn bạn nghĩ",
      "keyPoints": ["Syntax đơn giản", "Ứng dụng thực tế"],
      "tone": "friendly",
      "duration": "60s"
    },
    "characters": [
      {
        "id": "char_001",
        "name": "Minh Anh",
        "role": "Developer",
        "personality": "Hướng ngoại, thích chia sẻ"
      }
    ]
  }'
```

### 2. Custom dialogue prompt - Yêu cầu format cụ thể
```bash
curl -X POST http://localhost:3000/api/v1/video-script/dialogue/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "topic": "Học lập trình JavaScript", 
      "mainMessage": "JavaScript dễ học hơn bạn nghĩ",
      "tone": "friendly",
      "duration": "60s"
    },
    "characters": [
      {
        "id": "char_001",
        "name": "Minh Anh",
        "role": "Developer"
      }
    ],
    "dialoguePrompt": "Tạo dialogue theo format storytelling. Bắt đầu bằng một câu chuyện cá nhân, sau đó dẫn dắt vào nội dung chính. Sử dụng nhiều câu hỏi rhetorical để tương tác với viewer.",
    "dialogueCount": 6
  }'
```

### 3. Custom dialogue prompt - Phong cách đặc biệt
```bash
curl -X POST http://localhost:3000/api/v1/video-script/dialogue/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "topic": "Kinh doanh online",
      "mainMessage": "Khởi nghiệp từ con số 0"
    },
    "characters": [
      {
        "id": "char_001", 
        "name": "CEO Tuấn",
        "role": "Entrepreneur"
      }
    ],
    "dialoguePrompt": "Tạo dialogue kiểu TED Talk, có cấu trúc 3 phần: Hook (câu mở đầu hấp dẫn), Body (chia sẻ 3 insight chính), Close (call-to-action mạnh mẽ). Sử dụng nhiều metaphor và personal anecdotes.",
    "dialogueCount": 8
  }'
```

### 4. Dialogue prompt với emotion cụ thể
```bash
curl -X POST http://localhost:3000/api/v1/video-script/dialogue/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "topic": "Vượt qua khó khăn",
      "mainMessage": "Biến thử thách thành cơ hội"
    },
    "characters": [
      {
        "id": "char_001",
        "name": "Lan",
        "role": "Life Coach"
      }
    ],
    "dialoguePrompt": "Tạo dialogue với emotional journey từ vulnerability → empowerment. Bắt đầu bằng việc acknowledge pain/struggle, sau đó gradually build up hope và confidence. Kết thúc với empowering message.",
    "dialogueCount": 7
  }'
```

## Kết hợp Character + Dialogue Prompts

### Full workflow với custom prompts
```bash
# Step 1: Generate content
curl -X POST http://localhost:3000/api/v1/video-script/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Đầu tư chứng khoán cho người mới",
    "duration": "90s"
  }'

# Step 2: Generate character với custom prompt
curl -X POST http://localhost:3000/api/v1/video-script/characters/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": { /* content từ step 1 */ },
    "characterPrompt": "Tạo nhân vật là financial advisor 28 tuổi, background finance + tech. Tính cách calm but confident, có khả năng explain phức tạp thành đơn giản. Tên Alex, từng làm ở startup fintech."
  }'

# Step 3: Generate dialogue với custom prompt  
curl -X POST http://localhost:3000/api/v1/video-script/dialogue/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": { /* content từ step 1 */ },
    "characters": [ /* characters từ step 2 */ ],
    "dialoguePrompt": "Tạo dialogue kiểu educational but engaging. Sử dụng 80/20 rule: 80% practical advice, 20% motivational. Include specific numbers và examples. Avoid jargon, explain mọi thứ như đang nói với bạn thân.",
    "dialogueCount": 9
  }'
```

## Tips sử dụng Custom Prompts hiệu quả

### ✅ Character Prompts tốt:
- Cụ thể về age, background, personality
- Mention specific traits và speaking style
- Include context/expertise relevant đến topic

### ✅ Dialogue Prompts tốt:
- Specify structure/format mong muốn
- Mention emotional tone journey
- Include specific requirements (questions, examples, etc.)
- Reference known styles (TED Talk, storytelling, etc.)

### ❌ Tránh:
- Prompts quá vague: "tạo nhân vật hay"
- Conflicting requirements với topic/tone
- Quá dài hoặc quá nhiều yêu cầu phức tạp

## Advanced Examples

### Multi-character với different prompts
```bash
# Character 1: Expert
{
  "characterPrompt": "Tạo expert 35 tuổi, authoritative nhưng approachable"
}

# Character 2: Newbie (for dialogue)
{
  "dialoguePrompt": "Tạo conversation giữa expert và newbie. Expert giải thích, newbie ask smart questions. Format Q&A natural."
}
```

### Genre-specific prompts
```bash
# Comedy style
{
  "dialoguePrompt": "Tạo dialogue hài hước, sử dụng wordplay và situation comedy. Keep educational value nhưng entertaining."
}

# Drama style  
{
  "dialoguePrompt": "Tạo dialogue dramatic, build tension rồi resolve. Emotional peaks và valleys."
}

# Documentary style
{
  "dialoguePrompt": "Tạo dialogue kiểu documentary narrator, objective tone, fact-heavy, authoritative."
}
```

Happy scripting! 🎬✨