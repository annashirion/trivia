# Trivia Backend

This backend now uses OpenAI API to generate trivia questions dynamically.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the server directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=4000
   ```

3. Get an OpenAI API key:
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Add it to your `.env` file

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /api/questions?topics=science,geography` - Generate questions for specified topics
- `GET /api/topics` - Get available topics
- `POST /api/check-answer` - Check if an answer is correct

## Notes

- Questions are generated dynamically using OpenAI GPT-3.5-turbo
- The system generates 5 questions per request
- Questions are stored in memory for the current session
- Topics parameter is required for the questions endpoint
