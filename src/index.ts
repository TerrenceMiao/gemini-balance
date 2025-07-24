import Fastify, { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import routes from "./routes";
import KeyManager from "./services/KeyManager";
import { ServiceName } from "./types/service";
import { validateConfig } from "./config";
import { ApiError } from "./errors/ApiError";
// Import config if needed later
// import { config } from './config';

// Load environment variables
dotenv.config();

// Validate configuration at startup
try {
  validateConfig();
} catch (err) {
  console.error(`[config]: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

// Create Fastify instance with configuration
const fastify: FastifyInstance = Fastify({
  logger: true,
  trustProxy: true, // Enable if behind a reverse proxy
  disableRequestLogging: process.env.NODE_ENV === "production", // Optional: disable request logging in production
});

// Get port from environment or use default
const port = process.env.PORT || 12000;

// Load API keys into KeyManager
if (process.env.GEMINI_API_KEYS) {
  // Support comma-separated list of API keys
  const geminiKeys = process.env.GEMINI_API_KEYS.split(",").map((key) =>
    key.trim().replace(/\[/g, "").replace(/\]/g, "")
  );
  geminiKeys.forEach((key) => {
    console.debug("Gemini key = " + key);
    if (key) KeyManager.addKey(ServiceName.Gemini, key);
  });
}

if (process.env.OPENAI_API_KEYS) {
  // Support comma-separated list of API keys
  const openaiKeys = process.env.OPENAI_API_KEYS.split(",").map((key) =>
    key.trim().replace(/\[/g, "").replace(/\]/g, "")
  );
  openaiKeys.forEach((key) => {
    console.debug("OpenAI key = " + key);
    if (key) KeyManager.addKey(ServiceName.OpenAI, key);
  });
}

// Check if we have any API keys configured
if (!process.env.GEMINI_API_KEYS && !process.env.OPENAI_API_KEYS) {
  console.warn(
    "No API keys configured. Please set GEMINI_API_KEY and/or OPENAI_API_KEY environment variables."
  );
}

// No health handler needed here as it's defined in the health routes module

// Set custom 404 handler
fastify.setNotFoundHandler(async (request, reply) => {
  // Default 404 response
  reply
    .code(404)
    .send({
      error: "Not Found",
      message: `Route ${request.method}:${request.url} not found`,
    });
});

// Import health routes
import healthRoutes from "./routes/health";

// Register health routes
fastify.register(healthRoutes, { prefix: "/health" });

// Register API routes with prefix
fastify.register(routes, { prefix: "/v1" });

// Add debug logging for registered routes
fastify.ready(() => {
  console.log("Registered routes:");
  console.log(fastify.printRoutes());
});

// Add global error handler
fastify.setErrorHandler((error, _request, reply) => {
  fastify.log.error(error);

  if (error instanceof ApiError) {
    reply.status(error.statusCode).send({
      error: "API Error",
      message: error.message,
    });
  } else {
    reply.status(500).send({
      error: "Internal Server Error",
      message:
        process.env.NODE_ENV === "production"
          ? "An error occurred"
          : (error as Error).message,
    });
  }
});

/**
 * Start the server with graceful shutdown handling
 */
const start = async () => {
  try {
    console.log(
      "\x1b[34m%s\x1b[0m",
      `
  /$$$$$$                          /$$           /$$       /$$$$$$$                                        
 /$$__  $$                        |__/          |__/      | $$__  $$                                       
| $$  \\__/  /$$$$$$  /$$$$$$/$$$$  /$$ /$$$$$$$  /$$      | $$  \\ $$ /$$$$$$   /$$$$$$  /$$   /$$ /$$   /$$
| $$ /$$$$ /$$__  $$| $$_  $$_  $$| $$| $$__  $$| $$      | $$$$$$$//$$__  $$ /$$__  $$|  $$ /$$/| $$  | $$
| $$|_  $$| $$$$$$$$| $$ \\ $$ \\ $$| $$| $$  \\ $$| $$      | $$____/| $$  \\__/| $$  \\ $$ \\  $$$$/ | $$  | $$
| $$  \\ $$| $$_____/| $$ | $$ | $$| $$| $$  | $$| $$      | $$     | $$      | $$  | $$  >$$  $$ | $$  | $$
|  $$$$$$/|  $$$$$$$| $$ | $$ | $$| $$| $$  | $$| $$      | $$     | $$      |  $$$$$$/ /$$/\\  $$|  $$$$$$$
 \\______/  \\_______/|__/ |__/ |__/|__/|__/  |__/|__/      |__/     |__/       \\______/ |__/  \\__/ \\____  $$
                                                                                                  /$$  | $$
                                                                                                 |  $$$$$$/
                                                                                                  \\______/ 
      `
    );

    // Allow connections from any host
    await fastify.listen({ port: Number(port), host: "0.0.0.0" });
    console.log(`[server]: Server is running at http://localhost:${port}`);

    // Log API key status
    const geminiKey = KeyManager.getKey(ServiceName.Gemini);
    const openaiKey = KeyManager.getKey(ServiceName.OpenAI);
    console.log(`[server]: Gemini API key configured: ${geminiKey ? "\x1b[92mtrue\x1b[0m" : "\x1b[91mfalse\x1b[0m"}`);
    console.log(`[server]: OpenAI API key configured: ${openaiKey ? "\x1b[92mtrue\x1b[0m" : "\x1b[91mfalse\x1b[0m"}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`[server]: ${signal} signal received, shutting down gracefully`);
  try {
    await fastify.close();
    console.log("[server]: Server closed successfully");
    process.exit(0);
  } catch (err) {
    console.error("[server]: Error during shutdown:", err);
    process.exit(1);
  }
};

// Listen for termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

start();
