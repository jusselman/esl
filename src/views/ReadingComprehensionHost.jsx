import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { getState, subscribeToRoom, AVATARS } from '../store/gameStore'
import Timer from '../components/Timer'
import styles from './ReadingComprehensionHost.module.css'

/**
 * ReadingComprehensionHost
 * Teacher's classroom view for reading comprehension activity
 *
 * Shows:
 * - QR code for students to join
 * - Room code
 * - Countdown timer (synchronized with student timers)
 * - Student submission cards as they arrive
 * - Cannot open responses (prevents class distraction)
 */
export default function ReadingComprehensionHost() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const roomCode = params.get('room')

  const [gameState, setGameState] = useState(null)
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    if (!roomCode) return

    getState(roomCode).then(setGameState)
    const unsubscribe = subscribeToRoom(roomCode, setGameState)
    return unsubscribe
  }, [roomCode])

  if (!gameState) {
    return <div className={styles.root}>Loading...</div>
  }

  const { players = [], activityState = {} } = gameState
  const { topic, timeLimit } = activityState
  const studentResponses = gameState.studentResponses || {}
  const joinUrl = `${window.location.protocol}//${window.location.host}/?view=student&room=${roomCode}`
  const submittedCount = Object.keys(studentResponses).length
  const avatarMap = Object.fromEntries(AVATARS.map(a => [a.id, a]))

  // Calculate end time from time limit
  const startedAt = new Date(activityState.startedAt).getTime()
  const endsAt = startedAt + (timeLimit * 1000)

  const handleGradeClick = () => {
    navigate(`/admin/grading/${roomCode}`)
  }

  const handleTimerComplete = () => {
    // Timer ended - all responses should be submitted by now
  }

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.pattern} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.activityTag}>Reading Comprehension</div>
        <h2 className={styles.topicTitle}>{topic?.title || 'Loading...'}</h2>
      </header>

      <div className={styles.body}>
        {/* Left: QR + Instructions */}
        <div className={styles.joinPanel}>
          <div className={styles.panelTitle}>Scan to Join</div>

          <div className={styles.qrWrap}>
            <QRCodeSVG
              value={joinUrl}
              size={160}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>

          <div className={styles.codeBlock}>
            <div className={styles.codeLabel}>Room Code</div>
            <div className={styles.codeDigits}>
              {(roomCode || '----').split('').map((d, i) => (
                <span key={i} className={styles.digit}>{d}</span>
              ))}
            </div>
          </div>

          <ol className={styles.instructions}>
            <li>Students scan the QR code</li>
            <li>They tap all perspectives to read</li>
            <li>Then write and submit their response</li>
          </ol>

          <div className={styles.mascotFooter}>
            <img src="/karate.png" alt="Pacey" className={styles.panelMascot} />
          </div>
        </div>

        {/* Right: Submissions + Timer */}
        <div className={styles.submissionsPanel}>
          <div className={styles.submissionsPanelHeader}>
            <div className={styles.timerBox}>
              <Timer
                startedAt={startedAt}
                endsAt={endsAt}
                onComplete={handleTimerComplete}
                showAsLarge={true}
              />
            </div>
            <div className={styles.submissionCount}>
              {submittedCount} of {players.length} students submitted
            </div>
          </div>

          <div className={styles.submissionCards}>
            {players.length === 0 && (
              <div className={styles.emptyState}>
                <p>Waiting for students to join...</p>
              </div>
            )}

            {players.map((player, i) => {
              const avatar = avatarMap[player.avatarId] || AVATARS[0]
              const hasSubmitted = !!studentResponses[player.id]

              return (
                <div
                  key={player.id}
                  className={`${styles.submissionCard} ${hasSubmitted ? styles.submissionCard_submitted : ''}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div
                    className={styles.cardAvatar}
                    style={{ background: avatar.color + '33', borderColor: avatar.color }}
                  >
                    <span className={styles.avatarEmoji}>{avatar.emoji}</span>
                  </div>
                  <span className={styles.cardName}>{player.name}</span>
                  <span className={styles.cardStatus}>
                    {hasSubmitted ? '✓' : '...'}
                  </span>
                </div>
              )
            })}
          </div>

          {submittedCount === players.length && players.length > 0 && (
            <div className={styles.allSubmittedBanner}>
              All students have submitted! Ready to grade.
            </div>
          )}

          <button
            className={`${styles.gradeBtn} ${submittedCount > 0 ? styles.gradeBtn_active : ''}`}
            onClick={handleGradeClick}
            disabled={submittedCount === 0}
          >
            Grade Responses →
          </button>
        </div>
      </div>
    </div>
  )
}
