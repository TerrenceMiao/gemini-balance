import axios, { AxiosInstance, AxiosError } from 'axios';
import KeyManager from './KeyManager';
import { ChatCompletionRequest } from '../types/common';
import { OpenAIChatCompletionResponse } from '../types/openai';

import { ServiceName } from '../types/service';

class OpenAIChatService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'https://api.openai.com/v1',
            timeout: 10000, // 10 seconds timeout
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async complete(request: ChatCompletionRequest): Promise<OpenAIChatCompletionResponse> {
        const apiKey = KeyManager.getKey(ServiceName.OpenAI);
        if (!apiKey) {
            throw new Error('No API key available for OpenAI');
        }

        try {
            const response = await this.axiosInstance.post(
                '/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: request.prompt }]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );

            return { response: response.data.choices[0].message.content };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                throw new Error(`OpenAI API error: ${axiosError.message} - ${(axiosError.response?.data as any)?.error?.message || 'Unknown'}`);
            } else if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('An unknown error occurred during OpenAI API call');
            }
        }
    }
}

export default new OpenAIChatService();