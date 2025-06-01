import { GoogleGenAI } from '@google/genai';
import { injectable } from 'inversify';

// Types for chat session management
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
    sessionId?: string;
  };
}

@injectable()
export class ChatSessionService {
  private ai: GoogleGenAI;
  private activeSessions = new Map<string, any>(); // In-memory sessions

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    
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
        meta: { model, sessionId }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error occurred'
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
          model: session.model,
          sessionId
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error occurred'
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
        data: { history },
        meta: { sessionId, model: session.model }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error occurred'
      };
    }
  }

  // 4. Lưu conversation vào database (sẽ implement sau)
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

      // TODO: Implement database save
      console.log('💾 Saving to database:', chatData);
      
      return {
        success: true,
        data: { saved: true },
        meta: { sessionId, model: session.model }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error occurred'
      };
    }
  }

  // 5. Load conversation từ database và tạo lại session
  async loadChatSession(sessionId: string, savedHistory: ChatMessage[]): Promise<ApiResponse<{ loaded: boolean }>> {
    try {
      // Tạo chat session với history từ database
      const chat = this.ai.chats.create({ 
        model: "gemini-2.5-flash-preview-05-20"
      });

      this.activeSessions.set(sessionId, {
        chat,
        userId: "restored",
        model: "gemini-2.5-flash-preview-05-20",
        createdAt: new Date(),
        savedHistory
      });

      return {
        success: true,
        data: { loaded: true },
        meta: { sessionId, model: "gemini-2.5-flash-preview-05-20" }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error occurred'
      };
    }
  }

  // 6. Xóa session khỏi memory
  async deleteSession(sessionId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const session = this.activeSessions.get(sessionId);
      const deleted = this.activeSessions.delete(sessionId);
      
      return {
        success: true,
        data: { deleted },
        meta: { sessionId, model: session?.model || 'unknown' }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error occurred'
      };
    }
  }

  // 7. List all active sessions
  async getActiveSessions(userId?: string): Promise<ApiResponse<{ sessions: Array<{sessionId: string, userId: string, model: string, createdAt: Date}> }>> {
    try {
      const sessions = Array.from(this.activeSessions.entries())
        .filter(([_, session]) => !userId || session.userId === userId)
        .map(([sessionId, session]) => ({
          sessionId,
          userId: session.userId,
          model: session.model,
          createdAt: session.createdAt
        }));

      return {
        success: true,
        data: { sessions }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error occurred'
      };
    }
  }
}

// Export types for use in controllers
export { ChatMessage, ChatSession, ApiResponse };