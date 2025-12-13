import { useMemo, useState, useEffect, useCallback } from 'react'
import './Game.css'
import ActionSection from './ActionSection'
import OptionsGrid from './OptionsGrid'
import Results from './Results'
import LoadingView from './LoadingView'
import AudioPlayer from './AudioPlayer'
import type { Question, AnswerCheck } from '../types'
import { API_BASE, getQuestionHistory, addToQuestionHistory } from '../utils/api'
import { useAudioManager } from '../hooks/useAudioManager'
import { useAudioPrefetch } from '../hooks/useAudioPrefetch'

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
  const [feedbackAudio, setFeedbackAudio] = useState<string | null>(null)
  const [waitingForAudio, setWaitingForAudio] = useState(false)
  const [pendingNextIndex, setPendingNextIndex] = useState<number | null>(null)
  const [waitingForResults, setWaitingForResults] = useState(false)
  
  const { stopAllAudio } = useAudioManager()
  const { 
    isAudioReady, 
    isResultsAudioReady,
    fetchQuestionAudio, 
    fetchResultsAudio,
    getQuestionAudio,
    resultsAudio
  } = useAudioPrefetch()

  // Fetch questions (without audio) on mount
  useEffect(() => {
    let isCancelled = false

    const fetchQuestions = async () => {
      try {
        const previousQuestions = getQuestionHistory()
        
        const res = await fetch(`${API_BASE}/api/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topicIndexes: selectedTopics,
            previousQuestions
          })
        })
        
        if (!res.ok) throw new Error('Failed to fetch questions')
        const data = await res.json()

        // Only update state if the effect hasn't been cancelled
        if (!isCancelled) {
          setQuestions(data.questions)
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

  // Fetch first question's audio once questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !isAudioReady(questions[0].id)) {
      fetchQuestionAudio(questions[0].id)
    }
  }, [questions, isAudioReady, fetchQuestionAudio])

  // Prefetch next question's audio when current question is shown
  useEffect(() => {
    if (questions.length === 0) return
    
    const currentQuestion = questions[currentIndex]
    const nextIndex = currentIndex + 1
    const isLast = currentIndex === questions.length - 1
    
    // Once current question audio is ready, prefetch next one
    if (isAudioReady(currentQuestion.id)) {
      if (!isLast && nextIndex < questions.length) {
        const nextQuestion = questions[nextIndex]
        if (!isAudioReady(nextQuestion.id)) {
          fetchQuestionAudio(nextQuestion.id)
        }
      } else if (isLast) {
        // On last question, start fetching results audio
        fetchResultsAudio()
      }
    }
  }, [questions, currentIndex, isAudioReady, fetchQuestionAudio, fetchResultsAudio])

  // Handle pending navigation when audio becomes ready
  useEffect(() => {
    if (pendingNextIndex !== null && questions.length > 0) {
      const nextQuestion = questions[pendingNextIndex]
      if (isAudioReady(nextQuestion.id)) {
        setCurrentIndex(pendingNextIndex)
        setSelectedIndex(null)
        setAnswered(false)
        setAnswerResult(null)
        setFeedbackAudio(null)
        setPendingNextIndex(null)
        setWaitingForAudio(false)
      }
    }
  }, [pendingNextIndex, questions, isAudioReady])

  // Handle pending results when audio becomes ready
  useEffect(() => {
    if (waitingForResults && isResultsAudioReady) {
      // Save questions to history only when game is finished
      const questionTexts = questions.map((q: Question) => q.question)
      addToQuestionHistory(questionTexts)
      setWaitingForResults(false)
      setShowResults(true)
    }
  }, [waitingForResults, isResultsAudioReady, questions])

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex])
  const isLast = currentIndex === questions.length - 1

  // Get current question's audio from the prefetch cache
  const currentQuestionAudio = useMemo(() => {
    if (!currentQuestion) return null
    return getQuestionAudio(currentQuestion.id)
  }, [currentQuestion, getQuestionAudio])

  const handleSelect = async (idx: number) => {
    if (answered || checkingAnswer) return
    
    // Stop all currently playing audio when user selects an answer
    stopAllAudio()
    
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
      
      // Use feedback audio from prefetched data
      const questionAudio = getQuestionAudio(currentQuestion.id)
      if (questionAudio?.feedbackAudio) {
        const feedback = result.isCorrect 
          ? questionAudio.feedbackAudio.correct 
          : questionAudio.feedbackAudio.wrong
        setFeedbackAudio(feedback || null)
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

  const handleNext = useCallback(() => {
    if (!answered) return
    if (isLast) return
    
    const nextIdx = currentIndex + 1
    const nextQuestion = questions[nextIdx]
    
    // Check if next question's audio is ready
    if (isAudioReady(nextQuestion.id)) {
      // Audio ready, navigate immediately
      setCurrentIndex(nextIdx)
      setSelectedIndex(null)
      setAnswered(false)
      setAnswerResult(null)
      setFeedbackAudio(null)
    } else {
      // Audio not ready, show loader and wait
      setWaitingForAudio(true)
      setPendingNextIndex(nextIdx)
      // Ensure we're fetching the audio
      fetchQuestionAudio(nextQuestion.id)
    }
  }, [answered, isLast, currentIndex, questions, isAudioReady, fetchQuestionAudio])

  const handleFinish = useCallback(() => {
    // Check if results audio is ready
    if (isResultsAudioReady) {
      // Audio ready, show results immediately
      const questionTexts = questions.map((q: Question) => q.question)
      addToQuestionHistory(questionTexts)
      setShowResults(true)
    } else {
      // Audio not ready, show loader and wait
      setWaitingForResults(true)
      // Ensure we're fetching the results audio
      fetchResultsAudio()
    }
  }, [isResultsAudioReady, questions, fetchResultsAudio])

  // Show loader while waiting for audio
  if (waitingForAudio) {
    return (
      <LoadingView
        title="Just Another Trivia"
        message="Loading next question..."
        onBack={onBack}
        showBackButton={true}
      />
    )
  }

  // Show loader while waiting for results audio
  if (waitingForResults) {
    return (
      <LoadingView
        title="Just Another Trivia"
        message="Preparing your results..."
        onBack={onBack}
        showBackButton={true}
      />
    )
  }

  if (questionsLoading) {
    return (
      <LoadingView
        title="Just Another Trivia"
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

  // Show loader while first question's audio is loading
  if (questions.length > 0 && !isAudioReady(questions[0].id)) {
    return (
      <LoadingView
        title="Just Another Trivia"
        message="Preparing first question..."
        onBack={onBack}
      />
    )
  }

  if (showResults) {
    return <Results onBack={onBack} score={score} totalQuestions={questions.length} resultsAudio={resultsAudio} />
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
      <div className="game-question-container">
        <h2 className="game-question">{currentQuestion.question}</h2>
        <AudioPlayer audioData={currentQuestionAudio?.audio || null} className="question-audio" autoPlay={true} />
      </div>

      <OptionsGrid
        options={currentQuestion.options}
        selectedIndex={selectedIndex}
        correctIndex={answerResult?.correctIndex ?? -1}
        answered={answered || checkingAnswer}
        onSelect={handleSelect}
      />

      {feedbackAudio && (
        <div className="feedback-audio-container">
          <AudioPlayer audioData={feedbackAudio} className="feedback-audio" autoPlay={true} />
        </div>
      )}

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
