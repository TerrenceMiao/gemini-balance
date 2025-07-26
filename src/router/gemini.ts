import { Router } from 'express';
import { listModels, generateContent, streamGenerateContent, countTokens, resetAllFailCounts, resetSelectedFailCounts, resetFailCount, verifyKey, verifySelectedKeys } from '../controllers/gemini';

const router = Router();

router.get('/models', listModels);
router.post('/models/:model_name/generateContent', generateContent);
router.post('/models/:model_name/streamGenerateContent', streamGenerateContent);
router.post('/models/:model_name/countTokens', countTokens);
router.post('/reset-all-fail-counts', resetAllFailCounts);
router.post('/reset-selected-fail-counts', resetSelectedFailCounts);
router.post('/reset-fail-count/:api_key', resetFailCount);
router.post('/verify-key/:api_key', verifyKey);
router.post('/verify-selected-keys', verifySelectedKeys);

export default router;
