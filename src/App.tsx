import './App.css'
import { useState } from 'react'
import Homepage from './Homepage'
import Game from './Game'

interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
}

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  // Prefer VITE_API_URL; fallback to localhost with VITE_API_PORT or 4000
  const API_BASE = (import.meta as any).env.VITE_API_URL || `http://localhost:${(import.meta as any).env.VITE_API_PORT || 4000}`

  const handleStart = async () => {
    if (loading) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/questions`)
      if (!res.ok) throw new Error('Failed to fetch questions')
      const data: Question[] = await res.json()
      setQuestions(data)
      setGameStarted(true)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (gameStarted) {
    return <Game questions={questions} onBack={() => setGameStarted(false)} />
  }

  return <Homepage onStart={handleStart} loading={loading} error={error} />
}

export default App
