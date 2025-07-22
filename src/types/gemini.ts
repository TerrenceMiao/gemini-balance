import { ChatCompletionRequest } from './common';

export interface GeminiChatCompletionRequest extends ChatCompletionRequest {
    // Add any Gemini-specific request parameters here
}

export interface GeminiChatCompletionResponse {
    response: string;
}