import { Request, Response } from 'express';
import { keyManager } from '../services/KeyManager';
import { statsService } from '../services/StatsService';

export const getKeysStatusPage = (req: Request, res: Response) => {
  const keysStatus = keyManager.getKeysByStatus();
  const apiStats = statsService.getApiUsageStats();

  res.render('keys_status', {
    total_keys: Object.keys(keysStatus.valid_keys).length + Object.keys(keysStatus.invalid_keys).length,
    valid_key_count: Object.keys(keysStatus.valid_keys).length,
    invalid_key_count: Object.keys(keysStatus.invalid_keys).length,
    api_stats: apiStats,
  });
};
