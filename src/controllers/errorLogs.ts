import { Request, Response } from 'express';
import { errorLogService } from '../services/ErrorLogService';

export const getErrorLogsPage = (req: Request, res: Response) => {
  const errorLogs = errorLogService.getErrorLogs();
  res.render('error_logs', { logs: errorLogs.logs, total: errorLogs.total });
};
