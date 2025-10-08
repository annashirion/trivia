import './Results.css'

interface ResultsProps {
  onBack: () => void
  score: number
  totalQuestions: number
}

function Results({ onBack, score, totalQuestions }: ResultsProps) {
  return (
    <div className="results-container">
      <h2>Quiz Complete!</h2>
      <p>You answered <span className="score-number">{score}</span> out of <span className="score-number">{totalQuestions}</span> questions correctly</p>
      <button onClick={onBack} className="btn btn-primary">
        Go to Home
      </button>
    </div>
  )
}

export default Results
