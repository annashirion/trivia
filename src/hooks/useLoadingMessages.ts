import { useState, useEffect } from 'react'

const loadingMessages = [
  "Loading questions...",
  "Generating audio...",
  "Adding some trivia magic...",
  "Asking the smartest AI in the room...",
  "Making sure the questions aren't too easy...",
  "Loading the fun...",
  "Almost ready...",
  "Gathering random facts from the internet...",
  "Making sure the AI doesn't cheat...",
  "Preparing audio that won't put you to sleep...",
  "Loading questions that will make you go 'hmm'...",
  "Almost there, just a few more seconds...",
  "The AI is thinking really hard...",
  "Preparing to test your knowledge...",
  "Loading the ultimate trivia experience..."
]

export function useLoadingMessages(intervalMs: number = 5000) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        (prevIndex + 1) % loadingMessages.length
      )
    }, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])

  return loadingMessages[currentMessageIndex]
}
