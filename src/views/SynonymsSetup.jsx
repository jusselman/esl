import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initRoom, generateRoomCode } from '../store/gameStore'
import { SYNONYM_TIERS, pickSynonymQuestions } from '../data/synonymWords'
import styles from './SynonymsSetup.module.css'

const QUESTION_COUNT_OPTIONS = [4, 6, 8]
const SECONDS_OPTIONS = [
  { value: 15, label: '15 sec', complexity: 'fast' },
  { value: 20, label: '20 sec', complexity: 'standard' },
  { value: 30, label: '30 sec', complexity: 'relaxed' },
]

export default function SynonymsSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedTier, setSelectedTier] = useState(null)
  const [numQuestions, setNumQuestions] = useState(null)
  const [secondsPerQuestion, setSecondsPerQuestion] = useState(20)
  const [launching, setLaunching] = useState(false)

  const maxQuestions = selectedTier?.questions.length || 0
  const questionOptions = QUESTION_COUNT_OPTIONS.filter(n => n <= maxQuestions)

  const handleTierSelect = (tier) => {
    setSelectedTier(tier)
    // Default to the largest preset that fits this tier's bank.
    const fitting = QUESTION_COUNT_OPTIONS.filter(n => n <= tier.questions.length)
    setNumQuestions(fitting.length ? fitting[fitting.length - 1] : tier.questions.length)
  }

  const handleNext = () => {
    if (step === 1 && selectedTier) setStep(2)
    else if (step === 2 && numQuestions) setStep(3)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleLaunch = async () => {
    if (!selectedTier || !numQuestions || launching) return
    setLaunching(true)
    try {
      const questions = pickSynonymQuestions(selectedTier, numQuestions)
      const roomCode = generateRoomCode()
      await initRoom(roomCode, {
        activity: 'synonyms',
        activityState: {
          tierId: selectedTier.id,
          tierTitle: selectedTier.title,
          tierEmoji: selectedTier.emoji,
          secondsPerQuestion,
          questions,
          currentQuestionIndex: -1,
          questionStartedAt: null,
          status: 'lobby',
        },
      })
      navigate(`/synonyms/host?room=${roomCode}`)
    } finally {
      setLaunching(false)
    }
  }

  return (
    <div className={styles.root}>
      <img src="/turtleReading.png" alt="Turtle" className={styles.turtleImage} />

      <div className={styles.container}>
        <h1>Synonyms Setup</h1>
        <p className={styles.subtitle}>
          {step === 1 && 'Step 1 of 3: Choose a difficulty tier'}
          {step === 2 && 'Step 2 of 3: Set the round length'}
          {step === 3 && 'Step 3 of 3: Review and launch'}
        </p>

        {/* STEP 1: Choose Tier */}
        {step === 1 && (
          <div className={styles.themeGrid}>
            {SYNONYM_TIERS.map((tier) => (
              <button
                key={tier.id}
                className={`${styles.themeBtn} ${selectedTier?.id === tier.id ? styles.themeBtn_active : ''}`}
                onClick={() => handleTierSelect(tier)}
                style={{ '--theme-color': tier.color }}
              >
                <div className={styles.themeEmoji}>{tier.emoji}</div>
                <div className={styles.themeTitle}>{tier.title}</div>
                <div className={styles.themeDesc}>{tier.description}</div>
                <div className={styles.themeCount}>{tier.questions.length} words available</div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: Round Length */}
        {step === 2 && (
          <div className={styles.configSection}>
            <div className={styles.configGroup}>
              <div className={styles.configLabel}>Number of words</div>
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
              <div className={styles.configLabel}>Seconds per word</div>
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
        {step === 3 && selectedTier && (
          <div className={styles.reviewCard}>
            <div className={styles.reviewSection}>
              <h3>Tier</h3>
              <p>{selectedTier.emoji} {selectedTier.title}</p>
            </div>

            <div className={styles.reviewSection}>
              <h3>Round Length</h3>
              <p>{numQuestions} words · {secondsPerQuestion} seconds each</p>
            </div>

            <div className={styles.reviewSection}>
              <h3>Format</h3>
              <p>Multiple choice — read the clue, pick the vocabulary word it describes, live with the whole class.</p>
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
                (step === 1 && !selectedTier) ||
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
