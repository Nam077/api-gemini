import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ChatSessionService } from '../services/ChatSessionService';
import { TYPES } from '../types/types';

@injectable()
export class ChatSessionController {
  constructor(
    @inject(TYPES.ChatSessionService) private chatSessionService: ChatSessionService
  ) {}

  // POST /api/chat/sessions - Tạo session mới
  async createSession(req: Request, res: Response): Promise<void> {
    try {
      const { userId, model } = req.body;

      if (!userId) {
        res.status(400).json({ error: 'userId is required' });
        return;
      }

      console.log('🚀 Creating new chat session for user:', userId);
      const result = await this.chatSessionService.createChatSession(userId, model);

      if (!result.success) {
        res.status(500).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error: any) {
      console.error('❌ Create session error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to create session',
        details: error.message 
      });
    }
  }

  // POST /api/chat/sessions/:sessionId/messages - Gửi message
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      console.log(`🚀 Sending message to session ${sessionId}:`, message);
      const result = await this.chatSessionService.sendMessage(sessionId, message);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error('❌ Send message error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to send message',
        details: error.message 
      });
    }
  }

  // GET /api/chat/sessions/:sessionId/history - Lấy history
  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      console.log(`🚀 Getting history for session:`, sessionId);
      const result = await this.chatSessionService.getChatHistory(sessionId);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error('❌ Get history error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to get history',
        details: error.message 
      });
    }
  }

  // POST /api/chat/sessions/:sessionId/save - Lưu conversation
  async saveSession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { title } = req.body;

      console.log(`🚀 Saving session:`, sessionId);
      const result = await this.chatSessionService.saveChatSession(sessionId, title);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error('❌ Save session error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to save session',
        details: error.message 
      });
    }
  }

  // POST /api/chat/sessions/:sessionId/load - Load conversation từ database
  async loadSession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { savedHistory } = req.body;

      if (!savedHistory || !Array.isArray(savedHistory)) {
        res.status(400).json({ error: 'savedHistory array is required' });
        return;
      }

      console.log(`🚀 Loading session:`, sessionId);
      const result = await this.chatSessionService.loadChatSession(sessionId, savedHistory);

      if (!result.success) {
        res.status(500).json(result);
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error('❌ Load session error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to load session',
        details: error.message 
      });
    }
  }

  // DELETE /api/chat/sessions/:sessionId - Xóa session
  async deleteSession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      console.log(`🚀 Deleting session:`, sessionId);
      const result = await this.chatSessionService.deleteSession(sessionId);

      res.json(result);
    } catch (error: any) {
      console.error('❌ Delete session error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to delete session',
        details: error.message 
      });
    }
  }

  // GET /api/chat/sessions - Lấy danh sách active sessions
  async getActiveSessions(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;

      console.log(`🚀 Getting active sessions for user:`, userId);
      const result = await this.chatSessionService.getActiveSessions(userId as string);

      res.json(result);
    } catch (error: any) {
      console.error('❌ Get active sessions error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to get active sessions',
        details: error.message 
      });
    }
  }
}