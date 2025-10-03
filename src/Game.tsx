import { useMemo, useState } from 'react'
import './Game.css'

interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
}

interface GameProps {
  questions: Question[]
  onBack: () => void
}

function Game({ questions, onBack }: GameProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex])
  const isLast = currentIndex === questions.length - 1

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelectedIndex(idx)
    setAnswered(true)
    if (idx === currentQuestion.correctIndex) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (!answered) return
    if (isLast) return
    setCurrentIndex(prev => prev + 1)
    setSelectedIndex(null)
    setAnswered(false)
  }

  const handleFinish = () => {
    onBack()
  }

  if (!currentQuestion) {
    return (
      <div className="game-container">
        <p>No questions available.</p>
        <button onClick={onBack} className="btn btn-secondary">Back to Home</button>
      </div>
    )
  }

  return (
    <div className="game-container">
      <div className="game-meta">
        Question {currentIndex + 1} / {questions.length}
      </div>
      <h2 className="game-question">{currentQuestion.question}</h2>

      <div className="options-grid">
        {currentQuestion.options.map((opt, idx) => {
          const isSelected = idx === selectedIndex
          const isCorrect = idx === currentQuestion.correctIndex
          const showState = answered

          let cardClass = 'option-card'
          if (showState) {
            if (isCorrect) cardClass += ' correct'
            if (isSelected) cardClass += ' selected'
            if (isSelected && !isCorrect) cardClass += ' wrong'
          } else if (isSelected) {
            cardClass += ' preview-selected'
          }

          return (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleSelect(idx)
              }}
              className={`${cardClass} ${answered ? 'disabled' : ''}`}
            >
              <div className="option-text">{opt}</div>
            </div>
          )
        })}
      </div>

      <div className="action-section">
        <button 
          onClick={isLast ? handleFinish : handleNext}
          className={`btn ${answered ? 'btn-primary' : 'btn-disabled'}`}
          disabled={!answered}
        >
          {isLast ? 'Go to Home' : 'Next'}
        </button>
        <p className={`helper-text ${answered ? 'hidden' : 'visible'}`}>
          Choose an answer to continue
        </p>
      </div>
    </div>
  )
}

export default Game


