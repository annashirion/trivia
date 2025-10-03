import { useMemo, useState } from 'react'
import './Game.css'
import ActionSection from './components/ActionSection'

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

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex])
  const isLast = currentIndex === questions.length - 1

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelectedIndex(idx)
    setAnswered(true)
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

      <ActionSection 
        label={isLast ? 'Go to Home' : 'Next'}
        onClick={isLast ? handleFinish : handleNext}
        enabled={answered}
        helperText="Choose an answer to continue"
        helperVisible={!answered}
      />
    </div>
  )
}

export default Game


