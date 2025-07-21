import { Router, Request, Response } from 'express';
import GeminiChatService from '../services/GeminiChatService';
import { GeminiChatCompletionRequest } from '../types/gemini';

const router = Router();

router.post('/chat/completions', async (req: Request, res: Response) => {
    try {
        const request: GeminiChatCompletionRequest = req.body;
        const result = await GeminiChatService.complete(request);
        res.json(result);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

export default router;