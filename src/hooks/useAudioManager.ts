import { useRef, useCallback } from 'react'

// Global audio manager to stop all playing audio
class AudioManager {
  private static instance: AudioManager
  private activeAudioElements: Set<HTMLAudioElement> = new Set()

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  register(audioElement: HTMLAudioElement) {
    this.activeAudioElements.add(audioElement)
  }

  unregister(audioElement: HTMLAudioElement) {
    this.activeAudioElements.delete(audioElement)
  }

  stopAll() {
    this.activeAudioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause()
        audio.currentTime = 0
      }
    })
  }
}

export function useAudioManager() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioManager = AudioManager.getInstance()

  const registerAudio = useCallback((audioElement: HTMLAudioElement | null) => {
    if (audioElement) {
      audioManager.register(audioElement)
    }
  }, [audioManager])

  const unregisterAudio = useCallback((audioElement: HTMLAudioElement | null) => {
    if (audioElement) {
      audioManager.unregister(audioElement)
    }
  }, [audioManager])

  const stopAllAudio = useCallback(() => {
    audioManager.stopAll()
  }, [audioManager])

  const playAudio = useCallback(async (audioElement: HTMLAudioElement | null) => {
    if (audioElement) {
      // Stop all other audio first
      audioManager.stopAll()
      
      try {
        await audioElement.play()
      } catch (error) {
        console.log('Audio play failed:', error)
      }
    }
  }, [audioManager])

  return {
    audioRef,
    registerAudio,
    unregisterAudio,
    stopAllAudio,
    playAudio
  }
}
