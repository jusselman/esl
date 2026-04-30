import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { getState, setState, subscribeToRoom, AVATARS, GAME_PHASES } from '../store/gameStore'
import { getRandomTopics } from '../data/topics'
import styles from './HostLobby.module.css'

export default function HostLobby() {
  const [searchParams] = useSearchParams()
  const roomCode = searchParams.get('room')

  const [gameState, setGameState] = useState({ players: [], phase: GAME_PHASES.LOBBY })
  const [beginPulsing, setBeginPulsing] = useState(false)
  const [currentPresenter, setCurrentPresenter] = useState(null)
  const [presentedIds, setPresentedIds] = useState([])
  const [revealing, setRevealing] = useState(false)

  useEffect(() => {
    if (!roomCode) return
    getState(roomCode).then(setGameState)
    const unsubscribe = subscribeToRoom(roomCode, setGameState)
    return unsubscribe
  }, [roomCode])

  const players = gameState.players || []
  const selections = gameState.studentSelections || {}
  const joinUrl = `${window.location.protocol}//${window.location.host}/?view=student&room=${roomCode}`

  // Students who have made a selection and haven't presented yet
  const readyIds = Object.keys(selections)
  const remainingIds = readyIds.filter(id => !presentedIds.includes(id))
  const allDone = readyIds.length > 0 && remainingIds.length === 0
  const canStartDebating = remainingIds.length > 0

  async function handleBegin() {
    setBeginPulsing(true)
    const topics = getRandomTopics()
    await setState(roomCode, s => ({
      ...s,
      phase: GAME_PHASES.TOPIC_SELECT,
      topicCards: topics,
      studentSelections: {},
    }))
    setCurrentPresenter(null)
    setPresentedIds([])
    setTimeout(() => setBeginPulsing(false), 600)
  }

  async function handleStartDebating() {
    if (remainingIds.length === 0) return
    setRevealing(true)

    // Pick a random student from remaining pool
    const randomId = remainingIds[Math.floor(Math.random() * remainingIds.length)]
    const selection = selections[randomId]

    // Push current presenter to Supabase so student devices update
    await setState(roomCode, s => ({
      ...s,
      currentPresenter: selection,
    }))

    setCurrentPresenter(selection)
    setPresentedIds(prev => [...prev, randomId])

    setTimeout(() => setRevealing(false), 800)
  }

  function handleNextPresenter() {
    setCurrentPresenter(null)
    setState(roomCode, s => ({ ...s, currentPresenter: null }))
  }

  const avatarMap = Object.fromEntries(AVATARS.map(a => [a.id, a]))

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoAccent}>LINGUA</span>DEBATE
        </div>
        <div className={styles.activityTag}>Debate Arena</div>
      </header>

      {/* Presenter Reveal */}
      {currentPresenter && (
        <div className={`${styles.presenterBanner} ${revealing ? styles.presenterRevealing : ''}`}>
          <div className={styles.presenterInner}>
            <div className={styles.presenterLabel}>🎤 Now Presenting</div>
            <div className={styles.presenterName}>
              {avatarMap[currentPresenter.avatarId]?.emoji} {currentPresenter.playerName}
            </div>
            <div className={styles.presenterTopic}>
              {currentPresenter.topicEmoji} {currentPresenter.topicTitle}
            </div>
            <div
              className={styles.presenterSide}
              style={{ color: currentPresenter.sideColor }}
            >
              "{currentPresenter.sideLabel}"
            </div>
            <div className={styles.presenterStats}>
              {presentedIds.length} of {readyIds.length} presented
              · {remainingIds.length} remaining
            </div>
          </div>
        </div>
      )}

      {/* All done banner */}
      {allDone && !currentPresenter && (
        <div className={styles.allDoneBanner}>
          🎉 All students have presented! Great work everyone.
        </div>
      )}

      <div className={styles.body}>

        {/* Left: QR + instructions */}
        <div className={styles.joinPanel}>
          <div className={styles.qrWrap}>
            <QRCodeSVG
              value={joinUrl}
              size={200}
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
            <li>Scan the QR code with your phone</li>
            <li>Enter your name & tap Join</li>
            <li>Choose a topic and pick your side</li>
          </ol>

          {/* Selection progress */}
          {players.length > 0 && gameState.phase === GAME_PHASES.TOPIC_SELECT && (
            <div className={styles.progressBlock}>
              <div className={styles.progressLabel}>
                {readyIds.length} of {players.length} students ready
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${players.length > 0 ? (readyIds.length / players.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Player tiles */}
        <div className={styles.playersPanel}>
          <div className={styles.playersPanelHeader}>
            <span className={styles.playerCount}>
              {players.length} {players.length === 1 ? 'student' : 'students'} joined
            </span>
            <div className={`${styles.liveIndicator} ${players.length > 0 ? styles.livePulse : ''}`}>
              <span className={styles.liveDot} />
              LIVE
            </div>
          </div>

          <div className={styles.tilesGrid}>
            {players.map((player, i) => {
              const avatar = avatarMap[player.avatarId] || AVATARS[0]
              const hasSelected = !!selections[player.id]
              const isPresenting = currentPresenter?.playerId === player.id
              const hasPresented = presentedIds.includes(player.id)

              return (
                <div
                  key={player.id}
                  className={`${styles.playerTile} ${hasSelected ? styles.playerReady : ''} ${isPresenting ? styles.playerPresenting : ''} ${hasPresented ? styles.playerDone : ''}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div
                    className={styles.avatarCircle}
                    style={{ background: avatar.color + '33', borderColor: avatar.color + '66' }}
                  >
                    <span className={styles.avatarEmoji}>{avatar.emoji}</span>
                  </div>
                  <span className={styles.playerName}>{player.name}</span>
                  <span className={styles.playerStatus}>
                    {isPresenting ? '🎤' : hasPresented ? '✅' : hasSelected ? '👍' : '⏳'}
                  </span>
                </div>
              )
            })}

            {players.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>👋</div>
                <p>Waiting for students to join…</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className={styles.beginRow}>
        <button
          className={`${styles.beginBtn} ${players.length > 0 ? styles.beginActive : ''} ${beginPulsing ? styles.beginPulse : ''}`}
          onClick={handleBegin}
          disabled={players.length === 0}
        >
          {gameState.phase === GAME_PHASES.TOPIC_SELECT ? 'Restart' : 'Begin Activity'}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4l8 6-8 6V4z" fill="currentColor"/>
          </svg>
        </button>

        {gameState.phase === GAME_PHASES.TOPIC_SELECT && !currentPresenter && (
          <button
            className={`${styles.debateBtn} ${canStartDebating ? styles.debateBtnActive : ''}`}
            onClick={handleStartDebating}
            disabled={!canStartDebating}
          >
            {allDone ? '🎉 All Done!' : '🎲 Pick a Presenter'}
          </button>
        )}

        {currentPresenter && (
          <button className={`${styles.debateBtn} ${styles.debateBtnActive}`} onClick={handleNextPresenter}>
            ⏭ Next Presenter
          </button>
        )}

        <p className={styles.beginHint}>
          {gameState.phase !== GAME_PHASES.TOPIC_SELECT
            ? players.length === 0
              ? 'Waiting for at least one student to join'
              : `${players.length} student${players.length > 1 ? 's' : ''} ready — press Begin when everyone is in`
            : allDone
            ? 'All students have presented!'
            : canStartDebating
            ? `${remainingIds.length} student${remainingIds.length > 1 ? 's' : ''} yet to present`
            : `Waiting for students to choose a topic and side…`
          }
        </p>
      </div>
    </div>
  )
}