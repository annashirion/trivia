import './App.css'
import { useState } from 'react'
import Homepage from './Homepage'
import Game from './Game'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<number[]>([])

  const handleStart = (topicIndexes: number[]) => {
    setSelectedTopics(topicIndexes)
    setGameStarted(true)
  }

  if (gameStarted) {
    return <Game onBack={() => setGameStarted(false)} selectedTopics={selectedTopics} />
  }

  return <Homepage onStart={handleStart} />
}

export default App
