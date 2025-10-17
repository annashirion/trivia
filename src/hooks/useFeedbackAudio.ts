import { useState, useCallback } from 'react'
import { API_BASE } from '../utils/api'

interface FeedbackAudioResponse {
  audio: string
  text: string
}

export function useFeedbackAudio() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateFeedbackAudio = useCallback(async (
    type: 'correct' | 'wrong',
    question: string,
    correctAnswer: string,
    selectedAnswer?: string
  ): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/feedback-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          question,
          correctAnswer,
          selectedAnswer
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to generate feedback audio`)
      }

      const data: FeedbackAudioResponse = await response.json()
      return data.audio
    } catch (err) {
      console.error('Error generating feedback audio:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate feedback audio'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    generateFeedbackAudio,
    isLoading,
    error
  }
}
