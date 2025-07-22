import axios, { AxiosInstance, AxiosError } from 'axios';
import KeyManager from './KeyManager';
import { ChatCompletionRequest } from '../types/common';
import { GeminiChatCompletionResponse } from '../types/gemini';

import { ServiceName } from '../types/service';

class GeminiChatService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'https://generativelanguage.googleapis.com/v1beta',
            timeout: 10000, // 10 seconds timeout
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async complete(request: ChatCompletionRequest): Promise<GeminiChatCompletionResponse> {
        const apiKey = KeyManager.getKey(ServiceName.Gemini);
        if (!apiKey) {
            throw new Error('No API key available for Gemini');
        }

        try {
            const response = await this.axiosInstance.post(
                `/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: request.prompt
                        }]
                    }]
                }
            );

            return { response: response.data.candidates[0].content.parts[0].text };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                throw new Error(`Gemini API error: ${axiosError.message} - ${(axiosError.response?.data as any)?.error?.message || 'Unknown'}`);
            } else if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('An unknown error occurred during Gemini API call');
            }
        }
    }
}

export default new GeminiChatService();