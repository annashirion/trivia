import { useMemo, useState } from 'react'
import './Game.css'
import ActionSection from './components/ActionSection'
import OptionsGrid from './components/OptionsGrid'
import type { Question, AnswerCheck } from './types'

interface GameProps {
  questions: Question[]
  onBack: () => void
}

function Game({ questions, onBack }: GameProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [answerResult, setAnswerResult] = useState<AnswerCheck | null>(null)
  const [checkingAnswer, setCheckingAnswer] = useState(false)

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex])
  const isLast = currentIndex === questions.length - 1

  const handleSelect = async (idx: number) => {
    if (answered || checkingAnswer) return
    
    setSelectedIndex(idx)
    setCheckingAnswer(true)
    
    try {
      const API_BASE = (import.meta as any).env.VITE_API_URL || `http://localhost:${(import.meta as any).env.VITE_API_PORT || 4000}`
      const res = await fetch(`${API_BASE}/api/check-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedIndex: idx
        })
      })
      
      if (!res.ok) throw new Error('Failed to check answer')
      const result: AnswerCheck = await res.json()
      setAnswerResult(result)
      setAnswered(true)
    } catch (e: unknown) {
      console.error('Error checking answer:', e)
      // Fallback: assume incorrect if API fails
      setAnswerResult({
        isCorrect: false,
        correctIndex: -1,
        selectedIndex: idx
      })
      setAnswered(true)
    } finally {
      setCheckingAnswer(false)
    }
  }

  const handleNext = () => {
    if (!answered) return
    if (isLast) return
    setCurrentIndex(prev => prev + 1)
    setSelectedIndex(null)
    setAnswered(false)
    setAnswerResult(null)
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

      <OptionsGrid
        options={currentQuestion.options}
        selectedIndex={selectedIndex}
        correctIndex={answerResult?.correctIndex ?? -1}
        answered={answered}
        onSelect={handleSelect}
      />

      <ActionSection 
        label={isLast ? 'Go to Home' : 'Next'}
        onClick={isLast ? handleFinish : handleNext}
        enabled={answered && !checkingAnswer}
        loading={checkingAnswer}
        helperText={checkingAnswer ? "Checking answer..." : "Choose an answer to continue"}
        helperVisible={!answered || checkingAnswer}
      />
    </div>
  )
}

export default Game


