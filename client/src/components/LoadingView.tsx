import './LoadingView.css'
import { useLoadingMessages } from '../hooks/useLoadingMessages'

interface LoadingViewProps {
  title: string
  message?: string
  onBack?: () => void
  showBackButton?: boolean
  isError?: boolean
  useCyclingMessages?: boolean
}

function LoadingView({ 
  title, 
  message, 
  onBack, 
  showBackButton = false, 
  isError = false,
  useCyclingMessages = false 
}: LoadingViewProps) {
  const cyclingMessage = useLoadingMessages(4000)
  const displayMessage = useCyclingMessages && !isError ? cyclingMessage : message

  return (
    <div className="loading-container">
      <div className="loading-content">
        <h1 className="loading-title">{title}</h1>
        
        {!isError && (
          <div className="loading-spinner-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
          </div>
        )}
        
        <p className={`loading-message ${isError ? 'error' : ''}`}>{displayMessage}</p>
        
        {!isError && (
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        
        {showBackButton && onBack && (
          <button onClick={onBack} className="btn btn-secondary loading-back-btn">Back to Home</button>
        )}
      </div>
    </div>
  )
}

export default LoadingView
