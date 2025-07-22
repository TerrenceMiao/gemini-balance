import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import OpenAIChatService from '../services/OpenAIChatService';
import { ChatCompletionRequest } from '../types/common';

/**
 * JSON schema for validating OpenAI chat completion requests
 */
const openaiChatCompletionSchema = {
    type: 'object',
    required: ['prompt'],
    properties: {
        prompt: { type: 'string' },
        temperature: { type: 'number', minimum: 0, maximum: 1 },
        max_tokens: { type: 'integer', minimum: 1 },
        top_p: { type: 'number', minimum: 0, maximum: 1 },
        frequency_penalty: { type: 'number', minimum: -2, maximum: 2 },
        presence_penalty: { type: 'number', minimum: -2, maximum: 2 },
        stream: { type: 'boolean' },
        model: { type: 'string' }
    }
};

/**
 * Register OpenAI API routes
 */
export default async function (fastify: FastifyInstance) {
    // Health check endpoint
    fastify.get('/health', async (_request, reply) => {
        reply.send({ status: 'ok', service: 'openai', timestamp: new Date().toISOString() });
    });
    
    // Chat completions endpoint
    fastify.post('/chat/completions', {
        schema: {
            body: openaiChatCompletionSchema
        }
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const reqBody = request.body as ChatCompletionRequest;
        
        // Log request (excluding sensitive data)
        fastify.log.info({
            service: 'openai',
            action: 'chat_completion',
            model: reqBody.model || 'default',
            promptLength: reqBody.prompt.length
        });
        
        const result = await OpenAIChatService.complete(reqBody);
        
        reply.send(result);
    });
}