import { useState } from 'react'
import './Homepage.css'

interface Topic {
  id: string
  name: string
  icon: string
  description: string
}

const topics: Topic[] = [
  { id: 'science', name: 'Science', icon: '🔬', description: 'Physics, chemistry, biology and more' },
  { id: 'history', name: 'History', icon: '🏛️', description: 'World history and historical events' },
  { id: 'sports', name: 'Sports', icon: '⚽', description: 'Athletics, teams, and sporting events' },
  { id: 'geography', name: 'Geography', icon: '🌍', description: 'Countries, capitals, and landmarks' },
  { id: 'movies', name: 'Movies & TV', icon: '🎬', description: 'Films, shows, and entertainment' },
  { id: 'music', name: 'Music', icon: '🎵', description: 'Artists, songs, and musical genres' }
]

interface HomepageProps {
  onStart: () => void
  loading?: boolean
  error?: string | null
}

function Homepage({ onStart, loading, error }: HomepageProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

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

  return (
    <div className="home-container">      
      <div className="topics-section">
        <h1 className="topics-title">Just Another Trivia</h1>
        <div className="topics-grid">
          {topics.map(topic => (
            <div 
              key={topic.id}
              className={`topic-card ${selectedTopics.includes(topic.id) ? 'selected' : ''}`}
              onClick={() => toggleTopic(topic.id)}
            >
              <div className="topic-icon">{topic.icon}</div>
              <h3 className="topic-name">{topic.name}</h3>
              <p className="topic-description">{topic.description}</p>
              {selectedTopics.includes(topic.id) && (
                <div className="selected-indicator">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="action-section">
        <button 
          onClick={startGame}
          className={`btn ${selectedTopics.length > 0 ? 'btn-primary' : 'btn-disabled'}`}
          disabled={selectedTopics.length === 0 || loading}
        >
          {loading ? 'Loading…' : 'Start Playing'}
        </button>
        <p className={`helper-text ${selectedTopics.length === 0 ? 'visible' : 'hidden'}`}>
          Select at least one topic
        </p>
        {error && (
          <p className="helper-text visible" style={{ color: '#ff6b6b', marginTop: 8 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default Homepage
