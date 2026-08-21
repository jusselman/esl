import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initRoom, generateRoomCode } from '../store/gameStore'
import { getRandomTopicByTimeLimit, getTopicsByTimeLimit } from './readingTopics'
import styles from './ReadingComprehensionSetup.module.css'

const TIME_OPTIONS = [
  { value: 1, label: '1 min', complexity: 'simple' },
  { value: 5, label: '5 min', complexity: 'intermediate' },
  { value: 10, label: '10 min', complexity: 'advanced' },
]

const TOPIC_SOURCES = [
  {
    id: 'select',
    title: 'Select from Bank',
    description: 'Choose a specific topic from the reading comprehension bank.',
  },
  {
    id: 'random',
    title: 'Random from Bank',
    description: 'Let the system pick a random topic matching your time selection.',
  },
  {
    id: 'custom',
    title: 'Create Custom',
    description: 'Write your own topic with custom perspectives.',
  },
]

export default function ReadingComprehensionSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [customTopic, setCustomTopic] = useState({
    title: '',
    perspectives: [{ name: '', title: '', viewpoint: '' }],
  })

  const availableTopics = selectedTime ? getTopicsByTimeLimit(selectedTime) : []

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleSourceSelect = (source) => {
    setSelectedSource(source)
  }

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic)
  }

  const handleNext = () => {
    if (step === 1 && selectedTime) {
      setStep(2)
    } else if (step === 2 && selectedSource) {
      if (selectedSource === 'random') {
        const randomTopic = getRandomTopicByTimeLimit(selectedTime)
        setSelectedTopic(randomTopic)
        setStep(3)
      } else {
        setStep(3)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      if (step === 3 && selectedSource === 'random') {
        setStep(2)
        setSelectedTopic(null)
      }
    }
  }

  const handleLaunch = async () => {
    const topicToUse = selectedSource === 'custom' ? customTopic : selectedTopic
    if (!topicToUse) return

    const roomCode = generateRoomCode()
    await initRoom(roomCode, {
      activity: 'reading-comprehension',
      topic: topicToUse,
      timeLimit: selectedTime,
    })

    navigate(`/host/reading-comprehension?room=${roomCode}`)
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <h1>Reading Comprehension Setup</h1>
        <p className={styles.subtitle}>
          {step === 1 && 'Step 1 of 3: Choose a time limit for your students'}
          {step === 2 && 'Step 2 of 3: Select where to get the topic'}
          {step === 3 && 'Step 3 of 3: Review and launch'}
        </p>

        {/* STEP 1: Select Time */}
        {step === 1 && (
          <div className={styles.timeGrid}>
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.timeBtn} ${selectedTime === opt.value ? styles.timeBtn_active : ''}`}
                onClick={() => handleTimeSelect(opt.value)}
              >
                <div className={styles.timeBtnLabel}>{opt.label}</div>
                <div className={styles.timeBtnComplexity}>{opt.complexity}</div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: Select Topic Source */}
        {step === 2 && (
          <div className={styles.sourceOptions}>
            {TOPIC_SOURCES.map((source) => (
              <button
                key={source.id}
                className={`${styles.sourceBtn} ${selectedSource === source.id ? styles.sourceBtn_active : ''}`}
                onClick={() => handleSourceSelect(source.id)}
              >
                <div className={styles.sourceBtnTitle}>{source.title}</div>
                <div className={styles.sourceBtnDesc}>{source.description}</div>
              </button>
            ))}
            {selectedSource === 'select' && (
              <div className={styles.topicList}>
                <label htmlFor="topicSelect">Choose a topic:</label>
                <select
                  id="topicSelect"
                  className={styles.select}
                  onChange={(e) => handleTopicSelect(
                    availableTopics.find(t => t.id === e.target.value)
                  )}
                  value={selectedTopic?.id || ''}
                >
                  <option value="">-- Select a topic --</option>
                  {availableTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Review & Launch */}
        {step === 3 && (
          <div className={styles.reviewCard}>
            <div className={styles.reviewSection}>
              <h3>Time Limit</h3>
              <p>{selectedTime} minute{selectedTime > 1 ? 's' : ''}</p>
            </div>

            <div className={styles.reviewSection}>
              <h3>Topic</h3>
              <p>{selectedTopic?.title || customTopic.title}</p>
            </div>

            <div className={styles.reviewSection}>
              <h3>Perspectives</h3>
              <ul className={styles.perspectivesList}>
                {(selectedTopic?.perspectives || customTopic.perspectives).map((p, i) => (
                  <li key={i}>{p.name} ({p.title})</li>
                ))}
              </ul>
              <p className={styles.perspectiveCount}>
                {(selectedTopic?.perspectives || customTopic.perspectives).length} perspectives
              </p>
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
                (step === 1 && !selectedTime) ||
                (step === 2 && !selectedSource) ||
                (step === 2 && selectedSource === 'select' && !selectedTopic)
              }
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              className={styles.launchBtn}
              onClick={handleLaunch}
              disabled={!selectedTopic && !customTopic.title}
            >
              Launch Activity
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
