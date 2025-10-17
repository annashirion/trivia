# Just Another Trivia

An interactive trivia game powered by AI-generated questions and text-to-speech audio. Test your knowledge across various topics with dynamically generated questions and instant audio feedback.

## 🎯 Features

- **AI-Generated Questions**: Questions are dynamically created using OpenAI's GPT-3.5-turbo
- **Text-to-Speech Audio**: Questions, options, and feedback are read aloud using OpenAI's TTS API
- **Topic Selection**: Choose from multiple trivia topics including science, history, geography, and more
- **Instant Feedback**: Get immediate audio feedback for correct and incorrect answers
- **Smart Audio Management**: No overlapping audio - previous audio stops when new audio starts
- **Pre-Generated Audio**: All audio is generated upfront for instant playback during gameplay
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🎵 Audio Features

- **Question Audio**: Each question and its options are read aloud automatically
- **Feedback Audio**: 
  - Correct: "It's [answer], you are right!"
  - Wrong: "Unfortunately you are wrong. The correct answer was [answer]."
- **Results Audio**: Personalized feedback based on your score (0-5 out of 5)
- **Dynamic Loading Messages**: Entertaining messages that cycle every 4 seconds during loading

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS3** with animations and responsive design
- **Custom Hooks** for audio management and loading states

### Backend
- **Node.js** with Express.js
- **OpenAI API** for question generation and text-to-speech
- **CORS** enabled for cross-origin requests
- **Environment variables** for secure API key management

## 🚀 Getting Started

### Prerequisites
- Node.js 22+ 
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trivia
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Add your OpenAI API key to `server/.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173` to start playing!

## 🎮 How to Play

1. **Select Topics**: Choose one or more topics you want to be quizzed on
2. **Start Playing**: Click "Start Playing" to begin the trivia game
3. **Listen & Answer**: Each question and its options will be read aloud automatically
4. **Get Feedback**: Hear instant audio feedback for your answers
5. **View Results**: Get personalized audio feedback based on your final score

## 🏗️ Project Structure

```
trivia/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # API route handlers
│   │   ├── services/      # Business logic services
│   │   ├── data/          # Static data files
│   │   └── polyfills.js   # Web API polyfills
│   └── .env              # Environment variables
└── README.md
```

## 🔧 API Endpoints

- `GET /api/topics` - Get available trivia topics
- `GET /api/questions?topicIndexes=0,1,2` - Get AI-generated questions with audio
- `POST /api/check-answer` - Check if an answer is correct and get feedback audio

## 🎨 Key Components

- **Homepage**: Topic selection with loading animations
- **Game**: Interactive trivia gameplay with audio
- **Results**: Score display with personalized audio feedback
- **AudioPlayer**: Invisible audio management system
- **LoadingView**: Dynamic loading messages with animations

## 🚀 Performance Optimizations

- **Pre-Generated Audio**: All audio is generated during question loading for instant playback
- **Audio Management**: Global audio manager prevents overlapping audio
- **Efficient State Management**: Minimal re-renders with optimized React hooks
- **Clean Codebase**: Removed unused code and imports for better performance

## 🔐 Environment Variables

Create a `.env` file in the `server` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=4000
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Enjoy testing your knowledge with Just Another Trivia!** 🎉