import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getState, subscribeToRoom, submitReadingResponse, AVATARS } from '../store/gameStore'
import Timer from '../components/Timer'
import PerspectiveCard from '../components/PerspectiveCard'
import styles from './ReadingComprehensionStudent.module.css'

/**
 * ReadingComprehensionStudent
 * Student-facing view for reading comprehension activity
 *
 * Flow:
 * 1. Display topic + perspective cards (must read all before writing)
 * 2. Start writing when all perspectives tapped
 * 3. Type response with word count indicator
 * 4. Submit before or at timer end
 * 5. Show submission confirmation
 */
export default function ReadingComprehensionStudent() {
  const [params] = useSearchParams()
  const roomCode = params.get('room') || '????'

  const [gameState, setGameState] = useState(null)
  const [phase, setPhase] = useState('reading')  // 'reading', 'writing', 'submitted'
  const [myPlayer, setMyPlayer] = useState(null)
  const [tappedPerspectives, setTappedPerspectives] = useState(new Set())
  const [responseText, setResponseText] = useState('')
  const [submissionTime, setSubmissionTime] = useState(null)

  useEffect(() => {
    if (!roomCode || roomCode === '????') return

    getState(roomCode).then(state => {
      setGameState(state)
      // Find this player in the list (stored in sessionStorage during join)
      const storedPlayer = sessionStorage.getItem(`player_${roomCode}`)
      if (storedPlayer) {
        setMyPlayer(JSON.parse(storedPlayer))
      }
    })

    const unsubscribe = subscribeToRoom(roomCode, setGameState)
    return unsubscribe
  }, [roomCode])

  if (!gameState || !myPlayer) {
    return <div className={styles.root}>Loading...</div>
  }

  const { activityState = {} } = gameState
  const { topic, timeLimit, startedAt } = activityState
  if (!topic) {
    return <div className={styles.root}>Waiting for activity to begin...</div>
  }

  const allPerspectiveIds = new Set(topic.perspectives.map(p => p.id))
  const allRead = tappedPerspectives.size === allPerspectiveIds.size
  const wordCount = responseText.trim().split(/\s+/).filter(w => w.length > 0).length

  // Determine target word count based on time limit
  let targetWords = 20
  if (timeLimit === 5) targetWords = 100
  if (timeLimit === 10) targetWords = 200

  // Calculate timer values (timeLimit is in minutes, convert to milliseconds)
  const startedAtMs = new Date(startedAt).getTime()
  const endsAtMs = startedAtMs + (timeLimit * 60 * 1000)

  const handlePerspectiveTap = (perspectiveId) => {
    setTappedPerspectives(prev => new Set([...prev, perspectiveId]))
  }

  const handleStartWriting = () => {
    if (allRead) {
      setPhase('writing')
    }
  }

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      alert('Please write a response before submitting.')
      return
    }

    // Calculate elapsed time
    const elapsedMs = Date.now() - startedAtMs
    const elapsedSeconds = Math.floor(elapsedMs / 1000)
    setSubmissionTime(elapsedSeconds)

    await submitReadingResponse(
      roomCode,
      myPlayer.id,
      myPlayer.name,
      responseText,
      elapsedSeconds
    )

    setPhase('submitted')
  }

  const handleTimerComplete = async () => {
    if (phase === 'writing' && responseText.trim()) {
      const elapsedMs = Date.now() - startedAtMs
      const elapsedSeconds = Math.floor(elapsedMs / 1000)
      setSubmissionTime(elapsedSeconds)

      await submitReadingResponse(
        roomCode,
        myPlayer.id,
        myPlayer.name,
        responseText,
        elapsedSeconds
      )
      setPhase('submitted')
    }
  }

  // Reading phase: Show perspective cards
  if (phase === 'reading') {
    return (
      <div className={styles.root}>
        <div className={styles.timer}>
          <Timer
            startedAt={startedAtMs}
            endsAt={endsAtMs}
            onComplete={handleTimerComplete}
            showAsLarge={false}
          />
        </div>

        <div className={styles.content}>
          <h1 className={styles.topic}>{topic.title}</h1>

          <div className={styles.perspectiveGrid}>
            {topic.perspectives.map(perspective => (
              <PerspectiveCard
                key={perspective.id}
                perspective={perspective}
                onTap={() => handlePerspectiveTap(perspective.id)}
                tapped={tappedPerspectives.has(perspective.id)}
                expanded={tappedPerspectives.has(perspective.id)}
              />
            ))}
          </div>

          <div className={styles.bottomSection}>
            <div className={styles.progressText}>
              {tappedPerspectives.size} of {topic.perspectives.length} perspectives read
            </div>
            <button
              className={`${styles.startBtn} ${allRead ? styles.startBtn_enabled : styles.startBtn_disabled}`}
              onClick={handleStartWriting}
              disabled={!allRead}
            >
              Start Writing
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Writing phase: Show text input
  if (phase === 'writing') {
    return (
      <div className={styles.root}>
        <div className={styles.writingContainer}>
          <div className={styles.header}>
            <h2 className={styles.writingTitle}>{topic.title}</h2>
            <div className={styles.timer}>
              <Timer
                startedAt={startedAtMs}
                endsAt={endsAtMs}
                onComplete={handleTimerComplete}
                showAsLarge={false}
              />
            </div>
          </div>

          <textarea
            className={styles.textarea}
            placeholder="Type your response..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            autoFocus
          />

          <div className={styles.writingFooter}>
            <div className={styles.wordCount}>
              <span className={styles.current}>{wordCount}</span>
              <span className={styles.target}>/ ~{targetWords}</span>
              <span className={styles.label}>words</span>
            </div>

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={!responseText.trim()}
            >
              Submit Response
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Submitted phase: Show confirmation
  if (phase === 'submitted') {
    return (
      <div className={styles.root}>
        <div className={styles.submittedContainer}>
          <div className={styles.submittedIcon}>✓</div>
          <h2 className={styles.submittedTitle}>Response Submitted</h2>
          <p className={styles.submittedMessage}>
            Your response has been submitted successfully.
          </p>
          <p className={styles.submittedSubtext}>
            Your teacher will review your response and provide feedback.
          </p>
          <div className={styles.submittedStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Words:</span>
              <span className={styles.statValue}>{wordCount}</span>
            </div>
            {submissionTime !== null && (
              <div className={styles.stat}>
                <span className={styles.statLabel}>Time Spent:</span>
                <span className={styles.statValue}>{Math.floor(submissionTime / 60)}:{String(submissionTime % 60).padStart(2, '0')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
