import { injectable } from 'inversify';
import { GoogleGenAI } from '@google/genai';

interface ApiKeyInfo {
  id: string;
  key: string;
  isActive: boolean;
  lastUsed: Date;
  errorCount: number;
  createdAt: Date;
  expiresAt?: Date;
  nickname?: string;
}

interface ApiKeyStats {
  totalKeys: number;
  activeKeys: number;
  expiredKeys: number;
  errorKeys: number;
}

@injectable()
export class ApiKeyService {
  private apiKeys: Map<string, ApiKeyInfo> = new Map();
  private currentKeyIndex: number = 0;
  private maxErrorCount: number = 3;

  constructor() {
    // Load initial key from environment if exists
    const initialKey = process.env.GEMINI_API_KEY;
    if (initialKey) {
      this.addApiKey(initialKey, 'Default Environment Key');
    }
  }

  // Add new API key
  addApiKey(key: string, nickname?: string): string {
    const keyId = `key_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const keyInfo: ApiKeyInfo = {
      id: keyId,
      key: key,
      isActive: true,
      lastUsed: new Date(),
      errorCount: 0,
      createdAt: new Date(),
      nickname: nickname || `Key ${this.apiKeys.size + 1}`
    };

    this.apiKeys.set(keyId, keyInfo);
    return keyId;
  }

  // Remove API key
  removeApiKey(keyId: string): boolean {
    return this.apiKeys.delete(keyId);
  }

  // Get all API keys (without exposing the actual keys)
  getAllKeys(): Omit<ApiKeyInfo, 'key'>[] {
    return Array.from(this.apiKeys.values()).map(keyInfo => ({
      id: keyInfo.id,
      isActive: keyInfo.isActive,
      lastUsed: keyInfo.lastUsed,
      errorCount: keyInfo.errorCount,
      createdAt: keyInfo.createdAt,
      expiresAt: keyInfo.expiresAt,
      nickname: keyInfo.nickname
    }));
  }

  // Get API key statistics
  getStats(): ApiKeyStats {
    const keys = Array.from(this.apiKeys.values());
    return {
      totalKeys: keys.length,
      activeKeys: keys.filter(k => k.isActive).length,
      expiredKeys: keys.filter(k => k.errorCount >= this.maxErrorCount).length,
      errorKeys: keys.filter(k => k.errorCount > 0 && k.errorCount < this.maxErrorCount).length
    };
  }

  // Get next available API key using round-robin
  getNextApiKey(): string | null {
    const activeKeys = Array.from(this.apiKeys.values()).filter(k => k.isActive && k.errorCount < this.maxErrorCount);
    
    if (activeKeys.length === 0) {
      return null;
    }

    // Round-robin selection
    const selectedKey = activeKeys[this.currentKeyIndex % activeKeys.length];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % activeKeys.length;
    
    // Update last used
    selectedKey.lastUsed = new Date();
    
    return selectedKey.key;
  }

  // Mark key as having an error
  markKeyError(key: string, error: any): void {
    const keyInfo = Array.from(this.apiKeys.values()).find(k => k.key === key);
    if (!keyInfo) return;

    keyInfo.errorCount++;
    
    // Check if error indicates expired key
    const isExpiredError = this.isExpiredKeyError(error);
    if (isExpiredError) {
      keyInfo.errorCount = this.maxErrorCount; // Immediately mark as invalid
      keyInfo.isActive = false;
      keyInfo.expiresAt = new Date();
    }

    // Auto-remove if too many errors
    if (keyInfo.errorCount >= this.maxErrorCount) {
      keyInfo.isActive = false;
      console.log(`API Key ${keyInfo.nickname} marked as inactive due to errors`);
    }
  }

  // Reset error count for a key (when it works again)
  resetKeyError(key: string): void {
    const keyInfo = Array.from(this.apiKeys.values()).find(k => k.key === key);
    if (keyInfo) {
      keyInfo.errorCount = 0;
    }
  }

  // Check if error indicates expired key
  private isExpiredKeyError(error: any): boolean {
    if (!error) return false;
    
    const errorMessage = error.message || error.toString() || '';
    const errorStatus = error.status || error.code || '';
    
    return (
      errorMessage.includes('API key expired') ||
      errorMessage.includes('INVALID_ARGUMENT') ||
      errorMessage.includes('API_KEY_INVALID') ||
      errorStatus === 400 ||
      (error.details && Array.isArray(error.details) && 
       error.details.some((detail: any) => 
         detail.reason === 'API_KEY_INVALID' || 
         detail['@type']?.includes('ErrorInfo')
       ))
    );
  }

  // Clean up expired/invalid keys
  cleanupExpiredKeys(): number {
    let removedCount = 0;
    
    for (const [keyId, keyInfo] of this.apiKeys.entries()) {
      if (keyInfo.errorCount >= this.maxErrorCount || !keyInfo.isActive) {
        this.apiKeys.delete(keyId);
        removedCount++;
        console.log(`Removed expired/invalid API key: ${keyInfo.nickname}`);
      }
    }
    
    return removedCount;
  }

  // Test a specific API key
  async testApiKey(key: string): Promise<{ isValid: boolean; error?: string }> {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-05-20",
        contents: "Test connection - respond with just 'OK'"
      });
      
      return { isValid: true };
    } catch (error: any) {
      return { 
        isValid: false, 
        error: error.message || 'Unknown error' 
      };
    }
  }

  // Test all keys and update their status
  async validateAllKeys(): Promise<{ tested: number; valid: number; invalid: number }> {
    let tested = 0;
    let valid = 0;
    let invalid = 0;

    for (const [keyId, keyInfo] of this.apiKeys.entries()) {
      tested++;
      const result = await this.testApiKey(keyInfo.key);
      
      if (result.isValid) {
        valid++;
        keyInfo.errorCount = 0;
        keyInfo.isActive = true;
      } else {
        invalid++;
        keyInfo.errorCount = this.maxErrorCount;
        keyInfo.isActive = false;
        
        if (this.isExpiredKeyError({ message: result.error })) {
          keyInfo.expiresAt = new Date();
        }
      }
    }

    return { tested, valid, invalid };
  }

  // Get current working key count
  getWorkingKeyCount(): number {
    return Array.from(this.apiKeys.values()).filter(k => k.isActive && k.errorCount < this.maxErrorCount).length;
  }

  // Update key nickname
  updateKeyNickname(keyId: string, nickname: string): boolean {
    const keyInfo = this.apiKeys.get(keyId);
    if (keyInfo) {
      keyInfo.nickname = nickname;
      return true;
    }
    return false;
  }

  // Get key info by ID (without exposing the actual key)
  getKeyInfo(keyId: string): Omit<ApiKeyInfo, 'key'> | null {
    const keyInfo = this.apiKeys.get(keyId);
    if (!keyInfo) return null;

    return {
      id: keyInfo.id,
      isActive: keyInfo.isActive,
      lastUsed: keyInfo.lastUsed,
      errorCount: keyInfo.errorCount,
      createdAt: keyInfo.createdAt,
      expiresAt: keyInfo.expiresAt,
      nickname: keyInfo.nickname
    };
  }
}

export { ApiKeyInfo, ApiKeyStats }; 