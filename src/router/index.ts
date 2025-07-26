import { Express, Router } from 'express';
import { healthCheck } from '../controllers/health';
import { getAuthPage, postAuth } from '../controllers/auth';
import { getConfigPage } from '../controllers/config';
import { getKeysStatusPage } from '../controllers/keys';
import { getErrorLogsPage } from '../controllers/errorLogs';
import { requireAuth } from '../middleware/auth';
import geminiRouter from './gemini';

export const setupRouters = (app: Express) => {
  const router = Router();

  router.get('/health', healthCheck);
  router.get('/', getAuthPage);
  router.post('/auth', postAuth);
  router.get('/config', requireAuth, getConfigPage);
  router.get('/keys', requireAuth, getKeysStatusPage);
  router.get('/logs', requireAuth, getErrorLogsPage);

  app.use('/gemini/v1', geminiRouter);
  app.use('/v1', geminiRouter);

  app.use('/', router);
};
