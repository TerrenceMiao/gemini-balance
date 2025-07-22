import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import GeminiChatService from '../services/GeminiChatService';
import { ChatCompletionRequest, ErrorResponse } from '../types/common';

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
        const startTime = Date.now();
        try {
            const reqBody = request.body as ChatCompletionRequest;
            
            // Log request (excluding sensitive data)
            fastify.log.info({
                service: 'gemini',
                action: 'chat_completion',
                model: reqBody.model || 'default',
                promptLength: reqBody.prompt.length
            });
            
            const result = await GeminiChatService.complete(reqBody);
            
            // Log response time
            const responseTime = Date.now() - startTime;
            fastify.log.info({
                service: 'gemini',
                action: 'chat_completion_success',
                responseTime: `${responseTime}ms`
            });
            
            reply.send(result);
        } catch (error) {
            // Log error
            const responseTime = Date.now() - startTime;
            fastify.log.error({
                service: 'gemini',
                action: 'chat_completion_error',
                responseTime: `${responseTime}ms`,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            
            const errorResponse: ErrorResponse = {
                error: 'Gemini API Error',
                message: error instanceof Error ? error.message : 'An unknown error occurred',
                status: 500,
                timestamp: new Date().toISOString()
            };
            
            // Set appropriate status code based on error type
            if (error instanceof Error) {
                if (error.message.includes('rate limit')) {
                    reply.status(429).send(errorResponse);
                } else if (error.message.includes('authentication')) {
                    reply.status(401).send(errorResponse);
                } else if (error.message.includes('not found')) {
                    reply.status(404).send(errorResponse);
                } else if (error.message.includes('timed out')) {
                    reply.status(504).send(errorResponse);
                } else {
                    reply.status(500).send(errorResponse);
                }
            } else {
                reply.status(500).send(errorResponse);
            }
        }
    });
}