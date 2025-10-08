import './App.css'
import { useState } from 'react'
import Homepage from './Homepage'
import Game from './Game'

function App() {
  const [gameStarted, setGameStarted] = useState(false)

  const handleStart = () => {
    setGameStarted(true)
  }

  if (gameStarted) {
    return <Game onBack={() => setGameStarted(false)} />
  }

  return <Homepage onStart={handleStart} />
}

export default App
