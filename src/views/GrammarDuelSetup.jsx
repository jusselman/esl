import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initRoom, generateRoomCode } from '../store/gameStore'
import { GRAMMAR_THEMES, pickQuestions } from '../data/grammarThemes'
import styles from './GrammarDuelSetup.module.css'

const QUESTION_COUNT_OPTIONS = [4, 6, 8]
const SECONDS_OPTIONS = [
  { value: 15, label: '15 sec', complexity: 'fast' },
  { value: 20, label: '20 sec', complexity: 'standard' },
  { value: 30, label: '30 sec', complexity: 'relaxed' },
]

export default function GrammarDuelSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [numQuestions, setNumQuestions] = useState(null)
  const [secondsPerQuestion, setSecondsPerQuestion] = useState(20)
  const [launching, setLaunching] = useState(false)

  const maxQuestions = selectedTheme?.questions.length || 0
  const questionOptions = QUESTION_COUNT_OPTIONS.filter(n => n <= maxQuestions)

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme)
    // Default to the largest preset that fits this theme's bank.
    const fitting = QUESTION_COUNT_OPTIONS.filter(n => n <= theme.questions.length)
    setNumQuestions(fitting.length ? fitting[fitting.length - 1] : theme.questions.length)
  }

  const handleNext = () => {
    if (step === 1 && selectedTheme) setStep(2)
    else if (step === 2 && numQuestions) setStep(3)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleLaunch = async () => {
    if (!selectedTheme || !numQuestions || launching) return
    setLaunching(true)
    try {
      const questions = pickQuestions(selectedTheme, numQuestions)
      const roomCode = generateRoomCode()
      await initRoom(roomCode, {
        activity: 'grammar-duel',
        activityState: {
          themeId: selectedTheme.id,
          themeTitle: selectedTheme.title,
          themeEmoji: selectedTheme.emoji,
          secondsPerQuestion,
          questions,
          currentQuestionIndex: -1,
          questionStartedAt: null,
          status: 'lobby',
        },
      })
      navigate(`/grammar-duel/host?room=${roomCode}`)
    } finally {
      setLaunching(false)
    }
  }

  return (
    <div className={styles.root}>
      <img src="/turtleReading.png" alt="Turtle" className={styles.turtleImage} />

      <div className={styles.container}>
        <h1>Grammar Duel Setup</h1>
        <p className={styles.subtitle}>
          {step === 1 && 'Step 1 of 3: Choose a theme'}
          {step === 2 && 'Step 2 of 3: Set the round length'}
          {step === 3 && 'Step 3 of 3: Review and launch'}
        </p>

        {/* STEP 1: Choose Theme */}
        {step === 1 && (
          <div className={styles.themeGrid}>
            {GRAMMAR_THEMES.map((theme) => (
              <button
                key={theme.id}
                className={`${styles.themeBtn} ${selectedTheme?.id === theme.id ? styles.themeBtn_active : ''}`}
                onClick={() => handleThemeSelect(theme)}
                style={{ '--theme-color': theme.color }}
              >
                <div className={styles.themeEmoji}>{theme.emoji}</div>
                <div className={styles.themeTitle}>{theme.title}</div>
                <div className={styles.themeDesc}>{theme.description}</div>
                <div className={styles.themeCount}>{theme.questions.length} questions available</div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: Round Length */}
        {step === 2 && (
          <div className={styles.configSection}>
            <div className={styles.configGroup}>
              <div className={styles.configLabel}>Number of questions</div>
              <div className={styles.optionRow}>
                {questionOptions.map((n) => (
                  <button
                    key={n}
                    className={`${styles.optionBtn} ${numQuestions === n ? styles.optionBtn_active : ''}`}
                    onClick={() => setNumQuestions(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.configGroup}>
              <div className={styles.configLabel}>Seconds per question</div>
              <div className={styles.optionRow}>
                {SECONDS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.optionBtn} ${secondsPerQuestion === opt.value ? styles.optionBtn_active : ''}`}
                    onClick={() => setSecondsPerQuestion(opt.value)}
                  >
                    <div className={styles.optionBtnLabel}>{opt.label}</div>
                    <div className={styles.optionBtnSub}>{opt.complexity}</div>
                  </button>
                ))}
              </div>
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
              <h3>Round Length</h3>
              <p>{numQuestions} questions · {secondsPerQuestion} seconds each</p>
            </div>

            <div className={styles.reviewSection}>
              <h3>Format</h3>
              <p>Multiple choice — pick the correct or incorrect sentence, live with the whole class.</p>
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
                (step === 2 && !numQuestions)
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
