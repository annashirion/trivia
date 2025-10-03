import type { Topic } from '../types'
import './TopicCard.css'

interface TopicCardProps {
  topic: Topic
  isSelected: boolean
  onToggle: (topicId: string) => void
}

function TopicCard({ topic, isSelected, onToggle }: TopicCardProps) {
  return (
    <div 
      className={`topic-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggle(topic.id)}
    >
      <div className="topic-icon">{topic.icon}</div>
      <h3 className="topic-name">{topic.name}</h3>
      <p className="topic-description">{topic.description}</p>
      {isSelected && (
        <div className="selected-indicator">✓</div>
      )}
    </div>
  )
}

export default TopicCard
