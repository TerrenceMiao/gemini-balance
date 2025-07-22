import Fastify from 'fastify';
import openaiRoute from '../openai';
import * as OpenAIServiceModule from '../../services/OpenAIChatService';

describe('OpenAI Route Integration', () => {
  let fastify: ReturnType<typeof Fastify>;

  beforeEach(async () => {
    fastify = Fastify();
    await fastify.register(openaiRoute);
    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
    jest.restoreAllMocks();
  });

  it('returns 200 and response on success', async () => {
    jest.spyOn(OpenAIServiceModule.default, 'complete').mockResolvedValue({ response: 'hello' });
    const res = await fastify.inject({
      method: 'POST',
      url: '/chat/completions',
      payload: { prompt: 'hi' }
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ response: 'hello' });
  });

  it('returns 400 for missing prompt', async () => {
    const res = await fastify.inject({
      method: 'POST',
      url: '/chat/completions',
      payload: {}
    });
    expect(res.statusCode).toBe(400);
  });

  it('returns 500 if OpenAI service throws', async () => {
    jest.spyOn(OpenAIServiceModule.default, 'complete').mockRejectedValue(new Error('OpenAI fail'));
    const res = await fastify.inject({
      method: 'POST',
      url: '/chat/completions',
      payload: { prompt: 'hi' }
    });
    expect(res.statusCode).toBe(500);
    expect(res.json().error).toBe('Internal Server Error');
  });
}); 