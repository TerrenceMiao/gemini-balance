import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 12000,
    geminiApiKey: process.env.GEMINI_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
};