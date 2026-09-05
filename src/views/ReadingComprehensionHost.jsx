import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { getState, subscribeToRoom, getResponsesForRoom, subscribeToReadingResponses, startActivity, AVATARS } from '../store/gameStore'
import Timer from '../components/Timer'
import styles from './ReadingComprehensionHost.module.css'

export default function ReadingComprehensionHost() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const roomCode = params.get('room')

  const [gameState, setGameState] = useState(null)
  const [responses, setResponses] = useState([])
  const [starting, setStarting] = useState(false)
  const [now, setNow] = useState(Date.now())

  // Tick every second so the "Time Remaining" display actually counts down
  // instead of only updating when a realtime event happens to re-render us.
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!roomCode) return

    // Fetch game state
    getState(roomCode).then(state => {
      setGameState(state)
    })

    // Fetch initial responses
    getResponsesForRoom(roomCode).then(initialResponses => {
      setResponses(initialResponses)
    })

    // Subscribe to game state changes
    const unsubscribeRoom = subscribeToRoom(roomCode, setGameState)

    // Subscribe to new responses
    const unsubscribeResponses = subscribeToReadingResponses(roomCode, (newResponse) => {
      setResponses(prev => {
        // Avoid duplicates
        const exists = prev.some(r => r.id === newResponse.id)
        return exists ? prev : [...prev, newResponse]
      })
    })

    return () => {
      unsubscribeRoom?.()
      unsubscribeResponses?.()
    }
  }, [roomCode])

  if (!gameState) {
    return (
      <div className={styles.root}>
        <div className={styles.loading}>Loading activity...</div>
      </div>
    )
  }

  const { activityState = {} } = gameState
  const { topic, timeLimit, startedAt } = activityState
  const joinUrl = `http://10.0.0.151:5173/?view=student&room=${roomCode}`
  const avatarMap = Object.fromEntries(AVATARS.map(a => [a.id, a]))

  // Calculate times
  const startTime = startedAt ? new Date(startedAt).getTime() : now
  const endTime = startTime + (timeLimit * 60 * 1000)
  const elapsedMs = now - startTime
  const elapsedSecs = Math.floor(elapsedMs / 1000)
  const remainingSecs = Math.max(0, Math.floor((endTime - now) / 1000))

  const handleGradeClick = () => {
    navigate(`/admin/grading/${roomCode}`)
  }

  const handleBeginActivity = async () => {
    if (startedAt || starting) return
    setStarting(true)
    try {
      await startActivity(roomCode)
    } finally {
      setStarting(false)
    }
  }

  // Show all players who joined, but highlight those who submitted
  const allPlayers = gameState.players || []
  const submittedStudentIds = new Set(responses.map(r => r.student_id))
  const studentCount = responses.length
  const allSubmitted = remainingSecs === 0 || (allPlayers.length > 0 && allPlayers.length === responses.length)

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.pattern} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.activityTag}>Reading Comprehension</div>
      </header>

      {/* Topic Banner */}
      {topic && (
        <div className={styles.topicBanner}>
          <div className={styles.topicLabel}>Current Topic</div>
          <div className={styles.topicTitle}>{topic.title}</div>
          <div className={styles.topicStats}>
            {topic.perspectives?.length || 0} perspectives · {timeLimit} minute{timeLimit > 1 ? 's' : ''}
          </div>
        </div>
      )}

      <div className={styles.body}>

        {/* Left: QR Panel */}
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
            <li>Scan the QR code</li>
            <li>Enter your name</li>
            <li>Read perspectives</li>
            <li>Write response</li>
          </ol>

          <div className={styles.timerBox}>
            <div className={styles.timerLabel}>Time Remaining</div>
            <div className={`${styles.timer} ${remainingSecs <= 30 ? styles.timerWarning : ''}`}>
              {Math.floor(remainingSecs / 60)}:{String(remainingSecs % 60).padStart(2, '0')}
            </div>
          </div>

          <div className={styles.mascotFooter}>
            <img src="/reclining.png" alt="Pacey" className={styles.panelMascot} />
          </div>
        </div>

        {/* Right: Submissions Panel */}
        <div className={styles.submissionsPanel}>
          <div className={styles.submissionsPanelHeader}>
            <span className={styles.submissionCount}>
              {studentCount}/{allPlayers.length} submitted
            </span>
            <div className={`${styles.liveIndicator} ${allPlayers.length > 0 ? styles.livePulse : ''}`}>
              <span className={styles.liveDot} />
              LIVE
            </div>
          </div>

          <div className={styles.submissionGrid}>
            {allPlayers.length > 0 ? (
              allPlayers.map((player, i) => {
                const hasSubmitted = submittedStudentIds.has(player.id)
                const avatar = avatarMap[player.avatarId] || AVATARS[0]
                return (
                  <div
                    key={player.id}
                    className={`${styles.submissionTile} ${!hasSubmitted ? styles.submissionTilePending : ''}`}
                    style={{ animationDelay: `${i * 0.05}s`, opacity: hasSubmitted ? 1 : 0.7 }}
                  >
                    <div
                      className={styles.avatarCircle}
                      style={{ background: avatar.color + '33', borderColor: avatar.color }}
                    >
                      <span className={styles.avatarEmoji}>{avatar.emoji}</span>
                    </div>
                    <span className={styles.studentName}>{player.name}</span>
                    <span className={styles.submissionStatus}>{hasSubmitted ? '✓' : '…'}</span>
                  </div>
                )
              })
            ) : (
              <div className={styles.emptyState}>
                <p>Waiting for students...</p>
              </div>
            )}
          </div>

          {allSubmitted && allPlayers.length > 0 && (
            <div className={styles.allSubmittedBanner}>
              All responses submitted! Ready to grade.
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionRow}>
        <button
          className={`${styles.gradeBtn} ${startedAt ? styles.gradeBtnActive : ''}`}
          onClick={handleBeginActivity}
          disabled={!!startedAt || starting}
        >
          {startedAt ? 'Activity Started' : starting ? 'Starting…' : 'Begin Activity'}
        </button>

        <button
          className={`${styles.gradeBtn} ${allSubmitted ? styles.gradeBtnActive : ''}`}
          onClick={handleGradeClick}
          disabled={studentCount === 0}
        >
          Grade Responses
        </button>

        <p className={styles.actionHint}>
          {allSubmitted && allPlayers.length > 0
            ? `${studentCount} student${studentCount !== 1 ? 's' : ''} submitted — ready to grade`
            : remainingSecs > 0
            ? `Activity in progress — ${studentCount}/${allPlayers.length} responses so far`
            : 'Time\'s up! All responses collected.'}
        </p>
      </div>
    </div>
  )
}