import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getState, subscribeToRoom, submitReadingResponse } from '../store/gameStore'
import Timer from '../components/Timer'
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

  // Room/topic exist, but the teacher hasn't clicked "Begin Activity" yet —
  // don't start the timer or show reading content until they do.
  if (!startedAt) {
    return (
      <div className={styles.root}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.pattern} />
        <div className={styles.waitingCard}>
          <h2 className={styles.waitingTitle}>You're in!</h2>
          <p className={styles.waitingText}>Waiting for your teacher to start the activity…</p>
        </div>
      </div>
    )
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

  const timerBadge = (
    <div className={styles.timerFixed}>
      <div className={styles.timerLabel}>Time Left</div>
      <Timer
        startedAt={startedAtMs}
        endsAt={endsAtMs}
        onComplete={handleTimerComplete}
        className={styles.timer}
        warningClassName={styles.warning}
      />
    </div>
  )

  // Reading phase: Show perspective cards
  if (phase === 'reading') {
    return (
      <div className={styles.root}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.pattern} />
        {timerBadge}

        <div className={styles.container}>
          <div className={styles.readingPhase}>
            <h1 className={styles.phaseTitle}>{topic.title}</h1>
            <p className={styles.phaseInstruction}>
              Read every perspective below, then share your own response.
            </p>

            <div className={styles.perspectiveGrid}>
              {topic.perspectives.map(perspective => {
                const tapped = tappedPerspectives.has(perspective.id)
                return (
                  <div
                    key={perspective.id}
                    className={`${styles.perspectiveCard} ${tapped ? `${styles.expanded} ${styles.read}` : ''}`}
                    onClick={() => handlePerspectiveTap(perspective.id)}
                  >
                    <div className={styles.perspectiveHeader}>
                      <div className={styles.perspectiveIcon}>{perspective.icon}</div>
                      <div className={styles.perspectiveInfo}>
                        <div className={styles.perspectiveName}>{perspective.name}</div>
                        <div className={styles.perspectiveTitle}>{perspective.title}</div>
                      </div>
                    </div>
                    <div className={styles.perspectiveText}>{perspective.viewpoint}</div>
                    <div className={styles.readIndicator}>{tapped ? '✓ Read' : 'Tap to read'}</div>
                  </div>
                )
              })}
            </div>

            <p className={styles.phaseInstruction}>
              {tappedPerspectives.size} of {topic.perspectives.length} perspectives read
            </p>
            <button
              className={styles.readyButton}
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
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.pattern} />
        {timerBadge}

        <div className={styles.container}>
          <div className={styles.writingPhase}>
            <div className={styles.promptBox}>
              <div className={styles.promptLabel}>Topic</div>
              <div className={styles.promptText}>{topic.title}</div>
            </div>

            <textarea
              className={styles.textarea}
              placeholder="Type your response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              autoFocus
            />

            <div className={styles.wordCountSection}>
              <div className={styles.wordCount}>{wordCount} words</div>
              <div className={`${styles.wordCountTarget} ${wordCount < targetWords ? styles.warning : ''}`}>
                Aim for ~{targetWords}
              </div>
            </div>

            <button
              className={styles.submitButton}
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
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.pattern} />

        <div className={styles.container}>
          <div className={styles.submittedPhase}>
            <img src="/nerdTurtle.png" alt="Pacey" className={styles.turtleImage} />
            <h2 className={styles.submittedMessage}>Keep up the great work!</h2>
            <p className={styles.submittedDetail}>
              Your response has been submitted. Your teacher will review it and provide feedback.
            </p>
            <div className={styles.statsBox}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Words</span>
                <span className={styles.statValue}>{wordCount}</span>
              </div>
              {submissionTime !== null && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Time Spent</span>
                  <span className={styles.statValue}>
                    {Math.floor(submissionTime / 60)}:{String(submissionTime % 60).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
