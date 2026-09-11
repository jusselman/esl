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
  activity: null,
  activityState: {},
}

export function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function getRandomAvatar(takenIds = []) {
  const available = AVATARS.filter(a => !takenIds.includes(a.id))
  if (available.length === 0) return AVATARS[Math.floor(Math.random() * AVATARS.length)]
  return available[Math.floor(Math.random() * available.length)]
}

export async function getState(roomCode) {
  const { data, error } = await supabase
    .from('rooms')
    .select('state')
    .eq('id', roomCode)
    .maybeSingle()

  if (error || !data) return { ...DEFAULT_STATE, roomCode }
  return data.state
}

export async function setState(roomCode, updater) {
  const current = await getState(roomCode)
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater }

  await supabase
    .from('rooms')
    .upsert({ id: roomCode, state: next, updated_at: new Date().toISOString() })

  return next
}

export async function initRoom(roomCode, activityData = {}) {
  const fresh = {
    ...DEFAULT_STATE,
    roomCode,
    phase: GAME_PHASES.LOBBY,
    activity: activityData.activity || null,
    // Most activities share the topic/timeLimit/startedAt shape below, but an
    // activity can instead hand in a fully-formed activityState of its own
    // (Grammar Duel's rounds/questions/currentQuestionIndex shape, etc.).
    activityState: activityData.activityState || {
      topic: activityData.topic || null,
      timeLimit: activityData.timeLimit || null,
      // Timer does not start until the host explicitly begins the activity
      // (see startActivity below) — do not set this on room creation.
      startedAt: null,
    },
  }
  await supabase
    .from('rooms')
    .upsert({ id: roomCode, state: fresh, updated_at: new Date().toISOString() })
  return fresh
}

export async function startActivity(roomCode) {
  return setState(roomCode, state => ({
    ...state,
    activityState: {
      ...state.activityState,
      startedAt: new Date().toISOString(),
    },
  }))
}

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

export async function submitReadingResponse(roomCode, studentId, studentName, responseText, timeSpentSeconds) {
  const { data, error } = await supabase
    .from('reading_responses')
    .insert({
      room_id: roomCode,
      student_id: studentId,
      student_name: studentName,
      response_text: responseText,
      time_spent_seconds: timeSpentSeconds,
      word_count: responseText.trim().split(/\s+/).length,
      submitted_at: new Date().toISOString(),
    })
    .select()

  if (error) console.error('Error submitting response:', error)
  return data?.[0] || null
}

export async function submitGrading(roomCode, studentId, rubricScores, feedback = {}) {
  const totalScore = Object.values(rubricScores).reduce((sum, score) => sum + (parseInt(score) || 0), 0)

  const { data, error } = await supabase
    .from('gradings')
    .upsert({
      room_id: roomCode,
      student_id: studentId,
      rubric_scores: rubricScores,
      feedback,
      total_score: totalScore,
      graded_at: new Date().toISOString(),
    })
    .select()

  if (error) console.error('Error submitting grading:', error)
  return data?.[0] || null
}

export async function getGrading(roomCode, studentId) {
  const { data, error } = await supabase
    .from('gradings')
    .select('*')
    .eq('room_id', roomCode)
    .eq('student_id', studentId)
    .maybeSingle()

  if (error) console.error('Error fetching grading:', error)
  return data || null
}

export async function getGradingsForRoom(roomCode) {
  const { data, error } = await supabase
    .from('gradings')
    .select('*')
    .eq('room_id', roomCode)
    .order('graded_at', { ascending: true })

  if (error) console.error('Error fetching gradings:', error)
  return data || []
}

export async function getResponsesForRoom(roomCode) {
  const { data, error } = await supabase
    .from('reading_responses')
    .select('*')
    .eq('room_id', roomCode)
    .order('submitted_at', { ascending: true })

  if (error) console.error('Error fetching responses:', error)
  return data || []
}

export function subscribeToReadingResponses(roomCode, callback) {
  const channel = supabase
    .channel(`reading:${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'reading_responses',
        filter: `room_id=eq.${roomCode}`,
      },
      (payload) => {
        if (payload.new) callback(payload.new)
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

// ─────────────────────────────────────────────────────────────────
// Grammar Duel
// ─────────────────────────────────────────────────────────────────

// Kahoot-style scoring: correct answers earn more points the faster they're
// submitted (half credit just for being right, up to full credit for an
// instant answer). Wrong answers always score 0.
export function computeGrammarPoints(correct, timeTakenMs, secondsPerQuestion) {
  if (!correct) return 0
  const totalMs = Math.max(1, secondsPerQuestion * 1000)
  const speedFraction = Math.max(0, Math.min(1, (totalMs - timeTakenMs) / totalMs))
  return Math.round(500 + 500 * speedFraction)
}

// Called once, when the host clicks "Begin Activity" in the waiting room —
// kicks off question 0.
export async function startGrammarDuel(roomCode) {
  return setState(roomCode, state => ({
    ...state,
    activityState: {
      ...state.activityState,
      currentQuestionIndex: 0,
      questionStartedAt: new Date().toISOString(),
      status: 'active',
    },
  }))
}

// Called when the host clicks "Next Question" after a question's reveal.
// Moves to the next question, or marks the duel finished after the last one.
export async function advanceGrammarQuestion(roomCode) {
  return setState(roomCode, state => {
    const { activityState } = state
    const nextIndex = activityState.currentQuestionIndex + 1
    if (nextIndex >= (activityState.questions?.length || 0)) {
      return { ...state, activityState: { ...activityState, status: 'finished' } }
    }
    return {
      ...state,
      activityState: {
        ...activityState,
        currentQuestionIndex: nextIndex,
        questionStartedAt: new Date().toISOString(),
      },
    }
  })
}

export async function submitGrammarAnswer(roomCode, studentId, studentName, questionIndex, questionId, choiceIndex, correct, timeTakenMs, points) {
  const { data, error } = await supabase
    .from('grammar_answers')
    .insert({
      room_id: roomCode,
      student_id: studentId,
      student_name: studentName,
      question_index: questionIndex,
      question_id: questionId,
      choice_index: choiceIndex,
      correct,
      time_taken_ms: timeTakenMs,
      points,
      answered_at: new Date().toISOString(),
    })
    .select()

  if (error) console.error('Error submitting grammar answer:', error)
  return data?.[0] || null
}

export async function getAnswersForRoom(roomCode) {
  const { data, error } = await supabase
    .from('grammar_answers')
    .select('*')
    .eq('room_id', roomCode)
    .order('answered_at', { ascending: true })

  if (error) console.error('Error fetching grammar answers:', error)
  return data || []
}

export function subscribeToGrammarAnswers(roomCode, callback) {
  const channel = supabase
    .channel(`grammar:${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'grammar_answers',
        filter: `room_id=eq.${roomCode}`,
      },
      (payload) => {
        if (payload.new) callback(payload.new)
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

// Shared by the host (full leaderboard + mini leaderboard) and each student
// (their own rank) so both compute scores the same way.
export function buildGrammarLeaderboard(players, answers) {
  const byId = new Map()
  players.forEach(p => byId.set(p.id, { id: p.id, name: p.name, avatarId: p.avatarId, points: 0, correct: 0, answered: 0 }))
  answers.forEach(a => {
    if (!byId.has(a.student_id)) {
      byId.set(a.student_id, { id: a.student_id, name: a.student_name, avatarId: null, points: 0, correct: 0, answered: 0 })
    }
    const entry = byId.get(a.student_id)
    entry.points += a.points || 0
    entry.answered += 1
    if (a.correct) entry.correct += 1
  })
  return [...byId.values()].sort((a, b) => b.points - a.points)
}
