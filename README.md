# Gemini Proxy API

A lightweight proxy server that provides a unified API interface for both Google's Gemini and OpenAI's GPT models. This proxy allows applications to seamlessly switch between AI providers or use them in parallel with minimal code changes.

## Features

- **Unified API Interface**: Use the same request format for both Gemini and OpenAI models
- **Multiple API Key Support**: Load balancing across multiple API keys with round-robin selection
- **Health Endpoints**: Monitor the status of each service
- **Detailed Logging**: Track request/response times and error rates
- **Configurable Parameters**: Support for model-specific parameters like temperature, max tokens, etc.
- **Robust Error Handling**: Detailed error responses with appropriate HTTP status codes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- API keys for Gemini and/or OpenAI (at least one is required)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/gemini-proxy.git
   cd gemini-proxy
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file based on the example
   ```bash
   cp .env.example .env
   ```

4. Add your API keys to the `.env` file
   ```
   GEMINI_API_KEY=your-gemini-api-key1,your-gemini-api-key2
   OPENAI_API_KEY=your-openai-api-key1,your-openai-api-key2
   ```

5. Start the server
   ```bash
   npm start
   # or
   yarn start
   ```

## API Usage

### Gemini API

```bash
curl -X POST http://localhost:3000/v1/gemini/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me a joke", "temperature": 0.7}'
```

### OpenAI API

```bash
curl -X POST http://localhost:3000/v1/openai/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me a joke", "temperature": 0.7}'
```

### Health Checks

```bash
# Server health
curl http://localhost:3000/health

# Gemini service health
curl http://localhost:3000/v1/gemini/health

# OpenAI service health
curl http://localhost:3000/v1/openai/health
```

## Configuration

The following environment variables can be configured in the `.env` file:

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | Server port | `3000` |
| `GEMINI_API_KEY` | Comma-separated list of Gemini API keys | - |
| `OPENAI_API_KEY` | Comma-separated list of OpenAI API keys | - |
| `GEMINI_API_BASE_URL` | Gemini API base URL | `https://generativelanguage.googleapis.com/v1beta` |
| `OPENAI_API_BASE_URL` | OpenAI API base URL | `https://api.openai.com/v1` |
| `GEMINI_API_TIMEOUT` | Gemini API timeout in milliseconds | `30000` |
| `OPENAI_API_TIMEOUT` | OpenAI API timeout in milliseconds | `30000` |
| `GEMINI_MODEL` | Default Gemini model | `gemini-pro` |
| `OPENAI_MODEL` | Default OpenAI model | `gpt-3.5-turbo` |

## License

This project is licensed under the MIT License - see the LICENSE file for details.