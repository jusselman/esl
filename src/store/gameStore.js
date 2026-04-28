import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

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
  players: [],
  topicCards: [],
  selectedTopic: null,
}

export function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function getRandomAvatar(takenIds = []) {
  const available = AVATARS.filter(a => !takenIds.includes(a.id))
  if (available.length === 0) return AVATARS[Math.floor(Math.random() * AVATARS.length)]
  return available[Math.floor(Math.random() * available.length)]
}

// ── Read current state from Supabase ─────────────────────────────────────────
export async function getState(roomCode) {
  const { data, error } = await supabase
    .from('rooms')
    .select('state')
    .eq('id', roomCode)
    .maybeSingle()

  if (error || !data) return { ...DEFAULT_STATE, roomCode }
  return data.state
}

// ── Write state to Supabase ───────────────────────────────────────────────────
export async function setState(roomCode, updater) {
  const current = await getState(roomCode)
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater }

  await supabase
    .from('rooms')
    .upsert({ id: roomCode, state: next, updated_at: new Date().toISOString() })

  return next
}

// ── Initialize a fresh room ───────────────────────────────────────────────────
export async function initRoom(roomCode) {
  const fresh = {
    ...DEFAULT_STATE,
    roomCode,
    phase: GAME_PHASES.LOBBY,
  }
  await supabase
    .from('rooms')
    .upsert({ id: roomCode, state: fresh, updated_at: new Date().toISOString() })
  return fresh
}

// ── Add a player ──────────────────────────────────────────────────────────────
export async function addPlayer(roomCode, name) {
  return setState(roomCode, state => {
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

// ── Subscribe to real-time state changes ──────────────────────────────────────
export function subscribeToRoom(roomCode, callback) {
  const channel = supabase
    .channel(`room:${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomCode}`,
      },
      (payload) => {
        if (payload.new?.state) callback(payload.new.state)
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}