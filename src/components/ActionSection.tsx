import './ActionSection.css'

interface ActionSectionProps {
  label: string
  onClick: () => void
  enabled: boolean
  loading?: boolean
  helperText?: string
  helperVisible?: boolean
  helperTextClass?: string
  error?: string | null
}

function ActionSection({ label, onClick, enabled, loading, helperText, helperVisible = true, helperTextClass, error }: ActionSectionProps) {
  const buttonClass = `btn ${enabled && !loading ? 'btn-primary' : 'btn-disabled'}`
  return (
    <div className="action-section">
      {helperText && helperVisible && (
        <p className={`helper-text visible ${helperTextClass || ''}`}>{helperText}</p>
      )}
      {error && (
        <p className="helper-text visible helper-text-error">{error}</p>
      )}
      <button 
        onClick={onClick}
        className={buttonClass}
        disabled={!enabled || loading}
      >
        {label}
      </button>
    </div>
  )
}

export default ActionSection


