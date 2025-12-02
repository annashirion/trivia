import { useEffect } from 'react'
import './AudioPlayer.css'
import { useAudioManager } from '../hooks/useAudioManager'

interface AudioPlayerProps {
  audioData: string | null
  className?: string
  autoPlay?: boolean
}

function AudioPlayer({ audioData, className = '', autoPlay = false }: AudioPlayerProps) {
  const { audioRef, registerAudio, unregisterAudio, playAudio } = useAudioManager()

  const handleAudioError = () => {
    console.log('Audio playback failed')
  }

  // Register/unregister audio element
  useEffect(() => {
    if (audioRef.current) {
      registerAudio(audioRef.current)
      return () => unregisterAudio(audioRef.current)
    }
  }, [registerAudio, unregisterAudio])

  // Auto-play when audio data changes and autoPlay is enabled
  useEffect(() => {
    if (autoPlay && audioData && audioRef.current) {
      playAudio(audioRef.current).catch((playError) => {
        console.log('Autoplay blocked by browser:', playError)
      })
    }
  }, [audioData, autoPlay, playAudio])

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        unregisterAudio(audioRef.current)
      }
    }
  }, [unregisterAudio])

  if (!audioData) {
    return null // Don't render anything if no audio data
  }

  return (
    <div className={`audio-player ${className}`}>
      <audio
        ref={audioRef}
        src={audioData}
        onError={handleAudioError}
        preload="none"
      />
    </div>
  )
}

export default AudioPlayer
