import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ConversationRepository } from '../repositories/ConversationRepository';
import { GeminiService } from '../services/GeminiService';
import { ScriptFormatter } from '../utils/Logger';

@injectable()
export class ScriptController {
  constructor(
    @inject(ConversationRepository) private conversationRepo: ConversationRepository,
    @inject(GeminiService) private geminiService: GeminiService
  ) {}

  // POST /api/scripts/topic - Bước 1: Nhập chủ đề
  async createFromTopic(req: Request, res: Response): Promise<void> {
    try {
      const { topic, scriptId } = req.body;

      if (!topic) {
        res.status(400).json({ error: 'Topic is required' });
        return;
      }

      const conversationId = scriptId || `script_${topic.replace(/\s+/g, '_').toLowerCase()}_ai_tool_cheap`;

      const prompt = `Chủ đề: "${topic}"

Hãy phân tích chủ đề này và đề xuất`;

      const jsonSuffix = `Format JSON với structure:
{
  "topic": "${topic}",
  "summary": "tóm tắt nội dung chính",
  "genre": "thể loại phù hợp",
  "suggestedDuration": "độ dài đề xuất",
  "tone": "tone và phong cách",
  "objective": "mục tiêu của video",
  "keyPoints": ["điểm chính 1", "điểm chính 2"]
}`;

      let conversation = this.conversationRepo.findById(conversationId);
      if (!conversation) {
        conversation = this.conversationRepo.create(conversationId, `Script: ${topic}`);
      }

      conversation.addMessage('user', prompt);
      const aiResponse = await this.geminiService.generateJSONResponse(conversation.messages, jsonSuffix);
      conversation.addMessage('assistant', JSON.stringify(aiResponse));
      this.conversationRepo.save(conversation);

      res.json({
        step: 1,
        stepName: "Topic Analysis",
        scriptId: conversationId,
        topic: topic,
        analysis: aiResponse,
        textResponse: ScriptFormatter.formatToText({ analysis: aiResponse }),
        nextStep: "Create Characters"
      });
    } catch (error) {
      console.error('Create topic error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/scripts/characters - Bước 2: Tạo nhân vật
  async createCharacters(req: Request, res: Response): Promise<void> {
    try {
      const { scriptId, characterCount = 2, customCharacters } = req.body;

      if (!scriptId) {
        res.status(400).json({ error: 'Script ID is required' });
        return;
      }

      const conversation = this.conversationRepo.findById(scriptId);
      if (!conversation) {
        res.status(404).json({ error: 'Script not found' });
        return;
      }

      let prompt: string;
      let jsonSuffix: string;

      // Nếu người dùng cung cấp nhân vật tùy chỉnh
      if (customCharacters && Array.isArray(customCharacters) && customCharacters.length > 0) {
        const charactersJson = JSON.stringify(customCharacters, null, 2);
        prompt = `Người dùng đã cung cấp ${customCharacters.length} nhân vật tùy chỉnh:

${charactersJson}

Hãy phân tích và hoàn thiện các nhân vật này dựa trên chủ đề đã định.`;

        jsonSuffix = `Format JSON:
{
  "characters": [
    {
      "name": "tên nhân vật",
      "age": số tuổi,
      "personality": ["trait1", "trait2", "trait3"],
      "role": "vai trò trong câu chuyện",
      "relationship": "mối quan hệ với nhân vật khác",
      "appearance": "đặc điểm ngoại hình",
      "speakingStyle": "cách nói chuyện đặc trưng",
      "strengths": ["điểm mạnh 1", "điểm mạnh 2"],
      "weaknesses": ["điểm yếu 1", "điểm yếu 2"]
    }
  ]
}`;
      } else {
        prompt = `Dựa trên chủ đề và phân tích ở trên, hãy tạo ${characterCount} nhân vật cho video`;

        jsonSuffix = `Format JSON:
{
  "characters": [
    {
      "name": "tên nhân vật",
      "age": số tuổi,
      "personality": ["trait1", "trait2", "trait3"],
      "role": "vai trò trong câu chuyện",
      "relationship": "mối quan hệ với nhân vật khác",
      "appearance": "đặc điểm ngoại hình",
      "speakingStyle": "cách nói chuyện đặc trưng",
      "strengths": ["điểm mạnh 1", "điểm mạnh 2"],
      "weaknesses": ["điểm yếu 1", "điểm yếu 2"]
    }
  ]
}`;
      }

      conversation.addMessage('user', prompt);
      const aiResponse = await this.geminiService.generateJSONResponse(conversation.messages, jsonSuffix);
      conversation.addMessage('assistant', JSON.stringify(aiResponse));
      this.conversationRepo.save(conversation);

      res.json({
        step: 2,
        stepName: "Character Creation",
        scriptId: scriptId,
        characters: aiResponse,
        textResponse: ScriptFormatter.formatToText(aiResponse),
        isCustom: !!customCharacters,
        characterCount: customCharacters ? customCharacters.length : characterCount,
        nextStep: "Create Dialogue"
      });
    } catch (error) {
      console.error('Create characters error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/scripts/dialogue - Bước 3: Tạo hội thoại
  async createDialogue(req: Request, res: Response): Promise<void> {
    try {
      const { scriptId, sceneCount = 3, customDialogue, dialogueGuidelines } = req.body;

      if (!scriptId) {
        res.status(400).json({ error: 'Script ID is required' });
        return;
      }

      const conversation = this.conversationRepo.findById(scriptId);
      if (!conversation) {
        res.status(404).json({ error: 'Script not found' });
        return;
      }

      let prompt: string;
      let jsonSuffix: string;

      // Nếu người dùng cung cấp hội thoại tùy chỉnh
      if (customDialogue && Array.isArray(customDialogue) && customDialogue.length > 0) {
        const dialogueJson = JSON.stringify(customDialogue, null, 2);
        prompt = `Người dùng đã cung cấp ${customDialogue.length} scene hội thoại tùy chỉnh:

${dialogueJson}

Hãy hoàn thiện và cải thiện các scene này dựa trên nhân vật đã tạo`;

        jsonSuffix = `Format JSON:
{
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "tiêu đề scene",
      "setting": "địa điểm chi tiết",
      "characters": ["tên nhân vật 1", "tên nhân vật 2"],
      "dialogue": [
        {
          "character": "tên nhân vật",
          "text": "nội dung thoại",
          "emotion": "cảm xúc",
          "action": "hành động"
        }
      ],
      "estimatedDuration": "thời lượng (giây)",
      "notes": "ghi chú đạo diễn"
    }
  ]
}`;
      } else {
        let additionalGuidelines = '';
        if (dialogueGuidelines && typeof dialogueGuidelines === 'string') {
          additionalGuidelines = `\n\nYêu cầu đặc biệt: ${dialogueGuidelines}`;
        }

        prompt = `Dựa trên chủ đề và các nhân vật đã tạo, hãy viết ${sceneCount} scene hội thoại${additionalGuidelines}`;

        jsonSuffix = `Format JSON:
{
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "tiêu đề scene",
      "setting": "địa điểm chi tiết",
      "characters": ["tên nhân vật 1", "tên nhân vật 2"],
      "dialogue": [
        {
          "character": "tên nhân vật",
          "text": "nội dung thoại",
          "emotion": "cảm xúc",
          "action": "hành động"
        }
      ],
      "estimatedDuration": "thời lượng (giây)",
      "notes": "ghi chú tone và không khí"
    }
  ]
}`;
      }

      conversation.addMessage('user', prompt);
      const aiResponse = await this.geminiService.generateJSONResponse(conversation.messages, jsonSuffix);
      conversation.addMessage('assistant', JSON.stringify(aiResponse));
      this.conversationRepo.save(conversation);

      res.json({
        step: 3,
        stepName: "Dialogue Creation",
        scriptId: scriptId,
        dialogue: aiResponse,
        textResponse: ScriptFormatter.formatToText(aiResponse),
        isCustom: !!customDialogue,
        sceneCount: customDialogue ? customDialogue.length : sceneCount,
        hasGuidelines: !!dialogueGuidelines,
        nextStep: "Create Video Script"
      });
    } catch (error) {
      console.error('Create dialogue error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/scripts/video - Bước 4: Tạo kịch bản video
  async createVideoScript(req: Request, res: Response): Promise<void> {
    try {
      const { scriptId } = req.body;

      if (!scriptId) {
        res.status(400).json({ error: 'Script ID is required' });
        return;
      }

      const conversation = this.conversationRepo.findById(scriptId);
      if (!conversation) {
        res.status(404).json({ error: 'Script not found' });
        return;
      }

      const prompt = `Bây giờ hãy tạo kịch bản video hoàn chỉnh để quay phim dựa trên các thông tin trên`;

      const jsonSuffix = `Format JSON:
{
  "videoInfo": {
    "title": "tiêu đề video",
    "totalDuration": "thời lượng tổng",
    "genre": "thể loại",
    "tone": "tone chung",
    "objective": "mục tiêu video"
  },
  "characters": [
    {
      "name": "tên nhân vật",
      "costume": "trang phục",
      "styling": "kiểu dáng",
      "actingNotes": "hướng dẫn diễn xuất"
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "tiêu đề scene",
      "location": "địa điểm quay cụ thể",
      "cameraSetup": "setup camera và góc quay",
      "lighting": "ánh sáng và setup",
      "props": ["đạo cụ 1", "đạo cụ 2"],
      "dialogue": [
        {
          "character": "tên nhân vật",
          "text": "nội dung thoại",
          "timing": "thời gian (giây)",
          "actingDirection": "hướng dẫn diễn xuất"
        }
      ],
      "soundEffects": "hiệu ứng âm thanh",
      "backgroundMusic": "nhạc nền",
      "transition": "chuyển cảnh"
    }
  ],
  "production": {
    "equipment": ["thiết bị 1", "thiết bị 2"],
    "estimatedFilmingTime": "thời gian quay ước tính",
    "specialNotes": ["lưu ý 1", "lưu ý 2"],
    "budget": "ước tính ngân sách"
  }
}`;

      conversation.addMessage('user', prompt);
      const aiResponse = await this.geminiService.generateJSONResponse(conversation.messages, jsonSuffix);
      conversation.addMessage('assistant', JSON.stringify(aiResponse));
      this.conversationRepo.save(conversation);

      res.json({
        step: 4,
        stepName: "Video Script Complete",
        scriptId: scriptId,
        videoScript: aiResponse,
        textResponse: ScriptFormatter.formatToText(aiResponse),
        completed: true,
        message: "Kịch bản video đã hoàn thành! Có thể dùng để quay phim."
      });
    } catch (error) {
      console.error('Create video script error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/scripts/auto - API tự động tạo kịch bản hoàn chỉnh
  async createAutoScript(req: Request, res: Response): Promise<void> {
    try {
      const { 
        topic, 
        characterCount = 2, 
        sceneCount = 3, 
        dialoguePerScene = 10,
        duration = "2-3 phút",
        context = "Hiện đại, văn phòng/quán cafe/nhà riêng",
        scriptId 
      } = req.body;

      if (!topic) {
        res.status(400).json({ error: 'Topic is required' });
        return;
      }

      const conversationId = scriptId || `auto_script_${topic.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}_ai_tool_cheap`;

      // Tự động điều chỉnh số lượng dialogue nếu quá ít
      const minDialoguePerScene = 8;
      const adjustedDialoguePerScene = Math.max(dialoguePerScene, minDialoguePerScene);
      
      // Tự động điều chỉnh số scene nếu cần thiết cho chủ đề
      const minScenes = 2;
      const adjustedSceneCount = Math.max(sceneCount, minScenes);

      // Bước 1: Phân tích chủ đề và tạo kịch bản
      const topicPrompt = `Chủ đề: "${topic}"

YÊU CẦU TẠO KỊCH BẢN:
- Phân tích chủ đề "${topic}" một cách sâu sắc và sáng tạo
- Tạo ${characterCount} nhân vật phù hợp và độc đáo cho chủ đề này
- Tạo ${adjustedSceneCount} scene với nội dung phong phú, mỗi scene tối thiểu ${adjustedDialoguePerScene} câu thoại
- Thời lượng video: ${duration}
- Bối cảnh tham khảo: ${context} (có thể điều chỉnh cho phù hợp với chủ đề)

HƯỚNG DẪN SÁNG TẠO:
1. Đảm bảo kịch bản khớp hoàn toàn với chủ đề "${topic}"
2. Tự do sáng tạo bối cảnh, nhân vật, tình huống phù hợp nhất với chủ đề
3. Không bị giới hạn bởi bối cảnh đề xuất nếu chủ đề yêu cầu setting khác
4. Tạo nội dung hấp dẫn, có chiều sâu và ý nghĩa
5. Đảm bảo mỗi scene có đủ nội dung để phát triển câu chuyện
6. Dialogue phải tự nhiên, phù hợp với tính cách nhân vật và phục vụ chủ đề

Hãy tạo kịch bản video hoàn chỉnh và chất lượng cao!`;

      const autoScriptSuffix = `Format JSON hoàn chỉnh:
{
  "videoInfo": {
    "title": "tiêu đề video hấp dẫn và khớp với chủ đề ${topic}",
    "totalDuration": "${duration}",
    "genre": "thể loại phù hợp nhất với chủ đề ${topic}",
    "tone": "tone phù hợp với chủ đề",
    "objective": "mục tiêu rõ ràng của video về chủ đề ${topic}",
    "context": "bối cảnh tối ưu cho chủ đề ${topic}"
  },
  "topicAnalysis": {
    "summary": "phân tích sâu sắc về chủ đề ${topic}",
    "keyPoints": ["điểm chính 1 về ${topic}", "điểm chính 2 về ${topic}", "điểm chính 3 về ${topic}"],
    "contextFit": "giải thích tại sao bối cảnh được chọn phù hợp nhất với ${topic}",
    "creativeApproach": "cách tiếp cận sáng tạo cho chủ đề ${topic}"
  },
  "characters": [
    {
      "name": "tên nhân vật phù hợp với chủ đề",
      "age": "tuổi phù hợp",
      "personality": ["trait1", "trait2", "trait3"],
      "role": "vai trò quan trọng trong việc thể hiện chủ đề ${topic}",
      "relationship": "mối quan hệ với nhân vật khác",
      "appearance": "ngoại hình phù hợp với bối cảnh",
      "speakingStyle": "cách nói chuyện đặc trưng",
      "costume": "trang phục phù hợp với bối cảnh tối ưu",
      "actingNotes": "hướng dẫn diễn xuất chi tiết",
      "motivation": "động lực và mục tiêu của nhân vật liên quan đến chủ đề"
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "tiêu đề scene liên quan chặt chẽ đến chủ đề ${topic}",
      "setting": "địa điểm chi tiết phù hợp nhất với chủ đề",
      "location": "địa điểm quay cụ thể",
      "cameraSetup": "setup camera chuyên nghiệp",
      "lighting": "ánh sáng tạo mood phù hợp",
      "props": ["đạo cụ 1", "đạo cụ 2", "đạo cụ 3"],
      "characters": ["nhân vật 1", "nhân vật 2"],
      "dialogue": [
        {
          "character": "tên nhân vật",
          "text": "nội dung thoại có ý nghĩa và phục vụ chủ đề",
          "emotion": "cảm xúc cụ thể",
          "action": "hành động đi kèm",
          "timing": "thời gian (giây)",
          "actingDirection": "hướng dẫn diễn xuất chi tiết",
          "subtext": "ý nghĩa ngầm của câu thoại"
        }
      ],
      "estimatedDuration": "thời lượng scene (tối thiểu 30-45 giây)",
      "soundEffects": "hiệu ứng âm thanh phù hợp",
      "backgroundMusic": "nhạc nền tạo không khí",
      "transition": "chuyển cảnh mượt mà",
      "notes": "ghi chú đạo diễn quan trọng",
      "themeConnection": "mối liên hệ scene với chủ đề ${topic}"
    }
  ],
  "production": {
    "equipment": ["camera chuyên nghiệp", "micro", "đèn chiếu sáng", "tripod"],
    "estimatedFilmingTime": "thời gian quay thực tế",
    "specialNotes": ["lưu ý kỹ thuật", "lưu ý diễn xuất", "lưu ý an toàn"],
    "budget": "ước tính ngân sách chi tiết",
    "locationRequirements": "yêu cầu địa điểm cụ thể",
    "postProduction": "yêu cầu hậu kỳ"
  },
  "qualityAssurance": {
    "themeConsistency": "đảm bảo nhất quán với chủ đề ${topic}",
    "dialogueQuality": "chất lượng hội thoại và tính tự nhiên",
    "technicalFeasibility": "tính khả thi về mặt kỹ thuật",
    "audienceAppeal": "sức hấp dẫn với khán giả"
  }
}

LưU Ý QUAN TRỌNG:
- Mỗi scene PHẢI có tối thiểu ${adjustedDialoguePerScene} câu thoại chất lượng
- Dialogue phải tự nhiên, có chiều sâu và phục vụ chủ đề
- Nếu ${adjustedDialoguePerScene} câu không đủ để phát triển scene, hãy tăng lên số lượng phù hợp
- Đảm bảo tính liên kết giữa các scene và sự phát triển của câu chuyện
- Ưu tiên chất lượng nội dung hơn việc tuân thủ strict số lượng user đề xuất`;

      let conversation = this.conversationRepo.findById(conversationId);
      if (!conversation) {
        conversation = this.conversationRepo.create(conversationId, `Auto Script: ${topic}`);
      }

      conversation.addMessage('user', topicPrompt);
      const aiResponse = await this.geminiService.generateJSONResponse(conversation.messages, autoScriptSuffix);
      conversation.addMessage('assistant', JSON.stringify(aiResponse));
      this.conversationRepo.save(conversation);

      res.json({
        success: true,
        message: "Kịch bản video hoàn chỉnh đã được tạo tự động!",
        scriptId: conversationId,
        topic: topic,
        parameters: {
          characterCount,
          sceneCount: adjustedSceneCount,
          dialoguePerScene: adjustedDialoguePerScene,
          originalDialoguePerScene: dialoguePerScene,
          duration,
          context,
          autoAdjustments: {
            dialogueIncreased: adjustedDialoguePerScene > dialoguePerScene,
            sceneIncreased: adjustedSceneCount > sceneCount
          }
        },
        script: aiResponse,
        textResponse: ScriptFormatter.formatToText(aiResponse),
        generatedAt: new Date().toISOString(),
        note: "Kịch bản đã sẵn sàng để quay phim! Được tối ưu hóa cho chủ đề và chất lượng nội dung."
      });
    } catch (error) {
      console.error('Auto create script error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/scripts/:id - Xem script hoàn chỉnh
  async getScript(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const conversation = this.conversationRepo.findById(id);

      if (!conversation) {
        res.status(404).json({ error: 'Script not found' });
        return;
      }

      res.json({
        script: conversation.toJSON(),
        totalMessages: conversation.messages.length,
        steps: Math.floor(conversation.messages.length / 2), // Mỗi step có 1 user + 1 assistant message
      });
    } catch (error) {
      console.error('Get script error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}