import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getState, addPlayer, subscribeToRoom, AVATARS, GAME_PHASES, setState } from '../store/gameStore'
import styles from './StudentJoin.module.css'

const PHASES = {
  SETUP: 'setup',
  WAITING: 'waiting',
  TOPICS: 'topics',
}

export default function StudentJoin() {
  const [params] = useSearchParams()
  const roomCode = params.get('room') || '????'

  const [phase, setPhase] = useState(PHASES.SETUP)
  const [name, setName] = useState('')
  const [myPlayer, setMyPlayer] = useState(null)
  const [gameState, setGameState] = useState({ players: [], phase: GAME_PHASES.LOBBY })
  const [error, setError] = useState('')

  // Subscribe to real-time room updates
  useEffect(() => {
  if (!roomCode || roomCode === '????') return

  getState(roomCode).then(setGameState)

  const unsubscribe = subscribeToRoom(roomCode, (newState) => {
    setGameState(newState)
    if (newState.phase === GAME_PHASES.TOPIC_SELECT) {
      setPhase(PHASES.TOPICS)
    }
  })
  return unsubscribe
}, [roomCode])

// Detect when this student is selected as presenter
const currentPresenter = gameState.currentPresenter
const isPresenting = currentPresenter?.playerId === myPlayer?.id
const someoneElsePresenting = currentPresenter && !isPresenting

  async function handleJoin() {
    const trimmed = name.trim()
    if (!trimmed) { setError('Please enter your name.'); return }
    if (trimmed.length < 2) { setError('Name must be at least 2 characters.'); return }

    const current = await getState(roomCode)
    if (current.players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('That name is already taken. Try a different one.')
      return
    }

    const updated = await addPlayer(roomCode, trimmed)
    const me = updated.players.find(p => p.name.toLowerCase() === trimmed.toLowerCase())
    setMyPlayer(me)
    setPhase(PHASES.WAITING)
    setError('')
  }

  const avatar = myPlayer ? AVATARS.find(a => a.id === myPlayer.avatarId) || AVATARS[0] : null

  if (phase === PHASES.SETUP) {
    return <SetupScreen roomCode={roomCode} name={name} setName={setName} onJoin={handleJoin} error={error} />
  }
  if (phase === PHASES.WAITING) {
    return <WaitingScreen avatar={avatar} name={myPlayer?.name} playerCount={gameState.players?.length || 1} />
  }
  if (phase === PHASES.TOPICS && currentPresenter) {
  if (isPresenting) {
    return <YoureUpScreen presenter={currentPresenter} avatar={avatar} />
  }
  if (someoneElsePresenting) {
    return <WatchingScreen presenter={currentPresenter} avatarMap={Object.fromEntries(AVATARS.map(a => [a.id, a]))} />
  }
}
  if (phase === PHASES.TOPICS) {
  return (
    <TopicsScreen
      avatar={avatar}
      name={myPlayer?.name}
      myPlayer={myPlayer}
      roomCode={roomCode}
      topics={gameState.topicCards || PLACEHOLDER_TOPICS}
    />
  )
}

  return null
}

function SetupScreen({ roomCode, name, setName, onJoin, error }) {
  return (
    <div className={styles.root}>
      <div className={styles.setupCard}>
        <div className={styles.roomBadge}>Room {roomCode}</div>
        <h1 className={styles.setupTitle}>Join the debate</h1>
        <p className={styles.setupSub}>Enter your name to get started</p>
        <div className={styles.inputWrap}>
          <input
            className={styles.nameInput}
            type="text"
            placeholder="Your name…"
            value={name}
            maxLength={20}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onJoin()}
            autoFocus
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.joinBtn} onClick={onJoin}>
          Join Session
        </button>
      </div>
    </div>
  )
}

function WaitingScreen({ avatar, name, playerCount }) {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length < 3 ? d + '.' : '.'), 600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.waitCard}>
        <div
          className={styles.bigAvatar}
          style={{ background: avatar?.color + '22', borderColor: avatar?.color + '55' }}
        >
          <span className={styles.bigEmoji}>{avatar?.emoji}</span>
        </div>
        <div className={styles.waitName}>{name}</div>
        <div className={styles.waitMsg}>
          You're in!<br/>Waiting for the teacher to start{dots}
        </div>
        <div className={styles.playerCountPill}>
          <span className={styles.countDot} />
          {playerCount} {playerCount === 1 ? 'student' : 'students'} joined
        </div>
      </div>
    </div>
  )
}

const PLACEHOLDER_TOPICS = [
  { id: 1, title: 'Social Media', emoji: '📱', color: '#6C63FF' },
  { id: 2, title: 'Climate Action', emoji: '🌍', color: '#2EC4A9' },
  { id: 3, title: 'AI & Work', emoji: '🤖', color: '#F5C842' },
  { id: 4, title: 'University Life', emoji: '🎓', color: '#FF6B6B' },
]

function TopicsScreen({ avatar, name, topics, roomCode, myPlayer }) {
  const [selected, setSelected] = useState(null)
  const [screen, setScreen] = useState('topics') // 'topics' | 'detail' | 'card'
  const [chosenSide, setChosenSide] = useState(null)

  const displayTopics = topics.length >= 4 ? topics.slice(0, 4) : PLACEHOLDER_TOPICS
  const selectedTopic = displayTopics.find(t => t.id === selected)

  if (screen === 'detail' && selectedTopic) {
    return (
      <div className={styles.root}>
        <div className={styles.detailWrap}>

          {/* <button className={styles.backBtn} onClick={() => setScreen('topics')}>
            ← Back
          </button> */}

          <div className={styles.detailEmoji}>{selectedTopic.emoji}</div>
          <h2 className={styles.detailTitle}>{selectedTopic.title}</h2>
          <p className={styles.detailIssue}>{selectedTopic.issue}</p>

          <div className={styles.sidesLabel}>Choose your side:</div>

          <div className={styles.sidesWrap}>
            {selectedTopic.sides.map((side, i) => (
              <button
                key={i}
                className={`${styles.sideBtn} ${chosenSide === i ? styles.sideBtnSelected : ''}`}
                style={{ '--side-color': side.color }}
                onClick={() => setChosenSide(i)}
              >
                <span className={styles.sideIcon}>{i === 0 ? '🔴' : '🟢'}</span>
                <span className={styles.sideLabel}>{side.label}</span>
              </button>
            ))}
          </div>

          {chosenSide !== null && (
            <button
              className={styles.confirmBtn}
              onClick={async () => {
              const side = selectedTopic.sides[chosenSide]
              await setState(roomCode, s => ({
                ...s,
                studentSelections: {
                  ...(s.studentSelections || {}),
                  [myPlayer.id]: {
                    playerId: myPlayer.id,
                    playerName: myPlayer.name,
                    avatarId: myPlayer.avatarId,
                    topicId: selectedTopic.id,
                    topicTitle: selectedTopic.title,
                    topicEmoji: selectedTopic.emoji,
                    sideLabel: side.label,
                    sideColor: side.color,
                  }
                }
              }))
              setScreen('card')
            }}
            >
              I'm ready to argue this →
            </button>
          )}
        </div>
      </div>
    )
  }

  if (screen === 'card' && selectedTopic && chosenSide !== null) {
    const side = selectedTopic.sides[chosenSide]
    return (
      <div className={styles.root}>
        <div className={styles.cardWrap}>
          <div className={styles.cardHeader}>
            <span className={styles.cardEmoji}>{selectedTopic.emoji}</span>
            <div>
              <div className={styles.cardCategory}>{selectedTopic.category}</div>
              <div className={styles.cardTopicTitle}>{selectedTopic.title}</div>
            </div>
          </div>

          <div
            className={styles.positionBadge}
            style={{ background: side.color + '22', borderColor: side.color + '55', color: side.color }}
          >
            Your position: {side.label}
          </div>

          <div className={styles.tipsLabel}>💡 Tips for your presentation:</div>
          <ul className={styles.tipsList}>
            <li>Start with a clear statement of your position</li>
            <li>Give at least <strong>two reasons</strong> to support your argument</li>
            <li>Use an example from real life or the news</li>
            <li>End with a strong concluding sentence</li>
            <li>Speak clearly — volume and confidence matter!</li>
          </ul>

          <div className={styles.cardFooter}>
            <div className={styles.avatarSmall} style={{ background: avatar?.color + '22', borderColor: avatar?.color + '55' }}>
              {avatar?.emoji}
            </div>
            <span className={styles.cardName}>Good luck, {name}! 🎤</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.topicsHeader}>
        <div
          className={styles.smallAvatar}
          style={{ background: avatar?.color + '22', borderColor: avatar?.color + '55' }}
        >
          {avatar?.emoji}
        </div>
        <span className={styles.topicsWelcome}>Pick your topic, {name}</span>
      </div>

      <div className={styles.topicsGrid}>
        {displayTopics.map((topic, i) => (
          <button
            key={topic.id || i}
            className={`${styles.topicTile} ${selected === topic.id ? styles.topicSelected : ''}`}
            style={{ '--topic-color': topic.color }}
            onClick={() => setSelected(selected === topic.id ? null : topic.id)}
          >
            <span className={styles.topicEmoji}>{topic.emoji}</span>
            <span className={styles.topicTitle}>{topic.title}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className={styles.confirmRow}>
          <button
            className={styles.confirmBtn}
            onClick={() => setScreen('detail')}
          >
            Choose this topic
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

function YoureUpScreen({ presenter, avatar }) {
  return (
    <div className={styles.root}>
      <div className={styles.youreUpWrap}>
        <div className={styles.youreUpPulse} />
        <div className={styles.youreUpEmoji}>🎤</div>
        <h1 className={styles.youreUpTitle}>YOU'RE UP!</h1>
        <p className={styles.youreUpSub}>Time to make your case</p>

        <div className={styles.youreUpCard}>
          <div className={styles.youreUpTopic}>
            {presenter.topicEmoji} {presenter.topicTitle}
          </div>
          <div
            className={styles.youreUpSide}
            style={{ color: presenter.sideColor, borderColor: presenter.sideColor + '55', background: presenter.sideColor + '15' }}
          >
            "{presenter.sideLabel}"
          </div>
        </div>

        <p className={styles.youreUpHint}>
          Head to the front of the class and present your argument!
        </p>
      </div>
    </div>
  )
}

function WatchingScreen({ presenter, avatarMap }) {
  const avatar = avatarMap[presenter.avatarId] || AVATARS[0]
  return (
    <div className={styles.root}>
      <div className={styles.watchingWrap}>
        <div className={styles.watchingAvatar}
          style={{ background: avatar.color + '22', borderColor: avatar.color + '55' }}
        >
          {avatar.emoji}
        </div>
        <h2 className={styles.watchingTitle}>{presenter.playerName} is presenting</h2>
        <div className={styles.watchingTopic}>
          {presenter.topicEmoji} {presenter.topicTitle}
        </div>
        <p className={styles.watchingHint}>
          Listen carefully — you may be next!
        </p>
      </div>
    </div>
  )
}