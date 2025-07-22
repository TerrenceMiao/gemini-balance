import axios, { AxiosInstance, AxiosError } from 'axios';
import KeyManager from './KeyManager';
import { ChatCompletionRequest } from '../types/common';
import { GeminiChatCompletionResponse } from '../types/gemini';
import { ServiceName } from '../types/service';
import { ApiError } from '../errors/ApiError';

// Default timeout in milliseconds
const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Service for interacting with Google's Gemini API
 */
export class GeminiChatService {
    private axiosInstance: AxiosInstance;
    private readonly baseURL: string;
    private readonly timeout: number;

    constructor() {
        this.baseURL = process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
        this.timeout = Number(process.env.GEMINI_API_TIMEOUT) || DEFAULT_TIMEOUT;
        
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'GeminiProxy/1.0',
            },
        });
        
        // Add request interceptor for logging (if needed)
        this.axiosInstance.interceptors.request.use(request => {
            // Remove API key from logs
            const redactedUrl = request.url?.replace(/key=[^&]+/, 'key=REDACTED');
            console.debug(`Gemini API request to: ${redactedUrl}`);
            return request;
        });
    }

    /**
     * Send a completion request to the Gemini API
     * @param request The chat completion request
     * @returns A promise resolving to the chat completion response
     */
    async complete(request: ChatCompletionRequest): Promise<GeminiChatCompletionResponse> {
        const apiKey = KeyManager.getKey(ServiceName.Gemini);
        if (!apiKey) {
            throw new Error('No API key available for Gemini');
        }

        // Use model from request or environment, fallback to gemini-pro
        const model = request.model || process.env.GEMINI_MODEL || 'gemini-pro';
        const startTime = Date.now();

        // Use parameters from request or defaults
        const temperature = request.temperature ?? 0.7;
        const maxOutputTokens = request.max_tokens ?? 2048;
        const topP = request.top_p ?? 0.95;
        const topK = request.top_k ?? 40;
        
        try {
            const response = await this.axiosInstance.post(
                `/models/${model}:generateContent?key=${apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: request.prompt
                        }]
                    }],
                    generationConfig: {
                        temperature,
                        maxOutputTokens,
                        topP,
                        topK
                    }
                }
            );

            const responseTime = Date.now() - startTime;
            console.debug(`Gemini API response received in ${responseTime}ms`);
            
            // Handle potential error responses that don't throw exceptions
            if (!response.data.candidates || response.data.candidates.length === 0) {
                throw new Error('Gemini API returned no candidates');
            }
            
            return { response: response.data.candidates[0].content.parts[0].text };
        } catch (error) {
            const responseTime = Date.now() - startTime;
            console.error(`Gemini API error after ${responseTime}ms`);
            
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const statusCode = axiosError.response?.status;
                const errorMessage = (axiosError.response?.data as any)?.error?.message || 'Unknown error';
                
                // Handle specific error cases
                if (statusCode === 429) {
                    throw new ApiError(`Gemini API rate limit exceeded: ${errorMessage}`, 429);
                } else if (statusCode === 401 || statusCode === 403) {
                    throw new ApiError(`Gemini API authentication error: ${errorMessage}`, statusCode);
                } else if (statusCode === 404) {
                    throw new ApiError(`Gemini API model not found: ${errorMessage}`, 404);
                } else if (axiosError.code === 'ECONNABORTED') {
                    throw new ApiError(`Gemini API request timed out after ${this.timeout}ms`, 504);
                } else {
                    throw new ApiError(`Gemini API error (${statusCode}): ${errorMessage}`, statusCode || 500);
                }
            } else if (error instanceof Error) {
                throw error;
            } else {
                throw new ApiError('An unknown error occurred during Gemini API call', 500);
            }
        }
    }
}

export default new GeminiChatService();