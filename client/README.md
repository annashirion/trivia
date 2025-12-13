# Trivia Frontend Client

React + TypeScript frontend application for the Trivia Game, built with Vite.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   The app runs on `http://localhost:3000` by default. The API base URL can be configured via `VITE_API_URL` environment variable, or it will default to `http://localhost:4000`.

   Create a `.env` file in the client directory (optional):
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_API_PORT=4000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```


## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ActionSection.tsx
│   ├── AudioPlayer.tsx
│   ├── Game.tsx         # Main game component
│   ├── Homepage.tsx     # Homepage component
│   ├── LoadingView.tsx
│   ├── OptionCard.tsx
│   ├── OptionsGrid.tsx
│   ├── Results.tsx
│   └── TopicCard.tsx
├── hooks/               # Custom React hooks
│   ├── useAudioManager.ts
│   └── useAudioPrefetch.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── api.ts
├── App.tsx              # Main app component
├── App.css
├── index.css
└── main.tsx             # Application entry point
```