import { GoogleGenAI } from '@google/genai';
import { injectable, inject } from 'inversify';
import { ApiKeyService } from './ApiKeyService';
import { TYPES } from '../types/types';

// Types for Video Script Generation
interface ContentData {
  contentId: string;
  topic: string;
  tags: string[];
  mainMessage: string;
  keyPoints: string[];
  tone: string;
  targetAudience: string;
  duration: string;
  language: string;
  createdAt: Date;
}

interface CharacterData {
  characterId: string;
  name: string;
  role: string;
  description: string;
  personality: string[];
  appearance: string;
  voiceStyle: string;
  customPrompt?: string;
  createdAt: Date;
}

interface DialogueSegment {
  timestamp: string;
  characterId: string;
  characterName: string;
  dialogue: string;
  emotion: string;
  action: string;
  visualCue?: string;
}

interface FinalScript {
  scriptId: string;
  characters: CharacterData[];
  dialogue: DialogueSegment[];
  prompt: string;
  metadata: {
    title: string;
    duration: string;
    charactersCount: number;
    createdAt: Date;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    step: number;
    nextStep?: string;
  };
}

// Input types for regeneration
interface RegenerateContentInput {
  topic: string;
  tags?: string[];
  duration?: string;
  language?: string;
  // Optional: existing content to modify
  existingContent?: Partial<ContentData>;
}

interface RegenerateCharacterInput {
  contentData: ContentData;
  characterPrompt?: string; // Custom user prompt for character creation
  language?: string;
  // Optional: existing character to modify
  existingCharacter?: Partial<CharacterData>;
  // Optional: existing characters to create harmony
  existingCharacters?: CharacterData[];
}

interface RegenerateDialogueInput {
  contentData: ContentData;
  characters: CharacterData[];
  dialoguePrompt?: string; // Custom user prompt for dialogue creation
  language?: string;
  // Optional: số lượng câu thoại mong muốn
  dialogueCount?: number;
  // Optional: existing dialogue to modify
  existingDialogues?: DialogueSegment[];
}

interface RegenerateFinalScriptInput {
  contentData: ContentData;
  characters: CharacterData[];
  dialogue: DialogueSegment[];
  language?: string;
}

@injectable()
export class VideoScriptService {
  private apiKeyService: ApiKeyService;

  constructor(@inject(TYPES.ApiKeyService) apiKeyService: ApiKeyService) {
    this.apiKeyService = apiKeyService;
  }

  // Helper method for API calls with retry logic and key rotation
  private async makeApiCallWithRetry(prompt: string, maxRetries: number = 3): Promise<string> {
    let lastError: any = null;
    let attemptedKeys: string[] = [];
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Get next available API key
        const apiKey = this.apiKeyService.getNextApiKey();
        if (!apiKey) {
          throw new Error('No valid API keys available. Please add new API keys.');
        }

        // Skip if we already tried this key in this request
        if (attemptedKeys.includes(apiKey)) {
          continue;
        }
        attemptedKeys.push(apiKey);

        const ai = new GoogleGenAI({ apiKey });
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-05-20",
          contents: prompt
        });
        
        // Reset error count for successful key
        this.apiKeyService.resetKeyError(apiKey);
        
        return result.text || '';
      } catch (error: any) {
        lastError = error;
        
        // Get the current key and mark it as having an error
        const currentKey = attemptedKeys[attemptedKeys.length - 1];
        if (currentKey) {
          this.apiKeyService.markKeyError(currentKey, error);
        }
        
        const isServiceUnavailable = error?.status === 503 || 
                                   error?.message?.includes('503') || 
                                   error?.message?.includes('Service Unavailable') ||
                                   error?.message?.includes('UNAVAILABLE');
        
        const isExpiredKey = error?.status === 400 || 
                           error?.message?.includes('API key expired') ||
                           error?.message?.includes('API_KEY_INVALID');

        // If key is expired, try next key immediately
        if (isExpiredKey) {
          console.log(`API key expired, trying next available key (attempt ${attempt}/${maxRetries})`);
          continue;
        }
        
        // If service is unavailable, wait before retry
        if (isServiceUnavailable && attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`Gemini API unavailable, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // If we've tried all available keys for this request, break
        if (attemptedKeys.length >= this.apiKeyService.getWorkingKeyCount()) {
          break;
        }
      }
    }
    
    // Clean up expired keys after failed attempts
    const removedCount = this.apiKeyService.cleanupExpiredKeys();
    if (removedCount > 0) {
      console.log(`Removed ${removedCount} expired/invalid API keys`);
    }
    
    // Final error handling
    if (lastError?.status === 400 || lastError?.message?.includes('API key expired')) {
      throw new Error(`All API keys are expired or invalid. Please add new valid API keys. Working keys: ${this.apiKeyService.getWorkingKeyCount()}`);
    }
    
    if (lastError?.status === 503) {
      throw new Error(`Gemini API is currently unavailable. Please try again in a few minutes. (Attempted ${maxRetries} times with ${attemptedKeys.length} different keys)`);
    }
    
    throw lastError || new Error('Max retries exceeded with all available API keys');
  }

  // STEP 1: Generate/Regenerate Content Strategy
  async generateContent(input: RegenerateContentInput): Promise<ApiResponse<ContentData>> {
    try {
      const contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const targetLanguage = input.language || "Vietnamese";
      
      const prompt = `
You are an expert content strategist for video marketing. Create a content strategy for a ${input.duration || "60s"} video about: "${input.topic}"
Tags: ${(input.tags || []).join(", ")}

LANGUAGE REQUIREMENT: Generate all content in ${targetLanguage}. All responses, messages, and content must be in ${targetLanguage} language.

${input.existingContent ? `
Existing content to improve:
- Main Message: ${input.existingContent.mainMessage || ''}
- Key Points: ${input.existingContent.keyPoints?.join(", ") || ''}
- Tone: ${input.existingContent.tone || ''}

Please enhance and optimize the above content.
` : ''}

Create:
1. Main message (compelling value proposition)
2. 3-5 key points to highlight
3. Appropriate tone (professional/friendly/exciting/humorous)
4. Target audience definition
5. Video structure (intro/body/conclusion)

IMPORTANT: Respond in JSON format using ${targetLanguage} language:
{
  "mainMessage": "...",
  "keyPoints": ["...", "...", "..."],
  "tone": "...",
  "targetAudience": "...",
  "structure": "..."
}
`;

      const result = await this.makeApiCallWithRetry(prompt);
      
      // Parse AI response
      let parsedData;
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      } catch {
        // Language-aware fallbacks
        if (targetLanguage.toLowerCase().includes('english')) {
          parsedData = {
            mainMessage: `Video advertisement for ${input.topic}`,
            keyPoints: ["Product introduction", "Main benefits", "Call to action"],
            tone: "friendly",
            targetAudience: "General audience",
            structure: "Intro -> Problem -> Solution -> CTA"
          };
        } else if (targetLanguage.toLowerCase().includes('chinese') || targetLanguage.toLowerCase().includes('中文')) {
          parsedData = {
            mainMessage: `${input.topic}视频广告`,
            keyPoints: ["产品介绍", "主要优势", "行动号召"],
            tone: "friendly",
            targetAudience: "普通用户",
            structure: "介绍 -> 问题 -> 解决方案 -> 行动号召"
          };
        } else {
          // Default Vietnamese
          parsedData = {
            mainMessage: `Video quảng cáo ${input.topic}`,
            keyPoints: ["Giới thiệu sản phẩm", "Lợi ích chính", "Call to action"],
            tone: "friendly",
            targetAudience: "General audience",
            structure: "Intro -> Problem -> Solution -> CTA"
          };
        }
      }

      const contentData: ContentData = {
        contentId,
        topic: input.topic,
        tags: input.tags || [],
        mainMessage: parsedData.mainMessage,
        keyPoints: parsedData.keyPoints,
        tone: parsedData.tone,
        targetAudience: parsedData.targetAudience,
        duration: input.duration || "60s",
        language: targetLanguage,
        createdAt: new Date()
      };

      return {
        success: true,
        data: contentData,
        meta: {
          step: 1,
          nextStep: "Create characters"
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to generate content'
      };
    }
  }

  // STEP 2: Generate/Regenerate Characters
  async generateCharacter(input: RegenerateCharacterInput): Promise<ApiResponse<CharacterData>> {
    try {
      const characterId = `char_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const targetLanguage = input.language || input.contentData.language || "Vietnamese";
      
      // Analyze content context for character optimization
      const durationNum = parseInt(input.contentData.duration.replace(/\D/g, '')) || 60;
      const isShortForm = durationNum <= 30;
      const contentType = this.analyzeContentType(input.contentData.topic, input.contentData.tags);
      const contentNarrative = this.analyzeContentNarrative(input.contentData.topic, input.contentData.mainMessage);
      
      // Determine if this should be a customer/expert pair or single character
      const needsCharacterPair = this.determineCharacterStrategy(input.contentData, input.existingCharacters);
      
      let prompt = `
You are an expert character designer and video marketing strategist. Your mission is to create COMPELLING, MEMORABLE characters that tell a complete marketing story.

LANGUAGE REQUIREMENT: Generate all character information in ${targetLanguage}. All names, descriptions, personality traits, and content must be in ${targetLanguage} language.

CONTENT ANALYSIS:
Topic: ${input.contentData.topic}
Main Message: ${input.contentData.mainMessage}
Key Points: ${input.contentData.keyPoints.join(", ")}
Tone: ${input.contentData.tone}
Target Audience: ${input.contentData.targetAudience}
Video Duration: ${input.contentData.duration} (${isShortForm ? 'SHORT-FORM' : 'LONG-FORM'} content)
Content Type: ${contentType}
Narrative Type: ${contentNarrative}
Target Language: ${targetLanguage}

${input.existingCharacters && input.existingCharacters.length > 0 ? `
EXISTING CHARACTERS:
${input.existingCharacters.map(char => 
  `- ${char.name} (${char.role}): ${char.description}
    Personality: ${Array.isArray(char.personality) ? char.personality.join(", ") : char.personality}
    Appearance: ${char.appearance}
    Voice: ${char.voiceStyle}`
).join("\n")}

${needsCharacterPair.needsComplement ? `
MISSING ROLE NEEDED: ${needsCharacterPair.missingRole}
Create a character that fills this gap and creates dynamic interaction with existing characters.

RELATIONSHIP DYNAMIC:
The new character should ${needsCharacterPair.relationshipType} with existing characters to create:
- Natural conversation flow
- Problem-solution dynamic  
- Credible product/service introduction
- Audience identification and trust building

${needsCharacterPair.specificGuidance}
` : `
ENHANCEMENT NEEDED:
Existing characters need better complement. Create a character that enhances the story and fills missing perspective.
`}
` : `
CHARACTER STRATEGY: ${needsCharacterPair.strategy}

${needsCharacterPair.isPair ? `
CREATE A CUSTOMER CHARACTER (this will be paired with an expert later):
This is the first of a two-character ensemble. Create the CUSTOMER/PROBLEM character who:
- Represents the target audience's pain points
- Has relatable struggles with the topic
- Needs the solution that the content provides
- Creates authentic reason for the expert to explain/demonstrate
- Makes viewers think "that's me" or "I have that problem too"

CUSTOMER CHARACTER REQUIREMENTS:
- Role: Confused Customer, Struggling User, Problem-Haver, Seeker, etc.
- Personality: Relatable, authentic, represents common audience struggles
- Appearance: Typical of target audience, approachable, non-intimidating
- Voice: Questions, concerns, real customer language
- Background: Similar situation to viewers, believable pain points
- Purpose: Creates natural setup for solution presentation
` : `
CREATE A SINGLE PRESENTER CHARACTER:
This content works best with one strong character who can:
- Directly address the audience
- Present information authoritatively  
- Build trust and credibility
- Guide viewers through the content
`}
`}

${input.characterPrompt ? `
SPECIFIC USER REQUIREMENTS: ${input.characterPrompt}
IMPORTANT: Must incorporate these requirements while maintaining character effectiveness and story coherence.
` : ''}

CREATE A CHARACTER THAT SERVES THE CONTENT STORY AND AUDIENCE CONNECTION.

IMPORTANT: Respond in JSON format using ${targetLanguage} language:
{
  "name": "Character name appropriate for ${targetLanguage} speakers",
  "role": "${needsCharacterPair.isPair ? 'Customer/Person needing help' : 'Expert/Presenter'}",
  "personality": ["Trait 1", "Trait 2", "Trait 3", "Trait suitable for role"],
  "appearance": "Physical description suitable for target audience and role",
  "voiceStyle": "Natural speaking style for this role in ${targetLanguage}",
  "description": "Background and context of the character",
  "problemsOrExpertise": "${needsCharacterPair.isPair ? 'Problems/needs the character is experiencing' : 'Professional knowledge and problem-solving abilities'}",
  "audienceConnection": "Why target audience will relate to this character",
  "contentPurpose": "Character's role in delivering the content message"
}
`;

      const result = await this.makeApiCallWithRetry(prompt);
      
      // Parse AI response with enhanced error handling
      let parsedData;
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      } catch {
        // Enhanced fallback based on character strategy and language
        if (needsCharacterPair.isPair || needsCharacterPair.missingRole.includes('Customer')) {
          // Create customer character with language-appropriate content
          if (targetLanguage.toLowerCase().includes('english')) {
            parsedData = {
              name: "Mike Confused",
              role: "Customer needing advice",
              personality: ["Curious", "Needs help", "Practical", "Friendly"],
              appearance: "Ordinary, approachable, represents typical users",
              voiceStyle: "Asks many questions, shows genuine concern and practical worries",
              description: "Represents potential customers with real concerns",
              problemsOrExpertise: `Needs to learn about ${input.contentData.topic} but doesn't know where to start`,
              audienceConnection: "Reflects the real psychology and concerns of target audience",
              contentPurpose: "Creates natural opportunities for explanation and guidance"
            };
          } else if (targetLanguage.toLowerCase().includes('chinese') || targetLanguage.toLowerCase().includes('中文')) {
            parsedData = {
              name: "小明困惑",
              role: "需要咨询的客户",
              personality: ["好奇", "需要帮助", "实用", "友好"],
              appearance: "普通人，亲切，代表典型用户",
              voiceStyle: "提出很多问题，表现出真实的关心和实际担忧",
              description: "代表有真实担忧的潜在客户",
              problemsOrExpertise: `需要了解${input.contentData.topic}但不知道从哪里开始`,
              audienceConnection: "反映目标受众的真实心理和担忧",
              contentPurpose: "为解释和指导创造自然机会"
            };
          } else {
            // Default Vietnamese
            parsedData = {
              name: "Minh Confused",
              role: "Khách hàng cần tư vấn",
              personality: ["Thắc mắc", "Cần hỗ trợ", "Thực tế", "Dễ thương"],
              appearance: "Bình thường, gần gũi, đại diện cho người dùng thông thường",
              voiceStyle: "Hỏi nhiều, thể hiện sự quan tâm và lo lắng thực tế",
              description: "Đại diện cho khách hàng tiềm năng với những thắc mắc thực tế",
              problemsOrExpertise: `Cần tìm hiểu về ${input.contentData.topic} nhưng chưa biết bắt đầu từ đâu`,
              audienceConnection: "Phản ánh đúng tâm lý và thắc mắc của target audience",
              contentPurpose: "Tạo cơ hội tự nhiên cho việc giải thích và hướng dẫn"
            };
          }
        } else {
          // Create expert character with language-appropriate content
          if (targetLanguage.toLowerCase().includes('english')) {
            parsedData = {
              name: "Expert Sarah",
              role: "Professional consultant",
              personality: ["Professional", "Enthusiastic", "Trustworthy", "Clear"],
              appearance: "Professional, trustworthy but not distant",
              voiceStyle: "Explains clearly, uses specific examples, builds trust",
              description: "Expert with practical experience in the field",
              problemsOrExpertise: `Deep expertise in ${input.contentData.topic} and problem-solving abilities`,
              audienceConnection: "Represents the solution that audience is looking for",
              contentPurpose: "Provides accurate information and guides audience to action"
            };
          } else if (targetLanguage.toLowerCase().includes('chinese') || targetLanguage.toLowerCase().includes('中文')) {
            parsedData = {
              name: "专家莎拉",
              role: "专业顾问",
              personality: ["专业", "热情", "可信", "清晰"],
              appearance: "专业，值得信赖但不疏远",
              voiceStyle: "解释清楚，使用具体例子，建立信任",
              description: "在该领域具有实际经验的专家",
              problemsOrExpertise: `在${input.contentData.topic}方面的深度专业知识和解决问题的能力`,
              audienceConnection: "代表受众正在寻找的解决方案",
              contentPurpose: "提供准确信息并引导受众采取行动"
            };
          } else {
            // Default Vietnamese
            parsedData = {
              name: "Expert Sarah",
              role: "Chuyên gia tư vấn",
              personality: ["Chuyên nghiệp", "Nhiệt tình", "Đáng tin cậy", "Dễ hiểu"],
              appearance: "Professional, gây tin tưởng nhưng không xa cách",
              voiceStyle: "Giải thích rõ ràng, dùng ví dụ cụ thể, tạo niềm tin",
              description: "Chuyên gia có kinh nghiệm thực tế trong lĩnh vực",
              problemsOrExpertise: `Chuyên môn sâu về ${input.contentData.topic} và khả năng giải quyết vấn đề`,
              audienceConnection: "Đại diện cho giải pháp mà audience đang tìm kiếm",
              contentPurpose: "Cung cấp thông tin chính xác và hướng dẫn audience đến hành động"
            };
          }
        }
      }

      // Ensure we have all required fields with quality defaults
      const characterData: CharacterData = {
        characterId,
        name: parsedData.name || (needsCharacterPair.isPair || needsCharacterPair.missingRole.includes('Customer') 
          ? ['Minh Thắc Mắc', 'An Curious', 'Linh NewUser', 'Nam Confused', 'Mai Seeker'][Math.floor(Math.random() * 5)]
          : contentType === 'technology' ? ['Alex Tech', 'Maya Code', 'Ryan Digital', 'Zoe Innovation'][Math.floor(Math.random() * 4)] :
            contentType === 'culinary' ? ['Chef Marco', 'Luna Kitchen', 'Tony Taste', 'Aria Flavor'][Math.floor(Math.random() * 4)] :
            contentType === 'health' ? ['Dr. Emma', 'Coach Mike', 'Wellness Sara', 'Fit Alex'][Math.floor(Math.random() * 4)] :
            contentType === 'business' ? ['Success Sarah', 'Strategy Tom', 'Growth Lisa', 'Leader Mark'][Math.floor(Math.random() * 4)] :
            contentType === 'educational' ? ['Teacher Amy', 'Prof. David', 'Mentor Kate', 'Guide Sam'][Math.floor(Math.random() * 4)] :
            contentType === 'travel' ? ['Explorer Jake', 'Nomad Luna', 'Adventure Sam', 'Journey Maya'][Math.floor(Math.random() * 4)] :
            contentType === 'lifestyle' ? ['Style Emma', 'Trend Alex', 'Chic Sofia', 'Modern Ryan'][Math.floor(Math.random() * 4)] :
            ['Success Sarah', 'Strategy Tom', 'Growth Lisa', 'Leader Mark'][Math.floor(Math.random() * 4)]),
        role: parsedData.role || (needsCharacterPair.isPair ? 'Customer' : 
          input.contentData.tone === 'professional' ? 'Expert Consultant' :
          input.contentData.tone === 'friendly' ? 'Enthusiastic Guide' :
          input.contentData.tone === 'exciting' ? 'Dynamic Presenter' : 'Knowledgeable Presenter'),
        description: parsedData.description || `${parsedData.problemsOrExpertise || ''} ${parsedData.contentPurpose || ''}`.trim(),
        personality: Array.isArray(parsedData.personality) 
          ? parsedData.personality 
          : (parsedData.personality ? [parsedData.personality] : 
            input.contentData.tone === 'professional' ? ['Confident', 'Knowledgeable', 'Trustworthy', 'Clear-communicator'] :
            input.contentData.tone === 'friendly' ? ['Approachable', 'Warm', 'Encouraging', 'Relatable'] :
            input.contentData.tone === 'exciting' ? ['Energetic', 'Charismatic', 'Inspiring', 'Dynamic'] :
            input.contentData.tone === 'humorous' ? ['Witty', 'Playful', 'Clever', 'Entertaining'] :
            ['Approachable', 'Warm', 'Encouraging', 'Relatable']),
        appearance: parsedData.appearance || `Professional appearance phù hợp với ${input.contentData.targetAudience}, có điểm nhấn visual độc đáo tạo memorable impression`,
        voiceStyle: parsedData.voiceStyle || (
          input.contentData.tone === 'professional' ? 'Clear, confident và authoritative' :
          input.contentData.tone === 'friendly' ? 'Warm, conversational và encouraging' :
          input.contentData.tone === 'exciting' ? 'Energetic, dynamic và inspiring' :
          input.contentData.tone === 'humorous' ? 'Playful, witty và entertaining' : 'Warm, conversational và encouraging'),
        customPrompt: input.characterPrompt,
        createdAt: new Date()
      };

      return {
        success: true,
        data: characterData,
        meta: {
          step: 2,
          nextStep: needsCharacterPair.isPair && !input.existingCharacters?.length 
            ? "Create the complementary expert character" 
            : "Generate dialogue with your character ensemble"
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to generate character'
      };
    }
  }

  // Helper methods for character generation
  private analyzeContentType(topic: string, tags: string[]): string {
    const topicLower = topic.toLowerCase();
    const allTags = tags.join(' ').toLowerCase();
    
    if (topicLower.includes('tech') || topicLower.includes('app') || topicLower.includes('software')) return 'technology';
    if (topicLower.includes('food') || topicLower.includes('recipe') || topicLower.includes('cooking')) return 'culinary';
    if (topicLower.includes('health') || topicLower.includes('fitness') || topicLower.includes('wellness')) return 'health';
    if (topicLower.includes('business') || topicLower.includes('startup') || topicLower.includes('marketing')) return 'business';
    if (topicLower.includes('education') || topicLower.includes('learn') || topicLower.includes('course')) return 'educational';
    if (topicLower.includes('travel') || topicLower.includes('destination')) return 'travel';
    if (topicLower.includes('fashion') || topicLower.includes('style') || topicLower.includes('beauty')) return 'lifestyle';
    if (allTags.includes('entertainment') || allTags.includes('fun')) return 'entertainment';
    
    return 'general';
  }

  private getCharacterGuidelines(contentType: string, tone: string, audience: string): string {
    const guidelines: {[key: string]: string} = {
      'technology': 'Tạo nhân vật am hiểu công nghệ nhưng có thể giải thích phức tạp một cách đơn giản, có phong cách hiện đại và innovative',
      'culinary': 'Tạo nhân vật đam mê ẩm thực với kinh nghiệm thực tế, có thể truyền cảm hứng và tạo cảm giác thèm ăn',
      'health': 'Tạo nhân vật đáng tin cậy về sức khỏe, có credibility nhưng approachable, tránh quá formal hay intimidating',
      'business': 'Tạo nhân vật có kinh nghiệm kinh doanh thực tế, confident nhưng relatable, có thể inspire action',
      'educational': 'Tạo nhân vật giáo viên tài năng, patient và encouraging, có thể làm phức tạp trở nên easy-to-understand',
      'travel': 'Tạo nhân vật adventurous và experienced, có thể kể chuyện hấp dẫn và inspire wanderlust',
      'lifestyle': 'Tạo nhân vật stylish và trendy, có taste tốt và có thể influence others positively',
      'entertainment': 'Tạo nhân vật charismatic và entertaining, có thể capture attention và create memorable moments'
    };
    
    return guidelines[contentType] || 'Tạo nhân vật phù hợp với nội dung và có thể kết nối tốt với audience';
  }

  private createFallbackCharacter(contentData: ContentData, contentType: string): any {
    const fallbackCharacters: {[key: string]: any} = {
      'technology': {
        name: "Alex Tech",
        role: "Technology Enthusiast",
        personality: ["Innovative", "Analytical", "Approachable", "Future-focused"],
        appearance: "Trẻ trung, đeo kính stylish, áo hoodie tech-brand, có gadgets",
        voiceStyle: "Nói nhanh nhưng rõ ràng, dùng analogy đơn giản cho concepts phức tạp",
        description: "Tech enthusiast với kinh nghiệm thực tế, có thể explain công nghệ một cách dễ hiểu",
        uniqueTraits: "Luôn có latest gadget và có thể demo trực tiếp",
        contentValue: "Tạo trust về technical expertise và make technology accessible"
      },
      'business': {
        name: "Sarah Success",
        role: "Business Strategist", 
        personality: ["Confident", "Strategic", "Results-driven", "Inspiring"],
        appearance: "Professional nhưng approachable, dress smart-casual, confident posture",
        voiceStyle: "Clear, authoritative nhưng warm, dùng real examples",
        description: "Business leader với track record thành công, có thể share practical insights",
        uniqueTraits: "Có real business achievements và storytelling skills",
        contentValue: "Credibility và inspiration cho business audience"
      }
    };
    
    return fallbackCharacters[contentType] || fallbackCharacters['business'];
  }

  private generateCreativeName(contentType: string): string {
    const names: {[key: string]: string[]} = {
      'technology': ['Alex Tech', 'Maya Code', 'Ryan Digital', 'Zoe Innovation'],
      'culinary': ['Chef Marco', 'Luna Kitchen', 'Tony Taste', 'Aria Flavor'],
      'health': ['Dr. Emma', 'Coach Mike', 'Wellness Sara', 'Fit Alex'],
      'business': ['Success Sarah', 'Strategy Tom', 'Growth Lisa', 'Leader Mark'],
      'educational': ['Teacher Amy', 'Prof. David', 'Mentor Kate', 'Guide Sam'],
      'travel': ['Explorer Jake', 'Nomad Luna', 'Adventure Sam', 'Journey Maya'],
      'lifestyle': ['Style Emma', 'Trend Alex', 'Chic Sofia', 'Modern Ryan']
    };
    
    const categoryNames = names[contentType] || names['business'];
    return categoryNames[Math.floor(Math.random() * categoryNames.length)];
  }

  private selectOptimalRole(contentType: string, tone: string): string {
    if (tone === 'professional') return 'Expert Consultant';
    if (tone === 'friendly') return 'Enthusiastic Guide';
    if (tone === 'exciting') return 'Dynamic Presenter';
    return 'Knowledgeable Presenter';
  }

  private generatePersonalityTraits(contentType: string, tone: string): string[] {
    const baseTraits: {[key: string]: string[]} = {
      'professional': ['Confident', 'Knowledgeable', 'Trustworthy', 'Clear-communicator'],
      'friendly': ['Approachable', 'Warm', 'Encouraging', 'Relatable'],
      'exciting': ['Energetic', 'Charismatic', 'Inspiring', 'Dynamic'],
      'humorous': ['Witty', 'Playful', 'Clever', 'Entertaining']
    };
    
    return baseTraits[tone] || baseTraits['friendly'];
  }

  private generateAppearance(contentType: string, audience: string): string {
    return `Professional appearance phù hợp với ${audience}, có điểm nhấn visual độc đáo tạo memorable impression`;
  }

  private generateVoiceStyle(tone: string, contentType: string): string {
    const styles: {[key: string]: string} = {
      'professional': 'Clear, confident và authoritative',
      'friendly': 'Warm, conversational và encouraging', 
      'exciting': 'Energetic, dynamic và inspiring',
      'humorous': 'Playful, witty và entertaining'
    };
    
    return styles[tone] || styles['friendly'];
  }

  // Helper methods for strategic character generation
  private analyzeContentNarrative(topic: string, mainMessage: string): string {
    const content = `${topic} ${mainMessage}`.toLowerCase();
    
    if (content.includes('mua') || content.includes('bán') || content.includes('giá')) return 'sales';
    if (content.includes('cách') || content.includes('hướng dẫn') || content.includes('làm')) return 'tutorial';
    if (content.includes('so sánh') || content.includes('tốt nhất') || content.includes('review')) return 'comparison';
    if (content.includes('vấn đề') || content.includes('giải pháp') || content.includes('khắc phục')) return 'problem-solution';
    if (content.includes('giới thiệu') || content.includes('tính năng') || content.includes('sản phẩm')) return 'introduction';
    
    return 'general';
  }

  private determineCharacterStrategy(contentData: ContentData, existingCharacters?: CharacterData[]): {
    isPair: boolean;
    strategy: string;
    needsComplement: boolean;
    missingRole: string;
    relationshipType: string;
    specificGuidance: string;
  } {
    const narrative = this.analyzeContentNarrative(contentData.topic, contentData.mainMessage);
    const hasExisting = existingCharacters && existingCharacters.length > 0;
    
    if (hasExisting) {
      // Analyze existing characters to determine what's missing
      const existingRoles = existingCharacters!.map(char => char.role.toLowerCase());
      
      const hasCustomer = existingRoles.some(role => 
        role.includes('customer') || role.includes('user') || role.includes('người dùng') || role.includes('khách')
      );
      const hasExpert = existingRoles.some(role => 
        role.includes('expert') || role.includes('consultant') || role.includes('chuyên gia') || role.includes('presenter')
      );
      
      if (hasCustomer && !hasExpert) {
        return {
          isPair: false,
          strategy: 'complement_with_expert',
          needsComplement: true,
          missingRole: 'Expert/Solution Provider',
          relationshipType: 'provide solution and guidance to',
          specificGuidance: 'Create an expert who can answer the customer\'s questions and provide the solution they need.'
        };
      } else if (hasExpert && !hasCustomer) {
        return {
          isPair: false,
          strategy: 'complement_with_customer',
          needsComplement: true,
          missingRole: 'Customer/Problem Haver',
          relationshipType: 'ask questions and seek help from',
          specificGuidance: 'Create a relatable customer who naturally brings up the problems that the expert can solve.'
        };
      } else {
        return {
          isPair: false,
          strategy: 'enhance_existing',
          needsComplement: false,
          missingRole: 'Supporting Character',
          relationshipType: 'enhance the dynamic between',
          specificGuidance: 'Create a character that adds new perspective or energy to the existing ensemble.'
        };
      }
    }
    
    // No existing characters - determine if we need a pair based on narrative
    const pairNeededNarratives = ['sales', 'tutorial', 'problem-solution', 'comparison'];
    const needsPair = pairNeededNarratives.includes(narrative);
    
    return {
      isPair: needsPair,
      strategy: needsPair ? 'create_customer_first' : 'create_single_presenter',
      needsComplement: false,
      missingRole: '',
      relationshipType: '',
      specificGuidance: ''
    };
  }

  private createStrategicFallbackCharacter(contentData: ContentData, contentType: string, strategy: any): any {
    const narrative = this.analyzeContentNarrative(contentData.topic, contentData.mainMessage);
    
    if (strategy.isPair || strategy.missingRole.includes('Customer')) {
      // Create customer character
      return {
        name: "Minh Confused",
        role: "Khách hàng cần tư vấn",
        personality: ["Thắc mắc", "Cần hỗ trợ", "Thực tế", "Dễ thương"],
        appearance: "Bình thường, gần gũi, đại diện cho người dùng thông thường",
        voiceStyle: "Hỏi nhiều, thể hiện sự quan tâm và lo lắng thực tế",
        description: "Đại diện cho khách hàng tiềm năng với những thắc mắc thực tế",
        problemsOrExpertise: `Cần tìm hiểu về ${contentData.topic} nhưng chưa biết bắt đầu từ đâu`,
        audienceConnection: "Phản ánh đúng tâm lý và thắc mắc của target audience",
        contentPurpose: "Tạo cơ hội tự nhiên cho việc giải thích và hướng dẫn"
      };
    } else {
      // Create expert character  
      return {
        name: "Expert Sarah",
        role: "Chuyên gia tư vấn",
        personality: ["Chuyên nghiệp", "Nhiệt tình", "Đáng tin cậy", "Dễ hiểu"],
        appearance: "Professional, gây tin tưởng nhưng không xa cách",
        voiceStyle: "Giải thích rõ ràng, dùng ví dụ cụ thể, tạo niềm tin",
        description: "Chuyên gia có kinh nghiệm thực tế trong lĩnh vực",
        problemsOrExpertise: `Chuyên môn sâu về ${contentData.topic} và khả năng giải quyết vấn đề`,
        audienceConnection: "Đại diện cho giải pháp mà audience đang tìm kiếm",
        contentPurpose: "Cung cấp thông tin chính xác và hướng dẫn audience đến hành động"
      };
    }
  }

  private generateStrategicName(contentType: string, strategy: any): string {
    if (strategy.isPair || strategy.missingRole.includes('Customer')) {
      const customerNames = ['Minh Thắc Mắc', 'An Curious', 'Linh NewUser', 'Nam Confused', 'Mai Seeker'];
      return customerNames[Math.floor(Math.random() * customerNames.length)];
    } else {
      return this.generateCreativeName(contentType);
    }
  }

  // STEP 3: Generate/Regenerate Dialogue
  async generateDialogue(input: RegenerateDialogueInput): Promise<ApiResponse<DialogueSegment[]>> {
    try {
      const targetLanguage = input.language || input.contentData.language || "Vietnamese";
      
      const charactersInfo = input.characters.map(char => 
        `${char.name} (${char.role}): ${char.description} - Personality: ${char.personality.join(", ")} - Voice: ${char.voiceStyle}`
      ).join("\n");

      // Calculate desired dialogue count
      const desiredCount = input.dialogueCount || 5; // Default 5 dialogues
      const countInstruction = input.dialogueCount 
        ? `Create exactly ${input.dialogueCount} dialogue segments`
        : `Create 5-7 dialogue segments appropriate for the duration`;

      const prompt = `
You are an expert scriptwriter for video content. Create dialogue script for a ${input.contentData.duration} video with:

LANGUAGE REQUIREMENT: Generate all dialogue content in ${targetLanguage}. All character dialogue, emotions, actions, and descriptions must be in ${targetLanguage} language.

Topic: ${input.contentData.topic}
Main Message: ${input.contentData.mainMessage}
Key Points: ${input.contentData.keyPoints.join(", ")}
Tone: ${input.contentData.tone}
Target Language: ${targetLanguage}

Characters:
${charactersInfo}

${input.existingDialogues && input.existingDialogues.length > 0 ? `
PREVIOUS SCENE CONTEXT (for continuation):
${input.existingDialogues.map((d, index) => `${index + 1}. ${d.characterName}: "${d.dialogue}"`).join("\n")}

TASK: Create the NEXT SCENE that continues naturally from the previous dialogue above. 
- Build upon the story flow from the previous scene
- Maintain character consistency 
- Progress the narrative forward
- Create ${desiredCount} NEW dialogue segments for the next scene
- Do NOT repeat or copy the previous dialogue
` : `
TASK: Create the FIRST SCENE of the video with ${desiredCount} dialogue segments.
`}

${input.dialoguePrompt ? `
SPECIAL USER REQUIREMENTS: ${input.dialoguePrompt}
Please incorporate these specific requirements into the dialogue creation.
` : ''}

Create detailed dialogue including:
- Speaking character
- Dialogue text in ${targetLanguage}
- Emotion/feeling
- Actions/gestures in ${targetLanguage}
- Visual cues (if any) in ${targetLanguage}

${input.dialoguePrompt ? `Make sure to follow the user's specific requirements: "${input.dialoguePrompt}"` : ''}

Ensure dialogue matches each character's personality and fits the ${input.contentData.duration} duration.
Create ${desiredCount} dialogue segments with natural flow.

IMPORTANT: Respond in JSON array format using ${targetLanguage} language:
[
  {
    "timestamp": "",
    "characterId": "char_id", 
    "characterName": "Character name",
    "dialogue": "Dialogue text in ${targetLanguage}...",
    "emotion": "happy/confident/excited...",
    "action": "Action description in ${targetLanguage}...",
    "visualCue": "Visual hint in ${targetLanguage}..."
  }
]
`;

      const result = await this.makeApiCallWithRetry(prompt);
      
      // Parse AI response
      let script: DialogueSegment[];
      try {
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        script = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      } catch {
        // Language-aware fallback script
        if (targetLanguage.toLowerCase().includes('english')) {
          script = [
            {
              timestamp: "",
              characterId: input.characters[0].characterId,
              characterName: input.characters[0].name,
              dialogue: `Hello! Today I'll introduce you to ${input.contentData.topic}`,
              emotion: "friendly",
              action: "Look at camera, smile",
              visualCue: "Natural scene background"
            },
            {
              timestamp: "",
              characterId: input.characters[0].characterId,
              characterName: input.characters[0].name,
              dialogue: input.contentData.mainMessage,
              emotion: "confident",
              action: "Explain with hand gestures",
              visualCue: "Show product/demo without text"
            },
            {
              timestamp: "",
              characterId: input.characters[0].characterId,
              characterName: input.characters[0].name,
              dialogue: "Try it today! Check the description below",
              emotion: "enthusiastic",
              action: "Point downward",
              visualCue: "Natural gesture, no text elements"
            }
          ];
        } else if (targetLanguage.toLowerCase().includes('chinese') || targetLanguage.toLowerCase().includes('中文')) {
          script = [
            {
              timestamp: "",
              characterId: input.characters[0].characterId,
              characterName: input.characters[0].name,
              dialogue: `大家好！今天我来为大家介绍${input.contentData.topic}`,
              emotion: "friendly",
              action: "看向镜头，微笑",
              visualCue: "自然场景背景"
            },
            {
              timestamp: "",
              characterId: input.characters[0].characterId,
              characterName: input.characters[0].name,
              dialogue: input.contentData.mainMessage,
              emotion: "confident",
              action: "用手势解释",
              visualCue: "展示产品/演示，无文字"
            },
            {
              timestamp: "",
              characterId: input.characters[0].characterId,
              characterName: input.characters[0].name,
              dialogue: "今天就试试吧！查看下方描述",
              emotion: "enthusiastic",
              action: "向下指",
              visualCue: "自然手势，无文字元素"
            }
          ];
        } else {
          // Default Vietnamese
          script = [
            {
              timestamp: "",
              characterId: input.characters[0].characterId,
              characterName: input.characters[0].name,
              dialogue: `Chào bạn! Hôm nay tôi sẽ giới thiệu về ${input.contentData.topic}`,
              emotion: "friendly",
              action: "Nhìn camera, mỉm cười",
              visualCue: "Phông nền tự nhiên"
            },
            {
              timestamp: "",
              characterId: input.characters[0].characterId,
              characterName: input.characters[0].name,
              dialogue: input.contentData.mainMessage,
              emotion: "confident",
              action: "Giải thích với cử chỉ tay",
              visualCue: "Hiển thị sản phẩm/demo không có chữ"
            },
            {
              timestamp: "",
              characterId: input.characters[0].characterId,
              characterName: input.characters[0].name,
              dialogue: "Hãy thử ngay hôm nay! Xem mô tả bên dưới",
              emotion: "enthusiastic",
              action: "Chỉ tay xuống dưới",
              visualCue: "Cử chỉ tự nhiên, không có chữ"
            }
          ];
        }
      }

      return {
        success: true,
        data: script,
        meta: {
          step: 3,
          nextStep: "Generate final script"
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to generate dialogue'
      };
    }
  }

  // STEP 4: Generate Simple Final Script
  async generateFinalScript(input: RegenerateFinalScriptInput): Promise<ApiResponse<FinalScript>> {
    try {
      const scriptId = `script_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const targetLanguage = input.language || input.contentData.language || "Vietnamese";
      
      // Generate Vietnamese prompt first
      const vietnamesePrompt = this.generateSimplePrompt(input);
      
      // Translate to English but keep dialogue in Vietnamese
      const englishPrompt = await this.translateToEnglish(vietnamesePrompt, targetLanguage);

      const finalScript: FinalScript = {
        scriptId,
        characters: input.characters,
        dialogue: input.dialogue,
        prompt: englishPrompt,
        metadata: {
          title: `Video Script: ${input.contentData.topic}`,
          duration: `${input.contentData.duration}`,
          charactersCount: input.characters.length,
          createdAt: new Date()
        }
      };

      return {
        success: true,
        data: finalScript,
        meta: {
          step: 4,
          nextStep: "Complete - Ready for video generation!"
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to generate final script'
      };
    }
  }

  // Simple AI translation to English
  private async translateToEnglish(prompt: string, targetLanguage: string): Promise<string> {
    const translationPrompt = `Translate this video prompt to English, but keep all dialogue in quotes exactly in ${targetLanguage}:

${prompt}

Rules:
- Translate descriptions, actions, settings to English
- Keep ALL dialogue in quotes in ${targetLanguage} (do not translate dialogue)
- Keep the narrative flow and cinematic style
- Output clean English prompt without formatting`;

    try {
      const result = await this.makeApiCallWithRetry(translationPrompt);
      return result.trim();
    } catch (error) {
      // Fallback to original prompt if translation fails
      console.log('Translation failed, using original prompt');
      return prompt;
    }
  }

  // Create simple, direct prompt in English for AI video tools
  private generateSimplePrompt(input: RegenerateFinalScriptInput): string {
    const targetLanguage = input.language || input.contentData.language || "Vietnamese";
    const duration = input.contentData.duration;
    const topic = input.contentData.topic;
    
    // Generate cinematic narrative prompt
    const setting = this.generateCinematicSetting(topic, input.contentData.tone);
    const characters = this.generateCharacterNarrative(input.characters, input.dialogue);
    const storyFlow = this.generateStoryNarrative(input.dialogue, input.characters, targetLanguage);
    const technicalSpecs = this.generateTechnicalNarrative(duration, targetLanguage, input.contentData.tone, input.characters, input.dialogue);
    
    return `${setting}

${characters}

${storyFlow}

${technicalSpecs}`;
  }

  // Generate vivid cinematic setting
  private generateCinematicSetting(topic: string, tone: string): string {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('tech') || topicLower.includes('app') || topicLower.includes('software') || topicLower.includes('ai')) {
      return "In a modern office space with computers and tech equipment.";
    } else if (topicLower.includes('business') || topicLower.includes('marketing')) {
      return "In a professional office environment.";
    } else if (topicLower.includes('food') || topicLower.includes('recipe')) {
      return "In a warm kitchen setting.";
    } else {
      return "In a comfortable indoor setting with good lighting.";
    }
  }

  // Generate character narrative descriptions
  private generateCharacterNarrative(characters: any[], dialogue: any[]): string {
    if (characters.length === 1) {
      const char = characters[0];
      return `${char.name} (${char.appearance}) appears in the scene.`;
    } else if (characters.length === 2) {
      const char1 = characters[0];
      const char2 = characters[1];
      return `${char1.name} (${char1.appearance}) and ${char2.name} (${char2.appearance}) are in the scene.`;
    } else {
      return characters.map(char => `${char.name} (${char.appearance})`).join(', ') + ' are in the scene.';
    }
  }

  // Generate story narrative flow with unique dialogue
  private generateStoryNarrative(dialogue: any[], characters: any[], language: string): string {
    let narrative = "";
    let usedDialogue = new Set(); // Track used dialogue to avoid duplicates
    
    dialogue.forEach((segment, index) => {
      const character = characters.find(c => c.characterId === segment.characterId || c.name === segment.characterName);
      
      // Skip if dialogue already used
      if (usedDialogue.has(segment.dialogue)) {
        return;
      }
      usedDialogue.add(segment.dialogue);
      
      if (index === 0) {
        narrative += `${character?.name || 'The character'} says in ${language}: "${segment.dialogue}"`;
      } else {
        narrative += ` Then ${character?.name || 'the other character'} says in ${language}: "${segment.dialogue}"`;
      }
    });
    
    return narrative;
  }

  // Generate technical specifications narrative with character roles
  private generateTechnicalNarrative(duration: string, language: string, tone: string, characters: any[], dialogue: any[]): string {
    const cameraStyle = tone.includes('hào hứng') || tone.includes('exciting') ? 'dynamic handheld movement' : 'smooth tracking shots';
    const lightingStyle = tone.includes('chuyên nghiệp') || tone.includes('professional') ? 'professional lighting setup' : 'natural lighting with warm tones';
    
    // Determine who speaks and who stays silent
    let speakingCharacters = new Set();
    dialogue.forEach(segment => {
      const character = characters.find(c => c.characterId === segment.characterId || c.name === segment.characterName);
      if (character) {
        speakingCharacters.add(character.name);
      }
    });
    
    let characterInstructions = "";
    if (characters.length > 1) {
      const silentCharacters = characters.filter(char => !speakingCharacters.has(char.name));
      if (silentCharacters.length > 0) {
        characterInstructions = `\nOnly ${Array.from(speakingCharacters).join(', ')} speak${speakingCharacters.size === 1 ? 's' : ''}. ${silentCharacters.map(char => char.name).join(', ')} remain${silentCharacters.length === 1 ? 's' : ''} silent and just react${silentCharacters.length === 1 ? 's' : ''} naturally.`;
      }
    }
    
    return `${lightingStyle.charAt(0).toUpperCase() + lightingStyle.slice(1)}, ${cameraStyle}, realistic human expressions and movements. Perfect lip-sync with ${language} speech, no subtitles or text overlays anywhere. 4K cinematic quality with clear audio and natural background ambiance. Duration: ${duration}.

Important Instructions:${characterInstructions}
No subtitles, captions, or on-screen text in the video.
Lip-sync must match the ${language} speech perfectly.
Lighting: ${lightingStyle}
Style: Realistic human model, cinematic motion, 4K resolution
Camera: ${cameraStyle === 'dynamic handheld movement' ? 'Handheld camera with dynamic movement and energy' : 'Smooth medium-close tracking shot with light zoom on facial expressions'}
Audio: Background ambiance only, no music, only speaking character's voice clearly heard.`;
  }
}

// Export types
export { 
  ContentData, 
  CharacterData, 
  DialogueSegment, 
  FinalScript, 
  ApiResponse,
  RegenerateContentInput,
  RegenerateCharacterInput,
  RegenerateDialogueInput,
  RegenerateFinalScriptInput
};