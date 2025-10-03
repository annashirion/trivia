import OptionCard from './OptionCard'
import './OptionsGrid.css'

interface OptionsGridProps {
  options: string[]
  selectedIndex: number | null
  correctIndex: number
  answered: boolean
  onSelect: (index: number) => void
}

function OptionsGrid({ options, selectedIndex, correctIndex, answered, onSelect }: OptionsGridProps) {
  return (
    <div className="options-grid">
      {options.map((option, idx) => {
        const isSelected = idx === selectedIndex
        const isCorrect = idx === correctIndex
        const showState = answered

        return (
          <OptionCard
            key={idx}
            option={option}
            index={idx}
            isSelected={isSelected}
            isCorrect={isCorrect}
            showState={showState}
            answered={answered}
            onSelect={onSelect}
          />
        )
      })}
    </div>
  )
}

export default OptionsGrid
