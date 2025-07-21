import { Router, Request, Response } from 'express';
import OpenAIChatService from '../services/OpenAIChatService';
import { OpenAIChatCompletionRequest } from '../types/openai';

const router = Router();

router.post('/chat/completions', async (req: Request, res: Response) => {
    try {
        const request: OpenAIChatCompletionRequest = req.body;
        const result = await OpenAIChatService.complete(request);
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