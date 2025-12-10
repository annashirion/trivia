import { useState, useCallback, useRef } from 'react'
import { API_BASE } from '../utils/api'

interface QuestionAudio {
  audio: string | null
  feedbackAudio: {
    correct: string
    wrong: string
  } | null
}

interface AudioState {
  [questionId: number]: QuestionAudio
}

interface UseAudioPrefetchReturn {
  audioState: AudioState
  resultsAudio: Record<number, string>
  isAudioReady: (questionId: number) => boolean
  isResultsAudioReady: boolean
  fetchQuestionAudio: (questionId: number) => Promise<void>
  fetchResultsAudio: () => Promise<void>
  getQuestionAudio: (questionId: number) => QuestionAudio | null
}

export function useAudioPrefetch(): UseAudioPrefetchReturn {
  const [audioState, setAudioState] = useState<AudioState>({})
  const [resultsAudio, setResultsAudio] = useState<Record<number, string>>({})
  const [isResultsAudioReady, setIsResultsAudioReady] = useState(false)
  
  // Track in-flight requests to prevent duplicate fetches
  const fetchingQuestions = useRef<Set<number>>(new Set())
  const fetchingResults = useRef<boolean>(false)

  const fetchQuestionAudio = useCallback(async (questionId: number) => {
    // Skip if already fetched or currently fetching
    if (audioState[questionId] || fetchingQuestions.current.has(questionId)) {
      return
    }

    fetchingQuestions.current.add(questionId)

    try {
      const res = await fetch(`${API_BASE}/api/question-audio/${questionId}`)
      
      if (!res.ok) {
        throw new Error('Failed to fetch question audio')
      }
      
      const data = await res.json()
      
      setAudioState(prev => ({
        ...prev,
        [questionId]: {
          audio: data.audio,
          feedbackAudio: data.feedbackAudio
        }
      }))
    } catch (error) {
      console.error(`Error fetching audio for question ${questionId}:`, error)
      // Mark as fetched but with null values to prevent retrying
      setAudioState(prev => ({
        ...prev,
        [questionId]: {
          audio: null,
          feedbackAudio: null
        }
      }))
    } finally {
      fetchingQuestions.current.delete(questionId)
    }
  }, [audioState])

  const fetchResultsAudio = useCallback(async () => {
    // Skip if already fetched or currently fetching
    if (isResultsAudioReady || fetchingResults.current) {
      return
    }

    fetchingResults.current = true

    try {
      const res = await fetch(`${API_BASE}/api/results-audio`)
      
      if (!res.ok) {
        throw new Error('Failed to fetch results audio')
      }
      
      const data = await res.json()
      setResultsAudio(data.resultsAudio || {})
      setIsResultsAudioReady(true)
    } catch (error) {
      console.error('Error fetching results audio:', error)
      setIsResultsAudioReady(true) // Mark as ready even on error to allow showing results
    } finally {
      fetchingResults.current = false
    }
  }, [isResultsAudioReady])

  const isAudioReady = useCallback((questionId: number): boolean => {
    return questionId in audioState
  }, [audioState])

  const getQuestionAudio = useCallback((questionId: number): QuestionAudio | null => {
    return audioState[questionId] || null
  }, [audioState])

  return {
    audioState,
    resultsAudio,
    isAudioReady,
    isResultsAudioReady,
    fetchQuestionAudio,
    fetchResultsAudio,
    getQuestionAudio
  }
}
