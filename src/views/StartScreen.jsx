import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { resetState } from '../store/gameStore'
import styles from './StartScreen.module.css'

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 3,
  dur: 6 + Math.random() * 10,
  delay: Math.random() * 8,
  opacity: 0.15 + Math.random() * 0.35,
}))

export default function StartScreen() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    resetState()
  }, [])

  function handleStart() {
    navigate('/menu')
  }

  return (
    <div className={styles.root}>
      {/* Ambient orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Floating particles */}
      <div className={styles.particles} aria-hidden="true">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Grid lines */}
      <div className={styles.grid} aria-hidden="true" />

      <main className={styles.main}>
        <div className={styles.badge}>ESL CLASSROOM TOOL</div>

        <h1 className={styles.title}>
          <span className={styles.titleLine1}>LINGUA</span>
          <span className={styles.titleLine2}>DEBATE</span>
        </h1>

        <p className={styles.tagline}>
          Spark real conversation. Build critical thinkers.
        </p>

        <button className={styles.startBtn} onClick={handleStart}>
          <span>Start Session</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className={styles.hint}>Press Start to choose an activity</div>
      </main>

      <footer className={styles.footer}>
        <span>Powered by AI</span>
        <span className={styles.dot} />
        <span>For Advanced ESL Learners</span>
      </footer>
    </div>
  )
}
