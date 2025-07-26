import { Request, Response } from 'express';
import { geminiChatService } from '../services/GeminiChatService';
import { keyManager } from '../services/KeyManager';

export const listModels = (req: Request, res: Response) => {
  res.json({
    models: [
      {
        name: 'models/gemini-pro',
        displayName: 'Gemini Pro',
        description: 'The best model for scaling across a wide range of tasks.',
      },
    ],
  });
};

export const generateContent = async (req: Request, res: Response) => {
  const { model_name } = req.params;
  const response = await geminiChatService.generateContent(model_name, req.body, '');
  res.json(response);
};

export const streamGenerateContent = async (req: Request, res: Response) => {
  const { model_name } = req.params;
  res.setHeader('Content-Type', 'text/event-stream');
  for await (const chunk of geminiChatService.streamGenerateContent(model_name, req.body, '')) {
    res.write(chunk);
  }
  res.end();
};

export const countTokens = async (req: Request, res: Response) => {
  const { model_name } = req.params;
  const response = await geminiChatService.countTokens(model_name, req.body, '');
  res.json(response);
};

export const resetAllFailCounts = (req: Request, res: Response) => {
  keyManager.resetAllFailCounts();
  res.json({ success: true, message: 'All key fail counts have been reset.' });
};

export const resetSelectedFailCounts = (req: Request, res: Response) => {
  const { keys } = req.body;
  keyManager.resetSelectedFailCounts(keys);
  res.json({ success: true, message: 'Selected key fail counts have been reset.' });
};

export const resetFailCount = (req: Request, res: Response) => {
  const { api_key } = req.params;
  keyManager.resetFailCount(api_key);
  res.json({ success: true, message: 'Key fail count has been reset.' });
};

export const verifyKey = async (req: Request, res: Response) => {
  const { api_key } = req.params;
  const isValid = await keyManager.verifyKey(api_key);
  res.json({ status: isValid ? 'valid' : 'invalid' });
};

export const verifySelectedKeys = async (req: Request, res: Response) => {
  const { keys } = req.body;
  const results = await keyManager.verifySelectedKeys(keys);
  res.json(results);
};
