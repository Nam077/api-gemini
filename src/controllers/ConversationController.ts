import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ConversationRepository } from '../repositories/ConversationRepository';
import { GeminiService } from '../services/GeminiService';

@injectable()
export class ConversationController {
  constructor(
    @inject(ConversationRepository) private conversationRepo: ConversationRepository,
    @inject(GeminiService) private geminiService: GeminiService
  ) {}

  // POST /api/conversations/chat
  async chat(req: Request, res: Response): Promise<void> {
    try {
      const { message, conversationId, title } = req.body;

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      // Tìm hoặc tạo conversation
      let conversation = conversationId 
        ? this.conversationRepo.findById(conversationId)
        : null;

      if (!conversation) {
        conversation = this.conversationRepo.create(conversationId, title);
      }

      // Thêm message của user
      conversation.addMessage('user', message);

      // Gọi Gemini để generate response
      const aiResponse = await this.geminiService.generateResponse(conversation.messages);

      // Thêm response của AI
      conversation.addMessage('assistant', aiResponse);

      // Lưu conversation
      this.conversationRepo.save(conversation);

      res.json({
        conversationId: conversation.id,
        message: aiResponse,
        conversation: conversation.toJSON()
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/conversations
  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const conversations = this.conversationRepo.getAll();
      res.json({ conversations });
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/conversations/:id
  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const conversation = this.conversationRepo.findById(id);

      if (!conversation) {
        res.status(404).json({ error: 'Conversation not found' });
        return;
      }

      res.json({ conversation: conversation.toJSON() });
    } catch (error) {
      console.error('Get conversation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/conversations
  async createConversation(req: Request, res: Response): Promise<void> {
    try {
      const { title } = req.body;
      const conversation = this.conversationRepo.create(undefined, title);
      
      res.json({ conversation: conversation.toJSON() });
    } catch (error) {
      console.error('Create conversation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE /api/conversations/:id
  async deleteConversation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = this.conversationRepo.delete(id);

      if (!deleted) {
        res.status(404).json({ error: 'Conversation not found' });
        return;
      }

      res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
      console.error('Delete conversation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}