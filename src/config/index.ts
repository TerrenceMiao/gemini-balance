import dotenv from 'dotenv';

export const config = {
    port: process.env.PORT || 8000,
    geminiApiKey: process.env.GEMINI_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
};