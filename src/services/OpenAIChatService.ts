import axios, { AxiosInstance, AxiosError } from 'axios';
import KeyManager from './KeyManager';
import { ChatCompletionRequest } from '../types/common';
import { OpenAIChatCompletionResponse } from '../types/openai';
import { ServiceName } from '../types/service';
import { ApiError } from '../errors/ApiError';

// Default timeout in milliseconds
const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Service for interacting with OpenAI's API
 */
class OpenAIChatService {
    private axiosInstance: AxiosInstance;
    private readonly baseURL: string;
    private readonly timeout: number;

    constructor() {
        this.baseURL = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
        this.timeout = Number(process.env.OPENAI_API_TIMEOUT) || DEFAULT_TIMEOUT;
        
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
            // Don't log authorization headers
            if (request.headers.Authorization) {
                console.debug(`OpenAI API request to: ${request.baseURL}${request.url}`);
            }
            return request;
        });
    }

    /**
     * Send a completion request to the OpenAI API
     * @param request The chat completion request
     * @returns A promise resolving to the chat completion response
     */
    async complete(request: ChatCompletionRequest): Promise<OpenAIChatCompletionResponse> {
        const apiKey = KeyManager.getKey(ServiceName.OpenAI);
        if (!apiKey) {
            throw new Error('No API key available for OpenAI');
        }

        // Default to gpt-3.5-turbo model unless specified in environment
        const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
        const startTime = Date.now();
        
        try {
            const response = await this.axiosInstance.post(
                '/chat/completions',
                {
                    model: model,
                    messages: [{ role: 'user', content: request.prompt }],
                    // Optional parameters that could be added
                    temperature: 0.7,
                    max_tokens: 2048,
                    top_p: 0.95,
                    frequency_penalty: 0,
                    presence_penalty: 0
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );

            const responseTime = Date.now() - startTime;
            console.debug(`OpenAI API response received in ${responseTime}ms`);
            
            // Handle potential error responses that don't throw exceptions
            if (!response.data.choices || response.data.choices.length === 0) {
                throw new Error('OpenAI API returned no choices');
            }
            
            return { response: response.data.choices[0].message.content };
        } catch (error) {
            const responseTime = Date.now() - startTime;
            console.error(`OpenAI API error after ${responseTime}ms`);
            
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const statusCode = axiosError.response?.status;
                const errorMessage = (axiosError.response?.data as any)?.error?.message || 'Unknown error';
                
                // Handle specific error cases
                if (statusCode === 429) {
                    throw new ApiError(`OpenAI API rate limit exceeded: ${errorMessage}`, 429);
                } else if (statusCode === 401 || statusCode === 403) {
                    throw new ApiError(`OpenAI API authentication error: ${errorMessage}`, statusCode);
                } else if (statusCode === 404) {
                    throw new ApiError(`OpenAI API model not found: ${errorMessage}`, 404);
                } else if (axiosError.code === 'ECONNABORTED') {
                    throw new ApiError(`OpenAI API request timed out after ${this.timeout}ms`, 504);
                } else {
                    throw new ApiError(`OpenAI API error (${statusCode}): ${errorMessage}`, statusCode || 500);
                }
            } else if (error instanceof Error) {
                throw error;
            } else {
                throw new ApiError('An unknown error occurred during OpenAI API call', 500);
            }
        }
    }
}

export default new OpenAIChatService();