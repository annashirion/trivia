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
  topic: string
  audio?: string | null
  feedbackAudio?: {
    correct: string
    wrong: string
  } | null
}

export interface AnswerCheck {
  isCorrect: boolean
  correctIndex: number
  selectedIndex: number
  feedbackAudio?: string | null
}
