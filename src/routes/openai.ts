import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import OpenAIChatService from '../services/OpenAIChatService';
import { ChatCompletionRequest } from '../types/common';

const openaiChatCompletionSchema = {
    type: 'object',
    required: ['prompt'],
    properties: {
        prompt: { type: 'string' }
    }
};

export default async function (fastify: FastifyInstance) {
    fastify.post('/chat/completions', {
        schema: {
            body: openaiChatCompletionSchema
        }
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const reqBody = request.body as ChatCompletionRequest;
            const result = await OpenAIChatService.complete(reqBody);
            reply.send(result);
        } catch (error) {
            if (error instanceof Error) {
                reply.status(500).send({ error: error.message });
            } else {
                reply.status(500).send({ error: 'An unknown error occurred' });
            }
        }
    });
}