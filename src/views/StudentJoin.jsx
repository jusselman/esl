import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getState, addPlayer, subscribeToRoom, AVATARS, GAME_PHASES } from '../store/gameStore'
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
  if (phase === PHASES.TOPICS) {
    return <TopicsScreen avatar={avatar} name={myPlayer?.name} topics={gameState.topicCards || PLACEHOLDER_TOPICS} />
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

function TopicsScreen({ avatar, name, topics }) {
  const [selected, setSelected] = useState(null)
  const displayTopics = topics.length >= 4 ? topics.slice(0, 4) : PLACEHOLDER_TOPICS

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
          <button className={styles.confirmBtn}>
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