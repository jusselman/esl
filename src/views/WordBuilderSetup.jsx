import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initRoom, generateRoomCode } from '../store/gameStore'
import { WORD_BUILDER_THEMES, pickWords } from '../data/wordBuilderWords'
import styles from './WordBuilderSetup.module.css'

const TIME_LIMIT_OPTIONS = [
  { value: 180, label: '3 min', complexity: 'quick' },
  { value: 300, label: '5 min', complexity: 'standard' },
  { value: 480, label: '8 min', complexity: 'extended' },
]

export default function WordBuilderSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [timeLimitSecs, setTimeLimitSecs] = useState(300)
  const [launching, setLaunching] = useState(false)

  const handleNext = () => {
    if (step === 1 && selectedTheme) setStep(2)
    else if (step === 2 && timeLimitSecs) setStep(3)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleLaunch = async () => {
    if (!selectedTheme || !timeLimitSecs || launching) return
    setLaunching(true)
    try {
      const words = pickWords(selectedTheme, selectedTheme.words.length)
      const roomCode = generateRoomCode()
      await initRoom(roomCode, {
        activity: 'word-builder',
        activityState: {
          themeId: selectedTheme.id,
          themeTitle: selectedTheme.title,
          themeEmoji: selectedTheme.emoji,
          timeLimitSecs,
          words,
          startedAt: null,
          status: 'lobby',
        },
      })
      navigate(`/word-builder/host?room=${roomCode}`)
    } finally {
      setLaunching(false)
    }
  }

  return (
    <div className={styles.root}>
      <img src="/turtleReading.png" alt="Turtle" className={styles.turtleImage} />

      <div className={styles.container}>
        <h1>Word Builder Setup</h1>
        <p className={styles.subtitle}>
          {step === 1 && 'Step 1 of 3: Choose a theme'}
          {step === 2 && 'Step 2 of 3: Set the time limit'}
          {step === 3 && 'Step 3 of 3: Review and launch'}
        </p>

        {/* STEP 1: Choose Theme */}
        {step === 1 && (
          <div className={styles.themeGrid}>
            {WORD_BUILDER_THEMES.map((theme) => (
              <button
                key={theme.id}
                className={`${styles.themeBtn} ${selectedTheme?.id === theme.id ? styles.themeBtn_active : ''}`}
                onClick={() => setSelectedTheme(theme)}
                style={{ '--theme-color': theme.color }}
              >
                <div className={styles.themeEmoji}>{theme.emoji}</div>
                <div className={styles.themeTitle}>{theme.title}</div>
                <div className={styles.themeDesc}>{theme.description}</div>
                <div className={styles.themeCount}>{theme.words.length} words available</div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: Time Limit */}
        {step === 2 && (
          <div className={styles.configSection}>
            <div className={styles.configGroup}>
              <div className={styles.configLabel}>Time limit for the whole round</div>
              <div className={styles.optionRow}>
                {TIME_LIMIT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.optionBtn} ${timeLimitSecs === opt.value ? styles.optionBtn_active : ''}`}
                    onClick={() => setTimeLimitSecs(opt.value)}
                  >
                    <div className={styles.optionBtnLabel}>{opt.label}</div>
                    <div className={styles.optionBtnSub}>{opt.complexity}</div>
                  </button>
                ))}
              </div>
              <p className={styles.configHint}>
                Every student starts with 20 points and loses 1 per wrong letter guess —
                the round ends for a student when they run out of points or time, whichever
                comes first.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Launch */}
        {step === 3 && selectedTheme && (
          <div className={styles.reviewCard}>
            <div className={styles.reviewSection}>
              <h3>Theme</h3>
              <p>{selectedTheme.emoji} {selectedTheme.title}</p>
            </div>

            <div className={styles.reviewSection}>
              <h3>Time Limit</h3>
              <p>{TIME_LIMIT_OPTIONS.find(o => o.value === timeLimitSecs)?.label}</p>
            </div>

            <div className={styles.reviewSection}>
              <h3>Format</h3>
              <p>Self-paced word building — each student fills in letters against a 20-point budget, racing to complete the most words.</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className={styles.buttonRow}>
          {step > 1 && (
            <button className={styles.backBtn} onClick={handleBack}>
              Back
            </button>
          )}
          {step < 3 && (
            <button
              className={styles.nextBtn}
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedTheme) ||
                (step === 2 && !timeLimitSecs)
              }
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              className={styles.launchBtn}
              onClick={handleLaunch}
              disabled={launching}
            >
              {launching ? 'Launching…' : 'Launch Activity'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
