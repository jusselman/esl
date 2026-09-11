import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getState, addPlayer, subscribeToRoom, AVATARS, GAME_PHASES, setState } from '../store/gameStore'
import styles from './StudentJoin.module.css'

const PHASES = {
  SETUP: 'setup',
  WAITING: 'waiting',
  TOPICS: 'topics',
}

export default function StudentJoin() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const roomCode = params.get('room') || '????'

  const [phase, setPhase] = useState(PHASES.SETUP)
  const [name, setName] = useState('')
  const [myPlayer, setMyPlayer] = useState(null)
  const [gameState, setGameState] = useState({ players: [], phase: GAME_PHASES.LOBBY })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('=== StudentJoin Debug ===')
    console.log('Room code:', roomCode)
    console.log('URL:', window.location.href)
    console.log('View param:', params.get('view'))
  }, [])

  useEffect(() => {
    if (!roomCode || roomCode === '????') {
      console.error('Invalid room code:', roomCode)
      setError('Invalid room code. Please scan the QR code again.')
      setIsLoading(false)
      return
    }

    console.log('Fetching state for room:', roomCode)
    
    getState(roomCode)
      .then(state => {
        console.log('Game state loaded:', state)
        console.log('Activity:', state.activity)
        setGameState(state)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error fetching game state:', err)
        setError('Failed to connect to room. Please try again.')
        setIsLoading(false)
      })

    const unsubscribe = subscribeToRoom(roomCode, (newState) => {
      console.log('Game state updated:', newState)
      setGameState(newState)
      if (newState.phase === GAME_PHASES.TOPIC_SELECT) {
        setPhase(PHASES.TOPICS)
      }
    })
    return unsubscribe
  }, [roomCode])

  const currentPresenter = gameState.currentPresenter
  const isPresenting = currentPresenter?.playerId === myPlayer?.id
  const someoneElsePresenting = currentPresenter && !isPresenting
  const activity = gameState.activity || null

  console.log('Current activity:', activity)

  async function handleJoin() {
    const trimmed = name.trim()
    if (!trimmed) { setError('Please enter your name.'); return }
    if (trimmed.length < 2) { setError('Name must be at least 2 characters.'); return }
    
    try {
      const current = await getState(roomCode)
      console.log('Current state at join time:', current)
      console.log('Activity at join time:', current.activity)
      
      if (current.players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
        setError('That name is already taken. Try a different one.')
        return
      }
      
      const updated = await addPlayer(roomCode, trimmed)
      const me = updated.players.find(p => p.name.toLowerCase() === trimmed.toLowerCase())
      setMyPlayer(me)
      setError('')

      console.log('Player joined:', me)

      // Check activity type at join time
      const joinActivityType = current.activity
      console.log('Activity type at join:', joinActivityType)
      
      // For reading comprehension, store player info and navigate
      if (joinActivityType === 'reading-comprehension') {
        console.log('Navigating to reading comprehension')
        sessionStorage.setItem(`player_${roomCode}`, JSON.stringify(me))
        navigate(`/reading-comprehension?view=student&room=${roomCode}`)
      } else if (joinActivityType === 'grammar-duel') {
        console.log('Navigating to grammar duel')
        sessionStorage.setItem(`player_${roomCode}`, JSON.stringify(me))
        navigate(`/grammar-duel?view=student&room=${roomCode}`)
      } else {
        // For debate, continue with normal flow
        console.log('Continuing with debate flow')
        setPhase(PHASES.WAITING)
      }
    } catch (err) {
      console.error('Error joining:', err)
      setError('Failed to join. Please try again.')
    }
  }

  const avatar = myPlayer ? AVATARS.find(a => a.id === myPlayer.avatarId) || AVATARS[0] : null

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.root}>
        <div className={styles.setupCard}>
          <p>Loading room...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && phase === PHASES.SETUP) {
    return (
      <div className={styles.root}>
        <div className={styles.orb1} />
        <div className={styles.pattern} />
        <div className={styles.setupCard}>
          <h2 style={{ color: '#ff6b6b' }}>Error</h2>
          <p>{error}</p>
          <button 
            className={styles.joinBtn} 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // For reading comprehension and grammar duel, only show setup screen —
  // each activity has its own dedicated post-join view.
  if (activity === 'reading-comprehension' || activity === 'grammar-duel') {
    return <SetupScreen roomCode={roomCode} name={name} setName={setName} onJoin={handleJoin} error={error} />
  }

  // For debate, use the normal flow
  if (phase === PHASES.SETUP) {
    return <SetupScreen roomCode={roomCode} name={name} setName={setName} onJoin={handleJoin} error={error} />
  }
  if (phase === PHASES.WAITING) {
    return <WaitingScreen avatar={avatar} name={myPlayer?.name} playerCount={gameState.players?.length || 1} />
  }
  if (phase === PHASES.TOPICS) {
    return (
      <TopicsScreen
        avatar={avatar}
        name={myPlayer?.name}
        myPlayer={myPlayer}
        roomCode={roomCode}
        topics={gameState.topicCards || PLACEHOLDER_TOPICS}
        currentPresenter={gameState.currentPresenter}
        avatarMap={Object.fromEntries(AVATARS.map(a => [a.id, a]))}
      />
    )
  }
  return null
}

function SetupScreen({ roomCode, name, setName, onJoin, error }) {
  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.pattern} />

      <div className={styles.setupCard}>
        <img src="/rockNroll.png" alt="Pacey" className={styles.setupMascot} />
        <div className={styles.roomBadge}>Room {roomCode}</div>
        <h1 className={styles.setupTitle}>Join the Activity!</h1>
        <p className={styles.setupSub}>Enter your name to get started</p>
        <div className={styles.inputWrap}>
          <input
            className={styles.nameInput}
            type="text"
            placeholder="Your name..."
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
      <div className={styles.orb1} />
      <div className={styles.pattern} />
      <div className={styles.waitCard}>
        <div
          className={styles.bigAvatar}
          style={{ background: avatar?.color + '33', borderColor: avatar?.color }}
        >
          <span className={styles.bigEmoji}>{avatar?.emoji}</span>
        </div>
        <div className={styles.waitName}>{name}</div>
        <div className={styles.speechBubble}>
          <span>You're in! Waiting for the teacher to start{dots}</span>
          <div className={styles.speechTailUp} />
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
  { id: 1, title: 'Social Media', color: '#6C63FF' },
  { id: 2, title: 'Climate Action', color: '#2EC4A9' },
  { id: 3, title: 'AI & Work', color: '#F5C842' },
  { id: 4, title: 'University Life', color: '#FF6B6B' },
]

function TopicsScreen({ avatar, name, topics, roomCode, myPlayer, currentPresenter, avatarMap }) {
  const [selected, setSelected] = useState(null)
  const [screen, setScreen] = useState('topics')
  const [chosenSide, setChosenSide] = useState(null)
  const [committed, setCommitted] = useState(false)
  const [committedData, setCommittedData] = useState(null)

  const displayTopics = topics.length >= 4 ? topics.slice(0, 4) : PLACEHOLDER_TOPICS
  const selectedTopic = displayTopics.find(t => t.id === selected)

  if (committed && committedData) {
  return (
    <CommittedCard
      side={committedData.side}
      topic={committedData.topic}
      myPlayer={myPlayer}
      currentPresenter={currentPresenter}
      avatarMap={avatarMap}
      avatar={avatar}
      name={name}
    />
  )
}

  if (screen === 'detail' && selectedTopic) {
    return (
      <div className={styles.root}>
        <div className={styles.orb1} />
        <div className={styles.pattern} />
        <div className={styles.detailWrap}>
          <button className={styles.backBtn} onClick={() => setScreen('topics')}>
            Back
          </button>
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
                <span className={styles.sideDot} style={{ background: side.color }} />
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
                setCommittedData({ topic: selectedTopic, side })
                setCommitted(true)
              }}
            >
              I'm ready to argue this
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.pattern} />

      <div className={styles.topicsHeader}>
        <div
          className={styles.smallAvatar}
          style={{ background: avatar?.color + '33', borderColor: avatar?.color }}
        >
          {avatar?.emoji}
        </div>
        <div className={styles.speechBubbleSmall}>
          <span>Pick your topic, {name}!</span>
          <div className={styles.speechTailLeft} />
        </div>
      </div>

      <div className={styles.topicsGrid}>
        {displayTopics.map((topic, i) => (
          <button
            key={topic.id || i}
            className={`${styles.topicTile} ${selected === topic.id ? styles.topicSelected : ''}`}
            style={{ '--topic-color': topic.color }}
            onClick={() => setSelected(selected === topic.id ? null : topic.id)}
          >
            <span className={styles.topicTitle}>{topic.title}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className={styles.confirmRow}>
          <button className={styles.confirmBtn} onClick={() => setScreen('detail')}>
            Choose this topic
          </button>
        </div>
      )}
    </div>
  )
}

function CommittedCard({ side, topic, myPlayer, currentPresenter, avatarMap, avatar, name }) {
  const [acknowledged, setAcknowledged] = useState(false)
  const vibrationRef = React.useRef(null)

  const isPresenting = currentPresenter?.playerId === myPlayer?.id
  const someoneElsePresenting = currentPresenter && !isPresenting

  useEffect(() => {
    if (isPresenting && !acknowledged) {
      console.log('Vibration triggered for:', myPlayer?.name)

      if (navigator.vibrate) navigator.vibrate([500, 300])

      vibrationRef.current = setInterval(() => {
        if (navigator.vibrate) navigator.vibrate([500, 300])
      }, 800)
    } else {
      if (navigator.vibrate) navigator.vibrate(0)
      if (vibrationRef.current) {
        clearInterval(vibrationRef.current)
        vibrationRef.current = null
      }
    }

    return () => {
      if (navigator.vibrate) navigator.vibrate(0)
      if (vibrationRef.current) {
        clearInterval(vibrationRef.current)
        vibrationRef.current = null
      }
    }
  }, [isPresenting, acknowledged])

  function handleGo() {
    if (navigator.vibrate) navigator.vibrate(0)
    if (vibrationRef.current) {
      clearInterval(vibrationRef.current)
      vibrationRef.current = null
    }
    setAcknowledged(true)
  }

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.pattern} />

      {someoneElsePresenting && (
        <div className={styles.nowPresentingBar}>
          <span className={styles.nowPresentingAvatar}>
            {avatarMap[currentPresenter.avatarId]?.emoji}
          </span>
          <span>
            <strong>{currentPresenter.playerName}</strong> is presenting — listen carefully, you may be next!
          </span>
        </div>
      )}

      {isPresenting && !acknowledged && (
        <div className={`${styles.nowPresentingBar} ${styles.nowPresentingYou}`}>
          <strong className={styles.yourTurnText}>It's your turn to present!</strong>
          <button className={styles.goBtn} onClick={handleGo}>
            GO!
          </button>
        </div>
      )}

      {isPresenting && acknowledged && (
        <div className={`${styles.nowPresentingBar} ${styles.nowPresentingAcknowledged}`}>
          <strong>Head to the front and make your case!</strong>
        </div>
      )}

      {!currentPresenter && (
        <div className={styles.nowPresentingBar}>
          Waiting for the teacher to pick the next presenter...
        </div>
      )}

      <div className={styles.cardWrap}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardCategory}>{topic.category}</div>
            <div className={styles.cardTopicTitle}>{topic.title}</div>
          </div>
        </div>

        <div
          className={styles.positionBadge}
          style={{ background: side.color + '22', borderColor: side.color, color: side.color }}
        >
          Your position: {side.label}
        </div>

        <div className={styles.tipsLabel}>Tips for your presentation:</div>
        <ul className={styles.tipsList}>
          <li>Start with a clear statement of your position</li>
          <li>Give at least <strong>two reasons</strong> to support your argument</li>
          <li>Use an example from real life or the news</li>
          <li>End with a strong concluding sentence</li>
          <li>Speak clearly — volume and confidence matter!</li>
        </ul>

        <div className={styles.cardFooter}>
          <div
            className={styles.avatarSmall}
            style={{ background: avatar?.color + '33', borderColor: avatar?.color }}
          >
            {avatar?.emoji}
          </div>
          <span className={styles.cardName}>Good luck, {name}!</span>
        </div>
      </div>
    </div>
  )
}
