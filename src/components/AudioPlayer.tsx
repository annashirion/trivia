import { useState, useRef, useEffect } from 'react'
import './AudioPlayer.css'
import { useAudioManager } from '../hooks/useAudioManager'

interface AudioPlayerProps {
  audioData: string | null
  className?: string
  autoPlay?: boolean
}

function AudioPlayer({ audioData, className = '', autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { audioRef, registerAudio, unregisterAudio, playAudio } = useAudioManager()

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        playAudio(audioRef.current)
        setIsPlaying(true)
      }
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
  }

  const handleAudioError = () => {
    setIsPlaying(false)
    setError('Audio playback failed')
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
      playAudio(audioRef.current).then(() => {
        setIsPlaying(true)
      }).catch((playError) => {
        console.log('Autoplay blocked by browser:', playError)
        setError('Click the button to play audio (autoplay blocked)')
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
        onEnded={handleAudioEnd}
        onError={handleAudioError}
        preload="none"
      />
    </div>
  )
}

export default AudioPlayer
