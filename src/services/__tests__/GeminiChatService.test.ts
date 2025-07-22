// Mock axios and set up the mock instance before any imports
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockAxiosInstance = {
  interceptors: {
    request: { use: jest.fn() }
  },
  post: jest.fn()
};
(mockedAxios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

import { GeminiChatService } from '../GeminiChatService';
import KeyManager from '../KeyManager';
import { ServiceName } from '../../types/service';
import { ChatCompletionRequest } from '../../types/common';


describe('GeminiChatService', () => {
  let service: GeminiChatService;
  const dummyKey = 'dummy-key';
  const request: ChatCompletionRequest = { prompt: 'Hello world' };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockedAxios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
    service = new GeminiChatService();
    KeyManager.addKey(ServiceName.Gemini, dummyKey);
  });

  afterEach(() => {
    // Remove the key for isolation
    (KeyManager as any).keys = { Gemini: [], OpenAI: [] };
  });

  it('returns response on success', async () => {
    mockedAxios.create.mockReturnThis();
    mockAxiosInstance.post.mockResolvedValue({
      data: {
        candidates: [
          { content: { parts: [{ text: 'response text' }] } }
        ]
      }
    });
    const res = await service.complete(request);
    expect(res.response).toBe('response text');
  });

  it('throws if no API key is available', async () => {
    (KeyManager as any).keys = { Gemini: [], OpenAI: [] };
    await expect(service.complete(request)).rejects.toThrow('No API key available for Gemini');
  });

  it('throws on 401 error', async () => {
    ((axios.isAxiosError as unknown) as jest.Mock).mockReturnValue(true);
    mockAxiosInstance.post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { error: { message: 'unauthorized' } } }
    });
    await expect(service.complete(request)).rejects.toThrow(/authentication/);
  });

  it('throws on 403 error', async () => {
    ((axios.isAxiosError as unknown) as jest.Mock).mockReturnValue(true);
    mockAxiosInstance.post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 403, data: { error: { message: 'forbidden' } } }
    });
    await expect(service.complete(request)).rejects.toThrow(/authentication/);
  });

  it('throws on 404 error', async () => {
    ((axios.isAxiosError as unknown) as jest.Mock).mockReturnValue(true);
    mockAxiosInstance.post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 404, data: { error: { message: 'not found' } } }
    });
    await expect(service.complete(request)).rejects.toThrow(/model not found/);
  });

  it('throws on 429 error', async () => {
    ((axios.isAxiosError as unknown) as jest.Mock).mockReturnValue(true);
    mockAxiosInstance.post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 429, data: { error: { message: 'rate limit' } } }
    });
    await expect(service.complete(request)).rejects.toThrow(/rate limit/);
  });

  it('throws on timeout error', async () => {
    ((axios.isAxiosError as unknown) as jest.Mock).mockReturnValue(true);
    mockAxiosInstance.post.mockRejectedValue({
      isAxiosError: true,
      code: 'ECONNABORTED',
      response: { status: 504, data: { error: { message: 'timeout' } } }
    });
    await expect(service.complete(request)).rejects.toThrow(/timed out/);
  });

  it('forwards parameters from request', async () => {
    mockedAxios.create.mockReturnThis();
    mockAxiosInstance.post.mockResolvedValue({
      data: {
        candidates: [
          { content: { parts: [{ text: 'ok' }] } }
        ]
      }
    });
    const req: ChatCompletionRequest = {
      prompt: 'test',
      temperature: 0.5,
      max_tokens: 100,
      top_p: 0.8,
      top_k: 10,
      model: 'custom-model'
    };
    await service.complete(req);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      expect.stringContaining('/models/custom-model'),
      expect.objectContaining({
        generationConfig: expect.objectContaining({
          temperature: 0.5,
          maxOutputTokens: 100,
          topP: 0.8,
          topK: 10
        })
      })
    );
  });
}); 