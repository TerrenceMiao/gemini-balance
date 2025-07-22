/**
 * Common interface for chat completion requests
 */
export interface ChatCompletionRequest {
    prompt: string;
    temperature?: number;  // Controls randomness (0-1)
    max_tokens?: number;  // Maximum number of tokens to generate
    top_p?: number;       // Nucleus sampling parameter (0-1)
    top_k?: number;       // Top-k sampling parameter
    stream?: boolean;     // Whether to stream the response
    model?: string;       // Override the default model
}

/**
 * Common error response structure
 */
export interface ErrorResponse {
    error: string;
    message: string;
    status?: number;
    timestamp?: string;
}
