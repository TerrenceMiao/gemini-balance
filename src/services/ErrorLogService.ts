class ErrorLogService {
  public getErrorLogs() {
    return {
      logs: [
        { id: 1, key: 'key1', errorType: 'Error', errorCode: 500, modelName: 'model1', requestTime: new Date().toISOString() },
        { id: 2, key: 'key2', errorType: 'Error', errorCode: 500, modelName: 'model2', requestTime: new Date().toISOString() },
      ],
      total: 2,
    };
  }
}

export const errorLogService = new ErrorLogService();
