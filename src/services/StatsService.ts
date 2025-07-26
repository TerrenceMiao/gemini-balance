class StatsService {
  public getApiUsageStats() {
    return {
      calls_1m: { total: 0, success: 0, failure: 0 },
      calls_1h: { total: 0, success: 0, failure: 0 },
      calls_24h: { total: 0, success: 0, failure: 0 },
      calls_month: { total: 0, success: 0, failure: 0 },
    };
  }
}

export const statsService = new StatsService();
