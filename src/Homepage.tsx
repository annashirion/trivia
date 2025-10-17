import { useState, useEffect } from 'react'
import './Homepage.css'
import ActionSection from './components/ActionSection'
import TopicCard from './components/TopicCard'
import LoadingView from './components/LoadingView'
import type { Topic } from './types'
import { API_BASE } from './utils/api'

interface HomepageProps {
  onStart: (topicIndexes: number[]) => void
}

function Homepage({ onStart }: HomepageProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [topicsLoading, setTopicsLoading] = useState(true)
  const [topicsError, setTopicsError] = useState<string | null>(null)

  useEffect(() => {
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
  }, [])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    )
  }

  const startGame = () => {
    if (selectedTopics.length === 0) return
    // Convert topic IDs to indexes
    const topicIndexes = selectedTopics.map(topicId => 
      topics.findIndex(topic => topic.id === topicId)
    ).filter(index => index !== -1)
    onStart(topicIndexes)
  }

  if (topicsLoading) {
    return (
      <LoadingView 
        title="Just Another Trivia"
        message="Loading topics..."
      />
    )
  }

  if (topicsError) {
    return (
      <LoadingView 
        title="Just Another Trivia"
        message="Failed to load topics"
        isError={true}
      />
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
        helperText={selectedTopics.length === 0 ? "Select at least one topic" : "You can start playing now"}
      />
    </div>
  )
}

export default Homepage
