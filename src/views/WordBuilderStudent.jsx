import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getState,
  subscribeToRoom,
  getProgressForRoom,
  subscribeToWordProgress,
  upsertWordProgress,
  buildWordBuilderLeaderboard,
  WORD_BUILDER_STARTING_POINTS,
} from '../store/gameStore'
import styles from './WordBuilderStudent.module.css'

const KEYBOARD_ROWS = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  'ZXCVBNM'.split(''),
]

export default function WordBuilderStudent() {
  const [params] = useSearchParams()
  const roomCode = params.get('room') || '????'

  const [gameState, setGameState] = useState(null)
  const [myPlayer, setMyPlayer] = useState(null)
  const [progressRows, setProgressRows] = useState([])
  const [now, setNow] = useState(Date.now())

  // Local, self-paced game state — not shared until synced via upsertWordProgress.
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [guessedLetters, setGuessedLetters] = useState([])
  const [pointsRemaining, setPointsRemaining] = useState(WORD_BUILDER_STARTING_POINTS)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [finished, setFinished] = useState(false)
  const [finishReason, setFinishReason] = useState(null) // 'points' | 'words'
  const [solving, setSolving] = useState(false)

  const initializedRef = useRef(false)
  const advanceTimeoutRef = useRef(null)

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

    getProgressForRoom(roomCode).then(setProgressRows)

    const unsubscribeRoom = subscribeToRoom(roomCode, setGameState)
    const unsubscribeProgress = subscribeToWordProgress(roomCode, (row) => {
      setProgressRows(prev => [...prev.filter(p => p.student_id !== row.student_id), row])
    })

    return () => {
      unsubscribeRoom?.()
      unsubscribeProgress?.()
      clearTimeout(advanceTimeoutRef.current)
    }
  }, [roomCode])

  const { activityState = {} } = gameState || {}
  const { themeTitle, themeEmoji, timeLimitSecs, words = [], startedAt, status = 'lobby' } = activityState

  // Kick off this student's own run the first time the round goes active.
  useEffect(() => {
    if (status === 'active' && !initializedRef.current && myPlayer && words.length > 0) {
      initializedRef.current = true
      upsertWordProgress(roomCode, myPlayer.id, myPlayer.name, {
        pointsRemaining: WORD_BUILDER_STARTING_POINTS,
        wordsCompleted: 0,
        finished: false,
      })
    }
  }, [status, myPlayer, words, roomCode])

  if (!gameState || !myPlayer) {
    return <div className={styles.root}>Loading...</div>
  }

  const startMs = startedAt ? new Date(startedAt).getTime() : now
  const elapsedMs = now - startMs
  const totalMs = (timeLimitSecs || 300) * 1000
  const remainingSecs = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000))
  const minutes = Math.floor(remainingSecs / 60)
  const seconds = remainingSecs % 60

  // ── LOBBY: waiting for the teacher to begin ─────────────────
  if (status === 'lobby') {
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

  // ── FINISHED: whole-room results ────────────────────────────
  if (status === 'finished') {
    const leaderboard = buildWordBuilderLeaderboard(gameState.players || [], progressRows)
    const myRank = leaderboard.findIndex(e => e.id === myPlayer.id)
    const myEntry = myRank >= 0 ? leaderboard[myRank] : null

    return (
      <div className={`${styles.root} ${styles.rootNoScroll}`}>
        <div className={styles.orb1} />
        <div className={styles.pattern} />
        <div className={styles.container}>
          <div className={styles.resultsPhase}>
            <img src="/nerdTurtle.png" alt="Pacey" className={styles.turtleImage} />
            <h2 className={styles.resultsMessage}>Nice work, {myPlayer.name}!</h2>
            <div className={styles.statsBox}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Your Rank</span>
                <span className={styles.statValue}>{myRank >= 0 ? `#${myRank + 1} of ${leaderboard.length}` : '—'}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Words Built</span>
                <span className={styles.statValue}>{myEntry ? myEntry.wordsCompleted : wordsCompleted}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Points Left</span>
                <span className={styles.statValue}>{myEntry ? myEntry.pointsRemaining : pointsRemaining}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── ACTIVE, but this student is done early ──────────────────
  if (finished) {
    return (
      <div className={styles.root}>
        <div className={styles.orb1} />
        <div className={styles.pattern} />
        <div className={styles.waitingCard}>
          <h2 className={styles.waitingTitle}>
            {finishReason === 'points' ? "You're out of points!" : 'You built every word!'}
          </h2>
          <p className={styles.waitingText}>
            You made {wordsCompleted} word{wordsCompleted !== 1 ? 's' : ''} — waiting for time to run out for
            the rest of the class…
          </p>
        </div>
      </div>
    )
  }

  // ── ACTIVE: build the current word ──────────────────────────
  const currentWord = words[currentWordIndex]
  if (!currentWord) {
    return <div className={styles.root}>Loading word...</div>
  }

  const wordLetters = currentWord.word.toUpperCase().split('')
  const isSolved = currentWord.word.split('').every(l => guessedLetters.includes(l))
  const locked = solving || pointsRemaining <= 0

  function syncProgress(nextPoints, nextWordsCompleted, nextFinished) {
    upsertWordProgress(roomCode, myPlayer.id, myPlayer.name, {
      pointsRemaining: nextPoints,
      wordsCompleted: nextWordsCompleted,
      finished: nextFinished,
    })
  }

  function handleGuess(letterUpper) {
    if (locked || isSolved) return
    const letter = letterUpper.toLowerCase()
    if (guessedLetters.includes(letter)) return

    const nextGuessed = [...guessedLetters, letter]
    const correct = currentWord.word.includes(letter)
    setGuessedLetters(nextGuessed)

    if (!correct) {
      const nextPoints = Math.max(0, pointsRemaining - 1)
      setPointsRemaining(nextPoints)
      if (nextPoints <= 0) {
        setFinished(true)
        setFinishReason('points')
        syncProgress(nextPoints, wordsCompleted, true)
      } else {
        syncProgress(nextPoints, wordsCompleted, false)
      }
      return
    }

    // Correct guess — check whether that completed the word.
    const solvedNow = currentWord.word.split('').every(l => nextGuessed.includes(l))
    if (solvedNow) {
      const nextCompleted = wordsCompleted + 1
      setWordsCompleted(nextCompleted)
      setSolving(true)
      syncProgress(pointsRemaining, nextCompleted, false)

      advanceTimeoutRef.current = setTimeout(() => {
        const nextIndex = currentWordIndex + 1
        if (nextIndex >= words.length) {
          setFinished(true)
          setFinishReason('words')
          syncProgress(pointsRemaining, nextCompleted, true)
        } else {
          setCurrentWordIndex(nextIndex)
          setGuessedLetters([])
          setSolving(false)
        }
      }, 1100)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.pattern} />

      <div className={styles.timerFixed}>
        <div className={styles.timerLabel}>Time Left</div>
        <div className={`${styles.timer} ${remainingSecs <= 30 ? styles.warning : ''}`}>
          {minutes}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.statusRow}>
          <span className={styles.statusChip}>Word {currentWordIndex + 1} of {words.length}</span>
          <span className={styles.statusChip}>{pointsRemaining}/{WORD_BUILDER_STARTING_POINTS} pts</span>
          <span className={styles.statusChip}>{wordsCompleted} built</span>
        </div>

        <div className={styles.clueCard}>
          <div className={styles.posBadge}>{currentWord.partOfSpeech}</div>
          <p className={styles.clueText}>{currentWord.clue}</p>
        </div>

        <div className={styles.lettersRow}>
          {wordLetters.map((letter, i) => {
            const revealed = guessedLetters.includes(letter.toLowerCase())
            return (
              <div key={i} className={`${styles.letterTile} ${revealed ? styles.letterTileFilled : ''}`}>
                {revealed ? letter : ''}
              </div>
            )
          })}
        </div>

        {solving && (
          <p className={styles.solvedBanner}>Nice! On to the next word…</p>
        )}

        {!solving && (
          <div className={styles.keyboard}>
            {KEYBOARD_ROWS.map((row, i) => (
              <div key={i} className={styles.keyboardRow}>
                {row.map((letter) => {
                  const guessed = guessedLetters.includes(letter.toLowerCase())
                  const correct = guessed && currentWord.word.includes(letter.toLowerCase())
                  const wrong = guessed && !correct
                  let keyClass = styles.key
                  if (correct) keyClass += ` ${styles.keyCorrect}`
                  else if (wrong) keyClass += ` ${styles.keyWrong}`
                  return (
                    <button
                      key={letter}
                      className={keyClass}
                      onClick={() => handleGuess(letter)}
                      disabled={guessed || locked}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
