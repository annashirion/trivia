export interface Topic {
  id: string
  name: string
  icon: string
  description: string
}

export interface Question {
  id: number
  question: string
  options: string[]
}

export interface AnswerCheck {
  isCorrect: boolean
  correctIndex: number
  selectedIndex: number
}
