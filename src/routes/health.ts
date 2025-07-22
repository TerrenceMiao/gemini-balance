import { FastifyInstance } from 'fastify';

export default async function healthRoutes(fastify: FastifyInstance) {
  // Health endpoint handler function
  const healthHandler = async (_request: any, reply: any) => {
    reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  };

  // Root health endpoint with empty path (this becomes /health when registered with prefix)
  fastify.get('', healthHandler);
}