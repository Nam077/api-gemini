// API Response Structure for Chat Management
import { GoogleGenAI } from "@google/genai";

// Types for API responses
interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp?: Date;
}

interface ChatSession {
  id: string;
  userId: string;
  title?: string;
  model: string;
  history: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    tokens?: {
      prompt: number;
      response: number;
      total: number;
    };
    model: string;
  };
}

// API Service Class
class ChatApiService {
  private ai: GoogleGenAI;
  private activeSessions = new Map<string, any>(); // In-memory sessions

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  // 1. Tạo session mới
  async createChatSession(userId: string, model: string = "gemini-2.5-flash-preview-05-20"): Promise<ApiResponse<{ sessionId: string }>> {
    try {
      const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const chat = this.ai.chats.create({ model });
      
      this.activeSessions.set(sessionId, {
        chat,
        userId,
        model,
        createdAt: new Date()
      });

      return {
        success: true,
        data: { sessionId },
        meta: { model }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 2. Gửi message và lấy response
  async sendMessage(sessionId: string, message: string): Promise<ApiResponse<{
    response: string;
    history: ChatMessage[];
  }>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      const response = await session.chat.sendMessage({ message });
      
      // Lấy history từ chat object
      const history = session.chat.history || [];

      return {
        success: true,
        data: {
          response: response.text,
          history
        },
        meta: {
          tokens: {
            prompt: response.usageMetadata?.promptTokenCount || 0,
            response: response.usageMetadata?.candidatesTokenCount || 0,
            total: response.usageMetadata?.totalTokenCount || 0
          },
          model: session.model
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 3. Lấy history của conversation
  async getChatHistory(sessionId: string): Promise<ApiResponse<{ history: ChatMessage[] }>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      const history = session.chat.history || [];
      
      return {
        success: true,
        data: { history }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 4. Lưu conversation vào database (giả lập)
  async saveChatSession(sessionId: string, title?: string): Promise<ApiResponse<{ saved: boolean }>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      const chatData: ChatSession = {
        id: sessionId,
        userId: session.userId,
        title: title || `Chat ${new Date().toLocaleString()}`,
        model: session.model,
        history: session.chat.history || [],
        createdAt: session.createdAt,
        updatedAt: new Date()
      };

      // Ở đây bạn sẽ lưu vào database thực tế
      console.log('💾 Saving to database:', chatData);
      
      // Có thể xóa khỏi memory sau khi lưu
      // this.activeSessions.delete(sessionId);

      return {
        success: true,
        data: { saved: true }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 5. Load conversation từ database và tạo lại session
  async loadChatSession(sessionId: string, savedHistory: ChatMessage[]): Promise<ApiResponse<{ loaded: boolean }>> {
    try {
      // Tạo chat session mới với history từ đầu
      const chat = this.ai.chats.create({ 
        model: "gemini-2.5-flash-preview-05-20",
        history: savedHistory // Truyền history trực tiếp khi tạo chat session
      });

      this.activeSessions.set(sessionId, {
        chat,
        userId: "restored",
        model: "gemini-2.5-flash-preview-05-20",
        createdAt: new Date(),
        savedHistory // Store the history for reference
      });

      return {
        success: true,
        data: { loaded: true }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Express.js API Routes Example
export class ChatController {
  private chatService: ChatApiService;

  constructor(apiKey: string) {
    this.chatService = new ChatApiService(apiKey);
  }

  // POST /api/chat/sessions
  async createSession(req: any, res: any) {
    const { userId, model } = req.body;
    const result = await this.chatService.createChatSession(userId, model);
    res.json(result);
  }

  // POST /api/chat/sessions/:sessionId/messages
  async sendMessage(req: any, res: any) {
    const { sessionId } = req.params;
    const { message } = req.body;
    
    const result = await this.chatService.sendMessage(sessionId, message);
    res.json(result);
  }

  // GET /api/chat/sessions/:sessionId/history
  async getHistory(req: any, res: any) {
    const { sessionId } = req.params;
    const result = await this.chatService.getChatHistory(sessionId);
    res.json(result);
  }

  // POST /api/chat/sessions/:sessionId/save
  async saveSession(req: any, res: any) {
    const { sessionId } = req.params;
    const { title } = req.body;
    
    const result = await this.chatService.saveChatSession(sessionId, title);
    res.json(result);
  }
}

// Usage Example
async function exampleUsage() {
  const apiKey = "AIzaSyBn2xgBTBBi5LHgDjRt5Pc3ubBAbBQpalI";
  const chatService = new ChatApiService(apiKey);

  // 1. Tạo session
  const sessionResult = await chatService.createChatSession("user123");
  if (!sessionResult.success) return;
  
  const sessionId = sessionResult.data!.sessionId;
  console.log('📱 Session created:', sessionId);

  // 2. Gửi messages
  const msg1 = await chatService.sendMessage(sessionId, "Tôi tên là Nam");
  console.log('🤖 Response 1:', msg1.data?.response);

  const msg2 = await chatService.sendMessage(sessionId, "Bạn có nhớ tên tôi không?");
  console.log('🤖 Response 2:', msg2.data?.response);

  // 3. Lấy history
  const history = await chatService.getChatHistory(sessionId);
  console.log('📜 Full history:', history.data?.history);

  // 4. Lưu conversation
  await chatService.saveChatSession(sessionId, "Conversation với Nam");
}

// Chạy demo
console.log('🚀 Starting API Demo...');
exampleUsage()
  .then(() => {
    console.log('✅ Demo completed successfully!');
  })
  .catch((error) => {
    console.error('❌ Demo failed:', error);
  });