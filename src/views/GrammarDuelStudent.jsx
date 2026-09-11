import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getState,
  subscribeToRoom,
  getAnswersForRoom,
  subscribeToGrammarAnswers,
  submitGrammarAnswer,
  computeGrammarPoints,
  buildGrammarLeaderboard,
} from '../store/gameStore'
import styles from './GrammarDuelStudent.module.css'

const CHOICE_LETTERS = ['A', 'B', 'C', 'D']

function promptFor(mode) {
  return mode === 'incorrect' ? 'Which sentence has a mistake?' : 'Which sentence is correct?'
}

export default function GrammarDuelStudent() {
  const [params] = useSearchParams()
  const roomCode = params.get('room') || '????'

  const [gameState, setGameState] = useState(null)
  const [myPlayer, setMyPlayer] = useState(null)
  const [answers, setAnswers] = useState([])
  // questionIndex -> { choiceIndex, correct, points } for this device's own answers
  const [myAnswersByIndex, setMyAnswersByIndex] = useState({})
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!roomCode || roomCode === '????') return

    getState(roomCode).then(state => {
      setGameState(state)
      const storedPlayer = sessionStorage.getItem(`player_${roomCode}`)
      if (storedPlayer) setMyPlayer(JSON.parse(storedPlayer))
    })

    getAnswersForRoom(roomCode).then(setAnswers)

    const unsubscribeRoom = subscribeToRoom(roomCode, setGameState)
    const unsubscribeAnswers = subscribeToGrammarAnswers(roomCode, (newAnswer) => {
      setAnswers(prev => (prev.some(a => a.id === newAnswer.id) ? prev : [...prev, newAnswer]))
    })

    return () => {
      unsubscribeRoom?.()
      unsubscribeAnswers?.()
    }
  }, [roomCode])

  if (!gameState || !myPlayer) {
    return <div className={styles.root}>Loading...</div>
  }

  const { activityState = {} } = gameState
  const { themeTitle, themeEmoji, secondsPerQuestion, questions = [], currentQuestionIndex = -1, questionStartedAt, status = 'lobby' } = activityState

  // Waiting room — room/theme chosen, but the teacher hasn't begun yet.
  if (status === 'lobby' || currentQuestionIndex < 0) {
    return (
      <div className={styles.root}>
        <div className={styles.orb1} />
        <div className={styles.pattern} />
        <div className={styles.waitingCard}>
          <h2 className={styles.waitingTitle}>You're in!</h2>
          <p className={styles.waitingText}>
            {themeTitle ? `${themeEmoji} ${themeTitle} — waiting for your teacher to start…` : 'Waiting for your teacher to start…'}
          </p>
        </div>
      </div>
    )
  }

  // ── FINISHED: my results ────────────────────────────────────
  if (status === 'finished') {
    const leaderboard = buildGrammarLeaderboard(gameState.players || [], answers)
    const myRank = leaderboard.findIndex(e => e.id === myPlayer.id)
    const myEntry = myRank >= 0 ? leaderboard[myRank] : null

    return (
      <div className={styles.root}>
        <div className={styles.orb1} />
        <div className={styles.pattern} />
        <div className={styles.container}>
          <div className={styles.resultsPhase}>
            <img src="/rockNroll.png" alt="Pacey" className={styles.turtleImage} />
            <h2 className={styles.resultsMessage}>Great duel, {myPlayer.name}!</h2>
            <div className={styles.statsBox}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Your Rank</span>
                <span className={styles.statValue}>{myRank >= 0 ? `#${myRank + 1} of ${leaderboard.length}` : '—'}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Correct</span>
                <span className={styles.statValue}>{myEntry ? `${myEntry.correct}/${questions.length}` : `0/${questions.length}`}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Points</span>
                <span className={styles.statValue}>{myEntry?.points || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── ACTIVE: question or reveal ──────────────────────────────
  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) {
    return <div className={styles.root}>Loading question...</div>
  }

  const startMs = questionStartedAt ? new Date(questionStartedAt).getTime() : now
  const elapsedMs = now - startMs
  const totalMs = (secondsPerQuestion || 20) * 1000
  const remainingSecs = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000))
  const timeUp = elapsedMs >= totalMs

  const myAnswer = myAnswersByIndex[currentQuestionIndex]
  const locked = !!myAnswer

  async function handleChoose(choiceIndex) {
    if (locked || timeUp) return
    const timeTakenMs = Math.min(elapsedMs, totalMs)
    const correct = choiceIndex === currentQuestion.correctIndex
    const points = computeGrammarPoints(correct, timeTakenMs, secondsPerQuestion || 20)

    // Lock in immediately for a snappy UI — the write happens in the background.
    setMyAnswersByIndex(prev => ({ ...prev, [currentQuestionIndex]: { choiceIndex, correct, points } }))

    await submitGrammarAnswer(
      roomCode, myPlayer.id, myPlayer.name,
      currentQuestionIndex, currentQuestion.id,
      choiceIndex, correct, timeTakenMs, points
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.pattern} />

      <div className={styles.timerFixed}>
        <div className={styles.timerLabel}>Time Left</div>
        <div className={`${styles.timer} ${remainingSecs <= 5 && !timeUp ? styles.warning : ''}`}>
          {timeUp ? '0:00' : `0:${String(remainingSecs).padStart(2, '0')}`}
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.questionPhase}>
          <div className={styles.progressLabel}>Question {currentQuestionIndex + 1} of {questions.length}</div>
          <h1 className={styles.phaseTitle}>{promptFor(currentQuestion.mode)}</h1>

          <div className={styles.choicesGrid}>
            {currentQuestion.choices.map((choice, i) => {
              const isMine = myAnswer?.choiceIndex === i
              const isCorrectChoice = i === currentQuestion.correctIndex
              const showReveal = timeUp
              let cardClass = styles.choiceCard
              if (showReveal && isCorrectChoice) cardClass += ` ${styles.choiceCardCorrect}`
              else if (showReveal && isMine && !isCorrectChoice) cardClass += ` ${styles.choiceCardWrong}`
              else if (showReveal) cardClass += ` ${styles.choiceCardFaded}`
              else if (isMine) cardClass += ` ${styles.choiceCardSelected}`

              return (
                <button
                  key={i}
                  className={cardClass}
                  onClick={() => handleChoose(i)}
                  disabled={locked || timeUp}
                >
                  <span className={styles.choiceLetter}>{CHOICE_LETTERS[i]}</span>
                  <span className={styles.choiceText}>{choice}</span>
                </button>
              )
            })}
          </div>

          {!timeUp && locked && (
            <p className={styles.phaseInstruction}>You're locked in — waiting for the timer…</p>
          )}
          {!timeUp && !locked && (
            <p className={styles.phaseInstruction}>Tap a sentence to answer.</p>
          )}
          {timeUp && (
            <div className={styles.revealBanner}>
              {myAnswer ? (
                myAnswer.correct ? (
                  <span className={styles.revealCorrect}>Correct! +{myAnswer.points} points</span>
                ) : (
                  <span className={styles.revealWrong}>Not quite — 0 points</span>
                )
              ) : (
                <span className={styles.revealWrong}>Time's up — no answer submitted</span>
              )}
              <p className={styles.explanationText}>{currentQuestion.explanation}</p>
              <p className={styles.phaseInstruction}>Waiting for your teacher to continue…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
