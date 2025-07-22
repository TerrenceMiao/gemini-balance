import Fastify, { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';
import routes from './routes';
import KeyManager from './services/KeyManager';
import { ServiceName } from './types/service';

dotenv.config();

const fastify: FastifyInstance = Fastify({ logger: true });
const port = process.env.PORT || 8000;

// Load API keys into KeyManager
if (process.env.GEMINI_API_KEY) {
    KeyManager.addKey(ServiceName.Gemini, process.env.GEMINI_API_KEY);
}
if (process.env.OPENAI_API_KEY) {
    KeyManager.addKey(ServiceName.OpenAI, process.env.OPENAI_API_KEY);
}

fastify.register(routes, { prefix: '/v1' });

const start = async () => {
  try {
    await fastify.listen({ port: Number(port) });
    console.log(`[server]: Server is running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();