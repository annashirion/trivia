import { useState, useEffect } from 'react'
import './Results.css'
import AudioPlayer from './AudioPlayer'

interface ResultsProps {
  onBack: () => void
  score: number
  totalQuestions: number
  resultsAudio: Record<number, string>
}

function Results({ onBack, score, totalQuestions, resultsAudio }: ResultsProps) {
  const [currentResultsAudio, setCurrentResultsAudio] = useState<string | null>(null)

  // Use pre-generated results audio
  useEffect(() => {
    const audio = resultsAudio[score]
    setCurrentResultsAudio(audio || null)
  }, [score, resultsAudio])

  return (
    <div className="results-container">
      <h2>Quiz Complete!</h2>
      <AudioPlayer audioData={currentResultsAudio} className="results-audio" autoPlay={true} />
      <p>You answered <span className="score-number">{score}</span> out of <span className="score-number">{totalQuestions}</span> questions correctly</p>
      <button onClick={onBack} className="btn btn-primary">
        Go to Home
      </button>
    </div>
  )
}

export default Results
