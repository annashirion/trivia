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
  return (
    <div className="game-container">
      <h2>Game Started!</h2>
      <p>Loaded questions: <strong>{questions.length}</strong></p>
      <button onClick={onBack} className="btn btn-secondary">
        Back to Home
      </button>
    </div>
  )
}

export default Game


