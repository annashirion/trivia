import './App.css'
import { useState, useEffect } from 'react'
import Homepage from './components/Homepage'
import Game from './components/Game'
import type { Topic } from './types'
import { API_BASE } from './utils/api'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<number[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [topicsLoading, setTopicsLoading] = useState(true)
  const [topicsError, setTopicsError] = useState<string | null>(null)

  useEffect(() => {
    if (topics.length > 0) return // Don't fetch if we already have topics

    const fetchTopics = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/topics`)
        if (!res.ok) throw new Error('Failed to fetch topics')
        const data: Topic[] = await res.json()
        setTopics(data)
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        setTopicsError(message)
      } finally {
        setTopicsLoading(false)
      }
    }
    fetchTopics()
  }, [topics.length])

  const handleStart = (topicIndexes: number[]) => {
    setSelectedTopics(topicIndexes)
    setGameStarted(true)
  }

  if (gameStarted) {
    return <Game onBack={() => setGameStarted(false)} selectedTopics={selectedTopics} />
  }

  return (
    <Homepage 
      onStart={handleStart} 
      topics={topics}
      topicsLoading={topicsLoading}
      topicsError={topicsError}
    />
  )
}

export default App
