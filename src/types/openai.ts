import { ChatCompletionRequest } from './common';

export interface OpenAIChatCompletionRequest extends ChatCompletionRequest {

export interface OpenAIChatCompletionResponse {
    response: string;
}