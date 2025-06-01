import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ApiKeyService } from '../services/ApiKeyService';
import { TYPES } from '../types/types';

@injectable()
export class ApiKeyController {
  constructor(@inject(TYPES.ApiKeyService) private apiKeyService: ApiKeyService) {}

  // GET /api/keys - Get all API keys (without exposing the actual keys)
  async getAllKeys(req: Request, res: Response): Promise<void> {
    try {
      const keys = this.apiKeyService.getAllKeys();
      const stats = this.apiKeyService.getStats();
      
      res.json({
        success: true,
        data: {
          keys,
          stats
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get API keys'
      });
    }
  }

  // POST /api/keys - Add new API key
  async addKey(req: Request, res: Response): Promise<void> {
    try {
      const { key, nickname } = req.body;
      
      if (!key || typeof key !== 'string') {
        res.status(400).json({
          success: false,
          error: 'API key is required and must be a string'
        });
        return;
      }

      // Test the key before adding
      const testResult = await this.apiKeyService.testApiKey(key);
      if (!testResult.isValid) {
        res.status(400).json({
          success: false,
          error: `Invalid API key: ${testResult.error}`
        });
        return;
      }

      const keyId = this.apiKeyService.addApiKey(key, nickname);
      
      res.status(201).json({
        success: true,
        data: {
          keyId,
          message: 'API key added successfully',
          workingKeys: this.apiKeyService.getWorkingKeyCount()
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to add API key'
      });
    }
  }

  // DELETE /api/keys/:keyId - Remove API key
  async removeKey(req: Request, res: Response): Promise<void> {
    try {
      const { keyId } = req.params;
      
      const removed = this.apiKeyService.removeApiKey(keyId);
      
      if (!removed) {
        res.status(404).json({
          success: false,
          error: 'API key not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          message: 'API key removed successfully',
          workingKeys: this.apiKeyService.getWorkingKeyCount()
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to remove API key'
      });
    }
  }

  // POST /api/keys/test - Test a specific API key
  async testKey(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.body;
      
      if (!key || typeof key !== 'string') {
        res.status(400).json({
          success: false,
          error: 'API key is required and must be a string'
        });
        return;
      }

      const result = await this.apiKeyService.testApiKey(key);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to test API key'
      });
    }
  }

  // POST /api/keys/validate-all - Test all stored API keys
  async validateAllKeys(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.apiKeyService.validateAllKeys();
      
      res.json({
        success: true,
        data: {
          ...result,
          workingKeys: this.apiKeyService.getWorkingKeyCount(),
          message: `Validated ${result.tested} keys: ${result.valid} valid, ${result.invalid} invalid`
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to validate API keys'
      });
    }
  }

  // POST /api/keys/cleanup - Clean up expired/invalid keys
  async cleanupKeys(req: Request, res: Response): Promise<void> {
    try {
      const removedCount = this.apiKeyService.cleanupExpiredKeys();
      
      res.json({
        success: true,
        data: {
          removedCount,
          workingKeys: this.apiKeyService.getWorkingKeyCount(),
          message: `Removed ${removedCount} expired/invalid keys`
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to cleanup API keys'
      });
    }
  }

  // GET /api/keys/stats - Get API key statistics
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = this.apiKeyService.getStats();
      
      res.json({
        success: true,
        data: {
          ...stats,
          workingKeys: this.apiKeyService.getWorkingKeyCount()
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get API key statistics'
      });
    }
  }

  // PUT /api/keys/:keyId/nickname - Update key nickname
  async updateKeyNickname(req: Request, res: Response): Promise<void> {
    try {
      const { keyId } = req.params;
      const { nickname } = req.body;
      
      if (!nickname || typeof nickname !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Nickname is required and must be a string'
        });
        return;
      }

      const updated = this.apiKeyService.updateKeyNickname(keyId, nickname);
      
      if (!updated) {
        res.status(404).json({
          success: false,
          error: 'API key not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          message: 'API key nickname updated successfully'
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update API key nickname'
      });
    }
  }

  // GET /api/keys/:keyId - Get specific key info
  async getKeyInfo(req: Request, res: Response): Promise<void> {
    try {
      const { keyId } = req.params;
      
      const keyInfo = this.apiKeyService.getKeyInfo(keyId);
      
      if (!keyInfo) {
        res.status(404).json({
          success: false,
          error: 'API key not found'
        });
        return;
      }

      res.json({
        success: true,
        data: keyInfo
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get API key info'
      });
    }
  }
} 