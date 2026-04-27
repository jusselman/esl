// Simple shared state via localStorage + BroadcastChannel
// This works when host and student are on same device/browser (demo mode)
// Replace with Supabase/Partykit/Ably for real network multi-device use

const STORAGE_KEY = 'linguadebate_state'
const CHANNEL_NAME = 'linguadebate_sync'

export const GAME_PHASES = {
  LOBBY: 'lobby',
  WAITING: 'waiting',
  TOPIC_SELECT: 'topic_select',
  DEBATE_PREP: 'debate_prep',
}

export const AVATARS = [
  { id: 'fox',     emoji: '🦊', color: '#E8651A' },
  { id: 'owl',     emoji: '🦉', color: '#7C5CBF' },
  { id: 'penguin', emoji: '🐧', color: '#2E86AB' },
  { id: 'cat',     emoji: '🐱', color: '#F4A261' },
  { id: 'bear',    emoji: '🐻', color: '#8B5E3C' },
  { id: 'rabbit',  emoji: '🐰', color: '#E9C46A' },
  { id: 'frog',    emoji: '🐸', color: '#2A9D8F' },
  { id: 'lion',    emoji: '🦁', color: '#E76F51' },
  { id: 'dolphin', emoji: '🐬', color: '#457B9D' },
  { id: 'panda',   emoji: '🐼', color: '#606060' },
  { id: 'parrot',  emoji: '🦜', color: '#52B788' },
  { id: 'wolf',    emoji: '🐺', color: '#9B9B9B' },
]

const DEFAULT_STATE = {
  phase: GAME_PHASES.LOBBY,
  roomCode: null,
  players: [],         // { id, name, avatarId, joinedAt }
  topicCards: [],      // populated by AI when game starts
  selectedTopic: null,
}

export function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { ...DEFAULT_STATE }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function setState(updater) {
  const current = getState()
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  // Broadcast to other tabs
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channel.postMessage({ type: 'STATE_UPDATE', state: next })
    channel.close()
  } catch { /* BroadcastChannel not available */ }
  return next
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY)
}

export function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function getRandomAvatar(takenIds = []) {
  const available = AVATARS.filter(a => !takenIds.includes(a.id))
  if (available.length === 0) return AVATARS[Math.floor(Math.random() * AVATARS.length)]
  return available[Math.floor(Math.random() * available.length)]
}

export function addPlayer(name) {
  return setState(state => {
    const takenIds = state.players.map(p => p.avatarId)
    const avatar = getRandomAvatar(takenIds)
    const player = {
      id: `player_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      avatarId: avatar.id,
      joinedAt: Date.now(),
    }
    return { ...state, players: [...state.players, player] }
  })
}

export function useSyncedState(callback) {
  // Returns a cleanup function; call this in useEffect
  const handler = (e) => {
    if (e.key === STORAGE_KEY) callback(getState())
  }
  window.addEventListener('storage', handler)

  let channel
  try {
    channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = (e) => {
      if (e.data?.type === 'STATE_UPDATE') callback(e.data.state)
    }
  } catch { /* not available */ }

  return () => {
    window.removeEventListener('storage', handler)
    channel?.close()
  }
}
