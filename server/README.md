# Trivia Backend Server

Node.js backend server for the Trivia Game application, powered by OpenAI for dynamic question generation.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the server directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=4000
   ```

3. **Get an OpenAI API key:**
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file

4. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

- `POST /api/questions` - Generate questions for specified topics
- `GET /api/question-audio/:id` - Get audio for a specific question
- `GET /api/results-audio` - Get audio for results
- `GET /api/topics` - Get available topics
- `POST /api/check-answer` - Check if an answer is correct

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **OpenAI API** - Question generation
- **Node.js** - Runtime (>=18)

## 📝 Notes

- Questions are generated dynamically using OpenAI GPT-3.5-turbo
- The system generates 5 questions per request
- Questions are stored in memory for the current session
- Topics parameter is required for the questions endpoint
