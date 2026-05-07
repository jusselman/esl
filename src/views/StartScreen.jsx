import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
      {/* <div className={styles.particles} aria-hidden="true">
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
      </div> */}

      {/* Subtle pattern overlay */}
      <div className={styles.pattern} aria-hidden="true" />

      <main className={styles.main}>
  {/* Left: Mascot */}
  <div className={styles.mascotWrap}>
    <img
      src="/turtle.png"
      alt="WisePace mascot"
      className={styles.mascot}
    />
  </div>

  {/* Right: Title + CTA */}
  <div className={styles.content}>

    <h1 className={styles.title}>
  <span className={styles.titleLine1}>
    PACE
    <span className={styles.sparkle} style={{ top: '-10px', right: '-18px', fontSize: '1.2rem' }}>✦</span>
  </span>
  <span className={styles.titleLine2}>
    WISE
    <span className={styles.sparkle} style={{ top: '-8px', left: '-20px', fontSize: '0.9rem', animationDelay: '0.4s' }}>✦</span>
  </span>
  </h1>

    <p className={styles.tagline}>
  <span className={styles.taglineChunk}>Spark real conversation.</span>
  <span className={styles.taglineChunk}>Build critical thinkers.</span>
</p>

<button className={styles.startBtn} onClick={handleStart}>
  <span>Start Session</span>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</button>

<div className={styles.speechBubble}>
  <span className={styles.speechText}>Tap start to pick an activity!</span>
  <div className={styles.speechTail} />
</div>
</div>
</main>

      <footer className={styles.footer}>
        <span>Powered by AI</span>
        <span className={styles.dot} />
        <span>For Advanced ESL Learners</span>
      </footer>
    </div>
  )
}