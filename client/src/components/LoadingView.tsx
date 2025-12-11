import './LoadingView.css'

interface LoadingViewProps {
  title: string
  message?: string
  onBack?: () => void
  showBackButton?: boolean
  isError?: boolean
}

function LoadingView({ 
  title, 
  message = "Loading questions...", 
  onBack, 
  showBackButton = false, 
  isError = false
}: LoadingViewProps) {

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
        
        <p className={`loading-message ${isError ? 'error' : ''}`}>{message}</p>
        
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
