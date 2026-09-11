import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  getState,
  subscribeToRoom,
  getAnswersForRoom,
  subscribeToGrammarAnswers,
  startGrammarDuel,
  advanceGrammarQuestion,
  buildGrammarLeaderboard,
  AVATARS,
} from '../store/gameStore'
import styles from './GrammarDuelHost.module.css'

const CHOICE_LETTERS = ['A', 'B', 'C', 'D']

function promptFor(mode) {
  return mode === 'incorrect' ? 'Which sentence has a mistake?' : 'Which sentence is correct?'
}

export default function GrammarDuelHost() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const roomCode = params.get('room')

  const [gameState, setGameState] = useState(null)
  const [answers, setAnswers] = useState([])
  const [starting, setStarting] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!roomCode) return

    getState(roomCode).then(setGameState)
    getAnswersForRoom(roomCode).then(setAnswers)

    const unsubscribeRoom = subscribeToRoom(roomCode, setGameState)
    const unsubscribeAnswers = subscribeToGrammarAnswers(roomCode, (newAnswer) => {
      setAnswers(prev => (prev.some(a => a.id === newAnswer.id) ? prev : [...prev, newAnswer]))
    })

    // Safety-net poll in case the realtime publication isn't enabled for
    // grammar_answers (same fallback used for reading_responses).
    const pollInterval = setInterval(() => {
      getAnswersForRoom(roomCode).then(setAnswers)
    }, 3000)

    return () => {
      unsubscribeRoom?.()
      unsubscribeAnswers?.()
      clearInterval(pollInterval)
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
  const {
    themeTitle, themeEmoji, secondsPerQuestion, questions = [],
    currentQuestionIndex = -1, questionStartedAt, status = 'lobby',
  } = activityState
  const allPlayers = gameState.players || []
  const avatarMap = Object.fromEntries(AVATARS.map(a => [a.id, a]))
  const joinUrl = `${window.location.origin}/?view=student&room=${roomCode}`

  const currentQuestion = currentQuestionIndex >= 0 ? questions[currentQuestionIndex] : null
  const startMs = questionStartedAt ? new Date(questionStartedAt).getTime() : now
  const elapsedMs = now - startMs
  const totalMs = (secondsPerQuestion || 20) * 1000
  const remainingSecs = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000))
  const timeUp = elapsedMs >= totalMs

  const currentAnswers = currentQuestion
    ? answers.filter(a => a.question_index === currentQuestionIndex)
    : []
  const choiceCounts = [0, 0, 0, 0]
  currentAnswers.forEach(a => { if (a.choice_index >= 0 && a.choice_index < 4) choiceCounts[a.choice_index]++ })
  const answeredCount = currentAnswers.length
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const leaderboard = buildGrammarLeaderboard(allPlayers, answers)

  async function handleBeginActivity() {
    if (status !== 'lobby' || starting) return
    setStarting(true)
    try {
      await startGrammarDuel(roomCode)
    } finally {
      setStarting(false)
    }
  }

  async function handleNext() {
    if (advancing) return
    setAdvancing(true)
    try {
      await advanceGrammarQuestion(roomCode)
    } finally {
      setAdvancing(false)
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
          <div className={styles.activityTag}>Grammar Duel — {themeEmoji} {themeTitle}</div>
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
              <li>Wait for the first question</li>
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
          <h1 className={styles.finishedTitle}>Duel Complete!</h1>
          <div className={styles.leaderboardCard}>
            {leaderboard.map((entry, i) => {
              const avatar = avatarMap[entry.avatarId] || AVATARS[0]
              return (
                <div key={entry.id} className={`${styles.leaderRow} ${i < 3 ? styles.leaderRowTop : ''}`}>
                  <span className={styles.leaderRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                  <span className={styles.leaderAvatar} style={{ background: avatar.color + '33', borderColor: avatar.color }}>{avatar.emoji}</span>
                  <span className={styles.leaderName}>{entry.name}</span>
                  <span className={styles.leaderStat}>{entry.correct}/{questions.length} correct</span>
                  <span className={styles.leaderPoints}>{entry.points} pts</span>
                </div>
              )
            })}
          </div>
          <button className={styles.primaryBtn} onClick={() => navigate('/menu')}>Back to Activities</button>
        </div>
      </div>
    )
  }

  // ── ACTIVE: question or reveal ──────────────────────────────
  if (!currentQuestion) {
    return (
      <div className={styles.root}>
        <div className={styles.loading}>Loading question...</div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.pattern} />

      <header className={styles.header}>
        <div className={styles.activityTag}>{themeEmoji} {themeTitle}</div>
        <div className={styles.progressTag}>Question {currentQuestionIndex + 1} of {questions.length}</div>
        <div className={`${styles.timerTag} ${remainingSecs <= 5 && !timeUp ? styles.timerTagWarning : ''}`}>
          {timeUp ? "Time's up!" : `${remainingSecs}s`}
        </div>
      </header>

      <div className={styles.questionCard}>
        <div className={styles.categoryBadge}>{currentQuestion.category}</div>
        <h2 className={styles.questionPrompt}>{promptFor(currentQuestion.mode)}</h2>

        <div className={styles.choicesGrid}>
          {currentQuestion.choices.map((choice, i) => {
            const isCorrect = i === currentQuestion.correctIndex
            const count = choiceCounts[i]
            const showReveal = timeUp
            return (
              <div
                key={i}
                className={`${styles.choiceCard} ${showReveal && isCorrect ? styles.choiceCardCorrect : ''} ${showReveal && !isCorrect ? styles.choiceCardFaded : ''}`}
              >
                <span className={styles.choiceLetter}>{CHOICE_LETTERS[i]}</span>
                <span className={styles.choiceText}>{choice}</span>
                {showReveal && (
                  <span className={styles.choiceCount}>{count}</span>
                )}
              </div>
            )
          })}
        </div>

        {timeUp && (
          <p className={styles.explanationText}>{currentQuestion.explanation}</p>
        )}

        {!timeUp && (
          <p className={styles.answeredHint}>{answeredCount}/{allPlayers.length} answered</p>
        )}
      </div>

      {timeUp && (
        <div className={styles.revealFooter}>
          <div className={styles.miniLeaderboard}>
            {leaderboard.slice(0, 5).map((entry, i) => {
              const avatar = avatarMap[entry.avatarId] || AVATARS[0]
              return (
                <div key={entry.id} className={styles.miniLeaderRow}>
                  <span className={styles.miniLeaderRank}>#{i + 1}</span>
                  <span className={styles.miniLeaderAvatar} style={{ background: avatar.color + '33', borderColor: avatar.color }}>{avatar.emoji}</span>
                  <span className={styles.miniLeaderName}>{entry.name}</span>
                  <span className={styles.miniLeaderPoints}>{entry.points} pts</span>
                </div>
              )
            })}
          </div>
          <button className={styles.primaryBtn} onClick={handleNext} disabled={advancing}>
            {advancing ? 'Loading…' : isLastQuestion ? 'Show Final Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  )
}
