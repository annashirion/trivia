import { useState } from 'react'
import './Homepage.css'
import ActionSection from './ActionSection'
import TopicCard from './TopicCard'
import LoadingView from './LoadingView'
import type { Topic } from '../types'

interface HomepageProps {
  onStart: (topicIndexes: number[]) => void
  topics: Topic[]
  topicsLoading: boolean
  topicsError: string | null
}

function Homepage({ onStart, topics, topicsLoading, topicsError }: HomepageProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])


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
