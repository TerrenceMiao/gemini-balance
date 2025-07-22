import { ChatCompletionRequest } from './common';

export interface OpenAIChatCompletionRequest extends ChatCompletionRequest {
    // Add any OpenAI-specific request parameters here
}

export interface OpenAIChatCompletionResponse {
    response: string;
}