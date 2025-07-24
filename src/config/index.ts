import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration loaded from environment variables.
 */
export const config = {
    port: process.env.PORT || 3000,
    geminiApiTimeout: process.env.GEMINI_API_TIMEOUT,
    geminiApiBaseUrl: process.env.GEMINI_API_BASE_URL,
};

/**
 * Validates required environment variables and config values.
 * Throws an error if any required config is missing or invalid.
 */
export function validateConfig() {
    const missing: string[] = [];
    
    // Validate port
    const portNum = Number(config.port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        missing.push('PORT (must be a valid number between 1 and 65535)');
    }
    
    // Validate Gemini API timeout if present
    if (config.geminiApiTimeout !== undefined) {
        const timeoutNum = Number(config.geminiApiTimeout);
        if (isNaN(timeoutNum) || timeoutNum < 1000 || timeoutNum > 120000) {
            missing.push('GEMINI_API_TIMEOUT (must be a valid number between 1000 and 120000 ms)');
        }
    }
    
    // Validate Gemini API base URL if present
    if (config.geminiApiBaseUrl !== undefined && typeof config.geminiApiBaseUrl !== 'string') {
        missing.push('GEMINI_API_BASE_URL (must be a string URL)');
    }
    
    if (missing.length > 0) {
        throw new Error(`Missing or invalid configuration: ${missing.join(', ')}`);
    }
}