import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import GeminiChatService from '../services/GeminiChatService';
import { GeminiChatCompletionRequest } from '../types/gemini';

export default async function (fastify: FastifyInstance) {
    fastify.post('/chat/completions', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const reqBody = request.body as GeminiChatCompletionRequest;
            const result = await GeminiChatService.complete(reqBody);
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