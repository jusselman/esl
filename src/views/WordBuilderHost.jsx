import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  getState,
  subscribeToRoom,
  getProgressForRoom,
  subscribeToWordProgress,
  startWordBuilder,
  finishWordBuilder,
  buildWordBuilderLeaderboard,
  WORD_BUILDER_STARTING_POINTS,
  AVATARS,
} from '../store/gameStore'
import styles from './WordBuilderHost.module.css'

export default function WordBuilderHost() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const roomCode = params.get('room')

  const [gameState, setGameState] = useState(null)
  const [progressRows, setProgressRows] = useState([])
  const [starting, setStarting] = useState(false)
  const [now, setNow] = useState(Date.now())
  const finishingRef = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!roomCode) return

    getState(roomCode).then(setGameState)
    getProgressForRoom(roomCode).then(setProgressRows)

    const unsubscribeRoom = subscribeToRoom(roomCode, setGameState)
    const unsubscribeProgress = subscribeToWordProgress(roomCode, (row) => {
      setProgressRows(prev => [...prev.filter(p => p.student_id !== row.student_id), row])
    })

    // Safety-net poll in case the realtime publication isn't enabled for
    // word_builder_progress (same fallback used for reading_responses and
    // grammar_answers).
    const pollInterval = setInterval(() => {
      getProgressForRoom(roomCode).then(setProgressRows)
    }, 3000)

    return () => {
      unsubscribeRoom?.()
      unsubscribeProgress?.()
      clearInterval(pollInterval)
    }
  }, [roomCode])

  const { activityState = {} } = gameState || {}
  const { themeTitle, themeEmoji, timeLimitSecs, words = [], startedAt, status = 'lobby' } = activityState
  const allPlayers = (gameState && gameState.players) || []
  const avatarMap = Object.fromEntries(AVATARS.map(a => [a.id, a]))
  const joinUrl = `${window.location.origin}/?view=student&room=${roomCode}`

  const startMs = startedAt ? new Date(startedAt).getTime() : now
  const elapsedMs = now - startMs
  const totalMs = (timeLimitSecs || 300) * 1000
  const remainingSecs = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000))
  const timeUp = elapsedMs >= totalMs
  const displaySecs = status === 'finished' ? 0 : remainingSecs
  const minutes = Math.floor(displaySecs / 60)
  const seconds = displaySecs % 60

  const leaderboard = buildWordBuilderLeaderboard(allPlayers, progressRows)

  // Auto-finish the room once the shared timer runs out, so a student who
  // never opens their own screen again still ends up in the final results.
  useEffect(() => {
    if (status === 'active' && timeUp && !finishingRef.current) {
      finishingRef.current = true
      finishWordBuilder(roomCode)
    }
  }, [status, timeUp, roomCode])

  if (!gameState) {
    return (
      <div className={styles.root}>
        <div className={styles.loading}>Loading activity...</div>
      </div>
    )
  }

  async function handleBeginActivity() {
    if (status !== 'lobby' || starting) return
    setStarting(true)
    try {
      await startWordBuilder(roomCode)
    } finally {
      setStarting(false)
    }
  }

  // ── LOBBY: QR code + waiting for players ──────────────────────
  if (status === 'lobby') {
    return (
      <div className={styles.root}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.pattern} />

        <header className={styles.header}>
          <div className={styles.activityTag}>Word Builder — {themeEmoji} {themeTitle}</div>
        </header>

        <div className={styles.body}>
          <div className={styles.joinPanel}>
            <div className={styles.panelTitle}>Scan to Join</div>
            <div className={styles.qrWrap}>
              <QRCodeSVG value={joinUrl} size={160} bgColor="#ffffff" fgColor="#000000" level="M" />
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
              <li>Wait for the round to begin</li>
            </ol>
            <div className={styles.mascotFooter}>
              <img src="/reclining.png" alt="Pacey" className={styles.panelMascot} />
            </div>
          </div>

          <div className={styles.submissionsPanel}>
            <div className={styles.submissionsPanelHeader}>
              <span className={styles.submissionCount}>{allPlayers.length} joined</span>
              <div className={`${styles.liveIndicator} ${allPlayers.length > 0 ? styles.livePulse : ''}`}>
                <span className={styles.liveDot} />
                LIVE
              </div>
            </div>
            <div className={styles.submissionGrid}>
              {allPlayers.length > 0 ? (
                allPlayers.map((player, i) => {
                  const avatar = avatarMap[player.avatarId] || AVATARS[0]
                  return (
                    <div key={player.id} className={styles.submissionTile} style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className={styles.avatarCircle} style={{ background: avatar.color + '33', borderColor: avatar.color }}>
                        <span className={styles.avatarEmoji}>{avatar.emoji}</span>
                      </div>
                      <span className={styles.studentName}>{player.name}</span>
                    </div>
                  )
                })
              ) : (
                <div className={styles.emptyState}><p>Waiting for students...</p></div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.actionRow}>
          <button className={styles.primaryBtn} onClick={handleBeginActivity} disabled={allPlayers.length === 0 || starting}>
            {starting ? 'Starting…' : 'Begin Activity'}
          </button>
          <p className={styles.actionHint}>
            {allPlayers.length === 0 ? 'Waiting for at least one student to join...' : `${allPlayers.length} student${allPlayers.length !== 1 ? 's' : ''} ready`}
          </p>
        </div>
      </div>
    )
  }

  // ── FINISHED: final leaderboard ─────────────────────────────
  if (status === 'finished') {
    return (
      <div className={styles.root}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.pattern} />

        <div className={styles.finishedWrap}>
          <h1 className={styles.finishedTitle}>Time's Up!</h1>
          <div className={styles.leaderboardCard}>
            {leaderboard.map((entry, i) => {
              const avatar = avatarMap[entry.avatarId] || AVATARS[0]
              return (
                <div key={entry.id} className={`${styles.leaderRow} ${i < 3 ? styles.leaderRowTop : ''}`}>
                  <span className={styles.leaderRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                  <span className={styles.leaderAvatar} style={{ background: avatar.color + '33', borderColor: avatar.color }}>{avatar.emoji}</span>
                  <span className={styles.leaderName}>{entry.name}</span>
                  <span className={styles.leaderStat}>{entry.wordsCompleted} word{entry.wordsCompleted !== 1 ? 's' : ''}</span>
                  <span className={styles.leaderPoints}>{entry.pointsRemaining} pts left</span>
                </div>
              )
            })}
          </div>
          <button className={styles.primaryBtn} onClick={() => navigate('/menu')}>Back to Activities</button>
        </div>
      </div>
    )
  }

  // ── ACTIVE: live leaderboard, self-paced ────────────────────
  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.pattern} />

      <header className={styles.header}>
        <div className={styles.activityTag}>{themeEmoji} {themeTitle}</div>
        <div className={styles.progressTag}>{words.length} words per student</div>
        <div className={`${styles.timerTag} ${remainingSecs <= 30 && !timeUp ? styles.timerTagWarning : ''}`}>
          {timeUp ? "Time's up!" : `${minutes}:${String(seconds).padStart(2, '0')}`}
        </div>
      </header>

      <div className={styles.liveWrap}>
        <div className={styles.leaderboardCard}>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, i) => {
              const avatar = avatarMap[entry.avatarId] || AVATARS[0]
              return (
                <div
                  key={entry.id}
                  className={`${styles.leaderRow} ${i < 3 ? styles.leaderRowTop : ''} ${entry.finished ? styles.leaderRowFinished : ''}`}
                >
                  <span className={styles.leaderRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                  <span className={styles.leaderAvatar} style={{ background: avatar.color + '33', borderColor: avatar.color }}>{avatar.emoji}</span>
                  <span className={styles.leaderName}>{entry.name}</span>
                  <span className={styles.leaderStat}>{entry.wordsCompleted} word{entry.wordsCompleted !== 1 ? 's' : ''}</span>
                  <span className={styles.leaderPoints}>{entry.pointsRemaining}/{WORD_BUILDER_STARTING_POINTS} pts</span>
                </div>
              )
            })
          ) : (
            <div className={styles.emptyState}><p>Waiting for students to start building words...</p></div>
          )}
        </div>
      </div>
    </div>
  )
}
