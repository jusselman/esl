import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initRoom, generateRoomCode } from '../store/gameStore'
import { STORY_CATEGORIES, getStoryByDuration } from '../data/storyBank'
import styles from './ListenRecallSetup.module.css'

const DURATION_OPTIONS = [
  { value: 30, label: '30 sec', complexity: 'short' },
  { value: 60, label: '1 min', complexity: 'standard' },
  { value: 120, label: '2 min', complexity: 'extended' },
]

// Fixed per the Kahoot-style format used across Grammar Duel, Synonyms,
// and Fill It In — not configurable by the teacher.
const SECONDS_PER_QUESTION = 10

export default function ListenRecallSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(null)
  const [launching, setLaunching] = useState(false)

  const selectedStory = selectedCategory && selectedDuration
    ? getStoryByDuration(selectedCategory, selectedDuration)
    : null

  const handleNext = () => {
    if (step === 1 && selectedCategory) setStep(2)
    else if (step === 2 && selectedDuration) setStep(3)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleLaunch = async () => {
    const story = selectedCategory && selectedDuration ? getStoryByDuration(selectedCategory, selectedDuration) : null
    if (!story || launching) return
    setLaunching(true)
    try {
      const roomCode = generateRoomCode()
      await initRoom(roomCode, {
        activity: 'listen-recall',
        activityState: {
          categoryId: selectedCategory.id,
          categoryTitle: selectedCategory.title,
          categoryEmoji: selectedCategory.emoji,
          storyId: story.id,
          storyTitle: story.title,
          storyText: story.text,
          durationSecs: story.duration,
          durationLabel: story.durationLabel,
          secondsPerQuestion: SECONDS_PER_QUESTION,
          questions: story.questions,
          currentQuestionIndex: -1,
          questionStartedAt: null,
          listeningStartedAt: null,
          status: 'lobby',
        },
      })
      navigate(`/listen-recall/host?room=${roomCode}`)
    } finally {
      setLaunching(false)
    }
  }

  return (
    <div className={styles.root}>
      <img src="/turtleReading.png" alt="Turtle" className={styles.turtleImage} />

      <div className={styles.container}>
        <h1>Listen & Recall Setup</h1>
        <p className={styles.subtitle}>
          {step === 1 && 'Step 1 of 3: Choose a category'}
          {step === 2 && 'Step 2 of 3: Choose a story length'}
          {step === 3 && 'Step 3 of 3: Review and launch'}
        </p>

        {/* STEP 1: Choose Category */}
        {step === 1 && (
          <div className={styles.themeGrid}>
            {STORY_CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={`${styles.themeBtn} ${selectedCategory?.id === category.id ? styles.themeBtn_active : ''}`}
                onClick={() => setSelectedCategory(category)}
                style={{ '--theme-color': category.color }}
              >
                <div className={styles.themeEmoji}>{category.emoji}</div>
                <div className={styles.themeTitle}>{category.title}</div>
                <div className={styles.themeDesc}>{category.description}</div>
                <div className={styles.themeCount}>{category.stories.length} stories available</div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: Story Length */}
        {step === 2 && selectedCategory && (
          <div className={styles.configSection}>
            <div className={styles.configGroup}>
              <div className={styles.configLabel}>Story length</div>
              <div className={styles.optionRow}>
                {DURATION_OPTIONS.map((opt) => {
                  const story = getStoryByDuration(selectedCategory, opt.value)
                  return (
                    <button
                      key={opt.value}
                      className={`${styles.optionBtn} ${selectedDuration === opt.value ? styles.optionBtn_active : ''}`}
                      onClick={() => setSelectedDuration(opt.value)}
                      disabled={!story}
                    >
                      <div className={styles.optionBtnLabel}>{opt.label}</div>
                      <div className={styles.optionBtnSub}>{story ? story.title : 'unavailable'}</div>
                    </button>
                  )
                })}
              </div>
              <p className={styles.configHint}>
                Students get 10 seconds per question once the story ends — same Kahoot-style format as Grammar Duel, Synonyms, and Fill It In.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Launch */}
        {step === 3 && selectedCategory && selectedStory && (
          <div className={styles.reviewCard}>
            <div className={styles.reviewSection}>
              <h3>Category</h3>
              <p>{selectedCategory.emoji} {selectedCategory.title}</p>
            </div>

            <div className={styles.reviewSection}>
              <h3>Story</h3>
              <p>{selectedStory.title} · {selectedStory.durationLabel}</p>
            </div>

            <div className={styles.reviewSection}>
              <h3>Format</h3>
              <p>Students listen on their own device, then answer {selectedStory.questions.length} multiple-choice questions, 10 seconds each, live with the whole class.</p>
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
                (step === 1 && !selectedCategory) ||
                (step === 2 && !selectedDuration)
              }
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              className={styles.launchBtn}
              onClick={handleLaunch}
              disabled={launching || !selectedStory}
            >
              {launching ? 'Launching…' : 'Launch Activity'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
