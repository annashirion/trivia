import './LoadingView.css'

interface LoadingViewProps {
  title: string
  message: string
  onBack?: () => void
  showBackButton?: boolean
  isError?: boolean
}

function LoadingView({ title, message, onBack, showBackButton = false, isError = false }: LoadingViewProps) {
  return (
    <div className="loading-container">
      <h1 className="loading-title">{title}</h1>
      <p className={`loading-message ${isError ? 'error' : ''}`}>{message}</p>
      {showBackButton && onBack && (
        <button onClick={onBack} className="btn btn-secondary">Back to Home</button>
      )}
    </div>
  )
}

export default LoadingView
