import { Router } from 'express';
import { container } from '../config/container';
import { ChatSessionController } from '../controllers/ChatSessionController';
import { TYPES } from '../types/types';

export const setupChatSessionRoutes = (router: Router): void => {
  const chatSessionController = container.get<ChatSessionController>(TYPES.ChatSessionController);

  // Chat Session Management Routes
  router.post('/sessions', chatSessionController.createSession.bind(chatSessionController));
  router.post('/sessions/:sessionId/messages', chatSessionController.sendMessage.bind(chatSessionController));
  router.get('/sessions/:sessionId/history', chatSessionController.getHistory.bind(chatSessionController));
  router.post('/sessions/:sessionId/save', chatSessionController.saveSession.bind(chatSessionController));
  router.post('/sessions/:sessionId/load', chatSessionController.loadSession.bind(chatSessionController));
  router.delete('/sessions/:sessionId', chatSessionController.deleteSession.bind(chatSessionController));
  router.get('/sessions', chatSessionController.getActiveSessions.bind(chatSessionController));
};