import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './StoryTimeMenu.module.css'

const SUB_ACTIVITIES = [
  {
    id: 'listen-recall',
    label: 'Listen & Recall',
    description: 'Students listen to a short story, then answer four-choice comprehension questions before time runs out.',
    icon: '🎧',
    status: 'ready',
    skills: ['Listening', 'Comprehension', 'Recall'],
    path: '/host/listen-recall',
    color: '#5ec9b7',
  },
  {
    id: 'coming-soon-1',
    label: 'More Coming Soon',
    description: 'A second Story Time game is on the way.',
    icon: '✦',
    status: 'coming-soon',
    skills: ['Listening'],
    path: null,
    color: '#f6db96',
  },
  {
    id: 'coming-soon-2',
    label: 'More Coming Soon',
    description: 'A third Story Time game is on the way.',
    icon: '✦',
    status: 'coming-soon',
    skills: ['Listening'],
    path: null,
    color: '#f6db96',
  },
]

export default function StoryTimeMenu() {
  const navigate = useNavigate()

  function handleSelect(activity) {
    if (activity.status !== 'ready') return
    navigate(activity.path)
  }

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.pattern} />

      <div className={styles.layout}>
        <button className={styles.backButton} onClick={() => navigate('/menu')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7.5 3.5L3 8l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Activities</span>
        </button>

        <div className={styles.header}>
          <div className={styles.mascotWrap}>
            <img src="/reclining.png" alt="Pacey" className={styles.mascot} />
          </div>
          <div className={styles.subtitleBubble}>
            <span>Choose a Story Time game</span>
          </div>
        </div>

        <div className={styles.grid}>
          {SUB_ACTIVITIES.map((act, i) => (
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
