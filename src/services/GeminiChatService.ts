import axios from 'axios';
import KeyManager from './KeyManager';
import { GeminiChatCompletionRequest, GeminiChatCompletionResponse } from '../types/gemini';

class GeminiChatService {
    async complete(request: GeminiChatCompletionRequest): Promise<GeminiChatCompletionResponse> {
        const apiKey = KeyManager.getKey('gemini');
        if (!apiKey) {
            throw new Error('No API key available for Gemini');
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: request.prompt
                    }]
                }]
            }
        );

        return { response: response.data.candidates[0].content.parts[0].text };
    }
}

export default new GeminiChatService();