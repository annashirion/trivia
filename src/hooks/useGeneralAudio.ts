import { useState, useCallback } from 'react'
import { API_BASE } from '../utils/api'

interface GeneralAudioResponse {
  audio: string
  text: string
}

export function useGeneralAudio() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateGeneralAudio = useCallback(async (
    type: 'welcome' | 'results',
    data?: { score: number; totalQuestions: number }
  ): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/general-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to generate general audio`)
      }

      const responseData: GeneralAudioResponse = await response.json()
      return responseData.audio
    } catch (err) {
      console.error('Error generating general audio:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate general audio'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    generateGeneralAudio,
    isLoading,
    error
  }
}
