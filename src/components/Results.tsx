import './Results.css'

interface ResultsProps {
  onBack: () => void
}

function Results({ onBack }: ResultsProps) {
  return (
    <div className="results-container">
      <h2>Quiz Complete!</h2>
      <p>Thank you for playing Just Another Trivia!</p>
      <button onClick={onBack} className="btn btn-primary">
        Go to Home
      </button>
    </div>
  )
}

export default Results
