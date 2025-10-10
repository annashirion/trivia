import { useMemo, useState, useEffect } from 'react'
import './Game.css'
import ActionSection from './components/ActionSection'
import OptionsGrid from './components/OptionsGrid'
import Results from './components/Results'
import LoadingView from './components/LoadingView'
import type { Question, AnswerCheck } from './types'
import { API_BASE } from './utils/api'

interface GameProps {
  onBack: () => void
  selectedTopics: number[]
}

function Game({ onBack, selectedTopics }: GameProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [questionsError, setQuestionsError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [answerResult, setAnswerResult] = useState<AnswerCheck | null>(null)
  const [checkingAnswer, setCheckingAnswer] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  useEffect(() => {
    let isCancelled = false

    const fetchQuestions = async () => {
      try {
        const topicsParam = selectedTopics.join(',')
        const url = `${API_BASE}/api/questions${topicsParam ? `?topicIndexes=${encodeURIComponent(topicsParam)}` : ''}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch questions')
        const data: Question[] = await res.json()
        
        // Only update state if the effect hasn't been cancelled
        if (!isCancelled) {
          setQuestions(data)
        }
      } catch (e: unknown) {
        if (!isCancelled) {
          const message = e instanceof Error ? e.message : 'Unknown error'
          setQuestionsError(message)
        }
      } finally {
        if (!isCancelled) {
          setQuestionsLoading(false)
        }
      }
    }
    
    fetchQuestions()
    
    // Cleanup function to cancel the request if component unmounts or effect re-runs
    return () => {
      isCancelled = true
    }
  }, [selectedTopics.join(',')])

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex])
  const isLast = currentIndex === questions.length - 1

  const handleSelect = async (idx: number) => {
    if (answered || checkingAnswer) return
    
    setSelectedIndex(idx)
    setCheckingAnswer(true)
    
    try {
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
      
      if (result.isCorrect) {
        setScore(prev => prev + 1)
      }
    } catch (e: unknown) {
      console.error('Error checking answer:', e)
      // Fallback: assume incorrect if API fails
      setAnswerResult({
        isCorrect: false,
        correctIndex: -1,
        selectedIndex: idx
      })
    } finally {
      setAnswered(true)
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
    setShowResults(true)
  }

  if (questionsLoading) {
    return (
      <LoadingView 
        title="Just Another Trivia"
        message="Loading questions..."
        onBack={onBack}
      />
    )
  }

  if (questionsError) {
    return (
      <LoadingView 
        title="Just Another Trivia"
        message="Failed to load questions"
        onBack={onBack}
        showBackButton={true}
        isError={true}
      />
    )
  }

  if (showResults) {
    return <Results onBack={onBack} score={score} totalQuestions={questions.length} />
  }

  if (!currentQuestion) {
    return (
      <div className="game-container">
        <p>No questions available</p>
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
        answered={answered || checkingAnswer}
        onSelect={handleSelect}
      />

      <ActionSection 
        label={isLast ? 'Show results' : 'Next'}
        onClick={isLast ? handleFinish : handleNext}
        enabled={answered && !checkingAnswer}
        loading={checkingAnswer}
        helperText={
          checkingAnswer 
            ? "Checking answer..." 
            : answered 
              ? (answerResult?.isCorrect ? "Correct ✓" : "Wrong ✗")
              : "Choose an answer to continue"
        }
        helperTextClass={
          answered 
            ? (answerResult?.isCorrect ? "helper-text-correct" : "helper-text-wrong")
            : undefined
        }
      />
    </div>
  )
}

export default Game


