import dotenv from 'dotenv';

dotenv.config();

export const config = {
  authToken: process.env.AUTH_TOKEN,
  apiKeys: process.env.API_KEYS?.split(','),
};
