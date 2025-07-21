import { Router } from 'express';
import geminiRoutes from './gemini';
import openaiRoutes from './openai';

const router = Router();

router.use('/gemini', geminiRoutes);
router.use('/openai', openaiRoutes);

export default router;