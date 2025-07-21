import axios from 'axios';
import KeyManager from './KeyManager';
import { OpenAIChatCompletionRequest, OpenAIChatCompletionResponse } from '../types/openai';

class OpenAIChatService {
    async complete(request: OpenAIChatCompletionRequest): Promise<OpenAIChatCompletionResponse> {
        const apiKey = KeyManager.getKey('openai');
        if (!apiKey) {
            throw new Error('No API key available for OpenAI');
        }

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
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
    }
}

export default new OpenAIChatService();