import { Router } from 'express';
import { container } from '../config/container';
import { ApiKeyController } from '../controllers/ApiKeyController';
import { TYPES } from '../types/types';

export const setupApiKeyRoutes = (router: Router): void => {
  const apiKeyController = container.get<ApiKeyController>(TYPES.ApiKeyController);

  // Get all API keys and statistics
  router.get('/keys', (req, res) => apiKeyController.getAllKeys(req, res));

  // Add new API key
  router.post('/keys', (req, res) => apiKeyController.addKey(req, res));

  // Get API key statistics
  router.get('/keys/stats', (req, res) => apiKeyController.getStats(req, res));

  // Test a specific API key
  router.post('/keys/test', (req, res) => apiKeyController.testKey(req, res));

  // Validate all stored API keys
  router.post('/keys/validate-all', (req, res) => apiKeyController.validateAllKeys(req, res));

  // Clean up expired/invalid keys
  router.post('/keys/cleanup', (req, res) => apiKeyController.cleanupKeys(req, res));

  // Get specific key info
  router.get('/keys/:keyId', (req, res) => apiKeyController.getKeyInfo(req, res));

  // Remove API key
  router.delete('/keys/:keyId', (req, res) => apiKeyController.removeKey(req, res));

  // Update key nickname
  router.put('/keys/:keyId/nickname', (req, res) => apiKeyController.updateKeyNickname(req, res));
}; 