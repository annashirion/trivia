import { useState, useEffect } from 'react'
import './Homepage.css'
import ActionSection from './components/ActionSection'
import TopicCard from './components/TopicCard'
import type { Topic } from './types'

interface HomepageProps {
  onStart: () => void
  loading?: boolean
  error?: string | null
}

function Homepage({ onStart, loading, error }: HomepageProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [topicsLoading, setTopicsLoading] = useState(true)
  const [topicsError, setTopicsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const API_BASE = (import.meta as any).env.VITE_API_URL || `http://localhost:${(import.meta as any).env.VITE_API_PORT || 4000}`
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
  }, [])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    )
  }

  const startGame = async () => {
    if (selectedTopics.length === 0 || loading) return
    await onStart()
    setGameStarted(true)
  }

  if (gameStarted) {
    const selectedTopicNames = topics
      .filter(topic => selectedTopics.includes(topic.id))
      .map(topic => topic.name)
      .join(', ')

    return (
      <div className="game-container">
        <h2>Game Started!</h2>
        <p>Selected topics: <strong>{selectedTopicNames}</strong></p>
        <p>Trivia game will be implemented here...</p>
        <button onClick={() => setGameStarted(false)} className="btn btn-secondary">
          Back to Home
        </button>
      </div>
    )
  }

  if (topicsLoading) {
    return (
      <div className="home-container">
        <h1 className="topics-title">Just Another Trivia</h1>
        <p>Loading topics...</p>
      </div>
    )
  }

  if (topicsError) {
    return (
      <div className="home-container">
        <h1 className="topics-title">Just Another Trivia</h1>
        <p className="helper-text-error">{topicsError}</p>
      </div>
    )
  }

  return (
    <div className="home-container">      
      <div className="topics-section">
        <h1 className="topics-title">Just Another Trivia</h1>
        <div className="topics-grid">
          {topics.map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isSelected={selectedTopics.includes(topic.id)}
              onToggle={toggleTopic}
            />
          ))}
        </div>
      </div>
      
      <ActionSection 
        label="Start Playing"
        onClick={startGame}
        enabled={selectedTopics.length > 0}
        loading={loading}
        helperText="Select at least one topic"
        helperVisible={selectedTopics.length === 0}
        error={error}
      />
    </div>
  )
}

export default Homepage
