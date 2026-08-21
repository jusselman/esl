import React, { useState, useEffect } from 'react'

/**
 * Timer Component
 * Displays countdown timer for reading comprehension activities
 * Syncs with start/end timestamps from server
 */
export default function Timer({ startedAt, endsAt, onComplete, showAsLarge = false }) {
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((endsAt - now) / 1000))
      setRemainingSeconds(remaining)

      if (remaining === 0 && onComplete) {
        onComplete()
      }
    }

    updateTimer() // Update immediately
    const interval = setInterval(updateTimer, 100)
    return () => clearInterval(interval)
  }, [endsAt, onComplete])

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`

  if (showAsLarge) {
    return (
      <div style={{
        fontSize: '48px',
        fontWeight: 'bold',
        color: remainingSeconds <= 30 ? '#FF6B6B' : '#333',
        textAlign: 'center',
        fontFamily: 'monospace'
      }}>
        {formattedTime}
      </div>
    )
  }

  return (
    <div style={{
      fontSize: '20px',
      fontWeight: '600',
      color: remainingSeconds <= 30 ? '#FF6B6B' : '#666',
      textAlign: 'center',
      fontFamily: 'monospace'
    }}>
      {formattedTime}
    </div>
  )
}
