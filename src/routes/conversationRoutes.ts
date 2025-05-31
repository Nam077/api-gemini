import { Router } from 'express';
import { container } from '../config/container';
import { ConversationController } from '../controllers/ConversationController';

export const setupConversationRoutes = (router: Router): void => {
  const conversationController = container.get<ConversationController>(ConversationController);

  // POST /api/conversations/chat - Chat với Gemini
  router.post('/conversations/chat', conversationController.chat.bind(conversationController));

  // GET /api/conversations - Lấy tất cả conversations
  router.get('/conversations', conversationController.getConversations.bind(conversationController));

  // GET /api/conversations/:id - Lấy conversation theo ID
  router.get('/conversations/:id', conversationController.getConversation.bind(conversationController));

  // POST /api/conversations - Tạo conversation mới
  router.post('/conversations', conversationController.createConversation.bind(conversationController));

  // DELETE /api/conversations/:id - Xóa conversation
  router.delete('/conversations/:id', conversationController.deleteConversation.bind(conversationController));
};