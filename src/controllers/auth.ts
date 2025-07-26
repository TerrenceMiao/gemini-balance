import { Request, Response } from 'express';
import { config } from '../config';

export const getAuthPage = (req: Request, res: Response) => {
  res.render('auth', { error: null });
};

export const postAuth = (req: Request, res: Response) => {
  const { auth_token } = req.body;

  if (auth_token === config.authToken) {
    res.cookie('auth_token', auth_token, { httpOnly: true, maxAge: 3600000 });
    res.redirect('/config');
  } else {
    res.render('auth', { error: 'Invalid token' });
  }
};
