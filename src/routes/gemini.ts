import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import GeminiChatService from '../services/GeminiChatService';
import { ChatCompletionRequest } from '../types/common';

/**
 * JSON schema for validating Gemini chat completion requests
 */
const geminiChatCompletionSchema = {
    type: 'object',
    required: ['prompt'],
    properties: {
        prompt: { type: 'string' },
        temperature: { type: 'number', minimum: 0, maximum: 1 },
        max_tokens: { type: 'integer', minimum: 1 },
        top_p: { type: 'number', minimum: 0, maximum: 1 },
        top_k: { type: 'integer', minimum: 1 },
        stream: { type: 'boolean' },
        model: { type: 'string' }
    }
};

/**
 * Register Gemini API routes
 */
export default async function (fastify: FastifyInstance) {
    // Health check endpoint
    fastify.get('/health', async (_request, reply) => {
        reply.send({ status: 'ok', service: 'gemini', timestamp: new Date().toISOString() });
    });
    
    // Chat completions endpoint
    fastify.post('/chat/completions', {
        schema: {
            body: geminiChatCompletionSchema
        }
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const reqBody = request.body as ChatCompletionRequest;
        
        // Log request (excluding sensitive data)
        fastify.log.info({
            service: 'gemini',
            action: 'chat_completion',
            model: reqBody.model || 'default',
            promptLength: reqBody.prompt.length
        });
        
        const result = await GeminiChatService.complete(reqBody);
        
        reply.send(result);
    });
}