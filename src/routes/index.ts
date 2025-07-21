import { FastifyInstance } from 'fastify';
import geminiRoutes from './gemini';
import openaiRoutes from './openai';

export default async function (fastify: FastifyInstance) {
    fastify.register(geminiRoutes, { prefix: '/gemini' });
    fastify.register(openaiRoutes, { prefix: '/openai' });
}