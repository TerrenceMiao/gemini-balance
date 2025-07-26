class GeminiChatService {
  public async generateContent(model: string, request: any, apiKey: string) {
    return {
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'Hello, world!',
              },
            ],
          },
        },
      ],
    };
  }

  public async *streamGenerateContent(model: string, request: any, apiKey: string) {
    yield 'data: {"candidates":[{"content":{"parts":[{"text":"Hello, "}]}}]}'

;
    yield 'data: {"candidates":[{"content":{"parts":[{"text":"world!"}]}}]}'

;
  }

  public async countTokens(model: string, request: any, apiKey: string) {
    return {
      totalTokens: 10,
    };
  }
}

export const geminiChatService = new GeminiChatService();
