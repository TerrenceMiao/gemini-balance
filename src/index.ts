import express, { Express } from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import KeyManager from './services/KeyManager';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

// Load API keys into KeyManager
if (process.env.GEMINI_API_KEY) {
    KeyManager.addKey('gemini', process.env.GEMINI_API_KEY);
}
if (process.env.OPENAI_API_KEY) {
    KeyManager.addKey('openai', process.env.OPENAI_API_KEY);
}

app.use(express.json());
app.use('/v1', routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});