import React, { useState, useEffect, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getState, setState, useSyncedState, AVATARS, GAME_PHASES } from '../store/gameStore'
import styles from './HostLobby.module.css'

export default function HostLobby() {
  const [gameState, setGameState] = useState(getState)
  const [beginPulsing, setBeginPulsing] = useState(false)

  // Listen for student joins from other tabs
  useEffect(() => {
    const cleanup = useSyncedState((newState) => {
      setGameState(newState)
    })
    return cleanup
  }, [])

  // Also poll localStorage in case BroadcastChannel isn't available
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(getState())
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const roomCode = gameState.roomCode || '----'
  const players = gameState.players || []

  // Build the student join URL
  const joinUrl = `${window.location.origin}${window.location.pathname}?view=student&room=${roomCode}`

  function handleBegin() {
    setBeginPulsing(true)
    setState({ phase: GAME_PHASES.TOPIC_SELECT })
    setTimeout(() => setBeginPulsing(false), 600)
  }

  const avatarMap = Object.fromEntries(AVATARS.map(a => [a.id, a]))

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoAccent}>LINGUA</span>DEBATE
        </div>
        <div className={styles.activityTag}>Debate Arena</div>
      </header>

      {/* Main content */}
      <div className={styles.body}>

        {/* Left: QR + instructions */}
        <div className={styles.joinPanel}>
          <div className={styles.qrWrap}>
            <QRCodeSVG
              value={joinUrl}
              size={200}
              bgColor="transparent"
              fgColor="#F0EFF8"
              level="M"
            />
          </div>

          <div className={styles.codeBlock}>
            <div className={styles.codeLabel}>Room Code</div>
            <div className={styles.codeDigits}>
              {roomCode.split('').map((d, i) => (
                <span key={i} className={styles.digit}>{d}</span>
              ))}
            </div>
          </div>

          <ol className={styles.instructions}>
            <li>Scan the QR code with your phone</li>
            <li>Enter your name & tap Join</li>
            <li>Wait for the teacher to start</li>
          </ol>
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
              return (
                <div
                  key={player.id}
                  className={styles.playerTile}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div
                    className={styles.avatarCircle}
                    style={{ background: avatar.color + '33', borderColor: avatar.color + '66' }}
                  >
                    <span className={styles.avatarEmoji}>{avatar.emoji}</span>
                  </div>
                  <span className={styles.playerName}>{player.name}</span>
                </div>
              )
            })}

            {/* Empty placeholder slots */}
            {players.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>👋</div>
                <p>Waiting for students to join…</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Begin button */}
      <div className={styles.beginRow}>
        <button
          className={`${styles.beginBtn} ${players.length > 0 ? styles.beginActive : ''} ${beginPulsing ? styles.beginPulse : ''}`}
          onClick={handleBegin}
          disabled={players.length === 0}
        >
          Begin Activity
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4l8 6-8 6V4z" fill="currentColor"/>
          </svg>
        </button>
        <p className={styles.beginHint}>
          {players.length === 0 ? 'Waiting for at least one student to join' : `${players.length} student${players.length > 1 ? 's' : ''} ready — press Begin when everyone is in`}
        </p>
      </div>
    </div>
  )
}
