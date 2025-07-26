import { config } from '../config';
import { geminiChatService } from './GeminiChatService';

class KeyManager {
  private apiKeys: string[];
  private keyFailureCounts: Map<string, number>;
  private maxFailures: number;

  constructor(apiKeys: string[]) {
    this.apiKeys = apiKeys;
    this.keyFailureCounts = new Map(apiKeys.map(key => [key, 0]));
    this.maxFailures = 3;
  }

  public getKeysByStatus() {
    const validKeys: { [key: string]: number } = {};
    const invalidKeys: { [key: string]: number } = {};

    for (const key of this.apiKeys) {
      const failCount = this.keyFailureCounts.get(key) || 0;
      if (failCount < this.maxFailures) {
        validKeys[key] = failCount;
      } else {
        invalidKeys[key] = failCount;
      }
    }

    return { valid_keys: validKeys, invalid_keys: invalidKeys };
  }

  public resetAllFailCounts() {
    for (const key of this.apiKeys) {
      this.keyFailureCounts.set(key, 0);
    }
  }

  public resetSelectedFailCounts(keys: string[]) {
    for (const key of keys) {
      if (this.keyFailureCounts.has(key)) {
        this.keyFailureCounts.set(key, 0);
      }
    }
  }

  public resetFailCount(key: string) {
    if (this.keyFailureCounts.has(key)) {
      this.keyFailureCounts.set(key, 0);
    }
  }

  public async verifyKey(key: string): Promise<boolean> {
    try {
      await geminiChatService.generateContent('gemini-pro', { contents: [{ role: 'user', parts: [{ text: 'hi' }] }] }, key);
      this.resetFailCount(key);
      return true;
    } catch (error) {
      const failCount = (this.keyFailureCounts.get(key) || 0) + 1;
      this.keyFailureCounts.set(key, failCount);
      return false;
    }
  }

  public async verifySelectedKeys(keys: string[]) {
    const successful_keys: string[] = [];
    const failed_keys: { [key: string]: string } = {};

    for (const key of keys) {
      const isValid = await this.verifyKey(key);
      if (isValid) {
        successful_keys.push(key);
      } else {
        failed_keys[key] = 'Invalid key';
      }
    }

    return {
      success: true,
      message: `Bulk verification finished. Valid: ${successful_keys.length}, Invalid: ${Object.keys(failed_keys).length}`,
      successful_keys,
      failed_keys,
      valid_count: successful_keys.length,
      invalid_count: Object.keys(failed_keys).length,
    };
  }
}

export const keyManager = new KeyManager(config.apiKeys || []);
