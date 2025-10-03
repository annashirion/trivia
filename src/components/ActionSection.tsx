import './ActionSection.css'

interface ActionSectionProps {
  label: string
  onClick: () => void
  enabled: boolean
  loading?: boolean
  helperText?: string
  helperVisible?: boolean
  error?: string | null
}

function ActionSection({ label, onClick, enabled, loading, helperText, helperVisible = true, error }: ActionSectionProps) {
  const buttonClass = `btn ${enabled && !loading ? 'btn-primary' : 'btn-disabled'}`
  return (
    <div className="action-section">
      <button 
        onClick={onClick}
        className={buttonClass}
        disabled={!enabled || !!loading}
      >
        {loading ? 'Loading…' : label}
      </button>
      {helperText && (
        <p className={`helper-text ${helperVisible ? 'visible' : 'hidden'}`}>{helperText}</p>
      )}
      {error && (
        <p className="helper-text visible helper-text-error">{error}</p>
      )}
    </div>
  )
}

export default ActionSection


