import React from 'react'
import { useNavigate } from 'react-router-dom'
import { initRoom, generateRoomCode } from '../store/gameStore'
import styles from './ActivityMenu.module.css'

const ACTIVITIES = [
  {
    id: 'debate',
    label: 'Debate Arena',
    description: 'Students choose a controversial topic, pick a side, and present their argument to the class.',
    icon: '★',
    status: 'ready',
    skills: ['Speaking', 'Critical Thinking', 'Persuasion'],
    path: '/host/debate',
    color: '#5ec9b7',
  },
  {
    id: 'vocab',
    label: 'Word Builder',
    description: 'Collaborative vocabulary exercises with contextual examples and peer challenge rounds.',
    icon: 'A',
    status: 'coming-soon',
    skills: ['Vocabulary', 'Reading', 'Writing'],
    path: null,
    color: '#f6db96',
  },
  {
    id: 'listen',
    label: 'Story Circle',
    description: 'Students listen to an AI-narrated passage and reconstruct it collaboratively.',
    icon: '♪',
    status: 'coming-soon',
    skills: ['Listening', 'Comprehension', 'Speaking'],
    path: null,
    color: '#f6db96',
  },
  {
    id: 'grammar',
    label: 'Grammar Duel',
    description: 'Fast-paced competitive grammar correction with peer voting.',
    icon: '✦',
    status: 'coming-soon',
    skills: ['Grammar', 'Writing', 'Analysis'],
    path: null,
    color: '#f6db96',
  },
]

export default function ActivityMenu() {
  const navigate = useNavigate()

  async function handleSelect(activity) {
    if (activity.status !== 'ready') return
    const roomCode = generateRoomCode()
    await initRoom(roomCode)
    navigate(`${activity.path}?room=${roomCode}`)
  }

return (
  <div className={styles.root}>
    <div className={styles.orb1} />
    <div className={styles.orb2} />
    <div className={styles.pattern} />

    <div className={styles.layout}>

      {/* Left column: speech bubble top, Pacey bottom */}
      <div className={styles.leftCol}>
        <div className={styles.subtitleBubble}>
          <span>Choose an activity to begin</span>
          <div className={styles.subtitleTail} />
        </div>
        <div className={styles.mascotWrap}>
          <img src="/reclining.png" alt="Pacey" className={styles.mascot} />
        </div>
      </div>

      {/* Right: 2x2 activity grid */}
      <div className={styles.grid}>
        {ACTIVITIES.map((act, i) => (
          <button
            key={act.id}
            className={`${styles.card} ${act.status === 'ready' ? styles.cardReady : styles.cardSoon}`}
            onClick={() => handleSelect(act)}
            style={{ animationDelay: `${i * 0.08}s` }}
            disabled={act.status !== 'ready'}
          >
            <div
              className={styles.cardIcon}
              style={{
                background: act.status === 'ready' ? act.color : '#ccc',
                color: '#000',
              }}
            >
              {act.icon}
            </div>

            {act.status === 'coming-soon' && (
              <div className={styles.soonBadge}>Coming Soon</div>
            )}

            <h2 className={styles.cardTitle}>{act.label}</h2>
            <p className={styles.cardDesc}>{act.description}</p>

            <div className={styles.skills}>
              {act.skills.map(s => (
                <span key={s} className={styles.skill}>{s}</span>
              ))}
            </div>

            {act.status === 'ready' && (
              <div className={styles.launchRow}>
                <span>Launch</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

    </div>
  </div>
)
}