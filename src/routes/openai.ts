import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import OpenAIChatService from '../services/OpenAIChatService';
import { OpenAIChatCompletionRequest } from '../types/openai';

export default async function (fastify: FastifyInstance) {
    fastify.post('/chat/completions', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const reqBody = request.body as OpenAIChatCompletionRequest;
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