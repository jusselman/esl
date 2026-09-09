import React, { useState, useEffect } from 'react'

/**
 * Timer Component
 * Displays countdown timer for reading comprehension activities
 * Syncs with start/end timestamps from server
 *
 * Pass `className` (and optionally `warningClassName`, applied once
 * <=30s remain) to let a CSS module fully control appearance — inline
 * styles are skipped in that case. Without a className, falls back to
 * the original inline-styled small/large variants.
 */
export default function Timer({ startedAt, endsAt, onComplete, showAsLarge = false, className, warningClassName }) {
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
  const isWarning = remainingSeconds <= 30

  if (className) {
    return (
      <div className={isWarning && warningClassName ? `${className} ${warningClassName}` : className}>
        {formattedTime}
      </div>
    )
  }

  if (showAsLarge) {
    return (
      <div style={{
        fontSize: '48px',
        fontWeight: 'bold',
        color: isWarning ? '#FF6B6B' : '#333',
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
      color: isWarning ? '#FF6B6B' : '#666',
      textAlign: 'center',
      fontFamily: 'monospace'
    }}>
      {formattedTime}
    </div>
  )
}
