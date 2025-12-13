import './OptionCard.css'

interface OptionCardProps {
  option: string
  index: number
  isSelected: boolean
  isCorrect: boolean
  showState: boolean
  answered: boolean
  onSelect: (index: number) => void
}

function OptionCard({ option, index, isSelected, isCorrect, showState, answered, onSelect }: OptionCardProps) {
  let cardClass = 'option-card'
  if (showState) {
    if (isCorrect) cardClass += ' correct'
    if (isSelected) cardClass += ' selected'
    if (isSelected && !isCorrect) cardClass += ' wrong'
  } else if (isSelected) {
    cardClass += ' preview-selected'
  }

  return (
    <div
      role="button"
      tabIndex={answered ? -1 : 0}
      onClick={() => !answered && onSelect(index)}
      onKeyDown={(e) => {
        if (!answered && (e.key === 'Enter' || e.key === ' ')) onSelect(index)
      }}
      className={`${cardClass} ${answered ? 'disabled' : ''}`}
    >
      <div className="option-text">{option}</div>
    </div>
  )
}

export default OptionCard
